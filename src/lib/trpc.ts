import { publicConfig } from "@/config.public";
import type { ApiRouter } from "@/server/api";
import { createTRPCClient, httpBatchLink } from "@trpc/client";

/**
 * A regular TRPC Client that can be used in the browser.
 *
 * Not recommended to use in SSR. Use initTRPCSSRClient instead.
 */
export const trpcClient = createTRPCClient<ApiRouter>({
  links: [
    // No batching:
    // httpLink({
    // url: `${publicConfig.BASE_ORIGIN}/api`
    // }),

    // With batching:
    httpBatchLink({
      url: `${publicConfig?.PUBLIC_BASE_HOST}/api`,
    }),
  ],
});

/**
 * Motivation: For TRPC to work seamlessly SSR, we have to proxy the Request and Response headers
 * as if we're in the browser.
 * *
 * To do that, we always need to initialize the trpc client with:
 * - the request headers from the browser
 * - and assign back the response headers back to the browser.
 *
 * If you're doing session auth on http-only cookies, this is super important to use.
 *
 * Reference: Solution on how to read the response headers: https://discord-questions.trpc.io/m/1115562530283196466#solution-1115565818395230289
 *
 * @example
 * // Your data loader function:
 *
 * export const data = async (pageContext: PageContext) => {
 *    const { request, response } = pageContext;
 *
 *    // Every trpc request using this client will now include request headers
 *    // from the browser, and pass response headers back to the browser.
 *    const trpcClient = initTRPCSSRClient(request.header(), response.headers);
 *
 *    const result = await trpcClient.auth.currentUser.query();
 * }
 */
export const initTRPCSSRClient = (
  /** Pass the request headers sent by the browser here. */
  requestHeaders: Record<string, string>,
  /** Pass the response headers to be sent back to the browser here. */
  responseHeaders: Headers,
) => {
  return createTRPCClient<ApiRouter>({
    links: [
      httpBatchLink({
        url: `${publicConfig?.PUBLIC_BASE_HOST}/api`,

        // Proxy the Request headers from the browser -> server.
        headers: () => requestHeaders ?? {},

        // Proxy the Response headers from the server -> browser.
        fetch: async (url, options) => {
          const response = await fetch(url, options);

          // This is where we proxy it back.
          for (const [key, value] of response.headers) {
            // Don't set back the Content-Type header (Otherwise, content-type HTML would become a json).
            if (key.toLowerCase() === "content-type") continue;

            responseHeaders?.set(key, value);
          }

          return response;
        },
      }),
    ],
  });
};
