const routes = require("../routes/routes.js");
const routeDesc = require("../routes/routeDescriptions.js");

module.exports = async (req) => {
    let result = "Valid options:\n";
    let optionNumber = 1;
    for(route in routes) {
        result += optionNumber.toString() + ". \"" + route.toString() + "\" - " + routeDesc(route) + "\n";
    }
    return result;
}