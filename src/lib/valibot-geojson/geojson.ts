import * as v from "valibot";
import { FeatureSchema } from "./feature";
import { FeatureCollectionSchema } from "./feature-collection";
import { GeometrySchema } from "./geometry";

export const GeoJsonSchema = v.union([
  GeometrySchema,
  FeatureSchema,
  FeatureCollectionSchema,
]);

export type GeoJson = v.InferOutput<typeof GeoJsonSchema>;
