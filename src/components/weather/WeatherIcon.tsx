import { getWeatherCondition } from "../../logic/weatherCode";

export type WeatherIconProps = {
  weatherCode: number;
  className?: string;
  size?: number;
};

export function WeatherIcon({ weatherCode, className = "", size = 28 }: WeatherIconProps) {
  const condition = getWeatherCondition(weatherCode);

  const style = { width: size, height: size, display: "inline-block", verticalAlign: "middle" };

  switch (condition) {
    case "clear":
      return (
        <svg
          className={`weather-icon weather-icon--clear ${className}`}
          style={style}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="4" fill="#fbbf24" stroke="#d97706" />
          <path d="M12 2v2" stroke="#d97706" />
          <path d="M12 20v2" stroke="#d97706" />
          <path d="M4.93 4.93l1.41 1.41" stroke="#d97706" />
          <path d="M17.66 17.66l1.41 1.41" stroke="#d97706" />
          <path d="M2 12h2" stroke="#d97706" />
          <path d="M20 12h2" stroke="#d97706" />
          <path d="M6.34 17.66l-1.41 1.41" stroke="#d97706" />
          <path d="M19.07 4.93l-1.41 1.41" stroke="#d97706" />
        </svg>
      );

    case "cloudy":
      return (
        <svg
          className={`weather-icon weather-icon--cloudy ${className}`}
          style={style}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path
            d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"
            fill="#e2e8f0"
            stroke="#64748b"
          />
        </svg>
      );

    case "fog":
      return (
        <svg
          className={`weather-icon weather-icon--fog ${className}`}
          style={style}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M4 8h16" stroke="#94a3b8" />
          <path d="M4 12h16" stroke="#94a3b8" />
          <path d="M4 16h16" stroke="#94a3b8" />
          <path d="M7 20h10" stroke="#94a3b8" />
        </svg>
      );

    case "drizzle":
      return (
        <svg
          className={`weather-icon weather-icon--drizzle ${className}`}
          style={style}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path
            d="M17.5 16H9a6 6 0 1 1 5.71-7.8h1.79a3.8 3.8 0 1 1 1 7.8Z"
            fill="#e2e8f0"
            stroke="#64748b"
          />
          <path d="M8 19v1" stroke="#38bdf8" strokeWidth="2.5" />
          <path d="M12 19v1" stroke="#38bdf8" strokeWidth="2.5" />
          <path d="M16 19v1" stroke="#38bdf8" strokeWidth="2.5" />
        </svg>
      );

    case "rain":
      return (
        <svg
          className={`weather-icon weather-icon--rain ${className}`}
          style={style}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path
            d="M17.5 15H9a6 6 0 1 1 5.71-7.8h1.79a3.8 3.8 0 1 1 1 7.8Z"
            fill="#cbd5e1"
            stroke="#475569"
          />
          <path d="M9 18l-1.5 3" stroke="#0284c7" strokeWidth="2.2" />
          <path d="M13 18l-1.5 3" stroke="#0284c7" strokeWidth="2.2" />
          <path d="M17 18l-1.5 3" stroke="#0284c7" strokeWidth="2.2" />
        </svg>
      );

    case "storm":
      return (
        <svg
          className={`weather-icon weather-icon--storm ${className}`}
          style={style}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path
            d="M17.5 14H9a6 6 0 1 1 5.71-7.8h1.79a3.8 3.8 0 1 1 1 7.8Z"
            fill="#94a3b8"
            stroke="#334155"
          />
          <path
            d="M13 13l-3 5h3l-1.5 4"
            fill="#f59e0b"
            stroke="#d97706"
            strokeWidth="2"
            strokeLinejoin="miter"
          />
        </svg>
      );

    case "snow":
      return (
        <svg
          className={`weather-icon weather-icon--snow ${className}`}
          style={style}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path
            d="M17.5 15H9a6 6 0 1 1 5.71-7.8h1.79a3.8 3.8 0 1 1 1 7.8Z"
            fill="#e2e8f0"
            stroke="#64748b"
          />
          <circle cx="8" cy="19" r="1" fill="#38bdf8" />
          <circle cx="12" cy="20" r="1" fill="#38bdf8" />
          <circle cx="16" cy="19" r="1" fill="#38bdf8" />
        </svg>
      );

    default:
      return (
        <svg
          className={`weather-icon weather-icon--unknown ${className}`}
          style={style}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="9" stroke="#94a3b8" strokeDasharray="4 4" />
          <path d="M12 8v4" stroke="#94a3b8" />
          <circle cx="12" cy="16" r="0.5" fill="#94a3b8" />
        </svg>
      );
  }
}
