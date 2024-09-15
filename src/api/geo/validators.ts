import * as v from "valibot";

export const CountyPropertiesSchema = v.object({
  /** Name of the geographic entity */
  NAME: v.string(),
  /** Identifier code for the geographic entity */
  GEOID: v.pipe(v.string(), v.length(5)),
  /** County FIPS code */
  COUNTYFP: v.pipe(v.string(), v.length(3)),
  /** State FIPS code */
  STATEFP: v.pipe(v.string(), v.length(2)),
  /** County ??? */
  COUNTYNS: v.pipe(v.string(), v.length(8)),
  /** Legal/Statistical area description */
  LSAD: v.pipe(v.string(), v.length(2)),
  /** Land area */
  ALAND: v.number(),
  /** Water area */
  AWATER: v.number(),
});

export type CountyProperties = v.InferOutput<typeof CountyPropertiesSchema>;

export const StatePropertiesSchema = v.object({
  /** Name of the geographic entity */
  name: v.string(),
  /** Density of the geographic entity */
  density: v.number(),
});

export type StateProperties = v.InferOutput<typeof StatePropertiesSchema>;
