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
    filename: (req, file, cb) => { cb(null, req["token"].username + path.extname(file.originalname)); }
});

let ppicUpload = multer({ storage: ppicStorage });

router.post("/update-profile", requireToken, ppicUpload.single("ppic"), async (req, res) => {
    let userRepo = getRepository(User);

    let user = await userRepo.findOne(req["token"].username);

    if(req.body.email) { user.email = req.body.email; }
    if(req.body.hash) { user.email = req.body.hash; }

    await userRepo.save(user);

    res.sendStatus(200);
});

router.get("/ppic/:username", (req, res) => {
    let ppicPath = path.join(__dirname, "../../ppics/" + req.params.username + ".png");
    if(!fs.existsSync(ppicPath)) { ppicPath = path.join(__dirname, "../../ppics/default.png" );}
    res.sendFile(ppicPath);
});

export { router }