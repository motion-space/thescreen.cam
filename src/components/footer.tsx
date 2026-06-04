"use client";

import { motion } from "framer-motion";
import { ArrowRight, Mail } from "lucide-react";
import { appStoreUrl, localizedPath } from "../lib/i18n";
import type { Locale } from "../lib/i18n";
import type { FooterCopy } from "../lib/translations";

const supportChannels = [
  { label: "X", href: "https://x.com/cats_juice", icon: "x" },
  { label: "Discord", href: "https://discord.gg/23hVAxmj53", icon: "discord" },
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
  const footerLinks = {
    product: [
      { label: copy.productLinks.zoom, href: `${homePath}#zoom` },
      { label: copy.productLinks.export, href: `${homePath}#export` },
      { label: copy.productLinks.controls, href: `${homePath}#controls` },
      { label: copy.productLinks.faq, href: `${homePath}#faq` },
    ],
    resources: [
      { label: copy.resourceLinks.motionBlurMask, href: localizedPath(locale, "/motion-blur-mask") },
      { label: copy.resourceLinks.appStore, href: appStoreUrl, external: true },
      { label: copy.resourceLinks.changelog, href: localizedPath(locale, "/changelog") },
      { label: copy.resourceLinks.support, href: localizedPath(locale, "/support") },
    ],
    legal: [
      { label: copy.legalLinks.privacy, href: localizedPath(locale, "/privacy") },
      { label: copy.legalLinks.terms, href: localizedPath(locale, "/terms") },
    ],
  };

  return (
    <footer className="relative bg-background border-t border-border/50">
      {/* CTA Section */}
      <div className="border-b border-border/50">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-24">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8"
          >
            <div>
              <h2 className="text-[clamp(1.5rem,3vw,2.5rem)] font-bold leading-tight tracking-tight text-foreground mb-2">
                {copy.ctaTitle}
              </h2>
              <p className="text-muted-foreground">
                {copy.ctaText}
              </p>
            </div>
            <motion.a
              href={appStoreUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3 bg-foreground text-background px-6 py-3 text-sm font-medium hover:bg-foreground/90 transition-colors shrink-0"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              <span>{copy.appStoreButton}</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </motion.a>
          </motion.div>
        </div>
      </div>

      {/* Links Section */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16">
        <div className={`grid grid-cols-2 gap-8 md:gap-12 ${showProductLinks ? "md:grid-cols-4" : "md:grid-cols-3"}`}>
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <img
                  src="/icon-192.png"
                  alt=""
                  className="w-9 h-9 rounded-lg"
                />
                <span className="font-semibold text-foreground">ScreenCam</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {copy.description}
              </p>
              <div className="mt-5 flex items-center gap-2" aria-label={copy.supportChannelsAria}>
                {supportChannels.map((channel) => (
                  <a
                    key={channel.label}
                    href={channel.href}
                    target={channel.href.startsWith("mailto:") ? undefined : "_blank"}
                    rel={channel.href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
                    aria-label={channel.label}
                    title={channel.label}
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-border/70 text-muted-foreground transition-colors hover:border-foreground/40 hover:text-foreground"
                  >
                    <SocialIcon icon={channel.icon} />
                  </a>
                ))}
              </div>
            </motion.div>
          </div>

          {showProductLinks && (
            <FooterLinkGroup title={copy.groups.product} links={footerLinks.product} delay={0.1} />
          )}

          {/* Resources Links */}
          <FooterLinkGroup title={copy.groups.resources} links={footerLinks.resources} delay={0.15} />

          {/* Legal Links */}
          <FooterLinkGroup title={copy.groups.legal} links={footerLinks.legal} delay={0.2} />

        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border/50">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} ScreenCam. {copy.copyright}</p>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              {copy.systemStatus}
            </span>
          </div>
        </div>
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
    >
      <h3 className="text-sm font-medium text-foreground mb-4">{title}</h3>
      <ul className="space-y-3">
        {links.map((link) => (
          <li key={link.label}>
            <a
              href={link.href}
              target={link.external ? "_blank" : undefined}
              rel={link.external ? "noopener noreferrer" : undefined}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}
