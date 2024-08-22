import { TURSO_AUTH_TOKEN, TURSO_DATABASE_URL } from "astro:env/server";
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schemas from "./schemas";

export const createDrizzleClient = () => {
  const turso = createClient({
    url: TURSO_DATABASE_URL,
    authToken: TURSO_AUTH_TOKEN,
  });

  return drizzle(turso, { schema: schemas });
};

export const db = createDrizzleClient();
export type Database = ReturnType<typeof createDrizzleClient>;
