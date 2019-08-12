import express from "express";
import {getRepository} from "typeorm";
import {requireToken} from "./auth";
import {Privacy, Session} from "../types/session";
import fs from "fs";
import path from "path";
import {Membership, Role} from "../types/membership";
import {User} from "../types/user";
import {Task} from "../types/task";
import {Grade} from "../types/grade";
import {createNamespace} from "./sockets";
import multer from "multer";

let router = express.Router();

router.get("/", async (req, res) => {
    let sessionRepo = getRepository(Session);
    let sessions = await sessionRepo.find({ select: ["id", "sname", "description"], where: { privacy: Privacy.PUBLIC } });

    if(req.query.sname) { sessions = sessions.filter(session => session.sname.includes(req.query.sname)); }

    for(let i = 0; i < sessions.length; ++i) { sessions[i]["owner"] = await getSessionOwner(sessions[i]["id"]); }
    res.status(200).json({ sessions: sessions });
});

router.get("/joined", requireToken, async (req, res) => {
    let userRepo = getRepository(User);
    let user = await userRepo.findOne(req["token"].username, { relations: ["memberships", "memberships.session"] });
    let sessions = user.memberships.filter(mship => mship.role !== Role.PENDING && mship.role != null).map(mship => {
        return {
            id: mship.session.id,
            sname: mship.session.sname,
            description: mship.session.description,
            role: mship.role,
            privacy: mship.session.privacy
        }
    });
    for(let i = 0; i < sessions.length; ++i) { sessions[i]["owner"] = await getSessionOwner(sessions[i]["id"]); }
    res.status(200).json({ sessions: sessions });
});

router.get("/invited", requireToken, async (req, res) => {
    let userRepo = getRepository(User);
    let user = await userRepo.findOne(req["token"].username, { relations: ["memberships", "memberships.session", "memberships.user"] });
    let sessions = user.memberships.filter(mship => mship.role === Role.PENDING && mship.role != null).map(async (mship) => {
        return {
            id: mship.session.id,
            sname: mship.session.sname,
            description: mship.session.description,
            privacy: mship.session.privacy
        }
    });
    for(let i = 0; i < sessions.length; ++i) { sessions[i]["owner"] = await getSessionOwner(sessions[i]["id"]); }
    res.status(200).json({ sessions: sessions });
});

router.get("/join/:sessionId",  requireToken, async (req, res) => {
    console.log("join service called by " + req["token"].username);
    let session = await getRepository(Session).findOne(req.params.sessionId, {relations: ["memberships", "memberships.user", "memberships.session"] });
    let membershipRepo = getRepository(Membership);
    let mshipi = -1;

    if(!session) { return res.status(400).json({ "error": "Session doesn't exist"}); }

    for(let i = 0; i < session.memberships.length; ++i) {
        if(session.memberships[i].user.username == req["token"].username) {
            mshipi = i;
            break;
        }
    }

    console.log("membership found? " + mshipi);

    switch (session.privacy) {
        case Privacy.PUBLIC:
        case Privacy.HIDDEN:
            if(mshipi == -1) {
                let membership = new Membership();
                membership.session = session;
                membership.user = req["token"].username;
                membership.role = Role.GHOST;
                await membershipRepo.save(membership);
                createUserFiles(session.id, req["token"].username);
            } else {
                if(session.memberships[mshipi].role == Role.PENDING) {
                    session.memberships[mshipi].role = Role.GHOST;
                    await getRepository(Session).save(session);
                    await getRepository(Membership).save(session.memberships[mshipi]);
                    createUserFiles(session.id, req["token"].username);
                }
            }
            console.log("public: sending status to " + req["token"].username);
            break;
        case Privacy.PRIVATE:
            if(mshipi == -1) { return res.status(403).json({ "error": "Not invited to this session" }); }
            else {
                if(session.memberships[mshipi].role == Role.PENDING) {
                    session.memberships[mshipi].role = Role.GHOST;
                    await getRepository(Session).save(session);
                    await getRepository(Membership).save(session.memberships[mshipi]);
                    createUserFiles(session.id, req["token"].username);
                }
            }
            console.log("private: sending status to " + req["token"].username);
            break;
    }
    createNamespace("/" + session.id);
    return res.sendStatus(200);
});

let spicStorage = multer.diskStorage({
    destination: (req, file, cb) => { cb(null, path.join(__dirname, "../../spics/")); },
    filename: (req, file, cb) => { cb(null, req["token"].username + path.extname(file.originalname)); }
});

let spicFilter = (req, file, cb) => {
    if(!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) { return cb(new Error("Not a supported image type"), false); }
    cb(null, true);
};

let spicUpload = multer({ storage: spicStorage, fileFilter: spicFilter });

router.post("/create-session", requireToken, spicUpload.single("spic"), async (req, res) => {
    if(!req.body.sname) { return res.status(400).json({ "error": "Missing sname field" }); }
    let session = new Session(req.body.sname);

    if(req.body.privacy) { session.privacy = req.body.privacy; }
    if(req.body.description) { session.description = req.body.description; }

    let sessionRepo = getRepository(Session);
    session = await sessionRepo.save(session);

    console.log(req.file);

    if(req.file != undefined) {
        console.log("I got the img");
        fs.writeFileSync(path.join(__dirname, "../../spics/") + session.id + ".meta", path.extname(req.file.originalname).slice(1));
        let ext = path.extname(req.file.originalname);
        fs.renameSync(req.file.path, path.join(__dirname, "../../spics/" + session.id + ext));
    }

    let membershipRepo = getRepository(Membership);

    let membership = new Membership();
    membership.session = await sessionRepo.findOne(session.id);

    let userRepo = getRepository(User);
    membership.user = await userRepo.findOne(req["token"].username);

    membership.role = Role.OWNER;

    await membershipRepo.save(membership);

    fs.mkdirSync(path.join(__dirname, "../../sessions/" + session.id + "/data"), { recursive: true });
    createUserFiles(session.id, req["token"].username);

    res.status(200).json({ session: { id: session.id }});
});

router.get("/spic/:sessionId", (req, res) => {
    let ppicPath = path.join(__dirname, "../../spics/" + req.params.sessionId + ".meta");
    if(fs.existsSync(ppicPath)) { ppicPath = ppicPath.slice(0, -5) + "." + fs.readFileSync(ppicPath); }
    else {
        ppicPath = path.join(__dirname, "../../spics/default.jpg");
    }
    res.sendFile(ppicPath);
});


router.post("/create-task", requireToken, async (req, res) => {
    if(!req.body.sessionId) { return res.status(400).json({ "error": "Missing sessionId field" }); }
    if(!req.body.task) { return res.status(400).json({ "error": "Missing task object" }); }
    if(!req.body.task.cases) { return res.status(400).json({ "error": "Missing cases array in task object" }); }

    let session = await getRepository(Session).findOne(req.params.sessionId, {relations: ["tasks", "memberships", "memberships.user", "memberships.session"] });

    if(!session) { return res.status(400).json({ "error": "Session doesn't exist"}) }

    let membership = null;
    for(let i = 0; i < session.memberships.length; ++i) {
        if(session.memberships[i].user.username == req["token"].username && session.memberships[i].role == Role.OWNER) {
            membership = session.memberships[i];
            break;
        }
    }

    if(!membership) { return res.status(403).json({ "error": "You are not authorized to add tasks to this session"}); }

    let task = new Task();
    task.session = session;
    task.id = session.tasks.length + 1;
    task.cases = req.body.task.cases.length;
    if(req.body.task.name) { task.name = req.body.task.name; }
    if(req.body.task.description) { task.name = req.body.task.description; }
    task.maxScore = 0;
    for(let i = 0; i < req.body.task.cases; ++i) {
        if(req.body.task.cases[i].weight) { task.maxScore += req.body.task.cases[i].weight; } else { task.maxScore += 1; }
    }

    task = await getRepository(Task).save(task);
    writeTest(session.id, task.id, req.body.task.cases);
    res.sendStatus(200);
});

router.post("/:sessionId/set-permission",  requireToken, async (req, res) => {
    let session = await getRepository(Session).findOne(req.body.sessionId, {relations: ["memberships", "memberships.user", "memberships.session"] });
    let user = await getRepository(User).findOne(req.body.username);

    if(!session) { return res.status(400).json({ "error": "Session doesn't exist"}); }
    if(!user) { return res.status(400).json({ "error": "User doesn't exist"}); }
    if(!req.body.role) { return res.status(400).json({ "error": "Missing role field"}); }
    if(await getSessionOwner(session) != req["token"].username) { return res.status(403).json({ "error": "You aren't allowed to set permissions" }); }
    if(await getSessionOwner(session) != user.username) { return res.status(403).json({ "error": "You aren't allowed to change your permissions" }); }

    let membership = new Membership();
    membership.session = session;
    membership.user = user;
    membership.role = req.body.role;
    await getRepository(Membership).save(membership);

    res.sendStatus(200);
});

router.get("/:sessionId/grades",  requireToken, async (req, res) => {
    let session = await getRepository(Session).findOne(req.params.sessionId, {relations: ["memberships", "memberships.user", "memberships.session"] });
    let gradesRepo = getRepository(Grade);

    if(!session) { return res.status(400).json({ "error": "Session doesn't exist"}); }

    let findOptions = { where: {}, relations: ["user", "task"] };
    if(req.query.username) { findOptions.where["user"] = req.query.username; }
    if(req.query.task) { findOptions.where["task"] = req.query.task; }

    let grades = (await gradesRepo.find(findOptions)).map(grade => {
        return {
            user: grade.user.username,
            task: grade.task,
            score: grade.score,
            max: grade.max
        }
    });

    res.status(200).json({ grades: grades });
});

router.post("/:sessionId/remove", requireToken, async (req, res) => {

    let session = await getRepository(Session).findOne(req.params.sessionId, { relations: ["memberships", "memberships.user", "memberships.session"] });
    if(await getSessionOwner(session) != req["token"].username) { return res.status(403).json({ "error": "You aren't allowed to set permissions"}); }

    if(!req.body.username) { res.status(400).json({ "error": "Missing username field" } ); }

    let membership = await getRepository(Membership).findOne({where: { session: session, user: req["token"].username }});
    if(membership) {
        await getRepository(Membership).delete(membership);
    }

    res.sendStatus(200);
});

router.get("/leave/:sessionId", requireToken, async (req, res) => {
    let session = await getRepository(Session).findOne(req.params.sessionId, { relations: ["memberships", "memberships.user", "memberships.session"] });

    if(await getSessionOwner(session) == req["token"].username) { return res.status(403).json({ "error": "YA ZFT!"}); }

    let membership = await getRepository(Membership).findOne({where: { session: session, user: req["token"].username }});
    if(membership) {
        await getRepository(Membership).delete(membership);
    }

    res.sendStatus(200);
});

router.delete("/:sessionId/", requireToken, async (req, res) => {
    let session = await getRepository(Session).findOne(req.params.sessionId, { relations: ["memberships", "memberships.user"] });
    if(await getSessionOwner(session) != req["token"].username) { return res.status(403).json({ "error": "You aren't allowed to set permissions"}); }
    await getRepository(Session).delete(session);

    res.sendStatus(200);
});

router.get("/:sessionId/members",async (req, res) => {
    let memberships = (await getRepository(Session).findOne(req.params.sessionId, { relations: ["memberships", "memberships.user"] })).memberships;
    let users = memberships.map(mship => mship.user.username);

    res.status(200).json(users);
});

export async function getSessionOwner(sessionId) {
    let session = await getRepository(Session).findOne(sessionId, { relations: ["memberships", "memberships.user"] });
    return session.memberships.filter(mship => mship.role === Role.OWNER)[0].user.username;
}

function createUserFiles(sessionId: string, username: string) {
    if(!fs.existsSync(path.join(__dirname, "../../sessions/" + sessionId + "/data/" + username))) {
        fs.mkdirSync(path.join(__dirname, "../../sessions/" + sessionId + "/data/" + username), { recursive: true });
        fs.writeFileSync(path.join(__dirname, "../../sessions/" + sessionId + "/data/" + username + "/main.cpp"), "");
        fs.writeFileSync(path.join(__dirname, "../../sessions/" + sessionId + "/data/" + username + "/compile_commands.json"), JSON.stringify([
            {
                directory: path.join(__dirname, "../../sessions/" + sessionId + "/data/" + username),
                command: "clang++ --target=x86_64-w64-mingw32 -o main.exe main.cpp",
                file: "main.cpp"
            }
        ], null, 4))
    }
}

export function writeTest(sessionId: string, taskId: number, cases) {
    fs.mkdirSync(path.join(__dirname, "../../sessions/" + sessionId + "/tasks"), { recursive: true });
    fs.writeFileSync(path.join(__dirname, "../../sessions/" + sessionId + "/tasks/task" + taskId + ".json"), JSON.stringify({
        cases: cases
    }, null, 4));
}

export { router }