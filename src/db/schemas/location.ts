import { db } from "@/db";
import { nanoid } from "@/lib/nanoid";
import { numeric, sqliteTable, text } from "drizzle-orm/sqlite-core";
import * as v from "valibot";
import {
  createInsertSchema,
  createSelectSchema,
} from "../drizzle-valibot-patch";

export const locations = sqliteTable("locations", {
  id: text("id").primaryKey().$defaultFn(nanoid),
  name: text("name").notNull(),
  status: text("status").notNull(),
});

export const NewLocationSchema = createInsertSchema(locations, {
  id: v.never(),
});
export const LocationSchema = createSelectSchema<typeof locations>(locations);
export type NewLocation = v.InferOutput<typeof NewLocationSchema>;
export type Location = v.InferOutput<typeof LocationSchema>;
export type LocationId = Location["id"];

export default {
  // Database table
  table: locations,
  // Schemas
  schema: {
    insert: NewLocationSchema,
    select: LocationSchema,
  },
  // Database querier
  query: db.query.locations,
  // Methods
  all: async (): Promise<Location[]> => {
    return db.select().from(locations).all();
  },
  findById: async (id: LocationId): Promise<Location | undefined> => {
    return db.query.locations.findFirst({
      where: ({ id: locationId }, { eq }) => eq(locationId, id),
    });
  },
  findByIds: async (ids: LocationId[]): Promise<Location[]> => {
    return db.query.locations.findMany({
      where: ({ id: locationId }, { inArray }) => inArray(locationId, ids),
    });
  },
  create: async (newLocation: NewLocation): Promise<LocationId> => {
    const [{ id }] = await db
      .insert(locations)
      .values(newLocation)
      .returning({ id: locations.id });
    return id;
  },
};
