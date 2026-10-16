"use client";

import { useLayoutEffect } from "react";
import type { RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let registered = false;
let refreshFrame = 0;
let stopRefreshEvents = () => {};

/** Batch islands and late asset events; safe refresh waits for scrolling to end. */
export function queueSceneRefresh() {
  if (!registered || refreshFrame) return;
  refreshFrame = window.requestAnimationFrame(() => {
    refreshFrame = 0;
    ScrollTrigger.sort();
    ScrollTrigger.refresh(true);
  });
}

export function ensureGsap() {
  if (!registered && typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
    registered = true;
    // The defaults force two full refreshes if a slow defer script delays DOM/load.
    ScrollTrigger.config({ autoRefreshEvents: "visibilitychange,resize" });
    document.addEventListener("DOMContentLoaded", queueSceneRefresh);
    window.addEventListener("load", queueSceneRefresh);
    document.fonts.addEventListener("loadingdone", queueSceneRefresh);
    void document.fonts.ready.then(queueSceneRefresh);
    stopRefreshEvents = () => {
      registered = false;
      window.cancelAnimationFrame(refreshFrame); refreshFrame = 0;
      document.removeEventListener("DOMContentLoaded", queueSceneRefresh);
      window.removeEventListener("load", queueSceneRefresh);
      document.fonts.removeEventListener("loadingdone", queueSceneRefresh);
    };
  }
  return { gsap, ScrollTrigger };
}

if (import.meta.hot) import.meta.hot.dispose(() => stopRefreshEvents());

export function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

type SceneBuilder = (helpers: {
  q: (selector: string) => Element[];
  gsap: typeof gsap;
  ScrollTrigger: typeof ScrollTrigger;
  reduced: boolean;
}) => void;

/**
 * Runs a GSAP scene scoped to `ref`. Everything created inside is reverted on
 * unmount. After the scene is built every ScrollTrigger on the page is
 * refreshed so pins further down account for the new pin spacers.
 */
export function useScene(ref: RefObject<HTMLElement | null>, build: SceneBuilder, deps: unknown[] = []) {
  useLayoutEffect(() => {
    const root = ref.current;
    if (!root) return;
    ensureGsap();
    const reduced = prefersReducedMotion();
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(root) as (selector: string) => Element[];
      build({ q, gsap, ScrollTrigger, reduced });
    }, root);
    // Islands hydrate in any order: sort triggers by page position, then refresh
    // so every pin accounts for the spacers of the scenes above it.
    queueSceneRefresh();
    return () => {
      ctx.revert();
      queueSceneRefresh();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

/**
 * `[data-draw]` strokes carry `pathLength="1"` and start hidden from CSS
 * (dasharray 1 / offset 1), so they never flash fully drawn before hydration
 * and the dash maps 1:1 onto the stroke even with non-scaling strokes.
 * Tween `strokeDashoffset` to 0 to draw them. This just makes sure the
 * attribute is present on anything rendered without it.
 */
export function prepareStrokes(elements: Element[]) {
  elements.forEach((element) => {
    if (!element.hasAttribute("pathLength")) element.setAttribute("pathLength", "1");
  });
}

/** Splits text into words that fill from outline to solid as you scroll. */
export function FillText({ text, className = "" }: { text: string; className?: string }) {
  const words = text.split(/(\s+)/);
  return (
    <span className={className}>
      {words.map((word, index) =>
        /^\s+$/.test(word) ? (
          word
        ) : (
          <span key={index} className="mg-word">
            {word}
          </span>
        ),
      )}
    </span>
  );
}

/** Scrubbed word fill for every `.mg-word` under `trigger`. */
export function fillWords(q: (s: string) => Element[], trigger: Element, start = "top 80%", end = "top 30%") {
  const words = q(".mg-word");
  if (!words.length) return;
  gsap.to(words, {
    color: "var(--foreground)",
    webkitTextStrokeColor: "transparent",
    stagger: 0.1,
    ease: "none",
    scrollTrigger: { trigger, start, end, scrub: 0.6 },
  });
}

/**
 * Lays `root` over the last frame of the previous pinned scene (negative
 * margin of one viewport) and keeps `stage` hidden until its own pin starts,
 * so the hand-off happens on the exact same frame with no scroll gap.
 */
export function overlapPrevious(root: HTMLElement, stage: HTMLElement) {
  gsap.set(root, { marginTop: () => -window.innerHeight });
  gsap.set(stage, { autoAlpha: 0 });
  const sync = (self: ScrollTrigger) => {
    gsap.set(stage, { autoAlpha: self.scroll() >= self.start - 1 ? 1 : 0 });
  };
  return {
    onEnter: () => gsap.set(stage, { autoAlpha: 1 }),
    onLeaveBack: () => gsap.set(stage, { autoAlpha: 0 }),
    onRefresh: sync,
  };
}
