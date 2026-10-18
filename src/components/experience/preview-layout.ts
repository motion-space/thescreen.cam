import { COMP, HEADER, INS_X, PREVIEW } from "./editor";

export const MEDIA_LIBRARY_MIN_WIDTH = 136;
export const MEDIA_LIBRARY_MAX_WIDTH = 360;

/** Shared by the panel and preview so their edges agree throughout the reveal. */
export function visibleMediaLibraryWidth(libraryWidth: number, chrome: number) {
  return libraryWidth * Math.max(0, Math.min(1, (chrome - .25) / .4));
}

/** Fit the complete composition into the space left by the docked library. */
export function previewPlacement(libraryWidth: number, chrome: number) {
  const left = visibleMediaLibraryWidth(libraryWidth, chrome);
  const scale = Math.min(1, (INS_X - left - 24) / COMP.w);
  const x = left + (INS_X - left - COMP.w * scale) / 2;
  const y = HEADER + (PREVIEW.h - COMP.h * scale) / 2;
  return { scale, dx: x - COMP.x * scale, dy: y - COMP.y * scale,
    rect: { x, y, w: COMP.w * scale, h: COMP.h * scale } };
}
