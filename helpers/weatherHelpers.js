module.exports.getWeatherString = (data) => {
  let str = "";

  str += data.date.toString() + "\n";
  str += data.temp_l.toString() + " - " + data.temp_h.toString() + " ºC\n";
  str += data.description.toString() + " " + data.humidity.toString() + "%\n";
  str += data.wind_speed.toString() + " km/h";

  return str;
}
