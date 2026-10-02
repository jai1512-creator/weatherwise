import type { DetailedFactor } from "../../types/plan";

export type RecommendationFactorsProps = {
  factors: string[];
  detailedFactors?: DetailedFactor[];
};

export function RecommendationFactors({
  factors,
  detailedFactors,
}: RecommendationFactorsProps) {
  if (detailedFactors && detailedFactors.length > 0) {
    return (
      <ul className="recommendation-factors" aria-label="Recommendation factor details">
        {detailedFactors.map((item) => {
          const icon =
            item.kind === "positive" ? "✓" : item.kind === "critical" ? "✕" : "⚠";
          return (
            <li
              key={item.message}
              className={`recommendation-factor recommendation-factor--${item.kind}`}
            >
              <span className="factor-badge" aria-hidden="true">
                {icon}
              </span>
              <span className="factor-text">{item.message}</span>
            </li>
          );
        })}
      </ul>
    );
  }

  return (
    <ul className="recommendation-factors">
      {factors.map((factor) => (
        <li key={factor} className="recommendation-factor">
          <span className="factor-badge" aria-hidden="true">
            •
          </span>
          <span className="factor-text">{factor}</span>
        </li>
      ))}
    </ul>
  );
}
