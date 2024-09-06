import type { ILngLatLike as LngLatLike } from "maplibre-gl";
import type { Viewport } from "solid-map-gl";
import * as v from "valibot";

const DEFAULT_ZOOM = 5;

export type Coordinates = {
  latitude: number;
  longitude: number;
};

type SimpleViewport = Required<Pick<Viewport, "zoom" | "center">>;

const ZoomSchema = v.pipe(
  v.number("Must be a number between 0 and 23"),
  v.toMinValue(0),
  v.toMaxValue(23),
);
const LatitudeSchema = v.pipe(
  v.number("Must be a number between -90 and 90"),
  v.minValue(-90),
  v.maxValue(90),
);
const LongitudeSchema = v.pipe(
  v.number("Must be a number between -180 and 180"),
  v.minValue(-180),
  v.maxValue(180),
);

const createSearchParamsSchema = (initialViewport: Viewport) => {
  const SearchParamsSchema = v.object({
    zoom: v.optional(ZoomSchema, initialViewport.zoom),
    lat: v.optional(LatitudeSchema, initialViewport.center.lat),
    lon: v.optional(LongitudeSchema, initialViewport.center.lon),
  });

  return SearchParamsSchema;
};

const parseSearchParams = (
  search: string | URLSearchParams,
  initialViewport: Viewport,
  simple?: boolean,
): SimpleViewport => {
  const params = new URLSearchParams(search);

  if (simple) {
    const zoom = params.get("zoom") ?? initialViewport.zoom;
    const latitude = params.get("lat") ?? initialViewport.center.lat;
    const longitude = params.get("lon") ?? initialViewport.center.lon;
    return {
      zoom:
        typeof zoom === "string" ? Number.parseInt(zoom) : zoom ?? DEFAULT_ZOOM,
      center: {
        latitude:
          typeof latitude === "string" ? Number.parseFloat(latitude) : latitude,
        longitude:
          typeof longitude === "string"
            ? Number.parseFloat(longitude)
            : longitude,
      },
    };
  }
  const SearchParamsSchema = createSearchParamsSchema(initialViewport);
  const parsed = v.safeParse(SearchParamsSchema, params);
  if (!parsed.success) {
    throw new Error("Invalid search params");
  }
  return {
    zoom: parsed.output.zoom,
    center: {
      latitude: parsed.output.lat,
      longitude: parsed.output.lon,
    },
  };
};

const normalizeCoords = (coords: LngLatLike) => {
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

export const formatCoords = (coords: LngLatLike) => {
  const { latitude, longitude } = normalizeCoords(coords);
  if (!latitude || !longitude) {
    return {
      latitude: "?",
      longitude: "?",
    };
  }

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
