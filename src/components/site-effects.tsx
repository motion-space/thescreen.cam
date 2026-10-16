"use client";

import { useEffect, useRef } from "react";
import { SPRINGS, SpringValue } from "./experience/spring";

const INTERACTIVE_SELECTOR =
  'a, button, select, summary, label[for], [role="button"], [role="tab"], input:not([type="hidden"]), textarea';
const DRAG_SELECTOR = "[data-screen-cam-drag-surface]";

/**
 * Camera-style cursor overlay: a small reticle that trails the pointer and
 * "focus-locks" onto interactive elements by snapping its brackets to them.
 * The native cursor stays visible so canvas demos keep their grab cursors.
 */
export function ViewfinderCursor() {
  const rootRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const root = rootRef.current;
    const label = labelRef.current;
    if (!root || !label || !finePointer.matches || reducedMotion.matches) return;

    const idleSize = 30;
    const pad = 6;
    const target = { x: -100, y: -100, w: idleSize, h: idleSize, r: idleSize / 2 };
    const current = { ...target };
    // position rides the client's cursor spring; size and corner the effect spring
    const springs = {
      x: new SpringValue(target.x, SPRINGS.cursor),
      y: new SpringValue(target.y, SPRINGS.cursor),
      w: new SpringValue(target.w, SPRINGS.effect),
      h: new SpringValue(target.h, SPRINGS.effect),
      r: new SpringValue(target.r, SPRINGS.effect),
    };
    let lockedElement: Element | null = null;
    let mode: "idle" | "lock" | "drag" = "idle";
    let frame = 0;
    let visible = false;

    const setMode = (nextMode: typeof mode) => {
      if (mode === nextMode) return;
      mode = nextMode;
      root.dataset.mode = nextMode;
      label.textContent = nextMode === "drag" ? "drag" : "";
    };

    const requestRender = () => {
      if (!frame && visible && !document.hidden) frame = requestAnimationFrame(tick);
    };
    const handleMove = (event: PointerEvent) => {
      if (!visible) {
        visible = true;
        root.style.opacity = "1";
        springs.x.value = current.x = event.clientX - idleSize / 2;
        springs.y.value = current.y = event.clientY - idleSize / 2;
      }

      const element = event.target instanceof Element ? event.target : null;
      const interactive = element?.closest(INTERACTIVE_SELECTOR) ?? null;
      const dragSurface = element?.closest(DRAG_SELECTOR) ?? null;

      if (interactive && !dragSurface) {
        lockedElement = interactive;
        setMode("lock");
      } else {
        lockedElement = null;
        setMode(dragSurface ? "drag" : "idle");
      }

      if (!lockedElement) {
        target.w = idleSize;
        target.h = idleSize;
        target.r = idleSize / 2;
        target.x = event.clientX - idleSize / 2;
        target.y = event.clientY - idleSize / 2;
      }
      requestRender();
    };

    const handleLeave = () => {
      visible = false;
      root.style.opacity = "0";
      cancelAnimationFrame(frame); frame = 0; lockedElement = null;
    };

    const handleDown = () => root.classList.add("is-pressed");
    const handleUp = () => root.classList.remove("is-pressed");

    const tick = () => {
      frame = 0;
      if (!visible || document.hidden) return;
      if (lockedElement) {
        const rect = lockedElement.getBoundingClientRect();
        target.x = rect.left - pad;
        target.y = rect.top - pad;
        target.w = rect.width + pad * 2;
        target.h = rect.height + pad * 2;
        // follow the element's own corner, offset by the padding, so a pill
        // stays a pill and a rounded rect gets a concentric outline
        target.r = Math.min(target.w, target.h) / 2;
        const raw = getComputedStyle(lockedElement).borderTopLeftRadius;
        const value = parseFloat(raw);
        if (Number.isFinite(value)) {
          const inner = raw.endsWith("%") ? (value / 100) * Math.min(rect.width, rect.height) : value;
          target.r = Math.min(target.r, Math.max(6, inner) + pad);
        }
      }

      // size, position and radius all ease together, so shape changes are smooth
      const now = performance.now();
      current.x = springs.x.update(target.x, now);
      current.y = springs.y.update(target.y, now);
      current.w = springs.w.update(target.w, now);
      current.h = springs.h.update(target.h, now);
      current.r = springs.r.update(target.r, now);

      root.style.transform = `translate3d(${current.x}px, ${current.y}px, 0)`;
      root.style.width = `${current.w}px`;
      root.style.height = `${current.h}px`;
      root.style.borderRadius = `${Math.min(current.r, Math.min(current.w, current.h) / 2)}px`;
      const unsettled = Math.abs(target.x - current.x) + Math.abs(target.y - current.y) + Math.abs(target.w - current.w) + Math.abs(target.h - current.h) + Math.abs(target.r - current.r) > 0.05;
      if (unsettled) requestRender();
    };
    const onScroll = () => { if (lockedElement) requestRender(); };
    const onVisibility = () => {
      if (document.hidden) { cancelAnimationFrame(frame); frame = 0; }
      else requestRender();
    };

    window.addEventListener("pointermove", handleMove, { passive: true });
    document.addEventListener("pointerleave", handleLeave);
    window.addEventListener("pointerdown", handleDown);
    window.addEventListener("pointerup", handleUp);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", handleMove);
      document.removeEventListener("pointerleave", handleLeave);
      window.removeEventListener("pointerdown", handleDown);
      window.removeEventListener("pointerup", handleUp);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <div ref={rootRef} className="vf-cursor" data-mode="idle" aria-hidden="true">
      <span className="vf-cursor-dot" />
      <span ref={labelRef} className="vf-cursor-label" />
    </div>
  );
}
