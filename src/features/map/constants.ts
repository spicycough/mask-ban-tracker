import type { ComponentProps } from "solid-js";
import type { Layer, Viewport } from "solid-map-gl";

export const BanStatus = {
  BANNED: "banned",
  INTROED: "introed",
  UNKNOWN: "unknown",
  FLOATED: "floated",
} as const;

export type BanStatus = (typeof BanStatus)[keyof typeof BanStatus];

export interface PlaceOfInterestShape {
  name: string;
  layer: ComponentProps<typeof Layer>;
  viewport: Viewport;
  meta: {
    banStatus: BanStatus;
  };
}

export const placesOfInterest = {
  nassau: {
    name: "Nassau County",
    layer: {
      sourceId: "counties",
      filter: ["==", "NAME", "Nassau"],
    },
    viewport: {
      center: { lat: 40.73, lon: -73.59 },
      zoom: 11,
    },
    meta: {
      banStatus: BanStatus.BANNED,
    },
  } as const satisfies PlaceOfInterestShape,
  losangeles: {
    name: "Los Angeles County",
    layer: {
      sourceId: "counties",
      filter: ["==", "NAME", "Nassau"],
    },
    viewport: {
      center: { lat: 40.73, lon: -73.59 },
      zoom: 11,
    },
    meta: {
      banStatus: BanStatus.BANNED,
    },
  } as const satisfies PlaceOfInterestShape,
  northcarolina: {
    name: "North Carolina",
    layer: {
      sourceId: undefined,
      filter: ["==", "NAME", "Nassau"],
    },
    viewport: {
      center: { lat: 40.73, lon: -73.59 },
      zoom: 7,
    },
    meta: {
      banStatus: BanStatus.BANNED,
    },
  } as const satisfies PlaceOfInterestShape,
  ohio: {
    name: "Ohio",
    viewport: {
      center: { lat: 40.73, lon: -73.59 },
      zoom: 7,
    },
    layer: {
      sourceId: undefined,
      filter: ["==", "NAME", "Nassau"],
    },
    meta: {
      banStatus: BanStatus.BANNED,
    },
  } satisfies PlaceOfInterestShape,
} as const;

export const StateFP = {
  CA: 0,
  NC: 37,
  NY: 12,
};

export type PlacesOfInterest = typeof placesOfInterest;
export type PlaceOfInterestKey = keyof PlacesOfInterest;
export type PlaceOfInterest<K extends PlaceOfInterestKey = PlaceOfInterestKey> =
  PlacesOfInterest[K];

/**
 * Returns a list of places of interest that match the given selector(s).
 * If no selector(s) are provided, all places of interest are returned.
 *
 * @param key - The selector(s) used to filter the places of interest.
 * @returns A list of places of interest that match the given selector(s).
 */
export function selectPlaceOfInterest(): PlacesOfInterest;
export function selectPlaceOfInterest<K extends PlaceOfInterestKey>(
  key: K,
): PlaceOfInterest<K>;
export function selectPlaceOfInterest<K extends PlaceOfInterestKey>(
  keys: K[],
): { [P in K]: PlaceOfInterest<P> };
export function selectPlaceOfInterest(
  key?: PlaceOfInterestKey | PlaceOfInterestKey[],
) {
  if (key === undefined) {
    return placesOfInterest;
  }
  if (Array.isArray(key)) {
    return Object.fromEntries(key.map((k) => [k, placesOfInterest[k]])) as {
      [P in PlaceOfInterestKey]: PlaceOfInterest<P>;
    };
  }
  return placesOfInterest[key];
}
