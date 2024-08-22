import { Hono } from "hono";
import * as v from "valibot";
import { vValidator } from "@hono/valibot-validator";

import type { APIRoute } from "astro";

const app = new Hono()
  .basePath("/api")
  .get("/health", (c) => c.json({ status: "ok" }))
  .post(
    "/login",
    vValidator(
      "json",
      v.object({
        email: v.pipe(v.string(), v.email(), v.nonEmpty()),
        password: v.pipe(v.string(), v.minLength(8), v.nonEmpty()),
      }),
      (result, c) => {
        return c.json(result);
      },
    ),
  );

export const ALL: APIRoute = (context) => app.fetch(context.request);
export type App = typeof app;
