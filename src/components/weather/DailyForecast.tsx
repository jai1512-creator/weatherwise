import { getUpcomingDays } from "../../logic/forecastAnalyzer";
import { getWeatherLabel } from "../../logic/weatherCode";
import type { DailyWeather } from "../../types/weather";
import { formatDay } from "../../utils/dateUtils";
import { formatTemperature } from "../../utils/formatTemperature";
import { WeatherIcon } from "./WeatherIcon";

export function DailyForecast({ days }: { days: DailyWeather[] }) {
  const upcoming = getUpcomingDays(days, 7);

  if (!upcoming.length) return null;

  // Calculate overall min and max for proportional range bar
  const globalMin = Math.min(...upcoming.map((d) => d.temperatureMin));
  const globalMax = Math.max(...upcoming.map((d) => d.temperatureMax));
  const tempSpan = Math.max(1, globalMax - globalMin);

  return (
    <section className="forecast-section daily-forecast" id="forecast" aria-label="7-day forecast">
      <div className="forecast-header">
        <div className="forecast-header__titles">
          <p className="eyebrow">Extended outlook</p>
          <h2 className="forecast-header__title">7-Day Forecast</h2>
        </div>
      </div>

      <div className="daily-list" role="list">
        {upcoming.map((day, index) => {
          const isToday = index === 0;
          const dayName = isToday ? "Today" : formatDay(day.date);
          const conditionLabel = getWeatherLabel(day.weatherCode);
          const precip = day.precipitationProbabilityMax ?? 0;

          // Compute range bar relative offsets
          const leftPercent = Math.max(0, ((day.temperatureMin - globalMin) / tempSpan) * 100);
          const rightPercent = Math.min(100, ((day.temperatureMax - globalMin) / tempSpan) * 100);
          const barWidth = Math.max(8, rightPercent - leftPercent);

          return (
            <article key={day.date} className={`daily-item ${isToday ? "daily-item--today" : ""}`} role="listitem">
              <div className="daily-item__day-col">
                <span className="daily-item__day">{dayName}</span>
                <span className="daily-item__condition">{conditionLabel}</span>
              </div>

              <div className="daily-item__visual-col">
                <WeatherIcon weatherCode={day.weatherCode} size={28} />
                {precip > 15 && <span className="daily-item__precip">💧 {precip}%</span>}
              </div>

              <div className="daily-item__temp-col">
                <span className="daily-item__temp-min">{formatTemperature(day.temperatureMin)}</span>
                <div className="daily-item__bar-track" aria-hidden="true">
                  <div
                    className="daily-item__bar-range"
                    style={{
                      left: `${leftPercent}%`,
                      width: `${barWidth}%`,
                    }}
                  />
                </div>
                <span className="daily-item__temp-max">{formatTemperature(day.temperatureMax)}</span>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
