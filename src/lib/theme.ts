export type Theme = "light" | "dark";

export const themeStorageKey = "screenCamTheme";

export function getDocumentTheme(): Theme {
  if (typeof document === "undefined") return "dark";
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

function setThemeClass(theme: Theme) {
  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
  root.style.colorScheme = theme;
}

type ViewTransitionDocument = Document & {
  startViewTransition?: (callback: () => void) => { finished: Promise<void> };
};

/**
 * Switch theme. When the browser supports View Transitions the new palette
 * is revealed as a circle growing from `origin` (usually the toggle button).
 */
export function applyTheme(theme: Theme, origin?: { x: number; y: number }) {
  const root = document.documentElement;
  const doc = document as ViewTransitionDocument;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  try {
    window.localStorage.setItem(themeStorageKey, theme);
  } catch {
    // Theme still applies for this page view when storage is unavailable.
  }

  if (doc.startViewTransition && !reduceMotion) {
    const x = origin?.x ?? window.innerWidth - 40;
    const y = origin?.y ?? 32;
    root.style.setProperty("--vt-x", `${x}px`);
    root.style.setProperty("--vt-y", `${y}px`);
    root.classList.add("vt-theme");
    const transition = doc.startViewTransition(() => setThemeClass(theme));
    const cleanup = () => root.classList.remove("vt-theme");
    transition.finished.then(cleanup, cleanup);
    return;
  }

  root.classList.add("theme-transition");
  setThemeClass(theme);
  window.setTimeout(() => root.classList.remove("theme-transition"), 320);
}

/** Subscribe to `.dark` class changes on <html>. Returns an unsubscribe function. */
export function observeTheme(callback: (theme: Theme) => void) {
  let previous = getDocumentTheme();
  const observer = new MutationObserver(() => {
    const next = getDocumentTheme();
    if (next !== previous) { previous = next; callback(next); }
  });
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
  return () => observer.disconnect();
}
