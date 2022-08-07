const db = require("./models")

db.Heading.create({
    text: "GOOGOGGOGOG",
    level: 'HEADING_1'
}).then((heading) => {
    console.log(heading.text)
}).catch((e) => {
    console.log(e);
    "儲存標題失敗"
});

