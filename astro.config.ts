import cloudflare from "@astrojs/cloudflare";
import solidJs from "@astrojs/solid-js";
import tailwind from "@astrojs/tailwind";
import { defineConfig, envField } from "astro/config";
import { passthroughImageService } from "astro/config";

export default defineConfig({
  site: "https://astro.build/config", // TODO: update
  output: "server",
  // prefetch: true,
  integrations: [solidJs(), tailwind({ applyBaseStyles: false })],
  image: { service: passthroughImageService() },
  adapter: cloudflare({
    platformProxy: { enabled: true },
  }),
  experimental: {
    contentCollectionCache: true,
    env: {
      schema: {
        API_URL: envField.string({
          context: "client",
          access: "public",
          optional: true,
        }),
        PORT: envField.number({
          context: "server",
          access: "public",
          default: 4321,
        }),
        TURSO_DATABASE_URL: envField.string({
          context: "server",
          access: "secret",
          default: import.meta.env.DEV ? "http://127.0.0.1:8080" : undefined,
        }),
        TURSO_AUTH_TOKEN: envField.string({
          context: "server",
          access: "secret",
          default: import.meta.env.DEV ? "" : undefined,
        }),
      },
    },
  },
});
