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
const help = require('./helpers/help');

// const kue = require('kue');
// const jobs = kue.createQueue();

const db = require('db/');

require('dotenv').config();

const HELP_MSG = routes.default.do();
const PORT = 8000;

//-------------------------Express JS configs-----------------------------//
app.use(logger('dev')); //debugs logs in terminal
// IMPORTANT: If you don't use bodyParser then you will NOT be able to call req.body.value
// without parsing JSON yourself
// app.use(bodyParser.json()); //parses json and sets to body
app.use(bodyParser.urlencoded({ extended: false }));

app.post('/sms', async (req, res) => {
  const twiml = new MessagingResponse();
  const args = req.body.Body.split(' ');
  console.log(args);
  const cmd = args[0] ? args[0].toLowerCase() : null;
  let responses = HELP_MSG;

  if (!cmd || !(cmd in routes)) {
    pass;
  } else if(cmd=="news") {
      let country;
      if("FromCountry" in req) {
        country=req.FromCountry;
      }
      responses = await routes['news'](args.slice(1), country);
  } else if(cmd=="weather") {
      let city;
      if(args.length==1 && "FromCity" in req) {
        city = req.FromCity;
      } else if(args.length>1) {
        city = args.split(1).join(' ');
      }
      //TODO: handle case where the user doesn't pass any arguments and
      //  twilio was unable to guess the sender's location.
      responses = await routes['weather'](city);

  } else if (args.length >= 1) {
    responses = await routes[cmd].do(req, args.slice(1));
  } else {
    responses = await routes[cmd].do(req);
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