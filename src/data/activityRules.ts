import type { Activity } from "../types/plan";

export type ActivityRule = {
  label: string;
  minTemperature: number;
  maxTemperature: number;
  maxWind: number;
  maxPrecipProb: number;
  maxPrecipMm: number;
};

export const activityRules: Record<Activity, ActivityRule> = {
  walk: {
    label: "Walking",
    minTemperature: 4,
    maxTemperature: 34,
    maxWind: 35,
    maxPrecipProb: 35,
    maxPrecipMm: 0.5,
  },
  run: {
    label: "Running",
    minTemperature: 0,
    maxTemperature: 28,
    maxWind: 30,
    maxPrecipProb: 30,
    maxPrecipMm: 0.3,
  },
  picnic: {
    label: "Picnic",
    minTemperature: 15,
    maxTemperature: 32,
    maxWind: 22,
    maxPrecipProb: 20,
    maxPrecipMm: 0.1,
  },
  "outdoor-event": {
    label: "Outdoor Event",
    minTemperature: 12,
    maxTemperature: 34,
    maxWind: 28,
    maxPrecipProb: 25,
    maxPrecipMm: 0.2,
  },
  cycling: {
    label: "Cycling",
    minTemperature: 5,
    maxTemperature: 32,
    maxWind: 25,
    maxPrecipProb: 25,
    maxPrecipMm: 0.2,
  },
  hiking: {
    label: "Hiking",
    minTemperature: 5,
    maxTemperature: 30,
    maxWind: 32,
    maxPrecipProb: 30,
    maxPrecipMm: 0.5,
  },
};
