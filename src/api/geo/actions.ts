import { db } from "@/db";
import {
  type MapTile,
  type MapTileId,
  type NewMapTile,
  mapTiles,
} from "./schema";

export const queries = {
  all: async (): Promise<MapTile[]> => {
    // @ts-expect-error: TODO fix
    return db.select().from(mapTiles).all();
  },
};

export const mutations = {
  create: async (newMapTiles: NewMapTile): Promise<MapTileId> => {
    const [{ id }] = await db
      .insert(mapTiles)
      .values(newMapTiles)
      .returning({ id: mapTiles.id });
    return id;
  },
};
