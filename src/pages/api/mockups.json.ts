import type { APIRoute } from "astro";
import mockupsManifest from "../../data/generated/mockups.json";

export const prerender = true;

export const GET: APIRoute = async () =>
  new Response(JSON.stringify(mockupsManifest), {
    headers: {
      "Cache-Control": "public, max-age=3600",
      "Content-Type": "application/json; charset=utf-8",
    },
  });
