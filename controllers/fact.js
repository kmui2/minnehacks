const factsdb = require('../db/facts.js');

module.exports = async () => {
  const fact = await factsdb.getRandomFact();
  return fact;
}
