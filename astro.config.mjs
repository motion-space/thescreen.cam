import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://thescreen.cam",
  output: "static",
  integrations: [sitemap()],
  vite: {
    build: {
      cssCodeSplit: false,
      assetsInlineLimit: 2048
    }
  }
});
