import { Hono } from "hono";

import type { APIRoute } from "astro";

const app = new Hono()
  .basePath("/api")
  .get("/health", (c) => c.json({ status: "ok" }));

export const ALL: APIRoute = (context) => app.fetch(context.request);
export type App = typeof app;
