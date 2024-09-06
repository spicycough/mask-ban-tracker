import { db } from "@/db";
import {
  type Location,
  LocationSchema,
  type NewLocation,
  NewLocationSchema,
  locations,
} from "../schema";

type LocationId = Location["id"];

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
