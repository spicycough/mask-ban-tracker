import { privateConfig } from "@/config.private";
import { publicConfig } from "@/config.public";
import { CF_BUCKET } from "@/constants/cloudflare";
import { Hono } from "@/lib/hono";
import { stream } from "hono/streaming";
import type { NewMapTile } from "./schema";

export const mapRouter = new Hono()
  // TODO: add auth
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
  .get("/counties", async (c) => {
    const countiesData = await c.env.BUCKET_SOURCEDATA.get(
      CF_BUCKET.COUNTIES_DATA,
    );
    if (!countiesData) {
      return c.json({ error: "No counties data found" }, 400);
    }

    return stream(c, async (stream) => {
      // Write a process to be executed when aborted.
      stream.onAbort(() => {
        console.log("Aborted!");
      });
      // Create a new Uint8Array.
      countiesData.arrayBuffer().then(async (buffer) => {
        await stream.write(new Uint8Array(buffer));
      });
    });
  });
