import type { TimeOfDay } from "../../logic/timeOfDay";
import type { WeatherCondition } from "../../logic/weatherCode";
import { BACKGROUND_ASSETS } from "../../logic/backgroundRegistry";

export type WeatherAtmosphereProps = {
  condition: WeatherCondition;
  timeOfDay: TimeOfDay;
  hasCloudOverlay: boolean;
  hasRainOverlay: boolean;
};

export function WeatherAtmosphere({
  condition,
  timeOfDay,
  hasCloudOverlay,
  hasRainOverlay,
}: WeatherAtmosphereProps) {
  const isNight = timeOfDay === "night";
  const isEvening = timeOfDay === "evening";
  const isDawn = timeOfDay === "dawn";

  return (
    <div
      className={`weather-atmosphere weather-atmosphere--${condition} weather-atmosphere--${timeOfDay}`}
    >
      {/* Night Sky: Subtle Pinpoint Starfield (visible on clear & lightly cloudy nights) */}
      <div
        className={`atmosphere-stars ${
          isNight && (condition === "clear" || condition === "cloudy")
            ? "is-visible"
            : ""
        }`}
        aria-hidden="true"
      />

      {/* Sun / Moon Atmosphere Glow */}
      <div
        className={`atmosphere-celestial-glow atmosphere-celestial-glow--${timeOfDay}`}
        aria-hidden="true"
      />

      {/* Cloud Overlay Asset */}
      <img
        className={`cloud-overlay ${hasCloudOverlay ? "is-visible" : ""}`}
        src={BACKGROUND_ASSETS.cloudOverlay}
        alt=""
        aria-hidden="true"
      />

      {/* Background Rain Layer: fine droplets, slower continuous flow, blurred depth (3–4px parallax) */}
      {hasRainOverlay && (
        <div className="rain-container rain-container--bg" aria-hidden="true">
          <div className="rain-track rain-track--bg">
            <div className="rain-tile" />
            <div className="rain-tile" />
          </div>
        </div>
      )}

      {/* Golden Hour / Sunset Horizon Glow */}
      <div
        className={`atmosphere-horizon-glow ${
          isEvening ? "is-evening" : isDawn ? "is-dawn" : ""
        }`}
        aria-hidden="true"
      />
    </div>
  );
}