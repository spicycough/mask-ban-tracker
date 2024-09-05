import * as v from "valibot";

const PrimitiveSchema = v.union([
  v.string(),
  v.number(),
  v.boolean(),
  v.null(),
]);
export type JsonPrimitive = v.InferOutput<typeof PrimitiveSchema>;
export function primitive() {
  return PrimitiveSchema;
}

export type JsonObject = { [key: string]: Json };
export type JsonArray = Array<Json>;
export type Json = JsonPrimitive | JsonObject | JsonArray;

const JsonSchema: v.GenericSchema<Json> = v.lazy(() =>
  v.union([primitive(), v.array(JsonSchema), v.record(v.string(), JsonSchema)]),
);
export function json() {
  return JsonSchema;
}

const ObjectSchema = v.record(v.string(), JsonSchema);
export function object() {
  return ObjectSchema;
}

const ArraySchema = v.array(JsonSchema);
export function array() {
  return ArraySchema;
}

export const StringifiedJsonSchema = v.pipe(
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

export function StringifiedJson() {
  return StringifiedJsonSchema;
}
