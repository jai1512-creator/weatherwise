import type { Location } from "../../types/location";
import type { CurrentWeather as CurrentWeatherData } from "../../types/weather";
import { CurrentWeather } from "./CurrentWeather";
import { LocationTime } from "./LocationTime";
import { WeatherStats } from "./WeatherStats";

export function WeatherHero({
  location,
  weather,
}: {
  location: Location | null;
  weather: CurrentWeatherData | null;
}) {
  const locationSubtitle = location
    ? [location.region, location.country].filter(Boolean).join(", ")
    : "Atmospheric Intelligence System";

  return (
    <section className="weather-hero" id="hero" aria-label="Current weather overview">
      <div className="weather-hero__header">
        <p className="eyebrow">{location ? "LOCATION" : "ATMOSPHERE"}</p>
        <h1 className="weather-hero__title">
          {location?.name ?? "Explore Earth's Weather"}
        </h1>
        {locationSubtitle && (
          <p className="weather-hero__subtitle">{locationSubtitle}</p>
        )}
      </div>
      {weather ? (
        <div className="weather-hero__body">
          <CurrentWeather weather={weather} />
          <LocationTime
            timezone={weather.timezone}
            timezoneAbbreviation={weather.timezoneAbbreviation}
            utcOffsetSeconds={weather.utcOffsetSeconds}
          />
          <WeatherStats weather={weather} />
        </div>
      ) : (
        <div className="weather-hero__placeholder">
          <p>Search for any city, landmark, or region to observe live atmospheric conditions.</p>
        </div>
      )}
    </section>
  );
}
