import * as v from "valibot";

const CoordinateSchema = v.pipe(v.array(v.number()), v.length(2));

const GeometrySchema = v.object({
  type: v.enum({ POLYGON: "Polygon" }),
  coordinates: v.array(v.array(CoordinateSchema)),
});

const FeatureSchema = v.object({
  type: v.enum({ FEATURE: "feature" }),
  properties: v.object({
    stateFp: v.pipe(v.string(), v.length(2)),
    countyFp: v.pipe(v.string(), v.length(5)),
    countyName: v.string(),
    geoId: v.pipe(v.string(), v.length(12)),
    name: v.string(),
    lsad: v.pipe(v.string(), v.length(3)),
    aland: v.number(),
    awater: v.number(),
  }),
  geometry: GeometrySchema,
});

export const GeoJsonSchema = v.object({
  type: v.enum({ FEATURE_COLLECTION: "FeatureCollection" }),
  name: v.string(),
  crs: v.object({
    type: v.string(),
    properties: v.object({
      name: v.string(),
    }),
  }),
  features: v.array(FeatureSchema),
});

export type GeoJson = v.InferOutput<typeof GeoJsonSchema>;

export const parseGeoJson = (data: unknown): GeoJson => {
  const parsedData = v.safeParse(GeoJsonSchema, data);
  if (!parsedData.success) {
    throw new Error(parsedData.issues.join("\n"));
  }
  return parsedData.output;
};
