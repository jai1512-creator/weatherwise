import { useState } from "react";
import { WeatherBackground } from "./components/environment/WeatherBackground";
import { EarthScene } from "./components/globe/EarthScene";
import { AppShell } from "./components/layout/AppShell";
import { LocationSearch } from "./components/search/LocationSearch";
import { LocationTransition } from "./components/search/LocationTransition";
import { ShouldIGo } from "./components/shouldigo/ShouldIGo";
import { DailyForecast } from "./components/weather/DailyForecast";
import { HourlyForecast } from "./components/weather/HourlyForecast";
import { WeatherHero } from "./components/weather/WeatherHero";
import { useGeolocation } from "./hooks/useGeolocation";
import { useWeather } from "./hooks/useWeather";
import type { Location } from "./types/location";
import "./App.css";
import "./styles/responsive.css";

function App() {
  const [location, setLocation] = useState<Location | null>(null);
  const [, setHasArrived] = useState(false);
  const { locate, isLocating, error: locationError } = useGeolocation();
  const { forecast, isLoading, error: weatherError } = useWeather(location);

  const requestCurrentLocation = async () => {
    const currentLocation = await locate();
    if (currentLocation) {
      setHasArrived(false);
      setLocation(currentLocation);
    }
  };

  const selectLocation = (nextLocation: Location) => {
    setHasArrived(false);
    setLocation(nextLocation);
  };

  const error = locationError ?? weatherError;

  return (
    <AppShell>
      {/* 1. Cinematic Dynamic Weather & Time Background */}
      <WeatherBackground
        weatherCode={forecast?.current.weatherCode}
        timeOfDay={forecast?.timeOfDay}
      />

      {/* 2. Floating Search Header */}
      <LocationSearch
        onSelect={selectLocation}
        onLocate={() => void requestCurrentLocation()}
        isLocating={isLocating}
      />

      <LocationTransition active={isLoading} />

      {error && (
        <p className="app-error" role="alert">
          {error}
        </p>
      )}

      {/* 3. Current Weather Hero (Main focal point over the atmosphere) */}
      <WeatherHero
        location={location}
        weather={forecast?.current ?? null}
      />

      {/* 4. Dark Atmospheric Section Transition */}
      <div className="atmospheric-divider" aria-hidden="true" />

      {/* 5. 3D Planetary Observer Globe */}
      <div id="globe" className="section-anchor">
        <EarthScene
          location={location}
          onArrived={() => setHasArrived(true)}
        />
      </div>

      {/* 6. Forecast Hub (24h Hourly Rail + 7-Day Outlook) */}
      {forecast && (
        <div id="forecast" className="forecast-hub section-anchor">
          <HourlyForecast hours={forecast.hourly} />
          <DailyForecast days={forecast.daily} />
        </div>
      )}

      {/* 7. Signature Outdoor Intelligence Engine */}
      <ShouldIGo
        currentLocation={location}
        forecast={forecast}
        weather={forecast?.current ?? null}
      />
    </AppShell>
  );
}

export default App;
