import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { latLngToVector3 } from "../../utils/geoMath";

export type LocationMarkerProps = {
  latitude: number;
  longitude: number;
  radius?: number;
  color?: string;
};

export function LocationMarker({
  latitude,
  longitude,
  radius = 2,
  color = "#14b8a6",
}: LocationMarkerProps) {
  const dotRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  // Offset slightly above globe surface to prevent z-fighting
  const position = useMemo(
    () => latLngToVector3(latitude, longitude, radius + 0.025),
    [latitude, longitude, radius],
  );

  useFrame(({ clock }) => {
    const elapsed = clock.elapsedTime;
    if (dotRef.current) {
      const pulse = 1 + Math.sin(elapsed * 5) * 0.25;
      dotRef.current.scale.setScalar(pulse);
    }
    if (ringRef.current) {
      const ringScale = 1 + ((elapsed * 2) % 2) * 0.8;
      const ringOpacity = Math.max(0, 0.6 - (((elapsed * 2) % 2) * 0.3));
      ringRef.current.scale.setScalar(ringScale);
      if (Array.isArray(ringRef.current.material)) {
        ringRef.current.material[0].opacity = ringOpacity;
      } else {
        ringRef.current.material.opacity = ringOpacity;
      }
    }
  });

  return (
    <group position={position}>
      {/* Central bright pin core */}
      <mesh>
        <sphereGeometry args={[0.035, 16, 16]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      {/* Main colored beacon (electric teal) */}
      <mesh ref={dotRef}>
        <sphereGeometry args={[0.055, 16, 16]} />
        <meshBasicMaterial color={color} transparent opacity={0.88} />
      </mesh>
      {/* Expanding pulse wave */}
      <mesh ref={ringRef}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshBasicMaterial color={color} transparent opacity={0.45} />
      </mesh>
    </group>
  );
}
