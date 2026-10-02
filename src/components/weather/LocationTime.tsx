import { useState, useEffect } from "react";
import { formatLocationTime, formatUtcOffset } from "../../utils/timezoneUtils";

export type LocationTimeProps = {
  timezone?: string;
  timezoneAbbreviation?: string;
  utcOffsetSeconds?: number;
};

export function LocationTime({
  timezone,
  timezoneAbbreviation,
  utcOffsetSeconds,
}: LocationTimeProps) {
  const [now, setNow] = useState(() => new Date());

  // Tick the live clock approximately once per minute (every 10s ensures prompt minute updates)
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 10000);

    return () => clearInterval(timer);
  }, []);

  if (!timezone) return null;

  const formattedTime = formatLocationTime(timezone, now);
  const formattedOffset = formatUtcOffset(utcOffsetSeconds);
  const timezoneLabel = timezoneAbbreviation
    ? `${timezone} · ${timezoneAbbreviation}`
    : timezone;

  if (!formattedTime) return null;

  return (
    <div
      className="location-time"
      aria-label={`Current local time in ${timezone}`}
    >
      <p className="eyebrow location-time__eyebrow">Current local time</p>
      <strong className="location-time__clock">{formattedTime}</strong>
      <div className="location-time__meta">
        <span className="location-time__zone">{timezoneLabel}</span>
        {formattedOffset && (
          <span className="location-time__offset">{formattedOffset}</span>
        )}
      </div>
    </div>
  );
}
