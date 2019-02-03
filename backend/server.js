// source: https://github.com/uwmadisonieee/Server-And-Database-Workshop
//-------------------------Module "Importing"-----------------------------//
//modules required (same idea of #includes or Imports)
const express = require("express"); //used as routing framework
const path = require("path"); //Node.js module used for getting path of file
const logger =  require("morgan"); //used to log in console window all request
const cookieParser = require("cookie-parser"); //Parse Cookie header and populate req.cookies
const bodyParser = require("body-parser"); //allows the use of req.body in POST request
const http = require('http');
// const jwt = require('jsonwebtoken');
const app = express(); //creates an instance of express
const server = http.createServer(app); //creates an HTTP server instance
require('express-ws')(app);

const { router: api } = require("./routes/api/api.js"); //gets api logic from path
const { router: user } = require("./routes/user/index.js"); //gets user logic from path
const { router: match } = require("./routes/match/matchapi.js"); //gets match logic from path
const config = require('./config/database');
require('dotenv').config()


//-------------------------Express JS configs-----------------------------//
app.use(logger('dev')); //debugs logs in terminal
// IMPORTANT: If you don't use bodyParser then you will NOT be able to call req.body.value
// without parsing JSON yourself
app.use(bodyParser.json()); //parses json and sets to body
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/user', user);
app.use('/match', match);

// so when people try to access it via browser
app.get("/", function(req, res) {
  res.status(200).sendFile(path.join(__dirname + "/public/index.html"));
});


const port = normalizePort(process.env.PORT || '8000');
app.set('port', port);
app.use(express.static(__dirname + "/public"));

/**
 * Listen on provided port, on all network interfaces.
 */
app.listen(app.get("port"), function() {
  console.log("Node app is running at http://localhost:" + app.get("port"));
});
server.on('error', onError);
server.on('listening', onListening);

app.get("/hello", (req, res) => {
  res.send({ greeting: "hello there!" });
});

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  const port = parseInt(val, 10);

  // named pipe
  if (isNaN(port))
    return val;

  // port number
  if (port >= 0)
    return port;

  return false;
}

// Event listener for HTTP server "error" event.
function onError(error) {
  if (error.syscall !== 'listen')
    throw error;

  const bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

// Event listener for HTTP server "listening" event.
function onListening() {
  const addr = server.address();
  const bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  console.log('Listening on ' + bind);
}
