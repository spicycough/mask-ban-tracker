import counties from "@/assets/geo/us-counties.json";
import type { APIRoute } from "astro";
import * as v from "valibot";

export const GeoJsonSchema = v.object({
  type: v.enum({ FEATURE_COLLECTION: "FeatureCollection" }),
  name: v.string(),
  crs: v.object({
    type: v.string(),
    properties: v.object({
      name: v.string(),
    }),
  }),
  features: v.array(
    v.object({
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
      geometry: v.object({
        type: v.enum({ POLYGON: "Polygon" }),
        coordinates: v.array(v.array(v.pipe(v.array(v.number()), v.length(2)))),
      }),
    }),
  ),
});

export type GeoJson = v.InferOutput<typeof GeoJsonSchema>;

// export const GET: APIRoute = async ({ params, request }) => {
//   const parsedData = await v.safeParseAsync(GeoJsonSchema, counties);
//   if (!parsedData.success) {
//     return new Response(JSON.stringify(parsedData.issues), {
//       status: 400,
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });
//   }
//   return new Response(JSON.stringify(parsedData.output), {
//     status: 200,
//     headers: {
//       "Content-Type": "application/json",
//     },
//   });
// };

export const GET: APIRoute = async ({ params, request }) => {
  return new Response(JSON.stringify(counties));
};
