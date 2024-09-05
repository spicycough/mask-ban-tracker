import * as v from "valibot";
import { SchemaWithBoundingBox } from "./base.js";
import { lineString } from "./line-string.js";
import { multiLineString } from "./multi-line-string.js";
import { multiPoint } from "./multi-point.js";
import { multiPolygon } from "./multi-polygon.js";
import { point } from "./point.js";
import { polygon } from "./polygon.js";

const GeometryCollectionSchema: v.GenericSchema<GeoJsonGeometryCollection> =
  v.object({
    ...SchemaWithBoundingBox.entries,
    type: v.literal("GeometryCollection"),
    geometries: v.lazy(() => v.array(geometry())),
  });

/**
 * Unlike the other exported types, this one is defined and not inferred because it is required as a type hint for
 * the schema. It is required because the "geometries" property is a circular reference to the "GeometryCollection"
 * type (via "geometry").
 */
export type GeoJsonGeometryCollection = v.InferOutput<
  typeof SchemaWithBoundingBox
> & {
  type: "GeometryCollection";
  geometries: Array<v.InferOutput<typeof GeometrySchema>>;
};

export function geometryCollection() {
  return GeometryCollectionSchema;
}

const GeometrySchema = v.union([
  lineString(),
  multiLineString(),
  multiPoint(),
  multiPolygon(),
  point(),
  polygon(),
  geometryCollection(),
]);

export type GeoJsonGeometry = v.InferOutput<typeof GeometrySchema>;

export function geometry() {
  return GeometrySchema;
}
