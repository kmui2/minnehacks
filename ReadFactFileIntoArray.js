
var fs = require('fs');

/**
 * Reads file into array line by line.
 */
function readFileLinesIntoArray(filename) {
    let fileContents = fs.readFileSync(filename, 'uft8');
    return fileContents.split('\n');
}