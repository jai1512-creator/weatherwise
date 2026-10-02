import type { TimeOfDay } from "../../logic/timeOfDay";
import type { ParticleType } from "../../logic/backgroundRegistry";

export type WeatherParticlesProps = {
  particleType?: ParticleType;
  timeOfDay?: TimeOfDay;
};

export function WeatherParticles({
  particleType,
  timeOfDay = "day",
}: WeatherParticlesProps) {
  if (!particleType) return null;

  return (
    <div
      className={`weather-particles weather-particles--${particleType} weather-particles--${timeOfDay}`}
      aria-hidden="true"
    >
      {/* Foreground Rain Layer: larger droplets, faster continuous flow, motion blur & streak accents (7–10px parallax) */}
      {(particleType === "rain" || particleType === "storm") && (
        <div className="rain-container rain-container--fg" aria-hidden="true">
          <div className="rain-track rain-track--fg">
            <div className="rain-tile" />
            <div className="rain-tile" />
          </div>
          <div className="rain-streaks-accent" />
        </div>
      )}

      {/* Atmospheric Lightning Illumination (Storm) */}
      {particleType === "storm" && (
        <div className="lightning-flash" aria-hidden="true" />
      )}

      {/* Multi-layer Snowfall */}
      {particleType === "snow" && (
        <>
          <div className="snow-layer snow-layer--back" />
          <div className="snow-layer snow-layer--front" />
        </>
      )}

      {/* Multi-layer Fog Mist */}
      {particleType === "fog" && (
        <>
          <div className="fog-layer fog-layer--deep" />
          <div className="fog-layer fog-layer--front" />
        </>
      )}

      {/* Clear Sky Sun Bloom */}
      {particleType === "sunlight" && (
        <div className="sun-bloom" />
      )}
    </div>
  );
}
