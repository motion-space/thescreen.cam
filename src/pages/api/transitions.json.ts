import type { APIRoute } from "astro";
import transitionCatalog from "../../data/generated/transitions.json";

export const prerender = true;

// Both the discovery payload and each immutable package are authenticated by the
// publisher's pinned Ed25519 key. Clients verify before showing/installing content.
export const GET: APIRoute = async () =>
  new Response(JSON.stringify(transitionCatalog), {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
      "Content-Type": "application/json; charset=utf-8",
      "X-Content-Type-Options": "nosniff",
    },
  });
