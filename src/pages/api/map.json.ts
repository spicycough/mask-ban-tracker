import { MAPTILER_API_KEY } from "astro:env/server";
import geo from "@/assets/geo/style-positron.json";
import type { APIRoute } from "astro";

const isValidUrl = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
};

const replaceParam = (str: string, key: string, value: string): string => {
  return str.replace(new RegExp(`\{${key}\}`, "g"), value);
};

export const GET: APIRoute = async ({ params, request }) => {
  // Set source url
  const rawSourceUrl = decodeURI(geo.sources.openmaptiles.url);
  geo.sources.openmaptiles.url = replaceParam(
    rawSourceUrl,
    "key",
    MAPTILER_API_KEY,
  );
  console.log("SOURCE URL", geo.sources.openmaptiles.url);

  // Set glyphs url
  const rawGlyphUrl = decodeURI(geo.glyphs);
  geo.glyphs = replaceParam(rawGlyphUrl, "key", MAPTILER_API_KEY);
  console.log("GLYPH URL", geo.glyphs);

  const data = JSON.stringify(geo);
  return new Response(data);
};
