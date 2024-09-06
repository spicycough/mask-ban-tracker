import { parseEnv } from "@/lib/env";
import * as v from "valibot";

/** Only place private configurations here. */
const PrivateConfigSchema = v.objectWithRest(
  {
    /** Port of the app (in dev). */
    PORT: v.fallback(v.number(), 3000),
    /** Development or Production. */
    NODE_ENV: v.fallback(
      v.union([v.literal("development"), v.literal("production")]),
      "development",
    ),
    /** MapTiler API Key. */
    MAPTILER_API_KEY: v.string(),
    /** Turso API Key. */
    DATABASE_URL: v.string(),
    /** Turso Auth Token. */
    DATABASE_AUTH_TOKEN: v.string(),
  },
  v.any(),
);

export type PrivateConfig = v.InferOutput<typeof PrivateConfigSchema>;

declare global {
  namespace NodeJS {
    interface ProcessEnv extends PrivateConfig {}
  }

  interface ImportMetaEnv extends PrivateConfig {}
}

console.log(`Parsing env vars: ${JSON.stringify(import.meta.env)}`);

// export const privateConfig = parseEnv(
//   PrivateConfigSchema,
//   import.meta.env || process.env,
// );

export default {};

export const privateConfig = {
  /** Port of the app (in dev). */
  PORT: (import.meta.env.PORT || process.env.PORT || 3000) as number,
  /** Development or Production. */
  NODE_ENV: ((import.meta.env.NODE_ENV || process.env.NODE_ENV) ??
    "development") as "development" | "production",
  /** Run in debug mode. */
  DEBUG: (import.meta.env.DEBUG || process.env.DEBUG) as boolean,
  /** MapTiler API Key. */
  MAPTILER_API_KEY: (import.meta.env.MAPTILER_API_KEY ||
    process.env.MAPTILER_API_KEY) as string,
  /** Turso API Key. */
  DATABASE_URL: (import.meta.env.DATABASE_URL ||
    process.env.DATABASE_URL) as string,
  /** Turso Auth Token. */
  DATABASE_AUTH_TOKEN: (import.meta.env.DATABASE_AUTH_TOKEN ||
    process.env.TURSO_AUTH_TOKEN) as string,
} as const;

// TODO: figure out how to assert no key starts with "PUBLIC_"
//

// type Public<T extends string> = T extends `PUBLIC_${string}` ? T : never;
// const isPublic = <T extends string>(key: T): key is Public<T> => {
//   return key.startsWith("PUBLIC_");
// };

// const PublicSchema = v.pipe(v.string(), v.startsWith("PUBLIC_"));

// type Public<T extends string> = T extends v.InferOutput<typeof PublicSchema>
//   ? T
//   : never;

// const isPublic = <T extends string>(key: T): key is Public<T> => {
//   return v.is(PublicSchema, key);
// };

// type Private<T extends v.GenericSchema = v.GenericSchema> = T extends v.InferOutput<T> ? never : T;
//
// const isPrivate = <T extends v.GenericSchema = v.GenericSchema>(key: T): key is Private<T> => {
//   return !v.is(PublicSchema, key);
// };
//
// const PrivateKeysSchema = v.record(
//   v.custom<Private>(
//     (input) => (typeof input === "string" ? isPrivate(input) : false),
//     'Private environment variable keys cannot start with "PUBLIC_"',
//   ),
//   v.any(),
// );
//
