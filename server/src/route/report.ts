import express = require("express");
import {getRepository} from "typeorm";
import {Session} from "../types/session";
import {Grade} from "../types/grade";
import {Role} from "../types/membership";

let router = express.Router();

var pdf = require('../pdf/pdfmake');
var vfs = require('../pdf/vfs_fonts.js');

router.get("/:sessionId/grades-pdf", async (req, res) => {
    let session = await getRepository(Session).findOne(req.params.sessionId, {relations: ["memberships", "memberships.user", "memberships.session", "tasks"] });
    let gradesRepo = getRepository(Grade);

    if(!session) { return res.status(400).json({ "error": "Session doesn't exist"}); }

    let rows = [];

    let memberships = session.memberships.filter(mship => mship.role == Role.GHOST);

    for(let i = 0; i < memberships.length; ++i) {
        let max = 0;
        let total = 0;
        rows[i] = {user: memberships[i].user.username, grades: []};
        for (let j = 0; j < session.tasks.length; ++j) {
            rows[i].grades.push(0);
            max += session.tasks[j].maxScore;
        }

        let grades = await gradesRepo.find({
            where: {session: session, user: memberships[i].user},
            relations: ["task"]
        });
        for (let j = 0; j < grades.length; ++j) {
            rows[i].grades[grades[j].task.id - 1] = grades[j].score;
            total += grades[j].score;
        }
        rows[i].grades.push(total);
        rows[i].grades.push(((total / max) * 100.0).toPrecision(2));
    }

    let docDefinition = {
        content: [
            {text: "Date: " + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''), style: "header"},
            {
                layout: "lightHorizontalLines'", // optional"
                table: {
                    // headers are automatically repeated if the table spans over multiple pages
                    // you can declare how many rows should be treated as headers
                    headerRows: 1,
                    widths: [],

                    body: []
                }
            }
        ]
    };

    docDefinition.content[1].table.widths.push("*");
    for(let i = 0; i < session.tasks.length + 2; ++i) { docDefinition.content[1].table.widths.push("auto"); }

    docDefinition.content[1].table.body.push([]);
    docDefinition.content[1].table.body[0].push("User");

    let max = 0;
    for(let i = 0; i < session.tasks.length; ++i) { docDefinition.content[1].table.body[0].push("Task " + (i + 1) + " /" + session.tasks[i].maxScore); max += session.tasks[i].maxScore; }
    docDefinition.content[1].table.body[0].push("Total /" + max);
    docDefinition.content[1].table.body[0].push("Grade %");

    for(let i = 0; i < rows.length; ++i) {
        docDefinition.content[1].table.body.push([]);
        docDefinition.content[1].table.body[i + 1].push(rows[i].user);
        for(let j = 0; j < rows[i].grades.length; ++j) {
            docDefinition.content[1].table.body[i + 1].push(rows[i].grades[j]);
        }
    }

    pdf.vfs = vfs.pdfMake.vfs;

    let doc = pdf.createPdf(docDefinition);
    doc.getBase64(data => {
        res.writeHead(200);
        let download = Buffer.from(data, "base64");
        console.log("sending file?");
        res.end(download);
    });

});

export { router }