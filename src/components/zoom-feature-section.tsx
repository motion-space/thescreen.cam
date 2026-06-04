"use client";

import { motion } from "framer-motion";
import { useCallback, useEffect, useRef } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import type { ZoomFeatureCopy } from "../lib/translations";

type ZoomFeatureSectionProps = {
  copy: ZoomFeatureCopy;
};

export function ZoomFeatureSection({ copy }: ZoomFeatureSectionProps) {
  return (
    <section id="zoom" className="relative min-h-screen bg-background py-32 overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="mb-24"
        >
          <h2 className="text-[clamp(2rem,5vw,4rem)] font-bold leading-[1.1] tracking-tight text-foreground max-w-3xl text-balance">
            {copy.title}
            <br />
            <span className="text-muted-foreground">{copy.subtitle}</span>
          </h2>
        </motion.div>

        <CanvasZoomDemo copy={copy} />

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {copy.features.map((feature, i) => (
            <div key={feature.title} className="group">
              <div className="flex items-start gap-4">
                <span className="text-muted-foreground/40 text-sm font-mono">0{i + 1}</span>
                <div>
                  <h3 className="text-foreground font-medium mb-2 group-hover:text-accent transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

type Point = {
  x: number;
  y: number;
};

type SpringSettings = {
  mass: number;
  stiffness: number;
  damping: number;
};

type MotionFrame = {
  timeMs: number;
  cursor: Point;
  cameraFocus: Point;
  zoom: number;
  pressScale: number;
};

type CameraShaderMotionBlur = {
  panMotion: Point;
  zoomMotion: number;
  focusPoint: Point;
  strength: number;
};

type CursorMotionBlurVector = {
  dx: number;
  dy: number;
  strength: number;
};

type CameraMotionBlurStats = {
  sampleCount: number;
  strength: number;
  visibleMotionLength: number;
};

type ZoomProfileFrame = {
  cameraMotionPx: number;
  cameraSamples: number;
  cameraStrength: number;
  cursorSamples: number;
  dpr: number;
  rafDeltaMs: number;
  renderMs: number;
  timeMs: number;
};

type ZoomProfileState = {
  done: boolean;
  frames: ZoomProfileFrame[];
  mode: "full" | "tail";
};

declare global {
  interface Window {
    __screenCamZoomProfile?: ZoomProfileState;
  }
}

type UIElement = {
  type: "rect" | "circle";
  x: number;
  y: number;
  w: number;
  h: number;
  color: string;
  radius?: number;
};

type ClipPalette = {
  fill: string;
  fillOpacity: number;
  border: string;
  borderOpacity: number;
  accent: string;
  handleOpacity: number;
  shadowOpacity: number;
};

type ClickEvent = {
  timeMs: number;
  position: Point;
};

const CAMERA_SPRING: SpringSettings = { mass: 2.25, stiffness: 210, damping: 41 };
const CURSOR_SPRING: SpringSettings = { mass: 3, stiffness: 470, damping: 70 };
const CLICK_SPRING: SpringSettings = { mass: 1, stiffness: 700, damping: 30 };

const CAMERA_SETTLE_MS = 505;
const AUTO_ZOOM_MS = 780;
const DEMO_DURATION_MS = 7000;
const ZOOM_SCALE = 2;
const ZOOM_CLIP_START_MS = 900;
const ZOOM_CLIP_END_MS = 6680;
const FINAL_ZOOM_OUT_MS = 560;
const ZOOM_OUT_START_MS = ZOOM_CLIP_END_MS - FINAL_ZOOM_OUT_MS;
const CAMERA_RETURN_START_MS = ZOOM_OUT_START_MS - CAMERA_SETTLE_MS;
const CAMERA_MOTION_BLUR_STRENGTH = 50;
const CAMERA_MOTION_BLUR_TRANSITION_MS = 260;
const CURSOR_MOTION_BLUR_STRENGTH = 50;
const MAX_DEMO_PLAYBACK_STEP_MS = 1000 / 60;
const CAMERA_MOTION_BLUR_MIN_VISIBLE_PX = 1.6;
const CAMERA_MOTION_BLUR_FULL_SAMPLE_PX = 28;
const CAMERA_MOTION_BLUR_MIN_SAMPLE_COUNT = 3;
const CAMERA_MOTION_BLUR_MAX_SAMPLE_COUNT = 7;
const CURSOR_MOTION_BLUR_FULL_SAMPLE_PX = 34;
const CURSOR_MOTION_BLUR_MIN_SAMPLE_COUNT = 5;
const CURSOR_MOTION_BLUR_MAX_SAMPLE_COUNT = 13;

const POINTS = {
  center: { x: 0.5, y: 0.5 },
  first: { x: 0.25, y: 0.35 },
  second: { x: 0.7, y: 0.45 },
  third: { x: 0.5, y: 0.7 },
} satisfies Record<string, Point>;

const CLICK_EVENTS: ClickEvent[] = [
  { timeMs: 1050, position: POINTS.first },
  { timeMs: 3050, position: POINTS.second },
  { timeMs: 4550, position: POINTS.third },
];

const CURSOR_PATH = [
  { timeMs: 0, position: POINTS.center },
  { timeMs: 250, position: POINTS.center },
  { timeMs: 780, position: POINTS.first },
  { timeMs: 2250, position: POINTS.first },
  { timeMs: 2850, position: POINTS.second },
  { timeMs: 3750, position: POINTS.second },
  { timeMs: 4300, position: POINTS.third },
  { timeMs: CAMERA_RETURN_START_MS, position: POINTS.third },
  { timeMs: ZOOM_OUT_START_MS, position: POINTS.center },
  { timeMs: DEMO_DURATION_MS, position: POINTS.center },
];

const CAMERA_SEGMENTS = [
  { startMs: 0, endMs: ZOOM_CLIP_START_MS, fromFocus: POINTS.center, toFocus: POINTS.center, fromZoom: 1, toZoom: 1 },
  { startMs: ZOOM_CLIP_START_MS, endMs: ZOOM_CLIP_START_MS + AUTO_ZOOM_MS, fromFocus: POINTS.center, toFocus: POINTS.first, fromZoom: 1, toZoom: ZOOM_SCALE },
  { startMs: ZOOM_CLIP_START_MS + AUTO_ZOOM_MS, endMs: 2400, fromFocus: POINTS.first, toFocus: POINTS.first, fromZoom: ZOOM_SCALE, toZoom: ZOOM_SCALE },
  { startMs: 2400, endMs: 2400 + CAMERA_SETTLE_MS, fromFocus: POINTS.first, toFocus: POINTS.second, fromZoom: ZOOM_SCALE, toZoom: ZOOM_SCALE },
  { startMs: 2400 + CAMERA_SETTLE_MS, endMs: 3900, fromFocus: POINTS.second, toFocus: POINTS.second, fromZoom: ZOOM_SCALE, toZoom: ZOOM_SCALE },
  { startMs: 3900, endMs: 3900 + CAMERA_SETTLE_MS, fromFocus: POINTS.second, toFocus: POINTS.third, fromZoom: ZOOM_SCALE, toZoom: ZOOM_SCALE },
  { startMs: 3900 + CAMERA_SETTLE_MS, endMs: CAMERA_RETURN_START_MS, fromFocus: POINTS.third, toFocus: POINTS.third, fromZoom: ZOOM_SCALE, toZoom: ZOOM_SCALE },
  { startMs: CAMERA_RETURN_START_MS, endMs: ZOOM_OUT_START_MS, fromFocus: POINTS.third, toFocus: POINTS.center, fromZoom: ZOOM_SCALE, toZoom: ZOOM_SCALE },
  { startMs: ZOOM_OUT_START_MS, endMs: ZOOM_CLIP_END_MS, fromFocus: POINTS.center, toFocus: POINTS.center, fromZoom: ZOOM_SCALE, toZoom: 1 },
  { startMs: ZOOM_CLIP_END_MS, endMs: DEMO_DURATION_MS, fromFocus: POINTS.center, toFocus: POINTS.center, fromZoom: 1, toZoom: 1 },
];

const TRACK_PALETTES = {
  recording: {
    fill: "#C7C7C7",
    fillOpacity: 0.23,
    border: "#A5A5A5",
    borderOpacity: 1,
    accent: "#A8A8A8",
    handleOpacity: 0.74,
    shadowOpacity: 0.12,
  },
  zoom: {
    fill: "#AF8403",
    fillOpacity: 0.36,
    border: "#FFA617",
    borderOpacity: 0.8,
    accent: "#FFA617",
    handleOpacity: 0.78,
    shadowOpacity: 0.13,
  },
} satisfies Record<string, ClipPalette>;

let timelineStaticCache: {
  width: number;
  height: number;
  dpr: number;
  labelsKey: string;
  canvas: HTMLCanvasElement;
} | null = null;

const CURSOR_PATH_D = "M5.68284 7.01936C4.94286 5.0167 6.8917 3.06786 8.89436 3.80784L24.3838 9.53113C26.8274 10.434 26.4334 14.0052 23.8518 14.3537L19.0235 15.0055C17.9082 15.156 17.031 16.0332 16.8805 17.1485L16.2287 21.9768C15.8802 24.5584 12.309 24.9524 11.4061 22.5088L5.68284 7.01936Z";
const CURSOR_HOTSPOT = { x: 5.68, y: 7.02 };
let cursorPathCache: Path2D | null = null;

function getCursorPath() {
  if (typeof Path2D === "undefined") return null;
  cursorPathCache ??= new Path2D(CURSOR_PATH_D);
  return cursorPathCache;
}

function CanvasZoomDemo({ copy }: { copy: ZoomFeatureCopy }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const timelineCanvasRef = useRef<HTMLCanvasElement>(null);
  const timelineContainerRef = useRef<HTMLDivElement>(null);
  const frameCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const cameraBlurCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number>(0);
  const isDemoVisibleRef = useRef(false);
  const isRenderLoopRunningRef = useRef(false);
  const hasInitializedPlaybackRef = useRef(false);
  const lastPlaybackTimestampRef = useRef<number | null>(null);
  const playTimeRef = useRef(0);
  const previewTimeRef = useRef<number | null>(null);
  const activeTimelinePointerRef = useRef<number | null>(null);
  const activeTimelineTouchRef = useRef<number | null>(null);
  const uiElementsRef = useRef<UIElement[]>([]);
  const zoomProfileRef = useRef<ZoomProfileState | false | null>(null);
  const zoomProfileLastTimestampRef = useRef<number | null>(null);

  const generateUIElements = useCallback((width: number, height: number) => {
    const elements: UIElement[] = [];

    elements.push({ type: "circle", x: 30, y: 25, w: 12, h: 12, color: "rgba(239, 68, 68, 0.7)" });
    elements.push({ type: "circle", x: 52, y: 25, w: 12, h: 12, color: "rgba(234, 179, 8, 0.7)" });
    elements.push({ type: "circle", x: 74, y: 25, w: 12, h: 12, color: "rgba(34, 197, 94, 0.7)" });
    elements.push({ type: "rect", x: width * 0.3, y: 18, w: width * 0.4, h: 20, color: "rgba(255,255,255,0.05)", radius: 6 });

    const sidebarWidths = [128, 156, 138, 118, 146, 132];
    for (let i = 0; i < sidebarWidths.length; i += 1) {
      elements.push({
        type: "rect",
        x: 25,
        y: 70 + i * 40,
        w: sidebarWidths[i],
        h: 28,
        color: i === 2 ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.04)",
        radius: 8,
      });
    }

    elements.push({ type: "rect", x: 220, y: 70, w: width * 0.25, h: 32, color: "rgba(255,255,255,0.1)", radius: 8 });
    elements.push({ type: "rect", x: 220, y: 115, w: width * 0.4, h: 14, color: "rgba(255,255,255,0.05)", radius: 4 });

    const cardStartX = 220;
    const cardStartY = 160;
    const gap = 16;
    const cardWidth = Math.max(64, (width - cardStartX - 80) / 3);
    const cardHeight = Math.max(72, (height - cardStartY - 60) / 2);

    for (let row = 0; row < 2; row += 1) {
      for (let col = 0; col < 3; col += 1) {
        const x = cardStartX + col * (cardWidth + gap);
        const y = cardStartY + row * (cardHeight + gap);
        const isAccent = row === 0 && col === 0;

        elements.push({ type: "rect", x, y, w: cardWidth, h: cardHeight, color: "rgba(255,255,255,0.03)", radius: 12 });
        elements.push({
          type: "rect",
          x: x + 16,
          y: y + 16,
          w: 32,
          h: 32,
          color: isAccent ? "rgba(255, 166, 23, 0.34)" : "rgba(220, 80, 60, 0.24)",
          radius: 8,
        });
        elements.push({
          type: "rect",
          x: x + 16,
          y: y + cardHeight - 44,
          w: cardWidth - 32,
          h: 10,
          color: "rgba(255,255,255,0.08)",
          radius: 4,
        });
        elements.push({
          type: "rect",
          x: x + 16,
          y: y + cardHeight - 26,
          w: (cardWidth - 32) * 0.6,
          h: 10,
          color: "rgba(255,255,255,0.04)",
          radius: 4,
        });
      }
    }

    uiElementsRef.current = elements;
  }, []);

  const drawCursor = useCallback((ctx: CanvasRenderingContext2D, x: number, y: number, scale: number, alpha = 1) => {
    const cursorPath = getCursorPath();

    ctx.save();
    ctx.globalAlpha *= alpha;
    ctx.translate(x, y);
    ctx.scale(scale, scale);
    ctx.translate(-CURSOR_HOTSPOT.x, -CURSOR_HOTSPOT.y);
    ctx.fillStyle = "#FFA617";
    ctx.strokeStyle = "#FFFFFF";
    ctx.lineWidth = 1.66667;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";

    if (cursorPath) {
      ctx.fill(cursorPath);
      ctx.stroke(cursorPath);
    } else {
      ctx.beginPath();
      ctx.moveTo(5.68, 7.02);
      ctx.lineTo(24.38, 9.53);
      ctx.lineTo(16.88, 17.15);
      ctx.lineTo(16.23, 21.98);
      ctx.lineTo(11.41, 22.51);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }

    ctx.restore();
  }, []);

  const drawUIElements = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
    for (const el of uiElementsRef.current) {
      ctx.fillStyle = el.color;
      if (el.type === "circle") {
        ctx.beginPath();
        ctx.arc(el.x + el.w / 2, el.y + el.h / 2, el.w / 2, 0, Math.PI * 2);
        ctx.fill();
      } else {
        roundRect(ctx, el.x, el.y, el.w, el.h, el.radius || 0);
        ctx.fill();
      }
    }

    ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
    ctx.lineWidth = 1;
    roundRect(ctx, 0, 0, width, height, 0);
    ctx.stroke();
  }, []);

  const drawTransformedFrame = useCallback((
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    frame: MotionFrame,
    alpha: number
  ) => {
    const focusPx = {
      x: frame.cameraFocus.x * width,
      y: frame.cameraFocus.y * height,
    };

    ctx.save();
    ctx.globalAlpha *= alpha;
    ctx.translate(focusPx.x, focusPx.y);
    ctx.scale(frame.zoom, frame.zoom);
    ctx.translate(-focusPx.x, -focusPx.y);
    drawUIElements(ctx, width, height);
    ctx.restore();
  }, [drawUIElements]);

  const drawCursorWithBlur = useCallback((
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    frame: MotionFrame
  ): number => {
    const point = projectPoint(frame.cursor, frame, width, height);
    const scale = 1.5 * frame.pressScale;
    const vector = cursorMotionBlurVector(frame, width, height);

    if (vector) {
      return drawCursorDirectionalMotionBlur(ctx, drawCursor, point.x, point.y, scale, vector);
    }

    drawCursor(ctx, point.x, point.y, scale);
    return 1;
  }, [drawCursor]);

  const render = useCallback((timestamp: number) => {
    if (!isRenderLoopRunningRef.current) return;

    const canvas = canvasRef.current;
    const preview = previewRef.current;
    if (!canvas || !preview) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (zoomProfileRef.current === null) {
      zoomProfileRef.current = createZoomProfileState();
    }
    const zoomProfile = zoomProfileRef.current || null;
    const renderStartMs = zoomProfile ? performance.now() : 0;
    const rafDeltaMs = zoomProfile && zoomProfileLastTimestampRef.current !== null
      ? timestamp - zoomProfileLastTimestampRef.current
      : 0;
    if (zoomProfile) {
      zoomProfileLastTimestampRef.current = timestamp;
    }

    if (!hasInitializedPlaybackRef.current) {
      hasInitializedPlaybackRef.current = true;
      lastPlaybackTimestampRef.current = timestamp;
      if (zoomProfile?.mode === "tail") {
        playTimeRef.current = CAMERA_RETURN_START_MS - 160;
      }
    }

    const rect = preview.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    if (width <= 0 || height <= 0) {
      if (isRenderLoopRunningRef.current) {
        animationRef.current = requestCanvasFrame(render);
      }
      return;
    }

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const targetWidth = Math.round(width * dpr);
    const targetHeight = Math.round(height * dpr);

    if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      generateUIElements(width, height);
    }

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    if (previewTimeRef.current === null) {
      const previousTimestamp = lastPlaybackTimestampRef.current ?? timestamp;
      const elapsedMs = Math.max(0, timestamp - previousTimestamp);
      playTimeRef.current = wrapTime(playTimeRef.current + Math.min(elapsedMs, MAX_DEMO_PLAYBACK_STEP_MS));
      lastPlaybackTimestampRef.current = timestamp;
    } else {
      lastPlaybackTimestampRef.current = timestamp;
    }

    const playTimeMs = playTimeRef.current;
    if (previewTimeRef.current === null) {
      playTimeRef.current = playTimeMs;
    }
    const effectiveTimeMs = previewTimeRef.current ?? playTimeMs;
    const frame = sampleMotionFrame(effectiveTimeMs);

    const frameCanvas = ensureScratchCanvas(frameCanvasRef, targetWidth, targetHeight);
    const frameCtx = frameCanvas.getContext("2d");
    if (!frameCtx) {
      if (isRenderLoopRunningRef.current) {
        animationRef.current = requestCanvasFrame(render);
      }
      return;
    }

    frameCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    frameCtx.clearRect(0, 0, width, height);
    frameCtx.fillStyle = "#141414";
    frameCtx.fillRect(0, 0, width, height);
    drawTransformedFrame(frameCtx, width, height, frame, 1);

    const cameraBlurStats = drawCameraShaderMotionBlur(
      ctx,
      frameCanvas,
      cameraBlurCanvasRef,
      width,
      height,
      targetWidth,
      targetHeight,
      dpr,
      cameraShaderMotionBlur(effectiveTimeMs, frame, width, height)
    );

    const cursorSampleCount = drawCursorWithBlur(ctx, width, height, frame);
    drawZoomBadge(ctx, width, frame.zoom);
    drawStatusBadge(
      ctx,
      width,
      height,
      previewTimeRef.current === null ? copy.canvasLabels.autoPlayingDemo : copy.canvasLabels.timelinePreview,
      timestamp
    );
    drawTimelineCanvas(timelineCanvasRef.current, timelineContainerRef.current, playTimeMs, previewTimeRef.current, copy);
    if (zoomProfile) {
      recordZoomProfileFrame(zoomProfile, {
        cameraMotionPx: cameraBlurStats.visibleMotionLength,
        cameraSamples: cameraBlurStats.sampleCount,
        cameraStrength: cameraBlurStats.strength,
        cursorSamples: cursorSampleCount,
        dpr,
        rafDeltaMs,
        renderMs: performance.now() - renderStartMs,
        timeMs: effectiveTimeMs,
      });
    }

    if (isRenderLoopRunningRef.current) {
      animationRef.current = requestCanvasFrame(render);
    }
  }, [copy, drawCursorWithBlur, drawTransformedFrame, generateUIElements]);

  const previewTimelineAtClientX = useCallback((clientX: number) => {
    previewTimeRef.current = timelineTimeFromClientX(timelineContainerRef.current, clientX);
  }, []);

  const resumeTimelinePlayback = useCallback(() => {
    previewTimeRef.current = null;
    lastPlaybackTimestampRef.current = performance.now();
  }, []);

  const seekTimelineToClientX = useCallback((clientX: number) => {
    const timeMs = timelineTimeFromClientX(timelineContainerRef.current, clientX);
    playTimeRef.current = timeMs;
    previewTimeRef.current = timeMs;
    lastPlaybackTimestampRef.current = performance.now();
  }, []);

  const handleTimelinePointerMove = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    const activePointerId = activeTimelinePointerRef.current;
    if (activePointerId !== null) {
      if (event.pointerId !== activePointerId) return;
      seekTimelineToClientX(event.clientX);
      event.preventDefault();
      return;
    }

    previewTimelineAtClientX(event.clientX);
  }, [previewTimelineAtClientX, seekTimelineToClientX]);

  const handleTimelinePointerLeave = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse" || activeTimelinePointerRef.current !== null) return;
    resumeTimelinePlayback();
  }, [resumeTimelinePlayback]);

  const handleTimelinePointerDown = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    activeTimelinePointerRef.current = event.pointerId;
    event.currentTarget.setPointerCapture(event.pointerId);
    seekTimelineToClientX(event.clientX);
    event.preventDefault();
  }, [seekTimelineToClientX]);

  const handleTimelinePointerUp = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    if (activeTimelinePointerRef.current !== event.pointerId) return;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    activeTimelinePointerRef.current = null;

    if (event.pointerType !== "mouse") {
      resumeTimelinePlayback();
    }
  }, [resumeTimelinePlayback]);

  const handleTimelinePointerCancel = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    if (activeTimelinePointerRef.current !== event.pointerId) return;
    activeTimelinePointerRef.current = null;
    resumeTimelinePlayback();
  }, [resumeTimelinePlayback]);

  const getActiveTimelineTouch = useCallback((touches: TouchList) => {
    const activeTouchId = activeTimelineTouchRef.current;
    if (activeTouchId === null) return touches.item(0);

    for (let index = 0; index < touches.length; index += 1) {
      const touch = touches.item(index);
      if (touch?.identifier === activeTouchId) return touch;
    }

    return null;
  }, []);

  const changedTouchesIncludeActiveTimelineTouch = useCallback((touches: TouchList) => {
    const activeTouchId = activeTimelineTouchRef.current;
    if (activeTouchId === null) return touches.length > 0;

    for (let index = 0; index < touches.length; index += 1) {
      if (touches.item(index)?.identifier === activeTouchId) return true;
    }

    return false;
  }, []);

  const handleTimelineTouchStart = useCallback((event: TouchEvent) => {
    const touch = event.touches.item(0);
    if (!touch) return;

    activeTimelineTouchRef.current = touch.identifier;
    seekTimelineToClientX(touch.clientX);
    event.preventDefault();
  }, [seekTimelineToClientX]);

  const handleTimelineTouchMove = useCallback((event: TouchEvent) => {
    const touch = getActiveTimelineTouch(event.touches);
    if (!touch) return;

    seekTimelineToClientX(touch.clientX);
    event.preventDefault();
  }, [getActiveTimelineTouch, seekTimelineToClientX]);

  const handleTimelineTouchEnd = useCallback((event: TouchEvent) => {
    if (!changedTouchesIncludeActiveTimelineTouch(event.changedTouches)) return;

    activeTimelineTouchRef.current = null;
    if (activeTimelinePointerRef.current === null) {
      resumeTimelinePlayback();
    }
    event.preventDefault();
  }, [changedTouchesIncludeActiveTimelineTouch, resumeTimelinePlayback]);

  useEffect(() => {
    const timeline = timelineContainerRef.current;
    if (!timeline) return;

    const options = { passive: false };
    timeline.addEventListener("touchstart", handleTimelineTouchStart, options);
    timeline.addEventListener("touchmove", handleTimelineTouchMove, options);
    timeline.addEventListener("touchend", handleTimelineTouchEnd, options);
    timeline.addEventListener("touchcancel", handleTimelineTouchEnd, options);

    return () => {
      timeline.removeEventListener("touchstart", handleTimelineTouchStart);
      timeline.removeEventListener("touchmove", handleTimelineTouchMove);
      timeline.removeEventListener("touchend", handleTimelineTouchEnd);
      timeline.removeEventListener("touchcancel", handleTimelineTouchEnd);
    };
  }, [handleTimelineTouchEnd, handleTimelineTouchMove, handleTimelineTouchStart]);

  useEffect(() => {
    const start = () => {
      if (isRenderLoopRunningRef.current || !isDemoVisibleRef.current || document.hidden) return;
      isRenderLoopRunningRef.current = true;
      animationRef.current = requestCanvasFrame(render);
    };

    const stop = () => {
      isRenderLoopRunningRef.current = false;
      if (animationRef.current) {
        cancelCanvasFrame(animationRef.current);
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        isDemoVisibleRef.current = entry.isIntersecting;
        if (entry.isIntersecting) {
          start();
        } else {
          stop();
        }
      },
      { rootMargin: "80px 0px" }
    );

    if (previewRef.current) {
      observer.observe(previewRef.current);
    }

    const handleVisibilityChange = () => {
      if (document.hidden) {
        stop();
      } else {
        start();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      stop();
    };
  }, [render]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
    >
      <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-[#101010] shadow-2xl shadow-black/30">
        <div
          ref={previewRef}
          className="relative aspect-video overflow-hidden bg-[#141414]"
        >
          <canvas
            ref={canvasRef}
            className="absolute inset-0 h-full w-full"
          />
        </div>

        <div
          ref={timelineContainerRef}
          className="relative h-[217px] cursor-pointer select-none touch-none border-t border-white/[0.07] bg-[#101010]/95 [box-shadow:inset_0_1px_0_rgba(255,255,255,0.04)]"
          data-screen-cam-drag-surface
          onPointerMove={handleTimelinePointerMove}
          onPointerLeave={handleTimelinePointerLeave}
          onPointerDown={handleTimelinePointerDown}
          onPointerUp={handleTimelinePointerUp}
          onPointerCancel={handleTimelinePointerCancel}
          style={{ touchAction: "none" }}
          aria-label={copy.timelineAria}
        >
          <canvas
            ref={timelineCanvasRef}
            className="pointer-events-none absolute inset-0 h-full w-full"
          />
        </div>
      </div>
    </motion.div>
  );
}

type TimelineLayout = {
  width: number;
  height: number;
  marginX: number;
  labelWidth: number;
  contentX: number;
  contentRight: number;
  contentWidth: number;
  markerTop: number;
  markerBottom: number;
  rulerY: number;
  rowHeight: number;
  clipHeight: number;
  firstTrackY: number;
  secondTrackY: number;
};

type TimelineMarkerLabelBox = {
  x: number;
  y: number;
  width: number;
  height: number;
};

function timelineLayout(width: number, height: number): TimelineLayout {
  const marginX = width >= 768 ? 40 : 16;
  const labelWidth = 78;
  const contentX = labelWidth + marginX;
  const contentRight = Math.max(contentX + 1, width - marginX);
  const rulerY = 16;
  const rulerHeight = 34;
  const trackPaddingY = 18;
  const rowHeight = 48;
  const trackGap = 18;
  const firstTrackY = rulerY + rulerHeight + trackPaddingY;

  return {
    width,
    height,
    marginX,
    labelWidth,
    contentX,
    contentRight,
    contentWidth: Math.max(1, contentRight - contentX),
    markerTop: 16,
    markerBottom: height - 16,
    rulerY,
    rowHeight,
    clipHeight: 34,
    firstTrackY,
    secondTrackY: firstTrackY + rowHeight + trackGap,
  };
}

function timelineTimeFromClientX(container: HTMLDivElement | null, clientX: number): number {
  if (!container) return 0;

  const rect = container.getBoundingClientRect();
  const layout = timelineLayout(rect.width, rect.height);
  const progress = clamp((clientX - rect.left - layout.contentX) / layout.contentWidth, 0, 1);
  return progress * DEMO_DURATION_MS;
}

function drawTimelineCanvas(
  canvas: HTMLCanvasElement | null,
  container: HTMLDivElement | null,
  playTimeMs: number,
  previewTimeMs: number | null,
  copy: ZoomFeatureCopy
) {
  if (!canvas || !container) return;

  const rect = container.getBoundingClientRect();
  const width = rect.width;
  const height = rect.height;
  if (width <= 0 || height <= 0) return;

  const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
  const targetWidth = Math.round(width * dpr);
  const targetHeight = Math.round(height * dpr);
  if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
  }

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const layout = timelineLayout(width, height);
  const staticCanvas = getTimelineStaticCanvas(layout, dpr, targetWidth, targetHeight, copy);

  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, targetWidth, targetHeight);
  ctx.drawImage(staticCanvas, 0, 0);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const playLabelBox = timelineMarkerLabelBox(ctx, layout, playTimeMs, "play", copy);
  if (previewTimeMs !== null) {
    drawTimelineMarker(ctx, layout, previewTimeMs, "preview", copy, {
      showLabel: true,
      avoidLabelBox: playLabelBox,
    });
  }
  drawTimelineMarker(ctx, layout, playTimeMs, "play", copy, { showLabel: true });
}

function getTimelineStaticCanvas(
  layout: TimelineLayout,
  dpr: number,
  targetWidth: number,
  targetHeight: number,
  copy: ZoomFeatureCopy
): HTMLCanvasElement {
  const labelsKey = JSON.stringify(copy.canvasLabels);

  if (
    timelineStaticCache &&
    timelineStaticCache.width === targetWidth &&
    timelineStaticCache.height === targetHeight &&
    timelineStaticCache.dpr === dpr &&
    timelineStaticCache.labelsKey === labelsKey
  ) {
    return timelineStaticCache.canvas;
  }

  const staticCanvas = document.createElement("canvas");
  staticCanvas.width = targetWidth;
  staticCanvas.height = targetHeight;
  const staticCtx = staticCanvas.getContext("2d");
  if (!staticCtx) return staticCanvas;

  staticCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
  staticCtx.fillStyle = "rgba(16, 16, 16, 0.96)";
  staticCtx.fillRect(0, 0, layout.width, layout.height);
  drawTimelineRuler(staticCtx, layout);
  drawTimelineTrack(
    staticCtx,
    layout,
    layout.firstTrackY,
    copy.canvasLabels.recordingTrack,
    copy.canvasLabels.recordingClip,
    0,
    DEMO_DURATION_MS,
    TRACK_PALETTES.recording
  );
  drawTimelineTrack(
    staticCtx,
    layout,
    layout.secondTrackY,
    copy.canvasLabels.zoomTrack,
    copy.canvasLabels.zoomClip,
    ZOOM_CLIP_START_MS,
    ZOOM_CLIP_END_MS,
    TRACK_PALETTES.zoom,
    CLICK_EVENTS.map((event) => event.timeMs)
  );

  timelineStaticCache = {
    width: targetWidth,
    height: targetHeight,
    dpr,
    labelsKey,
    canvas: staticCanvas,
  };
  return staticCanvas;
}

function drawTimelineRuler(ctx: CanvasRenderingContext2D, layout: TimelineLayout) {
  const ticks = buildTimelineTicks(DEMO_DURATION_MS, layout.contentWidth);

  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = "500 10px ui-monospace, SFMono-Regular, Menlo, monospace";

  for (const tick of ticks) {
    const x = layout.contentX + (tick.timeMs / DEMO_DURATION_MS) * layout.contentWidth;
    const isMajor = tick.isMajor;
    const lineY = layout.rulerY + (isMajor ? 18 : 24);
    const lineHeight = isMajor ? 16 : 8;

    ctx.save();
    ctx.globalAlpha = isMajor ? 0.2 : 0.11;
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x, lineY);
    ctx.lineTo(x, lineY + lineHeight);
    ctx.stroke();
    ctx.restore();

    if (isMajor) {
      const labelX = clamp(x, layout.contentX + 32, layout.contentRight - 32);

      ctx.fillStyle = "rgba(255, 255, 255, 0.45)";
      ctx.fillText(formatTimelineTime(tick.timeMs, tick.majorInterval), labelX, layout.rulerY + 8);
    }
  }
}

function drawTimelineTrack(
  ctx: CanvasRenderingContext2D,
  layout: TimelineLayout,
  rowY: number,
  label: string,
  clipLabel: string,
  startMs: number,
  endMs: number,
  palette: ClipPalette,
  anchors: number[] = []
) {
  const trackY = rowY + (layout.rowHeight - layout.clipHeight) / 2;
  const clipX = layout.contentX + (startMs / DEMO_DURATION_MS) * layout.contentWidth;
  const clipW = Math.max(40, ((endMs - startMs) / DEMO_DURATION_MS) * layout.contentWidth);

  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.font = "600 11px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillStyle = "rgba(255, 255, 255, 0.40)";
  ctx.fillText(label, 12, rowY + layout.rowHeight / 2);

  ctx.fillStyle = "rgba(255, 255, 255, 0.03)";
  ctx.strokeStyle = "rgba(255, 255, 255, 0.06)";
  ctx.lineWidth = 1;
  roundRect(ctx, layout.contentX, trackY, layout.contentWidth, layout.clipHeight, 13);
  ctx.fill();
  ctx.stroke();

  ctx.save();
  ctx.shadowColor = `rgba(0, 0, 0, ${palette.shadowOpacity})`;
  ctx.shadowBlur = 14;
  ctx.shadowOffsetY = 5;
  ctx.fillStyle = hexToRgba(palette.fill, palette.fillOpacity);
  ctx.strokeStyle = hexToRgba(palette.border, palette.borderOpacity);
  roundRect(ctx, clipX, trackY, clipW, layout.clipHeight, 13);
  ctx.fill();
  ctx.stroke();
  ctx.restore();

  ctx.save();
  roundRect(ctx, clipX, trackY, clipW, layout.clipHeight, 13);
  ctx.clip();

  ctx.fillStyle = hexToRgba(palette.accent, palette.handleOpacity);
  roundRect(ctx, clipX + 4, trackY + 7, 4, 20, 4);
  ctx.fill();
  roundRect(ctx, clipX + clipW - 8, trackY + 7, 4, 20, 4);
  ctx.fill();

  ctx.font = "600 11px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillStyle = "rgba(255, 255, 255, 0.70)";
  ctx.fillText(clipLabel, clipX + 14, trackY + layout.clipHeight / 2);

  if (clipW > 210) {
    ctx.font = "500 10px ui-monospace, SFMono-Regular, Menlo, monospace";
    ctx.fillStyle = "rgba(255, 255, 255, 0.45)";
    ctx.textAlign = "right";
    ctx.fillText(`${formatSimpleTime(startMs)} - ${formatSimpleTime(endMs)}`, clipX + clipW - 12, trackY + layout.clipHeight / 2);
    ctx.textAlign = "left";
  }

  for (const anchor of anchors) {
    const anchorX = clipX + ((anchor - startMs) / Math.max(1, endMs - startMs)) * clipW;
    ctx.save();
    ctx.shadowColor = "rgba(255, 166, 23, 0.45)";
    ctx.shadowBlur = 12;
    ctx.fillStyle = "#FFA617";
    ctx.strokeStyle = "rgba(0, 0, 0, 0.40)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(anchorX, trackY + layout.clipHeight / 2, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }

  ctx.restore();
}

function drawTimelineMarker(
  ctx: CanvasRenderingContext2D,
  layout: TimelineLayout,
  timeMs: number,
  variant: "play" | "preview",
  copy: ZoomFeatureCopy,
  options: {
    showLabel: boolean;
    avoidLabelBox?: TimelineMarkerLabelBox | null;
  }
) {
  const isPlay = variant === "play";
  const x = layout.contentX + (clamp(timeMs, 0, DEMO_DURATION_MS) / DEMO_DURATION_MS) * layout.contentWidth;
  const lineColor = isPlay ? "#FFA617" : "rgba(198, 198, 198, 0.72)";
  const labelColor = isPlay ? "rgba(255,210,130,0.95)" : "rgba(235,240,242,0.78)";
  const labelText = timelineMarkerLabelText(timeMs, variant, copy);
  const labelBox = timelineMarkerLabelBox(ctx, layout, timeMs, variant, copy);
  if (!isPlay && options.avoidLabelBox) {
    labelBox.y = timelineMarkerAvoidLabelY(layout, labelBox, options.avoidLabelBox);
  }
  const showLabel = options.showLabel;
  let lineTop = layout.markerTop;

  if (showLabel) {
    drawTimelineMarkerBackdrop(ctx, labelBox);
    drawTimelineMarkerGlassLabel(ctx, labelBox, isPlay);

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = labelColor;
    ctx.fillText(labelText, labelBox.x + labelBox.width / 2, labelBox.y + labelBox.height / 2 + 0.5);
    lineTop = labelBox.y + labelBox.height;
  } else if (options.avoidLabelBox) {
    lineTop = timelineMarkerAvoidLineTop(layout, x, options.avoidLabelBox);
  }

  ctx.save();
  ctx.shadowColor = isPlay ? "rgba(255, 166, 23, 0.55)" : "rgba(235,240,242,0.18)";
  ctx.shadowBlur = isPlay ? 18 : 12;
  ctx.strokeStyle = lineColor;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(x, lineTop);
  ctx.lineTo(x, layout.markerBottom);
  ctx.stroke();
  ctx.restore();
}

function drawTimelineMarkerGlassLabel(
  ctx: CanvasRenderingContext2D,
  labelBox: TimelineMarkerLabelBox,
  isPlay: boolean
) {
  const { x, y, width, height } = labelBox;
  const radius = height / 2;
  const accent = isPlay ? "255, 166, 23" : "225, 232, 236";

  ctx.save();
  ctx.shadowColor = isPlay ? "rgba(255, 166, 23, 0.26)" : "rgba(0, 0, 0, 0.34)";
  ctx.shadowBlur = isPlay ? 20 : 18;
  ctx.shadowOffsetY = 8;

  const base = ctx.createLinearGradient(x, y, x + width, y + height);
  base.addColorStop(0, `rgba(${accent}, ${isPlay ? 0.18 : 0.12})`);
  base.addColorStop(0.38, "rgba(255, 255, 255, 0.055)");
  base.addColorStop(0.62, `rgba(${accent}, ${isPlay ? 0.14 : 0.075})`);
  base.addColorStop(1, "rgba(255, 255, 255, 0.16)");
  ctx.fillStyle = base;
  roundRect(ctx, x, y, width, height, radius);
  ctx.fill();
  ctx.restore();

  ctx.save();
  roundRect(ctx, x + 0.5, y + 0.5, width - 1, height - 1, radius - 0.5);
  ctx.clip();

  const caustic = ctx.createRadialGradient(
    x + width * 0.18,
    y + height * 0.1,
    0,
    x + width * 0.18,
    y + height * 0.1,
    width * 0.72
  );
  caustic.addColorStop(0, "rgba(255, 255, 255, 0.30)");
  caustic.addColorStop(0.22, `rgba(${accent}, ${isPlay ? 0.14 : 0.08})`);
  caustic.addColorStop(0.56, "rgba(255, 255, 255, 0.025)");
  caustic.addColorStop(1, "rgba(255, 255, 255, 0)");
  ctx.globalCompositeOperation = "screen";
  ctx.fillStyle = caustic;
  ctx.fillRect(x, y, width, height);

  const sweep = ctx.createLinearGradient(x - width * 0.12, y, x + width * 0.92, y + height);
  sweep.addColorStop(0, "rgba(255, 255, 255, 0)");
  sweep.addColorStop(0.44, "rgba(255, 255, 255, 0.07)");
  sweep.addColorStop(0.54, "rgba(255, 255, 255, 0.26)");
  sweep.addColorStop(0.66, `rgba(${accent}, ${isPlay ? 0.12 : 0.07})`);
  sweep.addColorStop(1, "rgba(255, 255, 255, 0)");
  ctx.fillStyle = sweep;
  ctx.fillRect(x, y, width, height);
  ctx.restore();

  ctx.save();
  const rim = ctx.createLinearGradient(x, y, x, y + height);
  rim.addColorStop(0, "rgba(255, 255, 255, 0.62)");
  rim.addColorStop(0.45, `rgba(${accent}, ${isPlay ? 0.36 : 0.18})`);
  rim.addColorStop(1, "rgba(255, 255, 255, 0.18)");
  ctx.strokeStyle = rim;
  ctx.lineWidth = 1;
  roundRect(ctx, x + 0.5, y + 0.5, width - 1, height - 1, radius - 0.5);
  ctx.stroke();

  ctx.strokeStyle = isPlay ? "rgba(255, 166, 23, 0.52)" : "rgba(255, 255, 255, 0.16)";
  ctx.lineWidth = 1.25;
  ctx.globalAlpha = 0.8;
  roundRect(ctx, x + 2.2, y + 2.2, width - 4.4, height - 4.4, Math.max(1, radius - 2.2));
  ctx.stroke();
  ctx.restore();
}

function drawTimelineMarkerBackdrop(
  ctx: CanvasRenderingContext2D,
  labelBox: TimelineMarkerLabelBox
) {
  const dpr = Math.max(1, Math.abs(ctx.getTransform().a) || 1);
  const blurPadding = 16;
  const sourceX = Math.round((labelBox.x - blurPadding) * dpr);
  const sourceY = Math.round((labelBox.y - blurPadding) * dpr);
  const sourceWidth = Math.round((labelBox.width + blurPadding * 2) * dpr);
  const sourceHeight = Math.round((labelBox.height + blurPadding * 2) * dpr);
  const clampedSourceX = clamp(sourceX, 0, ctx.canvas.width);
  const clampedSourceY = clamp(sourceY, 0, ctx.canvas.height);
  const clampedSourceRight = clamp(sourceX + sourceWidth, 0, ctx.canvas.width);
  const clampedSourceBottom = clamp(sourceY + sourceHeight, 0, ctx.canvas.height);
  const clampedSourceWidth = clampedSourceRight - clampedSourceX;
  const clampedSourceHeight = clampedSourceBottom - clampedSourceY;

  if (clampedSourceWidth <= 0 || clampedSourceHeight <= 0) {
    return;
  }

  const destX = labelBox.x - blurPadding + (clampedSourceX - sourceX) / dpr;
  const destY = labelBox.y - blurPadding + (clampedSourceY - sourceY) / dpr;
  const destWidth = clampedSourceWidth / dpr;
  const destHeight = clampedSourceHeight / dpr;

  ctx.save();
  roundRect(ctx, labelBox.x, labelBox.y, labelBox.width, labelBox.height, labelBox.height / 2);
  ctx.clip();
  ctx.filter = "blur(12px) saturate(1.18)";
  ctx.globalAlpha = 0.82;
  ctx.drawImage(
    ctx.canvas,
    clampedSourceX,
    clampedSourceY,
    clampedSourceWidth,
    clampedSourceHeight,
    destX,
    destY,
    destWidth,
    destHeight
  );
  ctx.restore();
}

function timelineMarkerAvoidLabelY(
  layout: TimelineLayout,
  labelBox: TimelineMarkerLabelBox,
  avoidLabelBox: TimelineMarkerLabelBox
): number {
  const targetY = Math.min(
    avoidLabelBox.y + avoidLabelBox.height + 6,
    layout.markerBottom - labelBox.height - 26
  );
  const distanceToAvoidLabel = distanceBetweenHorizontalRanges(
    labelBox.x,
    labelBox.x + labelBox.width,
    avoidLabelBox.x - 8,
    avoidLabelBox.x + avoidLabelBox.width + 8
  );
  const avoidProgress = 1 - clamp(distanceToAvoidLabel / 64, 0, 1);
  const easedAvoidProgress = avoidProgress * avoidProgress * (3 - 2 * avoidProgress);

  return lerp(layout.markerTop, targetY, easedAvoidProgress);
}

function timelineMarkerAvoidLineTop(
  layout: TimelineLayout,
  x: number,
  avoidLabelBox: TimelineMarkerLabelBox
): number {
  const avoidTop = avoidLabelBox.y + avoidLabelBox.height + 6;
  const distanceToLabel = distanceToHorizontalRange(
    x,
    avoidLabelBox.x - 10,
    avoidLabelBox.x + avoidLabelBox.width + 10
  );
  const avoidProgress = 1 - clamp(distanceToLabel / 52, 0, 1);
  const easedAvoidProgress = avoidProgress * avoidProgress * (3 - 2 * avoidProgress);
  const loweredTop = lerp(layout.markerTop, avoidTop, easedAvoidProgress);

  return Math.min(loweredTop, layout.markerBottom - 26);
}

function distanceToHorizontalRange(x: number, min: number, max: number): number {
  if (x < min) return min - x;
  if (x > max) return x - max;
  return 0;
}

function distanceBetweenHorizontalRanges(
  lhsMin: number,
  lhsMax: number,
  rhsMin: number,
  rhsMax: number
): number {
  if (lhsMax < rhsMin) return rhsMin - lhsMax;
  if (rhsMax < lhsMin) return lhsMin - rhsMax;
  return 0;
}

function timelineMarkerLabelBox(
  ctx: CanvasRenderingContext2D,
  layout: TimelineLayout,
  timeMs: number,
  variant: "play" | "preview",
  copy: ZoomFeatureCopy
): TimelineMarkerLabelBox {
  const x = layout.contentX + (clamp(timeMs, 0, DEMO_DURATION_MS) / DEMO_DURATION_MS) * layout.contentWidth;
  const labelText = timelineMarkerLabelText(timeMs, variant, copy);
  const height = 24;
  ctx.font = "500 10px ui-monospace, SFMono-Regular, Menlo, monospace";
  const width = Math.ceil(ctx.measureText(labelText).width + 24);

  return {
    x: x - width / 2,
    y: layout.markerTop,
    width,
    height,
  };
}

function timelineMarkerLabelText(timeMs: number, variant: "play" | "preview", copy: ZoomFeatureCopy): string {
  return `${variant === "play" ? copy.canvasLabels.playMarker : copy.canvasLabels.previewMarker} ${formatSimpleTime(timeMs)}`;
}

function labelBoxesOverlap(
  lhs: TimelineMarkerLabelBox,
  rhs: TimelineMarkerLabelBox,
  padding: number
): boolean {
  return !(
    lhs.x + lhs.width + padding < rhs.x ||
    rhs.x + rhs.width + padding < lhs.x ||
    lhs.y + lhs.height + padding < rhs.y ||
    rhs.y + rhs.height + padding < lhs.y
  );
}

function sampleMotionFrame(timeMs: number): MotionFrame {
  const wrappedTime = wrapTime(timeMs);
  const camera = sampleCamera(wrappedTime);

  return {
    timeMs: wrappedTime,
    cursor: sampleCursor(wrappedTime),
    cameraFocus: camera.focus,
    zoom: camera.zoom,
    pressScale: samplePressScale(wrappedTime),
  };
}

function sampleCamera(timeMs: number): { focus: Point; zoom: number } {
  const segment = CAMERA_SEGMENTS.find((entry) => timeMs >= entry.startMs && timeMs <= entry.endMs) ?? CAMERA_SEGMENTS[CAMERA_SEGMENTS.length - 1];
  const duration = Math.max(1, segment.endMs - segment.startMs);
  const rawProgress = clamp((timeMs - segment.startMs) / duration, 0, 1);
  const elapsedMs = timeMs - segment.startMs;
  const progress = springTimelineProgress(rawProgress, elapsedMs, duration, CAMERA_SPRING, 1);

  return {
    focus: interpolatePoint(segment.fromFocus, segment.toFocus, progress),
    zoom: lerp(segment.fromZoom, segment.toZoom, progress),
  };
}

function sampleCursor(timeMs: number): Point {
  const index = CURSOR_PATH.findIndex((entry) => entry.timeMs >= timeMs);
  if (index <= 0) return CURSOR_PATH[0].position;
  if (index === -1) return CURSOR_PATH[CURSOR_PATH.length - 1].position;

  const previous = CURSOR_PATH[index - 1];
  const next = CURSOR_PATH[index];
  const duration = Math.max(1, next.timeMs - previous.timeMs);
  const rawProgress = clamp((timeMs - previous.timeMs) / duration, 0, 1);
  const elapsedMs = timeMs - previous.timeMs;
  const progress = springTimelineProgress(rawProgress, elapsedMs, duration, CURSOR_SPRING, 0.92);

  return interpolatePoint(previous.position, next.position, progress);
}

function samplePressScale(timeMs: number): number {
  const lookbackMs = 700;
  const changes = CLICK_EVENTS.flatMap((event) => [
    { timeMs: event.timeMs, target: 0.84 },
    { timeMs: event.timeMs + 90, target: 1 },
  ]).filter((change) => change.timeMs >= timeMs - lookbackMs && change.timeMs <= timeMs)
    .sort((lhs, rhs) => lhs.timeMs - rhs.timeMs);

  if (!changes.length) return 1;

  let value = 1;
  let velocity = 0;
  let target = 1;
  let cursorTime = Math.max(0, changes[0].timeMs - 1);

  for (const change of changes) {
    const sample = sampleSpringValue(value, velocity, target, change.timeMs - cursorTime, CLICK_SPRING);
    value = sample.value;
    velocity = sample.velocity;
    target = change.target;
    cursorTime = change.timeMs;
  }

  const sample = sampleSpringValue(value, velocity, target, timeMs - cursorTime, CLICK_SPRING);
  return clamp(sample.value, 0.76, 1.08);
}

function requestCanvasFrame(callback: FrameRequestCallback): number {
  if (typeof window !== "undefined" && typeof window.requestAnimationFrame === "function") {
    return window.requestAnimationFrame(callback);
  }

  return window.setTimeout(() => callback(performance.now()), 1000 / 60);
}

function cancelCanvasFrame(handle: number) {
  if (typeof window !== "undefined" && typeof window.cancelAnimationFrame === "function") {
    window.cancelAnimationFrame(handle);
    return;
  }

  window.clearTimeout(handle);
}

function createZoomProfileState(): ZoomProfileState | false {
  if (typeof window === "undefined") return false;

  const profileMode = new URLSearchParams(window.location.search).get("zoomProfile");
  if (!profileMode) return false;

  const state: ZoomProfileState = {
    done: false,
    frames: [],
    mode: profileMode === "tail" ? "tail" : "full",
  };
  window.__screenCamZoomProfile = state;

  return state;
}

function recordZoomProfileFrame(profile: ZoomProfileState, frame: ZoomProfileFrame) {
  if (profile.done) return;

  const isTailFrame = frame.timeMs >= CAMERA_RETURN_START_MS - 180 && frame.timeMs <= ZOOM_CLIP_END_MS + 180;
  if (profile.mode === "tail" && !isTailFrame) return;

  profile.frames.push(frame);
  if (profile.frames.length > 180) {
    profile.frames.shift();
  }

  if (profile.mode === "tail" && frame.timeMs >= ZOOM_CLIP_END_MS + 120) {
    profile.done = true;
  }
}

function ensureScratchCanvas(
  ref: { current: HTMLCanvasElement | null },
  width: number,
  height: number
) {
  ref.current ??= document.createElement("canvas");

  if (ref.current.width !== width || ref.current.height !== height) {
    ref.current.width = width;
    ref.current.height = height;
  }

  return ref.current;
}

function drawCameraShaderMotionBlur(
  ctx: CanvasRenderingContext2D,
  frameCanvas: HTMLCanvasElement,
  blurCanvasRef: { current: HTMLCanvasElement | null },
  width: number,
  height: number,
  targetWidth: number,
  targetHeight: number,
  dpr: number,
  blur: CameraShaderMotionBlur
): CameraMotionBlurStats {
  const drawSharpFrame = () => {
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = "source-over";
    ctx.filter = "none";
    ctx.fillStyle = "#141414";
    ctx.fillRect(0, 0, width, height);
    ctx.drawImage(frameCanvas, 0, 0, width, height);
  };

  const strength = clamp(blur.strength, 0, 1);
  const hasZoomMotion = Math.abs(blur.zoomMotion) > 0.0001;
  const panMotion = { x: blur.panMotion.x * strength, y: blur.panMotion.y * strength };
  let panLength = Math.hypot(panMotion.x, panMotion.y);

  if (strength <= 0.001 || (!hasZoomMotion && panLength < CAMERA_MOTION_BLUR_MIN_VISIBLE_PX)) {
    drawSharpFrame();
    return { sampleCount: 1, strength, visibleMotionLength: panLength };
  }

  const maxMotion = lerp(4, 46, strength);
  let zoomMotion = blur.zoomMotion;
  let visibleMotionLength = panLength;

  if (hasZoomMotion) {
    const maxRadius = maxDistanceToCorners(blur.focusPoint, width, height);
    const zoomMotionLength = Math.abs(zoomMotion) * strength * maxRadius;
    visibleMotionLength = Math.max(zoomMotionLength, panLength);
    if (visibleMotionLength < CAMERA_MOTION_BLUR_MIN_VISIBLE_PX) {
      drawSharpFrame();
      return { sampleCount: 1, strength, visibleMotionLength };
    }

    if (zoomMotionLength > maxMotion) {
      zoomMotion *= maxMotion / zoomMotionLength;
    }
  } else if (panLength > maxMotion) {
    const scale = maxMotion / panLength;
    panMotion.x *= scale;
    panMotion.y *= scale;
    panLength = maxMotion;
    visibleMotionLength = panLength;
  }

  const blurCanvas = ensureScratchCanvas(blurCanvasRef, targetWidth, targetHeight);
  const blurCtx = blurCanvas.getContext("2d");
  if (!blurCtx) {
    drawSharpFrame();
    return { sampleCount: 1, strength, visibleMotionLength };
  }

  const sampleCount = motionBlurSampleCount(
    visibleMotionLength,
    CAMERA_MOTION_BLUR_MIN_SAMPLE_COUNT,
    CAMERA_MOTION_BLUR_MAX_SAMPLE_COUNT,
    CAMERA_MOTION_BLUR_FULL_SAMPLE_PX
  );

  blurCtx.setTransform(1, 0, 0, 1, 0, 0);
  blurCtx.clearRect(0, 0, targetWidth, targetHeight);
  blurCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
  blurCtx.globalCompositeOperation = "source-over";
  blurCtx.imageSmoothingEnabled = true;
  blurCtx.imageSmoothingQuality = "high";
  blurCtx.filter = "none";

  let accumulatedWeight = 0;

  for (let index = 0; index < sampleCount; index += 1) {
    const t = index / (sampleCount - 1);
    const sampleWeight = shaderSampleWeight(t);
    const nextWeight = accumulatedWeight + sampleWeight;

    blurCtx.save();
    blurCtx.globalAlpha = accumulatedWeight <= 0 ? 1 : sampleWeight / nextWeight;

    if (hasZoomMotion) {
      const radialScale = 1 + zoomMotion * strength * t;
      const scale = 1 / Math.max(0.08, radialScale);
      blurCtx.translate(blur.focusPoint.x, blur.focusPoint.y);
      blurCtx.scale(scale, scale);
      blurCtx.translate(-blur.focusPoint.x, -blur.focusPoint.y);
    } else {
      blurCtx.translate(-panMotion.x * t, -panMotion.y * t);
    }

    blurCtx.drawImage(frameCanvas, 0, 0, width, height);
    blurCtx.restore();
    accumulatedWeight = nextWeight;
  }

  blurCtx.globalAlpha = 1;
  blurCtx.globalCompositeOperation = "source-over";
  blurCtx.filter = "none";

  ctx.save();
  ctx.globalAlpha = 1;
  ctx.globalCompositeOperation = "source-over";
  ctx.filter = "none";
  ctx.drawImage(blurCanvas, 0, 0, width, height);
  ctx.restore();
  return { sampleCount, strength, visibleMotionLength };
}

function cameraShaderMotionBlur(
  timeMs: number,
  frame: MotionFrame,
  width: number,
  height: number
): CameraShaderMotionBlur {
  const strength = (clamp(CAMERA_MOTION_BLUR_STRENGTH, 0, 100) / 100) * cameraMotionBlurTransitionMultiplier(timeMs);

  if (strength <= 0.001) {
    return {
      panMotion: { x: 0, y: 0 },
      zoomMotion: 0,
      focusPoint: { x: frame.cameraFocus.x * width, y: frame.cameraFocus.y * height },
      strength,
    };
  }

  const shutterMs = 220 * Math.pow(strength, 0.85);
  const velocityWindowMs = 1000 / 60;
  const shutterScale = shutterMs / velocityWindowMs;
  const before = sampleMotionFrame(timeMs - velocityWindowMs / 2);
  const after = sampleMotionFrame(timeMs + velocityWindowMs / 2);
  const beforeOffset = cameraCompositionOffset(before, width, height);
  const afterOffset = cameraCompositionOffset(after, width, height);
  const currentZoom = Math.max(0.0001, frame.zoom);

  return {
    panMotion: {
      x: (afterOffset.x - beforeOffset.x) * shutterScale,
      y: (afterOffset.y - beforeOffset.y) * shutterScale,
    },
    zoomMotion: ((after.zoom - before.zoom) / currentZoom) * shutterScale,
    focusPoint: { x: frame.cameraFocus.x * width, y: frame.cameraFocus.y * height },
    strength,
  };
}

function cameraMotionBlurTransitionMultiplier(timeMs: number): number {
  const wrappedTime = wrapTime(timeMs);
  const segment = CAMERA_SEGMENTS.find((entry) => wrappedTime >= entry.startMs && wrappedTime <= entry.endMs);

  if (!segment || !isCameraMotionSegment(segment)) {
    return 0;
  }

  if (segment.toZoom < segment.fromZoom) {
    return 0;
  }

  const fadeIn = smoothstep(clamp((wrappedTime - segment.startMs) / CAMERA_MOTION_BLUR_TRANSITION_MS, 0, 1));
  const fadeOut = smoothstep(clamp((segment.endMs - wrappedTime) / CAMERA_MOTION_BLUR_TRANSITION_MS, 0, 1));

  return fadeIn * fadeOut;
}

function isCameraMotionSegment(segment: typeof CAMERA_SEGMENTS[number]): boolean {
  return (
    Math.abs(segment.toZoom - segment.fromZoom) > 0.0001 ||
    normalizedDistance(segment.fromFocus, segment.toFocus) > 0.0008
  );
}

function cameraCompositionOffset(frame: MotionFrame, width: number, height: number): Point {
  return {
    x: frame.cameraFocus.x * width * (1 - frame.zoom),
    y: frame.cameraFocus.y * height * (1 - frame.zoom),
  };
}

function cursorMotionBlurVector(
  frame: MotionFrame,
  width: number,
  height: number
): CursorMotionBlurVector | null {
  const baseStrength = clamp(CURSOR_MOTION_BLUR_STRENGTH, 0, 100) / 100;
  const strength = baseStrength * cursorMotionBlurStrengthMultiplier(frame.timeMs);
  if (strength <= 0.001) return null;

  const shutterMs = 130 * Math.pow(strength, 0.8);
  const previousTime = frame.timeMs - shutterMs;
  if (previousTime < 0) return null;

  const currentPoint = projectPoint(frame.cursor, frame, width, height);
  const previousPoint = projectPoint(sampleCursor(previousTime), frame, width, height);
  const dx = currentPoint.x - previousPoint.x;
  const dy = currentPoint.y - previousPoint.y;
  const length = Math.hypot(dx, dy);
  if (length <= 2) return null;

  const maximumLength = 72 * strength * frame.zoom;
  const scale = Math.min(1, maximumLength / Math.max(1, length));
  return {
    dx: dx * scale,
    dy: dy * scale,
    strength,
  };
}

function drawCursorDirectionalMotionBlur(
  ctx: CanvasRenderingContext2D,
  drawCursor: (ctx: CanvasRenderingContext2D, x: number, y: number, scale: number, alpha?: number) => void,
  x: number,
  y: number,
  scale: number,
  vector: CursorMotionBlurVector
): number {
  const strength = clamp(vector.strength, 0, 1);
  const motionLength = Math.hypot(vector.dx, vector.dy);
  if (strength <= 0.001 || motionLength < 0.5) {
    drawCursor(ctx, x, y, scale);
    return 1;
  }

  const sampleCount = motionBlurSampleCount(
    motionLength,
    CURSOR_MOTION_BLUR_MIN_SAMPLE_COUNT,
    CURSOR_MOTION_BLUR_MAX_SAMPLE_COUNT,
    CURSOR_MOTION_BLUR_FULL_SAMPLE_PX
  );
  const weightSum = shaderWeightSum(sampleCount);

  for (let index = sampleCount - 1; index >= 1; index -= 1) {
    const t = index / (sampleCount - 1);
    const alpha = (shaderSampleWeight(t) / weightSum) * 1.4;
    drawCursor(ctx, x - vector.dx * t, y - vector.dy * t, scale, alpha);
  }

  drawCursor(ctx, x, y, scale);
  return sampleCount;
}

function cursorMotionBlurStrengthMultiplier(timeMs: number): number {
  const ageMs = cursorMovementOnsetAgeMs(timeMs);
  if (ageMs === null) return 0;

  const progress = clamp(ageMs / 200, 0, 1);
  return 1 - progress * progress * (3 - 2 * progress);
}

function cursorMovementOnsetAgeMs(timeMs: number): number | null {
  const upperIndex = upperBoundCursorPath(timeMs);
  if (upperIndex <= 0) return null;

  const segmentEndIndex = Math.min(upperIndex, CURSOR_PATH.length - 1);
  if (!isCursorMovementSegment(segmentEndIndex)) return null;

  let currentEndIndex = segmentEndIndex;
  let onsetTimeMs = CURSOR_PATH[currentEndIndex - 1].timeMs;

  while (currentEndIndex > 1) {
    const currentDuration = CURSOR_PATH[currentEndIndex].timeMs - CURSOR_PATH[currentEndIndex - 1].timeMs;
    if (currentDuration > 220) break;

    const previousEndIndex = currentEndIndex - 1;
    if (!isCursorMovementSegment(previousEndIndex)) break;
    onsetTimeMs = CURSOR_PATH[previousEndIndex - 1].timeMs;
    currentEndIndex = previousEndIndex;
  }

  const ageMs = timeMs - onsetTimeMs;
  return ageMs >= 0 && ageMs <= 200 ? ageMs : null;
}

function isCursorMovementSegment(endIndex: number): boolean {
  if (endIndex <= 0 || endIndex >= CURSOR_PATH.length) return false;
  return normalizedDistance(CURSOR_PATH[endIndex - 1].position, CURSOR_PATH[endIndex].position) > 0.0008;
}

function upperBoundCursorPath(timeMs: number): number {
  let lower = 0;
  let upper = CURSOR_PATH.length;

  while (lower < upper) {
    const middle = Math.floor((lower + upper) / 2);
    if (CURSOR_PATH[middle].timeMs <= timeMs) {
      lower = middle + 1;
    } else {
      upper = middle;
    }
  }

  return lower;
}

function motionBlurSampleCount(
  motionLengthPx: number,
  minSampleCount: number,
  maxSampleCount: number,
  fullSampleMotionPx: number
): number {
  const progress = smoothstep(motionLengthPx / Math.max(1, fullSampleMotionPx));
  const sampleCount = Math.round(lerp(minSampleCount, maxSampleCount, progress));
  const oddSampleCount = sampleCount % 2 === 0 ? sampleCount + 1 : sampleCount;

  return Math.min(maxSampleCount, Math.max(minSampleCount, oddSampleCount));
}

function shaderWeightSum(sampleCount: number): number {
  let weightSum = 0;
  for (let index = 0; index < sampleCount; index += 1) {
    weightSum += shaderSampleWeight(index / (sampleCount - 1));
  }
  return weightSum;
}

function shaderSampleWeight(t: number): number {
  return lerp(1, 0.32, t) * Math.exp(-t * t * 1.35);
}

function maxDistanceToCorners(point: Point, width: number, height: number): number {
  return Math.max(
    Math.hypot(point.x, point.y),
    Math.hypot(width - point.x, point.y),
    Math.hypot(point.x, height - point.y),
    Math.hypot(width - point.x, height - point.y)
  );
}

function springTimelineProgress(
  rawProgress: number,
  elapsedMs: number,
  durationMs: number,
  spring: SpringSettings,
  smoothing: number
): number {
  const raw = clamp(rawProgress, 0, 1);
  if (raw <= 0) return 0;
  if (raw >= 1) return 1;

  const strength = clamp(smoothing, 0, 1);
  if (strength <= 0.001) return raw;

  const eased = springProgressForDuration(elapsedMs, durationMs, spring);
  const blended = raw * (1 - strength) + eased * strength;
  const minimumProgress = raw * (1 - 0.28 * strength);
  return clamp(Math.max(blended, minimumProgress), 0, 1);
}

function springProgressForDuration(elapsedMs: number, durationMs: number, spring: SpringSettings): number {
  if (durationMs <= 0.0001) return 1;
  const elapsed = clamp(elapsedMs, 0, durationMs);
  return clamp(sampleSpringValue(0, 0, 1, elapsed, spring).value, 0, 1);
}

function drawZoomBadge(ctx: CanvasRenderingContext2D, width: number, zoom: number) {
  const badge = {
    x: width - 74,
    y: 16,
    width: 58,
    height: 30,
  };
  const isActive = zoom > 1.05;
  drawCanvasGlassPill(ctx, badge, isActive);

  ctx.fillStyle = isActive ? "rgba(255, 213, 143, 0.9)" : "rgba(235, 240, 242, 0.72)";
  ctx.font = "12px ui-monospace, SFMono-Regular, Menlo, monospace";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(`${Math.round(zoom * 100)}%`, badge.x + badge.width / 2, badge.y + badge.height / 2 + 0.5);
  ctx.textBaseline = "alphabetic";
}

function drawCanvasGlassPill(
  ctx: CanvasRenderingContext2D,
  rect: { x: number; y: number; width: number; height: number },
  isActive: boolean
) {
  const radius = rect.height / 2;
  const dpr = Math.max(1, Math.abs(ctx.getTransform().a) || 1);
  const blurPadding = 12;
  const sourceX = Math.round((rect.x - blurPadding) * dpr);
  const sourceY = Math.round((rect.y - blurPadding) * dpr);
  const sourceWidth = Math.round((rect.width + blurPadding * 2) * dpr);
  const sourceHeight = Math.round((rect.height + blurPadding * 2) * dpr);
  const clampedSourceX = clamp(sourceX, 0, ctx.canvas.width);
  const clampedSourceY = clamp(sourceY, 0, ctx.canvas.height);
  const clampedSourceRight = clamp(sourceX + sourceWidth, 0, ctx.canvas.width);
  const clampedSourceBottom = clamp(sourceY + sourceHeight, 0, ctx.canvas.height);
  const clampedSourceWidth = clampedSourceRight - clampedSourceX;
  const clampedSourceHeight = clampedSourceBottom - clampedSourceY;

  if (clampedSourceWidth > 0 && clampedSourceHeight > 0) {
    const destX = rect.x - blurPadding + (clampedSourceX - sourceX) / dpr;
    const destY = rect.y - blurPadding + (clampedSourceY - sourceY) / dpr;
    const destWidth = clampedSourceWidth / dpr;
    const destHeight = clampedSourceHeight / dpr;

    ctx.save();
    roundRect(ctx, rect.x, rect.y, rect.width, rect.height, radius);
    ctx.clip();
    ctx.filter = "blur(10px) saturate(1.28) contrast(1.05)";
    ctx.globalAlpha = 0.72;
    ctx.drawImage(
      ctx.canvas,
      clampedSourceX,
      clampedSourceY,
      clampedSourceWidth,
      clampedSourceHeight,
      destX,
      destY,
      destWidth,
      destHeight
    );
    ctx.restore();
  }

  const accent = isActive ? "255, 166, 23" : "225, 232, 236";
  ctx.save();
  ctx.shadowColor = isActive ? "rgba(255, 166, 23, 0.18)" : "rgba(0, 0, 0, 0.28)";
  ctx.shadowBlur = isActive ? 16 : 14;
  ctx.shadowOffsetY = 6;
  const base = ctx.createLinearGradient(rect.x, rect.y, rect.x + rect.width, rect.y + rect.height);
  base.addColorStop(0, `rgba(${accent}, ${isActive ? 0.13 : 0.08})`);
  base.addColorStop(0.48, "rgba(255, 255, 255, 0.04)");
  base.addColorStop(1, "rgba(255, 255, 255, 0.11)");
  ctx.fillStyle = base;
  roundRect(ctx, rect.x, rect.y, rect.width, rect.height, radius);
  ctx.fill();
  ctx.restore();

  ctx.save();
  roundRect(ctx, rect.x + 0.5, rect.y + 0.5, rect.width - 1, rect.height - 1, radius - 0.5);
  ctx.clip();
  ctx.globalCompositeOperation = "screen";
  const sweep = ctx.createLinearGradient(rect.x - rect.width * 0.25, rect.y, rect.x + rect.width, rect.y + rect.height);
  sweep.addColorStop(0, "rgba(255, 255, 255, 0)");
  sweep.addColorStop(0.5, "rgba(255, 255, 255, 0.16)");
  sweep.addColorStop(0.64, `rgba(${accent}, ${isActive ? 0.12 : 0.055})`);
  sweep.addColorStop(1, "rgba(255, 255, 255, 0)");
  ctx.fillStyle = sweep;
  ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
  ctx.restore();

  ctx.save();
  const rim = ctx.createLinearGradient(rect.x, rect.y, rect.x, rect.y + rect.height);
  rim.addColorStop(0, "rgba(255, 255, 255, 0.42)");
  rim.addColorStop(0.55, `rgba(${accent}, ${isActive ? 0.34 : 0.14})`);
  rim.addColorStop(1, "rgba(255, 255, 255, 0.16)");
  ctx.strokeStyle = rim;
  ctx.lineWidth = 1;
  roundRect(ctx, rect.x + 0.5, rect.y + 0.5, rect.width - 1, rect.height - 1, radius - 0.5);
  ctx.stroke();
  ctx.restore();
}

function drawStatusBadge(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  label: string,
  timestamp: number
) {
  ctx.font = "12px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
  const statusWidth = ctx.measureText(label).width + 40;
  const statusX = (width - statusWidth) / 2;

  ctx.fillStyle = "rgba(20, 20, 20, 0.9)";
  ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
  ctx.lineWidth = 1;
  roundRect(ctx, statusX, height - 44, statusWidth, 28, 14);
  ctx.fill();
  ctx.stroke();

  const pulseAlpha = 0.45 + 0.45 * Math.sin(timestamp * 0.003);
  ctx.fillStyle = `rgba(255, 166, 23, ${pulseAlpha})`;
  ctx.beginPath();
  ctx.arc(statusX + 16, height - 30, 4, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "rgba(255, 255, 255, 0.56)";
  ctx.textAlign = "left";
  ctx.fillText(label, statusX + 28, height - 26);
}

function buildTimelineTicks(durationMs: number, width: number) {
  const majorInterval = majorTickInterval(durationMs, width);
  const minorInterval = minorTickInterval(majorInterval, durationMs, width);
  const ticksByTime = new Map<number, { timeMs: number; isMajor: boolean; majorInterval: number }>();

  for (let timeMs = 0; timeMs <= durationMs + 0.5; timeMs += minorInterval) {
    ticksByTime.set(Math.round(timeMs), { timeMs, isMajor: false, majorInterval });
  }

  for (let timeMs = 0; timeMs <= durationMs + 0.5; timeMs += majorInterval) {
    ticksByTime.set(Math.round(timeMs), { timeMs, isMajor: true, majorInterval });
  }

  return Array.from(ticksByTime.values()).sort((lhs, rhs) => lhs.timeMs - rhs.timeMs);
}

function majorTickInterval(durationMs: number, width: number): number {
  const minimumLabelSpacing = 86;
  const targetInterval = Math.max(1, (durationMs / Math.max(width, 1)) * minimumLabelSpacing);
  const intervals = [250, 500, 1000, 2000, 5000, 10000, 15000, 30000, 60000, 120000, 300000, 600000, 900000, 1800000, 3600000];
  return intervals.find((interval) => interval >= targetInterval) ?? intervals[intervals.length - 1];
}

function minorTickInterval(majorInterval: number, durationMs: number, width: number): number {
  const msPerPixel = durationMs / Math.max(width, 1);
  const preferred = majorInterval >= 5000 ? majorInterval / 5 : majorInterval / 4;
  return preferred / msPerPixel >= 10 ? preferred : majorInterval / 2;
}

function sampleSpringValue(
  value: number,
  velocity: number,
  target: number,
  elapsedMs: number,
  settings: SpringSettings
) {
  const elapsed = Math.max(0, elapsedMs) / 1000;
  if (elapsed <= 0) {
    return { value, velocity };
  }

  const mass = Math.max(0.0001, settings.mass);
  const stiffness = Math.max(0.0001, settings.stiffness);
  const damping = Math.max(0.0001, settings.damping);
  const omega = Math.sqrt(stiffness / mass);
  const zeta = damping / (2 * Math.sqrt(stiffness * mass));
  const displacement = value - target;

  if (zeta < 1 - 0.0001) {
    const dampedOmega = omega * Math.sqrt(Math.max(0, 1 - zeta * zeta));
    const decay = Math.exp(-zeta * omega * elapsed);
    const a = displacement;
    const b = (velocity + zeta * omega * displacement) / Math.max(0.0001, dampedOmega);
    const cosTerm = Math.cos(dampedOmega * elapsed);
    const sinTerm = Math.sin(dampedOmega * elapsed);
    const nextDisplacement = decay * (a * cosTerm + b * sinTerm);
    const nextVelocity = decay * (
      -zeta * omega * (a * cosTerm + b * sinTerm)
      + (-a * dampedOmega * sinTerm + b * dampedOmega * cosTerm)
    );
    return { value: target + nextDisplacement, velocity: nextVelocity };
  }

  if (zeta > 1 + 0.0001) {
    const root = Math.sqrt(zeta * zeta - 1);
    const r1 = -omega * (zeta - root);
    const r2 = -omega * (zeta + root);
    const denominator = r2 - r1;
    const stableDenominator = Math.abs(denominator) < 0.0001 ? (denominator < 0 ? -0.0001 : 0.0001) : denominator;
    const c2 = (velocity - r1 * displacement) / stableDenominator;
    const c1 = displacement - c2;
    const e1 = Math.exp(r1 * elapsed);
    const e2 = Math.exp(r2 * elapsed);
    return {
      value: target + c1 * e1 + c2 * e2,
      velocity: c1 * r1 * e1 + c2 * r2 * e2,
    };
  }

  const c1 = displacement;
  const c2 = velocity + omega * displacement;
  const decay = Math.exp(-omega * elapsed);
  return {
    value: target + (c1 + c2 * elapsed) * decay,
    velocity: (c2 - omega * (c1 + c2 * elapsed)) * decay,
  };
}

function projectPoint(point: Point, frame: MotionFrame, width: number, height: number): Point {
  const focusX = frame.cameraFocus.x * width;
  const focusY = frame.cameraFocus.y * height;
  return {
    x: focusX + (point.x * width - focusX) * frame.zoom,
    y: focusY + (point.y * height - focusY) * frame.zoom,
  };
}

function normalizedDistance(lhs: Point, rhs: Point): number {
  const dx = lhs.x - rhs.x;
  const dy = lhs.y - rhs.y;
  return Math.sqrt(dx * dx + dy * dy);
}

function interpolatePoint(from: Point, to: Point, progress: number): Point {
  return {
    x: lerp(from.x, to.x, progress),
    y: lerp(from.y, to.y, progress),
  };
}

function wrapTime(timeMs: number): number {
  return ((timeMs % DEMO_DURATION_MS) + DEMO_DURATION_MS) % DEMO_DURATION_MS;
}

function lerp(from: number, to: number, progress: number): number {
  return from + (to - from) * progress;
}

function smoothstep(value: number): number {
  const t = clamp(value, 0, 1);
  return t * t * (3 - 2 * t);
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function hexToRgba(hex: string, opacity: number): string {
  const normalized = hex.replace("#", "");
  const value = Number.parseInt(normalized, 16);
  const red = (value >> 16) & 255;
  const green = (value >> 8) & 255;
  const blue = value & 255;
  return `rgba(${red}, ${green}, ${blue}, ${opacity})`;
}

function formatTimelineTime(milliseconds: number, intervalMs: number): string {
  if (intervalMs >= 1000) {
    return formatSimpleTime(milliseconds);
  }

  const clampedMilliseconds = Math.max(0, Math.round(milliseconds));
  const totalSeconds = Math.floor(clampedMilliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const hundredths = Math.floor((clampedMilliseconds % 1000) / 10);
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}.${String(hundredths).padStart(2, "0")}`;
}

function formatSimpleTime(milliseconds: number): string {
  const clampedMilliseconds = Math.max(0, Math.round(milliseconds));
  const totalSeconds = Math.floor(clampedMilliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const tenths = Math.floor((clampedMilliseconds % 1000) / 100);
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}.${tenths}`;
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  if (r === 0) {
    ctx.rect(x, y, w, h);
    return;
  }

  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + w - radius, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
  ctx.lineTo(x + w, y + h - radius);
  ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
  ctx.lineTo(x + radius, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}
