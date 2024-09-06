import * as v from "valibot";

type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export const JsonSchema: v.GenericSchema<Json> = v.lazy(() =>
  v.union([
    v.string(),
    v.number(),
    v.boolean(),
    v.null(),
    v.array(JsonSchema),
    v.record(v.string(), JsonSchema),
  ]),
);

export const RawJsonSchema = v.pipe(
  v.string(),
  v.rawTransform(({ dataset, addIssue, NEVER }) => {
    try {
      return JSON.parse(dataset.value) as Json;
    } catch (e) {
      addIssue({
        message: "Invalid JSON",
      });
      return NEVER;
    }
  }),
);
