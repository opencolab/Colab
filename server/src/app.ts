import "reflect-metadata";
import { createConnection } from "typeorm";

import { User } from "./types/user";

import express from "express";
import bodyParser from "body-parser";
import { createServer } from "http";
import socketio from "socket.io";
import cors from "cors";

let app = express();
let http = createServer(app);
let io = socketio(http);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

export { io, http }

import { router as authRouter } from "./route/auth";
app.use("/auth", authRouter);

import { router as userRouter } from "./route/user";
app.use("/user", userRouter);

import { router as sessionRouter } from "./route/session";
app.use("/session", sessionRouter);

createConnection({
    type: "mysql",
    host: "localhost",
    port: parseInt(process.env.MYSQL_PORT),
    username: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASS,
    database: "open-colab",
    entities: [ User ],
    synchronize: true
}).then(()  => {
    http.listen(process.env.PORT || 4213, () => {
        console.log('Server Started!...');
    });
}).catch(err => console.log(err));