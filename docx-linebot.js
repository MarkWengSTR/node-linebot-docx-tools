const docx = require('docx');
const fs = require("fs");
const db = require("./models")
const moment = require('moment');
const { Op } = require("sequelize");

const { Document, ImageRun, Packer, Paragraph, HeadingLevel } = docx;
const docxLinebot = {};

function selectTodayheadings(_) {
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
        },
        include: [{
            model: db.Image,
            attributes: [
                'path'
            ],
            as: "Images",
            order: [ ['id', 'DESC'] ]
        }],
        order: [ ["Images", 'id', 'ASC'] ]
    })
}

function selectHeadingByText(inputText) {
    return db.Heading.findAll({
        attributes: [
            'id',
            'text'
        ],
        where: {
            text: {
                [Op.like]: '%' + inputText + '%'
            }
        },
        include: [{
            model: db.Image,
            attributes: [
                'path'
            ],
            as: "Images",
            order: [ ['id', 'DESC'] ]
        }],
        order: [ ["Images", 'id', 'ASC'] ]
    })

}

function genDocx(sqResHeadings, docPath) {
    function genImageInstance(imagePath) {
        return new Paragraph({
            children: [
                new ImageRun({
                    data: fs.readFileSync(imagePath),
                    transformation: {
                        width: 300,
                        height: 300
                    }
                })
            ]
        })
    }

    function genContInHeadingInstance(sqResHeading) {
        const allContent = [];

        const titleInst = new Paragraph({
            text: sqResHeading.text,
            heading: HeadingLevel.HEADING_1,
        })

        const imageInst = sqResHeading.Images.map((img) => genImageInstance(img.path));

        return allContent.concat(titleInst, imageInst)
    }

    const doc = new Document({
        sections: [
            {
                children: sqResHeadings.map((h) => genContInHeadingInstance(h)).flat(),
            },
        ],
    });

    Packer.toBuffer(doc).then((buffer) => {
        fs.writeFileSync(docPath, buffer);
    });
}

function saveDocxData(docxName, docxPath) {
    return db.DocxFile.findOrCreate({
        where: {
            name: docxName,
            path: docxPath,
        }
    }).then(([docx, createdNew]) => {
        if (createdNew) {
            return docx
        } else {
            docx.update(
                { version: docx.version + 1 }
            )
            docx.reload()
            return docx
        }
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

async function createDocx(inputName) {
    const docxName = inputName + "-" + "Generate at " + moment().format('YYYYMMDD')
    const docxPath = `./assets/files/${docxName}.docx`;

    const headingPromFunc = ( inputName === "今日" ) ? selectTodayheadings : selectHeadingByText;

    const headingsProm = headingPromFunc(inputName);

    const docxId = await headingsProm
        .then((hs) => genDocx(hs, docxPath))
        .then(() => saveDocxData(docxName, docxPath))
        .then((res) => res.id);

    return await headingsProm.then((hs) => updateDocxIdForHeadings(hs, docxId))
}

docxLinebot.createDocx = createDocx

module.exports = docxLinebot;

