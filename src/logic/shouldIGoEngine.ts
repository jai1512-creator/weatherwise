import { activityRules } from "../data/activityRules";
import type {
  DetailedFactor,
  ForecastSnapshot,
  Plan,
  Recommendation,
} from "../types/plan";
import type { CurrentWeather, WeatherForecast } from "../types/weather";
import { getWeatherCondition, getWeatherLabel } from "./weatherCode";

function isWeatherForecast(
  data: WeatherForecast | CurrentWeather,
): data is WeatherForecast {
  return "hourly" in data && "daily" in data;
}

export function createRecommendation(
  plan: Plan,
  weatherOrForecast: WeatherForecast | CurrentWeather | null,
  locationName?: string,
): Recommendation {
  if (!weatherOrForecast) {
    return {
      verdict: "caution",
      summary: "Weather data is needed before we can evaluate your plan.",
      factors: ["Awaiting forecast data."],
    };
  }

  const rule = activityRules[plan.activity] ?? activityRules.walk;

  // Extract relevant forecast metrics for target date and time
  let temp = 20;
  let apparentTemp = 20;
  let humidity = 50;
  let precipProb = 0;
  let precipMm = 0;
  let windSpeed = 10;
  let weatherCode = 0;

  if (isWeatherForecast(weatherOrForecast)) {
    const { hourly, daily } = weatherOrForecast;

    // Find the closest hourly entry matching plan.date and plan.time
    const targetDate = plan.date; // "YYYY-MM-DD"
    const targetHour = plan.time ? parseInt(plan.time.split(":")[0], 10) : 12;

    const matchedHour = hourly.find((h) => {
      if (!h.time.startsWith(targetDate)) return false;
      const hHour = parseInt(h.time.split("T")[1]?.split(":")[0] ?? "0", 10);
      return hHour === targetHour;
    });

    if (matchedHour) {
      temp = matchedHour.temperature;
      apparentTemp = matchedHour.apparentTemperature ?? matchedHour.temperature;
      humidity = matchedHour.humidity ?? 50;
      precipProb = matchedHour.precipitationProbability ?? 0;
      precipMm = matchedHour.precipitation ?? 0;
      windSpeed = matchedHour.windSpeed ?? 0;
      weatherCode = matchedHour.weatherCode;
    } else {
      // Fallback to daily forecast entry for this date
      const matchedDay = daily.find((d) => d.date === targetDate);
      if (matchedDay) {
        temp = Math.round((matchedDay.temperatureMax + matchedDay.temperatureMin) / 2);
        apparentTemp = temp;
        precipProb = matchedDay.precipitationProbabilityMax ?? 0;
        windSpeed = matchedDay.windSpeedMax ?? 15;
        weatherCode = matchedDay.weatherCode;
      } else if (hourly.length > 0) {
        // Fallback to latest available
        temp = hourly[0].temperature;
        apparentTemp = hourly[0].apparentTemperature ?? temp;
        humidity = hourly[0].humidity ?? 50;
        precipProb = hourly[0].precipitationProbability ?? 0;
        windSpeed = hourly[0].windSpeed ?? 0;
        weatherCode = hourly[0].weatherCode;
      }
    }
  } else {
    // CurrentWeather fallback
    temp = weatherOrForecast.temperature;
    apparentTemp = weatherOrForecast.apparentTemperature;
    humidity = weatherOrForecast.humidity;
    windSpeed = weatherOrForecast.windSpeed;
    weatherCode = weatherOrForecast.weatherCode;
  }

  const condition = getWeatherCondition(weatherCode);
  const conditionLabel = getWeatherLabel(weatherCode);

  const detailedFactors: DetailedFactor[] = [];

  // 1. Evaluate Precipitation & Weather Condition
  if (condition === "storm") {
    detailedFactors.push({
      kind: "critical",
      message: "Thunderstorms and lightning are forecasted. Outdoor plans are unsafe.",
    });
  } else if (condition === "snow") {
    detailedFactors.push({
      kind: "critical",
      message: `Snowfall expected (${precipProb}% probability). Cold ground and slick footing.`,
    });
  } else if (precipProb >= 60 || precipMm >= 2.0) {
    detailedFactors.push({
      kind: "critical",
      message: `High likelihood of rain (${precipProb}% probability, ~${precipMm.toFixed(1)} mm). You will likely get soaked.`,
    });
  } else if (precipProb >= 35 || condition === "rain") {
    detailedFactors.push({
      kind: "caution",
      message: `Rain showers likely (${precipProb}% chance). Waterproof jacket or umbrella recommended.`,
    });
  } else if (precipProb >= rule.maxPrecipProb || condition === "drizzle") {
    detailedFactors.push({
      kind: "caution",
      message: `Passing drizzle or showers possible (${precipProb}% chance).`,
    });
  } else {
    detailedFactors.push({
      kind: "positive",
      message: `Minimal chance of rain (${precipProb}%). Dry conditions expected.`,
    });
  }

  // 2. Evaluate Wind
  if (windSpeed > rule.maxWind * 1.3) {
    detailedFactors.push({
      kind: "critical",
      message: `Severe wind (${Math.round(windSpeed)} km/h) exceeds safe threshold for ${rule.label.toLowerCase()} (${rule.maxWind} km/h).`,
    });
  } else if (windSpeed > rule.maxWind) {
    detailedFactors.push({
      kind: "caution",
      message: `Gusty wind (${Math.round(windSpeed)} km/h) is above comfortable levels for ${rule.label.toLowerCase()} (${rule.maxWind} km/h).`,
    });
  } else {
    detailedFactors.push({
      kind: "positive",
      message: `Comfortable wind speed (${Math.round(windSpeed)} km/h; well within ${rule.maxWind} km/h limit).`,
    });
  }

  // 3. Evaluate Temperature and Feels Like
  if (apparentTemp >= 38 || temp > rule.maxTemperature + 5) {
    detailedFactors.push({
      kind: "critical",
      message: `Extreme heat warning (Feels like ${Math.round(apparentTemp)}°C). High risk of heat illness.`,
    });
  } else if (temp > rule.maxTemperature || apparentTemp >= 33) {
    detailedFactors.push({
      kind: "caution",
      message: `Warm conditions (${Math.round(temp)}°C, feels like ${Math.round(apparentTemp)}°C). Stay hydrated and seek shade.`,
    });
  } else if (temp < rule.minTemperature - 8 || apparentTemp <= -6) {
    detailedFactors.push({
      kind: "critical",
      message: `Freezing temperatures (${Math.round(temp)}°C, feels like ${Math.round(apparentTemp)}°C). Frostbite and hypothermia hazard.`,
    });
  } else if (temp < rule.minTemperature) {
    detailedFactors.push({
      kind: "caution",
      message: `Chilly for ${rule.label.toLowerCase()} (${Math.round(temp)}°C, feels like ${Math.round(apparentTemp)}°C vs ideal min ${rule.minTemperature}°C). Extra layers recommended.`,
    });
  } else {
    detailedFactors.push({
      kind: "positive",
      message: `Pleasant temperature around ${Math.round(temp)}°C (feels like ${Math.round(apparentTemp)}°C).`,
    });
  }

  // 4. Fog / Visibility
  if (condition === "fog") {
    detailedFactors.push({
      kind: "caution",
      message: "Dense fog and reduced visibility expected. Exercise caution along trails and roadways.",
    });
  }

  // Determine Verdict
  const hasCritical = detailedFactors.some((f) => f.kind === "critical");
  const hasCaution = detailedFactors.some((f) => f.kind === "caution");

  let verdict: "good" | "caution" | "avoid";
  let summary: string;

  if (hasCritical) {
    verdict = "avoid";
    summary =
      "Conditions are unfavorable or unsafe for your outdoor plan. We recommend rescheduling or choosing an indoor alternative.";
  } else if (hasCaution) {
    verdict = "caution";
    summary =
      "Conditions are borderline. You can proceed, but prepare with proper gear and remain flexible.";
  } else {
    verdict = "good";
    summary = "Forecast conditions look great for your planned activity!";
  }

  // Transparent Confidence Note
  const now = new Date();
  const planDateObj = new Date(plan.date);
  const diffDays = Math.ceil(
    (planDateObj.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
  );

  let confidenceNote =
    "High confidence: near-term hourly weather model is strongly resolved.";
  if (diffDays >= 4) {
    confidenceNote =
      "Longer-range outlook: general weather patterns are captured, but exact shower timing and wind speeds may adjust as the day nears.";
  } else if (diffDays >= 2) {
    confidenceNote =
      "Moderate confidence: forecast trends are stable, but re-check 24 hours prior for fine timing.";
  }

  const forecastSnapshot: ForecastSnapshot = {
    temperature: temp,
    apparentTemperature: apparentTemp,
    humidity,
    precipitationProbability: precipProb,
    precipitation: precipMm,
    windSpeed,
    weatherCode,
    conditionLabel,
  };

  return {
    verdict,
    summary,
    factors: detailedFactors.map((f) => f.message),
    detailedFactors,
    forecast: forecastSnapshot,
    confidenceNote,
    targetDateTimeLabel: `${plan.date} at ${plan.time || "12:00"}`,
    locationName: plan.destination || locationName,
    activityLabel: rule.label,
  };
}
