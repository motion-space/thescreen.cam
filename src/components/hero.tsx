"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { ShaderBackground } from "./shader-background";
import { MotionBlurText } from "./motion-blur-text";
import { MagneticButton } from "./magnetic-button";
import { SiteHeader } from "./site-header";
import { LiquidGlassMaterial } from "./liquid-glass-material";

const appStoreUrl = "https://apps.apple.com/cn/app/screencam-screen-studio/id6770877568?l=en-GB&mt=12";

export function Hero() {
  return (
    <section className="relative min-h-screen bg-background overflow-hidden">
      <ShaderBackground />
      <SiteHeader />

      {/* Main content */}
      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl flex-col justify-center px-6 pt-24 md:px-12">
        {/* Hero text */}
        <div className="w-full -translate-y-[calc(clamp(1.8rem,8.64vw,8.64rem)+7.2rem)] md:-translate-y-[clamp(1.8rem,8.64vw,8.64rem)]">
          <h1 className="hero-motion-title text-[4.3rem] font-bold leading-[0.84] tracking-[-0.04em] text-foreground min-[390px]:text-[4.5rem] min-[430px]:text-[4.8rem] md:text-[clamp(2.5rem,12vw,12rem)] md:leading-[0.9]">
            <span className="block">
              <span className="block">
                <MotionBlurText delay={0.2}>Capture</MotionBlurText>
              </span>
              <span className="block">
                <MotionBlurText delay={0.36}>Sharp.</MotionBlurText>
              </span>
            </span>
            <span className="block">
              <span className="block">
                <MotionBlurText delay={0.52}>Direct</MotionBlurText>
              </span>
              <span className="block">
                <MotionBlurText delay={0.66}>The Frame.</MotionBlurText>
              </span>
            </span>
          </h1>
        </div>

        {/* Bottom section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.8 }}
          className="absolute bottom-8 md:bottom-12 left-6 md:left-12 right-6 md:right-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-8"
        >
          {/* Left side info */}
          <div className="flex flex-col gap-6 max-w-4xl">
            <motion.p
              className="max-w-[56rem] text-sm leading-relaxed text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1 }}
            >
              High-resolution recording with a camera you can shape after the take.
            </motion.p>
            <MagneticButton
              className="liquid-glass-cta group flex w-fit cursor-pointer items-center gap-3 px-6 py-3 text-sm font-medium"
              onClick={() => {
                window.location.href = appStoreUrl;
              }}
            >
              <LiquidGlassMaterial />
              <svg className="relative z-10 h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              <span className="relative z-10">View on App Store</span>
              <ArrowRight className="relative z-10 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </MagneticButton>
          </div>

          {/* Right side features */}
          <motion.div
            className="flex gap-8 md:gap-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.2 }}
          >
            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground tracking-widest uppercase">Built with</span>
              <span className="text-sm text-foreground font-medium">100% Native</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground tracking-widest uppercase">System</span>
              <span className="text-sm text-foreground font-medium">macOS 15+</span>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Scan line effect */}
      <motion.div
        className="absolute inset-0 pointer-events-none z-20"
        style={{
          background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.01) 2px, rgba(255,255,255,0.01) 4px)",
        }}
      />
    </section>
  );
}
