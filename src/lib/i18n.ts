export const siteUrl = "https://thescreen.cam";
export const appStoreUrl =
  "https://apps.apple.com/cn/app/screencam-screen-studio/id6770877568?l=en-GB&mt=12";

export const defaultLocale = "en";
export const supportedLocales = ["en", "zh-Hans", "de", "ja", "ko"] as const;
export const localizedLocales = supportedLocales.filter((locale) => locale !== defaultLocale);
export const localePreferenceCookieName = "screenCamLocale";

export type Locale = (typeof supportedLocales)[number];

export const localeLabels: Record<Locale, string> = {
  en: "English",
  "zh-Hans": "简体中文",
  de: "Deutsch",
  ja: "日本語",
  ko: "한국어",
};

export function isLocale(value: string | undefined): value is Locale {
  return supportedLocales.includes(value as Locale);
}

export function getLocale(value: string | undefined): Locale {
  return isLocale(value) ? value : defaultLocale;
}

export function matchSupportedLocale(value: string | undefined): Locale | undefined {
  if (!value) return undefined;

  const locale = value.trim().toLowerCase();
  if (!locale || locale === "*") return undefined;

  if (locale === "zh" || locale.startsWith("zh-")) {
    return "zh-Hans";
  }

  return supportedLocales.find(
    (supportedLocale) => supportedLocale.toLowerCase() === locale.split("-")[0],
  );
}

export function getPreferredLocaleFromAcceptLanguage(header: string | null): Locale {
  if (!header) return defaultLocale;

  const candidates = header
    .split(",")
    .map((part, index) => {
      const [language = "", ...parameters] = part.trim().split(";");
      const qualityParameter = parameters.find((parameter) => parameter.trim().startsWith("q="));
      const quality = qualityParameter ? Number.parseFloat(qualityParameter.split("=")[1] ?? "") : 1;

      return {
        index,
        language,
        quality: Number.isFinite(quality) ? quality : 0,
      };
    })
    .filter((candidate) => candidate.quality > 0)
    .sort((a, b) => b.quality - a.quality || a.index - b.index);

  for (const candidate of candidates) {
    const locale = matchSupportedLocale(candidate.language);
    if (locale) return locale;
  }

  return defaultLocale;
}

export function getLocaleFromCookieHeader(header: string | null): Locale | undefined {
  if (!header) return undefined;

  for (const part of header.split(";")) {
    const [rawName = "", ...rawValue] = part.trim().split("=");

    if (rawName !== localePreferenceCookieName) {
      continue;
    }

    let value: string;

    try {
      value = decodeURIComponent(rawValue.join("="));
    } catch {
      continue;
    }

    if (isLocale(value)) return value;
  }

  return undefined;
}

export function localizedPath(locale: Locale, path: string): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const cleanPath = normalizedPath === "/" ? "" : normalizedPath;

  if (locale === defaultLocale) {
    return cleanPath || "/";
  }

  if (!cleanPath) {
    return `/${locale}/`;
  }

  return `/${locale}${cleanPath}`;
}

export function getLocalizedStaticPaths() {
  return localizedLocales.map((locale) => ({
    params: { lang: locale },
    props: { locale },
  }));
}
