import { parseEnv } from "@/lib/env";
import * as v from "valibot";

/** Only place public configurations here. */
const PublicConfigSchema = v.strictObject({
  /** Port of the app (in dev). */
  PUBLIC_ENV__BASE_URL: v.fallback(v.string(), "http://localhost:3000"),
});

export type PublicConfig = v.InferOutput<typeof PublicConfigSchema>;

declare global {
  namespace NodeJS {
    interface ProcessEnv extends PublicConfig {}
  }
  interface ImportMetaEnv extends PublicConfig {}
}

export const publicConfig = parseEnv(
  PublicConfigSchema,
  import.meta.env || process.env,
);

export default {};
