const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();
module.exports.router = router;

// Creates the next layer of url call
// example go to /api/count to go to count folder
// Also: index.js is the file called inside the folder
fs.readdir("./routes/api", (err, items) => {
  items.filter(file => file.match(/^(.(?!.*\.js))*$/)).forEach(folder => {
    router.use("/" + folder, require("./" + folder).router);
  });
});
