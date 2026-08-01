import type { APIRoute } from "astro";
import cursorCatalog from "../../data/generated/cursors.json";

export const prerender = true;

export const GET: APIRoute = async () =>
  new Response(JSON.stringify(cursorCatalog), {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
      "Content-Type": "application/json; charset=utf-8",
    },
  });
