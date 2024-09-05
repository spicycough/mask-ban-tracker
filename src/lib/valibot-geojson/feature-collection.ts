import * as v from "valibot";
import { SchemaWithBoundingBox } from "./base.js";
import { feature } from "./feature.js";

const FeatureCollectionSchema = v.object({
  ...SchemaWithBoundingBox.entries,
  type: v.literal("FeatureCollection"),
  features: v.array(feature()),
});

export type GeoJsonFeatureCollection = v.InferOutput<
  typeof FeatureCollectionSchema
>;

export function featureCollection() {
  return FeatureCollectionSchema;
}
