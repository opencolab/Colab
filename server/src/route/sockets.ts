import {io} from "../app";
import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";
import {getRepository} from "typeorm";
import {Membership, Role} from "../types/membership";
import {Task} from "../types/task";
import {Grade} from "../types/grade";
import {User} from "../types/user";
import {Session} from "../types/session";
import {getSessionOwner, writeTest} from "./session";

io.use(handleToken);
io.on("connection", socket => {
    console.log("default: " + socket["token"].user.username + " connected!");

    getRepository(User).findOne(socket["token"].user.username, { relations: ["memberships", "memberships.session", "memberships.user"] }).then(async user => {
            let sessions = user.memberships.filter(mship => mship.role === Role.PENDING && mship.role != null).map( (mship) => {
                return {
                    id: mship.session.id,
                    sname: mship.session.sname,
                    description: mship.session.description,
                    privacy: mship.session.privacy
                }
            });
            for(let i = 0; i < sessions.length; ++i) { sessions[i]["owner"] = await getSessionOwner(sessions[i]["id"]); }
            console.log("emiting invites to " + socket["token"].user.username);
            console.log(sessions);
            socket.emit("init-invites", sessions);
        }
    );

    socket.on("disconnect", () => {
        console.log("default: " + socket["token"].user.username + " disconnected!");
        socket.removeAllListeners();
    });
});

export function createNamespace(nspId: string) {
    if(!Object.keys(io.nsps).includes(nspId)) {
        let nsp = io.of(nspId);

        nsp.use(handleToken);
        nsp.on("connection", socket => {

            console.log(nsp.name + ": " + socket["token"].user.username + " connected!");

            //Bad Code ALERT!
            //The init connection stuff!
            //Get Role then on call back ake emits depending on role
            getRepository(Membership).findOne({ where: { session: nspId.substr(1), user: socket["token"].user.username }}
            ).then((mship) => {
                    socket["token"].user.role = mship.role;

                    //If Mod+ current-users are all users / user-joined to all
                    if(socket["token"].user.role == Role.OWNER || socket["token"].user.role == Role.MOD) {
                        console.log("current users");
                        console.log(Object.values(nsp.sockets).filter(skt => skt["token"].user.username != socket["token"].user.username).map(skt => skt["token"].user));
                        socket.emit("current-users", Object.values(nsp.sockets)
                                .filter(skt => skt["token"].user.username != socket["token"].user.username)
                                .map(skt => skt["token"].user), mship.role,
                            () => {
                                console.log("user joined " + socket["token"].user);
                                nsp.emit("user-joined", socket["token"].user);
                                socket.join("mods");
                            }
                        );
                    } else { //If User current-users are only mods / user-joined to mods only
                        console.log("current users");
                        console.log(Object.values(nsp.sockets).filter(skt => skt["token"].user.username != socket["token"].user.username && (skt["token"].user.role == Role.OWNER || skt["token"].user.role == Role.MOD)).map(skt => skt["token"].user));
                        socket.emit("current-users", Object.values(nsp.sockets)
                                .filter(skt => skt["token"].user.username != socket["token"].user.username && (skt["token"].user.role == Role.OWNER || skt["token"].user.role == Role.MOD))
                                .map(skt => skt["token"].user ), mship.role,
                            () => {
                                console.log("user joined " + socket["token"].user);
                                socket.emit("user-joined", socket["token"].user);
                                nsp.in("mods").emit("user-joined", socket["token"].user);
                            }
                        );
                    }

                    socket.emit("init-file", fs.readFileSync(path.join(__dirname, "../../sessions/" + nspId.slice(1) + "/data/" + socket["token"].user.username + "/main.cpp")).toString());
                    socket.join(socket["token"].user.username);
                    socket["token"].watching = socket["token"].user.username;
                    getRepository(Task).find({ where: { session: nspId.substr(1) }}).then(tasks => {
                            let tsks = [];
                            for(let i = 0; i < tasks.length; ++i) {
                                let example = JSON.parse(fs.readFileSync(path.join(__dirname, "../../sessions/" + nspId.substr(1) + "/tasks/task" + tasks[i].id + ".json"), { encoding: "utf8"})).cases[0];
                                tsks.push({
                                    taskId: tasks[i].id,
                                    name: tasks[i].name,
                                    description: tasks[i].description,
                                    inputs: example.inputs,
                                    outputs: example.outputs,
                                })
                            }
                            console.log(tsks);
                            socket.emit("init-tasks", tsks);
                        }
                    );
                }
            );

            socket.on("watch-user", user => {
                console.log(socket["token"].user.username + " watching " + user);
                socket.leave(socket["token"].watching);
                socket.join(user);
                socket["token"].watching = user;
                let data = fs.readFileSync(path.join(__dirname, "../../sessions/" + nspId.slice(1) + "/data/" + socket["token"].watching + "/main.cpp")).toString();
                socket.emit("init-file", data);
            });

            socket.on("view-task", (taskId, fn) => {
                getRepository(Task).findOne({ where: { session: nspId.substr(1), id: taskId}}).then(task => {
                        let example = JSON.parse(fs.readFileSync(path.join(__dirname, "../../sessions/" + nspId.substr(1) + "/tasks/task" + task.id + ".json"), { encoding: "utf8"})).cases[0];
                        fn({
                            taskId: task.id,
                            name: task.name,
                            description: task.description,
                            inputs: example.inputs,
                            outputs: example.outputs,
                        })
                    }
                );
            });

            socket.on("set-permission", async (user, role) => {
                if(socket["token"].user.role == Role.OWNER || socket["token"].user.role == Role.MOD) {
                    if(user != await getSessionOwner(nspId.substr(1))) {
                        let mship = await getRepository(Membership).findOne({ where: { session: nspId.substr(1), user: user }, relations: [ "session", "user" ]});
                        if(mship) {
                            console.log(socket["token"].user.username + " changing perm of " + user + " to " + role);
                            mship.role = role;
                            await getRepository(Membership).save(mship);
                            let sockets = Object.values(nsp.sockets);
                            for(let i = 0; i < sockets.length; ++i) {
                                if(sockets[i]["token"].user.username == user) {
                                    sockets[i]["token"].user.role = role;
                                }
                            }
                            for(let i = 0; i < sockets.length; ++i) {
                                if(sockets[i]["token"].user.role == Role.GHOST) {
                                    sockets[i].emit("current-users", Object.values(nsp.sockets)
                                        .filter(skt => skt["token"].user.username == sockets[i]["token"].user.username || (skt["token"].user.role == Role.OWNER || skt["token"].user.role == Role.MOD))
                                        .map(skt => skt["token"].user ), sockets[i]["token"].user.role, () => {});
                                } else if(sockets[i]["token"].user.role == Role.MOD || sockets[i]["token"].user.role == Role.OWNER) {
                                    sockets[i].emit("current-users", Object.values(nsp.sockets)
                                        .map(skt => skt["token"].user), sockets[i]["token"].user.role, () => {});
                                }
                            }
                        }
                    }
                }
            });

            socket.on("create-task", async tsk => {
                if(socket["token"].user.role == Role.OWNER || socket["token"].user.role == Role.MOD) {
                    let task = new Task();

                    let session = await getRepository(Session).findOne(nspId.substr(1), { relations: ["tasks"] });
                    task.id = session.tasks.length + 1;
                    task.name = tsk.name;
                    task.session = session;
                    task.description = tsk.description;
                    task.cases = tsk.cases.length;

                    for(let i = 0; i < tsk.cases.length; ++i) {
                        if(tsk.cases[i].weight) {
                            if(tsk.cases[i].weight != "") { tsk.cases[i].weight = parseInt(tsk.cases[i].weight); }
                            else {
                                delete tsk.cases[i].hint;
                            }
                        }

                    }

                    task.maxScore = 0;
                    for(let i = 0; i < tsk.cases.length; ++i) {
                        if(tsk.cases[i].weight) { task.maxScore += tsk.cases[i].weight; } else { task.maxScore += 1; }
                    }

                    task = await getRepository(Task).save(task);
                    writeTest(session.id, task.id, tsk.cases);
                    getRepository(Task).find({ where: { session: nspId.substr(1) }}).then(tasks => {
                            let tsks = [];
                            for(let i = 0; i < tasks.length; ++i) {
                                let example = JSON.parse(fs.readFileSync(path.join(__dirname, "../../sessions/" + nspId.substr(1) + "/tasks/task" + tasks[i].id + ".json"), { encoding: "utf8"})).cases[0];
                                tsks.push({
                                    taskId: tasks[i].id,
                                    name: tasks[i].name,
                                    description: tasks[i].description,
                                    inputs: example.inputs,
                                    outputs: example.outputs,
                                })
                            }
                            console.log(tsks);
                            nsp.emit("init-tasks", tsks);
                        }
                    );
                }
            });

            socket.on("invite", async (username, fn) => {
                if(socket["token"].user.role == Role.MOD || socket["token"].user.role == Role.OWNER) {
                    let membership = new Membership();

                    let user = await getRepository(User).findOne(username);
                    membership.user = user;

                    if(user) {
                        let session = await getRepository(Session).findOne(nspId.substr(1));
                        membership.session = session;

                        membership.role = Role.PENDING;
                        await getRepository(Membership).save(membership);

                        let sockets = Object.values(io.sockets.sockets).filter(skt => skt["token"].user.username == username);
                        for(let i = 0; i < sockets.length; ++i) {
                            sockets[i].emit("invited", { id: session.id, sname: session.sname, description: session.description, owner: await getSessionOwner(session.id) });
                        }
                        fn(true);
                    } else { fn(false); }
                } else { fn(false); }
            });

            socket.on("task-grades", (taskId, fn) => {
                getRepository(Grade).find({ where: { session: nspId.substr(1), task: taskId }, relations: ["user"]}).then(grades => {
                    fn(grades.map(grade => { return { username: grade.user.username, grade: ((grade.score / grade.max) * 100).toPrecision(2) }}))
                });
            });

            socket.on("update-file", data => {
                console.log(socket["token"].user.username + ":" + socket["token"].user.role + " updating file with " + data);
                if(socket["token"].watching == socket["token"].user.username || socket["token"].user.role == Role.OWNER || socket["token"].user.role == Role.MOD) {
                    fs.writeFileSync(path.join(__dirname, "../../sessions/" + nspId.slice(1) + "/data/" + socket["token"].watching + "/main.cpp"), data);
                    socket.broadcast.to(socket["token"].watching).emit("init-file", data);
                }
            });

            socket.on("disconnect", () => {
                console.log(nsp.name + ": " + socket["token"].user.username + " disconnected!");
                socket.removeAllListeners();
                if(socket["token"].user.role == Role.OWNER || socket["token"].user.role == Role.MOD) {
                    nsp.emit("user-left", socket["token"].user);
                } else {
                    nsp.in("mods").emit("user-left", socket["token"].user);
                }
            });

        })
    }
}

function handleToken(socket, next) {
    if(socket.handshake.query && socket.handshake.query.token) {
        jwt.verify(socket.handshake.query.token, process.env.JWT_KEY, (err, decoded) => {
            if(err) return next(new Error('Authentication error'));
            socket["token"] = decoded;
            next();
        });
    } else { next(new Error()); }
}