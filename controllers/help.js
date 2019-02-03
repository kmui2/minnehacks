const routes = require("../routes/routes");

module.exports = (req) => {
  let result = `
Valid options:
1. Weather (city) - get the forecast for a city
2. News [query] - get the news about a topic
3. About (subject) - learn about a subject
4. Fact - get a useful fact about farming
5. Hlp - print this help text
`;

  return [result];
}