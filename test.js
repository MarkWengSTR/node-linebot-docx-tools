require('dotenv').config();
const line = require('@line/bot-sdk');
const db = require("./models");
const fs = require("fs");

// create LINE SDK config from env variables
const config = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET,
};

// create LINE SDK client
const bot = new line.Client(config);

function storeImageFile(imagePath, eventId) {
  return bot.getMessageContent(eventId)
    .then((stream) => {

      const file = fs.createWriteStream(imagePath);

      stream.pipe(file)

      return "圖片儲存成功"
    }).catch((e) => {
      console.log(e)
      return "圖片儲存失敗"
    })
}


async function findImage() {
    const h = await db.Heading.findAll({
        where: {
            id: 42
        },
        include: [{
            model: db.Image
        }],
    })

    console.log(h[0].Images)

    const storeResult = await h[0].Images.map((img) => storeImageFile(img.path, img.eventId))

    console.log(storeResult)

    return storeResult
}

console.log(findImage())
