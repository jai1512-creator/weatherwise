import type { DailyWeather, HourlyWeather } from "../types/weather";

export function getUpcomingHours(hours: HourlyWeather[], count = 24): HourlyWeather[] {
  if (!hours.length) return [];
  const now = new Date();
  // Allow up to 45 minutes in the past so the current ongoing hour is visible
  const cutoffTime = now.getTime() - 45 * 60 * 1000;
  
  const startIndex = hours.findIndex((h) => {
    const timeMs = new Date(h.time).getTime();
    return !isNaN(timeMs) && timeMs >= cutoffTime;
  });

  if (startIndex === -1) {
    return hours.slice(0, count);
  }

  return hours.slice(startIndex, startIndex + count);
}

export function getUpcomingDays(days: DailyWeather[], count = 7): DailyWeather[] {
  if (!days.length) return [];
  const todayStr = new Date().toISOString().slice(0, 10);
  const startIndex = days.findIndex((d) => d.date >= todayStr);
  if (startIndex === -1) {
    return days.slice(0, count);
  }
  return days.slice(startIndex, startIndex + count);
}

