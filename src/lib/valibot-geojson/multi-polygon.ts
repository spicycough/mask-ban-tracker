import * as v from "valibot";
import { SchemaWithBoundingBox } from "./base.js";
import { polygon } from "./polygon.js";

const MultiPolygonSchema = v.object({
  ...SchemaWithBoundingBox.entries,
  type: v.literal("MultiPolygon"),
  coordinates: v.array(polygon().entries.coordinates),
});

export type GeoJsonMultiPolygon = v.InferOutput<typeof MultiPolygonSchema>;

export function multiPolygon() {
  return MultiPolygonSchema;
}
