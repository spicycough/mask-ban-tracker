import * as v from "valibot";
import { boundingBox } from "./bounding-box";

export const SchemaWithBoundingBox = v.strictObject({
  bbox: v.optional(boundingBox()),
});
