import cloudflare from "@astrojs/cloudflare";
import solid from "@astrojs/solid-js";
import tailwind from "@astrojs/tailwind";
import { defineConfig, envField } from "astro/config";
import { passthroughImageService } from "astro/config";

export default defineConfig({
  site: "https://astro.build/config", // TODO: update
  output: "server",
  // prefetch: true,
  integrations: [
    solid({ devtools: true }),
    tailwind({ applyBaseStyles: false }),
  ],
  image: { service: passthroughImageService() },
  adapter: cloudflare({
    platformProxy: { enabled: true },
  }),
  vite: {
    optimizeDeps: { include: ["mapbox-gl"] },
    // optimizeDeps: { include: ["mapbox-gl"] },
    // resolve: {
    //   alias: {
    //     "mapbox-gl": "maplibre-gl",
    //   },
    // },
  },
  experimental: {
    contentCollectionCache: true,
    env: {
      schema: {
        MAPTILER_API_KEY: envField.string({
          context: "server",
          access: "public",
        }),
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
      },
    },
  },
});
