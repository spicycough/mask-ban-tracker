import * as v from "valibot";
import { featureCollection } from "./feature-collection.js";
import { feature } from "./feature.js";
import { geometry } from "./geometry.js";

const GeoJsonSchema = v.union([geometry(), feature(), featureCollection()]);

export type GeoJson = v.InferOutput<typeof GeoJsonSchema>;

export function geojson() {
  return GeoJsonSchema;
}
