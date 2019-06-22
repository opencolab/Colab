import {io} from "../app";
import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";
import {getRepository} from "typeorm";
import {Membership, Role} from "../types/membership";
import {Task} from "../types/task";
import {Grade} from "../types/grade";

io.use(handleToken);
io.on("connection", socket => {
    console.log("default: " + socket["token"].user.username + " connected!");

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
                        socket.emit("current-users", Object.values(nsp.sockets)
                                .filter(skt => skt["token"].user.username != socket["token"].user.username)
                                .map(skt => skt["token"].user), mship.role,
                            () => {
                                nsp.emit("user-joined", socket["token"].user);
                                socket.join("mods");
                            }
                        );
                    } else { //If User current-users are only mods / user-joined to mods only
                        socket.emit("current-users", Object.values(nsp.sockets)
                                .filter(skt => skt["token"].user.username != socket["token"].user.username && (skt["token"].user.role == Role.OWNER || skt["token"].user.role == Role.MOD))
                                .map(skt => skt["token"].user ), mship.role,
                            () => {
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
                                    taskId: tasks[0].id,
                                    description: tasks[0].description,
                                    inputs: example.inputs,
                                    outputs: example.outputs,
                                })
                            }
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
                            description: task.description,
                            inputs: example.inputs,
                            outputs: example.outputs,
                        })
                    }
                );
            });

            socket.on("task-grades", (taskId, fn) => {
                getRepository(Grade).find({ where: { session: nspId.substr(1), task: taskId }, relations: ["user"]}).then(grades => {
                    fn(grades.map(grade => { return { user: grade.user, grade: (grade.score / grade.max).toPrecision(2) }}))
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