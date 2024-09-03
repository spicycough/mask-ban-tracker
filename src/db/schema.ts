import { nanoid } from "@/lib/nanoid";
import { numeric, sqliteTable, text } from "drizzle-orm/sqlite-core";
import type * as v from "valibot";
import {
  createInsertSchema,
  createSelectSchema,
} from "./drizzle-valibot-patch";

export const locations = sqliteTable("locations", {
  id: text("id").primaryKey().$defaultFn(nanoid),
  name: text("name").notNull(),
  status: text("status").notNull(),
});

export const NewLocationSchema = createInsertSchema(locations);
export const LocationSchema = createSelectSchema<typeof locations>(locations);
export type NewLocation = v.InferOutput<typeof NewLocationSchema>;
export type Location = v.InferOutput<typeof LocationSchema>;

export const mapTiles = sqliteTable("map_tiles", {
  id: text("id").primaryKey().$defaultFn(nanoid),
  externalId: text("external_id").notNull(),
  version: numeric("version").notNull(),
  name: text("name").notNull(),
  metadata: text("metadata", { mode: "json" }).notNull(),
  sources: text("sources", { mode: "json" }).notNull(),
  sprite: text("sprite").notNull(),
  glyphs: text("glyphs", { mode: "json" }).notNull(),
  layers: text("layers", { mode: "json" }).notNull(),
});

export const NewMapTileSchema = createInsertSchema(mapTiles);
export const MapTileSchema = createSelectSchema<typeof mapTiles>(mapTiles);
export type NewMapTile = v.InferOutput<typeof NewMapTileSchema>;
export type MapTile = v.InferOutput<typeof MapTileSchema>;
