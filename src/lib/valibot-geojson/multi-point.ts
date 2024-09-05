import * as v from "valibot";
import { SchemaWithBoundingBox } from "./base.js";
import { point } from "./point.js";

const MultiPointSchema = v.object({
  ...SchemaWithBoundingBox.entries,
  type: v.literal("MultiPoint"),
  coordinates: v.array(point().entries.coordinates),
});

export type GeoJsonMultiPoint = v.InferOutput<typeof MultiPointSchema>;

export function multiPoint() {
  return MultiPointSchema;
}
