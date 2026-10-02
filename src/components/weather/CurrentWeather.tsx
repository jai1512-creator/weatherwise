import { getWeatherLabel } from "../../logic/weatherCode";
import type { CurrentWeather as CurrentWeatherData } from "../../types/weather";
import { formatTemperature } from "../../utils/formatTemperature";
import { WeatherIcon } from "./WeatherIcon";

export function CurrentWeather({ weather }: { weather: CurrentWeatherData }) {
  return (
    <div className="current-weather">
      <div className="current-weather__icon-wrapper">
        <WeatherIcon weatherCode={weather.weatherCode} size={64} className="current-weather__icon" />
      </div>
      <div className="current-weather__details">
        <p className="eyebrow">Current conditions</p>
        <strong className="current-weather__temp">{formatTemperature(weather.temperature)}</strong>
        <p className="current-weather__condition">{getWeatherLabel(weather.weatherCode)}</p>
      </div>
    </div>
  );
}
