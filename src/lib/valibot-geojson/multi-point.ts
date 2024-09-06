import * as v from "valibot";
import { SchemaWithBoundingBox } from "./base";
import { PointSchema } from "./point";

export const MultiPointSchema = v.object({
  ...SchemaWithBoundingBox.entries,
  type: v.literal("MultiPoint"),
  coordinates: v.array(PointSchema.entries.coordinates),
});

export type GeoJsonMultiPoint = v.InferOutput<typeof MultiPointSchema>;
