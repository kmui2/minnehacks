const OpenWeatherMapHelper = require("openweathermap-node");
const moment = require('moment');
const Console = require('console');

const config = require('../config/config.json');
const weatherHelpers = require('../helpers/weatherHelpers');
const request = require('request');

module.exports = async (req, args) => {
  return new Promise((resolve, reject) => {

    const helper = new OpenWeatherMapHelper(
      {
        APPID: config.weather_appid,
        units: config.weather_units
      }
    );

    /*
    let cityName;
    if("FromCity" in req) {
      cityName=req.FromCity;
    }
    */
    const cityName = args[0];

    helper.getThreeHourForecastByCityName(cityName, (err, forecast) => {
      if(err) {
        resolve("Could not get weather by city name")
      } else {
        let result = [];
        for(let i=0;i<24;i+=8) {
          const date = moment.unix(forecast.list[i].dt).format("MM/DD/YYYY");
          const data = {
            date,
            temp_l : forecast.list[i].main.temp_min,
            temp_h : forecast.list[i].main.temp_max,
            description : forecast.list[i].weather[0].description,
            wind_speed : forecast.list[i].wind.speed,
            humidity : forecast.list[i].main.humidity
          }
          result.push(weatherHelpers.getWeatherString(data));
        }
        Console.log(result[0]);
        resolve(result);
      }
    });
  });
}