import * as v from "valibot";
import { SchemaWithBoundingBox } from "./base.js";
import { coordinate } from "./coordinate.js";

const LineStringSchema = v.object({
  ...SchemaWithBoundingBox.entries,
  type: v.literal("LineString"),
  coordinates: v.pipe(v.array(coordinate()), v.minLength(2)),
});

export type GeoJsonLineString = v.InferOutput<typeof LineStringSchema>;

export function lineString() {
  return LineStringSchema;
}
