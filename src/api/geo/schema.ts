import { createTableWithMetadata } from "@/lib/drizzle";
import {
  createInsertSchema,
  createSelectSchema,
} from "@/lib/drizzle-valibot-patch";
import { relations } from "drizzle-orm";
import { integer, numeric, text } from "drizzle-orm/sqlite-core";
import type { Geometry as GeoJsonGeometry, GeoJsonTypes } from "geojson";
import type * as v from "valibot";
import type { CountyProperties, StateProperties } from "./validators";

/* TYPES */

type GeoJsonGeometryTypes = Omit<GeoJsonTypes, "Feature" | "FeatureCollection">;

type Geometry = Omit<GeoJsonGeometry, "GeometryCollection">;
type Properties = CountyProperties | StateProperties;

/* ENUMS */

const GeometryType = {
  GEOMETRY_COLLECTION: "GeometryCollection",
  LINE_STRING: "LineString",
  MULTI_LINE_STRING: "MultiLineString",
  MULTI_POINT: "MultiPoint",
  MULTI_POLYGON: "MultiPolygon",
  POINT: "Point",
  POLYGON: "Polygon",
} as const satisfies Record<string, GeoJsonGeometryTypes>;

export const GeoJsonType = {
  ...GeometryType,
  FEATURE: "Feature",
  FEATURE_COLLECTION: "FeatureCollection",
} as const satisfies Record<string, GeoJsonTypes>;

/* TABLES */

/* Feature Collections */

export const featureCollections = createTableWithMetadata(
  "geo_feature_collections",
  {
    /** Type of geographical data */
    type: text("type", { enum: ["FeatureCollection"] }).notNull(),
    /** Name of the feature collection */
    name: text("name").notNull(),
  },
);

export const NewFeatureCollectionSchema =
  createInsertSchema<typeof featureCollections>(featureCollections);
export const FeatureCollectionSchema =
  createSelectSchema<typeof featureCollections>(featureCollections);

export type NewFeatureCollection = v.InferOutput<
  typeof NewFeatureCollectionSchema
>;
export type FeatureCollection = v.InferOutput<typeof FeatureCollectionSchema>;
export type FeatureCollectionId = FeatureCollection["id"];

export const features = createTableWithMetadata("geo_features", {
  /** Type of geographical data */
  type: text("type", { enum: ["Feature"] })
    .$type()
    .notNull(),
  /** Foreign key to its feature collection */
  featureCollectionId: integer("feature_collection_id").references(
    () => featureCollections.id,
    { onDelete: "cascade" },
  ),
  /** Name of feature */
  name: text("name").notNull(),
  /** Properties of feature stored as unstructured JSON */
  properties: text("properties", { mode: "json" })
    .$type<Properties>()
    .notNull(),
  /** Geometry of feature stored as unstructured JSON */
  geometry: text("geometry", { mode: "json" }).$type<Geometry>().notNull(),
});

export const NewFeatureSchema = createInsertSchema<typeof features>(features);
export const FeatureSchema = createSelectSchema<typeof features>(features);

export type NewFeature = v.InferOutput<typeof NewFeatureSchema>;
export type Feature = v.InferOutput<typeof FeatureSchema>;
export type FeatureId = Feature["id"];

/* Relations */

export const featureCollectionsRelations = relations(
  featureCollections,
  ({ many }) => ({
    features: many(features),
  }),
);

export const featuresRelations = relations(features, ({ one }) => ({
  featureCollection: one(featureCollections, {
    fields: [features.featureCollectionId],
    references: [featureCollections.id],
  }),
}));

/* MAP TILES */

export const mapTiles = createTableWithMetadata("map_tiles", {
  externalId: text("external_id").notNull(),
  version: numeric("version").notNull(),
  name: text("name").notNull(),
  glyphs: text("glyphs").notNull(),
  sprite: text("sprite").notNull(),
  metadata: text("metadata", { mode: "json" }).notNull(),
  sources: text("sources", { mode: "json" }).notNull(),
  layers: text("layers", { mode: "json" }).notNull(),
});

export const NewMapTileSchema = createInsertSchema<typeof mapTiles>(mapTiles);
export const MapTileSchema = createSelectSchema<typeof mapTiles>(mapTiles);
export type NewMapTile = v.InferOutput<typeof NewMapTileSchema>;
export type MapTile = v.InferOutput<typeof MapTileSchema>;
export type MapTileId = MapTile["id"];

// function createFeatureTable<T extends Record<string, SQLiteColumnBuilderBase>>(
//   name: string,
//   fields: T,
// ) {
//   return createTableWithMetadata(`geo_features_${name}`, {
//     /** Type of geographical data */
//     type: text("type", { enum: ["Feature"] }).notNull(),
//     /** Foreign key to its feature collection */
//     featureCollectionId: text("feature_collection_id").references(
//       () => featureCollections.id,
//       { onDelete: "cascade" },
//     ),
//     /** Foreign key to its geometry */
//     geometryId: text("geometry_id").references(() => geoGeometries.id, {
//       onDelete: "cascade",
//     }),
//     /** Property: Identifier code for the geographic entity */
//     geoId: text("geoid", { length: 5 }).primaryKey().notNull(),
//     /** Property: Name of the geographic entity */
//     name: text("name").notNull(),
//     ...fields,
//   });
// }
//
// const geoPropertiesCounties = createTableWithMetadata(
//   "geo_properties_counties",
//   {
//     geoId: text("geoid", { length: 5 }).primaryKey().notNull(),
//     name: text("name").notNull(),
//     stateFp: text("state_fp", { length: 2 }).notNull(),
//     countyFp: text("county_fp", { length: 3 }).notNull(),
//     countyNs: text("county_ns", { length: 8 }).notNull(),
//     lsad: text("lsad", { length: 2 }).notNull(),
//     aLand: integer("aland").notNull(),
//     aWater: integer("awater").notNull(),
//   },
// );
//
// const geoPropertiesStates = createTableWithMetadata("geo_properties_states", {
//   /** Property: Identifier code for the geographic entity */
//   geoId: text("geoid", { length: 5 }).primaryKey().notNull(),
//   name: text("name").notNull(),
//   density: real("density").notNull(),
// });
