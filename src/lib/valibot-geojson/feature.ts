import * as v from "valibot";
import { SchemaWithBoundingBox } from "./base";
import { GeometrySchema } from "./geometry";
import { JsonSchema } from "./json";

export const FeatureSchema = v.object({
  ...SchemaWithBoundingBox.entries,
  type: v.literal("Feature"),
  geometry: v.nullable(GeometrySchema),
  id: v.optional(v.union([v.string(), v.number()])),
  properties: v.nullable(JsonSchema),
});

export type GeoJsonFeature = v.InferOutput<typeof FeatureSchema>;
