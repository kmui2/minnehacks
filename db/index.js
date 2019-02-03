const sqlite = require('sqlite');
const path = require('path');

module.exports = sqlite.open(path.join(__dirname, 'minnehacks.db'));