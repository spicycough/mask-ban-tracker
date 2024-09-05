import * as v from "valibot";
import { SchemaWithBoundingBox } from "./base.js";
import { coordinate } from "./coordinate.js";

const PointSchema = v.object({
  ...SchemaWithBoundingBox.entries,
  type: v.literal("Point"),
  coordinates: coordinate(),
});

export type GeoJsonPoint = v.InferOutput<typeof PointSchema>;

export function point() {
  return PointSchema;
}
