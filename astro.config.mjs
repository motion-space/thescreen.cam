import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";

import cloudflare from "@astrojs/cloudflare";

export default defineConfig({
  site: "https://thescreen.cam",
  output: "static",
  devToolbar: {
    enabled: false
  },
  integrations: [sitemap(), react()],

  vite: {
    plugins: [tailwindcss()],
    build: {
      cssCodeSplit: false,
      assetsInlineLimit: 2048
    }
  },

  adapter: cloudflare()
});
