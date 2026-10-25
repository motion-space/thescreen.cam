import type { APIRoute } from "astro";
import { siteUrl } from "../../../lib/i18n";
import { getWindowsChangelogFeed } from "../../../lib/windows-changelog";

export const prerender = true;

// Machine-readable Windows release notes for the app's update prompt:
// { platform, url, versions: [{ version, notes: { en: string[], "zh-Hans": string[] },
//   highlights: { en: string[], "zh-Hans": string[] } }] }, newest first. Highlights are the
// short (at most 3) lines the in-app update reminder shows; notes are the full release notes.
export const GET: APIRoute = async () =>
  new Response(JSON.stringify(getWindowsChangelogFeed(siteUrl)), {
    headers: {
      "Cache-Control": "public, max-age=3600",
      "Content-Type": "application/json; charset=utf-8",
    },
  });
