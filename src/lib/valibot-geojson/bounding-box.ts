import * as v from "valibot";

const TwoDimensionalBoundingBox = v.tuple([
  v.number(),
  v.number(),
  v.number(),
  v.number(),
]);

const ThreeDimensionalBoundingBox = v.tuple([
  v.number(),
  v.number(),
  v.number(),
  v.number(),
  v.number(),
  v.number(),
]);

const BoundingBoxSchema = v.union([
  TwoDimensionalBoundingBox,
  ThreeDimensionalBoundingBox,
]);

export type GeoJsonBoundingBox = v.InferOutput<typeof BoundingBoxSchema>;

export function boundingBox() {
  return BoundingBoxSchema;
}
