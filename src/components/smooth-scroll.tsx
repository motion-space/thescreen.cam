"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

function isSafari() {
  return (
    navigator.vendor.includes("Apple") &&
    !/CriOS|FxiOS|EdgiOS|Chrome|Chromium|Android/.test(navigator.userAgent)
  );
}

export function SmoothScroll() {
  useEffect(() => {
    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const coarsePointerQuery = window.matchMedia("(pointer: coarse)");
    let lenis: Lenis | null = null;
    let startFrameId = 0;

    const setNativeSmoothScroll = (enabled: boolean) => {
      document.documentElement.style.scrollBehavior = enabled ? "smooth" : "";
    };

    const destroyLenis = () => {
      lenis?.destroy();
      lenis = null;
    };

    const startLenis = () => {
      if (reducedMotionQuery.matches || lenis) {
        return;
      }

      if (isSafari() || coarsePointerQuery.matches) {
        setNativeSmoothScroll(true);
        return;
      }

      setNativeSmoothScroll(false);
      lenis = new Lenis({
        anchors: true,
        autoRaf: true,
        duration: 0.58,
        easing: (time) => 1 - Math.pow(1 - time, 4),
        prevent: (node) => node.closest("[data-screen-cam-drag-surface]") !== null,
        smoothWheel: true,
        syncTouch: false,
        wheelMultiplier: 0.9,
      });
    };

    const refreshScrollMode = () => {
      setNativeSmoothScroll(false);
      destroyLenis();

      if (reducedMotionQuery.matches) {
        return;
      }

      startLenis();
    };

    startFrameId = window.requestAnimationFrame(startLenis);
    reducedMotionQuery.addEventListener("change", refreshScrollMode);
    coarsePointerQuery.addEventListener("change", refreshScrollMode);

    return () => {
      window.cancelAnimationFrame(startFrameId);
      reducedMotionQuery.removeEventListener("change", refreshScrollMode);
      coarsePointerQuery.removeEventListener("change", refreshScrollMode);
      setNativeSmoothScroll(false);
      destroyLenis();
    };
  }, []);

  return null;
}
