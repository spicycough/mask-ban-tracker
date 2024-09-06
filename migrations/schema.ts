import { sqliteTable, AnySQLiteColumn, text, numeric, uniqueIndex, index, foreignKey, integer } from "drizzle-orm/sqlite-core"
  import { sql } from "drizzle-orm"

export const locations = sqliteTable("locations", {
	id: text("id").primaryKey().notNull(),
	name: text("name").notNull(),
	status: text("status").notNull(),
});

export const mapTiles = sqliteTable("map_tiles", {
	id: text("id").primaryKey().notNull(),
	externalId: text("external_id").notNull(),
	version: numeric("version").notNull(),
	name: text("name").notNull(),
	metadata: text("metadata").notNull(),
	sources: text("sources").notNull(),
	sprite: text("sprite").notNull(),
	glyphs: text("glyphs").notNull(),
	layers: text("layers").notNull(),
});

export const geoFeatureData = sqliteTable("geo_feature_data", {
	geoid: text("geoid", { length: 5 }).primaryKey().notNull(),
	type: text("type").notNull(),
	name: text("name").notNull(),
	collectionId: text("collection_id").notNull().references(() => geoFeatures.id),
	countyFp: text("county_fp", { length: 3 }).notNull(),
	countyNs: text("county_ns", { length: 8 }).notNull(),
	stateFp: text("state_fp", { length: 2 }).notNull(),
	lsad: text("lsad", { length: 2 }).notNull(),
	aland: numeric("aland").notNull(),
	awater: numeric("awater").notNull(),
	geoType: text("geo_type").notNull(),
	geoCoordinates: text("geo_coordinates").notNull(),
	createdAt: integer("created_at").default(sql`(strftime('%s', 'now'))`).notNull(),
	updatedAt: integer("updated_at").default(sql`(strftime('%s', 'now'))`).notNull(),
},
(table) => {
	return {
		unqGeoid: uniqueIndex("unq_geoid").on(table.geoid),
		publishedDateIdx: index("published_date_idx").on(table.geoid),
	}
});

export const geoFeatures = sqliteTable("geo_features", {
	id: text("id").primaryKey().notNull(),
	type: text("type").notNull(),
	name: text("name").notNull(),
	crsType: text("crs_type").notNull(),
	crsName: text("crs_name").notNull(),
	createdAt: integer("created_at").default(sql`(strftime('%s', 'now'))`).notNull(),
	updatedAt: integer("updated_at").default(sql`(strftime('%s', 'now'))`).notNull(),
});