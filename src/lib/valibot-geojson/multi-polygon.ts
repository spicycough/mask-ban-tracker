import * as v from "valibot";
import { SchemaWithBoundingBox } from "./base";
import { PolygonSchema } from "./polygon";

export const MultiPolygonSchema = v.object({
  ...SchemaWithBoundingBox.entries,
  type: v.literal("MultiPolygon"),
  coordinates: v.array(PolygonSchema.entries.coordinates),
});

export type GeoJsonMultiPolygon = v.InferOutput<typeof MultiPolygonSchema>;
