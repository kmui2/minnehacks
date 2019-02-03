const factsdb = require('../db/facts.js');

default async () => {
  const fact = await factsdb.getRandomFact();
  return fact;
}
