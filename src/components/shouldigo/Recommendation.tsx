import type { Recommendation as RecommendationData } from "../../types/plan";
import { formatTemperature } from "../../utils/formatTemperature";
import { formatWind } from "../../utils/formatWind";
import { WeatherIcon } from "../weather/WeatherIcon";
import { RecommendationFactors } from "./RecommendationFactors";

export function Recommendation({
  recommendation,
}: {
  recommendation: RecommendationData;
}) {
  const verdictTitles = {
    good: "Good to go",
    caution: "Proceed with caution",
    avoid: "Better to reschedule / avoid",
  };

  const snapshot = recommendation.forecast;

  return (
    <article
      className={`recommendation recommendation--${recommendation.verdict}`}
      aria-label="Recommendation result"
    >
      <header className="recommendation__header">
        <span
          className={`recommendation__badge recommendation__badge--${recommendation.verdict}`}
        >
          {verdictTitles[recommendation.verdict]}
        </span>
        <h3 className="recommendation__summary">{recommendation.summary}</h3>
      </header>

      {/* 1. Reasoning & Factors */}
      <section className="recommendation__section">
        <h4 className="recommendation__section-title">Evaluation Factors</h4>
        <RecommendationFactors
          factors={recommendation.factors}
          detailedFactors={recommendation.detailedFactors}
        />
      </section>

      {/* 2. Relevant Forecast Information at target time */}
      {snapshot && (
        <section className="recommendation__section recommendation__metrics">
          <h4 className="recommendation__section-title">
            Forecast Snapshot for Scheduled Time
          </h4>
          <div className="recommendation__grid">
            <div className="recommendation__metric-card">
              <span className="metric-label">Condition</span>
              <div className="metric-value-row">
                <WeatherIcon weatherCode={snapshot.weatherCode} size={22} />
                <span className="metric-value">{snapshot.conditionLabel}</span>
              </div>
            </div>

            <div className="recommendation__metric-card">
              <span className="metric-label">Temperature</span>
              <span className="metric-value">
                {formatTemperature(snapshot.temperature)}
                <small className="metric-sub">
                  {" "}
                  (Feels like {formatTemperature(snapshot.apparentTemperature)})
                </small>
              </span>
            </div>

            <div className="recommendation__metric-card">
              <span className="metric-label">Precipitation</span>
              <span className="metric-value">
                {snapshot.precipitationProbability}%
                {snapshot.precipitation > 0 && (
                  <small className="metric-sub">
                    {" "}
                    (~{snapshot.precipitation.toFixed(1)} mm)
                  </small>
                )}
              </span>
            </div>

            <div className="recommendation__metric-card">
              <span className="metric-label">Wind</span>
              <span className="metric-value">
                {formatWind(snapshot.windSpeed)}
              </span>
            </div>
          </div>
        </section>
      )}

      {/* 3. Transparent Confidence Note */}
      {recommendation.confidenceNote && (
        <footer className="recommendation__confidence">
          <span className="confidence-icon" aria-hidden="true">
            ℹ
          </span>
          <p className="confidence-text">{recommendation.confidenceNote}</p>
        </footer>
      )}
    </article>
  );
}
