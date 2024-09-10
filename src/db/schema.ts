import { nanoid } from "@/lib/nanoid";
import { sql } from "drizzle-orm";
import {
  index,
  integer,
  numeric,
  sqliteTable,
  text,
  unique,
} from "drizzle-orm/sqlite-core";
import * as v from "valibot";
import {
  createInsertSchema,
  createSelectSchema,
} from "./drizzle-valibot-patch";

/* LOCATIONS */

export const locations = sqliteTable("locations", {
  id: text("id").primaryKey().$defaultFn(nanoid),
  kind: text("kind", { enum: ["county", "city", "state"] }).notNull(),
  name: text("name").notNull(),
  status: text("status").notNull(),
});

export const NewLocationSchema = createInsertSchema(locations);
export const LocationSchema = createSelectSchema<typeof locations>(locations);
export type NewLocation = v.InferOutput<typeof NewLocationSchema>;
export type Location = v.InferOutput<typeof LocationSchema>;
export type LocationId = Location["id"];
export type LocationKind = Location["kind"];

/* BANS */

const banStatuses = ["Active", "Proposed", "Repealed"] as const;

export const bans = sqliteTable("bans", {
  id: text("id").primaryKey().$defaultFn(nanoid),
  locationId: text("location_id"),
  locationKind: text("location_kind"),
  status: text("status", {
    enum: banStatuses,
  }).notNull(),
  description: text("description").notNull(),
  condition: text("condition").notNull(),
  penalty: text("penalty", { mode: "json" }).notNull(),
});

export const NewBanSchema = createInsertSchema(bans);
export const BanSchema = createSelectSchema<typeof bans>(bans);
export type NewBan = v.InferOutput<typeof NewBanSchema>;
export type Ban = v.InferOutput<typeof BanSchema>;
export type BanId = Ban["id"];
export type BanStatus = Ban["status"];

/* MAP TILES */

export const mapTiles = sqliteTable("map_tiles", {
  id: text("id").primaryKey().$defaultFn(nanoid),
  externalId: text("external_id").notNull(),
  version: numeric("version").notNull(),
  name: text("name").notNull(),
  metadata: text("metadata", { mode: "json" }).notNull(),
  sources: text("sources", { mode: "json" }).notNull(),
  sprite: text("sprite").notNull(),
  glyphs: text("glyphs").notNull(),
  layers: text("layers", { mode: "json" }).notNull(),
});

export const NewMapTileSchema = createInsertSchema(mapTiles);
export const MapTileSchema = createSelectSchema<typeof mapTiles>(mapTiles);
export type NewMapTile = v.InferOutput<typeof NewMapTileSchema>;
export type MapTile = v.InferOutput<typeof MapTileSchema>;

/* GEO FEATURES */

export const geoFeatures = sqliteTable("geo_features", {
  /** Database identifier */
  id: text("id").primaryKey().$defaultFn(nanoid),
  /** Type of geographical data */
  type: text("type", { enum: ["FeatureCollection"] }).notNull(),
  /** Name of the feature collection */
  name: text("name").notNull(),
  /** CRS: Coordinate Reference System */
  crsType: text("crs_type", { enum: ["name"] }).notNull(),
  /** CRS: Coordinate Reference System */
  crsName: text("crs_name").notNull(),
  /** ETL: Created Date */
  createdAt: integer("created_at", { mode: "timestamp" })
    .$type<Date>()
    .default(sql`(strftime('%s', 'now'))`)
    .notNull(),
  /** ETL: Updated Date */
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .$type<Date>()
    .default(sql`(strftime('%s', 'now'))`)
    .$onUpdateFn(() => sql`(strftime('%s', 'now'))`)
    .notNull(),
});

export const NewGeoFeatureSchema = createInsertSchema(geoFeatures);
export const GeoFeatureSchema =
  createSelectSchema<typeof geoFeatures>(geoFeatures);
export type NewGeoFeature = v.InferOutput<typeof NewGeoFeatureSchema>;
export type GeoFeature = v.InferOutput<typeof GeoFeatureSchema>;

/* GEO FEATURE DATA */

export const geoFeatureData = sqliteTable(
  "geo_feature_data",
  {
    /** Main identifier code for the geographic entity */
    geoId: text("geoid", { length: 5 }).primaryKey().notNull(),
    /** Type of geographical data */
    type: text("type", { enum: ["Feature"] }).notNull(),
    /** Name of the geographic entity */
    name: text("name").notNull(),
    /** Foreign key to its parent geographic entity */
    collectionId: text("collection_id")
      .references(() => geoFeatures.id, { onDelete: "cascade" })
      .notNull(),
    /** County FIPS code */
    countyFp: text("county_fp", { length: 3 }).notNull(),
    /** County ??? */
    countyNs: text("county_ns", { length: 8 }).notNull(),
    /** State FIPS code */
    stateFp: text("state_fp", { length: 2 }).notNull(),
    /** Legal/Statistical Area Description */
    lsad: text("lsad", { length: 2 }).notNull(),
    /** Land Area */
    aLand: integer("aland").notNull(),
    /** Water Area */
    aWater: integer("awater").notNull(),
    /** Geographic entity type */
    geoType: text("geo_type", {
      enum: [
        "Polygon",
        "MultiPolygon",
        "LineString",
        "MultiLineString",
        "MultiPoint",
        "Point",
        "GeometryCollection",
      ],
    }),
    /** Coordinates of geographical data */
    geoCoordinates: text("geo_coordinates", { mode: "json" }).notNull(),
    /** ETL: Created Date */
    createdAt: integer("created_at", { mode: "timestamp" })
      .$type<Date>()
      .default(sql`(strftime('%s', 'now'))`)
      .notNull(),
    /** ETL: Updated Date */
    updatedAt: integer("updated_at", { mode: "timestamp" })
      .$type<Date>()
      .default(sql`(strftime('%s', 'now'))`)
      .$onUpdateFn(() => sql`(strftime('%s', 'now'))`)
      .notNull(),
  },
  (table) => ({
    /** Index for geoId */
    geoIdIdx: index("published_date_idx").on(table.geoId),
    /** Unique index for geoId */
    unqGeoId: unique("unq_geoid").on(table.geoId),
  }),
);

export const NewGeoFeatureDataSchema = createInsertSchema(geoFeatureData, {
  name: v.string(),
  aLand: v.number(),
  aWater: v.number(),
});
export const GeoFeatureDataSchema =
  createSelectSchema<typeof geoFeatureData>(geoFeatureData);
export type NewGeoFeatureData = v.InferOutput<typeof NewGeoFeatureDataSchema>;
export type GeoFeatureData = v.InferOutput<typeof GeoFeatureDataSchema>;

/* US STATES */

export const usStates = sqliteTable("us_states", {
  /** Database identifier */
  code: text("code", { length: 2 }).primaryKey().notNull(),
  /** State FIPS code */
  name: text("name", { length: 2 }).notNull(),
});
