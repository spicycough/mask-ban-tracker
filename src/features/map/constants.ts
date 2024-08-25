import { type ComponentProps, createMemo } from "solid-js";
import { createStore } from "solid-js/store";
import type { Layer, Viewport } from "solid-map-gl";

export const BanStatus = {
  BANNED: "banned",
  INTROED: "introed",
  UNKNOWN: "unknown",
  FLOATED: "floated",
} as const;

export type BanStatus = (typeof BanStatus)[keyof typeof BanStatus];

// export type PlaceOfInterest = {
//   key: Lowercase<string>;
//   name: string;
//   layer: ComponentProps<typeof Layer>;
//   viewport: Viewport;
//   meta: {
//     banStatus: BanStatus;
//   };
// };

export const placesOfInterest = {
  usa: {
    name: "USA",
    layer: {
      sourceId: "counties",
      filter: ["==", "NAME", "Nassau"],
    },
    viewport: {
      center: { lat: "37.0902", lon: "-95.7129" },
      zoom: 4,
    },
    meta: {
      banStatus: BanStatus.UNKNOWN,
    },
  },
  nassau: {
    name: "Nassau County",
    layer: {
      sourceId: "counties",
      filter: ["==", "NAME", "Nassau"],
    },
    viewport: {
      center: { lat: "40.73", lon: "-73.59" },
      zoom: 11,
    },
    meta: {
      banStatus: BanStatus.BANNED,
    },
  },
  losangeles: {
    name: "Los Angeles County",
    layer: {
      sourceId: "counties",
      filter: ["==", "NAME", "Nassau"],
    },
    viewport: {
      center: { lat: "40.73", lon: "-73.59" },
      zoom: 11,
    },
    meta: {
      banStatus: BanStatus.BANNED,
    },
  },
  northcarolina: {
    name: "North Carolina",
    layer: {
      sourceId: undefined,
      filter: ["==", "NAME", "Nassau"],
    },
    viewport: {
      center: { lat: "40.73", lon: "-73.59" },
      zoom: 7,
    },
    meta: {
      banStatus: BanStatus.BANNED,
    },
  },
  ohio: {
    name: "Ohio",
    viewport: {
      center: { lat: "40.73", lon: "-73.59" },
      zoom: 7,
    },
    layer: {
      sourceId: undefined,
      filter: ["==", "NAME", "Nassau"],
    },
    meta: {
      banStatus: BanStatus.BANNED,
    },
  },
} as const;

export const StateFP = {
  CA: 0,
  NC: 37,
  NY: 12,
};

export type PlaceOfInterestKey = keyof typeof placesOfInterest;
export type PlaceOfInterest = (typeof placesOfInterest)[PlaceOfInterestKey];

// export type PlaceOfInterestMap = {
//   [K in PlaceOfInterest]: Extract<PlaceOfInterest, K>;
// };

/**
 * Returns a list of places of interest that match the given selector.
 * If no selector is provided, returns all places of interest.
 *
 * @param selector - The selector to use to filter the places of interest.
 * @returns A list of places of interest that match the given selector.
 */
export const selectPlaceOfInterest = (key?: PlaceOfInterestKey) => {
  if (key) {
    return placesOfInterest[key];
  }
  return placesOfInterest;
};
