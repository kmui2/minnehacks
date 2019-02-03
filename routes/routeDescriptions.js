const descriptions = {
    "weather": "Get a three day forecast for your area.",
    "fact": "Get a random but useful agriculture fact.",
    "help": "Get a list of valid command and their descriptions.",
    "news": "Get top headlines in your area. Specific queries can be appended to this command."
}


module.exports = routeName => {
    if(routeName in descriptions) {
        return descriptions[routeName];
    } else {
        return "";
    }
}