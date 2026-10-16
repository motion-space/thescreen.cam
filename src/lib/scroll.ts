import type Lenis from "lenis";

/** The page's Lenis instance, when smooth scrolling is on (desktop, motion allowed). */
let lenis: Lenis | null = null;

export function setLenis(instance: Lenis | null) {
  lenis = instance;
}

/** Scrolls the page to `y`: through Lenis when it drives the page, natively otherwise. */
export function scrollPageTo(y: number, options: { duration: number; easing: (t: number) => number; immediate?: boolean }) {
  if (lenis) {
    lenis.scrollTo(y, { duration: options.duration, easing: options.easing, immediate: options.immediate });
    return;
  }
  window.scrollTo({ top: y, behavior: options.immediate ? "auto" : "smooth" });
}
