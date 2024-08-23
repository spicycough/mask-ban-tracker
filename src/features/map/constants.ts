export const placesOfInterest = [
  {
    key: "usa",
    name: "USA",
    coords: { lat: "37.0902", lon: "-95.7129" },
    zoom: 4,
  },
  {
    key: "nassau",
    name: "Nassau County",
    coords: { lat: "40.73", lon: "-73.59" },
    zoom: 10,
  },
] as const;

export type PlaceOfInterest = (typeof placesOfInterest)[number];

export type PlaceOfInterestKey = PlaceOfInterest["key"];

export const usePlaceOfInterest = (
  key: PlaceOfInterestKey,
): PlaceOfInterest => {
  const poi = placesOfInterest.find((poi) => poi.key === key);
  if (!poi) {
    throw new Error(`Place of interest with key ${key} not found`);
  }

  return poi;
};
