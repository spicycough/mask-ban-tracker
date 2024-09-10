import { db } from "@/db";
import {
  type Location,
  type LocationId,
  type NewLocation,
  locations,
} from "./schema";

export const queries = {
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
};

export const mutations = {
  create: async (newLocation: NewLocation): Promise<LocationId> => {
    const [{ id }] = await db
      .insert(locations)
      .values(newLocation)
      .returning({ id: locations.id });
    return id;
  },
};
