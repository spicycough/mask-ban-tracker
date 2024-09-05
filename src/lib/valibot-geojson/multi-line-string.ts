import * as v from "valibot";
import { SchemaWithBoundingBox } from "./base.js";
import { lineString } from "./line-string.js";

const MultiLineStringSchema = v.object({
  ...SchemaWithBoundingBox.entries,
  type: v.literal("MultiLineString"),
  coordinates: v.array(lineString().entries.coordinates),
});

export type GeoJsonMultiLineString = v.InferOutput<
  typeof MultiLineStringSchema
>;

export function multiLineString() {
  return MultiLineStringSchema;
}
