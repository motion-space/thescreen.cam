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
    let lenis: Lenis | null = null;

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

      if (isSafari()) {
        setNativeSmoothScroll(true);
        return;
      }

      setNativeSmoothScroll(false);
      lenis = new Lenis({
        anchors: true,
        autoRaf: true,
        duration: 0.72,
        easing: (time) => 1 - Math.pow(1 - time, 4),
        smoothWheel: true,
        syncTouch: false,
        wheelMultiplier: 0.9,
      });
    };

    const handleMotionPreferenceChange = () => {
      if (reducedMotionQuery.matches) {
        setNativeSmoothScroll(false);
        destroyLenis();
        return;
      }

      startLenis();
    };

    startLenis();
    reducedMotionQuery.addEventListener("change", handleMotionPreferenceChange);

    return () => {
      reducedMotionQuery.removeEventListener("change", handleMotionPreferenceChange);
      setNativeSmoothScroll(false);
      destroyLenis();
    };
  }, []);

  return null;
}
