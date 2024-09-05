import * as v from "valibot";
import { SchemaWithBoundingBox } from "./base.js";
import { coordinate } from "./coordinate.js";

const PolygonSchema = v.object({
  ...SchemaWithBoundingBox.entries,
  type: v.literal("Polygon"),
  coordinates: v.array(v.array(coordinate())),
});

export type GeoJsonPolygon = v.InferOutput<typeof PolygonSchema>;

export function polygon() {
  return PolygonSchema;
}
