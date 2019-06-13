import express from "express";
import { getRepository } from "typeorm";
import { User } from "../types/user";
import path from "path";
import fs from "fs";

let router = express.Router();

router.get("/ppic/:username", (req, res) => {
    let ppicPath = path.join(__dirname, "../../ppics/" + req.params.username + ".png");
    if(!fs.existsSync(ppicPath)) { ppicPath = path.join(__dirname, "../../ppics/default.png" );}
    res.sendFile(ppicPath);
});

export { router }