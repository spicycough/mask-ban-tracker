import * as v from "valibot";
import { SchemaWithBoundingBox } from "./base";
import { CoordinateSchema } from "./coordinate";

export const PolygonSchema = v.object({
  ...SchemaWithBoundingBox.entries,
  type: v.literal("Polygon"),
  coordinates: v.array(v.array(CoordinateSchema)),
});

export type GeoJsonPolygon = v.InferOutput<typeof PolygonSchema>;
