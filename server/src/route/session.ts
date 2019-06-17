import express from "express";
import {getRepository} from "typeorm";
import {io} from "../app";
import jwt from "jsonwebtoken";
import {requireToken} from "./auth";
import {Privacy, Session} from "../types/session";
import fs from "fs";
import path from "path";
import {Membership, Role} from "../types/membership";
import {User} from "../types/user";

let router = express.Router();

io.use((socket, next) => {
    if(socket.handshake.query && socket.handshake.query.token) {
        jwt.verify(socket.handshake.query.token, process.env.JWT_KEY, (err, decoded) => {
            if(err) return next(new Error('Authentication error'));
            socket["token"] = decoded;
            next();
        });
    } else { next(new Error()); }
});

io.on("connection", socket => {

    socket.on("disconnect", () => {

    });

});

router.get("/", requireToken, async (req, res) => {
    let sessionRepo = getRepository(Session);
    let sessions = await sessionRepo.find({ select: ["id", "sname", "description"], where: { hidden: false } });

    res.status(200).json({ sessions: sessions });
});

router.get("/joined", requireToken, async (req, res) => {
    let userRepo = getRepository(User);
    let user = await userRepo.findOne(req["token"].username, { relations: ["memberships", "memberships.session"] });
    let sessions = user.memberships.filter(mship => mship.role != Role.PENDING).map(mship => {
        return {
            id: mship.session.id,
            sname: mship.session.sname,
            description: mship.session.description
        }
    });
    res.status(200).json({ sessions: sessions });
});

router.post("/invite",  requireToken, async (req, res) => {
    let user = await getRepository(User).findOne(req.body.username);
    let session = await getRepository(Session).findOne(req.body.session, { relations: ["memberships, memberships.user, memberships.session"]});

    if(!user) { return res.status(400).json({ "error": "User doesn't exist"} ); }
    if(!session) { return res.status(400).json({ "error": "Session doesn't exist"} ); }

    if(session.memberships.filter(
        mship => (
            mship.role == Role.OWNER &&
            mship.user.username == req["token"].username) &&
            mship.session.id == req.body.session
    ).length != 0) {
        let membership = new Membership();
        membership.user = user;
        membership.session = session;
        membership.role = Role.PENDING;
        await getRepository(Membership).save(membership);

        res.sendStatus(200);
    } else {
        res.status(403).json({ "error": "You are not authorized for invitation"} );
    }
});

router.get("/join/:sessionId",  requireToken, async (req, res) => {

    let session = await getRepository(Session).findOne(req.params.sessionId, {relations: ["memberships", "memberships.user", "memberships.session"] });
    let membershipRepo = getRepository(Membership);
    let membership = null;

    switch (session.privacy) {
        case Privacy.PUBLIC:
        case Privacy.HIDDEN:
            membership = new Membership();
            membership.session = session;
            membership.user = req["token"].username;
            membership.role = Role.GHOST;
            await membershipRepo.save(membership);
            res.sendStatus(200);
            break;
        case Privacy.PRIVATE:
            membership = null;
            for(let i = 0; i < session.memberships.length; ++i) {
                if(session.memberships[i].user.username == req["token"].username) {
                    membership = session.memberships[i];
                    break;
                }
            }
            if(!membership) { res.status(403).json({ "error": "Not invited to this session" }); } else {
                if(membership.role == Role.PENDING) {
                    membership.role = Role.GHOST;
                    await membershipRepo.save(membership);
                }
                res.sendStatus(200);
            }
            break;
    }
});

router.post("/create-session", requireToken, async (req, res) => {
    if(!req.body.session) { return res.status(400).json({ "error": "Missing namespace object" }); }
    if(!req.body.session.sname) { return res.status(400).json({ "error": "Missing sname field" }); }
    let session = new Session(req.body.session.sname);

    if(req.body.session.privacy) { session.privacy = req.body.session.privacy; }
    if(req.body.session.description) { session.description = req.body.session.description; }

    let sessionRepo = getRepository(Session);
    session = await sessionRepo.save(session);

    let membershipRepo = getRepository(Membership);

    let membership = new Membership();
    membership.session = await sessionRepo.findOne(session.id);

    let userRepo = getRepository(User);
    membership.user = await userRepo.findOne(req["token"].username);

    membership.role = Role.OWNER;

    membership = await membershipRepo.save(membership);

    console.log(membership);

    createSession(session);
    fs.mkdirSync(path.join(__dirname, "../../sessions/" + session.id + "/data"), { recursive: true });

    res.status(200).json({ session: { id: session.id }});
});

let createSession = (session) => {
    let nsp = io.of(session.id);
    nsp.on("connection", socket => {
        socket.on("lol", () => {

        })

    })
};

export { router }