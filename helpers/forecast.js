
const OpenWeatherMapHelper = require("openweathermap-node");

const request = require('request');
const APPID = 'f5908c8f834a1db7ddc3ba99275e6b25';
const units = "metric";

async function getWeather(cityName) {
    return new Promise((resolve, reject) => {

        const helper = new OpenWeatherMapHelper(
            {
                APPID,
                units
           }
        );

        //TODO: fix this function call
        getSixteenDayForecast(cityName, (err, forecast) => {
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

getWeather("menomonie");