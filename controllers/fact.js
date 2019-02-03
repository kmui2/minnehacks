const factsdb = require('../db/facts.js');

module.exports = async (req) => {
  const fact = await factsdb.getRandomFact();
  console.log(fact.fact);
  return [fact.fact];
}
