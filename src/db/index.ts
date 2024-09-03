import { privateConfig } from "@/config.private";
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schemas from "./schemas";

export const createDrizzleClient = () => {
  const turso = createClient({
    url: privateConfig.DATABASE_URL,
    authToken: privateConfig.DATABASE_AUTH_TOKEN,
  });

  return drizzle(turso, { schema: schemas });
};

export const db = createDrizzleClient();
export type Database = ReturnType<typeof createDrizzleClient>;

export default {};
