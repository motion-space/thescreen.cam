import type { APIRoute } from "astro";
import { fetchDownloadChannel, isDownloadChannel } from "../../../lib/downloads";

export const prerender = false;

export const GET: APIRoute = async ({ params }) => {
  const channel = params.channel;

  if (!channel || !isDownloadChannel(channel)) {
    return new Response("Unknown download channel", {
      status: 404,
      headers: {
        "Cache-Control": "no-store",
        "Content-Type": "text/plain; charset=utf-8"
      }
    });
  }

  const download = await fetchDownloadChannel(channel);

  return new Response(null, {
    status: 302,
    headers: {
      "Cache-Control": "no-store",
      Location: download.url
    }
  });
};
