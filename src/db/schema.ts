import { nanoid } from "@/lib/nanoid";
import {
  numeric,
  sqliteTable,
  text,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";

export const users = sqliteTable(
  "users",
  {
    id: text("id").primaryKey().$defaultFn(nanoid),
    email: text("email").unique().notNull(),
    passwordHash: text("password_hash").notNull(),
  },
  (table) => ({
    emailUnqIdx: uniqueIndex("email_unq_idx").on(table.email),
  }),
);

export const locations = sqliteTable("locations", {
  id: text("id").primaryKey().$defaultFn(nanoid),
  name: text("name").notNull(),
  status: text("status").notNull(),
});

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
