import * as v from "valibot";
import { SchemaWithBoundingBox } from "./base.js";
import { geometry } from "./geometry.js";
import { json } from "./json";

const FeatureSchema = v.object({
  ...SchemaWithBoundingBox.entries,
  type: v.literal("Feature"),
  geometry: v.nullable(geometry()),
  id: v.optional(v.union([v.string(), v.number()])),
  properties: v.nullable(json()),
});

export type GeoJsonFeature = v.InferOutput<typeof FeatureSchema>;

export function feature() {
  return FeatureSchema;
}
