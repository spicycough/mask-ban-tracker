import type { LatLngLike } from "./types";

export type Coordinates = {
  latitude: number;
  longitude: number;
};

const normalizeCoords = (coords: LatLngLike) => {
  let lat: number;
  let lon: number;
  if (Array.isArray(coords)) {
    [lat, lon] = coords;
  } else if ("lng" in coords) {
    [lat, lon] = [coords.lat, coords.lng];
  } else {
    [lat, lon] = [coords.lat, coords.lon];
  }

  return {
    latitude: lat,
    longitude: lon,
  } as Coordinates;
};

export const formatCoords = (coords: LatLngLike) => {
  const { latitude, longitude } = normalizeCoords(coords);
  if (!latitude || !longitude) {
    return {
      latitude: "?",
      longitude: "?",
    };
  }

  console.log(`type of latitude: ${typeof latitude}`);

  let lat: string;
  if (latitude < 0) {
    lat = `${Math.abs(latitude).toFixed(2)}°S`;
  } else {
    lat = `${latitude.toFixed(2)}°N`;
  }

  let lon: string;
  if (longitude < 0) {
    lon = `${Math.abs(longitude).toFixed(2)}°W`;
  } else {
    lon = `${longitude.toFixed(2)}°E`;
  }

  return {
    latitude: lat,
    longitude: lon,
  };
};
