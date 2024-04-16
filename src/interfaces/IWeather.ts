export interface IWeather {
  locationName: String;
  region: String;
  country: String;
  temp_f: number;
  temp_c: number;
  is_day: boolean;
  condition: String;
  icon: String;
  humidity: number;
  gust_mph: number;
  gust_kph: number;
  uv: number;
  cloud: number;
}
