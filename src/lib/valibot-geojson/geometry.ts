import * as v from "valibot";
import { SchemaWithBoundingBox } from "./base";
import { LineStringSchema } from "./line-string";
import { MultiLineStringSchema } from "./multi-line-string";
import { MultiPointSchema } from "./multi-point";
import { MultiPolygonSchema } from "./multi-polygon";
import { PointSchema } from "./point";
import { PolygonSchema } from "./polygon";

export const GeometryCollectionSchema: v.GenericSchema<GeoJsonGeometryCollection> =
  v.object({
    ...SchemaWithBoundingBox.entries,
    type: v.literal("GeometryCollection"),
    geometries: v.lazy(() => v.array(GeometrySchema)),
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

export const GeometrySchema = v.union([
  LineStringSchema,
  MultiLineStringSchema,
  MultiPointSchema,
  MultiPolygonSchema,
  PointSchema,
  PolygonSchema,
  GeometryCollectionSchema,
]);

export type GeoJsonGeometry = v.InferOutput<typeof GeometrySchema>;
