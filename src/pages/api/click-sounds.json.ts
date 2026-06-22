import type { APIRoute } from "astro";
import clickSoundsManifest from "../../data/generated/click-sounds.json";

export const prerender = true;

export const GET: APIRoute = async () =>
  new Response(JSON.stringify(clickSoundsManifest), {
    headers: {
      "Cache-Control": "public, max-age=3600",
      "Content-Type": "application/json; charset=utf-8",
    },
  });
