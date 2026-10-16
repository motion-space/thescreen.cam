"use client";

import { Aperture, Film, Maximize2 } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import type { DeviceMockupsCopy } from "../lib/translations";
import { renderExportFrame } from "./experience/export-frame";
import { FRAMER_SPRING } from "./experience/spring";
import { setAppTheme } from "./experience/recorded-app";
import { getDocumentTheme, observeTheme } from "../lib/theme";

/**
 * Device geometry from /public/mockups/series/*.json (the same frames the
 * app and the mockup maker use). All values are in each device's render
 * canvas; the base artwork is drawn at canvas scale and the screen sits on
 * `screen` with the given corner radii.
 */
const STUDIO = {
  canvas: { w: 5361.57, h: 4123.36 },
  screen: { x: 120.79, y: 120.79, w: 5120, h: 2880, r: 20, rb: 20 },
  base: "/mockups/assets/studio-display/base.svg",
};
const MACBOOK = {
  canvas: { w: 4203.05, h: 2576.77 },
  scale: 4203.05 / 1761,
  screen: { x: 369.94, y: 47.94, w: 3456, h: 2234, r: 57.28, rb: 0 },
  base: "/mockups/assets/macbook-pro/macbook-pro-16-inch/base.svg",
  notch: { src: "/mockups/assets/macbook-pro/macbook-pro-16-inch/notch.svg", x: 797, y: 8, w: 167, h: 40 },
  bottom: { src: "/mockups/assets/macbook-pro/macbook-pro-16-inch/bottom-space-black.png", x: -10.566, y: 1005.586, w: 1782.132, h: 69.828 },
};
const IPHONE = {
  canvas: { w: 662, h: 1361 },
  screen: { x: 29, y: 23, w: 604, h: 1316, r: 100, rb: 100 },
  chrome: "/mockups/assets/iphone-18-series/iphone-18-pro/black.png",
};

type Screen = { x: number; y: number; w: number; h: number; r: number; rb: number };
const pct = (v: number, of: number) => `${(v / of) * 100}%`;

/** A live export frame drawn into a device screen. */
function ScreenCanvas({ screen, canvas, portrait, time }: { screen: Screen; canvas: { w: number; h: number }; portrait: boolean; time: number }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    let visible = false;
    let start = performance.now();
    const draw = () => {
      const rect = el.getBoundingClientRect();
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const w = Math.max(2, Math.round(rect.width * dpr));
      const h = Math.max(2, Math.round(rect.height * dpr));
      if (el.width !== w || el.height !== h) {
        el.width = w;
        el.height = h;
      }
      const ctx = el.getContext("2d");
      if (!ctx) return;
      // loop the playing preview inside the recorded app
      const t = time + (((performance.now() - start) / 1000) % 5);
      renderExportFrame(ctx, w, h, t, portrait);
    };
    const loop = () => {
      draw();
      if (visible) raf = requestAnimationFrame(loop);
    };
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !raf) {
        start = performance.now() - 1;
        raf = requestAnimationFrame(loop);
      } else if (!visible) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    });
    io.observe(el);
    const stop = observeTheme((theme) => {
      setAppTheme(theme === "dark");
      draw();
    });
    setAppTheme(getDocumentTheme() === "dark");
    draw();
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      stop();
    };
  }, [portrait, time]);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="absolute"
      style={{
        left: pct(screen.x, canvas.w),
        top: pct(screen.y, canvas.h),
        width: pct(screen.w, canvas.w),
        height: pct(screen.h, canvas.h),
        borderRadius: `${(screen.r / screen.w) * 100}% / ${(screen.r / screen.h) * 100}%`,
        borderBottomLeftRadius: screen.rb ? undefined : 0,
        borderBottomRightRadius: screen.rb ? undefined : 0,
      }}
    />
  );
}

function StudioDisplay({ label }: { label: string }) {
  return (
    <div role="img" aria-label={label} className="relative w-full" style={{ aspectRatio: `${STUDIO.canvas.w} / ${STUDIO.canvas.h}` }}>
      <img src={STUDIO.base} alt="" className="absolute inset-0 h-full w-full" draggable={false} />
      <ScreenCanvas screen={STUDIO.screen} canvas={STUDIO.canvas} portrait={false} time={17.2} />
    </div>
  );
}

function MacBook({ label }: { label: string }) {
  const k = MACBOOK.scale;
  const c = MACBOOK.canvas;
  const n = MACBOOK.notch;
  const b = MACBOOK.bottom;
  return (
    <div role="img" aria-label={label} className="relative w-full" style={{ aspectRatio: `${c.w} / ${c.h}` }}>
      <img src={MACBOOK.base} alt="" className="absolute left-0 top-0 w-full" draggable={false} />
      <ScreenCanvas screen={MACBOOK.screen} canvas={c} portrait={false} time={4.6} />
      <img
        src={n.src}
        alt=""
        className="absolute"
        draggable={false}
        style={{ left: pct(n.x * k, c.w), top: pct(n.y * k, c.h), width: pct(n.w * k, c.w), height: pct(n.h * k, c.h) }}
      />
      <img
        src={b.src}
        alt=""
        className="absolute max-w-none"
        draggable={false}
        style={{ left: pct(b.x * k, c.w), top: pct(b.y * k, c.h), width: pct(b.w * k, c.w), height: pct(b.h * k, c.h) }}
      />
    </div>
  );
}

function IPhone({ label }: { label: string }) {
  return (
    <div role="img" aria-label={label} className="relative w-full" style={{ aspectRatio: `${IPHONE.canvas.w} / ${IPHONE.canvas.h}` }}>
      <ScreenCanvas screen={IPHONE.screen} canvas={IPHONE.canvas} portrait time={17.6} />
      <img src={IPHONE.chrome} alt="" className="absolute inset-0 h-full w-full" draggable={false} />
    </div>
  );
}

const rise = (delay: number) => ({
  initial: { opacity: 0, y: 48 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-12% 0px" },
  transition: { ...FRAMER_SPRING, delay },
});

const FORMAT_ICONS = [Maximize2, Aperture, Film];

/**
 * Export options: the same recording, exported into real device frames
 * (Studio Display, MacBook Pro, iPhone) with live screens.
 */
export function DeviceMockupsSection({ copy }: { copy: DeviceMockupsCopy }) {
  return (
    <section id="export" className="mg-scene relative z-30 bg-background py-28 md:py-40">
      <div className="mx-auto w-full max-w-[1200px] px-6 md:px-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <motion.div {...rise(0)}>
            <span className="mg-label mg-index tabular-nums">02 — {copy.eyebrow}</span>
            <h2 className="mg-h2 mt-5 max-w-[14ch] !text-[clamp(2rem,4.4vw,3.75rem)]">{copy.title}</h2>
          </motion.div>
          <motion.p {...rise(0.08)} className="max-w-sm text-[15px] leading-relaxed text-muted-foreground">
            {copy.description}
          </motion.p>
        </div>

        {/* devices: a display at the back, a MacBook and an iPhone in front */}
        <div className="relative mt-16 md:mt-24" style={{ aspectRatio: "1200 / 640" }}>
          <motion.div {...rise(0.1)} className="absolute left-[16%] top-0 w-[60%] drop-shadow-[0_40px_60px_rgba(0,0,0,0.28)]">
            <StudioDisplay label={copy.imageAlt.studioDisplay} />
          </motion.div>
          <motion.div {...rise(0.22)} className="absolute bottom-[2%] right-0 w-[44%] drop-shadow-[0_30px_50px_rgba(0,0,0,0.32)]">
            <MacBook label={copy.imageAlt.macBook} />
          </motion.div>
          <motion.div {...rise(0.32)} className="absolute bottom-0 left-[4%] w-[13.5%] drop-shadow-[0_26px_40px_rgba(0,0,0,0.35)]">
            <IPhone label={copy.imageAlt.iPhone} />
          </motion.div>
        </div>

        {/* export formats */}
        <motion.ul {...rise(0.1)} className="mt-14 grid grid-cols-1 border-t border-border sm:grid-cols-3 md:mt-20">
          {copy.formats.map((format, i) => {
            const Icon = FORMAT_ICONS[i % FORMAT_ICONS.length];
            return (
              <li
                key={format}
                className="flex items-center gap-4 border-b border-border py-6 sm:border-b-0 sm:px-6 sm:first:pl-0 sm:[&+li]:border-l"
              >
                <span className="flex h-10 w-10 flex-none items-center justify-center rounded-full border border-border text-foreground">
                  <Icon className="h-[18px] w-[18px]" strokeWidth={1.6} />
                </span>
                <span className="flex flex-col gap-1">
                  <span className="mg-label tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                  <span className="text-[15px] font-medium text-foreground">{format}</span>
                </span>
              </li>
            );
          })}
        </motion.ul>
      </div>
    </section>
  );
}
