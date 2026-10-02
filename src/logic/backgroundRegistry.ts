import type { WeatherCondition } from "./weatherCode";
import type { TimeOfDay } from "./timeOfDay";

export type ParticleType = "rain" | "storm" | "snow" | "fog" | "sunlight";

export type BackgroundConfig = {
  primaryAssetType: "video" | "image";
  primaryAssetSrc: string;
  hasCloudOverlay: boolean;
  hasRainOverlay: boolean;
  colorGradingClass: string;
  lightingOverlayClass: string;
  particleType?: ParticleType;
  condition: WeatherCondition;
  timeOfDay: TimeOfDay;
};

const base = import.meta.env.BASE_URL || "/";
const cleanBase = base.endsWith("/") ? base : `${base}/`;

/**
 * Standardized local asset paths
 */
export const BACKGROUND_ASSETS = {
  clearSky: `${cleanBase}backgrounds/clear-sky.png`,
  partlyCloudyVideo: `${cleanBase}backgrounds/partly-cloudy.mp4`,
  cloudOverlay: `${cleanBase}backgrounds/cloud-overlay.png`,
  rainOverlay: `${cleanBase}backgrounds/rain-overlay.png`,
} as const;

/**
 * Resolves the complete atmospheric recipe for any weather condition and astronomical time-of-day.
 * Intelligent CSS color grading and layered transparent overlays adapt the base assets
 * seamlessly to create distinct cinematic environments.
 */
export function resolveBackgroundConfig(
  condition?: WeatherCondition,
  timeOfDay: TimeOfDay = "day",
  isDefault = false,
): BackgroundConfig {
  if (isDefault || !condition) {
    return {
      primaryAssetType: "video",
      primaryAssetSrc: BACKGROUND_ASSETS.partlyCloudyVideo,
      hasCloudOverlay: false,
      hasRainOverlay: false,
      colorGradingClass: "grade-default",
      lightingOverlayClass: "lighting-day",
      condition: "cloudy",
      timeOfDay: "day",
    };
  }

  // CLEAR SKY
  if (condition === "clear") {
    return {
      primaryAssetType: "image",
      primaryAssetSrc: BACKGROUND_ASSETS.clearSky,
      hasCloudOverlay: false,
      hasRainOverlay: false, // Must NOT show rain or clouds during clear
      colorGradingClass: `grade-clear-${timeOfDay}`,
      lightingOverlayClass: `lighting-${timeOfDay}`,
      particleType: "sunlight",
      condition,
      timeOfDay,
    };
  }

  // PARTLY CLOUDY
  if (condition === "cloudy") {
    return {
      primaryAssetType: "video",
      primaryAssetSrc: BACKGROUND_ASSETS.partlyCloudyVideo,
      hasCloudOverlay: true,
      hasRainOverlay: false,
      colorGradingClass: `grade-cloudy-${timeOfDay}`,
      lightingOverlayClass: `lighting-${timeOfDay}`,
      condition,
      timeOfDay,
    };
  }

  // RAIN & DRIZZLE
  if (condition === "rain" || condition === "drizzle") {
    return {
      primaryAssetType: "video",
      primaryAssetSrc: BACKGROUND_ASSETS.partlyCloudyVideo,
      hasCloudOverlay: true,
      hasRainOverlay: true,
      colorGradingClass: `grade-rain-${timeOfDay}`,
      lightingOverlayClass: `lighting-rain-${timeOfDay}`,
      particleType: "rain",
      condition,
      timeOfDay,
    };
  }

  // THUNDERSTORM
  if (condition === "storm") {
    return {
      primaryAssetType: "video",
      primaryAssetSrc: BACKGROUND_ASSETS.partlyCloudyVideo,
      hasCloudOverlay: true,
      hasRainOverlay: true,
      colorGradingClass: `grade-storm-${timeOfDay}`,
      lightingOverlayClass: `lighting-storm-${timeOfDay}`,
      particleType: "storm",
      condition,
      timeOfDay,
    };
  }

  // SNOW
  if (condition === "snow") {
    return {
      primaryAssetType: "video",
      primaryAssetSrc: BACKGROUND_ASSETS.partlyCloudyVideo,
      hasCloudOverlay: true,
      hasRainOverlay: false,
      colorGradingClass: `grade-snow-${timeOfDay}`,
      lightingOverlayClass: `lighting-snow-${timeOfDay}`,
      particleType: "snow",
      condition,
      timeOfDay,
    };
  }

  // FOG
  if (condition === "fog") {
    return {
      primaryAssetType: "video",
      primaryAssetSrc: BACKGROUND_ASSETS.partlyCloudyVideo,
      hasCloudOverlay: true,
      hasRainOverlay: false,
      colorGradingClass: timeOfDay === "dawn" ? "grade-fog-morning" : `grade-fog-${timeOfDay}`,
      lightingOverlayClass: timeOfDay === "dawn" ? "lighting-fog-morning" : `lighting-fog-${timeOfDay}`,
      particleType: "fog",
      condition,
      timeOfDay,
    };
  }

  // Default fallback
  return {
    primaryAssetType: "video",
    primaryAssetSrc: BACKGROUND_ASSETS.partlyCloudyVideo,
    hasCloudOverlay: false,
    hasRainOverlay: false,
    colorGradingClass: "grade-default",
    lightingOverlayClass: "lighting-day",
    condition,
    timeOfDay,
  };
}
