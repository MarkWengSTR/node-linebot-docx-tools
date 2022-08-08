const docx = require('docx');
const fs = require("fs");
const db = require("./models")
const moment = require('moment');
const { Op } = require("sequelize");

const { Document, TextRun, ImageRun, Packer, Paragraph, HeadingLevel } = docx;

function selectTodayheadings() {
    const TODAY_START = moment().format('YYYY-MM-DD 00:00');
    const TODAY_END = moment().format('YYYY-MM-DD 23:59');

    return db.Heading.findAll({
        attributes: [
            'id',
            'text'
        ],
        where: {
            createdAt: {
                [Op.between]: [
                    TODAY_START,
                    TODAY_END
                ]
            }
        }
    })
}

function genDocx(sqResHeadings, docPath) {
    function genHeadingInstance(text) {
        return new Paragraph({
            text: text,
            heading: HeadingLevel.HEADING_1,
        })
    }

    const doc = new Document({
        sections: [
            {
                children: sqResHeadings.map((h) => genHeadingInstance(h.text)),
            },
        ],
    });

    Packer.toBuffer(doc).then((buffer) => {
        fs.writeFileSync(docPath, buffer);
    });
}

function saveDocxData(docxName, docxPath) {
    return db.DocxFile.create({
        name: docxName,
        path: docxPath
    }).then((res) => {
        return res
    }).catch((e) => {
        console.log(e);
    });
}

function updateDocxIdForHeadings(headings, docxId) {
    return db.Heading.update(
        {
            docxfileId: docxId
        },
        {
            where: {
                id: {
                    [Op.in]: headings.map((h)=> h.id)
                }
            }

        }

    )
}

async function createDocxByData() {
    const nameFromInput = "EVA歲修";
    const docxName = moment().format('YYYYMMDD') + nameFromInput;
    const docxPath = `./static/files/${docxName}.docx`;

    const headingsProm = selectTodayheadings();

    const docxId = await headingsProm
        .then((hs) => genDocx(hs, docxPath))
        .then(() => saveDocxData(docxName, docxPath))
        .then((res) => res.id);

    return await headingsProm.then((hs) => updateDocxIdForHeadings(hs, docxId))
}

createDocxByData()

// saveDocxData(docxName, path)
// assocHsToDocx(hs, docxId)

// const doc = new Document({
//     sections: [
//         {
//             children: [
//                 new Paragraph({
//                     text: "Text Header",
//                     heading: HeadingLevel.HEADING_1,
//                 }),
//                 new Paragraph({
//                     children: [
//                         new TextRun({
//                             text: "Foo Bar",
//                             bold: true,
//                             size: "18pt"
//                         }),
//                         new TextRun("Hello World"),
//                         new TextRun({
//                             text: "Github is the best",
//                             bold: true,
//                             size: "12pt"
//                         }),
//                     ],
//                 }),
//                 new Paragraph({
//                     children: [
//                         new ImageRun({
//                             data: fs.readFileSync("./approved_mail.jpg"),
//                             transformation: {
//                                 width: 500,
//                                 height: 500
//                             }
//                         })
//                     ]
//                 })
//             ],
//         },
//     ],
// });

// Used to export the file into a .docx file
// Packer.toBuffer(doc).then((buffer) => {
//     fs.writeFileSync("./static/files/20220808.docx", buffer);
// });
