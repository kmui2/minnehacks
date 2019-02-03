const OpenWeatherMapHelper = require("openweathermap-node");

const config = require('../config.json');
const request = require('request');

module.exports = async function getWeather(cityName) {
  return new Promise((resolve, reject) => {

    const helper = new OpenWeatherMapHelper(
      {
        config.weather_appid,
        config.weather_units
      }
    );

    helper.getSixteenDayForecastByCityName(cityName, (err, forecast) => {
      if(err) {
        reject(err);
      } else {
        let result = [];
        for(let i=0;i<3;i++) {
          data = {
            date = forecast.list[i].dt,
            temp_l = forecast.list[i].temp.min,
            temp_h = forecast.list[i].temp.max,
            description = forecast.list[i].weather.description,
            wind_speed = forecast.list[i].speed,
            humidity = forecast.list[i].humidity
          }
          result.push(getWeatherString(data));
        }
        resolve(result);
      }
    });
  });
}