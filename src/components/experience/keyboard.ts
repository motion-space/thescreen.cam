import { measureWidth } from "./kit";
/**
 * Keystroke overlay, ported from the client's KeyboardOverlayFrameEvaluator
 * (layout, press animation, linger) and KeyboardOverlayImageRenderer (the
 * MacBook, flat and raised key styles).
 */
import { font, rr } from "./kit";
import { KEY_PRESSES } from "./recorded-app";

export type KeyStyle = 0 | 1 | 2; // MacBook, Flat, Raised
export const KEY_STYLES = ["MacBook", "Flat", "Raised"];

const LINGER = 1.1;
const FADE = 0.2;
const MAX_VISIBLE_KEYS = 4;
const PRESS = 0.11;
const RELEASE = 0.11;
const PRESSED_SCALE = 0.96;

/** MacBookKeyboardKey.specification(for:) */
type Spec = { units: number; text: string; upper?: string; layout: "centered" | "bottomLeft" | "bottomRight" | "modifier" | "stacked" };
function spec(label: string): Spec {
  switch (label) {
    case "⌘":
      return { units: 1.3, text: "command", upper: "⌘", layout: "modifier" };
    case "⌥":
      return { units: 1.05, text: "option", upper: "⌥", layout: "modifier" };
    case "⌃":
      return { units: 1.05, text: "control", upper: "⌃", layout: "modifier" };
    case "⇧":
      return { units: 2.45, text: "⇧", layout: "bottomLeft" };
    case "Return":
      return { units: 1.85, text: "↩", layout: "bottomRight" };
    case "Space":
      return { units: 1.8, text: "␣", layout: "centered" };
    default:
      break;
  }
  const shifted: Record<string, string> = { "1": "!", "2": "@", "/": "?", ";": ":", ",": "<", ".": ">" };
  if (shifted[label]) return { units: 1.05, text: label, upper: shifted[label], layout: "stacked" };
  return { units: 1.05, text: label, layout: "centered" };
}

const eased = (t: number) => {
  const x = Math.max(0, Math.min(1, t));
  return x * x * (3 - 2 * x);
};

type Shown = { label: string; down: number; up: number; opacity: number };

/** Keep a short history instead of replacing each character with the next. */
export function sampleKeyOverlay(time: number): { keys: Shown[]; opacity: number } | null {
  let history: Shown[] = [];
  for (const press of KEY_PRESSES) {
    if (press.down > time) break;
    // A shortcut is read as one chord, separate from the preceding typing.
    if (press.mods.some((modifier) => modifier !== "⇧") || press.label === "Return") history = [];
    for (const modifier of press.mods) {
      history.push({ label: modifier, down: press.down - 0.03, up: press.up + 0.02, opacity: 1 });
    }
    history.push({ label: press.label, down: press.down, up: press.up, opacity: 1 });
  }
  const keys = history
    .filter((key) => time - key.up < LINGER + FADE)
    .slice(-MAX_VISIBLE_KEYS)
    .map((key) => ({ ...key, opacity: 1 - Math.max(0, Math.min(1, (time - key.up - LINGER) / FADE)) }));
  return keys.length ? { keys, opacity: 1 } : null;
}

function pressProgress(key: Shown, time: number) {
  const p = eased((time - key.down) / PRESS);
  if (time < key.up) return p;
  return p * (1 - eased((time - key.up) / RELEASE));
}

export type KeyOverlaySettings = { show: boolean; style: KeyStyle; position: number };

/** Draws the overlay inside `comp` (world units) at `time`. */
export function drawKeyOverlay(ctx: CanvasRenderingContext2D, comp: { x: number; y: number; w: number; h: number }, time: number, settings: KeyOverlaySettings, captionTop?: number) {
  if (!settings.show) return;
  const frame = sampleKeyOverlay(time);
  if (!frame || frame.opacity <= 0) return;
  const style = settings.style;
  const baseWidth = comp.w * 0.078;
  const keyH = Math.min(baseWidth * 0.56, comp.h * 0.16);
  const gap = keyH * (style === 0 ? 0.1 : 0.16);
  const widths = frame.keys.map((k) => {
    if (style === 0) return keyH * spec(k.label).units;
    const len = k.label === "Space" ? 3 : k.label === "Return" ? 2.2 : k.label.length > 1 ? 1.6 : 1;
    return Math.max(baseWidth, keyH * len * 1.2);
  });
  const total = widths.reduce((a, b) => a + b, 0) + gap * (widths.length - 1);
  const cx = comp.x + comp.w * [0.2, 0.5, 0.8][settings.position];
  let x = Math.max(comp.x, Math.min(comp.x + comp.w - total, cx - total / 2));
  // Follow the actual caption edge, leaving a small gap for the key shadows.
  const bottom = comp.y + comp.h - comp.h * 0.06;
  const y = Math.max(comp.y, Math.min(bottom, captionTop === undefined ? bottom : captionTop - keyH * 0.25) - keyH);
  ctx.save();
  ctx.globalAlpha *= frame.opacity;
  frame.keys.forEach((key, i) => {
    ctx.save();
    ctx.globalAlpha *= key.opacity;
    const w = widths[i];
    const pp = pressProgress(key, time);
    const s = 1 + (PRESSED_SCALE - 1) * pp;
    const rect = { x: x + (w - w * s) / 2, y: y + (keyH - keyH * s) / 2, w: w * s, h: keyH * s };
    if (style === 0) macBookKey(ctx, rect, key.label, time < key.up && time >= key.down);
    else if (style === 1) flatKey(ctx, rect, key.label);
    else raisedKey(ctx, rect, key.label, pp);
    x += w + gap;
    ctx.restore();
  });
  ctx.restore();
}

function legend(label: string) {
  if (label === "Space") return "␣";
  if (label === "Return") return "return";
  if (label === "⇧") return "⇧";
  return label;
}

function centeredText(ctx: CanvasRenderingContext2D, value: string, r: { x: number; y: number; w: number; h: number }, size: number, color: string) {
  ctx.font = font(size, 500);
  const width = measureWidth(ctx,value);
  const fit = width > r.w - size ? (size * (r.w - size)) / width : size;
  ctx.font = font(fit, 500);
  ctx.fillStyle = color;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(value, r.x + r.w / 2, r.y + r.h / 2 + fit * 0.04);
}

/** drawFlatKeyboardKey: #3F3F3F at 0.88, 18% corner, soft shadow, hairline. */
function flatKey(ctx: CanvasRenderingContext2D, r: { x: number; y: number; w: number; h: number }, label: string) {
  const radius = Math.min(r.h * 0.18, r.w / 2, r.h / 2);
  ctx.save();
  rr(ctx, r.x, r.y, r.w, r.h, radius);
  ctx.shadowColor = "rgba(0,0,0,0.38)";
  ctx.shadowBlur = r.h * 0.25 * pxScale(ctx);
  ctx.shadowOffsetY = r.h * 0.085 * pxScale(ctx);
  ctx.fillStyle = "rgba(63,63,63,0.88)";
  ctx.fill();
  ctx.restore();
  rr(ctx, r.x, r.y, r.w, r.h, radius);
  ctx.strokeStyle = "rgba(255,255,255,0.22)";
  ctx.lineWidth = r.h / 60;
  ctx.stroke();
  centeredText(ctx, legend(label), r, r.h * 0.4, "rgba(255,255,255,0.94)");
}

/** drawRaisedKeyboardKey: a darker base under a top cap that sinks when pressed. */
function raisedKey(ctx: CanvasRenderingContext2D, r: { x: number; y: number; w: number; h: number }, label: string, pp: number) {
  const depth = r.h * 0.085;
  const offset = depth * 0.58 * pp;
  const inset = r.h * 0.018 * pp;
  const top = { x: r.x + inset, y: r.y + offset, w: r.w - inset * 2, h: r.h - depth };
  const back = { x: r.x, y: r.y + depth * 0.24, w: r.w, h: r.h - depth * 0.24 + depth * 0.34 };
  const radius = (h: number, w: number) => Math.min(h * 0.18, w / 2, h / 2);
  const unit = r.h / 60;
  ctx.save();
  rr(ctx, back.x, back.y, back.w, back.h, radius(r.h, back.w));
  ctx.shadowColor = `rgba(0,0,0,${0.36 + 0.10 * pp})`;
  ctx.shadowBlur = (15 - 5 * pp) * unit * pxScale(ctx);
  ctx.shadowOffsetY = (Math.max(5 * unit, depth * 0.9) * (1 - pp) + 1.6 * unit * pp) * pxScale(ctx);
  ctx.fillStyle = "rgba(48,48,48,0.88)";
  ctx.fill();
  ctx.restore();
  rr(ctx, top.x, top.y, top.w, top.h, radius(top.h, top.w));
  ctx.fillStyle = "rgba(63,63,63,0.88)";
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,0.16)";
  ctx.lineWidth = unit;
  ctx.stroke();
  centeredText(ctx, legend(label), top, r.h * 0.4, "rgba(255,255,255,0.94)");
}

/** drawMacBookKey: black well, dark gradient cap with an inner highlight, MacBook legends. */
function macBookKey(ctx: CanvasRenderingContext2D, r: { x: number; y: number; w: number; h: number }, label: string, pressed: boolean) {
  const sp = spec(label);
  const unit = r.h;
  const inset = unit * 0.018;
  const cap = { x: r.x + inset, y: r.y + inset, w: r.w - inset * 2, h: r.h - inset * 2 };
  const radius = unit * 0.105;
  const px = pxScale(ctx);
  // well
  ctx.save();
  rr(ctx, r.x, r.y, r.w, r.h, radius + inset);
  ctx.shadowColor = "rgba(0,0,0,0.44)";
  ctx.shadowBlur = unit * 0.26 * px;
  ctx.shadowOffsetY = unit * 0.09 * px;
  ctx.fillStyle = "rgb(4,4,4)";
  ctx.fill();
  ctx.restore();
  // cap gradient, top-right lighter
  ctx.save();
  rr(ctx, cap.x, cap.y, cap.w, cap.h, radius);
  ctx.clip();
  const g = ctx.createLinearGradient(cap.x + cap.w, cap.y, cap.x, cap.y + cap.h);
  g.addColorStop(0, pressed ? "#1B1C1E" : "#242528");
  g.addColorStop(1, "#18191B");
  ctx.fillStyle = g;
  ctx.fillRect(cap.x, cap.y, cap.w, cap.h);
  // the inverse silhouette casts a faint white shadow into the cap
  ctx.shadowColor = "rgba(255,255,255,0.16)";
  ctx.shadowBlur = unit * 0.018 * px;
  ctx.shadowOffsetY = unit * 0.006 * px;
  ctx.beginPath();
  ctx.rect(cap.x - unit, cap.y - unit, cap.w + unit * 2, cap.h + unit * 2);
  ctx.roundRect(cap.x + cap.w, cap.y, -cap.w, cap.h, radius);
  ctx.fillStyle = "#000";
  ctx.fill("evenodd");
  ctx.restore();
  rr(ctx, cap.x + unit * 0.009, cap.y + unit * 0.009, cap.w - unit * 0.018, cap.h - unit * 0.018, radius);
  ctx.strokeStyle = "rgba(255,255,255,0.035)";
  ctx.lineWidth = unit * 0.006;
  ctx.stroke();
  // legends
  const pad = unit * 0.13;
  const lower = { x: cap.x + pad, y: cap.y + cap.h - unit * 0.08 - unit * 0.27, w: cap.w - pad * 2, h: unit * 0.27 };
  const upper = { x: lower.x, y: cap.y + unit * 0.12, w: lower.w, h: unit * 0.28 };
  const color = "rgb(230,230,230)";
  const draw = (value: string, box: typeof lower, size: number, align: -1 | 0 | 1) => {
    ctx.font = font(size, 400);
    const width = measureWidth(ctx,value);
    const fit = width > box.w ? (size * box.w) / width : size;
    ctx.font = font(fit, 400);
    ctx.fillStyle = color;
    ctx.textBaseline = "middle";
    ctx.textAlign = align < 0 ? "left" : align > 0 ? "right" : "center";
    ctx.fillText(value, align < 0 ? box.x : align > 0 ? box.x + box.w : box.x + box.w / 2, box.y + box.h / 2);
  };
  switch (sp.layout) {
    case "centered":
      draw(sp.text, cap, unit * 0.34, 0);
      break;
    case "bottomLeft":
    case "bottomRight":
      draw(sp.text, lower, unit * 0.3, sp.layout === "bottomRight" ? 1 : -1);
      break;
    case "modifier":
      draw(sp.upper ?? "", upper, unit * 0.3, -1);
      draw(sp.text, lower, unit * (label === "⌘" ? 0.23 : 0.19), -1);
      break;
    case "stacked":
      draw(sp.upper ?? "", upper, unit * 0.24, 0);
      draw(sp.text, lower, unit * 0.3, 0);
      break;
  }
}

/** Canvas shadow metrics are in device pixels; scale them with the transform. */
function pxScale(ctx: CanvasRenderingContext2D) {
  return ctx.getTransform().a;
}
