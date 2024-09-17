import { publicConfig } from "@/config.public";
import type { apiRouter } from "@/server/app";
import { Hono as DefaultHono } from "hono";
import { type ClientRequestOptions, hc as honoClient } from "hono/client";
import type { EventContext } from "hono/cloudflare-pages";

const host = publicConfig.PUBLIC_ENV__BASE_URL ?? "http://localhost:3000";

export const Hono = DefaultHono<{
  Bindings: Env & { eventContext: EventContext };
}>;

/**
 * Creates a Hono client for the API.
 *
 * @template T extends ApiRouter = ApiRouter - The API router.
 * @param options - Options for the client.
 * @returns A client for the API.
 */
const createHonoClient = (options?: ClientRequestOptions) => {
  const client = honoClient<typeof apiRouter>(`${host}/api`, options);
  return client as typeof client;
};

/**
 * Creates a Hono client for the API with SSR support.
 *
 * @param requestHeaders - Request headers sent by the browser.
 * @param responseHeaders - Response headers to be sent back to the browser.
 * @returns A client for the API.
 */
export const createHonoClientSSR = (
  requestHeaders: Record<string, string>,
  responseHeaders: Headers,
) => {
  return createHonoClient({
    // Proxy Request headers from the browser -> server.
    headers: () => requestHeaders ?? {},
    // Proxy Response headers from the server -> browser.
    fetch: async (input, requestInit, _, __) => {
      const response = await fetch(input, requestInit);

      // Proxy it back.
      for (const [key, value] of response.headers) {
        // Don't set Content-Type header; content-type HTML would become JSON.
        if (key.toLowerCase() === "content-type") continue;

        responseHeaders?.set(key, value);
      }

      return response;
    },
  });
};

export const hc = createHonoClient();
