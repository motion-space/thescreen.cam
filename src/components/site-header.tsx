"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useEffect, useState } from "react";
import { appStoreUrl, localeLabels, localizedPath, supportedLocales } from "../lib/i18n";
import type { Locale } from "../lib/i18n";
import type { HeaderCopy } from "../lib/translations";
import { MagneticButton } from "./magnetic-button";

type SiteHeaderProps = {
  copy: HeaderCopy;
  currentPath?: string;
  languageLabel: string;
  locale: Locale;
};

type MobilePanel = "main" | "language";

const panelVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? "100%" : "-100%",
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? "-100%" : "100%",
    opacity: 0,
  }),
};

const mobileItemVariants = {
  hidden: ({ direction }: { direction: number; index: number }) => ({
    x: direction > 0 ? 24 : -24,
    opacity: 0,
  }),
  visible: ({ index }: { direction: number; index: number }) => ({
    x: 0,
    opacity: 1,
    transition: {
      delay: 0.08 + index * 0.055,
      duration: 0.36,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
  exit: ({ direction }: { direction: number; index: number }) => ({
    x: direction > 0 ? -16 : 16,
    opacity: 0,
    transition: {
      duration: 0.18,
      ease: [0.4, 0, 1, 1],
    },
  }),
};

export function SiteHeader({
  copy,
  currentPath = "/",
  languageLabel,
  locale,
}: SiteHeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobilePanel, setMobilePanel] = useState<MobilePanel>("main");
  const [panelDirection, setPanelDirection] = useState(1);
  const navLinks = [
    { label: copy.nav.changelog, href: localizedPath(locale, "/changelog") },
    { label: copy.nav.support, href: localizedPath(locale, "/support") },
    { label: copy.nav.privacy, href: localizedPath(locale, "/privacy") },
    { label: copy.nav.terms, href: localizedPath(locale, "/terms") },
  ];

  useEffect(() => {
    if (!isMobileMenuOpen) return;

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMobileMenuOpen]);

  const toggleMobileMenu = () => {
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
      return;
    }

    setMobilePanel("main");
    setPanelDirection(1);
    setIsMobileMenuOpen(true);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const showLanguageMenu = () => {
    setPanelDirection(1);
    setMobilePanel("language");
  };

  const showMainMenu = () => {
    setPanelDirection(-1);
    setMobilePanel("main");
  };

  const rememberLocale = (nextLocale: Locale) => {
    try {
      window.localStorage.setItem("screenCamLocale", nextLocale);
    } catch {
      // Continue navigation when storage is unavailable.
    }
  };

  return (
    <>
      <div className="header-mask" aria-hidden="true">
        <span></span>
        <span></span>
        <span></span>
      </div>

      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="fixed left-0 right-0 top-0 z-[90]"
        aria-label={copy.primaryNavigationAria}
      >
        <div className="relative mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-6 md:px-12">
          <motion.a
            href={localizedPath(locale, "/")}
            className="flex cursor-pointer items-center gap-3"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label={copy.homeAria}
          >
            <img
              src="/icon-192.png"
              alt={copy.logoAlt}
              className="h-9 w-9 rounded-lg"
            />
            <span className="hidden font-medium tracking-tight text-foreground sm:inline">ScreenCam</span>
          </motion.a>

          <div className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 text-sm text-muted-foreground md:flex">
            {navLinks.map((item, i) => (
              <motion.a
                key={item.label}
                href={item.href}
                className="relative transition-colors duration-300 hover:text-foreground"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 + i * 0.1 }}
                whileHover="hover"
              >
                {item.label}
                <motion.span
                  className="absolute -bottom-1 left-0 h-px w-full origin-left bg-foreground"
                  initial={{ scaleX: 0 }}
                  variants={{ hover: { scaleX: 1 } }}
                  transition={{ duration: 0.3 }}
                />
              </motion.a>
            ))}

            <label className="sr-only" htmlFor="site-language">
              {languageLabel}
            </label>
            <div className="relative text-muted-foreground transition-colors duration-300 focus-within:text-foreground hover:text-foreground">
              <select
                id="site-language"
                aria-label={languageLabel}
                value={localizedPath(locale, currentPath)}
                onChange={(event) => {
                  const nextLocale = event.currentTarget.selectedOptions[0]?.dataset.locale;
                  if (nextLocale && supportedLocales.includes(nextLocale as Locale)) {
                    rememberLocale(nextLocale as Locale);
                  }
                  window.location.href = event.currentTarget.value;
                }}
                className="h-5 w-auto appearance-none rounded-none border-0 bg-transparent py-0 pl-0 pr-4 text-sm text-current outline-none"
              >
                {supportedLocales.map((language) => (
                  <option key={language} value={localizedPath(language, currentPath)} data-locale={language}>
                    {localeLabels[language]}
                  </option>
                ))}
              </select>
              <span
                className="pointer-events-none absolute right-0 top-1/2 h-0 w-0 -translate-y-1/2 border-x-[4px] border-t-[5px] border-x-transparent border-t-current"
                aria-hidden="true"
              />
            </div>
          </div>

          <div className="hidden items-center md:flex">
            <MagneticButton
              className="group flex items-center gap-2 text-sm text-foreground"
              onClick={() => {
                window.location.href = appStoreUrl;
              }}
            >
              {copy.appStore}
              <motion.span
                initial={{ x: 0 }}
                whileHover={{ x: 4 }}
                transition={{ duration: 0.2 }}
              >
                <ArrowRight className="h-4 w-4" />
              </motion.span>
            </MagneticButton>
          </div>

          <motion.button
            type="button"
            className="flex h-9 w-9 items-center justify-center border border-border/70 bg-background/70 text-foreground backdrop-blur transition-colors hover:border-foreground/40 md:hidden"
            aria-label={isMobileMenuOpen ? copy.closeMenuAria : copy.menuAria}
            aria-expanded={isMobileMenuOpen}
            title={isMobileMenuOpen ? copy.closeMenuAria : copy.menuAria}
            onClick={toggleMobileMenu}
            whileTap={{ scale: 0.94 }}
          >
            <span className="relative h-4 w-5" aria-hidden="true">
              <motion.span
                className="absolute left-0 top-0 h-px w-5 bg-current"
                animate={isMobileMenuOpen ? { rotate: 45, y: 7.5 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
              />
              <motion.span
                className="absolute left-0 top-1/2 h-px w-5 -translate-y-1/2 bg-current"
                animate={isMobileMenuOpen ? { opacity: 0, scaleX: 0.35 } : { opacity: 1, scaleX: 1 }}
                transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
              />
              <motion.span
                className="absolute bottom-0 left-0 h-px w-5 bg-current"
                animate={isMobileMenuOpen ? { rotate: -45, y: -7.5 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
              />
            </span>
          </motion.button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="fixed inset-0 z-[70] md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
          >
            <button
              type="button"
              className="absolute inset-0 bg-black/60"
              aria-label={copy.closeMenuAria}
              onClick={closeMobileMenu}
            />

            <motion.div
              className="absolute left-0 right-0 top-[84px] border-b border-border/70 bg-background shadow-[0_24px_90px_rgba(0,0,0,0.45)]"
              role="dialog"
              aria-modal="true"
              aria-label={copy.primaryNavigationAria}
              initial={{ y: -18, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -16, opacity: 0 }}
              transition={{ duration: 0.34, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="mx-auto w-full max-w-7xl px-6 pb-8 pt-2">
                <div className="relative min-h-[21rem] overflow-hidden">
                  <AnimatePresence custom={panelDirection}>
                    {mobilePanel === "main" ? (
                      <motion.div
                        key="main"
                        className="absolute inset-x-0 top-0"
                        custom={panelDirection}
                        variants={panelVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <div>
                          {navLinks.map((item, index) => (
                            <motion.a
                              key={item.label}
                              href={item.href}
                              custom={{ direction: panelDirection, index }}
                              variants={mobileItemVariants}
                              initial="hidden"
                              animate="visible"
                              exit="exit"
                              onClick={closeMobileMenu}
                              className="flex min-h-14 items-center justify-between border-t border-border/60 py-4 text-base font-medium text-foreground"
                            >
                              <span>{item.label}</span>
                              <ChevronRight className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                            </motion.a>
                          ))}

                          <motion.button
                            type="button"
                            custom={{ direction: panelDirection, index: navLinks.length }}
                            variants={mobileItemVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            onClick={showLanguageMenu}
                            className="flex min-h-14 w-full items-center justify-between border-t border-border/60 py-4 text-left text-base font-medium text-foreground"
                          >
                            <span>{languageLabel}</span>
                            <span className="flex items-center gap-2 text-sm font-normal text-muted-foreground">
                              {localeLabels[locale]}
                              <ChevronRight className="h-4 w-4" aria-hidden="true" />
                            </span>
                          </motion.button>

                          <motion.a
                            href={appStoreUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            custom={{ direction: panelDirection, index: navLinks.length + 1 }}
                            variants={mobileItemVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            onClick={closeMobileMenu}
                            className="flex min-h-14 items-center justify-between border-t border-border/60 py-4 text-base font-medium text-foreground"
                          >
                            <span>{copy.appStore}</span>
                            <ArrowRight className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                          </motion.a>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="language"
                        className="absolute inset-x-0 top-0"
                        custom={panelDirection}
                        variants={panelVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <div className="border-b border-border/60">
                          <motion.button
                            type="button"
                            custom={{ direction: panelDirection, index: 0 }}
                            variants={mobileItemVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            onClick={showMainMenu}
                            className="flex min-h-14 w-full items-center gap-3 border-t border-border/60 py-4 text-left text-base font-medium text-foreground"
                            aria-label={copy.backToMenuAria}
                          >
                            <ChevronLeft className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                            {languageLabel}
                          </motion.button>

                          {supportedLocales.map((language, index) => (
                            <motion.a
                              key={language}
                              href={localizedPath(language, currentPath)}
                              aria-current={language === locale ? "page" : undefined}
                              custom={{ direction: panelDirection, index: index + 1 }}
                              variants={mobileItemVariants}
                              initial="hidden"
                              animate="visible"
                              exit="exit"
                              onClick={() => {
                                rememberLocale(language);
                                closeMobileMenu();
                              }}
                              className={`flex min-h-14 items-center justify-between border-t border-border/60 py-4 text-base font-medium transition-colors ${
                                language === locale ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                              }`}
                            >
                              <span>{localeLabels[language]}</span>
                              {language === locale && (
                                <Check className="h-4 w-4 text-foreground" aria-hidden="true" />
                              )}
                            </motion.a>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
