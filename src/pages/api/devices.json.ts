import type { APIRoute } from "astro";
import devices from "../../data/generated/devices.json";
export const prerender = true;
export const GET: APIRoute = async () => new Response(JSON.stringify(devices), {
  headers: { "Cache-Control": "no-cache", "Content-Type": "application/json; charset=utf-8" }
});
