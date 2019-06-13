import express from "express";
import { getRepository } from "typeorm";
import { User } from "../types/user";
import jwt from "jsonwebtoken";

let router = express.Router();

router.post("/sign-up",async (req, res) => {
    if(!req.body.user) { return res.status(400).json({ "error": "Missing user object" }); }
    if(!req.body.user.username) { return res.status(400).json({ "error": "Missing username field" }); }
    if(!req.body.user.email) { return res.status(400).json({ "error": "Missing email field" }); }
    if(!req.body.user.hash) { return res.status(400).json({ "error": "Missing password field" }); }

    let user = new User();
    user.username = req.body.user.username;
    user.email = req.body.user.email;
    user.hash = req.body.user.hash;

    let userRepo = getRepository(User);

    if(await userRepo.findOne({ where: { username: req.body.user.username }})) {
        return res.status(400).json({ "error": "Username name already exists" });
    }

    if(await userRepo.findOne({ where: { email: req.body.user.email }})) {
        return res.status(400).json({ "error": "Email name already exists" });
    }

    await userRepo.save(user);

    let payload = { user: { username: user.username, email: user.email } };
    let token = await jwt.sign(payload, process.env.JWT_KEY);
    res.status(200).json({ "token": token });
});

router.post("/sign-in",async (req, res) => {
    if(!req.body.user) { return res.status(400).json({ "error": "Missing user object" }); }
    if(!req.body.user.username) { return res.status(400).json({ "error": "Missing username field" }); }
    if(!req.body.user.hash) { return res.status(400).json({ "error": "Missing password field" }); }

    let userRepo = getRepository(User);

    let user = await userRepo.findOne(req.body.user.username);
    if(user && user.hash == req.body.user.hash) {
        let payload = { user: { username: user.username, email: user.email } };
        let token = await jwt.sign(payload, process.env.JWT_KEY);
        res.status(200).json({ "token": token });
    } else {
        res.status(403).json({ "error": "Bad credentials" });
    }
});

function requireToken(req, res, next) {
    let bHeader = req.header("Authorization");
    if(bHeader) {
        jwt.verify(bHeader.split(' ')[1], process.env.JWT_KEY, function(err, decoded) {
            if(err) {
                res.status(403).json({ "error": "Bad credentials" });
            } else {
                req.token = decoded.user;
                next();
            }
        });
    } else {
        res.status(403).json({ "error": "Bad credentials" });
    }
}

export { router, requireToken }