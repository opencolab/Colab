import express from "express";
import { getRepository } from "typeorm";
import { requireToken } from "./auth";
import * as cp from "child_process";
import { Session } from "../types/session";
import { User } from "../types/user";
import { Task } from "../types/task";
import path from "path";
import * as fs from "fs";
import * as cpp from "child-process-promise";
import { Grade } from "../types/grade";

let router = express.Router();

router.post("/run-task", requireToken, async (req, res) => {

    if(!req.body.sessionId) { return res.status(400).json({ "error": "Missing sessionId field" }); }
    if(!req.body.taskId) { return res.status(400).json({ "error": "Missing taskId field" }); }

    let session = await getRepository(Session).findOne(req.body.sessionId);
    let user = await getRepository(User).findOne(req["token"].username);
    let task = await getRepository(Task).findOne({ session: req.body.sessionId, id: req.body.taskId});

    if(!session) { return res.status(400).json({ "error": "Session does not exist" }); }
    if(!user) { return res.status(400).json({ "error": "User does not exist" }); }
    if(!task) { return res.status(400).json({ "error": "Task does not exist" }); }

    let sessionPath = path.join(__dirname, "../../sessions/" + session.id);
    let dataPath = path.join(sessionPath, "data/" + user.username);
    let taskPath = path.join(sessionPath, "tasks/task" + task.id + ".json");

    let result = { score: 0.0, msgs: [] };

    let taskJson = JSON.parse(fs.readFileSync(taskPath, { encoding: "utf8"}));

    let cmpResult = compile(dataPath);

    let max = 0;
    for(let i = 0; i < taskJson.cases.length; ++i) { if(taskJson.cases[i].weight) { max += taskJson.cases[i].weight; } else { max++; } }

    if(cmpResult["success"]) {
        for(let i = 0; i < taskJson.cases.length; ++i) {
            let bfr = "";
            try {
                let pr = cpp.spawn("./main.exe", [], { cwd: dataPath });

                pr.childProcess.stdout.setEncoding("utf-8");
                pr.childProcess.stdout.on("data", data => { bfr += data; });

                for(let j = 0; j < taskJson.cases[i].inputs.length; ++j) { pr.childProcess.stdin.write(taskJson.cases[i].inputs[j] + "\r\n"); }
                pr.childProcess.stdin.end();

                await pr;

                let outputs = bfr.replace("\n", "").split("\r");
                if(outputs[outputs.length - 1] === "") { outputs.pop(); }
                if(JSON.stringify(outputs) === JSON.stringify(taskJson.cases[i].outputs)) {
                    if(taskJson.cases[i].weight) { result.score += taskJson.cases[i].weight; } else { result.score++; }
                } else {
                    if(taskJson.cases[i].hint) { result.msgs.push("Hint for Case #" + i + ": " + taskJson.cases[i].hint) }
                }
            } catch(e) {
                result.msgs.push("Runtime Error for Case #" + i);
            }
            bfr = "";
        }
    } else {
        result.msgs.push(cmpResult["error"]);
    }

    let grade = new Grade();
    grade.session = session;
    grade.task = task;
    grade.user = user;
    grade.score = result.score;
    grade.max = max;

    await getRepository(Grade).save(grade);

    console.log({ taskId: req.body.taskId, score: ((result.score/max) * 100.0), msgs: result.msgs });

    res.status(200).json({ taskId: req.body.taskId, score: ((result.score/max) * 100.0), msgs: result.msgs });
});

router.post("/run", requireToken, async (req, res) => {

    if(!req.body.sessionId) { return res.status(400).json({ "error": "Missing sessionId field" }); }
    if(!req.body.inputs) { return res.status(400).json({ "error": "Missing inputs array" }); }

    let session = await getRepository(Session).findOne(req.body.sessionId);
    let user = await getRepository(User).findOne(req["token"].username);

    if(!session) { return res.status(400).json({ "error": "Session does not exist" }); }
    if(!user) { return res.status(400).json({ "error": "User does not exist" }); }

    let sessionPath = path.join(__dirname, "../../sessions/" + session.id);
    let dataPath = path.join(sessionPath, "data/" + user.username);

    let cmpResult = compile(dataPath);

    if(cmpResult["success"]) {
        try {
            let bfr = "";
            let pr = cpp.spawn("./main.exe", [], { cwd: dataPath });

            pr.childProcess.stdout.setEncoding("utf-8");
            pr.childProcess.stdout.on("data", data => { bfr += data; });

            for(let i = 0; i < req.body.inputs.length; ++i) { pr.childProcess.stdin.write(req.body.inputs[i] + "\r\n"); }
            pr.childProcess.stdin.end();

            await pr;

            let outputs = bfr.replace("\n", "").split("\r");
            if(outputs[outputs.length - 1] === "") { outputs.pop(); }

            res.status(200).json({ success: true, outputs: outputs });
        } catch (e) {
            res.status(200).json({ success: false, error: e.message });
        }

    } else {
        res.status(200).json({ success: false, error: cmpResult["error"] });
    }
});

function compile(dataPath) {
    let result = { success: true };

    let compileCmd = JSON.parse(fs.readFileSync(path.join(dataPath, "/compile_commands.json"), { encoding: "utf8"}))[0].command.replace("-c", "");
    try { cp.execSync(compileCmd, { cwd: dataPath } );
    } catch (e) {
        result.success = false;
        result["error"] = e.message;
    }
    return result;
}

export { router }