import { privateConfig } from "@/config.private";
import { publicConfig } from "@/config.public";
import locations from "@/db/schemas/location";
import { vValidator } from "@hono/valibot-validator";
import { Hono } from "hono";

import { NewLocationSchema, type NewMapTile } from "@/db/schema";
import type { Location, LocationId } from "@/db/schema";

const mapRouter = new Hono()
  .basePath("/")
  .get("/tiles", async (c) => {
    // Ensure API key is loaded
    const apiKey = privateConfig.MAPTILER_API_KEY;
    if (!apiKey) {
      console.error("No API key found");
      return c.json({ error: "No API key found" }, 400);
    }

    // Fetch static file with api key placeholder
    const url = new URL(
      `${publicConfig.PUBLIC_ENV__BASE_URL}/static/style-positron.json`,
    );
    const resp = await fetch(url);
    if (!resp.ok) {
      return c.json({ error: "Failed to fetch tiles" }, 400);
    }

    // Parse static file
    const tiles = await resp.json<NewMapTile>();

    // Replace api key placeholder with actual api key
    tiles.glyphs = tiles.glyphs.replace("key={key}", `key=${apiKey}`);

    // Replace api key placeholder with actual api key
    tiles.sources = Object.fromEntries(
      Object.entries(tiles.sources ?? {}).map(([key, source]) => {
        if (source.url) {
          source.url = source.url.replace("key={key}", `key=${apiKey}`);
        }
        return [key, source];
      }),
    );

    // Return static file with api keys
    return c.json(tiles);
  })
  .get("/locations", async (c) => {
    const result: Location[] = await locations.all();
    return c.json(result, 200);
  })
  .post(
    "/locations",
    vValidator("json", NewLocationSchema, async (res, c) => {
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
