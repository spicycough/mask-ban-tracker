import * as v from "valibot";

/**
 * Extracts errors from environment validation.
 *
 * @template T Schema to validate against.
 * @param err Error from environment validation.
 * @returns Formatted error message.
 */
const extractEnvErrors = <T extends v.GenericSchema>(err: unknown) => {
  // Handle valibot errors
  if (v.isValiError<T>(err)) {
    const flatErrors = v.flatten<T>(err.issues);
    return JSON.stringify(flatErrors, null, 2);
  }

  // Handle unknown types
  if (typeof err === "string") return err;
  if (err instanceof Error) return err.message;
  if (typeof err === "object") return JSON.stringify(err);
  if (Array.isArray(err)) return err.join(", ");
  if (typeof err === "undefined") return "Unknown error";
  return "Unknown error";
};

/**
 * Parses environment variables and throws an error if any are missing.
 *
 * @template T extends v.GenericSchema - Type of configuration schema.
 * @param schema - Configuration schema.
 * @param env - Environment variables, defaults to `process.env`.
 */
export const parseEnv = <T extends v.GenericSchema>(
  schema: T,
  env: ImportMetaEnv | NodeJS.ProcessEnv,
  options?: { strict: boolean },
) => {
  try {
    const config = v.parse(schema, env);
    return config;
  } catch (err) {
    const errors = extractEnvErrors(err);
    if (options?.strict) {
      throw new Error(`Missing environment variables:\n  ${errors}`);
    }
    console.warn(`Missing environment variables:\n  ${errors}`);
  }
};
