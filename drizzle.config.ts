import { config } from "dotenv";
import type { Config } from "drizzle-kit";

config();

export default {
  schema: "./src/db/schema.ts",
  out: "./migrations",
  dialect: "sqlite",
  driver: "turso",
  dbCredentials: {
    url: process.env.DATABASE_URL || "http://127.0.0.1:8080",
    authToken: process.env.DATABASE_AUTH_TOKEN,
  },
} satisfies Config;
