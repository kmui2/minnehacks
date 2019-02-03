function getWeatherString (data){
  let str = "";
  str += data.date + "\n";
  str += data.temp_l + " ºC\n";
  str += data.temp_h + " ºC\n";
  str += data.wind_speed + " km/h\n";
  str += data.precipitation + " cm\n";
  str += data.humidity + " %";

  return str;
}
