"use client";

import { motion } from "framer-motion";
import { ArrowRight, Mail } from "lucide-react";
import { localizedPath } from "../lib/i18n";
import { getStoreCopy } from "../lib/store-copy";
import { AppleLogo, BetaTag, WindowsLogo, storeUrl, usePlatform } from "./store-buttons";
import type { Locale } from "../lib/i18n";
import type { FooterCopy } from "../lib/translations";
import { useRef } from "react";
import { FillText, fillWords, useScene } from "./mg/scene";

const supportChannels = [
  { label: "X", href: "https://x.com/cats_juice", icon: "x" },
  { label: "Discord", href: "https://discord.gg/23hVAxmj53", icon: "discord" },
  { label: "GitHub", href: "https://github.com/motion-space/thescreen.cam", icon: "github" },
  { label: "Email", href: "mailto:cats_juice@outlook.com", icon: "email" },
];

type FooterProps = {
  copy: FooterCopy;
  locale: Locale;
  showProductLinks?: boolean;
};

export function Footer({
  copy,
  locale,
  showProductLinks = true,
}: FooterProps) {
  const homePath = localizedPath(locale, "/");
  const platform = usePlatform();
  const footerLinks = {
    product: [
      { label: copy.productLinks.zoom, href: `${homePath}#zoom` },
      { label: copy.productLinks.export, href: `${homePath}#export` },
      { label: copy.productLinks.controls, href: `${homePath}#features` },
      { label: copy.productLinks.faq, href: `${homePath}#faq` },
    ],
    resources: [
      {
        label: copy.resourceLinks.alternatives ?? "Alternatives",
        href: localizedPath(locale, "/screen-studio-alternative"),
      },
      { label: copy.resourceLinks.docs, href: localizedPath(locale, "/docs") },
      { label: copy.resourceLinks.cursors, href: localizedPath(locale, "/cursors") },
      { label: copy.resourceLinks.bgm, href: localizedPath(locale, "/bgm") },
      { label: copy.resourceLinks.motionBlurMask, href: localizedPath(locale, "/motion-blur-mask") },
      { label: copy.resourceLinks.changelog, href: localizedPath(locale, "/changelog") },
      { label: copy.resourceLinks.support, href: localizedPath(locale, "/support") },
    ],
    legal: [
      { label: copy.legalLinks.privacy, href: localizedPath(locale, "/privacy") },
      { label: copy.legalLinks.terms, href: localizedPath(locale, "/terms") },
    ],
  };

  const rootRef = useRef<HTMLElement>(null);

  useScene(rootRef, ({ q, gsap, reduced }) => {
    fillWords(q, q(".ft-cta")[0], "top 85%", "top 45%");
    if (reduced) return;
    // Bookend: the wordmark that flew away at the very top drops back in.
    gsap.fromTo(q(".ft-letter"), { yPercent: -110, opacity: 0, fontVariationSettings: "'wdth' 62, 'wght' 800" }, {
      yPercent: 0,
      opacity: 1,
      fontVariationSettings: "'wdth' 125, 'wght' 800",
      stagger: 0.06,
      ease: "power2.out",
      scrollTrigger: { trigger: q(".ft-wordmark")[0], start: "top 95%", end: "bottom 95%", scrub: 0.8 },
    });
  });

  return (
    <footer ref={rootRef} className="mg-scene">
      {/* CTA */}
      <div className="ft-cta mx-auto flex w-full max-w-[1240px] flex-col items-start gap-10 px-6 pb-20 pt-28 md:flex-row md:items-end md:justify-between md:px-10 md:pt-40">
        <div>
          <span className="mg-label mg-index mb-6">Rec</span>
          <h2 className="mg-h2 mt-4 max-w-[14ch]"><FillText text={copy.ctaTitle} /></h2>
          <p className="mt-5 max-w-md text-[15px] leading-relaxed text-muted-foreground md:text-base">{copy.ctaText}</p>
        </div>
        <motion.a
          href={storeUrl(platform)}
          target="_blank"
          rel="noopener noreferrer"
          className="mg-cta store-beta-host group relative shrink-0"
          whileTap={{ scale: 0.98 }}
        >
          {platform === "windows" ? <WindowsLogo className="h-[16px] w-[16px]" /> : <AppleLogo className="h-[18px] w-[18px]" />}
          <span>{platform === "windows" ? getStoreCopy(locale).microsoftStoreButton : copy.appStoreButton}</span>
          {platform === "windows" && <BetaTag locale={locale} side="top" />}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </motion.a>
      </div>

      {/* Links */}
      <div className="mx-auto w-full max-w-[1240px] px-6 md:px-10">
        <div className={`grid grid-cols-2 gap-10 border-t border-foreground/20 py-14 ${showProductLinks ? "md:grid-cols-4" : "md:grid-cols-3"}`}>
          <div className="col-span-2 md:col-span-1">
            <div className="mb-5 flex items-center gap-3">
              <img src="/icon-192.png" alt="" className="h-9 w-9 rounded-[9px]" />
              <span className="font-semibold tracking-[-0.02em] text-foreground">ScreenCam</span>
            </div>
            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">{copy.description}</p>
            <div className="mt-6 flex items-center gap-1" aria-label={copy.supportChannelsAria}>
              {supportChannels.map((channel) => (
                <a
                  key={channel.label}
                  href={channel.href}
                  target={channel.href.startsWith("mailto:") ? undefined : "_blank"}
                  rel={channel.href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
                  aria-label={channel.label}
                  title={channel.label}
                  className="icon-button"
                >
                  <SocialIcon icon={channel.icon} />
                </a>
              ))}
            </div>
          </div>

          {showProductLinks && (
            <FooterLinkGroup title={copy.groups.product} links={footerLinks.product} delay={0.1} />
          )}
          <FooterLinkGroup title={copy.groups.resources} links={footerLinks.resources} delay={0.15} />
          <FooterLinkGroup title={copy.groups.legal} links={footerLinks.legal} delay={0.2} />
        </div>
      </div>

      {/* Wordmark bookend */}
      <div className="ft-wordmark mg-wordmark flex justify-center overflow-hidden px-[2vw] pb-2 pt-6" aria-hidden="true">
        {"SCREENCAM".split("").map((letter, index) => (
          <span key={index} className="ft-letter mg-letter inline-block">{letter}</span>
        ))}
      </div>

      {/* Bottom bar */}
      <div className="mx-auto flex w-full max-w-[1240px] flex-col items-center justify-between gap-4 border-t border-foreground/20 px-6 py-5 md:flex-row md:px-10">
        <p className="mg-label">&copy; {new Date().getFullYear()} ScreenCam. {copy.copyright}</p>
        <span className="mg-label flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
          </span>
          {copy.systemStatus}
        </span>
      </div>
    </footer>
  );
}

function SocialIcon({ icon }: { icon: string }) {
  if (icon === "email") {
    return (
      <Mail className="h-[17px] w-[17px]" strokeWidth={1.8} aria-hidden="true" />
    );
  }

  if (icon === "github") {
    return (
      <svg className="h-[17px] w-[17px]" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 2C6.48 2 2 6.58 2 12.22c0 4.51 2.87 8.33 6.84 9.68.5.09.68-.22.68-.49 0-.24-.01-.88-.01-1.73-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.11-1.5-1.11-1.5-.91-.64.07-.63.07-.63 1 .07 1.53 1.06 1.53 1.06.9 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.64-1.37-2.22-.26-4.55-1.14-4.55-5.06 0-1.12.39-2.03 1.03-2.74-.1-.26-.45-1.3.1-2.7 0 0 .84-.28 2.75 1.05A9.31 9.31 0 0 1 12 6.92c.85 0 1.7.12 2.5.35 1.9-1.33 2.74-1.05 2.74-1.05.55 1.4.2 2.44.1 2.7.64.71 1.03 1.62 1.03 2.74 0 3.93-2.34 4.79-4.57 5.05.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.8 0 .27.18.59.69.49A10.1 10.1 0 0 0 22 12.22C22 6.58 17.52 2 12 2Z" />
      </svg>
    );
  }

  if (icon === "discord") {
    return (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M19.54 5.34A16.77 16.77 0 0 0 15.35 4c-.18.33-.39.78-.53 1.13a15.6 15.6 0 0 0-4.65 0A11.8 11.8 0 0 0 9.63 4a16.7 16.7 0 0 0-4.2 1.34C2.78 9.31 2.06 13.18 2.42 17c1.78 1.32 3.51 2.12 5.2 2.65.42-.57.79-1.18 1.11-1.83-.61-.23-1.19-.52-1.74-.85.15-.11.29-.22.43-.34a11.95 11.95 0 0 0 10.16 0c.14.12.28.23.43.34-.55.33-1.13.62-1.74.85.32.65.69 1.26 1.11 1.83 1.69-.53 3.42-1.33 5.2-2.65.43-4.43-.73-8.26-3.04-11.66ZM8.76 14.65c-1.02 0-1.86-.94-1.86-2.09s.82-2.1 1.86-2.1c1.04 0 1.88.94 1.86 2.1 0 1.15-.82 2.09-1.86 2.09Zm6.48 0c-1.02 0-1.86-.94-1.86-2.09s.82-2.1 1.86-2.1c1.04 0 1.88.94 1.86 2.1 0 1.15-.82 2.09-1.86 2.09Z" />
      </svg>
    );
  }

  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.9 2h3.68l-8.04 9.19L24 22h-7.41l-5.8-7.58L4.15 22H.47l8.6-9.83L0 2h7.59l5.24 6.93L18.9 2Zm-1.29 18.1h2.04L6.48 3.8H4.29L17.61 20.1Z" />
    </svg>
  );
}

function FooterLinkGroup({
  title,
  links,
  delay
}: {
  title: string;
  links: Array<{ label: string; href: string; external?: boolean }>;
  delay: number;
}) {
  return (
    <div>
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
    >
      <h3 className="mg-label mb-6">{title}</h3>
      <ul className="space-y-3">
        {links.map((link) => (
          <li key={link.label}>
            <a
              href={link.href}
              target={link.external ? "_blank" : undefined}
              rel={link.external ? "noopener noreferrer" : undefined}
              className="group inline-flex items-center gap-2 text-sm text-foreground/80 transition-colors hover:text-foreground"
            >
              <span className="h-px w-0 bg-accent transition-all duration-300 group-hover:w-3" aria-hidden="true" />
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </motion.div>
    </div>
  );
}
