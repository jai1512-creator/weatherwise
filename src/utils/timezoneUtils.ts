/**
 * Utilities for formatting location-specific time, IANA timezones, and UTC offsets.
 */

/**
 * Formats the current time in the specified IANA timezone (e.g., "4:26 PM").
 * Uses JavaScript's native Intl.DateTimeFormat to automatically handle DST changes.
 */
export function formatLocationTime(timezone?: string, date: Date = new Date()): string {
  if (!timezone) return "";
  try {
    return new Intl.DateTimeFormat("en-US", {
      timeZone: timezone,
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(date);
  } catch {
    return "";
  }
}

/**
 * Formats a UTC offset in seconds into standard offset notation (e.g., "+3600" -> "UTC+1", "+19800" -> "UTC+5:30").
 */
export function formatUtcOffset(seconds?: number): string {
  if (seconds === undefined || Number.isNaN(seconds)) return "";
  const sign = seconds >= 0 ? "+" : "-";
  const absSeconds = Math.abs(seconds);
  const hours = Math.floor(absSeconds / 3600);
  const minutes = Math.floor((absSeconds % 3600) / 60);

  if (minutes === 0) {
    return `UTC${sign}${hours}`;
  }
  return `UTC${sign}${hours}:${String(minutes).padStart(2, "0")}`;
}

/**
 * Derives a clean timezone abbreviation (e.g., "BST", "IST", "JST", "EDT")
 * using standard Intl full timezone names or falling back to API abbreviations.
 */
export function getTimezoneAbbreviation(timezone?: string, fallbackAbbr?: string): string {
  if (!timezone) return fallbackAbbr ?? "";
  try {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: timezone,
      timeZoneName: "long",
    }).formatToParts(new Date());

    const longName = parts.find((p) => p.type === "timeZoneName")?.value;
    if (longName) {
      const match = longName.match(/\b([A-Z])/g);
      if (match && match.length >= 2 && match.length <= 5) {
        return match.join("");
      }
    }
  } catch {
    // If Intl fails, proceed to fallback
  }

  return fallbackAbbr ?? "";
}
