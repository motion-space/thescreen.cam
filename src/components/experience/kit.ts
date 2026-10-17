/**
 * Canvas UI kit for the ScreenCam editor replica.
 * Tokens and control metrics come from the Windows editor
 * (screen-cam-win EditorWeb: generated/screencam-theme.css, styles.css).
 */
import { ICON_NODES } from "./icon-data";
import { SPRINGS, SpringValue } from "./spring";

export type Theme = {
  dark: boolean;
  window: string;
  panel: string;
  panel2: string;
  control: string;
  controlHover: string;
  separator: string;
  hairline: string;
  fillSubtle: string;
  fillSecondary: string;
  fillStrong: string;
  text: string;
  text2: string;
  text3: string;
  accent: string;
  onAccent: string;
  stage: string;
};

export function makeTheme(dark: boolean, accent: string): Theme {
  return dark
    ? {
        dark,
        window: "#1e1e1e",
        panel: "#282828",
        panel2: "#2c2c2c",
        control: "#2f2f2f",
        controlHover: "#383838",
        separator: "rgba(255,255,255,0.098)",
        hairline: "rgba(255,255,255,0.06)",
        fillSubtle: "rgba(255,255,255,0.04)",
        fillSecondary: "rgba(255,255,255,0.07)",
        fillStrong: "rgba(255,255,255,0.12)",
        text: "rgba(255,255,255,0.85)",
        text2: "rgba(255,255,255,0.55)",
        text3: "rgba(255,255,255,0.25)",
        accent,
        onAccent: "#ffffff",
        stage: "#161616",
      }
    : {
        dark,
        window: "#ffffff",
        panel: "#ffffff",
        panel2: "#f9f9f9",
        control: "#f3f3f3",
        controlHover: "#eaeaea",
        separator: "rgba(0,0,0,0.098)",
        hairline: "rgba(0,0,0,0.06)",
        fillSubtle: "rgba(0,0,0,0.04)",
        fillSecondary: "rgba(0,0,0,0.07)",
        fillStrong: "rgba(0,0,0,0.12)",
        text: "rgba(0,0,0,0.9)",
        text2: "rgba(0,0,0,0.62)",
        text3: "rgba(0,0,0,0.42)",
        accent,
        onAccent: "#ffffff",
        stage: "#f4f4f5",
      };
}

export const FONT = `-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI Variable Text", "Segoe UI", "Geist", "PingFang SC", sans-serif`;
export const MONO = `"SF Mono", "Geist Mono", ui-monospace, Menlo, monospace`;

export function font(size: number, weight = 400, family = FONT) {
  return `${weight} ${size}px ${family}`;
}

export function rr(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  const radius = Math.max(0, Math.min(r, w / 2, h / 2));
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, radius);
}

/**
 * Continuous-curvature ("squircle") rounded rectangle: each corner is a
 * superellipse quadrant, extended past the circular radius like Apple's
 * continuous corners.
 */
export function squircle(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  const R = Math.max(0, Math.min(r * 1.28, w / 2, h / 2));
  const n = 4.6;
  const steps = 14;
  const corner = (cx: number, cy: number, sx: number, sy: number, from: number) => {
    for (let i = 0; i <= steps; i += 1) {
      const t = from + (i / steps) * (Math.PI / 2);
      const c = Math.cos(t);
      const s = Math.sin(t);
      const px = Math.sign(c) * Math.pow(Math.abs(c), 2 / n);
      const py = Math.sign(s) * Math.pow(Math.abs(s), 2 / n);
      ctx.lineTo(cx + sx * R * px, cy + sy * R * py);
    }
  };
  ctx.beginPath();
  ctx.moveTo(x + R, y);
  // top-right: centre (x+w-R, y+R); angle from -90° to 0°
  corner(x + w - R, y + R, 1, 1, -Math.PI / 2);
  corner(x + w - R, y + h - R, 1, 1, 0);
  corner(x + R, y + h - R, 1, 1, Math.PI / 2);
  corner(x + R, y + R, 1, 1, Math.PI);
  ctx.closePath();
}

export function text(
  ctx: CanvasRenderingContext2D,
  value: string,
  x: number,
  y: number,
  opts: { size?: number; weight?: number; color: string; align?: CanvasTextAlign; family?: string; baseline?: CanvasTextBaseline },
) {
  ctx.font = font(opts.size ?? 12, opts.weight ?? 400, opts.family ?? FONT);
  ctx.fillStyle = opts.color;
  ctx.textAlign = opts.align ?? "left";
  ctx.textBaseline = opts.baseline ?? "middle";
  ctx.fillText(value, x, y);
}

const measuredWidths = new Map<string, number>();
export function measureWidth(ctx: CanvasRenderingContext2D, value: string) {
  const key = [ctx.font,ctx.fontKerning,ctx.letterSpacing,ctx.wordSpacing,ctx.direction,value].join("\u0000");
  let width = measuredWidths.get(key);
  if (width === undefined) {
    width = ctx.measureText(value).width;
    if (measuredWidths.size >= 4096) measuredWidths.clear();
    measuredWidths.set(key,width);
  }
  return width;
}
if(typeof document!=="undefined") {
  void document.fonts.ready.then(()=>measuredWidths.clear());
  document.fonts.addEventListener("loadingdone",()=>measuredWidths.clear());
}

export function measure(ctx: CanvasRenderingContext2D, value: string, size = 12, weight = 400) {
  ctx.font = font(size, weight);
  return measureWidth(ctx,value);
}

/* ---------- icons (lucide, 24-unit grid) ---------- */

const iconCache = new Map<string, Path2D>();

function iconPath(name: string) {
  const cached = iconCache.get(name);
  if (cached) return cached;
  const path = new Path2D();
  for (const [tag, a] of ICON_NODES[name] ?? []) {
    const n = (k: string) => Number(a[k] ?? 0);
    if (tag === "path") path.addPath(new Path2D(String(a.d)));
    else if (tag === "circle") {
      path.moveTo(n("cx") + n("r"), n("cy"));
      path.arc(n("cx"), n("cy"), n("r"), 0, Math.PI * 2);
    } else if (tag === "ellipse") {
      path.moveTo(n("cx") + n("rx"), n("cy"));
      path.ellipse(n("cx"), n("cy"), n("rx"), n("ry"), 0, 0, Math.PI * 2);
    } else if (tag === "rect") {
      path.roundRect(n("x"), n("y"), n("width"), n("height"), n("rx"));
    } else if (tag === "line") {
      path.moveTo(n("x1"), n("y1"));
      path.lineTo(n("x2"), n("y2"));
    } else if (tag === "polyline" || tag === "polygon") {
      const pts = String(a.points).trim().split(/[\s,]+/).map(Number);
      for (let i = 0; i < pts.length; i += 2) {
        if (i === 0) path.moveTo(pts[i], pts[i + 1]);
        else path.lineTo(pts[i], pts[i + 1]);
      }
      if (tag === "polygon") path.closePath();
    }
  }
  iconCache.set(name, path);
  return path;
}

/** Draws a lucide icon centred at (cx, cy) with the given pixel size. */
export function icon(
  ctx: CanvasRenderingContext2D,
  name: string,
  cx: number,
  cy: number,
  size: number,
  color: string,
  strokeWidth = 1.75,
  fill?: string,
) {
  const s = size / 24;
  ctx.save();
  ctx.translate(cx - size / 2, cy - size / 2);
  ctx.scale(s, s);
  const p = iconPath(name);
  if (fill) {
    ctx.fillStyle = fill;
    ctx.fill(p);
  }
  ctx.strokeStyle = color;
  ctx.lineWidth = strokeWidth;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.stroke(p);
  ctx.restore();
}

/* ---------- hit testing ---------- */

export type Point = { x: number; y: number };

export type Hit = {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  cursor?: string;
  onDown?: (p: Point) => void;
  onDrag?: (p: Point) => void;
  onUp?: () => void;
};

type StoredHit = Hit & { inv: DOMMatrix; frameInv?: DOMMatrix };
const relativeHits = new WeakMap<StoredHit, { base: DOMMatrix; inv: DOMMatrix }>();

/**
 * Hits are registered while drawing; each one remembers the inverse of the
 * canvas transform at that moment, so pointer positions (in canvas pixels)
 * map back into the same local space the control was drawn in.
 */
export class HitRegistry {
  hits: StoredHit[] = [];
  ctx: CanvasRenderingContext2D | null = null;
  clear() {
    this.hits = [];
  }
  appendLayer(layer: HitRegistry, sourceBase: DOMMatrix) {
    const destination = this.ctx?.getTransform() ?? new DOMMatrix();
    const frameInv = destination.inverse();
    for (const hit of layer.hits) {
      let relative = relativeHits.get(hit);
      if (!relative || relative.base !== sourceBase) {
        relative = { base: sourceBase, inv: hit.inv.multiply(sourceBase) };
        relativeHits.set(hit, relative);
      }
      this.hits.push({ ...hit, inv: relative.inv, frameInv });
    }
  }
  add(hit: Hit) {
    const m = this.ctx ? this.ctx.getTransform() : new DOMMatrix();
    this.hits.push({ ...hit, inv: m.inverse() });
  }
  local(hit: StoredHit, p: Point): Point {
    const f = hit.frameInv;
    const x = f ? f.a*p.x+f.c*p.y+f.e : p.x;
    const y = f ? f.b*p.x+f.d*p.y+f.f : p.y;
    const m = hit.inv;
    return { x: m.a*x+m.c*y+m.e, y: m.b*x+m.d*y+m.f };
  }
  find(p: Point) {
    for (let i = this.hits.length - 1; i >= 0; i -= 1) {
      const h = this.hits[i];
      const q = this.local(h, p);
      if (q.x >= h.x && q.x <= h.x + h.w && q.y >= h.y && q.y <= h.y + h.h) return h;
    }
    return undefined;
  }
}

/* ---------- animated values ---------- */

/**
 * Animated UI values (slider growth, toggle knobs, segmented thumbs, handles)
 * follow their targets with the client's effect spring, integrated per frame.
 * `speed` is kept for call-site compatibility; the spring sets the pace.
 */
export class Anim {
  private values = new Map<string, SpringValue>();
  private moving = false;
  startFrame() { this.moving = false; }
  get(id: string, target: number, _speed = 0.22) {
    let value = this.values.get(id);
    if (!value) {
      value = new SpringValue(target, SPRINGS.effect);
      this.values.set(id, value);
    }
    const v = value.update(target, performance.now());
    if (!value.settled(target)) this.moving = true;
    return v;
  }
  busy() {
    return this.moving;
  }
}

/* ---------- controls ---------- */

export type UI = {
  timelineScale?: number;
  timelineOffset?: number;
  timelineLabelsHidden?: boolean;
  ctx: CanvasRenderingContext2D;
  t: Theme;
  hits: HitRegistry;
  anim: Anim;
  hover: string | null;
  active: string | null;
};

export function toggle(ui: UI, id: string, x: number, y: number, on: boolean, onChange: (v: boolean) => void) {
  const { ctx, t } = ui;
  const k = ui.anim.get(`${id}:k`, on ? 1 : 0, 0.25);
  rr(ctx, x, y, 40, 18, 9);
  ctx.fillStyle = on ? t.accent : t.fillStrong;
  ctx.fill();
  if (!on) {
    ctx.strokeStyle = t.separator;
    ctx.lineWidth = 1;
    ctx.stroke();
  }
  const knobX = x + 9 + k * 22;
  ctx.beginPath();
  ctx.arc(knobX, y + 9, ui.hover === id ? 6.5 : 6, 0, Math.PI * 2);
  ctx.fillStyle = on ? "#fff" : t.text2;
  ctx.fill();
  ui.hits.add({ id, x, y: y - 3, w: 40, h: 24, cursor: "pointer", onDown: () => onChange(!on) });
}

export function segmented(
  ui: UI,
  id: string,
  x: number,
  y: number,
  items: string[],
  selected: number,
  onChange: (i: number) => void,
  align: "left" | "right" = "right",
) {
  const { ctx, t } = ui;
  const widths = items.map((item) => Math.max(30, measure(ctx, item, 12, 500) + 16));
  const total = widths.reduce((a, b) => a + b, 0) + 4;
  const left = align === "right" ? x - total : x;
  rr(ctx, left, y, total, 24, 6);
  ctx.fillStyle = t.control;
  ctx.fill();
  let cursor = left + 2;
  const thumbX = ui.anim.get(`${id}:x`, left + 2 + widths.slice(0, selected).reduce((a, b) => a + b, 0), 0.3);
  const thumbW = ui.anim.get(`${id}:w`, widths[selected], 0.3);
  rr(ctx, thumbX, y + 2, thumbW, 20, 5);
  ctx.fillStyle = t.accent;
  ctx.fill();
  items.forEach((item, i) => {
    const w = widths[i];
    const isSel = i === selected;
    const hoverId = `${id}:${i}`;
    if (!isSel && ui.hover === hoverId) {
      rr(ctx, cursor, y + 2, w, 20, 5);
      ctx.fillStyle = t.fillSecondary;
      ctx.fill();
    }
    text(ctx, item, cursor + w / 2, y + 12.5, { size: 12, weight: 500, color: isSel ? t.onAccent : t.text, align: "center" });
    ui.hits.add({ id: hoverId, x: cursor, y, w, h: 24, cursor: "pointer", onDown: () => onChange(i) });
    cursor += w;
  });
  return left;
}

/**
 * The new ScreenCam slider: 10px track with a 6px dot thumb; on hover the
 * track grows to 22px, the thumb becomes a 3x12 bar and the value appears.
 */
export function slider(
  ui: UI,
  id: string,
  x: number,
  y: number,
  w: number,
  value: number,
  onChange: (v: number) => void,
  label?: string,
) {
  const { ctx, t } = ui;
  const hovered = ui.hover === id || ui.active === id;
  const e = ui.anim.get(`${id}:e`, hovered ? 1 : 0, 0.2);
  const h = 10 + 12 * e;
  const r = 5 + 1 * e;
  const cy = y + 12;
  const v = Math.max(0, Math.min(1, value));
  rr(ctx, x, cy - h / 2, w, h, r);
  ctx.save();
  ctx.clip();
  ctx.fillStyle = t.dark ? "rgba(255,255,255,0.0765)" : "rgba(0,0,0,0.08)";
  ctx.fillRect(x, cy - h / 2, w, h);
  ctx.fillStyle = t.accent;
  // thumb position; the range ends in a round cap centred on it while collapsed
  const tx = Math.max(x + 5, Math.min(x + w - 5, x + w * v - 5 * (1 - e) - 4 * e));
  const fillW = Math.min(w, Math.max(h, tx - x + (h / 2) * (1 - e) + 3 * e));
  rr(ctx, x, cy - h / 2, fillW, h, r);
  ctx.fill();
  ctx.restore();
  // thumb
  const tw = 6 - 3 * e;
  const th = 6 + 6 * e;
  rr(ctx, tx - tw / 2, cy - th / 2, tw, th, 3);
  ctx.fillStyle = "#fff";
  ctx.fill();
  if (label && e > 0.02) {
    ctx.globalAlpha = e;
    const leading = v > 0.42;
    text(ctx, label, leading ? x + 9 : x + w - 9, cy + 0.5, {
      size: 11,
      weight: 500,
      color: leading ? "#fff" : t.text2,
      align: leading ? "left" : "right",
    });
    ctx.globalAlpha = 1;
  }
  const set = (p: Point) => onChange(Math.max(0, Math.min(1, (p.x - x) / w)));
  ui.hits.add({ id, x: x - 4, y, w: w + 8, h: 24, cursor: "ew-resize", onDown: set, onDrag: set });
}

export function dropdown(ui: UI, id: string, x: number, y: number, w: number, value: string) {
  const { ctx, t } = ui;
  rr(ctx, x, y, w, 26, 6);
  ctx.fillStyle = ui.hover === id ? t.controlHover : t.control;
  ctx.fill();
  ctx.strokeStyle = t.hairline;
  ctx.lineWidth = 1;
  ctx.stroke();
  text(ctx, value, x + 10, y + 13.5, { size: 12, weight: 400, color: t.text });
  icon(ctx, "chevron-down", x + w - 14, y + 13, 12, t.text2, 2);
  ui.hits.add({ id, x, y, w, h: 26, cursor: "pointer" });
}

export function iconButton(
  ui: UI,
  id: string,
  cx: number,
  cy: number,
  name: string,
  opts: { size?: number; box?: number; active?: boolean; color?: string; onDown?: () => void; stroke?: number } = {},
) {
  const { ctx, t } = ui;
  const box = opts.box ?? 28;
  const hovered = ui.hover === id;
  if (opts.active || hovered) {
    rr(ctx, cx - box / 2, cy - box / 2, box, box, 6);
    ctx.fillStyle = opts.active ? (t.dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.07)") : t.fillSecondary;
    ctx.fill();
  }
  icon(ctx, name, cx, cy, opts.size ?? 14, opts.color ?? (opts.active ? t.accent : t.text2), opts.stroke ?? 1.75);
  ui.hits.add({ id, x: cx - box / 2, y: cy - box / 2, w: box, h: box, cursor: "pointer", onDown: opts.onDown });
}

export function rowLabel(ui: UI, value: string, x: number, y: number) {
  text(ui.ctx, value, x, y, { size: 12, color: ui.t.text2 });
}

export function sectionTitle(ui: UI, value: string, x: number, y: number) {
  text(ui.ctx, value, x, y, { size: 13, weight: 600, color: ui.t.text });
}

/** Optional profiling sink; inactive during ordinary page use. */
export function recordRenderCost(kind: string, started: number, details: Record<string, number | string>) {
  if (typeof window === "undefined") return;
  const target = window as Window & { __xpMeasures?: unknown[]; __profileStage?: string };
  if (target.__xpMeasures) target.__xpMeasures.push({ kind, ms: performance.now() - started, at: started, stage: target.__profileStage, ...details });
}
