import { Hono } from "hono";
import { csrf } from "hono/csrf";
import { mapRouter } from "./map";

/**
 * API router. Includes all routes from `@/server/api/*`
 * */
export const apiRouter = new Hono()
  .basePath("/")
  .use(csrf())
  .route("/map", mapRouter);

export type ApiRouter = typeof apiRouter;
