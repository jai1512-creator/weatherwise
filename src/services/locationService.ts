import type { Location } from "../types/location";

export async function getBrowserLocation(): Promise<Location> {
  if (!navigator.geolocation) {
    throw new Error("Geolocation is not supported by this browser.");
  }

  const position = await new Promise<GeolocationPosition>((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      resolve,
      () => reject(new Error("Unable to access your location.")),
      { enableHighAccuracy: false, timeout: 10000 },
    );
  });

  const { latitude, longitude } = position.coords;

  try {
    const response = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`,
    );

    const data = await response.json();

    const city =
      data.locality ||
      data.city ||
      data.principalSubdivision ||
      "Current location";

    const state = data.principalSubdivision || "";

    const name =
      state && city !== state
        ? `${city}, ${state}`
        : city;

    const country = data.countryName || undefined;

    return {
      name,
      latitude,
      longitude,
      region: state || undefined,
      country,
    };
  } catch (error) {
    console.error("Reverse geocoding failed:", error);

    return {
      name: "Current location",
      latitude,
      longitude,
    };
  }
}