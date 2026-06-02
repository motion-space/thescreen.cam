"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { MagneticButton } from "./magnetic-button";

const appStoreUrl = "https://apps.apple.com/cn/app/screencam-screen-studio/id6770877568?l=en-GB&mt=12";
const navLinks = [
  { label: "Support", href: "/support" },
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
];

export function SiteHeader() {
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
        className="fixed left-0 right-0 top-0 z-[60]"
        aria-label="Primary navigation"
      >
        <div className="relative mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-6 md:px-12">
          <motion.a
            href="/"
            className="flex cursor-pointer items-center gap-3"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="ScreenCam home"
          >
            <img
              src="/icon-192.png"
              alt="ScreenCam Logo"
              className="h-9 w-9 rounded-lg"
            />
            <span className="font-medium tracking-tight text-foreground">ScreenCam</span>
          </motion.a>

          <div className="hidden items-center gap-12 text-sm text-muted-foreground md:flex">
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
          </div>

          <MagneticButton
            className="group flex items-center gap-2 text-sm text-foreground"
            onClick={() => {
              window.location.href = appStoreUrl;
            }}
          >
            App Store
            <motion.span
              initial={{ x: 0 }}
              whileHover={{ x: 4 }}
              transition={{ duration: 0.2 }}
            >
              <ArrowRight className="h-4 w-4" />
            </motion.span>
          </MagneticButton>
        </div>
      </motion.nav>
    </>
  );
}
