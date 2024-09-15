import { asEnum, createTableWithMetadata } from "@/lib/drizzle";
import {
  createInsertSchema,
  createSelectSchema,
} from "@/lib/drizzle-valibot-patch";
import { relations } from "drizzle-orm";
import { integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";
import type * as v from "valibot";

/** ENUMS */

export const PenaltyClassification = {
  MISDEMEANOR: "misdemeanor",
  FELONY_A: "felony-a",
  FELONY_B: "felony-b",
  FELONY_C: "felony-c",
  FELONY_D: "felony-d",
  FELONY_E: "felony-e",
} as const;
export type PenaltyClassification =
  (typeof PenaltyClassification)[keyof typeof PenaltyClassification];

export const RegionType = {
  CITY: "city",
  COUNTY: "county",
  STATE: "state",
  COUNTRY: "country",
} as const;
export type RegionType = (typeof RegionType)[keyof typeof RegionType];

export const BanStatusType = {
  PROPOSED: "proposed",
  ENACTED: "enacted",
  EFFECTIVE: "effective",
  REPEALED: "repealed",
} as const;
export type BanStatusType = (typeof BanStatusType)[keyof typeof BanStatusType];

/** TABLES */

export const references = sqliteTable("references", {
  id: integer("id").primaryKey({ autoIncrement: true }).notNull(),
  text: text("note").notNull(),
  link: text("link"),
});

export const banRegions = createTableWithMetadata("ban_regions", {
  name: text("name").notNull(),
  type: text("type", {
    enum: asEnum(RegionType),
  }).notNull(),
  noteId: integer("note_id").references(() => references.id, {
    onUpdate: "cascade",
    onDelete: "cascade",
  }),
});

export const banPenalties = createTableWithMetadata("ban_penalties", {
  banId: integer("ban_id").references(() => bans.id, {
    onUpdate: "cascade",
    onDelete: "cascade",
  }),
  details: text("text"),
  classification: text("classification", {
    enum: asEnum(PenaltyClassification),
  }),
  jailMin: real("jail_min"),
  jailMax: real("jail_max"),
  fineMin: real("fine_min"),
  fineMax: real("fine_max"),
  link: text("link"),
});

export const banStatuses = createTableWithMetadata("ban_statuses", {
  /** Possible statuses */
  status: text("status", {
    enum: Object.values(BanStatusType) as [string, ...string[]],
  }).notNull(),
  /** Date ban was proposed. Format: YYYY-MM-DD */
  proposedDate: text("proposed_date"),
  /** Date ban was enacted. Format: YYYY-MM-DD */
  enactedDate: text("enacted_date"),
  /** Date ban was effective. Format: YYYY-MM-DD */
  effectiveDate: text("effective_date"),
  /** Date ban was repealed. Format: YYYY-MM-DD */
  repealedDate: text("repealed_date"),
});

export const bans = createTableWithMetadata("bans", {
  /** Foreign keys */
  regionId: integer("region_id").references(() => banRegions.id, {
    onUpdate: "cascade",
    onDelete: "cascade",
  }),
  statusId: integer("status_id").references(() => banStatuses.id, {
    onUpdate: "cascade",
    onDelete: "cascade",
  }),

  /** Properties */
  condition: text("condition").notNull(),
  isExisting: integer("is_existing", { mode: "boolean" }).notNull(),
  proposedBy: text("proposed_by"),

  /** Reference keys */
  detailsId: integer("details_id").references(() => references.id, {
    onUpdate: "cascade",
    onDelete: "cascade",
  }),
  noteId: integer("note_id").references(() => references.id, {
    onUpdate: "cascade",
    onDelete: "cascade",
  }),
});

/** RELATIONS */

export const banPenaltiesRelations = relations(banPenalties, ({ one }) => ({
  ban: one(bans, {
    fields: [banPenalties.banId],
    references: [bans.id],
    relationName: "ban_to_penalties",
  }),
  // notes: many(references, {
  //   relationName: "penalties_to_notes",
  // }),
}));

export const banRegionsRelations = relations(banRegions, ({ many }) => ({
  bans: many(bans, {
    relationName: "region_to_bans",
  }),
  // notes: many(references, {
  //   relationName: "regions_to_notes",
  // }),
}));

export const banStatusesRelations = relations(banStatuses, ({ one }) => ({
  ban: one(bans),
  // notes: many(references, {
  //   relationName: "statuses_to_notes",
  // }),
}));

export const bansRelations = relations(bans, ({ one, many }) => ({
  region: one(banRegions, {
    fields: [bans.regionId],
    references: [banRegions.id],
    relationName: "region_to_bans",
  }),
  status: one(banStatuses, {
    fields: [bans.statusId],
    references: [banStatuses.id],
  }),
  penalties: many(banPenalties, {
    relationName: "ban_to_penalties",
  }),
  // details: many(references, {
  //   relationName: "bans_to_details",
  // }),
  // notes: many(references, {
  //   relationName: "bans_to_notes",
  // }),
}));

/** SCHEMAS */

export const NewReferenceSchema =
  createInsertSchema<typeof references>(references);
export const ReferenceSchema =
  createSelectSchema<typeof references>(references);
export type NewReference = v.InferOutput<typeof NewReferenceSchema>;
export type Reference = v.InferOutput<typeof ReferenceSchema>;
export type ReferenceId = Reference["id"];

export const NewBanPenaltySchema =
  createInsertSchema<typeof banPenalties>(banPenalties);
export const BanPenaltySchema =
  createSelectSchema<typeof banPenalties>(banPenalties);
export type NewBanPenalty = v.InferOutput<typeof NewBanPenaltySchema>;
export type BanPenalty = v.InferOutput<typeof BanPenaltySchema>;
export type BanPenaltyId = BanPenalty["id"];

export const NewBanRegionSchema =
  createInsertSchema<typeof banRegions>(banRegions);
export const BanRegionSchema =
  createSelectSchema<typeof banRegions>(banRegions);
export type NewBanRegion = v.InferOutput<typeof NewBanRegionSchema>;
export type BanRegion = v.InferOutput<typeof BanRegionSchema>;
export type BanRegionId = BanRegion["id"];

export const NewBanStatusSchema =
  createInsertSchema<typeof banStatuses>(banStatuses);
export const BanStatusSchema =
  createSelectSchema<typeof banStatuses>(banStatuses);
export type NewBanStatus = v.InferOutput<typeof NewBanStatusSchema>;
export type BanStatus = v.InferOutput<typeof BanStatusSchema>;
export type BanStatusId = BanStatus["id"];

export const NewBanSchema = createInsertSchema<typeof bans>(bans);
export const BanSchema = createSelectSchema<typeof bans>(bans);
export type NewBan = v.InferOutput<typeof NewBanSchema>;
export type Ban = v.InferOutput<typeof BanSchema>;
export type BanId = Ban["id"];
