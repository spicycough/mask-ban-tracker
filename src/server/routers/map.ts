import type { Location, LocationId } from "@/db/schemas/location";
import { vValidator } from "@hono/valibot-validator";
import { Hono } from "hono";
import * as v from "valibot";

import tiles from "@/assets/geo/style-positron.json";
import counties from "@/assets/geo/us-counties.json";
import locations from "@/db/schemas/location";

const GeoJsonSchema = v.object({
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

const mapRouter = new Hono()
  .basePath("/")
  .get("/tiles", (c) => {
    const replaceParam = (str: string, value: string): string => {
      return str.replace(/(\?key=)undefined/, `$1${value}`);
    };

    const apiKey = "5AgZoK60ooHV3yYMQMFs";
    if (!apiKey) {
      return c.json({ error: "No API key found" }, 400);
    }

    console.log(`SOURCE URL: ${tiles.sources.openmaptiles.url}`);
    const rawSourceUrl = decodeURI(tiles.sources.openmaptiles.url);
    tiles.sources.openmaptiles.url = replaceParam(rawSourceUrl, apiKey);

    console.log(`GLYPH URL: ${tiles.glyphs}`);
    const rawGlyphUrl = decodeURI(tiles.glyphs);
    tiles.glyphs = replaceParam(rawGlyphUrl, apiKey);

    return c.json(tiles);
  })
  .get("/counties", async (c) => {
    const countyResult = await v.safeParseAsync(GeoJsonSchema, counties);
    if (!countyResult.success) {
      return c.json(countyResult.issues, 400);
    }
    return c.json(countyResult.output);
  })
  .get("/locations", async (c) => {
    const result: Location[] = await locations.all();
    return c.json(result, 200);
  })
  .post(
    "/locations",
    vValidator("json", locations.schema.insert, async (res, c) => {
      if (!res.success) {
        return c.json(res.issues, 400);
      }
      const result: LocationId = await locations.create(res.output);
      return c.json({ id: result }, 201);
    }),
  )
  .get("/locations/:id", async (c) => {
    const ids: LocationId[] = c.req.param("id")?.split(",");
    if (!ids) {
      return c.json({ error: "No IDs found" }, 400);
    }

    const result: Location[] = await locations.findByIds(ids);
    return c.json(result, 200);
  });

export { mapRouter };
