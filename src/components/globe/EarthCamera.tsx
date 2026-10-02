import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { latLngToVector3 } from "../../utils/geoMath";

export type EarthCameraProps = {
  target: { latitude: number; longitude: number } | null;
  radius?: number;
  onArrived?: () => void;
};

const IDLE_POSITION = new THREE.Vector3(0, 0, 5.5);
const ARRIVAL_THRESHOLD = 0.08;

export function EarthCamera({ target, radius = 2, onArrived }: EarthCameraProps) {
  const { camera } = useThree();
  const targetPosition = useRef(IDLE_POSITION.clone());
  const hasArrived = useRef(false);

  useEffect(() => {
    if (target) {
      const surfacePoint = latLngToVector3(target.latitude, target.longitude, radius);
      // Place camera along the ray pointing at the location from comfortable distance
      targetPosition.current = surfacePoint.clone().multiplyScalar(2.0);
      hasArrived.current = false;
    } else {
      targetPosition.current = IDLE_POSITION.clone();
      hasArrived.current = false;
    }
  }, [target, radius]);

  useFrame(() => {
    camera.position.lerp(targetPosition.current, 0.06);

    // Prevent camera from clipping through the globe interior during transit
    const minDistance = radius + 1.2;
    if (camera.position.length() < minDistance) {
      camera.position.setLength(minDistance);
    }

    camera.lookAt(0, 0, 0);

    if (!hasArrived.current && target && camera.position.distanceTo(targetPosition.current) < ARRIVAL_THRESHOLD) {
      hasArrived.current = true;
      onArrived?.();
    }
  });

  return null;
}
