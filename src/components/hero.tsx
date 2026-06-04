"use client";

import { ArrowRight } from "lucide-react";
import { appStoreUrl } from "../lib/i18n";
import type { Locale } from "../lib/i18n";
import type { HeaderCopy, HeroCopy } from "../lib/translations";
import { ShaderBackground } from "./shader-background";
import { MotionBlurText } from "./motion-blur-text";
import { MagneticButton } from "./magnetic-button";
import { SiteHeader } from "./site-header";
import { LiquidGlassMaterial } from "./liquid-glass-material";

type HeroProps = {
  copy: HeroCopy;
  currentPath?: string;
  headerCopy: HeaderCopy;
  languageLabel: string;
  locale: Locale;
};

export function Hero({
  copy,
  currentPath = "/",
  headerCopy,
  languageLabel,
  locale,
}: HeroProps) {
  const isChineseHero = locale === "zh-Hans";

  return (
    <section className="relative min-h-screen bg-background overflow-hidden">
      <ShaderBackground />
      <SiteHeader
        copy={headerCopy}
        currentPath={currentPath}
        languageLabel={languageLabel}
        locale={locale}
      />

      {/* Main content */}
      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl flex-col justify-center px-6 pt-24 md:px-12">
        {/* Hero text */}
        <div className="hero-title-wrap">
          <h1 className={`hero-motion-title ${isChineseHero ? "hero-motion-title-zh" : ""}`}>
            {copy.titleLines.map((line, lineIndex) => (
              <span className="hero-title-line" key={`${line[0]}-${line[1]}`}>
                <span className="hero-title-part">
                  <MotionBlurText
                    animateEntrance={false}
                    delay={0.2 + lineIndex * 0.32}
                  >
                    {line[0]}
                  </MotionBlurText>
                </span>
                <span className="hero-title-space" aria-hidden="true"> </span>
                <span className="hero-title-part">
                  <MotionBlurText
                    animateEntrance={false}
                    delay={0.36 + lineIndex * 0.3}
                  >
                    {line[1]}
                  </MotionBlurText>
                </span>
              </span>
            ))}
          </h1>
        </div>

        {/* Bottom section */}
        <div className="hero-ssr-visible absolute bottom-8 md:bottom-12 left-6 md:left-12 right-6 md:right-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
          {/* Left side info */}
          <div className="flex flex-col gap-6 max-w-4xl">
            <p className="max-w-[56rem] text-sm leading-relaxed text-muted-foreground">
              {copy.tagline}
            </p>
            <MagneticButton
              className="liquid-glass-cta group flex w-fit cursor-pointer items-center gap-3 px-6 py-3 text-sm font-medium"
              onClick={() => {
                window.open(appStoreUrl, "_blank", "noopener,noreferrer");
              }}
            >
              <LiquidGlassMaterial />
              <svg className="relative z-10 h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              <span className="relative z-10">{copy.appStoreButton}</span>
              <ArrowRight className="relative z-10 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </MagneticButton>
          </div>

          {/* Right side features */}
          <div className="flex gap-8 md:gap-12">
            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground tracking-widest uppercase">{copy.builtWithLabel}</span>
              <span className="text-sm text-foreground font-medium">{copy.builtWithValue}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground tracking-widest uppercase">{copy.systemLabel}</span>
              <span className="text-sm text-foreground font-medium">{copy.systemValue}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scan line effect */}
      <div
        className="absolute inset-0 pointer-events-none z-20"
        style={{
          background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.01) 2px, rgba(255,255,255,0.01) 4px)",
        }}
      />
    </section>
  );
}
