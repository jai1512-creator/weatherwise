export type TimeOfDay = "day" | "evening" | "night" | "dawn";

/**
 * Parses an ISO date-time string (e.g., "2026-10-02T17:23" or "17:23") into
 * minutes from midnight (0 to 1439).
 */
export function parseTimeToMinutes(timeString?: string): number | null {
  if (!timeString) return null;
  const match = timeString.match(/T?(\d{1,2}):(\d{2})/);
  if (!match) return null;
  const hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  if (isNaN(hours) || isNaN(minutes)) return null;
  return hours * 60 + minutes;
}

/**
 * Determines the astronomical time-of-day category for a location based on
 * real API solar timestamps (sunrise and sunset) and the current local time.
 *
 * Astronomical intervals:
 * - DAWN: 35 minutes before sunrise to 35 minutes after sunrise (morning twilight)
 * - DAY: after dawn to 60 minutes before sunset (full daylight)
 * - EVENING (Golden Hour & Dusk): 60 minutes before sunset to 45 minutes after sunset
 * - NIGHT: after dusk until dawn (astronomical night)
 *
 * If sunrise or sunset data is absent, gracefully falls back to the API's `is_day` flag.
 */
export function calculateTimeOfDay({
  currentTime,
  sunrise,
  sunset,
  isDay,
}: {
  currentTime?: string;
  sunrise?: string;
  sunset?: string;
  isDay?: number;
}): TimeOfDay {
  const currentMinutes = parseTimeToMinutes(currentTime);
  const sunriseMinutes = parseTimeToMinutes(sunrise);
  const sunsetMinutes = parseTimeToMinutes(sunset);

  if (
    currentMinutes !== null &&
    sunriseMinutes !== null &&
    sunsetMinutes !== null
  ) {
    // Dawn window: 35 min before to 35 min after sunrise
    const dawnStart = sunriseMinutes - 35;
    const dawnEnd = sunriseMinutes + 35;

    // Evening window (golden hour + dusk): 60 min before to 45 min after sunset
    const eveningStart = sunsetMinutes - 60;
    const eveningEnd = sunsetMinutes + 45;

    // Check dawn
    if (currentMinutes >= dawnStart && currentMinutes < dawnEnd) {
      return "dawn";
    }

    // Check evening (golden hour & dusk)
    if (currentMinutes >= eveningStart && currentMinutes <= eveningEnd) {
      return "evening";
    }

    // Check full day
    if (currentMinutes >= dawnEnd && currentMinutes < eveningStart) {
      return "day";
    }

    // Everything else is night
    return "night";
  }

  // Fallback to API is_day flag if solar times aren't present
  if (isDay !== undefined) {
    return isDay === 1 ? "day" : "night";
  }

  return "day";
}

/**
 * Returns a human-friendly label for the current solar time-of-day.
 */
export function getTimeOfDayLabel(timeOfDay: TimeOfDay): string {
  switch (timeOfDay) {
    case "dawn":
      return "Dawn / Morning Twilight";
    case "evening":
      return "Golden Hour / Evening";
    case "night":
      return "Night";
    case "day":
    default:
      return "Day";
  }
}
