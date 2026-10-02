export type WeatherCondition = "clear" | "cloudy" | "fog" | "drizzle" | "rain" | "snow" | "storm" | "unknown";

export function getWeatherCondition(weatherCode: number): WeatherCondition {
  if (weatherCode === 0) return "clear";
  if (weatherCode >= 1 && weatherCode <= 3) return "cloudy";
  if (weatherCode >= 45 && weatherCode <= 48) return "fog";
  if (weatherCode >= 51 && weatherCode <= 57) return "drizzle";
  if ((weatherCode >= 61 && weatherCode <= 67) || (weatherCode >= 80 && weatherCode <= 82)) return "rain";
  if ((weatherCode >= 71 && weatherCode <= 77) || (weatherCode >= 85 && weatherCode <= 86)) return "snow";
  if (weatherCode >= 95 && weatherCode <= 99) return "storm";
  return "unknown";
}

const SPECIFIC_LABELS: Record<number, string> = {
  0: "Clear sky",
  1: "Mainly clear",
  2: "Partly cloudy",
  3: "Overcast",
  45: "Fog",
  48: "Depositing rime fog",
  51: "Light drizzle",
  53: "Moderate drizzle",
  55: "Dense drizzle",
  56: "Light freezing drizzle",
  57: "Dense freezing drizzle",
  61: "Slight rain",
  63: "Moderate rain",
  65: "Heavy rain",
  66: "Light freezing rain",
  67: "Heavy freezing rain",
  71: "Slight snow fall",
  73: "Moderate snow fall",
  75: "Heavy snow fall",
  77: "Snow grains",
  80: "Slight rain showers",
  81: "Moderate rain showers",
  82: "Violent rain showers",
  85: "Slight snow showers",
  86: "Heavy snow showers",
  95: "Thunderstorm",
  96: "Thunderstorm with slight hail",
  99: "Thunderstorm with heavy hail",
};

export function getWeatherLabel(weatherCode: number): string {
  if (weatherCode in SPECIFIC_LABELS) {
    return SPECIFIC_LABELS[weatherCode];
  }
  const conditionLabels: Record<WeatherCondition, string> = {
    clear: "Clear sky",
    cloudy: "Partly cloudy",
    fog: "Foggy",
    drizzle: "Drizzle",
    rain: "Rain",
    snow: "Snow",
    storm: "Thunderstorm",
    unknown: "Weather unavailable",
  };
  return conditionLabels[getWeatherCondition(weatherCode)];
}

export function getConciseWeatherLabel(weatherCode: number): string {
  if (weatherCode === 0) return "Clear";
  if (weatherCode === 1 || weatherCode === 2) return "Partly cloudy";
  if (weatherCode === 3) return "Overcast";
  if (weatherCode >= 45 && weatherCode <= 48) return "Fog";
  if (weatherCode >= 51 && weatherCode <= 57) return "Drizzle";
  if (weatherCode >= 61 && weatherCode <= 67) return "Rain";
  if (weatherCode >= 71 && weatherCode <= 77) return "Snow";
  if (weatherCode >= 80 && weatherCode <= 82) return "Showers";
  if (weatherCode >= 85 && weatherCode <= 86) return "Snow";
  if (weatherCode >= 95 && weatherCode <= 99) return "Storm";
  return "Fair";
}

