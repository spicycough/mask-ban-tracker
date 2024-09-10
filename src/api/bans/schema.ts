import {
  createInsertSchema,
  createSelectSchema,
} from "@/lib/drizzle-valibot-patch";
import { nanoid } from "@/lib/nanoid";
import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import type * as v from "valibot";

/* BANS */

const banStatuses = ["Active", "Proposed", "Repealed"] as const;

const bans = sqliteTable("bans", {
  id: text("id").primaryKey().$defaultFn(nanoid),
  /* Foreign key to Location */
  locationId: text("location_id")
    .references(() => locations.id, { onDelete: "cascade" })
    .notNull(),
  /** Status of ban */
  status: text("status", { enum: banStatuses }).notNull(),
  /** Date status went into effect */
  statusDate: text("status_date", { mode: "json" }).$type<{
    month?: number;
    year: number;
  }>(),
  /* Details about the ban */
  description: text("description", { mode: "json" })
    .notNull()
    .$type<{ text: string; link: string }>(),
  note: text("note", { mode: "json" }).$type<{ text: string; link: string }>(),
  /* Associated URL for ban */
  link: text("link").notNull(),
  condition: text("condition").notNull(),
  penalty: text("penalty", { mode: "json" }).$type<{
    link?: string;
    prison?: number | { min: number; max: number };
    fine?: number | { min: number; max: number };
    classification?: string;
  }>(),
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

const NewBanSchema = createInsertSchema<typeof bans>(bans);
const BanSchema = createSelectSchema<typeof bans>(bans);
type NewBan = v.InferOutput<typeof NewBanSchema>;
type Ban = v.InferOutput<typeof BanSchema>;
type BanId = Ban["id"];
type BanStatus = Ban["status"];

export { bans, BanSchema, banStatuses, NewBanSchema };
export type { Ban, BanId, BanStatus, NewBan };

/* LOCATIONS */

const locationKinds = ["state", "county", "city"] as const;

const locations = sqliteTable("locations", {
  id: text("id").primaryKey().$defaultFn(nanoid),
  key: text("key").notNull(),
  kind: text("kind", { enum: locationKinds }).notNull(),
  name: text("name").notNull(),
  displayName: text("display_name").notNull(),
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

const NewLocationSchema = createInsertSchema<typeof locations>(locations);
const LocationSchema = createSelectSchema<typeof locations>(locations);
type NewLocation = v.InferOutput<typeof NewLocationSchema>;
type Location = v.InferOutput<typeof LocationSchema>;
type LocationId = Location["id"];
type LocationKind = Location["kind"];

export { locationKinds, locations, LocationSchema, NewLocationSchema };
export type { Location, LocationId, LocationKind, NewLocation };
