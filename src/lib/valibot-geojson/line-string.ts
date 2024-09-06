import * as v from "valibot";
import { SchemaWithBoundingBox } from "./base";
import { CoordinateSchema } from "./coordinate";

export const LineStringSchema = v.object({
  ...SchemaWithBoundingBox.entries,
  type: v.literal("LineString"),
  coordinates: v.pipe(v.array(CoordinateSchema), v.minLength(2)),
});

export type GeoJsonLineString = v.InferOutput<typeof LineStringSchema>;
