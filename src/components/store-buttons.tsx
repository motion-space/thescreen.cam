"use client";

import { useEffect, useState } from "react";
import { appStoreUrl, microsoftStoreUrl, type Locale } from "../lib/i18n";
import { getStoreCopy } from "../lib/store-copy";

export type Platform = "mac" | "windows";

function detectPlatform(): Platform {
  if (typeof navigator === "undefined") return "mac";
  // dev only: preview either variant with ?os=windows / ?os=mac
  if (import.meta.env.DEV) {
    const forced = new URLSearchParams(location.search).get("os");
    if (forced === "windows" || forced === "mac") return forced;
  }
  const hinted = (navigator as Navigator & { userAgentData?: { platform?: string } }).userAgentData?.platform;
  const platform = hinted || navigator.platform;
  // platform hints are "Windows" / "Win32" / "Win64"; fall back to the UA string
  if (platform) return /^win/i.test(platform) ? "windows" : "mac";
  return /Windows/.test(navigator.userAgent) ? "windows" : "mac";
}

/**
 * The visitor's OS, for picking a store. Renders as macOS on the server and
 * switches after hydration, so Windows visitors see the Microsoft Store.
 */
export function usePlatform(): Platform {
  const [platform, setPlatform] = useState<Platform>("mac");
  useEffect(() => setPlatform(detectPlatform()), []);
  return platform;
}

export const storeUrl = (platform: Platform) => (platform === "windows" ? microsoftStoreUrl : appStoreUrl);

export function AppleLogo({ className = "h-[17px] w-[17px]" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
    </svg>
  );
}

export function WindowsLogo({ className = "h-[15px] w-[15px]" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M2 4.6 10 3.5v7.8H2zM11 3.36 22 2v9.3H11zM2 12.4h8v7.8l-8-1.1zM11 12.4h11V22l-11-1.5z" />
    </svg>
  );
}

/**
 * The Beta tag for the Windows version, with a tooltip shown while the
 * enclosing link (`.store-beta-host`) is hovered or focused.
 */
export function BetaTag({ locale, side = "bottom", align = "center" }: { locale: Locale; side?: "top" | "bottom"; align?: "center" | "end" }) {
  const copy = getStoreCopy(locale);
  // the tooltip lives inside the link, so it is also part of its accessible name
  return (
    <>
      <span className="store-beta">{copy.beta}</span>
      <span role="tooltip" className="store-tip" data-side={side} data-align={align}>
        {copy.betaTooltip}
      </span>
    </>
  );
}
