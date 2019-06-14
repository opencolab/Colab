import express from "express";
import { Session } from "../types/session";
import { io } from "../app";
import { requireToken } from "./auth";

let router = express.Router();

let sessions: { [name: string]: Session } = {};

router.post("/session/:sname", requireToken, (req, res) => {
    res.send({ exists: ("/" + req.params.sname) in sessions });
});

router.post("/create-session/:sname", requireToken, (req, res) => {
    let sname = req.params.sname;
    if(("/" + sname) in io.nsps) { return res.status(200).json({ exists : true }); }
    res.status(200).json({ exists : true });

    let session = io.of(sname);
    sessions["/" + sname] = new Session(sname);
    session.on("connection", socket => {

        socket.on("disconnect", () => {
            let sessioner = sessions[session.name].remove(socket.id);
            if(sessions[session.name].sesssioneers.length == 0) {
                session.removeAllListeners();
                delete sessions[session.name];
                delete io.nsps[session.name];
            } else {
                session.emit("user-left", sessioner.username)
            }
        });

    })

});

export { router }