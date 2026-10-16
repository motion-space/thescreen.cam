"use client";

import { AnimatePresence, motion, useReducedMotion, type Variants } from "framer-motion";
import {
  ArrowRight,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Moon,
  Sun,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  localeLabels,
  localePreferenceCookieName,
  localizedPath,
  supportedLocales,
} from "../lib/i18n";
import type { Locale } from "../lib/i18n";
import type { HeaderCopy } from "../lib/translations";
import { applyTheme, getDocumentTheme, themeStorageKey } from "../lib/theme";
import { ViewfinderCursor } from "./site-effects";
import { BetaTag, storeUrl, usePlatform } from "./store-buttons";
import { getStoreCopy } from "../lib/store-copy";

type SiteHeaderProps = {
  copy: HeaderCopy;
  currentPath?: string;
  languagePath?: string;
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

const mobileItemVariants: Variants = {
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
  languagePath = currentPath,
  languageLabel,
  locale,
}: SiteHeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileMenuPresent, setIsMobileMenuPresent] = useState(false);
  const reducedMotion = useReducedMotion();
  const menuTransition = { duration: reducedMotion ? 0.1 : 0.34, ease: [0.16, 1, 0.3, 1] as const };
  const itemVariants: Variants = reducedMotion ? { hidden: { opacity: 0, x: 0 }, visible: { opacity: 1, x: 0, transition: { duration: 0.1 } }, exit: { opacity: 0, x: 0, transition: { duration: 0.1 } } } : mobileItemVariants;
  const mobilePanelVariants = reducedMotion ? { enter: { x: 0, opacity: 0 }, center: { x: 0, opacity: 1 }, exit: { x: 0, opacity: 0 } } : panelVariants;
  const [mobilePanel, setMobilePanel] = useState<MobilePanel>("main");
  const [panelDirection, setPanelDirection] = useState(1);
  const navLinks = [
    { label: copy.nav.docs, href: localizedPath(locale, "/docs"), path: "/docs" },
    { label: copy.nav.cursors, href: localizedPath(locale, "/cursors"), path: "/cursors" },
    { label: copy.nav.changelog, href: localizedPath(locale, "/changelog"), path: "/changelog" },
    { label: copy.nav.support, href: localizedPath(locale, "/support"), path: "/support" },
  ];
  const currentLanguageLabel = localeLabels[locale];
  const platform = usePlatform();
  const storeCopy = getStoreCopy(locale);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOverMedia, setIsOverMedia] = useState(false);

  useEffect(() => {
    const handleOverMedia = (event: Event) => setIsOverMedia(Boolean((event as CustomEvent<boolean>).detail));
    setIsOverMedia(Boolean((window as Window & { __scOverMedia?: boolean }).__scOverMedia));
    window.addEventListener("sc:over-media", handleOverMedia);
    return () => window.removeEventListener("sc:over-media", handleOverMedia);
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 8);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!isMobileMenuPresent) return;

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
  }, [isMobileMenuPresent]);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 768px)");
    const closeOnDesktop = () => { if (desktop.matches) setIsMobileMenuOpen(false); };
    desktop.addEventListener("change", closeOnDesktop);
    return () => desktop.removeEventListener("change", closeOnDesktop);
  }, []);

  const toggleMobileMenu = () => {
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
      return;
    }

    setMobilePanel("main");
    setPanelDirection(1);
    setIsMobileMenuPresent(true);
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

    const maxAge = 60 * 60 * 24 * 365;
    const secure = window.location.protocol === "https:" ? "; Secure" : "";
    document.cookie = `${localePreferenceCookieName}=${encodeURIComponent(nextLocale)}; Max-Age=${maxAge}; Path=/; SameSite=Lax${secure}`;
  };

  return (
    <>
      <ViewfinderCursor />

      <motion.nav
        className={`site-bar ${isScrolled ? "is-scrolled" : ""} ${isMobileMenuPresent ? "is-menu-open" : ""} ${isOverMedia && !isMobileMenuPresent ? "theme-dark over-media" : ""}`}
        aria-label={copy.primaryNavigationAria}
      >
        <div className="site-bar-inner">
          <div className="flex items-center gap-5">
            <motion.a
              href={localizedPath(locale, "/")}
              className="flex cursor-pointer items-center gap-2.5"
              whileTap={{ scale: 0.97 }}
              aria-label={copy.homeAria}
            >
              <img
                src="/icon-192.png"
                alt={copy.logoAlt}
                className="h-8 w-8 rounded-[8px] shadow-[0_2px_10px_rgba(0,0,0,0.2)]"
              />
              <span className="hidden text-[15px] font-semibold tracking-[-0.02em] text-foreground sm:inline">ScreenCam</span>
            </motion.a>
          </div>

          <div className="absolute left-1/2 hidden -translate-x-1/2 items-center md:flex">
            {navLinks.map((item) => {
              const isActive = currentPath === item.path;

              return (
                <a
                  key={item.label}
                  href={item.href}
                  className="site-nav-link"
                  aria-current={isActive ? "page" : undefined}
                >
                  {item.label}
                </a>
              );
            })}

            <label className="sr-only" htmlFor="site-language">
              {languageLabel}
            </label>
            <div className="site-nav-link relative inline-flex w-fit items-center gap-1 focus-within:text-foreground">
              <span aria-hidden="true" className="text-current">
                {currentLanguageLabel}
              </span>
              <ChevronDown className="pointer-events-none h-3.5 w-3.5 opacity-70" aria-hidden="true" />
              <select
                id="site-language"
                aria-label={languageLabel}
                value={localizedPath(locale, languagePath)}
                onChange={(event) => {
                  const nextLocale = event.currentTarget.selectedOptions[0]?.dataset.locale;
                  if (nextLocale && supportedLocales.includes(nextLocale as Locale)) {
                    rememberLocale(nextLocale as Locale);
                  }
                  window.location.href = event.currentTarget.value;
                }}
                className="absolute inset-0 h-full w-full cursor-pointer appearance-none border-0 bg-transparent p-0 text-sm opacity-0 outline-none"
              >
                {supportedLocales.map((language) => (
                  <option key={language} value={localizedPath(language, languagePath)} data-locale={language}>
                    {localeLabels[language]}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle label={copy.themeToggleAria} />

            <a
              href={storeUrl(platform)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary store-beta-host group relative hidden !h-9 !px-4 md:inline-flex"
            >
              {platform === "windows" ? storeCopy.microsoftStore : copy.appStore}
              {platform === "windows" && <BetaTag locale={locale} align="end" />}
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
            </a>

          <motion.button
            type="button"
            className="icon-button text-foreground md:hidden"
            aria-label={isMobileMenuOpen ? copy.closeMenuAria : copy.menuAria}
            aria-expanded={isMobileMenuOpen}
            aria-controls="site-mobile-menu"
            title={isMobileMenuOpen ? copy.closeMenuAria : copy.menuAria}
            onClick={toggleMobileMenu}
            whileTap={{ scale: 0.94 }}
          >
            <span className="relative h-4 w-5" aria-hidden="true">
              <motion.span
                className="absolute left-0 top-0 h-px w-5 bg-current"
                animate={isMobileMenuOpen ? { rotate: 45, y: 7.5 } : { rotate: 0, y: 0 }}
                transition={{ duration: reducedMotion ? 0 : 0.24, ease: [0.16, 1, 0.3, 1] }}
              />
              <motion.span
                className="absolute left-0 top-1/2 h-px w-5 -translate-y-1/2 bg-current"
                animate={isMobileMenuOpen ? { opacity: 0, scaleX: 0.35 } : { opacity: 1, scaleX: 1 }}
                transition={{ duration: reducedMotion ? 0 : 0.18, ease: [0.16, 1, 0.3, 1] }}
              />
              <motion.span
                className="absolute bottom-0 left-0 h-px w-5 bg-current"
                animate={isMobileMenuOpen ? { rotate: -45, y: -7.5 } : { rotate: 0, y: 0 }}
                transition={{ duration: reducedMotion ? 0 : 0.24, ease: [0.16, 1, 0.3, 1] }}
              />
            </span>
          </motion.button>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence onExitComplete={() => { if (!isMobileMenuOpen) setIsMobileMenuPresent(false); }}>
        {isMobileMenuOpen && (
          <motion.div
            className="site-mobile-overlay fixed inset-0 z-[70] md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reducedMotion ? 0.1 : 0.22 }}
          >
            <button
              type="button"
              className="absolute inset-0 bg-[var(--overlay)] backdrop-blur-sm"
              aria-label={copy.closeMenuAria}
              onClick={closeMobileMenu}
            />

            <motion.div
              className="site-mobile-menu absolute inset-x-0 top-16 max-h-[calc(100dvh-4rem)] overflow-y-auto overscroll-contain border-b border-rule bg-background"
              id="site-mobile-menu"
              role="dialog"
              aria-modal="true"
              aria-label={copy.primaryNavigationAria}
              initial={{ y: reducedMotion ? 0 : -18, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: reducedMotion ? 0 : -16, opacity: 0 }}
              transition={menuTransition}
            >
              <div className="mx-auto w-full max-w-7xl px-5 pb-5 pt-1">
                <div className="relative overflow-hidden"
                  style={{ height: (mobilePanel === "main" ? navLinks.length + 2 : supportedLocales.length + 1) * 56 }}>
                  <AnimatePresence custom={panelDirection}>
                    {mobilePanel === "main" ? (
                      <motion.div
                        key="main"
                        className="absolute inset-x-0 top-0"
                        custom={panelDirection}
                        variants={mobilePanelVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ duration: reducedMotion ? 0.1 : 0.32, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <div>
                          {navLinks.map((item, index) => (
                            <motion.a
                              key={item.label}
                              href={item.href}
                              custom={{ direction: panelDirection, index }}
                              variants={itemVariants}
                              initial="hidden"
                              animate="visible"
                              exit="exit"
                              onClick={closeMobileMenu}
                              className="flex h-14 items-center justify-between border-t border-border first:border-t-0 py-4 text-base font-medium text-foreground"
                            >
                              <span>{item.label}</span>
                              <ChevronRight className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                            </motion.a>
                          ))}

                          <motion.button
                            type="button"
                            custom={{ direction: panelDirection, index: navLinks.length }}
                            variants={itemVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            onClick={showLanguageMenu}
                            className="flex h-14 w-full items-center justify-between border-t border-border first:border-t-0 py-4 text-left text-base font-medium text-foreground"
                          >
                            <span>{languageLabel}</span>
                            <span className="flex items-center gap-2 text-sm font-normal text-muted-foreground">
                              {localeLabels[locale]}
                              <ChevronRight className="h-4 w-4" aria-hidden="true" />
                            </span>
                          </motion.button>

                          <motion.a
                            href={storeUrl(platform)}
                            target="_blank"
                            rel="noopener noreferrer"
                            custom={{ direction: panelDirection, index: navLinks.length + 1 }}
                            variants={itemVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            onClick={closeMobileMenu}
                            className="flex h-14 items-center justify-between border-t border-border first:border-t-0 py-4 text-base font-medium text-foreground"
                          >
                            <span className="flex items-center gap-2">
                              {platform === "windows" ? storeCopy.microsoftStore : copy.appStore}
                              {platform === "windows" && <span className="store-beta">{storeCopy.beta}</span>}
                            </span>
                            <ArrowRight className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                          </motion.a>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="language"
                        className="absolute inset-x-0 top-0"
                        custom={panelDirection}
                        variants={mobilePanelVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ duration: reducedMotion ? 0.1 : 0.32, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <div>
                          <motion.button
                            type="button"
                            custom={{ direction: panelDirection, index: 0 }}
                            variants={itemVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            onClick={showMainMenu}
                            className="flex h-14 w-full items-center gap-3 border-t border-border first:border-t-0 py-4 text-left text-base font-medium text-foreground"
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
                              variants={itemVariants}
                              initial="hidden"
                              animate="visible"
                              exit="exit"
                              onClick={() => {
                                rememberLocale(language);
                                closeMobileMenu();
                              }}
                              className={`flex h-14 items-center justify-between border-t border-border first:border-t-0 py-4 text-base font-medium transition-colors ${
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

function ThemeToggle({ label }: { label: string }) {
  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (event: MediaQueryListEvent) => {
      let stored: string | null = null;
      try {
        stored = window.localStorage.getItem(themeStorageKey);
      } catch {
        stored = null;
      }
      if (stored === "light" || stored === "dark") return;
      document.documentElement.classList.toggle("dark", event.matches);
      document.documentElement.style.colorScheme = event.matches ? "dark" : "light";
    };
    media.addEventListener("change", handleChange);
    return () => media.removeEventListener("change", handleChange);
  }, []);

  return (
    <button
      type="button"
      className="icon-button theme-toggle"
      aria-label={label}
      title={label}
      onClick={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        applyTheme(getDocumentTheme() === "dark" ? "light" : "dark", {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
        });
      }}
    >
      <Moon className="theme-icon-moon h-[17px] w-[17px]" strokeWidth={1.8} aria-hidden="true" />
      <Sun className="theme-icon-sun h-[17px] w-[17px]" strokeWidth={1.8} aria-hidden="true" />
    </button>
  );
}
