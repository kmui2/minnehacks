const fact = () => {
  const facts = ["random fact1", "random fact2", "random fact3"];

  const out = [facts[Math.floor(Math.random()*facts.length)]];

  return out;
}

export default fact
