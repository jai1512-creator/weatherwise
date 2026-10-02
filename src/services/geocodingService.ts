import type { Location } from "../types/location";

type ScoredLocation = Location & { score: number };

// Open-Meteo geocoding covers cities/towns/postal codes with population data
async function searchCities(query: string): Promise<ScoredLocation[]> {
  try {
    const response = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=6&language=en&format=json`,
    );
    if (!response.ok) return [];
    const data = await response.json();
    return (data.results ?? []).map((result: Record<string, unknown>) => {
      const admin1 = result.admin1 ? String(result.admin1) : undefined;
      const admin2 = result.admin2 ? String(result.admin2) : undefined;
      const regionParts = [admin2, admin1].filter(Boolean) as string[];
      const region = regionParts.filter((v, i, a) => a.indexOf(v) === i).join(", ") || undefined;
      const country = result.country ? String(result.country) : undefined;
      const population = Number(result.population) || 0;
      // Population-weighted score (0-95)
      const score = population > 0 ? Math.min(95, 30 + Math.log10(population) * 12) : 35;

      return {
        name: String(result.name),
        latitude: Number(result.latitude),
        longitude: Number(result.longitude),
        region,
        country,
        score,
      };
    });
  } catch {
    return [];
  }
}

// Nominatim (OpenStreetMap) covers streets, neighbourhoods, landmarks, and fine-grained address details
async function searchPlaces(query: string): Promise<ScoredLocation[]> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&addressdetails=1&limit=6`,
      { headers: { Accept: "application/json", "User-Agent": "WeatherWise-App/1.0" } },
    );
    if (!response.ok) return [];
    const data = await response.json();
    return (data ?? []).map((result: Record<string, unknown>) => {
      const address = (result.address ?? {}) as Record<string, unknown>;
      const locality =
        (address.road as string) ||
        (address.pedestrian as string) ||
        (address.railway as string) ||
        (address.neighbourhood as string) ||
        (address.suburb as string) ||
        (address.amenity as string);
      const city =
        (address.city as string) ||
        (address.town as string) ||
        (address.village as string) ||
        (address.municipality as string) ||
        (address.city_district as string);
      const state =
        (address.state as string) ||
        (address.state_district as string) ||
        (address.region as string) ||
        (address.province as string);
      const country = address.country ? String(address.country) : undefined;
      const displayName = String(result.display_name ?? "");

      let name = locality || city || displayName.split(",")[0] || "Unknown place";
      let region: string | undefined = state;

      // Prefer structured city/locality + state/region + country
      if (locality && city && !locality.toLowerCase().includes(city.toLowerCase())) {
        name = `${locality}, ${city}`;
        region = state;
      } else if (!locality && city && state) {
        name = city;
        region = state;
      }

      const importance = Number(result.importance) || 0.3;
      let score = importance * 100;
      if (city && state && country) score += 10;

      return {
        name,
        latitude: Number(result.lat),
        longitude: Number(result.lon),
        region: region || undefined,
        country,
        score,
      };
    });
  } catch {
    return [];
  }
}

function dedupeAndRank(locations: ScoredLocation[], query: string): Location[] {
  const queryLower = query.toLowerCase().trim();
  const queryTokens = queryLower.split(/[,\s]+/).filter((t) => t.length > 2);

  // Boost locations that match specific query tokens (e.g. searching "Park Street, Kolkata" or "London, UK")
  for (const loc of locations) {
    const locText = `${loc.name} ${loc.region ?? ""} ${loc.country ?? ""}`.toLowerCase();
    for (const token of queryTokens) {
      if (locText.includes(token)) {
        loc.score += 20;
      }
    }
  }

  // Sort by highest score first
  locations.sort((a, b) => b.score - a.score);

  const seen = new Set<string>();
  const unique: Location[] = [];
  for (const location of locations) {
    const key = `${location.latitude.toFixed(2)},${location.longitude.toFixed(2)}`;
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push({
      name: location.name,
      latitude: location.latitude,
      longitude: location.longitude,
      region: location.region,
      country: location.country,
    });
  }
  return unique;
}

export async function searchLocations(query: string): Promise<Location[]> {
  if (!query.trim()) return [];

  const [cities, places] = await Promise.allSettled([searchCities(query), searchPlaces(query)]);

  const cityResults = cities.status === "fulfilled" ? cities.value : [];
  const placeResults = places.status === "fulfilled" ? places.value : [];

  if (cities.status === "rejected" && places.status === "rejected") {
    throw new Error("Unable to search locations.");
  }

  return dedupeAndRank([...cityResults, ...placeResults], query).slice(0, 8);
}