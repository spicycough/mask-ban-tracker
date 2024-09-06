import { Hono } from "hono";
import { serveStatic } from "hono/cloudflare-pages";
import { csrf } from "hono/csrf";
import { renderPage } from "vike/server";
import { privateConfig } from "../config.private";
import { mapRouter } from "./routers";

/**
 * API router. Includes all routes from `@/server/api/*`
 * */
export const apiRouter = new Hono()
  .basePath("/")
  .use(csrf())
  .route("/map", mapRouter);

export type ApiRouter = typeof apiRouter;

/**
 * Base router
 **/
const app = new Hono();

// Health checks
app.get("/up", async (c) => {
  return c.newResponse("🟢 UP", { status: 200 });
});

// For the Backend APIs
app.route("/api", apiRouter);

// For static files
app.use("/public/*", serveStatic());

// For the Frontend + SSR
app.get("*", async (c, next) => {
  const pageContextInit = {
    urlOriginal: c.req.url,
    request: c.req,
    response: c.res,
  };
  const pageContext = await renderPage(pageContextInit);
  const { httpResponse } = pageContext;
  if (!httpResponse) {
    return next();
  }
  const { body, statusCode, headers } = httpResponse;
  for (const [name, value] of headers) {
    c.header(name, value);
  }
  c.status(statusCode);

  return c.body(body);
});

// Returning errors.
app.onError((err, c) => {
  console.error(err.message);
  const message = c.error?.message ?? err.message ?? "Something went wrong.";
  return c.json({ error: { message } }, 500);
});

console.log(`Running at http://localhost:${privateConfig.PORT}`);

export type App = typeof app;

export default {
  port: privateConfig.PORT,
  fetch: app.fetch,
};

// if (privateConfig.NODE_ENV === "production") {
//   app.use(
//     "/*",
//     serveStatic({
//       root: "./dist/client/",
//     }),
//   );
// }
