import type { TimeOfDay } from "../logic/timeOfDay";

export type CurrentWeather = {
  temperature: number;
  apparentTemperature: number;
  humidity: number;
  windSpeed: number;
  weatherCode: number;
  isDay?: number;
  precipitation?: number;
  time?: string;
  timezone?: string;
  timezoneAbbreviation?: string;
  utcOffsetSeconds?: number;
};

export type HourlyWeather = {
  time: string;
  temperature: number;
  apparentTemperature?: number;
  humidity?: number;
  precipitationProbability?: number;
  precipitation?: number;
  windSpeed?: number;
  weatherCode: number;
};

export type DailyWeather = {
  date: string;
  weatherCode: number;
  temperatureMax: number;
  temperatureMin: number;
  precipitationProbabilityMax?: number;
  windSpeedMax?: number;
};

export type WeatherForecast = {
  current: CurrentWeather;
  hourly: HourlyWeather[];
  daily: DailyWeather[];
  sunrise?: string;
  sunset?: string;
  timeOfDay?: TimeOfDay;
  timezone?: string;
  timezoneAbbreviation?: string;
  utcOffsetSeconds?: number;
};
