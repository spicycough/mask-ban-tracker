import * as v from "valibot";

export const TwoDimensionalBoundingBox = v.tuple([
  v.number(),
  v.number(),
  v.number(),
  v.number(),
]);

export const ThreeDimensionalBoundingBox = v.tuple([
  v.number(),
  v.number(),
  v.number(),
  v.number(),
  v.number(),
  v.number(),
]);

export const BoundingBoxSchema = v.union([
  TwoDimensionalBoundingBox,
  ThreeDimensionalBoundingBox,
]);

export type GeoJsonBoundingBox = v.InferOutput<typeof BoundingBoxSchema>;
