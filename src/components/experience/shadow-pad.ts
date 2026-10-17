/**
 * The screenshot inspector's shadow pads, ported from the macOS client
 * (ScreenCamApp/Editor/Inspector/ShadowParameterPad.swift): an 11 × 11 dot
 * grid on an accent-tinted pad whose edge glows towards the selection. While
 * dragging, the dots around the knob swell into rings and the knob grows; on
 * release it settles onto the nearest grid point.
 *
 * Performance: each pad is rendered into its own small offscreen canvas and
 * only re-rendered when its visual state changes (a drag, a 0.16 s transition,
 * the theme). Idle frames are a single drawImage per pad.
 */
import { squircle, type Theme } from "./kit";

export type PadPoint = { x: number; y: number };
export type PadStyle = "angle" | "strength";

/* ---------- value mapping (ShadowControlMapping) ---------- */

export const MAX_SHADOW_OFFSET = 120;
export const MAX_SHADOW_RADIUS = 180;
const REFERENCE = 1000;

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const clampPoint = (p: PadPoint): PadPoint => ({ x: clamp01(p.x), y: clamp01(p.y) });

/** Shadow offset (output pixels) for an Angle pad selection; y grows downwards. */
export const shadowOffset = (p: PadPoint) => ({ dx: (clamp01(p.x) * 2 - 1) * MAX_SHADOW_OFFSET, dy: (clamp01(p.y) * 2 - 1) * MAX_SHADOW_OFFSET });
/** Radius (output pixels) and opacity (0..1) for a Strength pad selection. */
export const shadowStrength = (p: PadPoint) => ({ radius: (1 - clamp01(p.y)) * MAX_SHADOW_RADIUS, opacity: clamp01(p.x) });

/** The client's defaults: 22 px down, 44 px radius, 42 % opacity. */
export const DEFAULT_ANGLE: PadPoint = { x: 0.5, y: (22 / MAX_SHADOW_OFFSET + 1) / 2 };
export const DEFAULT_STRENGTH: PadPoint = { x: 0.42, y: 1 - 44 / MAX_SHADOW_RADIUS };

const decimal = (v: number) => (Math.abs(v - Math.round(v)) < 0.05 ? String(Math.round(v)) : v.toFixed(1));
const percent = (v: number) => `${decimal((v / REFERENCE) * 100)}%`;

/** "180° · 2.2%" / "4.4% · 42%", as under the client's pads. */
export function padValueText(style: PadStyle, p: PadPoint) {
  if (style === "angle") {
    const { dx, dy } = shadowOffset(p);
    const length = Math.hypot(dx, dy);
    let degrees = length > 0.5 ? (Math.atan2(dx, -dy) * 180) / Math.PI : 0;
    if (degrees < 0) degrees += 360;
    return `${decimal(degrees)}° · ${percent(length)}`;
  }
  const { radius, opacity } = shadowStrength(p);
  return `${percent(radius)} · ${decimal(opacity * 100)}%`;
}

/* ---------- geometry (ShadowPadGeometry) ---------- */

const GRID = 11;
const LAST = GRID - 1;
const INSET = 15;
const CORNER = 22;
const DURATION = 0.16;
const DOT_ALPHA = 0.6;
const RING_MIN = 0.7;
const RING_MAX = 0.9;
const RING_REACH = 3 * Math.SQRT2;

const originOf = (style: PadStyle): PadPoint => (style === "angle" ? { x: 0.5, y: 0.5 } : { x: 0, y: 1 });
const cellOf = (p: PadPoint) => ({ c: Math.round(clamp01(p.x) * LAST), r: Math.round(clamp01(p.y) * LAST) });
const snapped = (p: PadPoint): PadPoint => {
  const { c, r } = cellOf(p);
  return { x: c / LAST, y: r / LAST };
};
/** Ease-out cubic over 0.16 s (ShadowPadGeometry.transitionProgress). */
const progressOf = (elapsed: number) => 1 - Math.pow(1 - clamp01(elapsed / DURATION), 3);

function ringScale(c: number, r: number, cell: { c: number; r: number }) {
  const d = Math.hypot(c - cell.c, r - cell.r);
  if (d <= 0 || d >= RING_REACH) return 1;
  if (d <= 2) return 2.4 + (1.8 - 2.4) * clamp01(d - 1);
  return 1.8 + (1 - 1.8) * ((d - 2) / (RING_REACH - 2));
}

function ringAlpha(c: number, r: number, cell: { c: number; r: number }) {
  const d = Math.hypot(c - cell.c, r - cell.r);
  if (d <= 0 || d >= RING_REACH) return DOT_ALPHA;
  return RING_MAX + (RING_MIN - RING_MAX) * clamp01((d - 1) / (RING_REACH - 1));
}

/** Where the edge glow comes from and how far it spreads (glowMetrics). */
function glow(selection: PadPoint, size: number) {
  const p = clampPoint(selection);
  const half = size / 2;
  const dx = (p.x - 0.5) * (size - INSET * 2);
  const dy = (p.y - 0.5) * (size - INSET * 2);
  const sx = Math.abs(dx) > 1e-6 ? half / Math.abs(dx) : Infinity;
  const sy = Math.abs(dy) > 1e-6 ? half / Math.abs(dy) : Infinity;
  const k = Math.min(sx, sy);
  const edge = Number.isFinite(k) ? { x: half + dx * k, y: half + dy * k } : { x: half, y: half };
  const depth = Math.min(p.x, 1 - p.x, p.y, 1 - p.y) * 2;
  const proximity = 1 - depth;
  return { edge, spread: size * (0.54 + depth * 0.42), intensity: 0.34 + 0.66 * Math.pow(proximity, 0.85), blur: 3 + proximity * 3 };
}

/* ---------- colour helpers ---------- */

function rgb(color: string): [number, number, number] {
  const hex = color.trim().replace("#", "");
  if (/^[0-9a-f]{6}$/i.test(hex)) return [parseInt(hex.slice(0, 2), 16), parseInt(hex.slice(2, 4), 16), parseInt(hex.slice(4, 6), 16)];
  if (/^[0-9a-f]{3}$/i.test(hex)) return [0, 1, 2].map((i) => parseInt(hex[i] + hex[i], 16)) as [number, number, number];
  const m = color.match(/\d+(\.\d+)?/g);
  return m && m.length >= 3 ? [Number(m[0]), Number(m[1]), Number(m[2])] : [255, 90, 31];
}
const rgba = ([r, g, b]: [number, number, number], a: number) => `rgba(${r | 0},${g | 0},${b | 0},${Math.max(0, Math.min(1, a)).toFixed(3)})`;
const towardWhite = ([r, g, b]: [number, number, number], f: number): [number, number, number] => [r + (255 - r) * f, g + (255 - g) * f, b + (255 - b) * f];

/* ---------- one pad ---------- */

type Size = { radii: Float32Array; alphas: Float32Array; originD: number; originA: number };

class Pad {
  dragging = false;
  private pointer: PadPoint | null = null;
  private offset = { x: 0, y: 0 };
  private initialAct = 0;
  private dragStart = 0;
  private release: { from: PadPoint; to: PadPoint; fromAct: number; start: number } | null = null;
  private sizeFrom: Size | null = null;
  private sizeTo: Size | null = null;
  private sizeStart = -1;
  private sizeKey = "";
  private canvas = document.createElement("canvas");
  private key = "";

  constructor(readonly style: PadStyle) {}

  /** Animating: needs frames until the transition settles. */
  busy(now: number) {
    return this.dragging || (!!this.release && now - this.release.start < DURATION) || (this.sizeStart >= 0 && now - this.sizeStart < DURATION);
  }

  begin(pointer: PadPoint, selection: PadPoint, now: number) {
    const shown = this.indicator(selection, now);
    const start = shown?.p ?? selection;
    this.pointer = clampPoint(pointer);
    this.offset = { x: start.x - this.pointer.x, y: start.y - this.pointer.y };
    this.initialAct = shown?.act ?? 0;
    this.dragStart = now;
    this.release = null;
    this.dragging = true;
  }

  move(pointer: PadPoint) {
    this.pointer = clampPoint(pointer);
  }

  end(selection: PadPoint, now: number) {
    if (!this.dragging) return;
    const shown = this.indicator(selection, now) ?? { p: selection, act: 1 };
    this.release = { from: shown.p, to: snapped(selection), fromAct: shown.act, start: now };
    this.dragging = false;
    this.pointer = null;
  }

  /** The knob: follows the pointer while dragging, settles on release, hidden at the origin. */
  private indicator(selection: PadPoint, now: number): { p: PadPoint; act: number } | null {
    if (this.dragging && this.pointer) {
      const k = progressOf(now - this.dragStart);
      return {
        p: clampPoint({ x: this.pointer.x + this.offset.x * (1 - k), y: this.pointer.y + this.offset.y * (1 - k) }),
        act: this.initialAct + (1 - this.initialAct) * k,
      };
    }
    if (this.release) {
      const k = progressOf(now - this.release.start);
      if (k < 1) {
        const { from, to } = this.release;
        return { p: { x: from.x + (to.x - from.x) * k, y: from.y + (to.y - from.y) * k }, act: this.release.fromAct * (1 - k) };
      }
      this.release = null;
    }
    const settled = snapped(selection);
    const origin = originOf(this.style);
    if (Math.hypot(settled.x - origin.x, settled.y - origin.y) < 1e-6) return null;
    return { p: settled, act: 0 };
  }

  private targetSize(selection: PadPoint, spacing: number): Size {
    const cell = cellOf(selection);
    const active = this.dragging;
    const radii = new Float32Array(GRID * GRID);
    const alphas = new Float32Array(GRID * GRID);
    for (let r = 0; r < GRID; r += 1) {
      for (let c = 0; c < GRID; c += 1) {
        const highlighted = !active && (c === cell.c || r === cell.r);
        radii[r * GRID + c] = (highlighted ? 2.25 : 1.65) * (active ? ringScale(c, r, cell) : 1);
        alphas[r * GRID + c] = active ? ringAlpha(c, r, cell) : DOT_ALPHA;
      }
    }
    const o = cellOf(originOf(this.style));
    return {
      radii,
      alphas,
      originD: Math.max(7, spacing * 0.7) * (active ? ringScale(o.c, o.r, cell) : 1),
      originA: active ? ringAlpha(o.c, o.r, cell) : DOT_ALPHA,
    };
  }

  /** The dot sizes, easing over 0.16 s whenever the selected cell or drag state changes. */
  private size(selection: PadPoint, spacing: number, now: number): Size {
    const cell = cellOf(selection);
    const key = `${cell.c},${cell.r},${this.dragging},${spacing.toFixed(2)}`;
    if (key !== this.sizeKey) {
      const current = this.sizeTo ? this.interpolated(now) : null;
      this.sizeTo = this.targetSize(selection, spacing);
      this.sizeFrom = current;
      this.sizeStart = current ? now : -1;
      this.sizeKey = key;
    }
    return this.interpolated(now);
  }

  private interpolated(now: number): Size {
    const to = this.sizeTo!;
    const from = this.sizeFrom;
    if (!from || this.sizeStart < 0) return to;
    const k = progressOf(now - this.sizeStart);
    if (k >= 1) {
      this.sizeFrom = null;
      this.sizeStart = -1;
      return to;
    }
    const radii = new Float32Array(to.radii.length);
    const alphas = new Float32Array(to.alphas.length);
    for (let i = 0; i < radii.length; i += 1) {
      radii[i] = from.radii[i] + (to.radii[i] - from.radii[i]) * k;
      alphas[i] = from.alphas[i] + (to.alphas[i] - from.alphas[i]) * k;
    }
    return { radii, alphas, originD: from.originD + (to.originD - from.originD) * k, originA: from.originA + (to.originA - from.originA) * k };
  }

  /** Draws the pad at (x, y), `size` square, rendering into its cache only when something changed. */
  draw(ctx: CanvasRenderingContext2D, t: Theme, x: number, y: number, size: number, selection: PadPoint, scale: number, now: number) {
    const spacing = (size - INSET * 2) / LAST;
    const sz = this.size(selection, spacing, now);
    const knob = this.indicator(selection, now);
    const margin = 18;
    const key = [
      t.dark, t.accent, size, scale, selection.x.toFixed(4), selection.y.toFixed(4),
      knob ? `${knob.p.x.toFixed(4)},${knob.p.y.toFixed(4)},${knob.act.toFixed(3)}` : "-",
      this.sizeStart >= 0 ? (now - this.sizeStart).toFixed(3) : this.sizeKey,
    ].join("|");
    if (key !== this.key) {
      const px = Math.ceil((size + margin * 2) * scale);
      if (this.canvas.width !== px) this.canvas.width = this.canvas.height = px;
      const c = this.canvas.getContext("2d")!;
      c.setTransform(1, 0, 0, 1, 0, 0);
      c.clearRect(0, 0, px, px);
      c.setTransform(scale, 0, 0, scale, margin * scale, margin * scale);
      this.paint(c, t, size, spacing, selection, sz, knob, scale);
      this.key = key;
    }
    ctx.drawImage(this.canvas, x - margin, y - margin, size + margin * 2, size + margin * 2);
  }

  private paint(c: CanvasRenderingContext2D, t: Theme, size: number, spacing: number, selection: PadPoint, sz: Size, knob: { p: PadPoint; act: number } | null, scale: number) {
    const dark = t.dark;
    const accent = rgb(t.accent);
    const g = glow(selection, size);
    const shape = (inset = 0) => squircle(c, inset, inset, size - inset * 2, size - inset * 2, CORNER - inset);

    // pad body: drop shadow, base, then the style's accent wash
    c.save();
    shape();
    c.shadowColor = "rgba(0,0,0,0.16)";
    c.shadowBlur = 16 * scale;
    c.shadowOffsetY = 4 * scale;
    c.fillStyle = dark ? "rgb(26,28,33)" : "rgb(236,236,238)";
    c.fill();
    c.restore();
    c.save();
    shape();
    c.clip();
    if (!dark) {
      c.fillStyle = "rgba(26,28,33,0.16)";
      c.fillRect(0, 0, size, size);
    }
    const wash = dark ? 0.42 : 0.32;
    const bg = this.style === "angle"
      ? c.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, 130)
      : c.createLinearGradient(0, size, size, 0);
    bg.addColorStop(0, rgba(accent, wash));
    bg.addColorStop(0.5, rgba(accent, wash * (this.style === "angle" ? 0.55 : 0.42)));
    bg.addColorStop(1, rgba(accent, 0));
    c.fillStyle = bg;
    c.fillRect(0, 0, size, size);

    // inner glow from the edge nearest the selection (under the grid in dark mode)
    const innerGlow = () => {
      const inner = dark ? accent : towardWhite(accent, 0.3);
      const strength = (dark ? 0.74 : 1) * g.intensity;
      const stops: Array<[number, number]> = dark
        ? [[0, 0.72], [0.22, 0.48], [0.56, 0.2], [0.82, 0.06], [1, 0]]
        : [[0, 0.92], [0.22, 0.68], [0.56, 0.3], [0.82, 0.09], [1, 0]];
      const rg = c.createRadialGradient(g.edge.x, g.edge.y, 0, g.edge.x, g.edge.y, g.spread * 0.48);
      for (const [at, a] of stops) rg.addColorStop(at, rgba(inner, strength * a));
      c.save();
      if (dark) c.globalCompositeOperation = "screen";
      c.fillStyle = rg;
      c.fillRect(0, 0, size, size);
      c.restore();
    };
    if (dark) innerGlow();

    // the dot grid; the origin is a ring, the settled selection is the knob
    const cell = cellOf(selection);
    const o = cellOf(originOf(this.style));
    const step = (size - INSET * 2) / LAST;
    c.fillStyle = "#fff";
    for (let r = 0; r < GRID; r += 1) {
      for (let col = 0; col < GRID; col += 1) {
        if (col === o.c && r === o.r) continue;
        if (!this.dragging && col === cell.c && r === cell.r) continue;
        const i = r * GRID + col;
        c.globalAlpha = sz.alphas[i];
        c.beginPath();
        c.arc(INSET + col * step, INSET + r * step, sz.radii[i], 0, Math.PI * 2);
        c.fill();
      }
    }
    c.globalAlpha = sz.originA;
    c.strokeStyle = "#fff";
    c.lineWidth = Math.max(1.1, spacing * 0.1);
    c.beginPath();
    c.arc(INSET + o.c * step, INSET + o.r * step, sz.originD / 2, 0, Math.PI * 2);
    c.stroke();
    c.globalAlpha = 1;

    if (!dark) innerGlow();
    c.restore();

    // hairline border and the accent edge glow
    c.save();
    shape(0.5);
    c.strokeStyle = dark ? "rgba(255,255,255,0.16)" : "rgba(0,0,0,0.14)";
    c.lineWidth = 1;
    c.stroke();
    const glowAlpha = (dark ? 1 : 0.72) * g.intensity;
    const edge = c.createRadialGradient(g.edge.x, g.edge.y, 0, g.edge.x, g.edge.y, g.spread * 0.52);
    edge.addColorStop(0, rgba(accent, glowAlpha));
    edge.addColorStop(0.22, rgba(accent, glowAlpha * 0.84));
    edge.addColorStop(0.6, rgba(accent, glowAlpha * 0.28));
    edge.addColorStop(1, rgba(accent, 0));
    shape(1.2);
    c.strokeStyle = edge;
    c.lineWidth = 2.4;
    c.shadowColor = rgba(accent, glowAlpha * (dark ? 0.9 : 0.6));
    c.shadowBlur = (g.blur + 4) * 2 * scale;
    c.stroke();
    c.shadowColor = "transparent";
    const bright = towardWhite(accent, dark ? 0.46 : 0.5);
    const rim = c.createRadialGradient(g.edge.x, g.edge.y, 0, g.edge.x, g.edge.y, g.spread * 0.44);
    rim.addColorStop(0, rgba(bright, (dark ? 1 : 0.86) * g.intensity));
    rim.addColorStop(0.26, rgba(bright, glowAlpha * 0.94));
    rim.addColorStop(0.62, rgba(bright, glowAlpha * 0.24));
    rim.addColorStop(1, rgba(bright, 0));
    shape(0.5);
    c.strokeStyle = rim;
    c.lineWidth = 1;
    c.stroke();
    c.restore();

    // the knob: a raised accent glass bead, larger while dragging
    if (knob) {
      const d = Math.max(8, spacing * 0.85) * (1 + clamp01(knob.act));
      const kx = INSET + clamp01(knob.p.x) * (size - INSET * 2);
      const ky = INSET + clamp01(knob.p.y) * (size - INSET * 2);
      const raised = towardWhite(accent, dark ? 0.24 : 0.36);
      c.save();
      c.beginPath();
      c.arc(kx, ky, d / 2, 0, Math.PI * 2);
      c.shadowColor = dark ? "rgba(0,0,0,0.32)" : "rgba(0,0,0,0.18)";
      c.shadowBlur = 6 * scale;
      c.shadowOffsetY = 1 * scale;
      c.fillStyle = rgba(raised, 0.92);
      c.fill();
      c.shadowColor = "transparent";
      const sheen = c.createRadialGradient(kx - d * 0.18, ky - d * 0.28, 0, kx, ky, d / 2);
      sheen.addColorStop(0, "rgba(255,255,255,0.42)");
      sheen.addColorStop(0.55, "rgba(255,255,255,0.06)");
      sheen.addColorStop(1, "rgba(255,255,255,0)");
      c.fillStyle = sheen;
      c.fill();
      c.beginPath();
      c.arc(kx, ky, d / 2 - 0.4, 0, Math.PI * 2);
      c.strokeStyle = rgba(towardWhite(accent, 0.62), 0.95);
      c.lineWidth = 0.8;
      c.stroke();
      c.restore();
    }
  }
}

/* ---------- both pads, as the screenshot inspector shows them ---------- */

export type PadRects = { angle: { x: number; y: number; size: number }; strength: { x: number; y: number; size: number } };

/** Selection updates reach the document at most this often while dragging (selectionDeliveryFrequency). */
const DELIVERY_HZ = 30;

export class ShadowPads {
  private pads = { angle: new Pad("angle"), strength: new Pad("strength") };
  private live: Record<PadStyle, PadPoint | null> = { angle: null, strength: null };
  private delivered = 0;
  private pending: Record<PadStyle, PadPoint | null> = { angle: null, strength: null };

  busy(now = performance.now() / 1000) {
    return this.pads.angle.busy(now) || this.pads.strength.busy(now);
  }

  /**
   * Draws both pads (window-local coordinates) and registers their hits.
   * `selection` reads the committed values; `commit` writes one back.
   */
  draw(
    ctx: CanvasRenderingContext2D,
    t: Theme,
    hits: { add: (hit: { id: string; x: number; y: number; w: number; h: number; cursor?: string; onDown?: (p: PadPoint) => void; onDrag?: (p: PadPoint) => void; onUp?: () => void }) => void },
    rects: PadRects,
    selection: Record<PadStyle, PadPoint>,
    commit: (style: PadStyle, p: PadPoint) => void,
    touch: () => void,
    scale: number,
    idPrefix = "shot-pad",
  ) {
    const now = performance.now() / 1000;
    this.flush(now, commit);
    for (const style of ["angle", "strength"] as const) {
      const pad = this.pads[style];
      const r = rects[style];
      const toPad = (p: PadPoint): PadPoint => ({ x: (p.x - r.x - INSET) / (r.size - INSET * 2), y: (p.y - r.y - INSET) / (r.size - INSET * 2) });
      const shown = this.live[style] ?? selection[style];
      pad.draw(ctx, t, r.x, r.y, r.size, shown, scale, now);
      const update = (p: PadPoint) => {
        const next = clampPoint(toPad(p));
        pad.move(next);
        this.live[style] = next;
        this.pending[style] = next;
        this.flush(performance.now() / 1000, commit);
        touch();
      };
      hits.add({
        id: `${idPrefix}-${style}`,
        x: r.x,
        y: r.y,
        w: r.size,
        h: r.size,
        cursor: pad.dragging ? "grabbing" : "grab",
        onDown: (p) => {
          const next = clampPoint(toPad(p));
          pad.begin(next, shown, performance.now() / 1000);
          update(p);
        },
        onDrag: update,
        onUp: () => {
          const last = this.live[style] ?? selection[style];
          this.pending[style] = last;
          this.delivered = 0;
          this.flush(performance.now() / 1000, commit);
          pad.end(last, performance.now() / 1000);
          this.live[style] = null;
          touch();
        },
      });
    }
  }

  /** Commits pending selections, throttled to DELIVERY_HZ while dragging. */
  private flush(now: number, commit: (style: PadStyle, p: PadPoint) => void) {
    if (!this.pending.angle && !this.pending.strength) return;
    if (now - this.delivered < 1 / DELIVERY_HZ) return;
    for (const style of ["angle", "strength"] as const) {
      const p = this.pending[style];
      if (p) commit(style, p);
      this.pending[style] = null;
    }
    this.delivered = now;
  }
}
