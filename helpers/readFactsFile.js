const fs = require("fs");
const readline = require("readline");
const factsDb = require("../db/facts");

const filepath = process.argv[2];

factsDb.createFactTable().then(() => {
  const fileStream = fs.createReadStream(filepath);

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });
  // Note: we use the crlfDelay option to recognize all instances of CR LF
  // ('\r\n') in input.txt as a single line break.

  rl.on("line", async line => {
    await factsDb.addFact(line);
  });
});
