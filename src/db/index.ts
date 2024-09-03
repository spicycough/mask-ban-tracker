import { privateConfig } from "@/config.private";
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";

export const createDrizzleClient = () => {
  const turso = createClient({
    url: privateConfig.DATABASE_URL,
    authToken: privateConfig.DATABASE_AUTH_TOKEN,
  });

  return drizzle(turso, { schema });
};

export const db = createDrizzleClient();
export type Database = ReturnType<typeof createDrizzleClient>;
