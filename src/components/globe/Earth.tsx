import { useRef } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import * as THREE from "three";

const EARTH_TEXTURE_URL = "https://cdn.jsdelivr.net/npm/three-globe@2.34.2/example/img/earth-day.jpg";

export function Earth({ radius = 2, spinning }: { radius?: number; spinning: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const texture = useLoader(THREE.TextureLoader, EARTH_TEXTURE_URL);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    if (spinning) {
      meshRef.current.rotation.y += delta * 0.08;
    } else if (meshRef.current.rotation.y !== 0) {
      // Snap back to the same unrotated orientation the lat/long math
      // assumes, so the marker always lands on the correct spot the
      // instant a search starts, instead of needing to track and
      // compensate for however far the idle spin had drifted.
      meshRef.current.rotation.y = 0;
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[radius, 64, 64]} />
      <meshStandardMaterial map={texture} roughness={0.9} metalness={0.05} />
    </mesh>
  );
}
