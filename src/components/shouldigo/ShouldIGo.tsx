import { useState } from "react";
import { createRecommendation } from "../../logic/shouldIGoEngine";
import { searchLocations } from "../../services/geocodingService";
import { fetchWeatherForecast } from "../../services/weatherService";
import type { Location } from "../../types/location";
import type { Plan, Recommendation as RecommendationType } from "../../types/plan";
import type { CurrentWeather, WeatherForecast } from "../../types/weather";
import { PlanForm } from "./PlanForm";
import { PlanSummary } from "./PlanSummary";
import { Recommendation } from "./Recommendation";

export type ShouldIGoProps = {
  currentLocation?: Location | null;
  forecast?: WeatherForecast | null;
  weather?: CurrentWeather | null;
};

export function ShouldIGo({
  currentLocation,
  forecast,
  weather,
}: ShouldIGoProps) {
  const [plan, setPlan] = useState<Plan | null>(null);
  const [customRecommendation, setCustomRecommendation] =
    useState<RecommendationType | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evalError, setEvalError] = useState<string | null>(null);

  const activeWeather = forecast ?? weather ?? null;

  const handlePlanSubmit = async (submittedPlan: Plan) => {
    setPlan(submittedPlan);
    setEvalError(null);

    // If destination is specified and different from the current location
    const destinationQuery = submittedPlan.destination?.trim();
    const isDifferentLocation =
      destinationQuery &&
      currentLocation &&
      !currentLocation.name.toLowerCase().includes(destinationQuery.toLowerCase()) &&
      !destinationQuery.toLowerCase().includes(currentLocation.name.toLowerCase());

    if (isDifferentLocation) {
      setIsEvaluating(true);
      try {
        const matches = await searchLocations(destinationQuery);
        if (matches.length > 0) {
          const destLocation = matches[0];
          const destForecast = await fetchWeatherForecast(destLocation);
          const rec = createRecommendation(
            submittedPlan,
            destForecast,
            destLocation.name,
          );
          setCustomRecommendation(rec);
        } else {
          // If geocoding fails to find destination, evaluate on active forecast with warning
          const rec = createRecommendation(
            submittedPlan,
            activeWeather,
            currentLocation?.name,
          );
          setCustomRecommendation({
            ...rec,
            factors: [
              `Could not pinpoint "${destinationQuery}"; evaluating based on current area weather.`,
              ...rec.factors,
            ],
          });
        }
      } catch {
        setEvalError("Could not retrieve forecast for the specified destination.");
        const rec = createRecommendation(
          submittedPlan,
          activeWeather,
          currentLocation?.name,
        );
        setCustomRecommendation(rec);
      } finally {
        setIsEvaluating(false);
      }
    } else {
      // Evaluate with currently loaded forecast
      setCustomRecommendation(null);
    }
  };

  const defaultRecommendation = plan
    ? createRecommendation(plan, activeWeather, currentLocation?.name)
    : null;

  const finalRecommendation = customRecommendation ?? defaultRecommendation;

  return (
    <section className="should-i-go" id="should-i-go" aria-label="Activity planner">
      <div className="should-i-go__header">
        <p className="eyebrow">Outdoor Intelligence</p>
        <h2>Should I Go?</h2>
        <p className="should-i-go__lead">
          Plan your walk, run, or outdoor gathering up to 7 days in advance. We
          evaluate forecast precipitation, apparent temperature, and wind against
          activity comfort limits.
        </p>
      </div>

      <PlanForm
        onSubmit={(p) => void handlePlanSubmit(p)}
        defaultDestination={currentLocation?.name ?? ""}
        isEvaluating={isEvaluating}
      />

      {evalError && (
        <p className="plan-error" role="alert">
          {evalError}
        </p>
      )}

      {plan && (
        <div className="should-i-go__result">
          <PlanSummary plan={plan} />
          {finalRecommendation && (
            <Recommendation recommendation={finalRecommendation} />
          )}
        </div>
      )}
    </section>
  );
}
