/**
 * Parses YYYY-MM-DD string into a local Date without UTC offset shift
 */
function parseLocalDate(dateStr: string): Date {
  const parts = dateStr.split("T")[0].split("-").map(Number);
  if (parts.length === 3 && !isNaN(parts[0]) && !isNaN(parts[1]) && !isNaN(parts[2])) {
    return new Date(parts[0], parts[1] - 1, parts[2]);
  }
  return new Date(dateStr);
}

export const formatDay = (date: string): string => {
  const d = parseLocalDate(date);
  return new Intl.DateTimeFormat(undefined, { weekday: "long" }).format(d);
};

export const formatShortDay = (date: string): string => {
  const d = parseLocalDate(date);
  return new Intl.DateTimeFormat(undefined, { weekday: "short" }).format(d);
};

export const formatDayAndMonth = (date: string): string => {
  const d = parseLocalDate(date);
  return new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric" }).format(d);
};

export const formatTime = (time: string): string => {
  // Ensure ISO date string with time is parsed as local
  const d = new Date(time);
  if (isNaN(d.getTime())) {
    const [tDate, tTime] = time.split("T");
    if (tDate && tTime) {
      const [y, m, day] = tDate.split("-").map(Number);
      const [hh, mm] = tTime.split(":").map(Number);
      return new Intl.DateTimeFormat(undefined, {
        hour: "numeric",
      }).format(new Date(y, m - 1, day, hh, mm));
    }
  }
  return new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
  }).format(d);
};
