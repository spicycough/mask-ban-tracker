import type { LatLngLike } from "./types";

export type Coordinates = {
  latitude: number;
  longitude: number;
};

const normalizeCoords = (coords: LatLngLike): Coordinates => {
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
  };
};

export const formatCoords = (coords: LatLngLike) => {
  const { latitude, longitude } = normalizeCoords(coords);

  let lat: string;
  if (latitude < 0) {
    lat = `${Math.fround(Math.abs(latitude))}°S`;
  } else {
    lat = `${Math.fround(latitude)}°N`;
  }

  let lon: string;
  if (longitude < 0) {
    lon = `${Math.fround(Math.abs(longitude))}°W`;
  } else {
    lon = `${Math.fround(longitude)}°E`;
  }

  return {
    latitude: lat,
    longitude: lon,
  };
};
