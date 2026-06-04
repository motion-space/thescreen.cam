export const siteUrl = "https://thescreen.cam";
export const appStoreUrl =
  "https://apps.apple.com/cn/app/screencam-screen-studio/id6770877568?l=en-GB&mt=12";

export const defaultLocale = "en";
export const supportedLocales = ["en", "zh-Hans", "de", "ja", "ko"] as const;
export const localizedLocales = supportedLocales.filter((locale) => locale !== defaultLocale);

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

export function localizedPath(locale: Locale, path: string): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const cleanPath = normalizedPath === "/" ? "" : normalizedPath;

  if (locale === defaultLocale) {
    return cleanPath || "/";
  }

  return `/${locale}${cleanPath}`;
}

export function getLocalizedStaticPaths() {
  return localizedLocales.map((locale) => ({
    params: { lang: locale },
    props: { locale },
  }));
}
