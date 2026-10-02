import type { CurrentWeather } from "../../types/weather";
import { formatTemperature } from "../../utils/formatTemperature";
import { formatWind } from "../../utils/formatWind";
export function WeatherStats({ weather }: { weather: CurrentWeather }) { return <dl className="weather-stats"><div><dt>Feels like</dt><dd>{formatTemperature(weather.apparentTemperature)}</dd></div><div><dt>Humidity</dt><dd>{weather.humidity}%</dd></div><div><dt>Wind</dt><dd>{formatWind(weather.windSpeed)}</dd></div></dl>; }

