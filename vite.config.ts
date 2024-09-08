// Hono
import devServer from "@hono/vite-dev-server";
import adapter from "@hono/vite-dev-server/cloudflare";

import { pages } from "vike-cloudflare";
// Vike
import vikeSolid from "vike-solid/vite";
import vike from "vike/plugin";
import solidSvg from "vite-plugin-solid-svg"; // Custom Icons (SVG)

// Vite
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const root = resolve(__dirname, ".");
const tw = resolve(__dirname, "tailwind.config.js");

export default defineConfig({
  plugins: [
    devServer({
      entry: "src/server/app.ts",
      adapter,

      exclude: [
        /^\/@.+$/,
        /.*\.(ts|tsx|vue)($|\?)/,
        /.*\.(s?css|less)($|\?)/,
        /^\/favicon\.ico$/,
        /.*\.(svg|png)($|\?)/,
        /^\/(public|assets|static)\/.+/,
        /^\/node_modules\/.*/,
      ],

      injectClientScript: false,
    }),
    vike({}),
    vikeSolid(),
    solidSvg(),

    pages({
      server: {
        kind: "hono",
        entry: "src/server/app.ts",
      },
    }),
  ],
  server: {
    port: 3000,
  },
  ssr: {
    noExternal: ["@kobalte/tailwindcss"],
  },
  preview: {
    port: 3000,
  },
  resolve: {
    alias: {
      "@": resolve(root, "src"),
      "tailwind.config.js": tw,
    },
  },
  optimizeDeps: {
    include: ["mapbox-gl", tw],
  },
});
