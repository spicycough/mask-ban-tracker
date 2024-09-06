import * as v from "valibot";

export const TwoDimensionalCoordinate = v.tuple([v.number(), v.number()]);

export const ThreeDimensionalCoordinate = v.tuple([
  v.number(),
  v.number(),
  v.number(),
]);

export const CoordinateSchema = v.union([
  TwoDimensionalCoordinate,
  ThreeDimensionalCoordinate,
]);

export type GeoJsonCoordinate = v.InferOutput<typeof CoordinateSchema>;
