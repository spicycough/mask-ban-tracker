import { MAPTILER_API_KEY } from "astro:env/server";
import counties from "@/assets/geo/us-counties.json";
import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ params, request }) => {
  return new Response(JSON.stringify(counties));
};
