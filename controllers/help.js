const routes = require("../routes/routes.js");

module.exports = async () => {
    let result = "Valid options:\n";
    let optionNumber = 1;
    for(route in routes) {
        result += optionNumber.toString() + ". " + route.toString();
    }
    return result;
}