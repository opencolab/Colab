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
    if(!req.body.username) { return res.status(400).json({ "error": "Missing username field" }); }
    if(!req.body.taskId) { return res.status(400).json({ "error": "Missing taskId field" }); }

    let session = await getRepository(Session).findOne(req.body.sessionId);
    let user = await getRepository(User).findOne(req.body.username);
    let task = await getRepository(Task).findOne({ session: req.body.sessionId, id: req.body.taskId});

    if(!session) { return res.status(400).json({ "error": "Session does not exist" }); }
    if(!user) { return res.status(400).json({ "error": "User does not exist" }); }
    if(!task) { return res.status(400).json({ "error": "Task does not exist" }); }

    let sessionPath = path.join(__dirname, "../../sessions/" + session.id);
    let dataPath = path.join(sessionPath, "data/" + user.username);
    let taskPath = path.join(sessionPath, "tasks/task" + task.id + ".json");

    let cases = JSON.parse(fs.readFileSync(taskPath, { encoding: "utf8"})).cases;

    let compileCmd = JSON.parse(fs.readFileSync(path.join(dataPath, "/compile_commands.json"), { encoding: "utf8"}))[0].command.replace("-c", "");

    cp.execSync(compileCmd, { cwd: dataPath });

    let correct = 0;
    let wrong = 0;

    for(let i = 0; i < cases.length; ++i) {
        let bfr = "";
        let pr = cpp.spawn("./main.exe", [], { cwd: dataPath });

        pr.childProcess.stdout.setEncoding("utf-8");
        pr.childProcess.stdout.on("data", data => { bfr += data; });

        for(let j = 0; j < cases[i].inputs.length; ++j) { pr.childProcess.stdin.write(cases[i].inputs[j] + "\r\n"); }
        pr.childProcess.stdin.end();

        await pr;

        let outputs = bfr.replace("\n", "").split("\r");
        if(outputs[outputs.length - 1] === "") { outputs.pop(); }
        if(JSON.stringify(outputs) === JSON.stringify(cases[i].outputs)) {
            correct++;
        } else {
            wrong++;
        }
        bfr = "";
    }

    let grade = new Grade();
    grade.session = session;
    grade.task = task;
    grade.user = user;
    grade.correct = correct;
    grade.wrong = wrong;

    await getRepository(Grade).save(grade);

    res.status(200).json({
        correct: correct,
        wrong: wrong
    });

});

export { router }