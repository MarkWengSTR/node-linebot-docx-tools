'use strict';
require('dotenv').config();

const line = require('@line/bot-sdk');
const express = require('express');
const eta = require("eta")

// create LINE SDK config from env variables
const config = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET,
};

// create LINE SDK client
const client = new line.Client(config);

// create Express app
// about Express itself: https://expressjs.com/
const app = express();

app.engine("eta", eta.renderFile)
app.set("view engine", "eta")
app.set("views", "./views")


app.get('/', (_req, res) => {
  res.render("./index", { name: "mark" })
})

// register a webhook handler with middleware
// about the middleware, please refer to doc
app.post('/callback', line.middleware(config), (req, res) => {
  Promise
    .all(req.body.events.map(handleEvent))
    .then((result) => res.json(result))
    .catch((err) => {
      console.error(err);
      res.status(500).end();
    });
});

// event handler
function handleEvent(event) {
  console.log(event)
  if (event.type !== 'message') {
    // ignore non-text-message event
    return Promise.resolve(null);
  }

  switch ( event.message.type ) {
    case 'text':
      return textHandler(event)
    case 'image':
      return imageHandler(event)
    default:
      return Promise.resolve(null);
  }
}

function textHandler(event) {
  // create a echoing text message
  const echo = { type: 'text', text: event.message.text };

  // use reply API
  return client.replyMessage(event.replyToken, echo);
}

function imageHandler(event) {
  // create a echoing text message
  const echo = { type: 'text', text: '已接收照片成功' };

  // use reply API
  return client.replyMessage(event.replyToken, echo);
}

// listen on port
const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});
