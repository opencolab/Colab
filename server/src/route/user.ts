import express from "express";
import { getRepository } from "typeorm";
import { User } from "../types/user";
import path from "path";
import fs from "fs";
import multer from "multer";
import { requireToken } from "./auth";

let router = express.Router();

let ppicStorage = multer.diskStorage({
    destination: (req, file, cb) => { cb(null, path.join(__dirname, "../../ppics/")); },
    filename: (req, file, cb) => { cb(null, req["token"].username + path.extname(file.originalname) + ".tmp"); }
});

let ppicUpload = multer({ storage: ppicStorage });

router.post("/update-profile", requireToken, ppicUpload.single("ppic"), async (req, res) => {
    let userRepo = getRepository(User);

    let user = await userRepo.findOne(req["token"].username);

    if(req.body.oldHash == user.hash) {
        fs.renameSync(req.file.path, req.file.path.slice(0, -4));

        if(req.body.email) { user.email = req.body.email; }
        if(req.body.fname) { user.fname = req.body.fname; }
        if(req.body.lname) { user.lname = req.body.lname; }
        if(req.body.hash) { user.hash = req.body.hash; }

        await userRepo.save(user);

        res.sendStatus(200);
    } else {
        fs.unlinkSync(req.file.path);
        res.sendStatus(403);
    }
});

router.get("/ppic/:username", (req, res) => {
    let ppicPath = path.join(__dirname, "../../ppics/" + req.params.username + ".png");
    if(!fs.existsSync(ppicPath)) { ppicPath = path.join(__dirname, "../../ppics/default.png" );}
    res.sendFile(ppicPath);
});

router.get("/profile/:username", async (req, res) => {
    let userRepo = getRepository(User);

    let user = await userRepo.findOne(req.params.username, { select: ["username", "email", "fname", "lname"] });
    if(user) {
        res.status(200).json({ user: user })
    } else {
        res.status(404).json({error: "User does not exist"})
    }
});

export { router }