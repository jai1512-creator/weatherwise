import { useRef } from "react";
import { getUpcomingHours } from "../../logic/forecastAnalyzer";
import { getConciseWeatherLabel } from "../../logic/weatherCode";
import type { HourlyWeather } from "../../types/weather";
import { formatTime } from "../../utils/dateUtils";
import { formatTemperature } from "../../utils/formatTemperature";
import { WeatherIcon } from "./WeatherIcon";

export function HourlyForecast({ hours }: { hours: HourlyWeather[] }) {
  const upcoming = getUpcomingHours(hours, 24);
  const railRef = useRef<HTMLDivElement>(null);

  if (!upcoming.length) return null;

  const scroll = (direction: "left" | "right") => {
    if (railRef.current) {
      const scrollAmount = direction === "left" ? -340 : 340;
      railRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <section className="forecast-section hourly-forecast" aria-label="Hourly forecast">
      <div className="forecast-header">
        <div className="forecast-header__titles">
          <p className="eyebrow">Hourly outlook</p>
          <h2 className="forecast-header__title">Hourly Forecast</h2>
        </div>
        <div className="forecast-controls" aria-label="Forecast rail navigation">
          <button
            type="button"
            className="forecast-nav-btn"
            onClick={() => scroll("left")}
            aria-label="Scroll hourly forecast left"
          >
            ‹
          </button>
          <button
            type="button"
            className="forecast-nav-btn"
            onClick={() => scroll("right")}
            aria-label="Scroll hourly forecast right"
          >
            ›
          </button>
        </div>
      </div>

      <div className="hourly-rail-container">
        <div className="hourly-scroll" ref={railRef} role="region" aria-label="Hourly weather rail">
          {upcoming.map((hour, index) => {
            const isNow = index === 0;
            const conciseCondition = getConciseWeatherLabel(hour.weatherCode);
            const precipProb = hour.precipitationProbability ?? 0;

            return (
              <article
                key={hour.time}
                className={`hourly-card ${isNow ? "hourly-card--now" : ""}`}
                tabIndex={0}
              >
                <div className="hourly-card__time-wrapper">
                  <span className={`hourly-card__time ${isNow ? "hourly-card__time--active" : ""}`}>
                    {isNow ? "Now" : formatTime(hour.time)}
                  </span>
                </div>

                <div className="hourly-card__icon-wrapper">
                  <WeatherIcon weatherCode={hour.weatherCode} size={30} />
                </div>

                <strong className="hourly-card__temp">
                  {formatTemperature(hour.temperature)}
                </strong>

                <span className="hourly-card__condition" title={conciseCondition}>
                  {conciseCondition}
                </span>

                <div className="hourly-card__precip-wrapper">
                  {precipProb > 5 ? (
                    <span className="hourly-card__precip">💧 {precipProb}%</span>
                  ) : (
                    <span className="hourly-card__precip hourly-card__precip--dry">•</span>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
