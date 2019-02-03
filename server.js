// source: https://github.com/uwmadisonieee/Server-And-Database-Workshop
//-------------------------Module "Importing"-----------------------------//
//modules required (same idea of #includes or Imports)
const express = require("express"); //used as routing framework
const path = require("path"); //Node.js module used for getting path of file
const logger =  require("morgan"); //used to log in console window all request
const bodyParser = require("body-parser"); //allows the use of req.body in POST request
const http = require('http');

const app = express(); //creates an instance of express
const server = http.createServer(app); //creates an HTTP server instance

const MessagingResponse = require('twilio').twiml.MessagingResponse;
const config = require('./config/database');
const routes = require('./routes/routes');

// const kue = require('kue');
// const jobs = kue.createQueue();

const db = require('db/');

require('dotenv').config();

const ERR_MSG = "No command found, please enter a new one";
const PORT = 8000;

//-------------------------Express JS configs-----------------------------//
app.use(logger('dev')); //debugs logs in terminal
// IMPORTANT: If you don't use bodyParser then you will NOT be able to call req.body.value
// without parsing JSON yourself
// app.use(bodyParser.json()); //parses json and sets to body
app.use(bodyParser.urlencoded({ extended: false }));

app.post('/sms', async (req, res) => {
  const twiml = new MessagingResponse();
  const args = req.body.Body.split();
  const cmd = args[0].lower() ? args[0] : null;
  let responses = [ERR_MSG];

  if (!cmd || !(cmd in routes)) {
    pass;
  } else if (args.length > 1) {
    responses = await routes[cmd](args.slice(1));
  } else {
    responses = await routes[cmd]();
  }

  for (let i = 0; i < responses.length; i++) {
    console.log(responses[i]);
    twiml.message(responses[i]);
  }

  res.writeHead(200, { 'Content-Type': 'text/xml' });
  res.end(twiml.toString());
});

http.createServer(app).listen(PORT, () => {
  console.log(`Express server listening on port ${PORT}`);
});
