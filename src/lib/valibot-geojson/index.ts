import { BoundingBoxSchema, type GeoJsonBoundingBox } from "./bounding-box";
import { CoordinateSchema, type GeoJsonCoordinate } from "./coordinate";
import { FeatureSchema, type GeoJsonFeature } from "./feature";
import {
  FeatureCollectionSchema,
  type GeoJsonFeatureCollection,
} from "./feature-collection";
import { type GeoJson, GeoJsonSchema } from "./geojson";
import {
  type GeoJsonGeometry,
  GeometryCollectionSchema,
  GeometrySchema,
} from "./geometry";
import { type GeoJsonLineString, LineStringSchema } from "./line-string";
import {
  type GeoJsonMultiLineString,
  MultiLineStringSchema,
} from "./multi-line-string";
import { type GeoJsonMultiPoint, MultiPointSchema } from "./multi-point";
import { type GeoJsonMultiPolygon, MultiPolygonSchema } from "./multi-polygon";
import { type GeoJsonPoint, PointSchema } from "./point";
import { type GeoJsonPolygon, PolygonSchema } from "./polygon";

export {
  BoundingBoxSchema as GeoJsonBoundingBoxSchema,
  FeatureSchema as GeoJsonFeatureSchema,
  FeatureCollectionSchema as GeoJsonFeatureCollectionSchema,
  GeometrySchema as GeoJsonGeometrySchema,
  GeometryCollectionSchema as GeoJsonGeometryCollectionSchema,
  GeoJsonSchema,
  LineStringSchema as GeoJsonLineStringSchema,
  MultiLineStringSchema as GeoJsonMultiLineStringSchema,
  MultiPointSchema as GeoJsonMultiPointSchema,
  MultiPolygonSchema as GeoJsonMultiPolygonSchema,
  PointSchema as GeoJsonPointSchema,
  PolygonSchema as GeoJsonPolygonSchema,
  CoordinateSchema as GeoJsonCoordinateSchema,
};
export type {
  GeoJsonBoundingBox,
  GeoJsonFeature,
  GeoJsonFeatureCollection,
  GeoJsonGeometry,
  GeoJson,
  GeoJsonLineString,
  GeoJsonMultiLineString,
  GeoJsonMultiPoint,
  GeoJsonMultiPolygon,
  GeoJsonPoint,
  GeoJsonPolygon,
  GeoJsonCoordinate,
};
