"use client";

import { motion, PanInfo, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent, TouchEvent as ReactTouchEvent } from "react";
import { Hand, Pause, Play } from "lucide-react";
import { Slider } from "./slider";
import type { CustomControlsCopy } from "../lib/translations";

interface ZoomAnchor {
  id: string;
  position: number; // 0-100 percentage
  scale: number;
  centerX: number; // 0-100
  centerY: number; // 0-100
}

interface ZoomFrame extends ZoomAnchor {
  displayScale?: number;
}

const MOCK_PLAYBACK_DURATION_MS = 4200;
const TIMELINE_TRACK_INSET_PX = 16;
const PLAYHEAD_LINE_WIDTH_PX = 2;
const BASELINE_PREVIEW_FRAME: ZoomFrame = {
  id: "playback",
  position: 0,
  scale: 1,
  displayScale: 1,
  centerX: 50,
  centerY: 50,
};

export function CustomControlsSection({ copy }: { copy: CustomControlsCopy }) {
  return (
    <section id="controls" className="relative min-h-screen bg-background py-32 overflow-hidden">
      {/* Background accent */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.02)_0%,transparent_50%)]" />

      <div className="relative max-w-7xl mx-auto px-6 md:px-12">
        {/* Two column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Left: Text content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="text-muted-foreground text-sm tracking-widest uppercase mb-4">
              {copy.eyebrow}
            </p>
            <h2 className="text-[clamp(2rem,4vw,3.5rem)] font-bold leading-[1.1] tracking-tight text-foreground mb-6">
              {copy.titleStart}
              <br />
              <span className="text-muted-foreground">{copy.titleMuted}</span>
            </h2>
            <p className="text-muted-foreground text-base leading-relaxed mb-8 max-w-md">
              {copy.body}
            </p>

            {/* Feature list */}
            <div className="space-y-4">
              {copy.features.map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 + i * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                  <span className="text-sm text-foreground/80">{feature}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right: Interactive timeline */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          >
            <InteractiveTimeline copy={copy} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function InteractiveTimeline({ copy }: { copy: CustomControlsCopy }) {
  const timelineRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const [anchors, setAnchors] = useState<ZoomAnchor[]>([
    { id: "1", position: 15, scale: 2.0, centerX: 30, centerY: 40 },
    { id: "2", position: 45, scale: 3.5, centerX: 70, centerY: 30 },
    { id: "3", position: 75, scale: 2.5, centerX: 50, centerY: 60 },
  ]);
  const [selectedAnchor, setSelectedAnchor] = useState<string | null>(null);
  const [playheadPosition, setPlayheadPosition] = useState(0);
  const [isDraggingCenter, setIsDraggingCenter] = useState(false);
  const [hasDraggedOnce, setHasDraggedOnce] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackAnchorData, setPlaybackAnchorData] = useState<ZoomFrame | null>(null);
  const activePreviewPointerRef = useRef<number | null>(null);
  const activePreviewTouchRef = useRef<number | null>(null);
  const isPreviewDraggingRef = useRef(false);
  const lastPointerPos = useRef<{ x: number; y: number } | null>(null);
  const selectedAnchorRef = useRef<string | null>(selectedAnchor);
  const playbackAnimationRef = useRef<number>(0);
  const playbackStartTimeRef = useRef(0);
  const playbackStartPositionRef = useRef(0);
  const latestPlayheadPositionRef = useRef(playheadPosition);
  const isPlaybackPausedRef = useRef(false);

  useEffect(() => {
    selectedAnchorRef.current = selectedAnchor;
  }, [selectedAnchor]);

  useEffect(() => {
    latestPlayheadPositionRef.current = playheadPosition;
  }, [playheadPosition]);

  useEffect(() => () => {
    cancelAnimationFrame(playbackAnimationRef.current);
  }, []);

  const selectAnchor = (id: string) => {
    selectedAnchorRef.current = id;
    setSelectedAnchor(id);
  };

  const clearSelectedAnchor = () => {
    selectedAnchorRef.current = null;
    setSelectedAnchor(null);
  };

  const updatePlaybackPosition = (position: number) => {
    const nextPosition = clampPercent(position);
    latestPlayheadPositionRef.current = nextPosition;
    setPlayheadPosition(nextPosition);
    setPlaybackAnchorData(sampleZoomAnchorFrame(anchors, nextPosition));
  };

  const stopPlayback = () => {
    cancelAnimationFrame(playbackAnimationRef.current);
    playbackAnimationRef.current = 0;
    isPlaybackPausedRef.current = false;
    setIsPlaying(false);
    setPlaybackAnchorData(null);
  };

  const pausePlayback = () => {
    cancelAnimationFrame(playbackAnimationRef.current);
    playbackAnimationRef.current = 0;
    isPlaybackPausedRef.current = true;
    setIsPlaying(false);
  };

  const completePlayback = () => {
    updatePlaybackPosition(100);
    cancelAnimationFrame(playbackAnimationRef.current);
    playbackAnimationRef.current = 0;
    isPlaybackPausedRef.current = false;
    setIsPlaying(false);
    setPlaybackAnchorData(null);
    clearSelectedAnchor();
  };

  const runPlaybackFrame = (timestamp: number) => {
    const startPosition = playbackStartPositionRef.current;
    const remainingDistance = Math.max(0, 100 - startPosition);
    const duration = Math.max(250, MOCK_PLAYBACK_DURATION_MS * (remainingDistance / 100));
    const progress = clamp01((timestamp - playbackStartTimeRef.current) / duration);
    const nextPosition = startPosition + remainingDistance * progress;

    updatePlaybackPosition(nextPosition);

    if (progress >= 1) {
      completePlayback();
      return;
    }

    playbackAnimationRef.current = requestAnimationFrame(runPlaybackFrame);
  };

  const startPlayback = () => {
    cancelAnimationFrame(playbackAnimationRef.current);

    const startPosition = isPlaybackPausedRef.current
      ? clampPercent(latestPlayheadPositionRef.current)
      : 0;

    clearSelectedAnchor();
    playbackStartPositionRef.current = startPosition;
    playbackStartTimeRef.current = performance.now();
    isPlaybackPausedRef.current = false;
    setIsPlaying(true);
    updatePlaybackPosition(startPosition);
    playbackAnimationRef.current = requestAnimationFrame(runPlaybackFrame);
  };

  const handlePlaybackToggle = () => {
    if (isPlaying) {
      pausePlayback();
      return;
    }

    startPlayback();
  };

  const handleAnchorDrag = (id: string, info: PanInfo) => {
    if (!timelineRef.current) return;
    stopPlayback();
    const rect = timelineRef.current.getBoundingClientRect();
    const trackWidth = Math.max(1, rect.width - TIMELINE_TRACK_INSET_PX * 2);

    setAnchors(prev => prev.map(anchor => {
      if (anchor.id !== id) return anchor;
      const deltaPercent = (info.delta.x / trackWidth) * 100;
      const newPosition = clampPercent(anchor.position + deltaPercent);
      return { ...anchor, position: newPosition };
    }));
  };

  const seekTimelineAtClientX = (clientX: number) => {
    if (!timelineRef.current) return;
    stopPlayback();
    clearSelectedAnchor();
    const rect = timelineRef.current.getBoundingClientRect();
    const trackLeft = rect.left + TIMELINE_TRACK_INSET_PX;
    const trackWidth = Math.max(1, rect.width - TIMELINE_TRACK_INSET_PX * 2);
    const position = ((clientX - trackLeft) / trackWidth) * 100;
    setPlayheadPosition(clampPercent(position));
  };

  const handleTimelinePointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    seekTimelineAtClientX(e.clientX);
  };

  const beginPreviewCenterDrag = (clientX: number, clientY: number) => {
    if (!selectedAnchorRef.current || !previewRef.current) return;
    stopPlayback();
    isPreviewDraggingRef.current = true;
    setIsDraggingCenter(true);
    setHasDraggedOnce(true);
    lastPointerPos.current = { x: clientX, y: clientY };
  };

  const updatePreviewCenterDrag = (clientX: number, clientY: number) => {
    const activeAnchorId = selectedAnchorRef.current;

    if (
      !isPreviewDraggingRef.current ||
      !activeAnchorId ||
      !previewRef.current ||
      !lastPointerPos.current
    ) {
      return;
    }

    const rect = previewRef.current.getBoundingClientRect();
    const deltaX = (clientX - lastPointerPos.current.x) / rect.width * 100;
    const deltaY = (clientY - lastPointerPos.current.y) / rect.height * 100;

    lastPointerPos.current = { x: clientX, y: clientY };

    setAnchors(prev => prev.map(a => {
      if (a.id !== activeAnchorId) return a;
      // Inverted: drag right -> content moves right -> center moves left
      const newCenterX = Math.max(0, Math.min(100, a.centerX - deltaX));
      const newCenterY = Math.max(0, Math.min(100, a.centerY - deltaY));
      return { ...a, centerX: newCenterX, centerY: newCenterY };
    }));
  };

  const handlePreviewPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!selectedAnchorRef.current || !previewRef.current) return;
    activePreviewPointerRef.current = e.pointerId;
    beginPreviewCenterDrag(e.clientX, e.clientY);
    e.currentTarget.setPointerCapture(e.pointerId);
    e.preventDefault();
  };

  const handlePreviewPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (activePreviewPointerRef.current !== e.pointerId) return;
    updatePreviewCenterDrag(e.clientX, e.clientY);
    e.preventDefault();
  };

  const endPreviewDrag = () => {
    isPreviewDraggingRef.current = false;
    setIsDraggingCenter(false);
    activePreviewPointerRef.current = null;
    activePreviewTouchRef.current = null;
    lastPointerPos.current = null;
  };

  const handlePreviewPointerUp = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (activePreviewPointerRef.current !== e.pointerId) return;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    endPreviewDrag();
  };

  const handlePreviewPointerCancel = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (activePreviewPointerRef.current !== e.pointerId) return;
    endPreviewDrag();
  };

  const handlePreviewPointerLeave = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse" || activePreviewPointerRef.current !== e.pointerId) return;
    endPreviewDrag();
  };

  const getActivePreviewTouch = (touches: TouchList) => {
    const activeTouchId = activePreviewTouchRef.current;
    if (activeTouchId === null) return touches.item(0);

    for (let index = 0; index < touches.length; index += 1) {
      const touch = touches.item(index);
      if (touch?.identifier === activeTouchId) return touch;
    }

    return null;
  };

  const changedTouchesIncludeActiveTouch = (touches: TouchList) => {
    const activeTouchId = activePreviewTouchRef.current;
    if (activeTouchId === null) return touches.length > 0;

    for (let index = 0; index < touches.length; index += 1) {
      if (touches.item(index)?.identifier === activeTouchId) return true;
    }

    return false;
  };

  const handlePreviewTouchStart = (e: ReactTouchEvent<HTMLDivElement>) => {
    const touch = e.touches.item(0);
    if (!touch || !selectedAnchorRef.current || !previewRef.current) return;

    activePreviewTouchRef.current = touch.identifier;
    if (!isPreviewDraggingRef.current) {
      beginPreviewCenterDrag(touch.clientX, touch.clientY);
    }
    e.preventDefault();
  };

  const handlePreviewTouchMove = (e: ReactTouchEvent<HTMLDivElement>) => {
    const touch = getActivePreviewTouch(e.touches);
    if (!touch || !isPreviewDraggingRef.current) return;

    updatePreviewCenterDrag(touch.clientX, touch.clientY);
    e.preventDefault();
  };

  const handlePreviewTouchEnd = (e: ReactTouchEvent<HTMLDivElement>) => {
    if (!isPreviewDraggingRef.current && activePreviewTouchRef.current === null) return;
    if (!changedTouchesIncludeActiveTouch(e.changedTouches)) return;

    activePreviewTouchRef.current = null;
    if (activePreviewPointerRef.current === null) {
      endPreviewDrag();
    }
    e.preventDefault();
  };

  const selectedAnchorData = anchors.find(a => a.id === selectedAnchor);
  const controlsAnchorData = selectedAnchorData ?? BASELINE_PREVIEW_FRAME;
  const hasSelectedAnchor = Boolean(selectedAnchorData);
  const playheadFrameData = sampleZoomAnchorFrame(anchors, playheadPosition);
  const previewAnchorData = playbackAnchorData ?? selectedAnchorData ?? playheadFrameData;
  const playheadLeft = timelinePositionStyle(playheadPosition);

  return (
    <div className="space-y-6">
      {/* Preview window */}
      <div
        ref={previewRef}
        className="relative aspect-video rounded-xl bg-card border border-border/50 overflow-hidden select-none touch-none"
        onPointerDown={handlePreviewPointerDown}
        onPointerMove={handlePreviewPointerMove}
        onPointerUp={handlePreviewPointerUp}
        onPointerCancel={handlePreviewPointerCancel}
        onPointerLeave={handlePreviewPointerLeave}
        onTouchStart={handlePreviewTouchStart}
        onTouchMove={handlePreviewTouchMove}
        onTouchEnd={handlePreviewTouchEnd}
        onTouchCancel={handlePreviewTouchEnd}
        style={{
          cursor: selectedAnchor ? (isDraggingCenter ? 'grabbing' : 'grab') : 'default',
          touchAction: selectedAnchor ? "none" : "auto",
        }}
      >
        <ZoomPreviewCanvas anchor={previewAnchorData} />

        {/* Drag overlay - shows when anchor is selected and never dragged before */}
        <AnimatePresence>
          {selectedAnchor && !isDraggingCenter && !hasDraggedOnce && !isPlaying && !playbackAnchorData && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="pointer-events-none absolute inset-0 bg-black/50 backdrop-blur-[1px] flex items-center justify-center z-10"
            >
              <motion.div
                className="flex flex-col items-center gap-3"
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <motion.div
                  animate={{ rotate: [-8, 8, -8], x: [-8, 8, -8] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Hand className="w-10 h-10 text-foreground/80" />
                </motion.div>
                <span className="text-sm text-foreground/70 font-medium">{copy.dragCenter}</span>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      <div className="relative h-28 rounded-xl bg-card/50 border border-border/50 overflow-hidden">
        <motion.button
          type="button"
          aria-label={isPlaying ? copy.pauseAria : copy.playAria}
          title={isPlaying ? copy.pauseTitle : copy.playTitle}
          className="absolute left-3 top-10 z-30 flex h-10 w-8 items-center justify-center text-muted-foreground transition-colors hover:text-foreground touch-none"
          onClick={handlePlaybackToggle}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.96 }}
        >
          {isPlaying ? (
            <Pause className="h-5 w-5" aria-hidden="true" />
          ) : (
            <Play className="h-5 w-5 translate-x-0.5" aria-hidden="true" />
          )}
        </motion.button>

        {/* Timeline */}
        <div
          ref={timelineRef}
          className="absolute inset-y-0 left-12 right-0 cursor-pointer touch-none"
          onPointerDown={handleTimelinePointerDown}
        >
          {/* Time markers */}
          <div className="absolute top-2 left-0 right-0 flex justify-between px-4 text-[10px] font-mono text-muted-foreground/50">
            <span>00:00</span>
            <span>00:15</span>
            <span>00:30</span>
            <span>00:45</span>
            <span>01:00</span>
          </div>

          {/* Track background */}
          <div className="absolute top-10 left-4 right-4 h-10 rounded-lg bg-secondary/30 border border-border/30">
            {/* Zoom clip */}
            <div className="absolute inset-y-1 -left-px -right-px rounded-md bg-accent/20 border border-accent/30">
              {/* Anchors */}
              {anchors.map((anchor) => (
                <motion.div
                  key={anchor.id}
                  className={`absolute top-0 bottom-0 w-1 cursor-ew-resize touch-none group ${
                    selectedAnchor === anchor.id ? "z-10" : "z-0"
                  }`}
                  style={{ left: `${clampPercent(anchor.position)}%` }}
                  drag="x"
                  dragMomentum={false}
                  dragElastic={0}
                  onDrag={(_, info) => handleAnchorDrag(anchor.id, info)}
                  onPointerDown={(e) => {
                    e.stopPropagation();
                    stopPlayback();
                    selectAnchor(anchor.id);
                    setPlayheadPosition(anchor.position);
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    stopPlayback();
                    selectAnchor(anchor.id);
                    setPlayheadPosition(anchor.position);
                  }}
                  whileHover={{ scale: 1.2 }}
                  whileDrag={{ scale: 1.3 }}
                >
                  {/* Anchor line */}
                  <div className={`absolute inset-y-0 left-1/2 w-0.5 -translate-x-1/2 transition-colors ${
                    selectedAnchor === anchor.id ? "bg-accent" : "bg-accent/50 group-hover:bg-accent/80"
                  }`} />

                  {/* Anchor handle */}
                  <motion.div
                    className={`absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full border-2 transition-colors ${
                      selectedAnchor === anchor.id
                        ? "bg-accent border-accent shadow-lg shadow-accent/30"
                        : "bg-card border-accent/50 group-hover:border-accent"
                    }`}
                    layoutId={`anchor-${anchor.id}`}
                  />

                  {/* Scale label */}
                  <div className={`absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] font-mono whitespace-nowrap transition-colors ${
                    selectedAnchor === anchor.id ? "text-accent" : "text-muted-foreground"
                  }`}>
                    {anchor.scale.toFixed(1)}x
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Playhead */}
          <motion.div
            className="absolute top-8 bottom-2 w-0.5 bg-foreground z-20 pointer-events-none"
            style={{ left: playheadLeft }}
            animate={{ left: playheadLeft }}
            transition={{ duration: isPlaying ? 0 : 0.2 }}
          >
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-foreground rounded-sm rotate-45" />
          </motion.div>
        </div>
      </div>

      {/* Anchor controls */}
      <motion.div
        aria-disabled={!hasSelectedAnchor}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: hasSelectedAnchor ? 1 : 0.42, y: 0 }}
        className="flex items-center gap-6 p-4 rounded-xl bg-card/50 border border-border/50"
      >
        <div className="flex-1">
          <label className="text-xs text-muted-foreground mb-2 block">{copy.scaleLabel}</label>
          <Slider
            ariaLabel={copy.scaleAria}
            disabled={!hasSelectedAnchor}
            min={1}
            max={5}
            step={0.1}
            unit="x"
            formatter={(value) => `${value.toFixed(1)}x`}
            value={controlsAnchorData.scale}
            onChange={(value) => {
              if (!selectedAnchor) return;

              stopPlayback();
              setAnchors(prev => prev.map(a =>
                a.id === selectedAnchor ? { ...a, scale: value } : a
              ));
            }}
          />
        </div>
        <div className="text-right">
          <div className="text-2xl font-mono text-foreground">{controlsAnchorData.scale.toFixed(1)}x</div>
          <div className="text-xs text-muted-foreground">
            {copy.centerLabel}: {Math.round(controlsAnchorData.centerX)}%, {Math.round(controlsAnchorData.centerY)}%
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function sampleZoomAnchorFrame(anchors: ZoomAnchor[], position: number): ZoomFrame {
  const sortedAnchors = [...anchors].sort((a, b) => a.position - b.position);
  const safePosition = clampPercent(position);

  if (!sortedAnchors.length) {
    return {
      ...BASELINE_PREVIEW_FRAME,
      position: safePosition,
    };
  }

  const firstAnchor = sortedAnchors[0];
  const lastAnchor = sortedAnchors[sortedAnchors.length - 1];

  if (safePosition <= firstAnchor.position) {
    return interpolateZoomFrame(
      { ...BASELINE_PREVIEW_FRAME, position: 0 },
      firstAnchor,
      safePosition,
      0,
      firstAnchor.position,
    );
  }

  if (safePosition >= lastAnchor.position) {
    return interpolateZoomFrame(
      lastAnchor,
      { ...BASELINE_PREVIEW_FRAME, position: 100 },
      safePosition,
      lastAnchor.position,
      100,
    );
  }

  for (let index = 1; index < sortedAnchors.length; index += 1) {
    const previous = sortedAnchors[index - 1];
    const next = sortedAnchors[index];

    if (safePosition > next.position) continue;

    return interpolateZoomFrame(previous, next, safePosition, previous.position, next.position);
  }

  return interpolateZoomFrame(
    lastAnchor,
    { ...BASELINE_PREVIEW_FRAME, position: 100 },
    safePosition,
    lastAnchor.position,
    100,
  );
}

function interpolateZoomFrame(
  previous: ZoomFrame,
  next: ZoomFrame,
  position: number,
  previousPosition: number,
  nextPosition: number,
): ZoomFrame {
  const segmentProgress = clamp01((position - previousPosition) / Math.max(1, nextPosition - previousPosition));
  const easedProgress = smoothstep(segmentProgress);
  const previousDisplayScale = previous.displayScale ?? previous.scale;
  const nextDisplayScale = next.displayScale ?? next.scale;

  return {
    id: "playback",
    position,
    scale: lerp(previous.scale, next.scale, easedProgress),
    displayScale: lerp(previousDisplayScale, nextDisplayScale, easedProgress),
    centerX: lerp(previous.centerX, next.centerX, easedProgress),
    centerY: lerp(previous.centerY, next.centerY, easedProgress),
  };
}

function clampPercent(value: number): number {
  return Math.max(0, Math.min(100, value));
}

function timelinePositionStyle(position: number): string {
  const progress = clampPercent(position) / 100;
  const percentage = progress * 100;
  const offset =
    TIMELINE_TRACK_INSET_PX -
    TIMELINE_TRACK_INSET_PX * 2 * progress -
    PLAYHEAD_LINE_WIDTH_PX * progress;
  return `calc(${percentage}% + ${offset}px)`;
}

function clamp01(value: number): number {
  return Math.max(0, Math.min(1, value));
}

function smoothstep(value: number): number {
  return value * value * (3 - 2 * value);
}

function lerp(from: number, to: number, progress: number): number {
  return from + (to - from) * progress;
}

function ZoomPreviewCanvas({ anchor }: { anchor?: ZoomFrame }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef(getPreviewFrameState(anchor));
  const targetRef = useRef(getPreviewFrameState(anchor));
  const startRenderRef = useRef<() => void>(() => {});

  useEffect(() => {
    targetRef.current = getPreviewFrameState(anchor);
    startRenderRef.current();
  }, [anchor?.scale, anchor?.displayScale, anchor?.centerX, anchor?.centerY]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;
    if (!canvas || !parent) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let raf = 0;
    let isRunning = false;

    const resize = () => {
      const rect = parent.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      width = Math.max(1, Math.round(rect.width));
      height = Math.max(1, Math.round(rect.height));
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      start();
    };

    const render = () => {
      if (!isRunning) return;

      const current = frameRef.current;
      const target = targetRef.current;
      current.scale += (target.scale - current.scale) * 0.11;
      current.displayScale += (target.displayScale - current.displayScale) * 0.11;
      current.centerX += (target.centerX - current.centerX) * 0.11;
      current.centerY += (target.centerY - current.centerY) * 0.11;

      drawZoomPreview(ctx, width, height, current);

      const isSettled =
        Math.abs(target.scale - current.scale) < 0.005 &&
        Math.abs(target.displayScale - current.displayScale) < 0.005 &&
        Math.abs(target.centerX - current.centerX) < 0.05 &&
        Math.abs(target.centerY - current.centerY) < 0.05;

      if (isSettled) {
        frameRef.current = { ...target };
        drawZoomPreview(ctx, width, height, frameRef.current);
        isRunning = false;
        return;
      }

      raf = requestAnimationFrame(render);
    };

    function start() {
      if (isRunning || document.hidden) return;
      isRunning = true;
      raf = requestAnimationFrame(render);
    };

    const observer = new ResizeObserver(resize);
    observer.observe(parent);
    const handleVisibilityChange = () => {
      if (document.hidden) {
        isRunning = false;
        cancelAnimationFrame(raf);
      } else {
        start();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    startRenderRef.current = start;
    resize();

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      startRenderRef.current = () => {};
      isRunning = false;
      cancelAnimationFrame(raf);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" aria-hidden="true" />;
}

function getPreviewFrameState(anchor?: ZoomFrame) {
  const scale = anchor?.scale ?? 1;

  return {
    scale,
    displayScale: anchor?.displayScale ?? scale,
    centerX: anchor?.centerX ?? 50,
    centerY: anchor?.centerY ?? 50,
  };
}

function drawZoomPreview(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  frame: { scale: number; displayScale: number; centerX: number; centerY: number }
) {
  ctx.clearRect(0, 0, width, height);

  const bg = ctx.createLinearGradient(0, 0, width, height);
  bg.addColorStop(0, "rgba(38, 38, 38, 0.34)");
  bg.addColorStop(1, "rgba(16, 16, 16, 0.88)");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);

  ctx.save();
  const offsetX = ((50 - frame.centerX) * 0.02) * width;
  const offsetY = ((50 - frame.centerY) * 0.02) * height;
  ctx.translate(width / 2 + offsetX, height / 2 + offsetY);
  ctx.scale(frame.scale, frame.scale);
  ctx.translate(-width / 2, -height / 2);
  drawPreviewScene(ctx, width, height);
  ctx.restore();

  drawPreviewZoomBadge(ctx, frame.displayScale);
}

function drawPreviewScene(ctx: CanvasRenderingContext2D, width: number, height: number) {
  const pad = 24;
  const gap = 16;
  const columnWidth = (width - pad * 2 - gap * 2) / 3;
  const contentHeight = height - pad * 2;

  ctx.save();
  ctx.fillStyle = "rgba(255, 255, 255, 0.035)";
  roundedRectPath(ctx, 0, 0, width, height, 0);
  ctx.fill();

  const leftX = pad;
  drawSoftLine(ctx, leftX, pad + 6, columnWidth * 0.66, 32, 8, "rgba(255,255,255,0.09)");
  drawSoftLine(ctx, leftX, pad + 52, columnWidth, 14, 4, "rgba(255,255,255,0.045)");
  drawSoftLine(ctx, leftX, pad + 76, columnWidth * 0.76, 14, 4, "rgba(255,255,255,0.045)");
  drawCard(ctx, leftX, pad + 112, columnWidth, Math.max(72, contentHeight - 112), "rgba(255, 166, 23, 0.14)", "rgba(255, 166, 23, 0.24)");

  const rightX = pad + columnWidth + gap;
  const rightW = columnWidth * 2 + gap;
  drawCard(ctx, rightX, pad, rightW, contentHeight, "rgba(255, 255, 255, 0.035)", "rgba(255, 255, 255, 0.055)");

  const innerPad = 16;
  const cellGap = 12;
  const cellW = (rightW - innerPad * 2 - cellGap) / 2;
  const cellH = (contentHeight - innerPad * 2 - cellGap) / 2;

  for (let row = 0; row < 2; row += 1) {
    for (let col = 0; col < 2; col += 1) {
      const x = rightX + innerPad + col * (cellW + cellGap);
      const y = pad + innerPad + row * (cellH + cellGap);
      drawCard(ctx, x, y, cellW, cellH, "rgba(255, 255, 255, 0.035)", "rgba(255, 255, 255, 0.04)");
      const circle = Math.min(44, cellW * 0.24, cellH * 0.35);
      ctx.fillStyle = "rgba(255, 255, 255, 0.055)";
      ctx.beginPath();
      ctx.arc(x + cellW / 2, y + cellH / 2, circle, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  ctx.restore();
}

function drawPreviewZoomBadge(
  ctx: CanvasRenderingContext2D,
  scale: number
) {
  const label = `${scale.toFixed(1)}x`;
  ctx.font = "12px ui-monospace, SFMono-Regular, Menlo, monospace";
  const textWidth = ctx.measureText(label).width;
  const rect = { x: 18, y: 16, width: Math.ceil(textWidth + 28), height: 32 };
  drawGlassRect(ctx, rect, false);

  ctx.fillStyle = "rgba(235, 240, 242, 0.72)";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(label, rect.x + rect.width / 2, rect.y + rect.height / 2 + 0.5);
  ctx.textBaseline = "alphabetic";
}

function drawGlassRect(
  ctx: CanvasRenderingContext2D,
  rect: { x: number; y: number; width: number; height: number },
  active: boolean
) {
  const radius = 8;
  const accent = active ? "255, 166, 23" : "225, 232, 236";

  ctx.save();
  roundedRectPath(ctx, rect.x, rect.y, rect.width, rect.height, radius);
  ctx.clip();
  ctx.filter = "blur(10px) saturate(1.25) contrast(1.05)";
  ctx.globalAlpha = 0.72;
  ctx.drawImage(ctx.canvas, rect.x - 12, rect.y - 12, rect.width + 24, rect.height + 24, rect.x - 12, rect.y - 12, rect.width + 24, rect.height + 24);
  ctx.restore();

  ctx.save();
  ctx.shadowColor = "rgba(0, 0, 0, 0.28)";
  ctx.shadowBlur = 16;
  ctx.shadowOffsetY = 6;
  const fill = ctx.createLinearGradient(rect.x, rect.y, rect.x + rect.width, rect.y + rect.height);
  fill.addColorStop(0, `rgba(${accent}, 0.08)`);
  fill.addColorStop(0.5, "rgba(255, 255, 255, 0.04)");
  fill.addColorStop(1, "rgba(255, 255, 255, 0.12)");
  ctx.fillStyle = fill;
  roundedRectPath(ctx, rect.x, rect.y, rect.width, rect.height, radius);
  ctx.fill();
  ctx.restore();

  ctx.save();
  roundedRectPath(ctx, rect.x + 0.5, rect.y + 0.5, rect.width - 1, rect.height - 1, radius - 0.5);
  ctx.clip();
  ctx.globalCompositeOperation = "screen";
  const sweep = ctx.createLinearGradient(rect.x - rect.width * 0.2, rect.y, rect.x + rect.width, rect.y + rect.height);
  sweep.addColorStop(0, "rgba(255,255,255,0)");
  sweep.addColorStop(0.52, "rgba(255,255,255,0.16)");
  sweep.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = sweep;
  ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
  ctx.restore();

  ctx.save();
  const rim = ctx.createLinearGradient(rect.x, rect.y, rect.x, rect.y + rect.height);
  rim.addColorStop(0, "rgba(255,255,255,0.36)");
  rim.addColorStop(0.55, "rgba(255,255,255,0.12)");
  rim.addColorStop(1, "rgba(255,255,255,0.18)");
  ctx.strokeStyle = rim;
  ctx.lineWidth = 1;
  roundedRectPath(ctx, rect.x + 0.5, rect.y + 0.5, rect.width - 1, rect.height - 1, radius - 0.5);
  ctx.stroke();
  ctx.restore();
}

function drawCard(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  fill: string,
  stroke: string
) {
  roundedRectPath(ctx, x, y, width, height, 12);
  ctx.fillStyle = fill;
  ctx.fill();
  ctx.strokeStyle = stroke;
  ctx.lineWidth = 1;
  ctx.stroke();
}

function drawSoftLine(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
  fill: string
) {
  roundedRectPath(ctx, x, y, width, height, radius);
  ctx.fillStyle = fill;
  ctx.fill();
}

function roundedRectPath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + width, y, x + width, y + height, r);
  ctx.arcTo(x + width, y + height, x, y + height, r);
  ctx.arcTo(x, y + height, x, y, r);
  ctx.arcTo(x, y, x + width, y, r);
  ctx.closePath();
}
