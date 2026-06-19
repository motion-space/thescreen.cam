import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";

import cloudflare from "@astrojs/cloudflare";

const isDevServer = process.argv.includes("dev");

export default defineConfig({
  site: "https://thescreen.cam",
  output: "static",
  devToolbar: {
    enabled: false
  },
  server: {
    host: true
  },
  integrations: [
    sitemap({
      filter: (page) => {
        const pathname = new URL(page).pathname.replace(/\/$/, "");
        return !pathname.endsWith("/mockup-maker");
      },
    }),
    react(),
  ],

  vite: {
    ...(isDevServer ? { optimizeDeps: { force: true } } : {}),
    plugins: [tailwindcss()],
    build: {
      cssCodeSplit: false,
      assetsInlineLimit: 2048
    }
  },

  adapter: cloudflare()
});
