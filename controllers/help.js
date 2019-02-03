const routes = require("../routes/routes");

module.exports = (req) => {
  let result = "Valid options:\n";
  let optionNumber = 1;
  console.log(routes)
  console.log(Object.keys(routes));
  for(route in Object.keys(routes)) {
    result += optionNumber.toString() + ". \"" + route + "\" - " + route.description + "\n";
    optionNumber++;
  }
  return [result];
}