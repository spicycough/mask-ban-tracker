import * as v from "valibot";
import { SchemaWithBoundingBox } from "./base";
import { FeatureSchema } from "./feature";

export const FeatureCollectionSchema = v.object({
  ...SchemaWithBoundingBox.entries,
  type: v.literal("FeatureCollection"),
  features: v.array(FeatureSchema),
});

export type GeoJsonFeatureCollection = v.InferOutput<
  typeof FeatureCollectionSchema
>;
