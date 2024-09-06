import * as v from "valibot";
import { SchemaWithBoundingBox } from "./base";
import { CoordinateSchema } from "./coordinate";

export const PointSchema = v.object({
  ...SchemaWithBoundingBox.entries,
  type: v.literal("Point"),
  coordinates: CoordinateSchema,
});

export type GeoJsonPoint = v.InferOutput<typeof PointSchema>;
