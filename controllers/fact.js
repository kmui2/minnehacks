const factsdb = require('../db/facts.js');

module.exports = async (req) => {
  const fact = await factsdb.getRandomFact();
  return fact;
}
