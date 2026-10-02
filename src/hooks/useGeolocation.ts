import { useState } from "react";
import { getBrowserLocation } from "../services/locationService";
import type { Location } from "../types/location";

export function useGeolocation() {
  const [isLocating, setIsLocating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const locate = async (): Promise<Location | null> => { setIsLocating(true); setError(null); try { return await getBrowserLocation(); } catch (cause) { setError(cause instanceof Error ? cause.message : "Unable to access your location."); return null; } finally { setIsLocating(false); } };
  return { locate, isLocating, error };
}

