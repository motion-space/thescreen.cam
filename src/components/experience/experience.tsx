import { ScreenshotLayer } from "./screenshot-layer";
import { drawPanel, warmPanel, warmShadow, disposePanelShadows } from "./panel-shadow";
/**
 * Home page hero + feature tour, rendered as one canvas scene.
 *
 * The editor lives in a fixed "world" (see editor.ts). A camera, driven by
 * scroll keyframes, frames different parts of that world: the hero is a tight
 * shot on the preview "video"; pulling back reveals the editor around it, then
 * the camera dives into the timeline, inspector and preview for each feature.
 * Style and effect controls stay interactive through the hit registry;
 * playback follows page scroll inside the feature chapters and runs normally outside.
 */
import { ArrowRight } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { appStoreUrl, microsoftStoreUrl } from "../../lib/i18n";
import { getStoreCopy } from "../../lib/store-copy";
import { AppleLogo, BetaTag, WindowsLogo } from "../store-buttons";
import type { Locale } from "../../lib/i18n";
import { getShowcaseCopy, showcaseFeatureOrder } from "../../lib/showcase-copy";
import { getDocumentTheme, observeTheme } from "../../lib/theme";
import type { HeaderCopy, HeroCopy } from "../../lib/translations";
import { SiteHeader } from "../site-header";
import {
  COMP,
  DURATION,
  EH,
  EW,
  HEADER,
  INS_X,
  LANE_PITCH,
  PREVIEW,
  SHOT,
  type EditorState,
  createState,
  drawFlash,
  shotShadow,
  screenRectIn,
  laneY,
  timeToX,
  timelineMaxOffset,
  followTimeline,
  TL_X0, TL_X1, TIMELINE_Y,
} from "./editor";
import { Anim, HitRegistry, type Hit, type Theme, type UI, makeTheme, squircle } from "./kit";
import { KEY_STYLES, type KeyStyle } from "./keyboard";
import { startCameraPlayback, setCameraPlaybackVisible, setCameraPlaybackTime, setCameraScrollControlled } from "./camera";
import { Preview, warmCaptions } from "./preview";
import { ATTACHMENT, CH, CW, setAppTheme, warmRecordedApp, disposeRecordedAppCaches } from "./recorded-app";
import { FrameBlurGL } from "./preview-gl";
import { SPRINGS, springEase, SpringValue } from "./spring";
import { EditorLayer } from "./editor-layer";

type Rect = { x: number; y: number; w: number; h: number };
type AreaName = "hero" | "overview" | "card";
type Key = { p: number; rect: Rect; area: AreaName };
type Cam = { wx: number; wy: number; sx: number; sy: number; z: number; card: number };

const pad = (r: Rect, n: number): Rect => ({ x: r.x - n, y: r.y - n, w: r.w + n * 2, h: r.h + n * 2 });

/** The recorded screen inside the preview at the default padding, and a point on it in world units. */
const SCREEN = screenRectIn(COMP, 0.36);
const onScreen = (x: number, y: number) => ({ x: SCREEN.x + x * SCREEN.s, y: SCREEN.y + y * SCREEN.s });
/** A w × h framing centred on `c`, kept inside the preview. */
const around = (c: { x: number; y: number }, w: number, h: number): Rect => ({
  x: Math.max(COMP.x - 10, Math.min(COMP.x + COMP.w + 10 - w, c.x - w / 2)),
  y: Math.max(COMP.y - 10, Math.min(COMP.y + COMP.h + 10 - h, c.y - h / 2)),
  w,
  h,
});

const R = {
  comp: pad(COMP, 10),
  full: { x: -24, y: -24, w: EW + 48, h: EH + 48 },
  zoomLane: { x: timeToX(1.4), y: laneY(4) - 4, w: timeToX(10.2) - timeToX(1.4), h: LANE_PITCH * 3 + 8 },
  inspector: { x: INS_X - 6, y: HEADER - 6, w: EW - INS_X + 12, h: 400 },
  previewIns: { x: COMP.x - 10, y: HEADER, w: EW - COMP.x + 10, h: PREVIEW.h },
  capLane: { x: timeToX(8.6), y: laneY(4) - 4, w: timeToX(15.2) - timeToX(8.6), h: LANE_PITCH * 3 + 8 },
  capPreview: { x: COMP.x, y: COMP.y + COMP.h * 0.4, w: COMP.w, h: COMP.h * 0.6 + 6 },
  // each chapter frames its own subject, closer than the whole preview
  zoom: pad(SCREEN, 8),
  zoom3d: around({ x: COMP.x + COMP.w * 0.56, y: COMP.y + COMP.h * 0.5 }, COMP.w * 0.62, COMP.h * 0.62),
  lens: around(onScreen(ATTACHMENT.x + ATTACHMENT.w / 2, ATTACHMENT.y + ATTACHMENT.h / 2), COMP.w * 0.46, COMP.h * 0.5),
  captions: { x: COMP.x + COMP.w * 0.2, y: COMP.y + COMP.h * 0.55, w: COMP.w * 0.6, h: COMP.h * 0.45 + 6 },
  keys: { x: COMP.x + COMP.w * 0.2, y: COMP.y + COMP.h * 0.3, w: COMP.w * 0.6, h: COMP.h * 0.7 + 6 },
  portrait: { x: COMP.x + COMP.w * 0.5 + 6, y: COMP.y + COMP.h * 0.5, w: COMP.w * 0.5, h: COMP.h * 0.5 + 6 },
  shot: pad(SHOT, 24),
  world: { x: -40, y: -40, w: SHOT.x + SHOT.w + 80, h: EH + 80 },
};

/** Scroll keyframes for the camera. Repeated rects are holds. */
const KEYS: Key[] = [
  { p: 0, rect: R.comp, area: "hero" },
  { p: 0.03, rect: R.comp, area: "hero" },
  { p: 0.12, rect: R.full, area: "overview" },
  { p: 0.16, rect: R.full, area: "overview" },
  // one framing per chapter
  // zoom: the recorded screen, where the camera moves
  { p: 0.1825, rect: R.zoom, area: "card" },
  { p: 0.28, rect: R.zoom, area: "card" },
  // 3D: right of centre, where the tilt pulls the cursor
  { p: 0.3025, rect: R.zoom3d, area: "card" },
  { p: 0.385, rect: R.zoom3d, area: "card" },
  // lens: the attachment it magnifies, closest of all
  { p: 0.4075, rect: R.lens, area: "card" },
  { p: 0.475, rect: R.lens, area: "card" },
  // captions: the caption box at the bottom
  { p: 0.4975, rect: R.captions, area: "card" },
  { p: 0.58, rect: R.captions, area: "card" },
  // keystrokes: the key overlay and the comment box the preview zooms into
  { p: 0.60, rect: R.keys, area: "card" },
  { p: 0.69, rect: R.keys, area: "card" },
  // camera: the portrait, while its background dissolves
  { p: 0.715, rect: R.portrait, area: "card" },
  { p: 0.78, rect: R.portrait, area: "card" },
  { p: 0.8, rect: R.comp, area: "card" },
  // screenshot
  { p: 0.8225, rect: R.comp, area: "card" },
  { p: 0.86, rect: R.shot, area: "card" },
  { p: 0.95, rect: R.shot, area: "card" },
  // outro
  { p: 0.99062, rect: R.world, area: "overview" },
  { p: 1, rect: R.world, area: "overview" },
];

/** Chapters: scroll span, mapped playback range, and autopilot selection. */
const CHAPTERS = [
  { key: "zoom", from: 0.16, to: 0.28, scrub: [0.1825, 0.28], time: [2.6, 8.9] },
  { key: "zoom3d", from: 0.28, to: 0.385, scrub: [0.3025, 0.385], time: [14.0, 17.8] },
  { key: "lens", from: 0.385, to: 0.475, scrub: [0.4075, 0.475], time: [18.3, 23.4] },
  { key: "captions", from: 0.475, to: 0.58, scrub: [0.4975, 0.58], time: [9.2, 14.5] },
  { key: "keyboard", from: 0.58, to: 0.69, scrub: [0.6, 0.676], time: [11.4, 14.45] },
  { key: "camera", from: 0.69, to: 0.8, scrub: [0.715, 0.78], time: [14.6, 17.6] },
  { key: "screenshot", from: 0.8, to: 0.95, scrub: [0.8, 0.815], time: [16.8, 16.8] },
] as const;

// Chapter entry points shared by the rail and navigation buttons.
const CHAPTER_STOPS = CHAPTERS.map(ch => ch.key === "screenshot" ? .89 : ch.scrub[0] + .004);

const clamp = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));

/** Scroll camera moves follow the client's camera spring, used as a curve over the scroll span. */
const cameraEase = springEase(SPRINGS.camera);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

function areaRect(name: AreaName, W: number, H: number): Rect {
  const narrow = W < 900;
  if (narrow) {
    if (name === "hero") return { x: W * 0.04, y: H * 0.6, w: W * 0.92, h: H * 0.36 };
    if (name === "overview") return { x: W * 0.03, y: H * 0.26, w: W * 0.94, h: H * 0.5 };
    return { x: W * 0.03, y: H * 0.11, w: W * 0.94, h: H * 0.48 };
  }
  if (name === "hero") return { x: W * 0.09, y: H * 0.44, w: W * 0.82, h: H * 0.66 };
  if (name === "overview") return { x: W * 0.05, y: H * 0.25, w: W * 0.9, h: Math.max(1, H * 0.72 - 56) };
  return { x: W * 0.37, y: H * 0.11, w: W * 0.6, h: H * 0.84 };
}

/** The closest the scroll camera gets (screen px per world unit). */
const MAX_ZOOM = 2;

function fit(rect: Rect, area: Rect, top = false): Cam {
  const z = Math.min(area.w / rect.w, area.h / rect.h, MAX_ZOOM);
  const sy = top ? area.y + (rect.h * z) / 2 : area.y + area.h / 2;
  return { wx: rect.x + rect.w / 2, wy: rect.y + rect.h / 2, sx: area.x + area.w / 2, sy, z, card: 0 };
}

function cameraAt(p: number, W: number, H: number): Cam {
  let i = 0;
  while (i < KEYS.length - 2 && p > KEYS[i + 1].p) i += 1;
  const a = KEYS[i];
  const b = KEYS[i + 1];
  const t = cameraEase(clamp((p - a.p) / Math.max(1e-6, b.p - a.p)));
  const ca = fit(a.rect, areaRect(a.area, W, H), a.area === "hero");
  const cb = fit(b.rect, areaRect(b.area, W, H), b.area === "hero");
  let z = Math.exp(lerp(Math.log(ca.z), Math.log(cb.z), t));
  // long pans dip out a little, like a real camera move
  const travel = Math.hypot(cb.wx - ca.wx, cb.wy - ca.wy) * Math.min(ca.z, cb.z) / W;
  if (travel > 0.5) z *= 1 - Math.min(0.42, travel * 0.16) * Math.sin(Math.PI * t);
  // keep the eased screen anchor and world centre consistent with log zoom
  return {
    wx: lerp(ca.wx, cb.wx, t),
    wy: lerp(ca.wy, cb.wy, t),
    sx: lerp(ca.sx, cb.sx, t),
    sy: lerp(ca.sy, cb.sy, t),
    z,
    card: lerp(a.area === "card" ? 1 : 0, b.area === "card" ? 1 : 0, t),
  };
}

const resolvedColors = new Map<string, string>();
function resolveColor(css: string) {
  const cached = resolvedColors.get(css);
  if (cached) return cached;
  const c = document.createElement("canvas");
  c.width = c.height = 1;
  const ctx = c.getContext("2d", { willReadFrequently: true });
  if (!ctx) return "#ff5a1f";
  ctx.fillStyle = "#ff5a1f";
  ctx.fillStyle = css;
  ctx.fillRect(0, 0, 1, 1);
  const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
  const hex = `#${[r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("")}`;
  resolvedColors.set(css, hex);
  return hex;
}

function readTheme(): Theme {
  const dark = getDocumentTheme() === "dark";
  const accent = getComputedStyle(document.documentElement).getPropertyValue("--accent").trim() || "#ff5a1f";
  return makeTheme(dark, resolveColor(accent));
}

type Props = {
  copy: HeroCopy;
  currentPath?: string;
  headerCopy: HeaderCopy;
  languageLabel: string;
  locale: Locale;
};

export function Experience({ copy, currentPath = "/", headerCopy, languageLabel, locale }: Props) {
  const rootRef = useRef<HTMLElement>(null);
  const interactionRef = useRef<HTMLDivElement>(null);
  const editorHitRef = useRef<HTMLDivElement>(null);
  const shotHitRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const zoomHintRef = useRef<HTMLDivElement>(null);
  const zoomKeyRef = useRef<HTMLElement>(null);
  const overviewRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Array<HTMLDivElement | null>>([]);
  const railRef = useRef<HTMLDivElement>(null);
  const railIndicatorRef = useRef<HTMLDivElement>(null);
  const railIndicatorFillRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<EditorState | null>(null);
  const [demo, setDemo] = useState({ style: 0 as KeyStyle, remove: false, sticker: false });
  const demoRef = useRef(demo);
  const [active, setActive] = useState(-1);
  const showcase = useMemo(() => getShowcaseCopy(locale), [locale]);

  useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    const interaction = interactionRef.current;
    if (!root || !canvas || !interaction) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let theme = readTheme();
    setAppTheme(theme.dark);
    const state: EditorState = createState(theme.dark, showcase.captionSample);
    warmPanel(30,theme.window,theme.dark?"rgba(0,0,0,0.62)":"rgba(28,30,60,0.16)",150,60,COMP.w,COMP.h);
    warmPanel(30,theme.window,theme.dark?"rgba(0,0,0,0.35)":"rgba(28,30,60,0.08)",28,10,COMP.w,COMP.h);
    warmPanel(14,theme.window,theme.dark?"rgba(0,0,0,0.55)":"rgba(30,30,60,0.18)",60,24);
    const shotPadding=state.shotFrame.padding*320;
    const shotScale=Math.min((SHOT.w-320-72)/(1280+shotPadding*2),(SHOT.h-104-72)/(800+shotPadding*2));
    { const shade=shotShadow(state.shotFrame,shotScale); warmShadow(state.shotFrame.radius*120*shotScale,shade.blur,CW*shotScale,CH*shotScale); }
    editorRef.current = state;
    state.time = 1.2;
    state.playing = !reduceMotion;
    if (import.meta.env.DEV) (window as Window & { __xp?: EditorState }).__xp = state;
    const hits = new HitRegistry();
    const anim = new Anim();
    const ui: UI = { ctx, t: theme, hits, anim, hover: null, active: null };
    let dirtyUntil = performance.now() + 500;
    const invalidate = () => { dirtyUntil = performance.now() + 500; };
    let timelinePanUntil = 0;
    const handlers = { scrollControlled: false, touch: invalidate };
    const stopCameraPlayback = startCameraPlayback();
    let blurGL: FrameBlurGL | null = null;
    try {
      blurGL = new FrameBlurGL(true);
      blurGL.canvas.className = "pointer-events-none absolute inset-0 h-full w-full";
      blurGL.canvas.setAttribute("aria-hidden", "true");
      blurGL.canvas.style.visibility = "hidden";
      canvas.insertAdjacentElement("afterend", blurGL.canvas);
    } catch {
      blurGL = null;
    }
    const preview = new Preview(blurGL?.context);
    const editorLayer = new EditorLayer();
    const screenshotLayer = new ScreenshotLayer();
    const stopWarmup = warmRecordedApp();


    if (import.meta.env.DEV) (window as Window & { __pv?: Preview }).__pv = preview;
    let lastCam: Cam | null = null;
    let scrollCameraBlurred = false;
    let processed = false;
    const presentProcessed = (enabled: boolean) => {
      if (processed === enabled || !blurGL) return;
      processed = enabled;
      blurGL.canvas.style.visibility = enabled ? "visible" : "hidden";
      canvas.style.opacity = enabled ? "0" : "1";
    };
    let textEdge = 0;
    const readPageColor = (): [number, number, number] => {
      const hex = resolveColor(getComputedStyle(document.body).backgroundColor || "#000");
      const n = parseInt(hex.slice(1), 16);
      return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
    };
    let pageColor = readPageColor();

    let W = 0;
    let H = 0;
    let dpr = 1;
    let canvasBounds = canvas.getBoundingClientRect();
    let editorDensity = 1;
    let progress = 0;
    let overviewSettle: { from: number; to: number; started: number } | null = null;
    let overviewSettleAt = 0;
    let overviewDirection = 1;
    let overviewTouching = false;
    const interruptOverviewSettle = () => { overviewSettle = null; overviewSettleAt = performance.now() + 200; };
    const onSettleKey = (e: KeyboardEvent) => {
      if (["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End", " "].includes(e.key)) interruptOverviewSettle();
    };
    const onSettleTouchStart = () => { overviewTouching = true; interruptOverviewSettle(); };
    const onSettleTouchEnd = () => { overviewTouching = false; interruptOverviewSettle(); };

    const desktopZoom = window.matchMedia("(min-width: 900px) and (hover: hover) and (pointer: fine)");
    const mac = /Mac|iPhone|iPad/.test(navigator.platform);
    if (zoomKeyRef.current) zoomKeyRef.current.textContent = mac ? "⌘" : "Ctrl";
    let zoomToggled = false;
    const zoomAnchor = { x: 0, y: 0 };
    let pointer: { x: number; y: number } | null = null;
    const holdScale = new SpringValue(1, SPRINGS.camera);
    const holdX = new SpringValue(0, SPRINGS.camera);
    const holdY = new SpringValue(0, SPRINGS.camera);
    let holdActive = false;
    const isOverview = () => (progress >= .12 && progress <= .16) || progress >= .99062;
    // Use the same camera spring and final motion-blur pass as the scroll zoom.
    const updateMagnify = (now = performance.now()) => {
      const base = cameraAt(progress, W, H);
      const left = base.sx - base.wx * base.z;
      const top = base.sy - base.wy * base.z;
      const right = left + EW * base.z;
      const bottom = top + EH * base.z;
      const eligible = desktopZoom.matches && isOverview() && visible && !document.hidden;
      if (!eligible) zoomToggled = false;
      zoomAnchor.x = clamp(zoomAnchor.x, left, right);
      zoomAnchor.y = clamp(zoomAnchor.y, top, bottom);
      if (zoomToggled && pointer && (pointer.x < Math.max(0, left * 2 - zoomAnchor.x) ||
          pointer.x > Math.min(W, right * 2 - zoomAnchor.x) ||
          pointer.y < Math.max(0, top * 2 - zoomAnchor.y) ||
          pointer.y > Math.min(H, bottom * 2 - zoomAnchor.y))) zoomToggled = false;
      holdActive = eligible && zoomToggled;
      const x = zoomAnchor.x;
      const y = zoomAnchor.y;
      let changed = false;
      for (const [spring, target] of [[holdScale, holdActive ? 2 : 1], [holdX, holdActive ? -x : 0], [holdY, holdActive ? -y : 0]] as const) {
        const before = spring.value;
        if (reduceMotion) { spring.value = target; spring.velocity = 0; }
        else spring.update(target, now);
        changed ||= before !== spring.value || !spring.settled(target);
      }
      if (overviewRef.current) {
        const title = Math.max(Math.min(clamp((progress - .085) / .03), 1 - clamp((progress - .158) / .015)), clamp((progress - .96875) / .015625));
        const opacity = title * (1 - clamp((holdScale.value - 1) * 4));
        overviewRef.current.style.opacity = String(opacity);
        overviewRef.current.style.visibility = opacity > 0 ? "visible" : "hidden";
      }
      if (zoomHintRef.current) {
        zoomHintRef.current.style.visibility = eligible && !holdActive ? "visible" : "hidden";
        zoomHintRef.current.style.top = `${bottom + 16}px`;
      }
      return changed;
    };
    let lastProgress = -1;
    let railMetrics: Array<{ x: number; width: number }> = [];
    let railPill = { x: 0, width: 0 };
    let railDrag: { pointerId: number; fraction: number; left: number; pageTop: number; span: number } | null = null;
    let railSuppressClick = false;
    let railForeground: HTMLElement[] = [];

    const updateRail = (p: number) => {
      const indicator = railIndicatorRef.current;
      if (!indicator || railMetrics.length !== CHAPTERS.length) return;
      // Arrival points match the completed camera framing, not a timer or
      // the currently playing video. Reversing scroll reverses this exactly.
      const stops = CHAPTER_STOPS;
      let i = 0;
      while (i < stops.length - 2 && p > stops[i + 1]) i += 1;
      const t = clamp((p - stops[i]) / (stops[i + 1] - stops[i]));
      const a = railMetrics[i], b = railMetrics[i + 1];
      const x = lerp(a.x, b.x, t), width = lerp(a.width, b.width, t);
      indicator.style.transform = `translate3d(${x}px,0,0)`;
      railPill = { x, width };
      const fill = railIndicatorFillRef.current;
      if (fill) {
        fill.style.width = `${width}px`;
        fill.style.transformOrigin = `${width / 2}px 15px`;
      }
      if (railDrag) railForeground.forEach((label, i) => {
        const item = railMetrics[i];
        const left = clamp(x - width * .05 - item.x, 0, item.width);
        const right = clamp(item.x + item.width - x - width * 1.05, 0, item.width);
        label.style.clipPath = `inset(0 ${right}px 0 ${left}px)`;
      });
    };
    let chapter = -2;
    let playingBeforeTour = state.playing;
    let lastFrameAt = performance.now();
    let visible = true;
    let raf = 0;
    let drag: Hit | null = null;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvasBounds = rect;
      W = rect.width;
      H = rect.height;
      // Preserve the original Retina resolution, including during scrolling
      // and modifier-key zoom. Performance work must not reduce sharpness.
      dpr = Math.min(2, window.devicePixelRatio || 1);
      // The closest framings mostly show the preview; cap the editor cache separately.
      editorDensity = Math.max(...KEYS.map(key => Math.min(1.6, fit(key.rect, areaRect(key.area, W, H)).z))) * dpr;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      lastCam = null;
      invalidate();
    };
    resize();
    if (preview.canCompose) blurGL?.prepareEditor(editorLayer.prepare(ui, state, handlers, editorDensity));
    screenshotLayer.draw(ui,state,handlers,editorDensity,true);
    const captionDensity=Math.max(...[.49,.58,...KEYS.filter(k=>k.p>=.49&&k.p<=.58).map(k=>k.p)].map(p=>cameraAt(p,W,H).z*dpr));
    const stopCaptionWarmup=warmCaptions(state,captionDensity);
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const stopTheme = observeTheme(() => {
      theme = readTheme();
      ui.t = theme;
      invalidate();
      setAppTheme(theme.dark);
      // read after the theme's colour transition settles
      window.setTimeout(() => {
        pageColor = readPageColor();
      }, 420);
    });

    const readProgress = (rect = root.getBoundingClientRect()) => {
      const span = rect.height - window.innerHeight;
      return clamp(-rect.top / Math.max(1, span));
    };

    /** The scroll position is the only playback clock; chapters map their own demos. */
    const applyScroll = (p: number) => {
      const index = CHAPTERS.findIndex((c) => p >= c.from && p < c.to);
      const next = p < CHAPTERS[0].from ? -1 : index === -1 ? CHAPTERS.length : index;
      // The overview is still visible at the first chapter's fade-in boundary.
      // Take over playback only once its camera framing has actually arrived.
      const controlled = index >= 0 && p >= CHAPTERS[0].scrub[0];
      if (controlled !== handlers.scrollControlled) {
        if (controlled) playingBeforeTour = state.playing;
        else state.playing = playingBeforeTour;
        handlers.scrollControlled = controlled;
      }
      if (controlled) state.playing = false;
      if (next !== chapter) {
        chapter = next;
        setActive(next >= 0 && next < CHAPTERS.length ? next : -1);
        if (next === 0) state.selection = { kind: "zoom", index: 1 };
        else if (next === 1) state.selection = { kind: "zoom", index: 5 };
        else if (next === 2) state.selection = { kind: "zoom", index: 6 };
        else if (next === 3) state.selection = { kind: "captions" };
        else if (next === 4 || next === 5) {
          state.selection = { kind: "none" };
          state.tab = next === 4 ? 6 : 5;
          state.camera.show = true;
          if (next === 5) {
            state.camera.remove = true;
            state.camera.sticker = false;
            state.camera.changedAt = -1e9;
          }
        } else {
          state.selection = { kind: "none" };
          state.tab = 0;
        }
      }
      const ch = CHAPTERS[chapter];
      if (ch && controlled) {
        const k = clamp((p - ch.scrub[0]) / (ch.scrub[1] - ch.scrub[0]));
        state.time = lerp(ch.time[0], ch.time[1], k);
      }
    };

    const derived = (p: number) => {
      state.chrome = clamp((p - 0.035) / 0.085);
      state.captionsShown = clamp((p - 0.49) / 0.0225) * (1 - clamp((p - 0.58) / 0.015));
      state.flash = clamp(1 - Math.abs(p - 0.81875) / 0.009);
      state.shot = clamp((p - 0.824) / 0.02625);
      state.annotate = clamp((p - 0.86) / 0.075);
    };

    const updateOverlay = (p: number) => {
      const hero = heroRef.current;
      if (hero) {
        const k = clamp((p - 0.012) / 0.05);
        hero.style.opacity = String(1 - k);
        hero.style.transform = `translate3d(0, ${-k * 12}vh, 0)`;
        hero.style.visibility = k >= 1 ? "hidden" : "visible";
      }
      const overview = overviewRef.current;
      if (overview) {
        const a = Math.min(clamp((p - 0.085) / 0.03), 1 - clamp((p - 0.158) / 0.015));
        const b = Math.min(clamp((p - 0.96875) / 0.015625), 1);
        const k = Math.max(a, b);
        overview.style.opacity = String(k);
        overview.style.transform = `translate3d(0, ${(1 - k) * 3}vh, 0)`;
        overview.style.visibility = k <= 0 ? "hidden" : "visible";
      }
      CHAPTERS.forEach((ch, i) => {
        const el = cardRefs.current[i];
        if (!el) return;
        const k = Math.min(clamp((p - ch.from) / 0.018), 1 - clamp((p - (ch.to - 0.014)) / 0.014));
        el.style.opacity = String(k);
        el.style.transform = `translate3d(0, ${(1 - k) * 24}px, 0)`;
        el.style.visibility = k <= 0 ? "hidden" : "visible";
      });
      const rail = railRef.current;
      if (rail) {
        const k = Math.min(clamp((p - 0.16) / 0.02), 1 - clamp((p - 0.94625) / 0.0125));
        rail.style.opacity = String(k);
        rail.style.visibility = k <= 0 ? "hidden" : "visible";
        updateRail(p);
      }
    };

    const measureRail = () => {
      const rail = railRef.current;
      if (!rail) return;
      railForeground = Array.from(rail.querySelectorAll<HTMLElement>(".xp-rail-item-drag-label"));
      railMetrics = Array.from(rail.querySelectorAll<HTMLButtonElement>(".xp-rail-item"), button => ({ x: button.offsetLeft, width: button.offsetWidth }));
      updateRail(progress);
    };
    const rail = railRef.current;
    const onRailDown = (e: PointerEvent) => {
      railSuppressClick = false;
      if (e.button !== 0 || !rail || !railPill.width) return;
      const rect = rail.getBoundingClientRect(), x = e.clientX - rect.left;
      if (x < railPill.x || x > railPill.x + railPill.width) return;
      e.preventDefault(); e.stopPropagation();
      const bounds = root.getBoundingClientRect();
      railDrag = { pointerId: e.pointerId, fraction: clamp((x - railPill.x) / railPill.width), left: rect.left, pageTop: scrollY + bounds.top, span: bounds.height - innerHeight };
      railSuppressClick = true;
      overviewSettle = null; overviewSettleAt = 0;
      rail.dataset.dragging = "true";
      document.documentElement.dataset.xpRailDragging = "true";
      rail.setPointerCapture(e.pointerId);
      updateRail(progress);
    };
    const onRailMove = (e: PointerEvent) => {
      if (!railDrag || e.pointerId !== railDrag.pointerId) return;
      e.preventDefault();
      const x = e.clientX - railDrag.left, f = railDrag.fraction;
      const anchor = (i: number) => railMetrics[i].x + railMetrics[i].width * f;
      let i = 0;
      while (i < railMetrics.length - 2 && x > anchor(i + 1)) i++;
      const k = clamp((x - anchor(i)) / Math.max(1, anchor(i + 1) - anchor(i)));
      const p = lerp(CHAPTER_STOPS[i], CHAPTER_STOPS[i + 1], k);
      window.scrollTo({ top: railDrag.pageTop + railDrag.span * p, behavior: "instant" });
      updateRail(p); invalidate();
    };
    const onRailEnd = (e?: PointerEvent) => {
      if (!railDrag || (e && e.pointerId !== railDrag.pointerId)) return;
      const id = railDrag.pointerId;
      railDrag = null;
      delete rail?.dataset.dragging;
      delete document.documentElement.dataset.xpRailDragging;
      if (rail?.hasPointerCapture(id)) rail.releasePointerCapture(id);
      invalidate();
    };
    const onRailClick = (e: MouseEvent) => {
      if (railSuppressClick) { e.preventDefault(); e.stopPropagation(); railSuppressClick = false; }
    };
    rail?.addEventListener("pointerdown", onRailDown, true);
    rail?.addEventListener("pointermove", onRailMove);
    rail?.addEventListener("pointerup", onRailEnd);
    rail?.addEventListener("pointercancel", onRailEnd);
    rail?.addEventListener("lostpointercapture", onRailEnd);
    rail?.addEventListener("click", onRailClick, true);
    const onRailBlur = () => onRailEnd();
    window.addEventListener("blur", onRailBlur);
    const railObserver = new ResizeObserver(measureRail);
    if (railRef.current) railObserver.observe(railRef.current);
    measureRail();

    const drawGrid = (cam: Cam) => {
      let step = 40 * cam.z;
      while (step < 14) step *= 2;
      const ox = (cam.sx - cam.wx * cam.z) % step;
      const oy = (cam.sy - cam.wy * cam.z) % step;
      ctx.fillStyle = theme.dark ? "rgba(255,255,255,0.075)" : "rgba(0,0,0,0.07)";
      for (let x = ox; x < W; x += step) {
        for (let y = oy; y < H; y += step) ctx.fillRect(x - 0.5, y - 0.5, 1, 1);
      }
    };

    const frame = (now: number) => {
      raf = 0;
      // IntersectionObserver arrives after animation callbacks. Cull a newly
      // offscreen tour before recording another large Canvas frame on a fast scroll.
      const bounds = root.getBoundingClientRect();
      if (bounds.bottom <= 0 || bounds.top >= window.innerHeight) {
        visible = false;
        setCameraPlaybackVisible(false);
        return;
      }
      const dt = Math.min(.1, (now - lastFrameAt) / 1000);
      lastFrameAt = now;
      progress = readProgress(bounds);
      canvasBounds = canvas.getBoundingClientRect();
      // Read layout before overlay and hit-region writes. Reading chapter
      // bounds in render() forced style/layout after those writes every frame.
      const cardIndex = CHAPTERS.findIndex(ch => progress >= ch.from && progress < ch.to);
      const card = cardRefs.current[cardIndex >= 0 ? cardIndex : progress >= CHAPTERS[CHAPTERS.length - 1].to ? CHAPTERS.length - 1 : 0];
      if (card) {
        const rect = card.getBoundingClientRect();
        if (rect.width > 0) textEdge = W < 900 ? H - rect.top : rect.right;
      }
      // Finish only the overview assembly/exit. Chapter playback remains fully
      // scroll-driven; user input interrupts immediately without locking scroll.
      const positionChanged = Math.abs(progress - lastProgress) > 1e-5;
      if (positionChanged && !overviewSettle) {
        overviewDirection = progress > lastProgress ? 1 : -1;
        overviewSettleAt = now + 200;
      }
      if (!overviewSettle && !overviewTouching && !drag && overviewSettleAt && now >= overviewSettleAt) {
        const range = progress > .03 && progress < .12 ? [.028, .122]
          : progress > .95 && progress < .99062 ? [.948, .993] : null;
        overviewSettleAt = 0;
        if (range) overviewSettle = { from: progress, to: range[overviewDirection > 0 ? 1 : 0], started: now };
      }
      if (overviewSettle) {
        const t = reduceMotion ? 1 : clamp((now - overviewSettle.started) / 800);
        const p = lerp(overviewSettle.from, overviewSettle.to, t * t * t * (t * (t * 6 - 15) + 10));
        const top = window.scrollY + bounds.top;
        window.scrollTo({ top: top + (bounds.height - window.innerHeight) * p, behavior: "instant" });
        progress = p;
        if (t === 1) { overviewSettle = null; overviewSettleAt = 0; }
      }
      const scrolled = Math.abs(progress - lastProgress) > 1e-5;
      applyScroll(progress);
      if (!handlers.scrollControlled && state.playing && !drag) state.time = (state.time + dt) % DURATION;
      followTimeline(state, !drag && now > timelinePanUntil && (state.playing || handlers.scrollControlled));
      if (scrolled) {
        updateOverlay(progress);
        lastProgress = progress;
      }
      derived(progress);
      const magnifying = updateMagnify(now);
      const previous = demoRef.current;
      if (previous.style !== state.keys.style || previous.remove !== state.camera.remove || previous.sticker !== state.camera.sticker) {
        demoRef.current = { style: state.keys.style, remove: state.camera.remove, sticker: state.camera.sticker };
        setDemo(demoRef.current);
        invalidate();
      }
      setCameraScrollControlled(handlers.scrollControlled);
      setCameraPlaybackVisible(visible && state.camera.show && state.playing);
      setCameraPlaybackTime(state.time);
      if (magnifying || scrolled || scrollCameraBlurred || state.playing || drag || now < dirtyUntil) try {
        render();
      } catch (error) {
        console.error(error);
        (ctx as CanvasRenderingContext2D & { reset?: () => void }).reset?.();
      }
      if (visible && !document.hidden) raf = requestAnimationFrame(frame);
    };

    const render = () => {
      const base = cameraAt(progress, W, H);
      const cam = { ...base, z: base.z * holdScale.value,
        sx: base.sx * holdScale.value + holdX.value,
        sy: base.sy * holdScale.value + holdY.value };
      // Only the visible mock windows receive editor input. The full-screen
      // presentation canvases never intercept page selection or context menus.
      const placeHitRegion = (el: HTMLDivElement | null, rect: Rect, shown: boolean) => {
        if (!el) return;
        el.style.display = shown ? "block" : "none";
        if (!shown) return;
        el.style.left = `${cam.sx + (rect.x - cam.wx) * cam.z}px`;
        el.style.top = `${cam.sy + (rect.y - cam.wy) * cam.z}px`;
        el.style.width = `${rect.w * cam.z}px`;
        el.style.height = `${rect.h * cam.z}px`;
      };
      placeHitRegion(editorHitRef.current, state.chrome < 1 ? COMP : { x: 0, y: 0, w: EW, h: EH }, true);
      placeHitRegion(shotHitRef.current, SHOT, state.shot > .001);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      if (state.chrome < 1 || !preview.canCompose) drawGrid(cam);

      ctx.setTransform(dpr * cam.z, 0, 0, dpr * cam.z, dpr * (cam.sx - cam.wx * cam.z), dpr * (cam.sy - cam.wy * cam.z));
      hits.clear();
      hits.ctx = ctx;

      // the preview floats on a large, soft shadow before the editor assembles around it
      const lift = 1 - state.chrome;
      const radius = lerp(30, 14, state.chrome);
      if (lift > 0) {
        ctx.save();
        ctx.globalAlpha=lift;
        drawPanel(ctx,COMP.x,COMP.y,COMP.w,COMP.h,30,theme.window,theme.dark?"rgba(0,0,0,0.62)":"rgba(28,30,60,0.16)",150,60);
        drawPanel(ctx,COMP.x,COMP.y,COMP.w,COMP.h,30,theme.window,theme.dark?"rgba(0,0,0,0.35)":"rgba(28,30,60,0.08)",28,10);
        ctx.restore();
      }

      hits.add({ id: "tl-pan", x: 0, y: TIMELINE_Y, w: EW, h: EH - TIMELINE_Y });
      editorLayer.draw(ui, state, handlers, editorDensity, preview.canCompose);
      hits.add({
        id: "preview",
        ...COMP,
        cursor: handlers.scrollControlled ? "default" : "pointer",
        onDown: handlers.scrollControlled ? undefined : () => { state.playing = !state.playing; invalidate(); },
      });
      // Paint every changed animation frame at the display's cadence.
      // Retain full magnified density through both the entrance and exit.
      const previewScale = holdActive || holdScale.value !== 1 ? 2 : 1;
      preview.draw(ctx, state, base.z * dpr * previewScale, radius, reduceMotion);
      // a faint 1 px hairline so the frame keeps its edge against the page
      ctx.save();
      squircle(ctx, COMP.x, COMP.y, COMP.w, COMP.h, radius);
      ctx.strokeStyle = theme.dark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.1)";
      ctx.lineWidth = 1 / cam.z;
      ctx.stroke();
      ctx.restore();
      drawFlash(ctx, state);
      screenshotLayer.draw(ui, state, handlers, editorDensity);

      // final frame pass: scroll-camera motion blur + progressive blur behind
      // the chapter text (variable radius, so there is no visible band edge)
      let useProcessed = false;
      scrollCameraBlurred = false;
      if (blurGL) {
        let A = 1;
        let bx = 0;
        let by = 0;
        if (lastCam && !reduceMotion) {
          A = lastCam.z / cam.z;
          bx = dpr * (lastCam.sx + (cam.wx - lastCam.wx) * lastCam.z - cam.sx * A);
          by = dpr * (lastCam.sy + (cam.wy - lastCam.wy) * lastCam.z - cam.sy * A);
        }
        const corner = (x: number, y: number) => Math.hypot((A - 1) * x + bx, (A - 1) * y + by);
        const peak = Math.max(corner(0, 0), corner(canvas.width, 0), corner(0, canvas.height), corner(canvas.width, canvas.height));
        // fade the blur in with speed instead of switching it on at a threshold
        const amount = peak < canvas.width ? Math.max(0, Math.min(1, (peak - 0.8) / 4)) : 0;
        const moving = amount > 0;
        scrollCameraBlurred = moving;
        A = 1 + (A - 1) * amount;
        bx *= amount;
        by *= amount;
        const veil = cam.card > 0.001;
        if (moving || veil || preview.gpuLayer) {
          const narrow = W < 900;
          // the band hugs the chapter text: full strength under the text,
          // fading out over a short distance past its edge
          const edge = textEdge || (narrow ? H * 0.45 : W * 0.33);
          blurGL.render(canvas, A, bx, by, 64 * dpr, {
            mode: narrow ? 2 : 1,
            // ramps from just past the text all the way to the screen edge
            start: (edge + (narrow ? 140 : Math.max(260, W * 0.18))) * dpr,
            full: 0,
            radius: 64 * dpr,
            strength: cam.card,
            color: pageColor,
            tint: 0.74,
          }, preview.gpuLayer, editorLayer.gpuLayer, (() => {
            let step = 40 * cam.z; while (step < 14) step *= 2;
            return { step: step*dpr, x: (cam.sx-cam.wx*cam.z)%step*dpr, y: (cam.sy-cam.wy*cam.z)%step*dpr, dpr, dark: theme.dark };
          })(), editorLayer.inspector.gpuLayer, preview.cursorLayer, state.chrome === 1 ? {
            rect: [
              (cam.sx - cam.wx * cam.z) * dpr,
              (cam.sy + (TIMELINE_Y - cam.wy) * cam.z) * dpr,
              (cam.sx + (TL_X1 - cam.wx) * cam.z) * dpr,
              (cam.sy + (EH - 20 - cam.wy) * cam.z) * dpr,
            ],
            left: Math.min(1, state.timelineOffset / 12),
            right: Math.min(1, (timelineMaxOffset(state) - state.timelineOffset) / 12),
            band: 132 * cam.z * dpr,
            rightBand: 56 * cam.z * dpr,
            color: [0, 2, 4].map(i => parseInt(theme.window.slice(i + 1, i + 3), 16) / 255) as [number, number, number],
            labels: editorLayer.timelineLabels,
          } : undefined);
          // Present this GPU canvas directly. Copying it back into the 2D
          // source forces another cross-context synchronization every frame.
          useProcessed = true;
        }
      }
      presentProcessed(useProcessed);
      lastCam = cam;
    };

    if (import.meta.env.DEV) {
      // Review hook: render the deterministic scroll frame.
      (window as Window & { __xpFrame?: (keepTime?: boolean) => void }).__xpFrame = (keepTime = false) => {
        progress = readProgress();
        if (!keepTime) applyScroll(progress);
        updateOverlay(progress);
        lastProgress = progress;
        derived(progress);
        const previous = demoRef.current;
        if (previous.style !== state.keys.style || previous.remove !== state.camera.remove || previous.sticker !== state.camera.sticker) {
          demoRef.current = { style: state.keys.style, remove: state.camera.remove, sticker: state.camera.sticker };
          setDemo(demoRef.current);
        }
        render();
      };
    }

    const start = () => {
      if (!raf && visible && !document.hidden) {
        lastFrameAt = performance.now();
        raf = requestAnimationFrame(frame);
      }
    };
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      setCameraPlaybackVisible(visible && state.camera.show && state.playing);
      if (visible) start();
      else { cancelAnimationFrame(raf); raf = 0; }
    });
    const onVisibility = () => {
      setCameraPlaybackVisible(visible && !document.hidden && state.camera.show && state.playing);
      if (document.hidden) { zoomToggled = false; updateMagnify(); cancelAnimationFrame(raf); raf = 0; }
      else { invalidate(); start(); }
    };
    window.addEventListener("xp-background-ready", invalidate);
    window.addEventListener("xp-camera-frame-ready", invalidate);
    document.addEventListener("visibilitychange", onVisibility);
    io.observe(root);
    start();

    const point = (e: PointerEvent) => {
      const rect = canvasBounds;
      return { x: (e.clientX - rect.left) * W / rect.width * dpr, y: (e.clientY - rect.top) * H / rect.height * dpr };
    };
    const onMove = (e: PointerEvent) => {
      const p = point(e);
      if (drag) {
        const fresh = hits.hits.find((h) => h.id === drag?.id) ?? (drag as (typeof hits.hits)[number]);
        fresh.onDrag?.(hits.local(fresh, p));
        return;
      }
      const hit = hits.find(p);
      if (ui.hover !== (hit?.id ?? null)) invalidate();
      ui.hover = hit?.id ?? null;
      interaction.style.cursor = hit?.cursor ?? "default";
    };
    const onTimelineWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey || !timelineMaxOffset(state)) return;
      const delta = e.shiftKey && !e.deltaX ? e.deltaY : Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : 0;
      if (!delta) return;
      const region = hits.hits.find(hit => hit.id === "tl-pan");
      if (!region) return;
      const p = point(e as unknown as PointerEvent), local = hits.local(region, p);
      if (local.x < 0 || local.x > EW || local.y < TIMELINE_Y || local.y > EH) return;
      e.preventDefault();
      const units = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? W : 1;
      const next = hits.local(region, { x: p.x + delta * units * dpr, y: p.y });
      state.timelineOffset = Math.max(0, Math.min(timelineMaxOffset(state), state.timelineOffset + next.x - local.x));
      timelinePanUntil = performance.now() + 1200;
      invalidate();
    };
    const onDown = (e: PointerEvent) => {
      if (e.button !== 0) return;
      const p = point(e);
      const hit = hits.find(p);
      if (!hit) return;
      hit.onDown?.(hits.local(hit, p));
      invalidate();
      if (hit.onDrag) {
        drag = hit;
        ui.active = hit.id;
        interaction.setPointerCapture(e.pointerId);
        e.preventDefault();
      }
    };
    const onUp = () => {
      if (drag?.id === "tl-scrollbar") timelinePanUntil = performance.now() + 1200;
      drag?.onUp?.();
      drag = null;
      ui.active = null;
    };
    const onLeave = () => {
      if (!drag) { ui.hover = null; invalidate(); }
    };
    const trackPointer = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const rect = canvasBounds;
      if (!rect) return;
      const next = { x: e.clientX - rect.left, y: e.clientY - rect.top };
      if (e.target instanceof Element && e.target.closest(".site-bar")) zoomToggled = false;
      if (zoomToggled && pointer) {
        const base = cameraAt(progress, W, H);
        const left = base.sx - base.wx * base.z, top = base.sy - base.wy * base.z;
        const right = left + EW * base.z, bottom = top + EH * base.z;
        const dx = next.x - pointer.x, dy = next.y - pointer.y;
        const edge = 32;
        // Pan only on outward movement in the visible editor's edge band.
        // Interior movement and a stationary pointer never move the camera.
        const innerLeft = Math.max(0, left * 2 - zoomAnchor.x) + edge;
        const innerRight = Math.min(W, right * 2 - zoomAnchor.x) - edge;
        const innerTop = Math.max(0, top * 2 - zoomAnchor.y) + edge;
        const innerBottom = Math.min(H, bottom * 2 - zoomAnchor.y) - edge;
        const panX = dx > 0 ? Math.max(0, next.x - Math.max(pointer.x, innerRight))
          : dx < 0 ? Math.min(0, next.x - Math.min(pointer.x, innerLeft)) : 0;
        const panY = dy > 0 ? Math.max(0, next.y - Math.max(pointer.y, innerBottom))
          : dy < 0 ? Math.min(0, next.y - Math.min(pointer.y, innerTop)) : 0;
        zoomAnchor.x = clamp(zoomAnchor.x + panX * 2, left, right);
        zoomAnchor.y = clamp(zoomAnchor.y + panY * 2, top, bottom);
      }
      pointer = next;
    };
    const releaseZoom = () => { zoomToggled = false; updateMagnify(); };
    const onWindowLeave = (event: PointerEvent) => { if (!event.relatedTarget) { releaseZoom(); pointer = null; } };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.repeat || e.key !== (mac ? "Meta" : "Control") || e.altKey || e.shiftKey || (mac ? e.ctrlKey : e.metaKey)) return;
      if (e.target instanceof Element && e.target.closest("input,textarea,select,[contenteditable]:not([contenteditable=false])")) return;
      if (zoomToggled) { releaseZoom(); return; }
      if (!desktopZoom.matches || !isOverview() || !visible || document.hidden) return;
      const base = cameraAt(progress, W, H);
      const left = base.sx - base.wx * base.z, top = base.sy - base.wy * base.z;
      const right = left + EW * base.z, bottom = top + EH * base.z;
      const origin = pointer ?? { x: (left + right) / 2, y: (top + bottom) / 2 };
      if (origin.x < left || origin.x > right || origin.y < top || origin.y > bottom) return;
      pointer = origin;
      zoomAnchor.x = origin.x;
      zoomAnchor.y = origin.y;
      zoomToggled = true;
      updateMagnify();
    };
    window.addEventListener("wheel", interruptOverviewSettle, { passive: true });
    window.addEventListener("touchstart", onSettleTouchStart, { passive: true });
    window.addEventListener("touchend", onSettleTouchEnd, { passive: true });
    window.addEventListener("touchcancel", onSettleTouchEnd, { passive: true });
    window.addEventListener("keydown", onSettleKey);
    window.addEventListener("pointermove", trackPointer, { passive: true });
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("pointerout", onWindowLeave);
    window.addEventListener("blur", releaseZoom);
    desktopZoom.addEventListener("change", releaseZoom);
    interaction.addEventListener("wheel", onTimelineWheel, { passive: false });
    interaction.addEventListener("pointermove", onMove);
    interaction.addEventListener("pointerdown", onDown);
    interaction.addEventListener("pointerup", onUp);
    interaction.addEventListener("pointercancel", onUp);
    interaction.addEventListener("pointerleave", onLeave);

    return () => {
      window.removeEventListener("wheel", interruptOverviewSettle);
      window.removeEventListener("touchstart", onSettleTouchStart);
      window.removeEventListener("touchend", onSettleTouchEnd);
      window.removeEventListener("touchcancel", onSettleTouchEnd);
      window.removeEventListener("keydown", onSettleKey);
      window.removeEventListener("pointermove", trackPointer);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("pointerout", onWindowLeave);
      window.removeEventListener("blur", releaseZoom);
      desktopZoom.removeEventListener("change", releaseZoom);
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      railObserver.disconnect();
      onRailEnd();
      rail?.removeEventListener("pointerdown", onRailDown, true);
      rail?.removeEventListener("pointermove", onRailMove);
      rail?.removeEventListener("pointerup", onRailEnd);
      rail?.removeEventListener("pointercancel", onRailEnd);
      rail?.removeEventListener("lostpointercapture", onRailEnd);
      rail?.removeEventListener("click", onRailClick, true);
      window.removeEventListener("blur", onRailBlur);
      stopTheme();
      stopCameraPlayback();
      blurGL?.canvas.remove();
      stopCaptionWarmup();
      preview.dispose();
      blurGL?.dispose();
      editorLayer.dispose();
      screenshotLayer.dispose();
      stopWarmup();
      disposeRecordedAppCaches();
      disposePanelShadows();


      canvas.style.opacity = "1";
      window.removeEventListener("xp-background-ready", invalidate);
      window.removeEventListener("xp-camera-frame-ready", invalidate);
      document.removeEventListener("visibilitychange", onVisibility);
      editorRef.current = null;
      interaction.removeEventListener("wheel", onTimelineWheel);
      interaction.removeEventListener("pointermove", onMove);
      interaction.removeEventListener("pointerdown", onDown);
      interaction.removeEventListener("pointerup", onUp);
      interaction.removeEventListener("pointercancel", onUp);
      interaction.removeEventListener("pointerleave", onLeave);
    };
  }, [showcase]);

  const jumpTo = (index: number) => {
    const root = rootRef.current;
    if (!root) return;
    const ch = CHAPTERS[index];
    if (ch.key === "keyboard" && editorRef.current) {
      editorRef.current.selection = { kind: "none" };
      editorRef.current.tab = 6;
    }
    const top = root.getBoundingClientRect().top + window.scrollY;
    const span = root.offsetHeight - window.innerHeight;
    const p = CHAPTER_STOPS[index];
    window.scrollTo({ top: top + span * p, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  };

  return (
    <section ref={rootRef} className="xp relative bg-background" id="zoom" style={{ height: "1000svh" }}>
      <SiteHeader copy={headerCopy} currentPath={currentPath} languageLabel={languageLabel} locale={locale} />
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <canvas ref={canvasRef} className="xp-canvas pointer-events-none absolute inset-0 h-full w-full" aria-label={showcase.title} />
        <div ref={interactionRef} className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div ref={editorHitRef} className="pointer-events-auto absolute" />
          <div ref={shotHitRef} className="pointer-events-auto absolute" style={{ display: "none" }} />
        </div>
        <div ref={zoomHintRef} className="xp-zoom-hint pointer-events-none absolute inset-x-0 flex items-center justify-center gap-2 text-sm text-muted-foreground" style={{ visibility: "hidden" }}>
          <kbd ref={zoomKeyRef}>⌘</kbd><span>{showcase.toggleZoom}</span>
        </div>

        {/* Hero */}
        <div ref={heroRef} className="xp-hero pointer-events-none absolute inset-x-0 top-[13svh] flex flex-col items-center px-6 text-center will-change-transform max-md:top-[15svh]">
          <p className="mg-label xp-rise" style={{ animationDelay: "60ms" }}>
            {copy.builtWithLabel} <span className="text-foreground">{copy.builtWithValue}</span> · {copy.systemLabel}{" "}
            <span className="text-foreground">{copy.systemValue}</span>
          </p>
          <h1 className="xp-title mt-5">
            {copy.titleLines.map(([a, b], i) => (
              <span key={i} className="xp-line block overflow-hidden">
                <span className="xp-line-in inline-block" style={{ animationDelay: `${140 + i * 110}ms` }}>
                  {a} {b}
                </span>
              </span>
            ))}
          </h1>
          <div className="xp-rise mt-8 flex flex-wrap items-center justify-center gap-3" style={{ animationDelay: "380ms" }}>
            <a href={appStoreUrl} target="_blank" rel="noopener noreferrer" className="xp-cta group pointer-events-auto">
              <AppleLogo />
              {copy.appStoreButton}
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
            <a href={microsoftStoreUrl} target="_blank" rel="noopener noreferrer" className="xp-cta xp-cta-ghost store-beta-host group pointer-events-auto">
              <WindowsLogo />
              {getStoreCopy(locale).microsoftStoreButton}
              <BetaTag locale={locale} />
            </a>
          </div>
        </div>

        {/* Overview title (editor revealed / outro) */}
        <div ref={overviewRef} className="xp-overview pointer-events-none absolute inset-x-0 top-[10svh] flex flex-col items-center px-6 text-center" style={{ opacity: 0, visibility: "hidden" }}>
          <h2 className="xp-h2">{showcase.title}</h2>
        </div>

        {/* Chapter cards */}
        {showcaseFeatureOrder.map((key, i) => {
          const item = showcase.items[key];
          return (
            <div
              key={key}
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
              className="xp-card pointer-events-none absolute left-[5vw] top-1/2 w-[28vw] max-w-[440px] -translate-y-1/2 max-[899px]:inset-x-5 max-[899px]:bottom-[6svh] max-[899px]:top-auto max-[899px]:w-auto max-[899px]:max-w-none max-[899px]:translate-y-0"
              style={{ opacity: 0, visibility: "hidden" }}
            >
              <p className="mg-label tabular-nums">
                <span className="text-[var(--accent)]">{String(i + 1).padStart(2, "0")}</span> / {String(showcaseFeatureOrder.length).padStart(2, "0")} · {item.label}
              </p>
              <h3 className="xp-h3 mt-4">{item.title}</h3>
              <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">{item.body}</p>
              {key === "keyboard" && (
                <div className="pointer-events-auto mt-5 flex flex-wrap gap-2" role="group" aria-label={item.label}>
                  {KEY_STYLES.map((style, index) => (
                    <button key={style} type="button" className="xp-demo-button" aria-pressed={demo.style === index}
                      onClick={() => { if (editorRef.current) editorRef.current.keys.style = index as KeyStyle; }}>
                      {style}
                    </button>
                  ))}
                  <button type="button" className="xp-demo-button" onClick={() => {
                    jumpTo(i);
                  }}>{showcase.replay}</button>
                </div>
              )}
              {key === "camera" && (
                <div className="pointer-events-auto mt-5 flex flex-wrap gap-2" role="group" aria-label={item.label}>
                  <button type="button" className="xp-demo-button" aria-pressed={demo.remove} onClick={() => {
                    const state = editorRef.current;
                    if (state) {
                      state.camera.remove = !state.camera.remove;
                      state.camera.changedAt = -1e9;
                    }
                  }}>{showcase.removeBackground}</button>
                  <button type="button" className="xp-demo-button" aria-pressed={demo.sticker} disabled={!demo.remove} onClick={() => {
                    if (editorRef.current) editorRef.current.camera.sticker = !editorRef.current.camera.sticker;
                  }}>{showcase.sticker}</button>
                </div>
              )}
            </div>
          );
        })}

        {/* Chapter rail */}
        <div ref={railRef} className="absolute bottom-8 left-[5vw] hidden gap-1 min-[900px]:flex" style={{ opacity: 0, visibility: "hidden" }}>
          <div ref={railIndicatorRef} className="xp-rail-indicator" aria-hidden="true"><div ref={railIndicatorFillRef} className="xp-rail-indicator-fill" /></div>
          {showcaseFeatureOrder.map((key, i) => (
            <button
              key={key}
              type="button"
              onClick={() => jumpTo(i)}
              className={`xp-rail-item ${active === i ? "is-active" : ""}`}
              aria-current={active === i ? "step" : undefined}
            >
              <span>{showcase.items[key].label}</span>
              <span className="xp-rail-item-drag-label" aria-hidden="true">{showcase.items[key].label}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
