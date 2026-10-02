export type Activity =
  | "walk"
  | "run"
  | "picnic"
  | "outdoor-event"
  | "cycling"
  | "hiking";

export type Plan = {
  destination?: string;
  date: string;
  time: string;
  activity: Activity;
};

export type FactorKind = "positive" | "caution" | "critical";

export type DetailedFactor = {
  kind: FactorKind;
  message: string;
};

export type ForecastSnapshot = {
  temperature: number;
  apparentTemperature: number;
  humidity: number;
  precipitationProbability: number;
  precipitation: number;
  windSpeed: number;
  weatherCode: number;
  conditionLabel: string;
};

export type Recommendation = {
  verdict: "good" | "caution" | "avoid";
  summary: string;
  factors: string[];
  detailedFactors?: DetailedFactor[];
  forecast?: ForecastSnapshot;
  confidenceNote?: string;
  targetDateTimeLabel?: string;
  locationName?: string;
  activityLabel?: string;
};
