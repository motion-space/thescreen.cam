import type { APIRoute } from "astro";
import { fetchDownloadChannel } from "../../lib/downloads";

export const prerender = false;

export const GET: APIRoute = async () => {
  const [release, nightly] = await Promise.all([fetchDownloadChannel("release"), fetchDownloadChannel("nightly")]);

  return new Response(JSON.stringify({ release, nightly }), {
    headers: {
      "Cache-Control": "no-store",
      "Content-Type": "application/json; charset=utf-8"
    }
  });
};
