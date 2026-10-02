import { getWeatherCondition } from "../../logic/weatherCode";
import type { TimeOfDay } from "../../logic/timeOfDay";
import { BACKGROUND_ASSETS, resolveBackgroundConfig } from "../../logic/backgroundRegistry";
import { CursorParallax } from "./CursorParallax";
import { WeatherAtmosphere } from "./WeatherAtmosphere";
import { WeatherParticles } from "./WeatherParticles";
import "./WeatherBackground.css";

export type WeatherBackgroundProps = {
  weatherCode?: number;
  timeOfDay?: TimeOfDay;
};

export function WeatherBackground({
  weatherCode,
  timeOfDay = "day",
}: WeatherBackgroundProps) {
  const isDefault = weatherCode === undefined;
  const condition = isDefault ? "cloudy" : getWeatherCondition(weatherCode);
  const effectiveTimeOfDay: TimeOfDay = isDefault ? "day" : timeOfDay;

  const config = resolveBackgroundConfig(
    condition,
    effectiveTimeOfDay,
    isDefault,
  );

  const isClear = !isDefault && condition === "clear";

  return (
    <div
      className={`weather-background weather-background--${condition} weather-background--${effectiveTimeOfDay} ${config.colorGradingClass} ${
        isDefault ? "weather-background--default" : ""
      }`}
      style={{ "--rain-bg-image": `url("${BACKGROUND_ASSETS.rainOverlay}")` } as React.CSSProperties}
      aria-hidden="true"
    >
      <CursorParallax>
        {/* Layer 1: Background Media (2–3px Parallax) with smooth crossfade */}
        <div className="bg-media-container">
          {/* Clear Sky Image */}
          <img
            className={`bg-layer bg-layer--image ${isClear ? "is-active" : ""}`}
            src={BACKGROUND_ASSETS.clearSky}
            alt=""
            aria-hidden="true"
          />

          {/* Cloudy / Default Video */}
          <video
            className={`bg-layer bg-layer--video ${!isClear ? "is-active" : ""}`}
            autoPlay
            muted
            loop
            playsInline
            aria-hidden="true"
          >
            <source src={BACKGROUND_ASSETS.partlyCloudyVideo} type="video/mp4" />
          </video>
        </div>

        {/* Dynamic Solar Lighting & Color Grading Tint Layer */}
        <div
          className={`lighting-tint-layer ${config.lightingOverlayClass}`}
          aria-hidden="true"
        />

        {/* Layer 2: Atmospheric Overlays & Sky Phenomena (5–7px Parallax) */}
        <WeatherAtmosphere
          condition={condition}
          timeOfDay={effectiveTimeOfDay}
          hasCloudOverlay={config.hasCloudOverlay}
          hasRainOverlay={config.hasRainOverlay}
        />

        {/* Layer 3: Particle Effects & Illumination (8–12px Parallax) */}
        <WeatherParticles
          particleType={config.particleType}
          timeOfDay={effectiveTimeOfDay}
        />
      </CursorParallax>

      {/* Cinematic Deep Vignette */}
      <div className="cinematic-vignette" aria-hidden="true" />
    </div>
  );
}
