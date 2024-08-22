import { nanoid } from "@/lib/nanoid";
import { sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

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
