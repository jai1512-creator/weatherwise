import { useState } from "react";
import { searchLocations } from "../services/geocodingService";
import type { Location } from "../types/location";

export function useLocationSearch() {
  const [results, setResults] = useState<Location[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const search = async (query: string) => { setIsSearching(true); try { setResults(await searchLocations(query)); } finally { setIsSearching(false); } };
  return { results, search, isSearching, clearResults: () => setResults([]) };
}

