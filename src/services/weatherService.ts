import { calculateTimeOfDay } from "../logic/timeOfDay";
import type { Location } from "../types/location";
import type { WeatherForecast } from "../types/weather";
import { getTimezoneAbbreviation } from "../utils/timezoneUtils";

export async function fetchWeatherForecast(location: Location): Promise<WeatherForecast> {
  const parameters = new URLSearchParams({
    latitude: String(location.latitude),
    longitude: String(location.longitude),
    timezone: "auto",
    current: "temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code,is_day,precipitation",
    hourly: "temperature_2m,apparent_temperature,relative_humidity_2m,precipitation_probability,precipitation,wind_speed_10m,weather_code",
    daily: "weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max,sunrise,sunset",
  });
  const response = await fetch(`https://api.open-meteo.com/v1/forecast?${parameters}`);
  if (!response.ok) throw new Error("Unable to load weather data.");
  const data = await response.json();

  const sunrise = data.daily?.sunrise?.[0] as string | undefined;
  const sunset = data.daily?.sunset?.[0] as string | undefined;
  const currentTime = data.current?.time as string | undefined;
  const isDay = data.current?.is_day as number | undefined;

  const timezone = data.timezone as string | undefined;
  const utcOffsetSeconds = data.utc_offset_seconds as number | undefined;
  const timezoneAbbreviation = getTimezoneAbbreviation(
    timezone,
    data.timezone_abbreviation as string | undefined,
  );

  const timeOfDay = calculateTimeOfDay({
    currentTime,
    sunrise,
    sunset,
    isDay,
  });

  return {
    sunrise,
    sunset,
    timeOfDay,
    timezone,
    timezoneAbbreviation,
    utcOffsetSeconds,
    current: {
      temperature: data.current.temperature_2m,
      apparentTemperature: data.current.apparent_temperature,
      humidity: data.current.relative_humidity_2m,
      windSpeed: data.current.wind_speed_10m,
      weatherCode: data.current.weather_code,
      isDay: data.current.is_day,
      precipitation: data.current.precipitation,
      time: data.current.time,
      timezone,
      timezoneAbbreviation,
      utcOffsetSeconds,
    },
    hourly: data.hourly.time.map((time: string, index: number) => ({
      time,
      temperature: data.hourly.temperature_2m[index],
      apparentTemperature: data.hourly.apparent_temperature?.[index] ?? data.hourly.temperature_2m[index],
      humidity: data.hourly.relative_humidity_2m?.[index] ?? 0,
      precipitationProbability: data.hourly.precipitation_probability?.[index] ?? 0,
      precipitation: data.hourly.precipitation?.[index] ?? 0,
      windSpeed: data.hourly.wind_speed_10m?.[index] ?? 0,
      weatherCode: data.hourly.weather_code[index],
    })),
    daily: data.daily.time.map((date: string, index: number) => ({
      date,
      weatherCode: data.daily.weather_code[index],
      temperatureMax: data.daily.temperature_2m_max[index],
      temperatureMin: data.daily.temperature_2m_min[index],
      precipitationProbabilityMax: data.daily.precipitation_probability_max?.[index],
      windSpeedMax: data.daily.wind_speed_10m_max?.[index],
    })),
  };
}
