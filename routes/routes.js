module.exports = {
  weather: {
    do: require("../controllers/weather"),
    description: "Get a three day forecast for your area.",
  },
  fact: {
    do: require("../controllers/fact"),
    description: "Get a random but useful agriculture fact."
  },
  default: {
    do: require("../controllers/help"),
    description: "help text"
  },
  news: {
    do: require("../controllers/news"),
    description: "Get top headlines in your area. Specific queries can be appended to this command."
  },
  about: {
    do: require("../controllers/about"),
    description: "Get information about a topic of your choice"
  }
}
