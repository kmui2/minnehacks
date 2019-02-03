const fs = require("fs");
const readline = require("readline");
const factsDb = require("../db/facts");

module.exports = async (filepath) => {
  const fileStream = fs.createReadStream(filepath);

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });
  // Note: we use the crlfDelay option to recognize all instances of CR LF
  // ('\r\n') in input.txt as a single line break.

  for await (const line of rl) {
		// Each line in input.txt will be successively available here as `line`.
		factsDb.addFact(line);
  }
}
