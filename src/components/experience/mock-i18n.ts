import type { Locale } from "../../lib/i18n";
import { MOCK_COPY } from "./mock-copy";

/**
 * Localizes the strings painted inside the canvas editor mock. Source strings are the
 * English UI copy; each locale maps them to its translation and falls back to English.
 */
let table: Record<string, string> | undefined;
const seen = new Set<string>();

export function setMockLocale(locale: Locale) {
  table = locale === "en" ? undefined : MOCK_COPY[locale];
}

export function tr(value: string) {
  if (typeof window !== "undefined" && (window as { __collectMockStrings?: boolean }).__collectMockStrings) seen.add(value);
  return table?.[value] ?? value;
}

if (typeof window !== "undefined") (window as { __mockStrings?: () => string[] }).__mockStrings = () => [...seen];
