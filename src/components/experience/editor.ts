import { drawPanel, drawShadow } from "./panel-shadow";
import { DEFAULT_ANGLE, DEFAULT_STRENGTH, type PadPoint, type PadRects, ShadowPads, padValueText, shadowOffset, shadowStrength } from "./shadow-pad";
/**
 * The ScreenCam editor, drawn on canvas in world space (1440 × 900 window).
 * Layout follows the Windows editor (screen-cam-win EditorWeb) and the mac
 * client: header, 340px inspector, transport, timeline with the client's
 * track palette. The preview renders the timeline's effects: 2D zoom,
 * 3D spatial zoom, glass lens and read-along captions.
 */
import {
  type Theme,
  type UI,
  Anim,
  HitRegistry,
  dropdown,
  font,
  icon,
  iconButton,
  measure,
  rowLabel,
  rr,
  sectionTitle,
  segmented,
  slider,
  text,
  toggle,
  MONO,
} from "./kit";
import { CH, CW, KEY_CLIPS, LENS_STOPS, TARGETS, drawRecordedApp } from "./recorded-app";
import { type KeyOverlaySettings, type KeyStyle, KEY_STYLES } from "./keyboard";
import { type CameraSettings, cameraClips, setCameraVolume } from "./camera";
import { SPRINGS, scaledSpring, springEase, springSettle, springStep } from "./spring";
import { type FrameBackground, GRADIENT_PRESETS, MESH_PALETTES, gradientFill, meshTexture } from "./background-presets";

/* ---------- layout ---------- */

export const EW = 1440;
export const EH = 900;
export const HEADER = 40;
export const INS_X = 1100;
export const PREVIEW = { x: 0, y: HEADER, w: INS_X, h: 520 };
export const TRANSPORT_Y = PREVIEW.y + PREVIEW.h;
export const TIMELINE_Y = TRANSPORT_Y + 56;
export const RULER_H = 28;
export const LANE_Y = TIMELINE_Y + RULER_H + 4;
export const LANE_PITCH = 34;
export const TL_X0 = 92;
export const TL_X1 = EW;
export const TL_INSET = 10;
// A fixed trailing spacer belongs to the scroll content, not the viewport.
// It is visible at 100%, or after panning a zoomed timeline to its end.
export const TL_END_SPACE = 40;
const TL_CONTENT_WIDTH = TL_X1 - TL_X0 - TL_INSET - TL_END_SPACE;
export const DURATION = 24;

const COMP_H = PREVIEW.h - 24;
const COMP_W = (COMP_H * 16) / 9;
export const COMP = { x: (PREVIEW.w - COMP_W) / 2, y: PREVIEW.y + 12, w: COMP_W, h: COMP_H };

/** Screenshot editor window sits to the right of the editor in world space. */
// tall enough for the inspector's square shadow pads, as in the client
export const SHOT = { x: EW + 120, y: -10, w: 1240, h: 930 };

/** Where the screenshot inspector's shadow pads sit (window-local), set while it lays out. */
export const SHOT_PADS: PadRects = { angle: { x: 0, y: 0, size: 0 }, strength: { x: 0, y: 0, size: 0 } };

/** Where the video inspector's Background shadow pads sit, set while it lays out. */
export const BG_PADS: PadRects = { angle: { x: 0, y: 0, size: 0 }, strength: { x: 0, y: 0, size: 0 } };

/** A frame's drop shadow from its Angle / Strength pads, at `k` units per recorded pixel. */
export function padShadow(angle: PadPoint, strength: PadPoint, k: number) {
  const { dx, dy } = shadowOffset(angle);
  const { radius, opacity } = shadowStrength(strength);
  return { ox: dx * k, oy: dy * k, blur: radius * k, alpha: opacity };
}

/** The screenshot frame's drop shadow at output scale `k`: offset, blur and opacity from the pads. */
export function shotShadow(frame: EditorState["shotFrame"], k: number) {
  return padShadow(frame.shadowAngle, frame.shadowStrength, k);
}

export const LANES = ["Recording", "Keyboard", "Camera", "System", "Microphone", "Zoom", "Captions"] as const;
export const laneY = (i: number) => LANE_Y + i * LANE_PITCH;
export const timeToX = (t: number, scale = 1, offset = 0) => TL_X0 + TL_INSET + (t / DURATION) * TL_CONTENT_WIDTH * scale - offset;
export const xToTime = (x: number, scale = 1, offset = 0) => Math.max(0, Math.min(DURATION, ((x - TL_X0 - TL_INSET + offset) / (TL_CONTENT_WIDTH * scale)) * DURATION));

/* Clip palette from TimelineTrackClipPalette.swift */
const PALETTE = {
  recording: { fill: "#C7C7C7", border: "#A5A5A5" },
  keyboard: { fill: "#FF3E6E", border: "#FF2B75" },
  annotation: { fill: "#9B5CFF", border: "#B98CFF" },
  camera: { fill: "#00C7D6", border: "#00C7D6" },
  system: { fill: "#00A645", border: "#00A645" },
  microphone: { fill: "#42DC82", border: "#5ADF92" },
  zoom: { fill: "#FFA617", border: "#FFA617" },
  captions: { fill: "#0FB7D0", border: "#45DDF0" },
};

/* ---------- backgrounds (calm, low-saturation) ---------- */

export const BACKGROUNDS: Array<{ name: string; stops: [string, string]; glow: string }> = [
  { name: "Graphite", stops: ["#30333a", "#1c1e23"], glow: "rgba(255,255,255,0.07)" },
  { name: "Mist", stops: ["#eef0f4", "#d8dde5"], glow: "rgba(255,255,255,0.7)" },
  { name: "Dusk", stops: ["#4a4c6e", "#2a2b40"], glow: "rgba(255,214,190,0.14)" },
  { name: "Sand", stops: ["#ebe2d6", "#cdbfab"], glow: "rgba(255,255,255,0.5)" },
  { name: "Sage", stops: ["#c3cfbf", "#94a690"], glow: "rgba(255,255,255,0.35)" },
  { name: "Ink", stops: ["#141416", "#0b0b0c"], glow: "rgba(255,255,255,0.05)" },
];

/* ---------- state ---------- */

export type LensMode = 0 | 1 | 2; // 2D, 3D, Lens
export type ZoomClip = {
  start: number;
  end: number;
  mode: LensMode;
  zoom: number; // 1..5
  moveSpeed: number; // 0..1
  enabled: boolean;
  manual: boolean;
  focus: { x: number; y: number }; // content space
  focal: number; // 0..1 (24–120 mm)
  lensSize: number; // 0..1
};

export type Selection = { kind: "none" } | { kind: "zoom"; index: number } | { kind: "captions" };
export type Tab = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export type EditorState = {
  time: number;
  playing: boolean;
  volume: number;
  timelineScale: number;
  timelineOffset: number;
  selection: Selection;
  tab: Tab;
  zoomClips: ZoomClip[];
  captions: { enabled: boolean; readAlong: boolean; unread: number; background: 0 | 1 | 2; size: number; bottom: boolean };
  captionsShown: number; // 0..1 reveal of the caption track
  /** shadowAngle / shadowStrength: the Shadow pads' selections (0..1, y down), as in the client */
  background: { frame: FrameBackground; padding: number; radius: number; shadowAngle: PadPoint; shadowStrength: PadPoint };
  bgMenuOpen: boolean;
  keys: KeyOverlaySettings;
  camera: CameraSettings;
  motionBlur: boolean;
  sizeMode: 0 | 1;
  chrome: number; // 0..1 reveal of the editor UI around the preview
  shot: number; // 0..1 screenshot window reveal
  annotate: number; // 0..1 annotation drawing progress
  flash: number; // 0..1 capture flash
  shotTool: number;
  shotBackground: number;
  /** shadowAngle / shadowStrength are the two shadow pads' selections (0..1, y down), as in the client. */
  shotFrame: { padding: number; radius: number; smoothness: number; shadowAngle: PadPoint; shadowStrength: PadPoint; inspector: boolean };
  captionText: string;
};

export function createState(dark: boolean, captionText: string): EditorState {
  return {
    time: 0.5,
    playing: true,
    volume: 0.75,
    timelineScale: 1,
    timelineOffset: 0,
    selection: { kind: "none" },
    tab: 0,
    zoomClips: [
      // one joined 2D chain: every clip has a fixed target, so each move
      // between them is a single straight line and the camera never backs out
      { start: 0.4, end: 3.3, mode: 0, zoom: 1.5, moveSpeed: 0.5, enabled: true, manual: true, focus: { ...TARGETS.statusIcon }, focal: 0.3, lensSize: 0.4 },
      { start: 3.3, end: 6.0, mode: 0, zoom: 2.2, moveSpeed: 0.5, enabled: true, manual: true, focus: { ...TARGETS.statusMenu }, focal: 0.3, lensSize: 0.4 },
      { start: 6.0, end: 8.7, mode: 0, zoom: 1.9, moveSpeed: 0.45, enabled: true, manual: true, focus: { ...TARGETS.toast }, focal: 0.3, lensSize: 0.4 },
      { start: 8.7, end: 11.1, mode: 0, zoom: 1.6, moveSpeed: 0.5, enabled: true, manual: true, focus: { ...TARGETS.openRow }, focal: 0.3, lensSize: 0.4 },
      { start: 11.1, end: 12.9, mode: 0, zoom: 1.8, moveSpeed: 0.5, enabled: true, manual: true, focus: { ...TARGETS.comment }, focal: 0.3, lensSize: 0.4 },
      { start: 14.2, end: 17.2, mode: 1, zoom: 1.6, moveSpeed: 0.45, enabled: true, manual: false, focus: { x: 700, y: 360 }, focal: 0.3, lensSize: 0.4 },
      // three joined lens clips, each with its own size and magnification
      ...LENS_STOPS.map(([start, end, size, mag]) => ({
        start,
        end,
        mode: 2 as LensMode,
        zoom: mag,
        moveSpeed: 0.85,
        enabled: true,
        manual: false,
        focus: { x: 0, y: 0 },
        focal: 0.3,
        lensSize: size,
      })),
    ],
    captions: { enabled: true, readAlong: true, unread: 0.35, background: 2, size: 0.45, bottom: true },
    captionsShown: 0,
    // default: the first mesh gradient palette
    background: { frame: { kind: "mesh", gradient: 0, mesh: 0, color: "#F5F5F7" }, padding: 0.36, radius: 0.4, shadowAngle: { ...DEFAULT_ANGLE }, shadowStrength: { ...DEFAULT_STRENGTH } },
    bgMenuOpen: false,
    keys: { show: true, style: 0, position: 1 },
    // two camera clips: the second one removes the background
    camera: { show: true, remove: true, sticker: false, size: 0.3, changedAt: -1e9, split: 15.6, cuts: [5.0, 10.2] },
    motionBlur: true,
    sizeMode: 0,
    chrome: 0,
    shot: 0,
    annotate: 0,
    flash: 0,
    shotTool: 1,
    shotBackground: dark ? 2 : 3,
    shotFrame: { padding: 0.3, radius: 0.15, smoothness: 0.6, shadowAngle: { ...DEFAULT_ANGLE }, shadowStrength: { ...DEFAULT_STRENGTH }, inspector: true },
    captionText,
  };
}

/* ---------- helpers ---------- */

export const clamp = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
/** Progress easing for scroll-driven reveals: the client's effect spring as a curve. */
export const ease = springEase(SPRINGS.effect);
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Clips of the same mode closer than this are treated as joined. */
const JOIN_GAP = 0.06;
/** The client's camera spring, scaled by the clip's Move Speed. */
export const zoomSpring = (clip: ZoomClip) => scaledSpring(SPRINGS.camera, clip.moveSpeed);
/** How long the zoom spring takes to settle (the visible in/out ramp). */
const rampOf = (clip: ZoomClip) => springSettle(zoomSpring(clip));
/** SpringSettings.estimatedFullResponseDurationMs: the horizon a zoom-in/out is fitted to. */
export const horizonOf = (clip: ZoomClip) => Math.max(0.18, rampOf(clip)) * 1.6;

/**
 * CameraSpringTimeline.springProgress: the spring's step response, normalised
 * so it lands exactly on 1 at the end of the response horizon. Fast at first,
 * then a long gentle settle.
 */
export function zoomProgress(clip: ZoomClip, elapsed: number) {
  if (elapsed <= 0) return 0;
  const spring = zoomSpring(clip);
  const horizon = horizonOf(clip);
  if (elapsed >= horizon) return 1;
  return clamp(springStep(spring, elapsed) / Math.min(1, springStep(spring, horizon)));
}

function joined(a: ZoomClip, b: ZoomClip) {
  return a.enabled && b.enabled && a.mode === b.mode && Math.abs(b.start - a.end) <= JOIN_GAP;
}

export type ZoomAt = {
  clip: ZoomClip;
  index: number;
  /** engagement of `clip` (1 while transitioning between clips) */
  f: number;
  /** a transition into `to`, starting from `from` engaged at `fromF` */
  from?: ZoomClip;
  fromF?: number;
  to?: ZoomClip;
  u: number;
};

/** How engaged a clip still is `time` after it ended (its exit, unless a joined clip takes over). */
function exitEngagement(clips: ZoomClip[], clip: ZoomClip, time: number) {
  if (!clip.enabled || time < clip.end) return 0;
  if (clips.some((n) => n !== clip && joined(clip, n))) return 0;
  return 1 - zoomProgress(clip, time - clip.end);
}

/**
 * The zoom state at `time`, following the client's CameraSpringTimeline:
 * a clip springs in from its start and springs out after its end. When a
 * clip starts while another is still engaged (joined, or still zooming out)
 * the camera transitions straight from that frame to the new clip's.
 */
export function zoomAt(state: EditorState, time: number): ZoomAt | null {
  const clips = state.zoomClips;
  const index = clips.findIndex((c) => c.enabled && time >= c.start && time < c.end);
  if (index >= 0) {
    const clip = clips[index];
    const u = zoomProgress(clip, time - clip.start);
    // the frame this clip starts from: a joined neighbour, or one still on its way out
    const prev = clips
      .filter((c) => c !== clip && c.enabled && c.mode === clip.mode && c.end <= clip.start + JOIN_GAP)
      .map((c) => ({ c, f: joined(c, clip) ? 1 : exitEngagement(clips, c, clip.start) }))
      .filter((x) => x.f > 0.001)
      .sort((x, y) => y.c.end - x.c.end)[0];
    if (prev && u < 1) return { clip, index, f: 1, from: prev.c, fromF: prev.f, to: clip, u };
    return { clip, index, f: u, u: 0 };
  }
  let best: ZoomAt | null = null;
  clips.forEach((clip, i) => {
    const f = exitEngagement(clips, clip, time);
    if (f > 0.001 && (!best || f > best.f)) best = { clip, index: i, f, u: 0 };
  });
  return best;
}

/**
 * The zoom level a clip's entry starts from: its joined neighbour's level (or
 * what is left of one still zooming out), else 1x. Drives the track waveform,
 * so joined clips' curves run into each other as the camera does.
 */
export function zoomEntryLevel(clips: ZoomClip[], clip: ZoomClip) {
  const prev = clips
    .filter((c) => c !== clip && c.enabled && c.mode === clip.mode && c.end <= clip.start + JOIN_GAP)
    .sort((x, y) => y.end - x.end)[0];
  if (!prev || !clip.enabled) return 1;
  const f = joined(prev, clip) ? 1 : exitEngagement(clips, prev, clip.start);
  return 1 + (prev.zoom - 1) * f;
}

/** Kept for callers that need a clip's own engagement. */
export function zoomEngagement(clip: ZoomClip, time: number, clips: ZoomClip[] = []) {
  if (!clip.enabled) return 0;
  if (time >= clip.start && time < clip.end) return zoomProgress(clip, time - clip.start);
  return exitEngagement(clips.length ? clips : [clip], clip, time);
}

export function activeZoom(state: EditorState, time: number) {
  const z = zoomAt(state, time);
  return z ? { clip: z.clip, f: z.f, index: z.index } : null;
}

export function captionTokens(value: string) {
  if (/\s/.test(value)) return value.split(/\s+/);
  const chars = Array.from(value);
  const out: string[] = [];
  for (let i = 0; i < chars.length; i += 2) out.push(chars.slice(i, i + 2).join(""));
  return out;
}

/* ---------- preview ---------- */

export type Rect = { x: number; y: number; w: number; h: number };

export function screenRectIn(comp: Rect, padding: number) {
  const pad = comp.w * (0.02 + padding * 0.12);
  const availW = comp.w - pad * 2;
  const availH = comp.h - pad * 2;
  const s = Math.min(availW / CW, availH / CH);
  const w = CW * s;
  const h = CH * s;
  return { x: comp.x + (comp.w - w) / 2, y: comp.y + (comp.h - h) / 2, w, h, s };
}

export function drawBackground(ctx: CanvasRenderingContext2D, r: Rect, preset: number, radius: number) {
  const bg = BACKGROUNDS[preset] ?? BACKGROUNDS[0];
  rr(ctx, r.x, r.y, r.w, r.h, radius);
  const g = ctx.createLinearGradient(r.x, r.y, r.x + r.w * 0.4, r.y + r.h);
  g.addColorStop(0, bg.stops[0]);
  g.addColorStop(1, bg.stops[1]);
  ctx.fillStyle = g;
  ctx.fill();
  ctx.save();
  ctx.clip();
  const glow = ctx.createRadialGradient(r.x + r.w * 0.22, r.y + r.h * 0.1, 0, r.x + r.w * 0.22, r.y + r.h * 0.1, r.w * 0.7);
  glow.addColorStop(0, bg.glow);
  glow.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(r.x, r.y, r.w, r.h);
  ctx.restore();
}

/* ---------- editor chrome ---------- */

const FILL_OPACITY: Record<keyof typeof PALETTE, number> = {
  recording: 0.23,
  keyboard: 0.23,
  annotation: 0.22,
  camera: 0.22,
  system: 0.18,
  microphone: 0.18,
  zoom: 0.24,
  captions: 0.22,
};

/** Client metrics are tuned for a 48 pt track; this timeline's clips are 24 pt tall. */
const NATURAL_TRACK = 48;
const trackScale = (h: number) => Math.min(1, Math.max(0, h / NATURAL_TRACK));
/** TimelineTrackClipStyle.cornerRadius(forClipHeight:) */
const clipRadius = (h: number) => Math.min(13, Math.max(2, 13 * trackScale(h)), h * 0.34);
/** TimelineClipHandleMetrics.visibleWidth(forClipHeight:configuredWidth: 4) */
const handleWidth = (h: number) => Math.max(2, Math.min(4, 4 * trackScale(h)));

/**
 * TimelineClipEdgeBorderShape: a thin crescent hugging one end, grown by
 * `progress`. Like the client, it only spans `2r + width + 2` of the clip.
 */
function edgeHandle(ctx: CanvasRenderingContext2D, x0: number, y: number, w: number, h: number, r: number, edge: "start" | "end", progress: number) {
  const maxThickness = handleWidth(h);
  const thickness = maxThickness * progress;
  if (thickness <= 0.05) return;
  const span = Math.min(w, r * 2 + maxThickness + 2);
  // the inner edge follows the clip outline (overlapping it by half a point so
  // there is no seam); the outer corner uses the client's −3 pt adjustment,
  // scaled to this track height like every other handle metric
  const overlap = Math.min(0.5, thickness, r);
  const inner = Math.max(0, r - overlap);
  const outer = Math.max(0, r + thickness - 3 * trackScale(h) * progress);
  ctx.beginPath();
  if (edge === "start") {
    ctx.roundRect(x0 - thickness, y, span + thickness, h, [outer, 0, 0, outer]);
    ctx.roundRect(x0 + overlap, y, span - overlap, h, [inner, 0, 0, inner]);
  } else {
    const sx = x0 + w - span;
    ctx.roundRect(sx, y, span + thickness, h, [0, outer, outer, 0]);
    ctx.roundRect(sx, y, span - overlap, h, [0, inner, inner, 0]);
  }
  ctx.fill("evenodd");
}

/** CameraZoomWaveformScaleMapping: 1x → 0, 5x → 1, with 2x near the middle. */
function zoomHeight(zoom: number) {
  return Math.max(0, Math.min(1, Math.log1p(2 * (Math.min(5, Math.max(1, zoom)) - 1)) / Math.log1p(8)));
}

function clipShape(
  ui: UI,
  id: string,
  kind: keyof typeof PALETTE,
  start: number,
  end: number,
  lane: number,
  label: string,
  opts: { selected?: boolean; iconName?: string; reveal?: number; onDown?: () => void; zoom?: ZoomClip; zoomFrom?: number } = {},
) {
  const { ctx, t } = ui;
  const p = PALETTE[kind];
  const x0 = timeToX(start, ui.timelineScale, ui.timelineOffset);
  const x1 = timeToX(end, ui.timelineScale, ui.timelineOffset);
  const reveal = opts.reveal ?? 1;
  if (reveal <= 0.001) return;
  const w = Math.max(8, (x1 - x0) * reveal);
  const y = laneY(lane) + 5;
  const h = 24;
  const hovered = ui.hover === id;
  const active = hovered || !!opts.selected;
  const radius = clipRadius(h);

  // background: tinted fill, 1px border (accent when active), soft drop shadow
  ctx.save();
  rr(ctx, x0, y, w, h, radius);
  ctx.shadowColor = "rgba(0,0,0,0.14)";
  ctx.shadowBlur = 5;
  ctx.shadowOffsetY = 2;
  ctx.fillStyle = t.window;
  ctx.fill();
  ctx.restore();
  rr(ctx, x0, y, w, h, radius);
  ctx.globalAlpha = FILL_OPACITY[kind];
  ctx.fillStyle = p.fill;
  ctx.fill();
  ctx.globalAlpha = active ? 0.98 : 0.8;
  ctx.strokeStyle = p.border;
  ctx.lineWidth = 1;
  rr(ctx, x0 + 0.5, y + 0.5, w - 1, h - 1, radius - 0.5);
  ctx.stroke();
  ctx.globalAlpha = 1;

  // zoom clips draw their camera curve: the zoom-in ramp, then the plateau
  if (opts.zoom && w >= 32) {
    const clip = opts.zoom;
    const ramp = horizonOf(clip);
    const anchorX = x0 + Math.min(1, ramp / Math.max(0.001, clip.end - clip.start)) * w;
    const plateauY = Math.max(6, h * 0.14);
    const yOf = (n: number) => y + h - n * (h - plateauY);
    const top = zoomHeight(clip.zoom);
    const from = opts.zoomFrom ?? 1;
    const samples = Math.max(8, Math.min(48, Math.round((anchorX - x0) / 5)));
    ctx.save();
    rr(ctx, x0, y, w, h, radius);
    ctx.clip();
    const curve = new Path2D();
    const area = new Path2D();
    area.moveTo(x0, y + h);
    for (let i = 0; i <= samples; i += 1) {
      const k = i / samples;
      // a joined clip's wave starts from the level its neighbour holds
      const z = from + (clip.zoom - from) * zoomProgress(clip, k * ramp);
      const px = x0 + k * (anchorX - x0);
      const py = yOf(zoomHeight(z));
      if (i === 0) curve.moveTo(px, py);
      else curve.lineTo(px, py);
      area.lineTo(px, py);
    }
    curve.lineTo(x0 + w, yOf(top));
    area.lineTo(x0 + w, yOf(top));
    area.lineTo(x0 + w, y + h);
    area.closePath();
    ctx.fillStyle = t.dark ? "rgba(255,147,0,0.09)" : "rgba(255,147,0,0.14)";
    ctx.fill(area);
    ctx.strokeStyle = t.dark ? "rgba(251,161,7,0.19)" : "rgba(255,147,0,0.23)";
    ctx.lineWidth = 1.25;
    ctx.lineCap = "round";
    ctx.stroke(curve);
    ctx.beginPath();
    ctx.arc(anchorX, yOf(top), 4.5, 0, Math.PI * 2);
    ctx.globalAlpha = 0.48;
    ctx.fillStyle = p.border;
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.strokeStyle = p.border;
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.restore();
  }

  if (w > 40) {
    ctx.save();
    rr(ctx, x0, y, w, h, radius);
    ctx.clip();
    const lw = measure(ctx, label, 11, 600) + (opts.iconName ? 16 : 0);
    const cx = x0 + w / 2;
    let lx = cx - lw / 2;
    if (opts.iconName) {
      icon(ctx, opts.iconName, lx + 6, y + 12, 11, t.text, 1.9);
      lx += 16;
    }
    text(ctx, label, lx, y + 12.5, { size: 11, weight: 600, color: t.text });
    ctx.restore();
  }

  // trim handles: only while hovered or selected, growing out of each end
  const progress = ui.anim.get(`${id}:handles`, active && w >= 32 ? 1 : 0, 0.28);
  if (progress > 0.01) {
    ctx.fillStyle = p.border;
    ctx.globalAlpha = 0.8;
    edgeHandle(ctx, x0, y, w, h, radius, "start", progress);
    edgeHandle(ctx, x0, y, w, h, radius, "end", progress);
    ctx.globalAlpha = 1;
  }
  const hitX = Math.max(0, x0 - 4);
  const hitEnd = Math.min(TL_X1, x0 + w + 4);
  if (hitEnd > hitX) ui.hits.add({ id, x: hitX, y, w: hitEnd - hitX, h, cursor: "pointer", onDown: opts.onDown });
}

const waveCache = new Map<string, number[]>();
function waveform(ui: UI, start: number, end: number, lane: number, color: string, seed: number) {
  const { ctx } = ui;
  const key = `${start}-${end}-${seed}`;
  let bars = waveCache.get(key);
  if (!bars) {
    bars = [];
    for (let x = timeToX(start) + 10; x < timeToX(end) - 8; x += 3.2) {
      const v = Math.abs(Math.sin(x * 0.045 + seed) * Math.cos(x * 0.013 + seed * 1.7)) * (0.35 + 0.65 * Math.abs(Math.sin(x * 0.006 + seed)));
      bars.push(x, v);
    }
    waveCache.set(key, bars);
  }
  const cy = laneY(lane) + 17;
  ctx.strokeStyle = color;
  ctx.globalAlpha = 0.85;
  ctx.lineWidth = 1.6;
  ctx.lineCap = "round";
  ctx.beginPath();
  for (let i = 0; i < bars.length; i += 2) {
    const h = 1 + bars[i + 1] * 7;
    const x = TL_X0 + TL_INSET + (bars[i] - TL_X0 - TL_INSET) * (ui.timelineScale ?? 1) - (ui.timelineOffset ?? 0);
    ctx.moveTo(x, cy - h);
    ctx.lineTo(x, cy + h);
  }
  ctx.stroke();
  ctx.globalAlpha = 1;
}

function fmt(t: number) {
  const s = Math.floor(t);
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}

export type EditorHandlers = {
  scrollControlled?: boolean;
  touch: () => void;
};

export function drawEditor(ui: UI, state: EditorState, h: EditorHandlers, staticOnly = false, inspector = drawInspector, slice?: (name: "header" | "transport" | "ruler") => void) {
  ui = { ...ui, timelineScale: state.timelineScale, timelineOffset: state.timelineOffset };
  const { ctx, t } = ui;
  const c = state.chrome;
  const part = (from: number, to: number) => ease(clamp((c - from) / (to - from)));

  // window shell
  const shellA = part(0, 0.35);
  if (shellA > 0) {
    ctx.save();
    ctx.globalAlpha = shellA;
    rr(ctx, 0, 0, EW, EH, 14);
    drawPanel(ctx,0,0,EW,EH,14,t.window,t.dark?"rgba(0,0,0,0.55)":"rgba(30,30,60,0.18)",60,24);
    ctx.shadowColor = "transparent";
    ctx.strokeStyle = t.dark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.12)";
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.restore();
  }

  ctx.save();
  rr(ctx, 0, 0, EW, EH, 14);
  ctx.clip();

  // ---------------- header ----------------
  const hA = part(0.15, 0.5);
  if (hA > 0) {
    ctx.save();
    ctx.globalAlpha = hA;
    ctx.translate(0, (1 - hA) * -14);
    if (slice) slice("header"); else {
    ctx.fillStyle = t.panel;
    ctx.fillRect(0, 0, EW, HEADER);
    ctx.fillStyle = t.separator;
    ctx.fillRect(0, HEADER - 1, EW, 1);
    ["#ff5f57", "#febc2e", "#28c840"].forEach((col, i) => {
      ctx.beginPath();
      ctx.arc(20 + i * 20, 20, 6, 0, Math.PI * 2);
      ctx.fillStyle = col;
      ctx.fill();
    });
    iconButton(ui, "hdr-undo", 98, 20, "undo-2", { box: 26 });
    iconButton(ui, "hdr-redo", 126, 20, "redo-2", { box: 26 });
    text(ctx, "Product walkthrough", 148, 20.5, { size: 12, weight: 500, color: t.text });
    const tw = measure(ctx, "Product walkthrough", 12, 500);
    text(ctx, `${fmt(DURATION)} · 2,880×1,800`, 156 + tw, 20.5, { size: 12, color: t.text2 });
    // centre
    icon(ctx, "proportions", 650, 20, 14, t.text2);
    text(ctx, "Auto", 663, 20.5, { size: 12, weight: 500, color: t.text });
    icon(ctx, "crop", 712, 20, 14, t.text2);
    text(ctx, "Crop", 725, 20.5, { size: 12, weight: 500, color: t.text });
    // right
    icon(ctx, "sliders-horizontal", 1262, 20, 14, t.text2);
    text(ctx, "Presets", 1275, 20.5, { size: 12, weight: 500, color: t.text });
    const exH = ui.hover === "hdr-export";
    rr(ctx, 1334, 8, 94, 24, 6);
    ctx.fillStyle = exH ? shade(t.accent, -0.08) : t.accent;
    ctx.fill();
    icon(ctx, "share", 1352, 20, 14, "#fff");
    text(ctx, "Export", 1366, 20.5, { size: 12, weight: 600, color: "#fff" });
    ui.hits.add({ id: "hdr-export", x: 1334, y: 8, w: 94, h: 24, cursor: "pointer" });
    }
    ctx.restore();
  }

  // ---------------- preview background ----------------
  const pA = part(0, 0.3);
  if (pA > 0) {
    ctx.save();
    ctx.globalAlpha = pA;
    ctx.fillStyle = t.window;
    ctx.fillRect(PREVIEW.x, PREVIEW.y, PREVIEW.w, PREVIEW.h);
    ctx.restore();
  }

  // ---------------- inspector ----------------
  const iA = part(0.25, 0.65);
  if (iA > 0) {
    ctx.save();
    ctx.globalAlpha = iA;
    ctx.translate((1 - iA) * 60, 0);
    ctx.fillStyle = t.panel;
    ctx.fillRect(INS_X, HEADER, EW - INS_X, PREVIEW.h);
    ctx.fillStyle = t.separator;
    ctx.fillRect(INS_X, HEADER, 1, PREVIEW.h);
    if (!staticOnly) inspector(ui, state, h);
    ctx.restore();
  }

  // ---------------- transport ----------------
  const tA = part(0.35, 0.75);
  if (tA > 0) {
    ctx.save();
    ctx.globalAlpha = tA;
    ctx.translate(0, (1 - tA) * 20);
    if (slice) slice("transport"); else {
    ctx.fillStyle = t.window;
    ctx.fillRect(0, TRANSPORT_Y, EW, 56);
    ctx.fillStyle = t.separator;
    ctx.fillRect(0, TRANSPORT_Y, EW, 1);
    ctx.fillRect(0, TIMELINE_Y, EW, 1);
    const cy = TRANSPORT_Y + 28;
    if (!staticOnly) text(ctx, `${fmt(state.time)} / ${fmt(DURATION)}`, 18, cy + 0.5, { size: 12, weight: 600, color: t.accent, family: MONO });
    rr(ctx, 122, cy - 13, 82, 26, 6);
    ctx.fillStyle = t.control;
    ctx.fill();
    icon(ctx, "gauge", 140, cy, 13, t.text2);
    text(ctx, "×1", 154, cy + 0.5, { size: 12, weight: 600, color: t.text });
    icon(ctx, "chevron-down", 188, cy, 11, t.text2, 2.2);
    // centre transport
    const btn = (id: string, cx: number, name: string, size: number, r: number, onDown?: () => void) => {
      const disabled = !!h.scrollControlled;
      const hov = !disabled && ui.hover === id;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fillStyle = hov ? t.controlHover : r > 17 ? t.control : "transparent";
      ctx.fill();
      ctx.strokeStyle = t.separator;
      ctx.lineWidth = 1;
      ctx.stroke();
      if (!staticOnly || id !== "tp-play") icon(ctx, name, cx + (name === "play" ? 1 : 0), cy, size, disabled ? t.text3 : t.text, 2);
      if (!disabled) ui.hits.add({ id, x: cx - r, y: cy - r, w: r * 2, h: r * 2, cursor: "pointer", onDown });
    };
    btn("tp-back", 674, "rotate-ccw", 14, 16, () => {
      state.time = Math.max(0, state.time - 5);
      h.touch();
    });
    btn("tp-play", 720, state.playing ? "pause" : "play", 16, 19, () => {
      state.playing = !state.playing;
      h.touch();
    });
    btn("tp-fwd", 766, "rotate-cw", 14, 16, () => {
      state.time = Math.min(DURATION, state.time + 5);
      h.touch();
    });
    // right side
    icon(ctx, "scissors", 1010, cy, 14, t.text2);
    if (!staticOnly) drawTransportControls(ui, state, h);
    }
    ctx.restore();
  }

  // ---------------- timeline ----------------
  const lA = part(0.45, 0.85);
  if (lA > 0) {
    ctx.save();
    ctx.globalAlpha = lA;
    ctx.fillStyle = t.window;
    ctx.fillRect(0, TIMELINE_Y + 1, EW, EH - TIMELINE_Y);
    if (slice) slice("ruler"); else {
    // ruler
    if (!ui.timelineLabelsHidden) iconButton(ui, "tl-layout", 36, TIMELINE_Y + 15, "layout-grid", { box: 24, size: 13 });
    ctx.strokeStyle = t.text3;
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let s = 0; s <= DURATION; s += 0.5) {
      const x = Math.round(timeToX(s, state.timelineScale, state.timelineOffset)) + 0.5;
      if (x > TL_X1) break;
      if (x < 0) continue;
      const major = s % 2 === 0;
      ctx.moveTo(x, TIMELINE_Y + RULER_H);
      ctx.lineTo(x, TIMELINE_Y + RULER_H - (major ? 7 : 3));
    }
    ctx.stroke();
    for (let s = 0; s <= DURATION; s += 2) {
      if (timeToX(s, state.timelineScale, state.timelineOffset) > TL_X1 - 28) break;
      if (timeToX(s, state.timelineScale, state.timelineOffset) < 0) continue;
      text(ctx, fmt(s), timeToX(s, state.timelineScale, state.timelineOffset) + 4, TIMELINE_Y + 12, { size: 10, color: t.text3, family: MONO });
    }
    }
    ctx.globalAlpha = lA;

    // scrub surface
    const scrub = (p: { x: number }) => {
      state.time = xToTime(p.x, state.timelineScale, state.timelineOffset);
      state.playing = false;
      h.touch();
    };
    if (!h.scrollControlled) ui.hits.add({ id: "tl-scrub", x: TL_X0 - 8, y: TIMELINE_Y, w: TL_X1 - TL_X0 + 16, h: EH - TIMELINE_Y, cursor: "text", onDown: scrub, onDrag: scrub });

    ctx.save(); ctx.beginPath(); ctx.rect(0, TIMELINE_Y + RULER_H, EW, EH - TIMELINE_Y); ctx.clip();
    const lane = (i: number) => ease(clamp((c - 0.5 - i * 0.05) / 0.3));
    const sel = state.selection;
    clipShape(ui, "clip-rec", "recording", 0, DURATION, 0, "Recording · 1.00x", { iconName: "monitor", reveal: lane(0) });
    KEY_CLIPS.forEach(([a, b, label], i) => {
      const short = label.length > 16 ? `${label.slice(0, 15)}…` : label;
      clipShape(ui, `clip-key-${i}`, "keyboard", a, b, 1, short, {
        iconName: i === 0 ? "keyboard" : undefined,
        reveal: lane(1),
        onDown: () => {
          state.selection = { kind: "none" };
          state.tab = 6;
          h.touch();
        },
      });
    });
    if (!staticOnly) drawCameraLane(ui, state, h, lane(2));
    clipShape(ui, "clip-sys", "system", 0, DURATION, 3, "", { reveal: lane(3) });
    if (lane(3) > 0.99) waveform(ui, 0, DURATION, 3, PALETTE.system.border, 1.3);
    clipShape(ui, "clip-mic", "microphone", 0.8, 21.4, 4, "", { reveal: lane(4) });
    if (lane(4) > 0.99) waveform(ui, 0.8, 21.4, 4, PALETTE.microphone.border, 4.1);
    if (!staticOnly) drawZoomLane(ui, state, h, lane(5));
    if (!staticOnly) drawCaptionLane(ui, state, h, lane(6));

    ctx.restore();
    if (!staticOnly) drawPlayhead(ui, state);
    ctx.restore();
  }

  ctx.restore();
}


/** Offset is expressed in editor units, independent of Retina or the page camera. */
export const timelineMaxOffset = (state: EditorState) => TL_CONTENT_WIDTH * Math.max(0, state.timelineScale - 1);
export function followTimeline(state: EditorState, follow: boolean) {
  const span = TL_X1 - TL_X0;
  state.timelineOffset = clamp(state.timelineOffset, 0, timelineMaxOffset(state));
  if (!follow) return;
  const x = timeToX(state.time, state.timelineScale, state.timelineOffset) - TL_X0;
  if (x > span * 0.8) state.timelineOffset += x - span * 0.8;
  else if (x < span * 0.05) state.timelineOffset += x - span * 0.05;
  state.timelineOffset = clamp(state.timelineOffset, 0, timelineMaxOffset(state));
}
const timelineGrabs = new WeakMap<EditorState, number>();
function drawTimelineScrollbar(ui: UI, state: EditorState, h: EditorHandlers) {
  const max = timelineMaxOffset(state);
  if (!max) return;
  const span = TL_X1 - TL_X0, width = span * span / (span + max);
  const x = TL_X0 + state.timelineOffset / max * (span - width), y = EH - 12;
  rr(ui.ctx, TL_X0, y, span, 6, 3); ui.ctx.fillStyle = ui.t.fillStrong; ui.ctx.fill();
  rr(ui.ctx, x, y, width, 6, 3); ui.ctx.fillStyle = ui.hover === "tl-scrollbar" || ui.active === "tl-scrollbar" ? ui.t.text2 : ui.t.text3; ui.ctx.fill();
  const move = (p: { x: number }) => {
    state.timelineOffset = clamp((p.x - TL_X0 - (timelineGrabs.get(state) ?? width / 2)) / (span - width)) * max;
    h.touch();
  };
  ui.hits.add({ id: "tl-scrollbar", x: TL_X0, y: y - 5, w: span, h: 16, cursor: "ew-resize",
    onDown: p => { timelineGrabs.set(state, p.x >= x && p.x <= x + width ? p.x - x : width / 2); move(p); },
    onDrag: move, onUp: () => { timelineGrabs.delete(state); },
  });
}

/** Live controls share the inspector slider geometry and hit testing. */
function drawTransportControls(ui: UI, state: EditorState, h: EditorHandlers) {
  const cy = TRANSPORT_Y + 28;
  const green = "#30d158";
  iconButton(ui, "transport-mute", 1048, cy, state.volume > 0 ? "volume-2" : "volume-x", {
    box: 24, size: 14, color: state.volume > 0 ? green : ui.t.text3,
    onDown: () => {
      state.volume = state.volume > 0 ? 0 : 0.75;
      setCameraVolume(state.volume);
      h.touch();
    },
  });
  slider({ ...ui, t: { ...ui.t, accent: green } }, "transport-volume", 1064, cy - 12, 94, state.volume, v => {
    state.volume = v;
    setCameraVolume(v);
    h.touch();
  }, `${Math.round(state.volume * 100)}%`);
  iconButton(ui, "transport-scale-reset", 1186, cy, "zoom-out", {
    box: 24, size: 14,
    onDown: () => { state.timelineScale = 1; state.timelineOffset = 0; h.touch(); },
  });
  slider(ui, "transport-scale", 1202, cy - 12, 128, state.timelineScale - 1, v => {
    state.timelineScale = Math.round((1 + v) * 100) / 100;
    state.timelineOffset = clamp(state.timelineOffset, 0, timelineMaxOffset(state));
    h.touch();
  }, `${Math.round(state.timelineScale * 100)}%`);
  text(ui.ctx, `${Math.round(state.timelineScale * 100)}%`, 1422, cy + 0.5, { size: 12, color: ui.t.text2, align: "right" });
}

/** Parts whose pixels actually change with playback, drawn above the cached shell. */
export function drawEditorDynamic(ui: UI, state: EditorState, h: EditorHandlers, inspector = drawInspector) {
  ui = { ...ui, timelineScale: state.timelineScale, timelineOffset: state.timelineOffset };
  const { ctx, t } = ui;
  const part = (from: number, to: number) => ease(clamp((state.chrome - from) / (to - from)));
  ctx.save();
  rr(ctx, 0, 0, EW, EH, 14);
  ctx.clip();
  const iA = part(0.25, 0.65);
  if (iA > 0) {
    ctx.save(); ctx.globalAlpha = iA; ctx.translate((1 - iA) * 60, 0);
    ctx.beginPath(); ctx.rect(INS_X, HEADER, EW - INS_X, PREVIEW.h); ctx.clip();
    inspector(ui, state, h);
    ctx.restore();
  }
  const tA = part(0.35, 0.75);
  if (tA > 0) {
    ctx.save(); ctx.globalAlpha = tA; ctx.translate(0, (1 - tA) * 20);
    drawTransportControls(ui, state, h);
    icon(ctx, state.playing ? "pause" : "play", state.playing ? 720 : 721, TRANSPORT_Y + 28, 16, h.scrollControlled ? t.text3 : t.text, 2);
    text(ctx, `${fmt(state.time)} / ${fmt(DURATION)}`, 18, TRANSPORT_Y + 28.5, { size: 12, weight: 600, color: t.accent, family: MONO });
    ctx.restore();
  }
  const lA = part(0.45, 0.85);
  if (lA > 0) {
    ctx.save(); ctx.globalAlpha = lA;
    const lane = (i: number) => ease(clamp((state.chrome - 0.5 - i * 0.05) / 0.3));
    ctx.save(); ctx.beginPath(); ctx.rect(0, TIMELINE_Y + RULER_H, EW, EH - TIMELINE_Y); ctx.clip();
    drawCameraLane(ui, state, h, lane(2)); drawZoomLane(ui, state, h, lane(5));
    drawCaptionLane(ui, state, h, lane(6)); ctx.restore(); drawPlayhead(ui, state);
    drawTimelineScrollbar(ui, state, h);
    if (!ui.timelineLabelsHidden) drawTimelineLabels(ui, state);
    ctx.restore();
  }
  ctx.restore();
}

/** Fixed lane titles are composited above the scrolling, blurred tracks. */
export function drawTimelineLabels(ui: UI, state: EditorState) {
  const {ctx, t} = ui;
  ctx.save();
  icon(ui.ctx, "layout-grid", 36, TIMELINE_Y + 15, 13, t.text2);
  LANES.forEach((label, i) => {
    ctx.globalAlpha *= i === 6 ? 0.35 + 0.65 * state.captionsShown : 1;
    text(ctx, label, 16, laneY(i) + 17.5, { size: 11, color: t.text2 });
  });
  ctx.restore();
}

function drawCameraLane(ui: UI, state: EditorState, h: EditorHandlers, reveal: number) {
  const cam = state.camera;
  cameraClips(cam, DURATION).forEach((clip, i) => {
    const label = clip.removes ? (cam.remove ? "Background removed" : "Camera") : clip.side ? "Camera · Left" : "Camera · Right";
    clipShape(ui, `clip-cam-${i}`, "camera", clip.start, clip.end, 2, label, {
      iconName: clip.removes && cam.remove ? "user-round-x" : "video",
      reveal,
      onDown: () => {
        state.selection = { kind: "none" };
        state.tab = 5;
        if (state.time < clip.start || state.time >= clip.end) state.time = clip.start + 0.4;
        h.touch();
      },
    });
  });
}

function drawZoomLane(ui: UI, state: EditorState, h: EditorHandlers, reveal: number) {
  const sel = state.selection;
    state.zoomClips.forEach((clip, i) => {
      const label = clip.mode === 1 ? `3D · ${Math.round(lerp(24, 120, clip.focal))} mm · f/2.8` : clip.mode === 2 ? `Lens · ${clip.zoom.toFixed(1)}x` : `${clip.zoom.toFixed(1)}x`;
      clipShape(ui, `clip-zoom-${i}`, "zoom", clip.start, clip.end, 5, label, {
        iconName: clip.mode === 2 ? "circle" : "zoom-in",
        selected: sel.kind === "zoom" && sel.index === i,
        reveal: reveal,
        zoom: clip,
        zoomFrom: zoomEntryLevel(state.zoomClips, clip),
        onDown: () => {
          state.selection = { kind: "zoom", index: i };
          state.time = Math.min(clip.end - 0.4, Math.max(clip.start + 0.8, state.time));
          h.touch();
        },
      });
    });
}

function drawCaptionLane(ui: UI, state: EditorState, h: EditorHandlers, reveal: number) {
  const sel = state.selection;
    const capReveal = state.captionsShown * reveal;
    const capClips: Array<[number, number, string]> = [
      [9.4, 11.0, ""],
      [11.1, 12.6, ""],
      [12.7, 14.3, ""],
    ];
    const tokens = captionTokens(state.captionText);
    const third = Math.ceil(tokens.length / 3);
    const joiner = /\s/.test(state.captionText) ? " " : "";
    capClips.forEach(([a, b], i) => {
      const words = tokens.slice(i * third, (i + 1) * third).join(joiner);
      clipShape(ui, `clip-cap-${i}`, "captions", a, b, 6, words.length > 14 ? `${words.slice(0, 13)}…` : words, {
        selected: sel.kind === "captions",
        reveal: ease(clamp(capReveal * 3 - i)),
        onDown: () => {
          state.selection = { kind: "captions" };
          h.touch();
        },
      });
    });

}

function drawPlayhead(ui: UI, state: EditorState) {
  const { ctx, t } = ui;
  const px = timeToX(state.time, state.timelineScale, state.timelineOffset);
  if (px < TL_X0 || px > TL_X1) return;
  ctx.fillStyle = t.accent;
  ctx.fillRect(Math.round(px), TIMELINE_Y + 6, 1, EH - TIMELINE_Y - 6);
  rr(ctx, px - 22, TIMELINE_Y + 4, 44, 18, 9);
  ctx.fill();
  text(ctx, fmt(state.time), px, TIMELINE_Y + 13.5, { size: 10, weight: 600, color: "#fff", align: "center", family: MONO });
}

function shade(hex: string, amount: number) {
  if (!hex.startsWith("#")) return hex;
  const n = parseInt(hex.slice(1), 16);
  const r = Math.max(0, Math.min(255, ((n >> 16) & 255) * (1 + amount)));
  const g = Math.max(0, Math.min(255, ((n >> 8) & 255) * (1 + amount)));
  const b = Math.max(0, Math.min(255, (n & 255) * (1 + amount)));
  return `rgb(${r | 0},${g | 0},${b | 0})`;
}

/* ---------- inspector ---------- */

const IX = INS_X + 14;
const IR = EW - 14;
const SL_X = EW - 14 - 164;
const SL_W = 164;

export function drawInspector(ui: UI, state: EditorState, h: EditorHandlers, staticOnly = false) {
  const { ctx, t } = ui;
  const sel = state.selection;
  const head = HEADER + 26;

  if (sel.kind === "none") {
    const tabs: Array<[string, Tab]> = [
      ["app-window", 0],
      ["keyboard", 6],
      ["sparkles", 1],
      ["mouse-pointer-2", 2],
      ["video", 5],
      ["captions", 3],
      ["music", 4],
    ];
    tabs.forEach(([name, tab], i) => {
      iconButton(ui, `tab-${tab}`, INS_X + 170 + (i - (tabs.length - 1) / 2) * 44, head, name, {
        size: 16,
        box: 32,
        active: state.tab === tab,
        onDown: () => {
          state.tab = tab;
          h.touch();
        },
      });
    });
  } else {
    const title = sel.kind === "zoom" ? "Zoom" : "Captions";
    icon(ctx, sel.kind === "zoom" ? "zoom-in" : "captions", IX + 8, head, 16, t.accent, 1.9);
    text(ctx, title, IX + 26, head + 0.5, { size: 13, weight: 600, color: t.text });
    iconButton(ui, "ins-close", IR - 10, head, "x", {
      box: 24,
      size: 14,
      onDown: () => {
        state.selection = { kind: "none" };
        h.touch();
      },
    });
  }
  ctx.save();
  ctx.beginPath();
  ctx.rect(INS_X, HEADER + 53, EW - INS_X, PREVIEW.h - 53);
  ctx.clip();
  if (sel.kind === "zoom") zoomPanel(ui, state, sel.index, h, staticOnly);
  else if (sel.kind === "captions" || state.tab === 3) captionsPanel(ui, state, h);
  else if (state.tab === 0) backgroundPanel(ui, state, h);
  else if (state.tab === 6) keyboardPanel(ui, state, h);
  else if (state.tab === 1) effectsPanel(ui, state, h);
  else if (state.tab === 2) cursorPanel(ui, state, h);
  else if (state.tab === 5) cameraPanel(ui, state, h);
  else musicPanel(ui, state, h);
  ctx.restore();
}

function row(ui: UI, label: string, y: number) {
  rowLabel(ui, label, IX, y);
}

const BG_TYPES: Array<{ label: string; kind?: FrameBackground["kind"] }> = [
  { label: "Wallpaper" },
  { label: "Gradient", kind: "gradient" },
  { label: "Mesh Gradient", kind: "mesh" },
  { label: "Color", kind: "color" },
  { label: "Image or Video" },
];
const COLOR_CYCLE = ["#F5F5F7", "#FFFFFF", "#1C1C1E", "#000000", "#E9E4DA", "#2B2F3A"];

/** BackgroundPresetGridLayout: adaptive 34–44 pt columns, 8 pt spacing, 1:1 items. */
function presetGrid(ui: UI, id: string, y: number, count: number, selected: number, paint: (x: number, y: number, s: number, i: number) => void, pick: (i: number) => void) {
  const { ctx, t } = ui;
  const width = IR - IX;
  const gap = 8;
  const cols = Math.max(1, Math.floor((width + gap) / (34 + gap)));
  const size = Math.min(44, (width - gap * (cols - 1)) / cols);
  for (let i = 0; i < count; i += 1) {
    const x = IX + (i % cols) * (size + gap);
    const yy = y + Math.floor(i / cols) * (size + gap);
    ctx.save();
    rr(ctx, x, yy, size, size, 8);
    ctx.clip();
    paint(x, yy, size, i);
    ctx.restore();
    rr(ctx, x + 0.5, yy + 0.5, size - 1, size - 1, 7.5);
    ctx.strokeStyle = t.dark ? "rgba(255,255,255,0.14)" : "rgba(0,0,0,0.12)";
    ctx.lineWidth = 1;
    ctx.stroke();
    const hid = `${id}-${i}`;
    if (selected === i || ui.hover === hid) {
      rr(ctx, x - 3, yy - 3, size + 6, size + 6, 10);
      ctx.strokeStyle = selected === i ? t.accent : t.separator;
      ctx.lineWidth = 2;
      ctx.stroke();
    }
    ui.hits.add({ id: hid, x, y: yy, w: size, h: size, cursor: "pointer", onDown: () => pick(i) });
  }
  return y + Math.ceil(count / cols) * (size + gap) - gap;
}

function backgroundPanel(ui: UI, state: EditorState, h: EditorHandlers) {
  const { ctx, t } = ui;
  const bg = state.background.frame;
  let y = HEADER + 60;
  sectionTitle(ui, "Background", IX, y);
  y += 34;
  row(ui, "Type", y);
  const typeLabel = BG_TYPES.find((b) => b.kind === bg.kind)?.label ?? "Gradient";
  const ddX = IR - 150;
  const ddY = y - 13;
  dropdown(ui, "bg-type", ddX, ddY, 150, typeLabel);
  ui.hits.add({
    id: "bg-type",
    x: ddX,
    y: ddY,
    w: 150,
    h: 26,
    cursor: "pointer",
    onDown: () => {
      state.bgMenuOpen = !state.bgMenuOpen;
      h.touch();
    },
  });
  y += 30;
  if (bg.kind !== "color") {
    text(ctx, "Preset", IX, y, { size: 12, weight: 600, color: t.text2 });
    y += 14;
  }
  if (bg.kind === "gradient") {
    y = presetGrid(ui, "bg-g", y, GRADIENT_PRESETS.length, bg.gradient, (x, yy, s, i) => {
      ctx.fillStyle = gradientFill(ctx, { x, y: yy, w: s, h: s }, GRADIENT_PRESETS[i]);
      ctx.fillRect(x, yy, s, s);
    }, (i) => {
      bg.gradient = i;
      h.touch();
    });
  } else if (bg.kind === "mesh") {
    y = presetGrid(ui, "bg-m", y, MESH_PALETTES.length, bg.mesh, (x, yy, s, i) => {
      ctx.drawImage(meshTexture(i), x, yy, s, s);
    }, (i) => {
      bg.mesh = i;
      h.touch();
    });
  } else {
    // FrameColorPicker / ColorPreviewButton: a 126 pt swatch + hex button
    y -= 14;
    row(ui, "Color", y + 14);
    const bx = IR - 126;
    const hov = ui.hover === "bg-color";
    rr(ctx, bx, y, 126, 28, 8);
    ctx.fillStyle = hov ? t.controlHover : t.control;
    ctx.fill();
    rr(ctx, bx + 5, y + 5, 28, 18, 6);
    ctx.fillStyle = bg.color;
    ctx.fill();
    ctx.strokeStyle = t.hairline;
    ctx.stroke();
    text(ctx, bg.color.toUpperCase(), bx + 42, y + 14.5, { size: 12, weight: 500, color: t.text, family: MONO });
    ui.hits.add({
      id: "bg-color",
      x: bx,
      y,
      w: 126,
      h: 28,
      cursor: "pointer",
      onDown: () => {
        bg.color = COLOR_CYCLE[(COLOR_CYCLE.indexOf(bg.color) + 1) % COLOR_CYCLE.length];
        h.touch();
      },
    });
    y += 28;
  }
  y += 12;
  const sliderRow = (id: string, label: string, key: "padding" | "radius", fmtV: (v: number) => string) => {
    row(ui, label, y + 12);
    slider(ui, id, SL_X, y, SL_W, state.background[key], (v) => {
      state.background[key] = v;
      h.touch();
    }, fmtV(state.background[key]));
    y += 30;
  };
  sliderRow("bg-pad", "Padding", "padding", (v) => `${Math.round(v * 100)}`);
  sliderRow("bg-rad", "Corner Radius", "radius", (v) => `${Math.round(4 + v * 22)}`);
  // Shadow: the client's two pads (FrameShadowControls), the same as the
  // screenshot inspector's. They are drawn live by drawInspectorDynamic.
  y += 6;
  text(ctx, "Shadow", IX, y + 6, { size: 12, weight: 600, color: t.text2 });
  y += 22;
  const gap = 10;
  const size = (IR - IX - gap) / 2;
  (["angle", "strength"] as const).forEach((style, i) => {
    const x = i === 0 ? IX : IR - size;
    text(ctx, style === "angle" ? "Angle" : "Strength", x, y, { size: 11, color: t.text2 });
    BG_PADS[style] = { x, y: y + 12, size };
    const value = padValueText(style, style === "angle" ? state.background.shadowAngle : state.background.shadowStrength);
    text(ctx, value, x + size / 2, y + 12 + size + 12, { size: 9.5, weight: 500, color: t.text3, align: "center" });
  });

  // ---- type menu (drawn last so it sits on top) ----
  if (state.bgMenuOpen) {
    // clicking anywhere else closes it
    ui.hits.add({ id: "bg-menu-dismiss", x: 0, y: 0, w: EW, h: EH, onDown: () => { state.bgMenuOpen = false; h.touch(); } });
    const mw = 220;
    const mx = IR - mw;
    const my = ddY + 30;
    const item = 28;
    const mh = BG_TYPES.length * item + 8;
    ctx.save();
    rr(ctx, mx, my, mw, mh, 8);
    ctx.shadowColor = t.dark ? "rgba(0,0,0,0.5)" : "rgba(0,0,0,0.16)";
    ctx.shadowBlur = 20;
    ctx.shadowOffsetY = 8;
    ctx.fillStyle = t.dark ? "#2c2c2e" : "#ffffff";
    ctx.fill();
    ctx.restore();
    rr(ctx, mx + 0.5, my + 0.5, mw - 1, mh - 1, 8);
    ctx.strokeStyle = t.separator;
    ctx.lineWidth = 1;
    ctx.stroke();
    BG_TYPES.forEach((type, i) => {
      const iy = my + 4 + i * item;
      const id = `bg-type-${i}`;
      const enabled = !!type.kind;
      if (enabled && ui.hover === id) {
        rr(ctx, mx + 4, iy, mw - 8, item, 6);
        ctx.fillStyle = t.accent;
        ctx.fill();
      }
      const active = enabled && ui.hover === id;
      if (type.kind === bg.kind) icon(ctx, "check", mx + 18, iy + item / 2, 12, active ? "#fff" : t.text, 2.2);
      text(ctx, type.label, mx + 32, iy + item / 2 + 0.5, { size: 12, weight: 500, color: active ? "#fff" : enabled ? t.text : t.text3 });
      if (!enabled) text(ctx, "In the app", mx + mw - 12, iy + item / 2 + 0.5, { size: 11, color: t.text3, align: "right" });
      ui.hits.add({
        id,
        x: mx + 4,
        y: iy,
        w: mw - 8,
        h: item,
        cursor: enabled ? "pointer" : "not-allowed",
        onDown: () => {
          if (!type.kind) return;
          bg.kind = type.kind;
          state.bgMenuOpen = false;
          h.touch();
        },
      });
    });
  }
}

function zoomPanel(ui: UI, state: EditorState, index: number, h: EditorHandlers, staticOnly = false) {
  const { ctx, t } = ui;
  const clip = state.zoomClips[index];
  let y = HEADER + 76;
  row(ui, "Enable", y);
  toggle(ui, "z-en", IR - 40, y - 9, clip.enabled, (v) => {
    clip.enabled = v;
    h.touch();
  });
  y += 34;
  sectionTitle(ui, "Clip Settings", IX, y);
  y += 32;
  row(ui, "Lens Mode", y);
  segmented(ui, "z-mode", IR, y - 12, ["2D", "3D", "Lens"], clip.mode, (i) => {
    clip.mode = i as LensMode;
    h.touch();
  });
  y += 34;
  row(ui, "Zoom Mode", y);
  segmented(ui, "z-follow", IR, y - 12, ["Auto", "Manual"], clip.manual ? 1 : 0, (i) => {
    clip.manual = i === 1;
    h.touch();
  });
  y += 22;
  row(ui, "Move Speed", y + 12);
  slider(ui, "z-speed", SL_X, y, SL_W, clip.moveSpeed, (v) => {
    clip.moveSpeed = v;
    h.touch();
  }, `${Math.round(clip.moveSpeed * 100)}%`);
  y += 34;
  row(ui, clip.mode === 2 ? "Magnification" : "Zoom", y + 12);
  slider(ui, "z-zoom", SL_X, y, SL_W, (clip.zoom - 1) / 4, (v) => {
    clip.zoom = 1 + v * 4;
    h.touch();
  }, `${clip.zoom.toFixed(2)}x`);
  y += 40;

  if (clip.mode === 0) {
    if (!staticOnly) drawZoomMap(ui, state, index, h, y);
  } else if (clip.mode === 1) {
    row(ui, "Focal Length", y + 12);
    slider(ui, "z-focal", SL_X, y, SL_W, clip.focal, (v) => {
      clip.focal = v;
      h.touch();
    }, `${Math.round(lerp(24, 120, clip.focal))} mm`);
    y += 34;
    row(ui, "Aperture", y + 12);
    slider(ui, "z-ap", SL_X, y, SL_W, 0.28, () => h.touch(), "f/2.8");
    y += 40;
    // orbit pad
    const mw = IR - IX;
    rr(ctx, IX, y, mw, 110, 10);
    ctx.fillStyle = t.control;
    ctx.fill();
    ctx.strokeStyle = t.hairline;
    ctx.beginPath();
    for (let i = 1; i < 6; i += 1) {
      ctx.moveTo(IX + (mw / 6) * i, y);
      ctx.lineTo(IX + (mw / 6) * i, y + 110);
    }
    for (let i = 1; i < 3; i += 1) {
      ctx.moveTo(IX, y + (110 / 3) * i);
      ctx.lineTo(IX + mw, y + (110 / 3) * i);
    }
    ctx.stroke();
    if (!staticOnly) drawOrbitDot(ui, state, index, y);
    text(ctx, "Yaw", IX + 10, y + 96, { size: 11, color: t.text3 });
    text(ctx, "Pitch", IR - 10, y + 96, { size: 11, color: t.text3, align: "right" });
  } else {
    row(ui, "Lens Size", y + 12);
    slider(ui, "z-lens", SL_X, y, SL_W, clip.lensSize, (v) => {
      clip.lensSize = v;
      h.touch();
    }, `${Math.round(clip.lensSize * 100)}%`);
    y += 34;
    row(ui, "Edge Refraction", y + 12);
    toggle(ui, "z-refr", IR - 40, y + 3, true, () => h.touch());
  }
}


const ZOOM_BODY_Y = HEADER + 76 + 34 + 32 + 34 + 22 + 34 + 40;

/** Created on first use: it owns canvases, so it must not exist during server rendering. */
let backgroundPads: ShadowPads | null = null;

export function drawInspectorDynamic(ui: UI, state: EditorState, h: EditorHandlers) {
  if (state.selection.kind !== "zoom") {
    // the Background panel's shadow pads, drawn live over the cached inspector
    if (state.selection.kind !== "captions" && state.tab === 0 && BG_PADS.angle.size > 0) {
      const m = ui.ctx.getTransform();
      const scale = Math.max(1, Math.ceil(Math.hypot(m.a, m.b) * 2) / 2);
      backgroundPads ??= new ShadowPads();
      backgroundPads.draw(
        ui.ctx, ui.t, ui.hits, BG_PADS,
        { angle: state.background.shadowAngle, strength: state.background.shadowStrength },
        (style, p) => {
          const q = { x: Math.round(p.x * 200) / 200, y: Math.round(p.y * 200) / 200 };
          if (style === "angle") state.background.shadowAngle = q;
          else state.background.shadowStrength = q;
        },
        h.touch, scale, "bg-shadow",
      );
    }
    return;
  }
  const index = state.selection.index, clip = state.zoomClips[index];
  if (clip.mode === 0) drawZoomMap(ui, state, index, h, ZOOM_BODY_Y);
  else if (clip.mode === 1) drawOrbitDot(ui, state, index, ZOOM_BODY_Y + 74);
}

function drawZoomMap(ui: UI, state: EditorState, index: number, h: EditorHandlers, y: number) {
  const { ctx, t } = ui;
  const clip = state.zoomClips[index];
    // mini map with the zoom region (drag to move focus in Manual mode)
    const mw = IR - IX;
    const mh = (mw * CH) / CW;
    rr(ctx, IX, y, mw, mh, 8);
    ctx.fillStyle = t.control;
    ctx.fill();
    ctx.save();
    rr(ctx, IX, y, mw, mh, 8);
    ctx.clip();
    ctx.translate(IX, y);
    ctx.scale(mw / CW, mw / CW);
    ctx.globalAlpha = 0.9;
    drawRecordedApp(ctx, state.time);
    ctx.restore();
    const rw = mw / clip.zoom;
    const rh = mh / clip.zoom;
    const fx = IX + (clip.focus.x / CW) * mw;
    const fy = y + (clip.focus.y / CH) * mh;
    const rx = Math.max(IX, Math.min(IX + mw - rw, fx - rw / 2));
    const ry = Math.max(y, Math.min(y + mh - rh, fy - rh / 2));
    ctx.save();
    ctx.fillStyle = "rgba(0,0,0,0.35)";
    ctx.beginPath();
    ctx.rect(IX, y, mw, mh);
    ctx.rect(rx + rw, ry, -rw, rh);
    ctx.fill("evenodd");
    rr(ctx, rx, ry, rw, rh, 5);
    ctx.strokeStyle = PALETTE.zoom.border;
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();
    const my = y;
    const move = (p: { x: number; y: number }) => {
      clip.manual = true;
      clip.focus = {
        x: Math.max(0, Math.min(CW, ((p.x - IX) / mw) * CW)),
        y: Math.max(0, Math.min(CH, ((p.y - my) / mh) * CH)),
      };
      h.touch();
    };
    ui.hits.add({ id: "z-map", x: IX, y, w: mw, h: mh, cursor: "move", onDown: move, onDrag: move });

}
function drawOrbitDot(ui: UI, state: EditorState, index: number, y: number) {
  const { ctx, t } = ui, clip = state.zoomClips[index];
  const mw = IR - IX;
    const z = activeZoom(state, state.time);
    const orbit = z && z.index === index ? clamp((state.time - clip.start) / (clip.end - clip.start)) : 0.5;
    const dotX = IX + mw * lerp(0.2, 0.8, orbit);
    ctx.beginPath();
    ctx.arc(dotX, y + 46, 7, 0, Math.PI * 2);
    ctx.fillStyle = t.accent;
    ctx.fill();
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 2;
    ctx.stroke();

}

function captionsPanel(ui: UI, state: EditorState, h: EditorHandlers) {
  const { ctx, t } = ui;
  let y = HEADER + 76;
  const cap = state.captions;
  row(ui, "Show Captions", y);
  toggle(ui, "c-en", IR - 40, y - 9, cap.enabled, (v) => {
    cap.enabled = v;
    h.touch();
  });
  y += 34;
  sectionTitle(ui, "Read Along", IX, y);
  toggle(ui, "c-ra", IR - 40, y - 9, cap.readAlong, (v) => {
    cap.readAlong = v;
    h.touch();
  });
  y += 22;
  row(ui, "Unread Opacity", y + 12);
  slider(ui, "c-unread", SL_X, y, SL_W, cap.unread, (v) => {
    cap.unread = v;
    h.touch();
  }, `${Math.round(cap.unread * 100)}%`);
  y += 40;
  sectionTitle(ui, "Style", IX, y);
  y += 32;
  row(ui, "Background", y);
  segmented(ui, "c-bg", IR, y - 12, ["None", "Blur", "Glass"], cap.background, (i) => {
    cap.background = i as 0 | 1 | 2;
    h.touch();
  });
  y += 22;
  row(ui, "Font Size", y + 12);
  slider(ui, "c-size", SL_X, y, SL_W, cap.size, (v) => {
    cap.size = v;
    h.touch();
  }, `${Math.round(lerp(14, 22, cap.size))} pt`);
  y += 40;
  row(ui, "Position", y);
  segmented(ui, "c-pos", IR, y - 12, ["Top", "Bottom"], cap.bottom ? 1 : 0, (i) => {
    cap.bottom = i === 1;
    h.touch();
  });
  y += 30;
  const hov = ui.hover === "c-gen";
  rr(ctx, IX, y, IR - IX, 30, 6);
  ctx.fillStyle = hov ? t.controlHover : t.control;
  ctx.fill();
  icon(ctx, "sparkles", IX + (IR - IX) / 2 - 62, y + 15, 14, t.accent);
  text(ctx, "Regenerate Captions", IX + (IR - IX) / 2 + 8, y + 15.5, { size: 12, weight: 500, color: t.text, align: "center" });
  ui.hits.add({ id: "c-gen", x: IX, y, w: IR - IX, h: 30, cursor: "pointer" });
}

function keyboardPanel(ui: UI, state: EditorState, h: EditorHandlers) {
  let y = HEADER + 76;
  sectionTitle(ui, "Keystrokes", IX, y);
  y += 32;
  row(ui, "Show Keystrokes", y);
  toggle(ui, "fx-kb", IR - 40, y - 9, state.keys.show, (v) => {
    state.keys.show = v;
    h.touch();
  });
  y += 34;
  row(ui, "Style", y);
  segmented(ui, "fx-kbstyle", IR, y - 12, KEY_STYLES, state.keys.style, (i) => {
    state.keys.style = i as KeyStyle;
    h.touch();
  });
  y += 34;
  row(ui, "Position", y);
  segmented(ui, "fx-kbpos", IR, y - 12, ["Left", "Center", "Right"], state.keys.position, (i) => {
    state.keys.position = i;
    h.touch();
  });
}

function effectsPanel(ui: UI, state: EditorState, h: EditorHandlers) {
  let y = HEADER + 76;
  sectionTitle(ui, "Beauty", IX, y);
  y += 32;
  row(ui, "Beauty", y);
  toggle(ui, "fx-beauty", IR - 40, y - 9, true, () => h.touch());
  y += 22;
  row(ui, "Smoothness", y + 12);
  slider(ui, "fx-smooth", SL_X, y, SL_W, 0.4, () => h.touch(), "40%");
  y += 40;
  sectionTitle(ui, "Motion", IX, y);
  y += 32;
  row(ui, "Motion Blur", y);
  toggle(ui, "fx-mb", IR - 40, y - 9, state.motionBlur, (v) => {
    state.motionBlur = v;
    h.touch();
  });
}

function cameraPanel(ui: UI, state: EditorState, h: EditorHandlers) {
  const { ctx, t } = ui;
  const cam = state.camera;
  let y = HEADER + 76;
  sectionTitle(ui, "Camera", IX, y);
  y += 32;
  row(ui, "Show Camera", y);
  toggle(ui, "cam-show", IR - 40, y - 9, cam.show, (v) => {
    cam.show = v;
    h.touch();
  });
  y += 22;
  row(ui, "Size", y + 12);
  slider(ui, "cam-size", SL_X, y, SL_W, cam.size, (v) => {
    cam.size = v;
    h.touch();
  }, `${Math.round(18 + cam.size * 20)}%`);
  y += 40;
  ctx.fillStyle = t.separator;
  ctx.fillRect(IX, y - 6, IR - IX, 1);
  y += 20;
  sectionTitle(ui, "Background", IX, y);
  y += 32;
  row(ui, "Remove Background", y);
  toggle(ui, "cam-remove", IR - 40, y - 9, cam.remove, (v) => {
    cam.remove = v;
    cam.changedAt = performance.now();
    h.touch();
  });
  y += 34;
  ctx.save();
  if (!cam.remove) ctx.globalAlpha *= 0.4;
  row(ui, "Sticker Effect", y);
  toggle(ui, "cam-sticker", IR - 40, y - 9, cam.sticker, (v) => {
    if (!cam.remove) return;
    cam.sticker = v;
    h.touch();
  });
  ctx.restore();
  y += 34;
  text(ctx, "Portrait preprocessed with Vision. Try the background toggle.", IX, y, { size: 11, color: t.text3 });
}

function cursorPanel(ui: UI, state: EditorState, h: EditorHandlers) {
  let y = HEADER + 76;
  sectionTitle(ui, "Cursor", IX, y);
  y += 22;
  row(ui, "Size", y + 12);
  slider(ui, "cu-size", SL_X, y, SL_W, 0.5, () => h.touch(), "1.5x");
  y += 34;
  row(ui, "Smoothing", y + 12);
  slider(ui, "cu-smooth", SL_X, y, SL_W, 0.65, () => h.touch(), "65%");
  y += 40;
  row(ui, "Click Effect", y);
  toggle(ui, "cu-click", IR - 40, y - 9, true, () => h.touch());
  y += 34;
  row(ui, "Click Sound", y);
  toggle(ui, "cu-sound", IR - 40, y - 9, false, () => h.touch());
  void state;
}

function musicPanel(ui: UI, state: EditorState, h: EditorHandlers) {
  const { ctx, t } = ui;
  let y = HEADER + 76;
  sectionTitle(ui, "Background Music", IX, y);
  y += 26;
  ["Lofi Hiphop 80s", "Clear Momentum", "Quiet Launch", "Flowing Interface"].forEach((name, i) => {
    const id = `mu-${i}`;
    rr(ctx, IX, y, IR - IX, 40, 8);
    ctx.fillStyle = ui.hover === id ? t.controlHover : i === 1 ? t.fillSecondary : "transparent";
    ctx.fill();
    icon(ctx, i === 1 ? "pause" : "play", IX + 20, y + 20, 13, i === 1 ? t.accent : t.text2, 2);
    text(ctx, name, IX + 40, y + 15, { size: 12, weight: 500, color: t.text });
    text(ctx, `${i % 2 ? "3.7" : "1.2"} MB · ${i % 2 ? "4:00" : "1:20"}`, IX + 40, y + 29, { size: 11, color: t.text3 });
    ui.hits.add({ id, x: IX, y, w: IR - IX, h: 40, cursor: "pointer", onDown: () => h.touch() });
    y += 44;
  });
  void state;
}

/* ---------- screenshot editor window ---------- */

const SHOT_TOOLS = ["mouse-pointer-2", "move-up-right", "minus", "square", "square-fill", "circle", "circle-fill", "type", "grid-3x3", "focus", "circle-dot", "pen-line", "highlighter"];

export function drawScreenshotWindow(ui: UI, state: EditorState, h: EditorHandlers) {
  const { ctx, t } = ui;
  const a = ease(clamp(state.shot));
  if (a <= 0) return;
  const W = SHOT.w;
  const H = SHOT.h;
  ctx.save();
  ctx.globalAlpha = a;
  ctx.translate(SHOT.x + (1 - a) * 80, SHOT.y);
  rr(ctx, 0, 0, W, H, 14);
  drawPanel(ctx,0,0,W,H,14,t.window,t.dark?"rgba(0,0,0,0.55)":"rgba(30,30,60,0.18)",60,24);
  ctx.shadowColor = "transparent";
  ctx.strokeStyle = t.dark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.12)";
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.save();
  rr(ctx, 0, 0, W, H, 14);
  ctx.clip();

  // ScreenshotEditorRootView: 52 pt header, 320 pt drawer, 52 pt footer.
  const headH = 52;
  const footH = 52;
  const drawerW = state.shotFrame.inspector ? 320 : 0;
  ctx.fillStyle = t.panel;
  ctx.fillRect(0, 0, W, headH);
  ctx.fillStyle = t.separator;
  ctx.fillRect(0, headH - 1, W, 1);
  ["#ff5f57", "#febc2e", "#28c840"].forEach((col, i) => {
    ctx.beginPath();
    ctx.arc(20 + i * 20, headH / 2, 6, 0, Math.PI * 2);
    ctx.fillStyle = col;
    ctx.fill();
  });
  ["trash-2", "undo-2", "redo-2"].forEach((name, i) => {
    iconButton(ui, `shot-history-${i}`, 102 + i * 36, 26, name, { size: 15, box: 32 });
  });
  const toolsW = SHOT_TOOLS.length * 29 + 6;
  const toolsX = W - 16 - toolsW;
  const pill = (x: number, y: number, w: number, height: number, radius: number) => {
    rr(ctx, x, y, w, height, radius);
    ctx.fillStyle = t.dark ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.8)";
    ctx.fill();
    ctx.strokeStyle = t.hairline;
    ctx.lineWidth = 1;
    ctx.stroke();
  };
  pill(toolsX - 246, 10, 86, 32, 16);
  icon(ctx, "proportions", toolsX - 231, 26, 13, t.text2);
  text(ctx, "Auto", toolsX - 215, 26.5, { size: 12, color: t.text2 });
  icon(ctx, "chevron-down", toolsX - 173, 26, 10, t.text3);
  ["crop", "image", "laptop", "move-3d"].forEach((name, i) => {
    const cx = toolsX - 136 + i * 38;
    pill(cx - 16, 10, 32, 32, 16);
    if (i === 1 && state.shotFrame.inspector) {
      rr(ctx, cx - 16, 10, 32, 32, 16);
      ctx.fillStyle = t.dark ? "rgba(255,90,31,0.16)" : "rgba(255,90,31,0.12)";
      ctx.fill();
    }
    icon(ctx, name, cx, 26, 15, i === 1 && state.shotFrame.inspector ? t.accent : t.text2);
    ui.hits.add({ id: `shot-frame-${i}`, x: cx - 16, y: 10, w: 32, h: 32, cursor: "pointer", onDown: i === 1 ? () => {
      state.shotFrame.inspector = !state.shotFrame.inspector;
      h.touch();
    } : undefined });
  });
  pill(toolsX, 9, toolsW, 34, 17);
  SHOT_TOOLS.forEach((name, i) => {
    const cx = toolsX + 3 + 13.5 + i * 29;
    const id = `shot-tool-${i}`;
    const selected = state.shotTool === i;
    if (selected || ui.hover === id) {
      rr(ctx, cx - 13.5, 12.5, 27, 27, 13.5);
      ctx.fillStyle = selected ? (t.dark ? "rgba(255,90,31,0.20)" : "rgba(255,90,31,0.16)") : t.fillSecondary;
      ctx.fill();
    }
    const color = selected ? t.accent : t.text2;
    if (name.endsWith("-fill")) {
      ctx.fillStyle = color;
      if (name === "square-fill") rr(ctx, cx - 6, 20, 12, 12, 2);
      else { ctx.beginPath(); ctx.arc(cx, 26, 6, 0, Math.PI * 2); }
      ctx.fill();
    } else {
      icon(ctx, name, cx, 26, 14, color);
    }
    ui.hits.add({ id, x: cx - 13.5, y: 12.5, w: 27, h: 27, cursor: "pointer", onDown: () => {
      state.shotTool = i;
      h.touch();
    } });
  });

  // Fit the complete output (source + padding) into the native 36 pt workspace inset.
  const CX0 = 0;
  const CY0 = headH;
  const CWID = W - drawerW;
  const CHGT = H - headH - footH;
  ctx.fillStyle = t.dark ? "#161618" : "#f6f6f8";
  ctx.fillRect(CX0, CY0, CWID, CHGT);
  const padding = state.shotFrame.padding * 320;
  const outputW = CW + padding * 2;
  const outputH = CH + padding * 2;
  const k = Math.min((CWID - 72) / outputW, (CHGT - 72) / outputH);
  const frame = { x: (CWID - outputW * k) / 2, y: CY0 + (CHGT - outputH * k) / 2, w: outputW * k, h: outputH * k };
  drawBackground(ctx, frame, state.shotBackground, 0);
  const sw = CW * k;
  const sh = CH * k;
  const sx = frame.x + padding * k;
  const sy = frame.y + padding * k;
  const corner = state.shotFrame.radius * 120 * k;
  // shadow from the Angle / Strength pads: only its blur is rasterised (cached),
  // offset and opacity are applied while drawing
  const shade = shotShadow(state.shotFrame, k);
  // the shadow is part of the exported image, so it stops at the output's edge
  ctx.save();
  ctx.beginPath();
  ctx.rect(frame.x, frame.y, frame.w, frame.h);
  ctx.clip();
  drawShadow(ctx, sx, sy, sw, sh, corner, shade.blur, shade.alpha, shade.ox, shade.oy);
  ctx.restore();
  ctx.save();
  rr(ctx, sx, sy, sw, sh, corner);
  ctx.fillStyle = t.panel;
  ctx.fill();
  ctx.restore();
  ctx.save();
  rr(ctx, sx, sy, sw, sh, corner);
  ctx.clip();
  ctx.translate(sx, sy);
  ctx.scale(k, k);
  drawRecordedApp(ctx, 19.2);
  ctx.restore();

  drawScreenshotAnnotations(ctx, state, a, sx, sy, sw, sh, k);
  const red = "#ff3b30";

  // ScreenshotBackgroundInspector, kept separate from annotation attributes.
  const IXs = W - 320;
  if (state.shotFrame.inspector) {
    ctx.fillStyle = t.panel;
    ctx.fillRect(IXs, headH, 320, H - headH - footH);
    ctx.fillStyle = t.separator;
    ctx.fillRect(IXs, headH, 1, H - headH - footH);
    const left = IXs + 16;
    const right = W - 16;
    let y = headH + 24;
    const title = (label: string, divider = true) => {
      if (divider) { ctx.fillStyle = t.separator; ctx.fillRect(left, y - 12, 288, 1); }
      text(ctx, label, left, y, { size: 13, weight: 600, color: t.text });
      y += 23;
    };
    const menu = (label: string, value: string) => {
      text(ctx, label, left, y + 13, { size: 12, color: t.text2 });
      dropdown(ui, `shot-menu-${label}`, right - 164, y, 164, value);
      y += 33;
    };
    const control = (label: string, field: "padding" | "radius" | "smoothness", maximum: number, unit: string) => {
      text(ctx, label, left, y + 12, { size: 12, color: t.text2 });
      slider(ui, `shot-${field}`, right - 164, y, 164, state.shotFrame[field], (v) => { state.shotFrame[field] = v; h.touch(); }, `${Math.round(state.shotFrame[field] * maximum)}${unit}`);
      y += 34;
    };
    title("Background Presets", false);
    menu("Selected", "Default");
    menu("Default", "Default");
    ["plus", "pencil", "trash-2"].forEach((name, i) => {
      rr(ctx, left + i * 36, y, 28, 26, 7);
      ctx.fillStyle = t.control;
      ctx.fill();
      icon(ctx, name, left + i * 36 + 14, y + 13, 12, t.text2);
    });
    y += 52;
    title("Background");
    menu("Type", "Gradient");
    BACKGROUNDS.forEach((bg, i) => {
      const x = left + (i % 3) * 99;
      const yy = y + Math.floor(i / 3) * 42;
      drawBackground(ctx, { x, y: yy, w: 90, h: 34 }, i, 6);
      if (state.shotBackground === i) {
        rr(ctx, x - 2, yy - 2, 94, 38, 8);
        ctx.strokeStyle = t.accent;
        ctx.lineWidth = 2;
        ctx.stroke();
      }
      ui.hits.add({ id: `shot-bg-${i}`, x, y: yy, w: 90, h: 34, cursor: "pointer", onDown: () => { state.shotBackground = i; h.touch(); } });
    });
    y += 94;
    text(ctx, "Blur", left, y + 12, { size: 12, color: t.text2 });
    slider(ui, "shot-blur", right - 164, y, 164, 0, () => {}, "0");
    y += 47;
    title("Material");
    menu("Texture", "None");
    y += 17;
    title("Size");
    control("Padding", "padding", 320, " px");
    y += 17;
    title("Window");
    control("Corner Radius", "radius", 120, " px");
    control("Smoothness", "smoothness", 100, "%");
    y += 17;
    title("Shadow");
    // The client's two square pads (ShadowFormControls): Angle moves the
    // shadow, Strength sets its size (y) and opacity (x). The pads themselves
    // are drawn live by ScreenshotLayer; this lays them out with their labels.
    const gap = 10;
    const size = (288 - gap) / 2;
    (["angle", "strength"] as const).forEach((style, i) => {
      const x = left + i * (size + gap);
      text(ctx, style === "angle" ? "Angle" : "Strength", x, y, { size: 12, color: t.text2 });
      SHOT_PADS[style] = { x, y: y + 12, size };
      const value = padValueText(style, style === "angle" ? state.shotFrame.shadowAngle : state.shotFrame.shadowStrength);
      text(ctx, value, x + size / 2, y + 12 + size + 13, { size: 9.5, weight: 500, color: t.text3, align: "center" });
    });
  }

  // ScreenshotEditorFooter: zoom / export info, annotation controls, Save As / Copy.
  const footerY = H - footH;
  ctx.fillStyle = t.panel;
  ctx.fillRect(0, footerY, W, footH);
  ctx.fillStyle = t.separator;
  ctx.fillRect(0, footerY, W, 1);
  text(ctx, "100%", 26, footerY + 26.5, { size: 11, weight: 500, color: t.text2 });
  icon(ctx, "chevrons-up-down", 65, footerY + 26, 10, t.text3);
  text(ctx, `${Math.round(outputW * 2.25).toLocaleString("en-US")} × ${Math.round(outputH * 2.25).toLocaleString("en-US")} · Original · 1.8 MB`, 94, footerY + 26.5, { size: 11, color: t.text2 });
  icon(ctx, "chevrons-up-down", 302, footerY + 26, 10, t.text3);
  const middle = W / 2;
  iconButton(ui, "shot-selection", middle - 62, footerY + 26, "mouse-pointer-2", { box: 32, size: 14, onDown: () => { state.shotTool = 0; h.touch(); } });
  ctx.beginPath(); ctx.arc(middle - 22, footerY + 26, 10, 0, Math.PI * 2); ctx.fillStyle = red; ctx.fill();
  icon(ctx, "brush", middle - 22, footerY + 26, 12, "#fff");
  icon(ctx, "sliders-horizontal", middle + 18, footerY + 26, 15, t.text2);
  icon(ctx, "minus", middle + 58, footerY + 26, 15, t.text2);
  const action = (label: string, name: string, x: number, prominent: boolean) => {
    rr(ctx, x, footerY + 8, 94, 36, 9);
    ctx.fillStyle = prominent ? t.accent : t.control;
    ctx.fill();
    icon(ctx, name, x + 20, footerY + 26, 14, prominent ? "#fff" : t.text2);
    text(ctx, label, x + 37, footerY + 26.5, { size: 12, weight: 500, color: prominent ? "#fff" : t.text });
  };
  action("Save As", "download", W - 204, false);
  action("Copy", "copy", W - 102, true);

  ctx.restore();
  ctx.restore();
}

/** Only the annotation paths change during the screenshot chapter. */
export function drawScreenshotAnnotations(ctx: CanvasRenderingContext2D, state: EditorState, a: number, sx: number, sy: number, sw: number, sh: number, k: number) {
  // annotations, drawn progressively
  const A = state.annotate;
  const stage = (from: number, to: number) => ease(clamp((A - from) / (to - from)));
  const map = (x: number, y: number) => [sx + x * k, sy + y * k] as const;
  const red = "#ff3b30";
  const AT = TARGETS.attachment;
  const TT = TARGETS.title;
  // spotlight on the attached preview
  const s1 = stage(0, 0.25);
  if (s1 > 0) {
    const [qx, qy] = map(AT.x - 8, AT.y - 8);
    const qw = (AT.w + 16) * k;
    const qh = (AT.h + 16) * k;
    ctx.save();
    ctx.globalAlpha = a * s1;
    ctx.fillStyle = "rgba(0,0,0,0.5)";
    // dim the window in its own shape, so the corners match its rounding
    const corner = Math.max(0, Math.min(state.shotFrame.radius * 120 * k, sw / 2, sh / 2));
    ctx.beginPath();
    ctx.roundRect(sx, sy, sw, sh, corner);
    ctx.roundRect(qx + qw, qy, -qw, qh, 20 * k); // concentric with the 12 pt attachment, 8 pt out
    ctx.fill("evenodd");
    ctx.restore();
  }
  // rectangle around the issue title
  const s2 = stage(0.2, 0.45);
  if (s2 > 0) {
    const [rx, ry] = map(TT.x - 8, TT.y);
    const rw = (TT.w + 16) * k;
    const rh = TT.h * k;
    ctx.save();
    ctx.strokeStyle = red;
    ctx.lineWidth = 3;
    ctx.setLineDash([2 * (rw + rh) * s2, 99999]);
    rr(ctx, rx, ry, rw, rh, 6);
    ctx.stroke();
    ctx.restore();
  }
  // counters
  const badge = (n: string, x: number, y: number, s: number) => {
    if (s <= 0) return;
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(s, s);
    ctx.beginPath();
    ctx.arc(0, 0, 14, 0, Math.PI * 2);
    ctx.fillStyle = red;
    ctx.fill();
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 2.5;
    ctx.stroke();
    text(ctx, n, 0, 0.5, { size: 14, weight: 700, color: "#fff", align: "center" });
    ctx.restore();
  };
  {
    const [bx, by] = map(TT.x - 8, TT.y);
    badge("1", bx, by, stage(0.4, 0.5));
    const [cx2, cy2] = map(AT.x + AT.w + 8, AT.y - 8);
    badge("2", cx2, cy2, stage(0.55, 0.65));
  }
  // arrow to the attachment — client geometry: a bezier stroke with an open
  // two-line head (length max(12, 3w), spread 0.78π) along the end tangent
  const s3 = stage(0.6, 0.85);
  if (s3 > 0) {
    const w = 4;
    const [ex, ey] = map(AT.x - 14, AT.y + AT.h * 0.62);
    const [sx0, sy0] = map(AT.x - 300, AT.y + AT.h + 70);
    const c1 = [sx0 + 150, sy0 + 14];
    const c2 = [ex - 120, ey + 46];
    const at = (u: number) => {
      const m = 1 - u;
      return [
        m * m * m * sx0 + 3 * m * m * u * c1[0] + 3 * m * u * u * c2[0] + u * u * u * ex,
        m * m * m * sy0 + 3 * m * m * u * c1[1] + 3 * m * u * u * c2[1] + u * u * u * ey,
      ];
    };
    const tangent = (u: number) => {
      const m = 1 - u;
      return [
        3 * m * m * (c1[0] - sx0) + 6 * m * u * (c2[0] - c1[0]) + 3 * u * u * (ex - c2[0]),
        3 * m * m * (c1[1] - sy0) + 6 * m * u * (c2[1] - c1[1]) + 3 * u * u * (ey - c2[1]),
      ];
    };
    const tip = at(s3);
    const [tx, ty] = tangent(s3);
    const angle = Math.atan2(ty, tx);
    const head = Math.max(12, w * 3) * Math.min(1, s3 * 4);
    const spread = Math.PI * 0.78;
    const path = () => {
      ctx.beginPath();
      const steps = 48;
      for (let i = 0; i <= steps; i += 1) {
        const [x, y] = at((i / steps) * s3);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.moveTo(tip[0], tip[1]);
      ctx.lineTo(tip[0] + Math.cos(angle + spread) * head, tip[1] + Math.sin(angle + spread) * head);
      ctx.moveTo(tip[0], tip[1]);
      ctx.lineTo(tip[0] + Math.cos(angle - spread) * head, tip[1] + Math.sin(angle - spread) * head);
    };
    ctx.save();
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    path();
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = w + 4;
    ctx.stroke();
    path();
    ctx.strokeStyle = red;
    ctx.lineWidth = w;
    ctx.stroke();
    ctx.restore();
    const ts = stage(0.8, 0.95);
    if (ts > 0) {
      ctx.save();
      ctx.globalAlpha = ts;
      ctx.font = font(22, 800);
      ctx.lineWidth = 6;
      ctx.lineJoin = "round";
      ctx.strokeStyle = red;
      ctx.textBaseline = "middle";
      ctx.textAlign = "right";
      ctx.strokeText("Ship it!", sx0 - 12, sy0);
      ctx.fillStyle = "#fff";
      ctx.fillText("Ship it!", sx0 - 12, sy0);
      ctx.restore();
    }
  }

}

/* ---------- capture flash ---------- */

export function drawFlash(ctx: CanvasRenderingContext2D, state: EditorState) {
  if (state.flash <= 0) return;
  ctx.save();
  ctx.globalAlpha = state.flash * 0.9;
  rr(ctx, COMP.x, COMP.y, COMP.w, COMP.h, 10);
  ctx.fillStyle = "#ffffff";
  ctx.fill();
  ctx.restore();
}

export { HitRegistry, Anim };
