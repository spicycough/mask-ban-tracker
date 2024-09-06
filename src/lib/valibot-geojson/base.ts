import * as v from "valibot";
import { BoundingBoxSchema } from "./bounding-box";

export const SchemaWithBoundingBox = v.strictObject({
  bbox: v.optional(BoundingBoxSchema),
});
