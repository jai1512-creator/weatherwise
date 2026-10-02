import * as THREE from "three";

/**
 * Converts a latitude/longitude pair (in degrees) into a Vector3 position
 * on the surface of a Three.js SphereGeometry textured with an equirectangular world map.
 *
 * In Three.js SphereGeometry standard coordinates:
 * - Latitude [-90°, +90°]: maps from South Pole (y = -radius) to North Pole (y = +radius)
 * - Longitude [-180°, +180°]:
 *     u = 0.00 (-180° Date Line): x = -radius, z = 0
 *     u = 0.25 (-90° Americas):   x = 0, z = +radius
 *     u = 0.50 (0° Greenwich):    x = +radius, z = 0
 *     u = 0.75 (+90° Asia/India): x = 0, z = -radius
 *     u = 1.00 (+180° Date Line): x = -radius, z = 0
 *
 * Formula:
 * x = radius * cos(lat) * cos(lon)
 * y = radius * sin(lat)
 * z = -radius * cos(lat) * sin(lon)
 */
export function latLngToVector3(latitude: number, longitude: number, radius: number): THREE.Vector3 {
  const latRad = latitude * (Math.PI / 180);
  const lonRad = longitude * (Math.PI / 180);

  const x = radius * Math.cos(latRad) * Math.cos(lonRad);
  const y = radius * Math.sin(latRad);
  const z = -radius * Math.cos(latRad) * Math.sin(lonRad);

  return new THREE.Vector3(x, y, z);
}
