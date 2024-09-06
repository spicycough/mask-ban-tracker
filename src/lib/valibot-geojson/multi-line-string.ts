import * as v from "valibot";
import { SchemaWithBoundingBox } from "./base";
import { LineStringSchema } from "./line-string";

export const MultiLineStringSchema = v.object({
  ...SchemaWithBoundingBox.entries,
  type: v.literal("MultiLineString"),
  coordinates: v.array(LineStringSchema.entries.coordinates),
});

export type GeoJsonMultiLineString = v.InferOutput<
  typeof MultiLineStringSchema
>;
