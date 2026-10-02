import { useEffect, useState } from "react";
import { fetchWeatherForecast } from "../services/weatherService";
import type { Location } from "../types/location";
import type { WeatherForecast } from "../types/weather";

type WeatherState = { forecast: WeatherForecast | null; locationKey: string | null; error: string | null };
const getLocationKey = (location: Location) => `${location.latitude},${location.longitude}`;

export function useWeather(location: Location | null) {
  const [state, setState] = useState<WeatherState>({ forecast: null, locationKey: null, error: null });
  const requestedKey = location ? getLocationKey(location) : null;
  useEffect(() => {
    if (!location || !requestedKey) return;
    let active = true;
    fetchWeatherForecast(location).then((forecast) => {
      if (active) setState({ forecast, locationKey: requestedKey, error: null });
    }).catch((cause) => {
      if (active) setState({ forecast: null, locationKey: requestedKey, error: cause instanceof Error ? cause.message : "Unable to load weather." });
    });
    return () => { active = false; };
  }, [location, requestedKey]);
  const isCurrent = requestedKey === state.locationKey;
  return { forecast: isCurrent ? state.forecast : null, isLoading: Boolean(requestedKey && !isCurrent), error: isCurrent ? state.error : null };
}
