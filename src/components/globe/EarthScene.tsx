import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import { Earth } from "./Earth";
import { EarthCamera } from "./EarthCamera";
import { LocationMarker } from "./LocationMarker";
import type { Location } from "../../types/location";
import "./EarthScene.css";

export function EarthScene({
  location,
  onArrived,
}: {
  location: Location | null;
  onArrived?: () => void;
}) {
  const formattedCoords = location
    ? `${Math.abs(location.latitude).toFixed(2)}° ${location.latitude >= 0 ? "N" : "S"}, ${Math.abs(
        location.longitude,
      ).toFixed(2)}° ${location.longitude >= 0 ? "E" : "W"}`
    : null;

  return (
    <section
      className="earth-scene"
      aria-label={location ? `Globe view for ${location.name}` : "Globe view"}
    >
      <div className="earth-scene__header">
        <p className="eyebrow">Atmospheric Coordinate Focus</p>
        <h2 className="earth-scene__title">
          {location ? location.name : "Planetary Observer"}
        </h2>
      </div>

      <div className="earth-scene__canvas">
        <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
          <Suspense fallback={null}>
            <ambientLight intensity={0.75} />
            <directionalLight position={[5, 3, 5]} intensity={1.4} />
            <Stars radius={80} depth={40} count={2500} factor={2} fade speed={0.5} />
            <Earth radius={2} spinning={!location} />
            {location && (
              <LocationMarker
                latitude={location.latitude}
                longitude={location.longitude}
                radius={2}
                color="#14b8a6"
              />
            )}
            <EarthCamera target={location} radius={2} onArrived={onArrived} />
          </Suspense>
        </Canvas>
      </div>
      <p className="earth-scene__caption">
        {location ? (
          <span>
            Pinpointed at <strong>{location.name}</strong> · <span className="earth-scene__coords">{formattedCoords}</span>
          </span>
        ) : (
          <span>Interactive 3D Earth · Select a location to initiate planetary focus</span>
        )}
      </p>
    </section>
  );
}
