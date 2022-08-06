const docx = require('docx');
const fs = require("fs");

const { Document, TextRun, ImageRun, Packer, Paragraph, HeadingLevel } = docx;

const doc = new Document({
    sections: [
        {
            children: [
                new Paragraph({
                    text: "Text Header",
                    heading: HeadingLevel.HEADING_1,
                }),
                new Paragraph({
                    children: [
                        new TextRun({
                            text: "Foo Bar",
                            bold: true,
                            size: "18pt"
                        }),
                        new TextRun("Hello World"),
                        new TextRun({
                            text: "Github is the best",
                            bold: true,
                            size: "12pt"
                        }),
                    ],
                }),
                new Paragraph({
                    children: [
                        new ImageRun({
                            data: fs.readFileSync("./approved_mail.jpg"),
                            transformation: {
                                width: 500,
                                height: 500
                            }
                        })
                    ]
                })
            ],
        },
    ],
});

// Used to export the file into a .docx file
Packer.toBuffer(doc).then((buffer) => {
    fs.writeFileSync("My Document.docx", buffer);
});
