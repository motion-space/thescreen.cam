import type { APIRoute } from "astro";
import bgmManifest from "../../data/generated/bgm.json";

export const prerender = true;

export const GET: APIRoute = async () =>
  new Response(JSON.stringify(bgmManifest), {
    headers: {
      "Cache-Control": "public, max-age=3600",
      "Content-Type": "application/json; charset=utf-8",
    },
  });
