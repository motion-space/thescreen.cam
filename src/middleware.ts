import { defineMiddleware } from "astro:middleware";
import {
  defaultLocale,
  getLocaleFromCookieHeader,
  getPreferredLocaleFromAcceptLanguage,
  localizedLocales,
  localizedPath,
} from "./lib/i18n";

export const onRequest = defineMiddleware((context, next) => {
  const { request, url } = context;
  const isRootRequest = url.pathname === "/" || url.pathname === "/index.html";
  const canRedirect = request.method === "GET" || request.method === "HEAD";

  if (isRootRequest && canRedirect) {
    const preferredLocale =
      getLocaleFromCookieHeader(request.headers.get("cookie")) ??
      getPreferredLocaleFromAcceptLanguage(request.headers.get("accept-language"));

    if (preferredLocale !== defaultLocale && localizedLocales.includes(preferredLocale)) {
      const redirectUrl = new URL(url);
      redirectUrl.pathname = localizedPath(preferredLocale, "/");

      return new Response(null, {
        status: 302,
        headers: {
          "Cache-Control": "private, no-store",
          Location: redirectUrl.toString(),
          Vary: "Accept-Language, Cookie",
        },
      });
    }
  }

  return next();
});
