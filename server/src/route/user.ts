import express from "express";
import {getRepository, Like} from "typeorm";
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

let ppicFilter = (req, file, cb) => {
    if(!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) { return cb(new Error("Not a supported image type"), false); }
    cb(null, true);
};

let ppicUpload = multer({ storage: ppicStorage, fileFilter: ppicFilter });

router.post("/update-profile", requireToken, ppicUpload.single("ppic"), async (req, res) => {
    let userRepo = getRepository(User);

    let user = await userRepo.findOne(req["token"].username);

    if(req.body.hash) {
        if(req.body.oldHash == user.hash) {
            user.hash = req.body.hash;
        } else {
            if(req.file != undefined) {
                fs.unlinkSync(req.file.path);
            }
            return res.status(403).json({ error: "Bad Credentials" });
        }
    }

    if(req.file != undefined) {
        fs.renameSync(req.file.path, req.file.path.slice(0, -4));
        fs.writeFileSync(path.join(__dirname, "../../ppics/") + req["token"].username + ".meta", path.extname(req.file.originalname).slice(1));
    }
    if(req.body.email) { user.email = req.body.email; }
    if(req.body.fname) { user.fname = req.body.fname; }
    if(req.body.lname) { user.lname = req.body.lname; }


    await userRepo.save(user);
    res.sendStatus(200);
});

router.get("/ppic/:username", (req, res) => {
    let ppicPath = path.join(__dirname, "../../ppics/" + req.params.username + ".meta");
    if(fs.existsSync(ppicPath)) { ppicPath = ppicPath.slice(0, -5) + "." + fs.readFileSync(ppicPath); }
    else {
        ppicPath = path.join(__dirname, "../../ppics/default.png");
    }
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

router.get("/", async (req, res) => {
    let users = await getRepository(User).find({ select: ["username", "email", "fname", "lname"]});
    if(req.query.username) { users = users.filter(user => user.username.includes(req.query.username)); }
    res.status(200).json({ users: users });
});

export { router }