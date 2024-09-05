import * as v from "valibot";

const TwoDimensionalCoordinate = v.tuple([v.number(), v.number()]);
const ThreeDimensionalCoordinate = v.tuple([
  v.number(),
  v.number(),
  v.number(),
]);

const CoordinateSchema = v.union([
  TwoDimensionalCoordinate,
  ThreeDimensionalCoordinate,
]);

export type GeoJsonCoordinate = v.InferOutput<typeof CoordinateSchema>;

export function coordinate() {
  return CoordinateSchema;
}
