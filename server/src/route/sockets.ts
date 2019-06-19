import { io } from "../app";
import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";

io.use(handleToken);
io.on("connection", socket => {

    socket.on("disconnect", () => {

    });

});

export function createNamespace(nspId: string) {
    if(!Object.keys(io.nsps).includes(nspId)) {
        let nsp = io.of(nspId);

        nsp.use(handleToken);
        nsp.on("connection", socket => {

            console.log(socket["token"].user.username + " connected!");
            emitCurrentUsers(nsp, socket);

            socket.on("save-file", (data, fn) => {
                fs.writeFileSync(path.join(__dirname, "../../sessions/" + nspId.slice(1) + "/data/" + socket["token"].user.username + "/main.cpp"), data);
                fn(true);
            });

            socket.on("disconnect", () => {
                socket.removeAllListeners();
                nsp.emit("user-left", socket["token"].user.username);
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

function emitCurrentUsers(nsp, socket) {
    socket.emit("current-users", Object.values(nsp.sockets).map(skt => skt["token"].user.username));
}