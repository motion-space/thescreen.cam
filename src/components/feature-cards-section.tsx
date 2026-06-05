"use client";

import { motion } from "framer-motion";
import {
  Container as CoreContainer,
  Glass as CoreGlass,
  Scene as CoreScene,
  WebGpuGlassCore,
} from "@liquid-dom/core";
import {
  ChevronsLeftRight,
  Command,
  Image as ImageIcon,
  Info,
  Palette,
  Pause,
  PictureInPicture2,
  Play,
  Shapes,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import type {
  KeyboardEvent as ReactKeyboardEvent,
  MutableRefObject,
  PointerEvent as ReactPointerEvent,
  ReactNode,
} from "react";
import type { FeatureCardsCopy } from "../lib/translations";

type FeatureVariant = "glass" | "shortcuts" | "beauty";
type ToolbarGlassMode = "clear" | "regular";
type BeautyFloatingShape = "wide" | "square" | "circle";
type BeautyMediaFrame = {
  height: string;
  width: string;
};
type BeautyWindowTarget = {
  borderRadius: string;
  height: string;
  left: string;
  top: string;
  width: string;
};

const featureVariants: FeatureVariant[] = ["glass", "shortcuts", "beauty"];
const beautyComparisonVideoSource = "/feature-media/beauty-comparison.mp4";
const beautyThumbBackgroundSource = "/feature-media/beauty-wallpaper.webp";
const beautyHandleRestY = 82;
const beautyFloatingShapeOrder: BeautyFloatingShape[] = [
  "wide",
  "square",
  "circle",
];
const beautyFullWindowTarget: BeautyWindowTarget = {
  borderRadius: "8px",
  height: "100.8%",
  left: "-0.4%",
  top: "-0.4%",
  width: "100.8%",
};
const beautyMediaFrames: Record<
  BeautyFloatingShape | "full",
  BeautyMediaFrame
> = {
  full: {
    height: "100%",
    width: "100%",
  },
  wide: {
    height: "133.333%",
    width: "100%",
  },
  square: {
    height: "100%",
    width: "133.333%",
  },
  circle: {
    height: "100%",
    width: "133.333%",
  },
};
const beautyFloatingWindowTargets: Record<
  BeautyFloatingShape,
  BeautyWindowTarget
> = {
  wide: {
    borderRadius: "12px",
    height: "36%",
    left: "48%",
    top: "60%",
    width: "48%",
  },
  square: {
    borderRadius: "14px",
    height: "48%",
    left: "60%",
    top: "48%",
    width: "36%",
  },
  circle: {
    borderRadius: "50%",
    height: "48%",
    left: "60%",
    top: "48%",
    width: "36%",
  },
};
const coreGlassOptions = {
  blur: 8,
  spacing: 10,
  bezelWidth: 12,
  tint: { r: 0.1, g: 0.1, b: 0.1, a: 0.2 },
  shadowColor: { r: 0, g: 0, b: 0, a: 0.2 },
  shadowOffsetY: 7,
  shadowBlur: 21,
  specularOpacity: 0.6,
};
const regularToolbarGlassOptions = {
  ...coreGlassOptions,
  bezelWidth: 4,
  blur: 18,
  spacing: 1,
  tint: { r: 0.2, g: 0.2, b: 0.2, a: 0.46 },
};
const tooltipGlassOptions = {
  ...coreGlassOptions,
  blur: 16,
  bezelWidth: 2,
  tint: { r: 0.16, g: 0.14, b: 0.26, a: 0.62 },
  shadowColor: { r: 0, g: 0, b: 0, a: 0.3 },
  specularOpacity: 0.08,
};

export function FeatureCardsSection({ copy }: { copy: FeatureCardsCopy }) {
  return (
    <section className="relative bg-background py-28 md:py-32 overflow-hidden">
      <div
        className="absolute inset-0 opacity-50"
        style={{
          background:
            "linear-gradient(180deg, transparent 0%, rgba(255,255,255,0.025) 42%, transparent 100%)",
        }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:72px_72px] opacity-[0.16]" />

      <div className="relative max-w-7xl mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 48 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="mb-12 md:mb-16 max-w-3xl"
        >
          <p className="text-accent text-sm uppercase mb-4">{copy.eyebrow}</p>
          <h2 className="text-[clamp(2rem,5vw,4rem)] font-bold leading-[1.08] text-foreground text-balance">
            {copy.title}
          </h2>
          <p className="mt-6 max-w-2xl text-base md:text-lg leading-relaxed text-muted-foreground">
            {copy.subtitle}
          </p>
        </motion.div>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,20rem),1fr))] gap-5 md:gap-6">
          {copy.items.map((item, index) => (
            <FeatureCard
              key={item.title}
              copy={copy}
              item={item}
              index={index}
              variant={featureVariants[index % featureVariants.length]}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureCard({
  copy,
  item,
  index,
  variant,
}: {
  copy: FeatureCardsCopy;
  item: FeatureCardsCopy["items"][number];
  index: number;
  variant: FeatureVariant;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        duration: 0.7,
        ease: [0.16, 1, 0.3, 1],
        delay: index * 0.08,
      }}
      className="relative h-full"
    >
      <article className="group flex h-full flex-col rounded-[8px] border border-border bg-card/40 p-3 shadow-[0_24px_80px_rgba(0,0,0,0.25)] transition-colors hover:border-accent/35 hover:bg-card/70 md:p-4">
        <FeatureThumb copy={copy} variant={variant} />

        <div className="px-1 pb-1 pt-5 md:px-2 md:pt-6">
          <h3 className="text-xl font-semibold leading-tight text-foreground">
            {item.title}
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            {item.caption}
          </p>
        </div>
      </article>
      {variant === "beauty" && (
        <p className="absolute left-0 right-0 top-full mt-3 flex items-center gap-2 px-2 text-[11px] font-medium leading-none text-muted-foreground/80">
          <Info
            aria-hidden="true"
            className="h-3.5 w-3.5 shrink-0 text-muted-foreground/70"
            strokeWidth={2}
          />
          <span className="leading-none">{copy.beautyThumb.disclosure}</span>
        </p>
      )}
    </motion.div>
  );
}

function FeatureThumb({
  copy,
  variant,
}: {
  copy: FeatureCardsCopy;
  variant: FeatureVariant;
}) {
  if (variant === "shortcuts") {
    return <ShortcutsThumb />;
  }

  if (variant === "beauty") {
    return <BeautyThumb copy={copy.beautyThumb} />;
  }

  return <GlassThumb copy={copy.glassThumb} />;
}

function GlassThumb({ copy }: { copy: FeatureCardsCopy["glassThumb"] }) {
  return <LiquidDomCanvasToolbarThumb copy={copy} />;
}

type CanvasToolbarItem = {
  id: string;
  label?: string;
  muted?: boolean;
  shortcut?: string[];
  text: string;
  type: "close" | "target" | "icon" | "meter" | "utility";
  width: number;
};

type CanvasToolbarHit = CanvasToolbarItem & {
  rect: Rect;
};

type CanvasToolbarLayout = {
  height: number;
  items: CanvasToolbarHit[];
  width: number;
  x: number;
  y: number;
};

type CanvasTooltipState = {
  bubbleCenterX: number;
  opacity: number;
  rawCenterX: number;
  shortcut?: string[];
  text: string;
  top: number;
  width: number;
};

type CanvasToolbarModeTransitionState = {
  progress: number;
  previousTimestamp: number;
};

type CanvasWallpaperDirection = -1 | 1;

type CanvasWallpaperTransitionState = {
  currentIndex: number;
  direction: CanvasWallpaperDirection;
  duration: number;
  isDragging: boolean;
  isTransitioning: boolean;
  nextIndex: number;
  progress: number;
  startProgress: number;
  startedAt: number;
  targetProgress: number;
};

type CanvasWallpaperDragState = {
  currentX: number;
  isDragging: boolean;
  pointerId: number | null;
  startX: number;
  startY: number;
  width: number;
};

type CanvasToolbarSymbolId =
  | "area"
  | "camera"
  | "close"
  | "display"
  | "iphone"
  | "keyboard"
  | "microphone"
  | "settings"
  | "system-audio"
  | "window"
  | "workspace";

type Rect = {
  height: number;
  width: number;
  x: number;
  y: number;
};

const canvasToolbarSymbolSources: Record<CanvasToolbarSymbolId, string> = {
  area: "/toolbar-symbols/viewfinder-rectangular.png",
  camera: "/toolbar-symbols/video-slash.png",
  close: "/toolbar-symbols/xmark.png",
  display: "/toolbar-symbols/display.png",
  iphone: "/toolbar-symbols/iphone.png",
  keyboard: "/toolbar-symbols/keyboard.png",
  microphone: "/toolbar-symbols/microphone-slash-fill.png",
  settings: "/toolbar-symbols/gear.png",
  "system-audio": "/toolbar-symbols/speaker-wave-2.png",
  window: "/toolbar-symbols/macwindow.png",
  workspace: "/toolbar-symbols/folder.png",
};

const canvasToolbarSymbolImages = new Map<
  CanvasToolbarSymbolId,
  HTMLImageElement
>();
let canvasToolbarSymbolLoadPromise: Promise<void> | null = null;
let canvasSymbolTintCanvas: HTMLCanvasElement | null = null;
let canvasTooltipMeasureCanvas: HTMLCanvasElement | null = null;

const canvasToolbarIconHoverSize = 38;
const canvasToolbarIconStrokeWidth = 2.6;
const canvasToolbarIconDrawSize = 26;
const canvasToolbarTargetIconDrawSize = 23;
const canvasToolbarModeTransitionMs = 260;
const canvasWallpaperTransitionDuration = 560;
const canvasWallpaperDragStartDistance = 5;
const canvasWallpaperSources = [
  "/macos26-wallpaper.jpg",
  "/feature-wallpapers/macos26-wallpaper-2.webp",
  "/feature-wallpapers/wallpaper-3.webp",
  "/feature-wallpapers/wallpaper-4.webp",
];

function createCanvasToolbarGroups(
  copy: FeatureCardsCopy["glassThumb"],
): CanvasToolbarItem[][] {
  return [
    [
      {
        id: "close",
        text: copy.toolbarItems.close,
        type: "close",
        width: 34,
      },
    ],
    [
      {
        id: "display",
        label: copy.toolbarItems.display,
        shortcut: ["⇧", "⌘", "1"],
        text: copy.toolbarItems.display,
        type: "target",
        width: 50,
      },
      {
        id: "window",
        label: copy.toolbarItems.window,
        shortcut: ["⇧", "⌘", "2"],
        text: copy.toolbarItems.window,
        type: "target",
        width: 50,
      },
      {
        id: "area",
        label: copy.toolbarItems.area,
        shortcut: ["⇧", "⌘", "3"],
        text: copy.toolbarItems.area,
        type: "target",
        width: 50,
      },
      {
        id: "iphone",
        label: copy.toolbarItems.iphone,
        text: copy.toolbarItems.iphone,
        type: "target",
        width: 50,
      },
    ],
    [
      {
        id: "camera",
        muted: true,
        text: copy.toolbarItems.camera,
        type: "icon",
        width: 38,
      },
      {
        id: "microphone",
        muted: true,
        text: copy.toolbarItems.microphone,
        type: "icon",
        width: 38,
      },
      {
        id: "system-audio",
        text: copy.toolbarItems.systemAudio,
        type: "meter",
        width: 92,
      },
      {
        id: "keyboard",
        text: copy.toolbarItems.keyboard,
        type: "icon",
        width: 38,
      },
    ],
    [
      {
        id: "workspace",
        text: copy.toolbarItems.workspace,
        type: "utility",
        width: 38,
      },
      {
        id: "settings",
        text: copy.toolbarItems.settings,
        type: "utility",
        width: 38,
      },
    ],
  ];
}

function LiquidDomCanvasToolbarThumb({
  copy,
}: {
  copy: FeatureCardsCopy["glassThumb"];
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const wallpaperCanvasRef = useRef<HTMLCanvasElement>(null);
  const wallpaperTransitionRef = useRef<CanvasWallpaperTransitionState>({
    currentIndex: 0,
    direction: 1,
    duration: canvasWallpaperTransitionDuration,
    isDragging: false,
    isTransitioning: false,
    nextIndex: 0,
    progress: 1,
    startProgress: 0,
    startedAt: 0,
    targetProgress: 1,
  });
  const wallpaperDragRef = useRef<CanvasWallpaperDragState>({
    currentX: 0,
    isDragging: false,
    pointerId: null,
    startX: 0,
    startY: 0,
    width: 1,
  });
  const wallpaperFrameRequestRef = useRef(0);
  const activeWallpaperTouchRef = useRef<number | null>(null);
  const activeToolbarTouchRef = useRef<number | null>(null);
  const activeIdRef = useRef<string | null>(null);
  const hitTargetsRef = useRef<CanvasToolbarHit[]>([]);
  const tooltipHideTimeoutRef = useRef<number | null>(null);
  const tooltipRef = useRef<CanvasTooltipState>({
    bubbleCenterX: 220,
    opacity: 0,
    rawCenterX: 220,
    text: "",
    top: 40,
    width: 120,
  });
  const [size, setSize] = useState({ height: 0, width: 0 });
  const [tooltipTarget, setTooltipTarget] = useState<CanvasTooltipState | null>(
    null,
  );
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [toolbarMode, setToolbarMode] = useState<ToolbarGlassMode>("clear");
  const [isWallpaperSwitching, setIsWallpaperSwitching] = useState(false);
  const canUseLiquidDom = useWebGpuAvailable();
  const toolbarGroups = useMemo(() => createCanvasToolbarGroups(copy), [copy]);

  const layout = useMemo(
    () => computeCanvasToolbarLayout(size.width, size.height, toolbarGroups),
    [size.height, size.width, toolbarGroups],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;
    if (!canvas || !parent) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let dpr = 1;
    let height = 0;
    let isMounted = true;
    let isVisible = false;
    let lastFrameTime = 0;
    let raf = 0;
    let shouldAnimate = false;
    let width = 0;

    const resize = () => {
      const rect = parent.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);

      const pixelWidth = Math.round(width * dpr);
      const pixelHeight = Math.round(height * dpr);
      canvas.width = pixelWidth;
      canvas.height = pixelHeight;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(pixelWidth / width, 0, 0, pixelHeight / height, 0, 0);
      setSize((current) =>
        current.width === width && current.height === height
          ? current
          : { height, width },
      );
      draw(performance.now());
    };

    const draw = (timestamp: number) => {
      if (!isMounted || width <= 0 || height <= 0) return;

      ctx.clearRect(0, 0, width, height);

      const layout = computeCanvasToolbarLayout(width, height, toolbarGroups);
      hitTargetsRef.current = layout.items;
      const activeItem =
        layout.items.find((item) => item.id === activeIdRef.current) ?? null;

      drawToolbarContent(ctx, layout, activeItem?.id ?? null, timestamp);

      if (tooltipRef.current.opacity > 0.01) {
        drawToolbarTooltip(ctx, tooltipRef.current);
      }
    };

    const animateFrame = (timestamp: number) => {
      if (!isMounted || !isVisible || document.hidden) {
        raf = 0;
        return;
      }

      const layout = computeCanvasToolbarLayout(width, height, toolbarGroups);
      const activeItem =
        layout.items.find((item) => item.id === activeIdRef.current) ?? null;
      const targetTooltip = activeItem
        ? getCanvasTooltipTarget(activeItem, width)
        : null;
      const shouldContinue = stepCanvasTooltip(
        tooltipRef.current,
        targetTooltip,
      );
      const shouldDrawMeterFrame = timestamp - lastFrameTime >= 32;

      if (shouldDrawMeterFrame || shouldAnimate || shouldContinue) {
        lastFrameTime = timestamp;
        draw(timestamp);
      }

      shouldAnimate = false;
      raf = requestAnimationFrame(animateFrame);
    };

    const start = () => {
      if (!raf && isVisible && !document.hidden) {
        raf = requestAnimationFrame(animateFrame);
      }
    };

    const requestDraw = () => {
      shouldAnimate = true;
      start();
    };

    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };

    void loadCanvasToolbarSymbols()
      .then(() => {
        if (!isMounted) return;
        draw(performance.now());
        requestDraw();
      })
      .catch((error) => {
        console.error("Toolbar symbol loading failed", error);
      });

    resize();

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(parent);
    canvas.addEventListener("screen-cam-tooltip-change", requestDraw);
    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible) {
          draw(performance.now());
          start();
        } else {
          stop();
        }
      },
      { threshold: 0.01 },
    );
    visibilityObserver.observe(parent);

    const handleVisibilityChange = () => {
      if (document.hidden) {
        stop();
      } else {
        draw(performance.now());
        start();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      isMounted = false;
      stop();
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      canvas.removeEventListener("screen-cam-tooltip-change", requestDraw);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [toolbarGroups]);

  const dispatchToolbarTooltipChange = () => {
    canvasRef.current?.dispatchEvent(new Event("screen-cam-tooltip-change"));
  };

  const clearToolbarTooltipHideTimeout = () => {
    if (tooltipHideTimeoutRef.current === null) return;
    window.clearTimeout(tooltipHideTimeoutRef.current);
    tooltipHideTimeoutRef.current = null;
  };

  const getToolbarHitTarget = (
    clientX: number,
    clientY: number,
    rect: DOMRect,
  ) => {
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    return (
      hitTargetsRef.current.find((item) => pointInRect(x, y, item.rect)) ?? null
    );
  };

  const getToolbarTouchTarget = (touch: Touch) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const rect = canvas.getBoundingClientRect();
    const item = getToolbarHitTarget(touch.clientX, touch.clientY, rect);
    return item ? { item, width: rect.width } : null;
  };

  const setToolbarTooltipTarget = (
    target: CanvasToolbarHit | null,
    canvasWidth: number,
    force = false,
  ) => {
    if (target) {
      clearToolbarTooltipHideTimeout();
    }

    const nextId = target?.id ?? null;
    if (!force && activeIdRef.current === nextId) return false;

    activeIdRef.current = nextId;
    if (target) {
      setTooltipTarget(getCanvasTooltipTarget(target, canvasWidth));
      setTooltipVisible(true);
    } else {
      setTooltipVisible(false);
    }

    return true;
  };

  const updatePointerTarget = (event: ReactPointerEvent<HTMLCanvasElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const hovered = getToolbarHitTarget(event.clientX, event.clientY, rect);
    return setToolbarTooltipTarget(hovered, rect.width);
  };

  const hideToolbarTooltip = () => {
    clearToolbarTooltipHideTimeout();
    activeToolbarTouchRef.current = null;
    activeIdRef.current = null;
    setTooltipVisible(false);
    dispatchToolbarTooltipChange();
  };

  const scheduleToolbarTooltipHide = () => {
    clearToolbarTooltipHideTimeout();
    tooltipHideTimeoutRef.current = window.setTimeout(() => {
      tooltipHideTimeoutRef.current = null;
      activeToolbarTouchRef.current = null;
      activeIdRef.current = null;
      setTooltipVisible(false);
      dispatchToolbarTooltipChange();
    }, 1800);
  };

  const dispatchWallpaperChange = () => {
    thumbRef.current?.dispatchEvent(new Event("screen-cam-wallpaper-change"));
  };

  const requestWallpaperFrame = (immediate = false) => {
    if (immediate) {
      if (wallpaperFrameRequestRef.current) {
        cancelAnimationFrame(wallpaperFrameRequestRef.current);
        wallpaperFrameRequestRef.current = 0;
      }
      dispatchWallpaperChange();
      return;
    }

    if (wallpaperFrameRequestRef.current) return;

    wallpaperFrameRequestRef.current = requestAnimationFrame(() => {
      wallpaperFrameRequestRef.current = 0;
      dispatchWallpaperChange();
    });
  };

  useEffect(() => {
    return () => {
      clearToolbarTooltipHideTimeout();
      if (wallpaperFrameRequestRef.current) {
        cancelAnimationFrame(wallpaperFrameRequestRef.current);
      }
    };
  }, []);

  const switchWallpaper = () => {
    const state = wallpaperTransitionRef.current;
    if (state.isTransitioning) return;

    startCanvasWallpaperTransition(state, 1, performance.now());
    setIsWallpaperSwitching(true);
    requestWallpaperFrame(true);
  };

  const startWallpaperDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    if (
      event.target instanceof Element &&
      event.target.closest("button")
    ) {
      return;
    }

    const state = wallpaperTransitionRef.current;
    if (state.isTransitioning && !state.isDragging) return;

    const rect = event.currentTarget.getBoundingClientRect();
    wallpaperDragRef.current = {
      currentX: event.clientX,
      isDragging: false,
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      width: Math.max(1, rect.width),
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const updateWallpaperDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = wallpaperDragRef.current;
    if (drag.pointerId !== event.pointerId) return;

    drag.currentX = event.clientX;
    const deltaX = event.clientX - drag.startX;
    const deltaY = event.clientY - drag.startY;
    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);

    if (!drag.isDragging) {
      if (
        absY > canvasWallpaperDragStartDistance &&
        absY > absX * 1.25
      ) {
        releaseWallpaperDragCapture(event.currentTarget, event.pointerId);
        resetCanvasWallpaperDrag(drag);
        return;
      }

      if (
        absX < canvasWallpaperDragStartDistance ||
        absX < absY * 1.1
      ) {
        return;
      }

      drag.isDragging = true;
      setIsWallpaperSwitching(true);
      hideToolbarTooltip();
    }

    event.preventDefault();
    previewCanvasWallpaperDrag(
      wallpaperTransitionRef.current,
      deltaX,
      drag.width,
    );
    requestWallpaperFrame();
  };

  const finishWallpaperDrag = (
    event: ReactPointerEvent<HTMLDivElement>,
    shouldCancel = false,
  ) => {
    const drag = wallpaperDragRef.current;
    if (drag.pointerId !== event.pointerId) return;

    const wasDragging = drag.isDragging;
    const deltaX = event.clientX - drag.startX;
    const dragWidth = drag.width;
    releaseWallpaperDragCapture(event.currentTarget, event.pointerId);
    resetCanvasWallpaperDrag(drag);

    if (!wasDragging) return;

    event.preventDefault();
    previewCanvasWallpaperDrag(
      wallpaperTransitionRef.current,
      deltaX,
      dragWidth,
    );

    const shouldCommit =
      !shouldCancel &&
      Math.abs(deltaX) >= getCanvasWallpaperDragThreshold(dragWidth);
    const shouldAnimate = finishCanvasWallpaperDrag(
      wallpaperTransitionRef.current,
      shouldCommit,
      performance.now(),
    );

    setIsWallpaperSwitching(shouldAnimate);
    requestWallpaperFrame(true);
  };

  const getActiveWallpaperTouch = (touches: TouchList) => {
    const activeTouchId = activeWallpaperTouchRef.current;
    if (activeTouchId === null) return touches.item(0);

    for (let index = 0; index < touches.length; index += 1) {
      const touch = touches.item(index);
      if (touch?.identifier === activeTouchId) return touch;
    }

    return null;
  };

  const touchListIncludesId = (touches: TouchList, touchId: number) => {
    for (let index = 0; index < touches.length; index += 1) {
      if (touches.item(index)?.identifier === touchId) return true;
    }

    return false;
  };

  const changedTouchesIncludeActiveWallpaperTouch = (touches: TouchList) => {
    const activeTouchId = activeWallpaperTouchRef.current;
    if (activeTouchId === null) return touches.length > 0;

    return touchListIncludesId(touches, activeTouchId);
  };

  const startWallpaperTouchDrag = (event: TouchEvent) => {
    if (
      event.target instanceof Element &&
      event.target.closest("button")
    ) {
      return;
    }

    const touch = event.touches.item(0);
    const target = thumbRef.current;
    if (!touch || !target) return;

    const toolbarTarget = getToolbarTouchTarget(touch);
    if (toolbarTarget) {
      activeToolbarTouchRef.current = touch.identifier;
      setToolbarTooltipTarget(toolbarTarget.item, toolbarTarget.width, true);
      dispatchToolbarTooltipChange();
      return;
    }

    const state = wallpaperTransitionRef.current;
    if (state.isTransitioning && !state.isDragging) return;

    const rect = target.getBoundingClientRect();
    activeWallpaperTouchRef.current = touch.identifier;
    wallpaperDragRef.current = {
      currentX: touch.clientX,
      isDragging: false,
      pointerId: touch.identifier,
      startX: touch.clientX,
      startY: touch.clientY,
      width: Math.max(1, rect.width),
    };
  };

  const updateWallpaperTouchDrag = (event: TouchEvent) => {
    if (activeToolbarTouchRef.current !== null) return;

    const drag = wallpaperDragRef.current;
    const touch = getActiveWallpaperTouch(event.touches);
    if (!touch || drag.pointerId !== touch.identifier) return;

    drag.currentX = touch.clientX;
    const deltaX = touch.clientX - drag.startX;
    const deltaY = touch.clientY - drag.startY;
    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);

    if (!drag.isDragging) {
      if (
        absY > canvasWallpaperDragStartDistance &&
        absY > absX * 1.25
      ) {
        activeWallpaperTouchRef.current = null;
        resetCanvasWallpaperDrag(drag);
        return;
      }

      if (
        absX < canvasWallpaperDragStartDistance ||
        absX < absY * 1.1
      ) {
        return;
      }

      drag.isDragging = true;
      setIsWallpaperSwitching(true);
      hideToolbarTooltip();
    }

    event.preventDefault();
    previewCanvasWallpaperDrag(
      wallpaperTransitionRef.current,
      deltaX,
      drag.width,
    );
    requestWallpaperFrame();
  };

  const finishWallpaperTouchDrag = (
    event: TouchEvent,
    shouldCancel = false,
  ) => {
    const activeToolbarTouchId = activeToolbarTouchRef.current;
    if (activeToolbarTouchId !== null) {
      if (!touchListIncludesId(event.changedTouches, activeToolbarTouchId)) return;

      activeToolbarTouchRef.current = null;
      if (shouldCancel) {
        hideToolbarTooltip();
      } else {
        scheduleToolbarTooltipHide();
      }
      return;
    }

    const drag = wallpaperDragRef.current;
    if (
      drag.pointerId === null ||
      !changedTouchesIncludeActiveWallpaperTouch(event.changedTouches)
    ) {
      return;
    }

    const wasDragging = drag.isDragging;
    const deltaX = drag.currentX - drag.startX;
    const dragWidth = drag.width;
    activeWallpaperTouchRef.current = null;
    resetCanvasWallpaperDrag(drag);

    if (!wasDragging) return;

    event.preventDefault();
    previewCanvasWallpaperDrag(
      wallpaperTransitionRef.current,
      deltaX,
      dragWidth,
    );

    const shouldCommit =
      !shouldCancel &&
      Math.abs(deltaX) >= getCanvasWallpaperDragThreshold(dragWidth);
    const shouldAnimate = finishCanvasWallpaperDrag(
      wallpaperTransitionRef.current,
      shouldCommit,
      performance.now(),
    );

    setIsWallpaperSwitching(shouldAnimate);
    requestWallpaperFrame(true);
  };

  useEffect(() => {
    const thumb = thumbRef.current;
    if (!thumb) return;

    const options = { passive: false };
    const cancelWallpaperTouchDrag = (event: TouchEvent) => {
      finishWallpaperTouchDrag(event, true);
    };

    thumb.addEventListener("touchstart", startWallpaperTouchDrag, options);
    thumb.addEventListener("touchmove", updateWallpaperTouchDrag, options);
    thumb.addEventListener("touchend", finishWallpaperTouchDrag, options);
    thumb.addEventListener("touchcancel", cancelWallpaperTouchDrag, options);

    return () => {
      thumb.removeEventListener("touchstart", startWallpaperTouchDrag);
      thumb.removeEventListener("touchmove", updateWallpaperTouchDrag);
      thumb.removeEventListener("touchend", finishWallpaperTouchDrag);
      thumb.removeEventListener("touchcancel", cancelWallpaperTouchDrag);
    };
  });

  useEffect(() => {
    const canvas = wallpaperCanvasRef.current;
    const parent = thumbRef.current;
    if (!canvas || !parent) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let dpr = 1;
    let height = 0;
    let images: HTMLImageElement[] = [];
    let isMounted = true;
    let raf = 0;
    let width = 0;

    const draw = (timestamp = performance.now()) => {
      if (images.length === 0 || width <= 0 || height <= 0) return;

      const shouldContinue = stepCanvasWallpaperTransition(
        wallpaperTransitionRef.current,
        timestamp,
      );
      paintCanvasWallpaperFrame(
        canvas,
        images,
        wallpaperTransitionRef.current,
        Math.round(width * dpr),
        Math.round(height * dpr),
      );

      thumbRef.current?.dispatchEvent(new Event("screen-cam-wallpaper-frame"));

      if (shouldContinue) {
        raf = requestAnimationFrame(draw);
      } else {
        raf = 0;
        if (!wallpaperTransitionRef.current.isDragging) {
          setIsWallpaperSwitching(false);
        }
      }
    };

    const resize = () => {
      const rect = parent.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      draw();
    };

    const startTransitionDraw = () => {
      if (!raf) {
        raf = requestAnimationFrame(draw);
      }
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(parent);
    resize();

    parent.addEventListener("screen-cam-wallpaper-change", startTransitionDraw);

    void loadCanvasImages(canvasWallpaperSources)
      .then((loadedImages) => {
        if (!isMounted) return;
        images = loadedImages;
        draw();
      })
      .catch((error) => {
        console.error("Wallpaper loading failed", error);
      });

    return () => {
      isMounted = false;
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      parent.removeEventListener(
        "screen-cam-wallpaper-change",
        startTransitionDraw,
      );
    };
  }, []);

  return (
    <div
      ref={thumbRef}
      className="relative aspect-[4/3] cursor-grab select-none overflow-hidden rounded-[8px] bg-blue-950 active:cursor-grabbing"
      data-screen-cam-drag-surface
      style={{ touchAction: "pan-y" }}
      onPointerCancel={(event) => finishWallpaperDrag(event, true)}
      onPointerDown={startWallpaperDrag}
      onPointerMove={updateWallpaperDrag}
      onPointerUp={finishWallpaperDrag}
    >
      <canvas
        ref={wallpaperCanvasRef}
        aria-hidden="true"
        className="absolute inset-0 block h-full w-full"
        style={{ touchAction: "pan-y" }}
      />
      {canUseLiquidDom && (
        <LiquidCoreGlassCanvas
          layout={layout}
          size={size}
          toolbarMode={toolbarMode}
          tooltipTarget={tooltipTarget}
          tooltipVisible={tooltipVisible}
          wallpaperTransitionRef={wallpaperTransitionRef}
        />
      )}
      <canvas
        ref={canvasRef}
        aria-label="Liquid glass recording toolbar preview"
        className="absolute inset-0 z-10 h-full w-full"
        data-liquid-dom-toolbar-thumb
        style={{ touchAction: "pan-y" }}
        onPointerCancel={(event) => {
          if (event.pointerType !== "mouse") {
            hideToolbarTooltip();
          }
        }}
        onPointerDown={(event) => {
          if (wallpaperDragRef.current.isDragging) return;

          const rect = event.currentTarget.getBoundingClientRect();
          const target = getToolbarHitTarget(
            event.clientX,
            event.clientY,
            rect,
          );

          if (!target) {
            if (event.pointerType !== "mouse") {
              hideToolbarTooltip();
            }
            return;
          }

          event.stopPropagation();
          if (event.pointerType !== "mouse") {
            event.preventDefault();
          }

          setToolbarTooltipTarget(target, rect.width, true);
          dispatchToolbarTooltipChange();
        }}
        onPointerLeave={() => {
          hideToolbarTooltip();
        }}
        onPointerMove={(event) => {
          if (wallpaperDragRef.current.isDragging) return;

          if (updatePointerTarget(event)) {
            dispatchToolbarTooltipChange();
          }
        }}
        onPointerUp={(event) => {
          if (event.pointerType !== "mouse" && activeIdRef.current) {
            scheduleToolbarTooltipHide();
          }
        }}
      />
      <ToolbarModeSwitch
        labels={copy.modeLabels}
        mode={toolbarMode}
        onChange={setToolbarMode}
      />
      <button
        type="button"
        aria-label={copy.wallpaperButtonAria}
        className="absolute bottom-2 left-2 z-20 flex h-7 w-7 cursor-pointer items-center justify-center rounded-[8px] bg-transparent text-white/60 transition-colors hover:bg-white/14 hover:text-white disabled:pointer-events-none disabled:opacity-45"
        disabled={isWallpaperSwitching}
        onClick={switchWallpaper}
      >
        <ImageIcon
          aria-hidden="true"
          className="h-[15px] w-[15px]"
          strokeWidth={2.2}
        />
      </button>
    </div>
  );
}

function ToolbarModeSwitch({
  labels,
  mode,
  onChange,
}: {
  labels: FeatureCardsCopy["glassThumb"]["modeLabels"];
  mode: ToolbarGlassMode;
  onChange: (mode: ToolbarGlassMode) => void;
}) {
  const buttonRefs = useRef<Record<ToolbarGlassMode, HTMLButtonElement | null>>(
    {
      clear: null,
      regular: null,
    },
  );
  const rootRef = useRef<HTMLDivElement>(null);
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });

  useEffect(() => {
    const root = rootRef.current;
    const updateIndicator = () => {
      const button = buttonRefs.current[mode];
      if (!button) return;
      setIndicator({
        left: button.offsetLeft,
        width: button.offsetWidth,
      });
    };

    updateIndicator();
    if (!root) return;

    const resizeObserver = new ResizeObserver(updateIndicator);
    resizeObserver.observe(root);
    return () => resizeObserver.disconnect();
  }, [labels, mode]);

  return (
    <div
      ref={rootRef}
      className="absolute bottom-3 right-3 z-20 flex items-end gap-3 text-[10px] font-medium leading-none"
      aria-label="Toolbar glass style"
    >
      {(["clear", "regular"] as const).map((item) => (
        <button
          key={item}
          ref={(node) => {
            buttonRefs.current[item] = node;
          }}
          type="button"
          className={`relative cursor-pointer appearance-none border-0 bg-transparent px-0 pb-1 transition-colors duration-300 ${
            mode === item ? "text-white" : "text-white/45 hover:text-white/70"
          }`}
          onClick={() => onChange(item)}
        >
          {labels[item]}
        </button>
      ))}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 h-px bg-white transition-[left,width] duration-300 ease-out"
        style={{
          left: indicator.left,
          width: indicator.width,
        }}
      />
    </div>
  );
}

function useWebGpuAvailable() {
  const [available, setAvailable] = useState(false);

  useEffect(() => {
    let mounted = true;
    const gpu = (navigator as Navigator & { gpu?: GPU }).gpu;

    if (!gpu?.requestAdapter) {
      return () => {
        mounted = false;
      };
    }

    void (async () => {
      const adapter = await gpu.requestAdapter();
      if (!adapter) return;

      const device = await adapter.requestDevice();
      const canCopyCanvas =
        typeof device.queue.copyExternalImageToTexture === "function";
      device.destroy();

      if (mounted && canCopyCanvas) {
        setAvailable(true);
      }
    })().catch((error) => {
      if (mounted) {
        console.error("WebGPU adapter check failed", error);
      }
    });

    return () => {
      mounted = false;
    };
  }, []);

  return available;
}

type LiquidCoreCanvasHandles = {
  backdropCanvas: HTMLCanvasElement;
  backdropTexture: GPUTexture | null;
  context: GPUCanvasContext;
  core: WebGpuGlassCore;
  device: GPUDevice;
  format: GPUTextureFormat;
  scene: CoreScene;
  tooltipArrow: CoreGlass;
  tooltipBubble: CoreGlass;
  tooltipContainer: CoreContainer;
  toolbarContainer: CoreContainer;
  toolbarGlass: CoreGlass;
  wallpaperFrameKey: string;
  wallpaperImages: HTMLImageElement[];
  width: number;
  height: number;
  dpr: number;
};

function LiquidCoreGlassCanvas({
  layout,
  size,
  toolbarMode,
  tooltipTarget,
  tooltipVisible,
  wallpaperTransitionRef,
}: {
  layout: CanvasToolbarLayout;
  size: Rect;
  toolbarMode: ToolbarGlassMode;
  tooltipTarget: CanvasTooltipState | null;
  tooltipVisible: boolean;
  wallpaperTransitionRef: MutableRefObject<CanvasWallpaperTransitionState>;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef(0);
  const handlesRef = useRef<LiquidCoreCanvasHandles | null>(null);
  const layoutRef = useRef(layout);
  const modeRef = useRef(toolbarMode);
  const modeTransitionRef = useRef<CanvasToolbarModeTransitionState>({
    progress: toolbarMode === "regular" ? 1 : 0,
    previousTimestamp: 0,
  });
  const sizeRef = useRef(size);
  const targetRef = useRef<CanvasTooltipState | null>(null);
  const tooltipRef = useRef<CanvasTooltipState>({
    bubbleCenterX: size.width / 2,
    opacity: 0,
    rawCenterX: size.width / 2,
    text: "",
    top: Math.max(28, layout.y - 44),
    width: 120,
  });
  const requestRenderRef = useRef<() => void>(() => undefined);

  useEffect(() => {
    layoutRef.current = layout;
    modeRef.current = toolbarMode;
    sizeRef.current = size;
    targetRef.current = tooltipVisible ? tooltipTarget : null;
    requestRenderRef.current();
  }, [layout, size, toolbarMode, tooltipTarget, tooltipVisible]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;
    if (!canvas || !parent) return;

    let disposed = false;
    let isVisible = false;
    let resizeObserver: ResizeObserver | null = null;
    let visibilityObserver: IntersectionObserver | null = null;

    const renderFrame = (timestamp: number) => {
      frameRef.current = 0;
      const handles = handlesRef.current;
      if (!handles || disposed || !isVisible || document.hidden) return;

      const shouldContinueTooltip = stepCanvasTooltip(
        tooltipRef.current,
        targetRef.current,
      );
      const shouldContinueMode = stepToolbarModeTransition(
        modeTransitionRef.current,
        modeRef.current,
        timestamp,
      );
      const shouldContinueWallpaper = stepCanvasWallpaperTransition(
        wallpaperTransitionRef.current,
        timestamp,
      );
      resizeLiquidCoreCanvas(handles, parent);
      renderLiquidCoreGlass(
        handles,
        layoutRef.current,
        sizeRef.current,
        modeTransitionRef.current.progress,
        tooltipRef.current,
        wallpaperTransitionRef.current,
      );

      if (
        (shouldContinueTooltip ||
          shouldContinueMode ||
          shouldContinueWallpaper) &&
        isVisible &&
        !document.hidden
      ) {
        frameRef.current = requestAnimationFrame(renderFrame);
      }
    };

    const requestRender = () => {
      if (!isVisible || document.hidden) return;
      if (!frameRef.current) {
        frameRef.current = requestAnimationFrame(renderFrame);
      }
    };
    requestRenderRef.current = requestRender;

    const init = async () => {
      try {
        const gpu = (navigator as Navigator & { gpu?: GPU }).gpu;
        const adapter = await gpu?.requestAdapter();
        if (!gpu || !adapter || disposed) return;

        const device = await adapter.requestDevice();
        const context = canvas.getContext("webgpu");
        if (
          !context ||
          disposed ||
          typeof device.queue.copyExternalImageToTexture !== "function"
        ) {
          device.destroy();
          return;
        }

        const format = gpu.getPreferredCanvasFormat();
        const scene = new CoreScene();
        const toolbarContainer = new CoreContainer(coreGlassOptions);
        const toolbarGlass = new CoreGlass({
          cornerRadius: 27,
          cornerSmoothing: 0.6,
        });
        toolbarContainer.add(toolbarGlass);
        scene.add(toolbarContainer);

        const tooltipContainer = new CoreContainer({
          ...tooltipGlassOptions,
          opacity: 0,
        });
        const tooltipBubble = new CoreGlass({
          cornerRadius: 13,
          cornerSmoothing: 0.72,
        });
        const tooltipArrow = new CoreGlass({
          width: 12,
          height: 12,
          cornerRadius: 4.5,
          cornerSmoothing: 0.45,
          rotation: Math.PI / 4,
          origin: { x: 6, y: 6 },
        });
        tooltipContainer.add(tooltipBubble);
        tooltipContainer.add(tooltipArrow);
        scene.add(tooltipContainer);

        const wallpaperImages = await loadCanvasImages(canvasWallpaperSources);
        if (disposed) {
          device.destroy();
          return;
        }

        handlesRef.current = {
          backdropCanvas: document.createElement("canvas"),
          backdropTexture: null,
          context,
          core: new WebGpuGlassCore({ device, format }),
          device,
          dpr: 1,
          format,
          height: 0,
          scene,
          tooltipArrow,
          tooltipBubble,
          tooltipContainer,
          toolbarContainer,
          toolbarGlass,
          wallpaperFrameKey: "",
          wallpaperImages,
          width: 0,
        };

        resizeObserver = new ResizeObserver(requestRender);
        resizeObserver.observe(parent);
        parent.addEventListener("screen-cam-wallpaper-change", requestRender);
        parent.addEventListener("screen-cam-wallpaper-frame", requestRender);

        visibilityObserver = new IntersectionObserver(
          ([entry]) => {
            isVisible = entry.isIntersecting;
            if (isVisible) {
              requestRender();
            } else if (frameRef.current) {
              cancelAnimationFrame(frameRef.current);
              frameRef.current = 0;
            }
          },
          { threshold: 0.01 },
        );
        visibilityObserver.observe(parent);
        requestRender();
      } catch (error) {
        console.error("Liquid glass core renderer failed", error);
      }
    };

    void init();

    return () => {
      disposed = true;
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
      resizeObserver?.disconnect();
      visibilityObserver?.disconnect();
      parent.removeEventListener("screen-cam-wallpaper-change", requestRender);
      parent.removeEventListener("screen-cam-wallpaper-frame", requestRender);
      const handles = handlesRef.current;
      handles?.backdropTexture?.destroy();
      handles?.core.destroy();
      handles?.device.destroy();
      handlesRef.current = null;
      requestRenderRef.current = () => undefined;
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 block h-full w-full"
      style={{ touchAction: "pan-y" }}
    />
  );
}

function resizeLiquidCoreCanvas(
  handles: LiquidCoreCanvasHandles,
  parent: HTMLElement,
) {
  const rect = parent.getBoundingClientRect();
  const width = Math.max(1, rect.width);
  const height = Math.max(1, rect.height);
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const pixelWidth = Math.max(1, Math.round(width * dpr));
  const pixelHeight = Math.max(1, Math.round(height * dpr));
  const canvas = handles.context.canvas as HTMLCanvasElement;

  if (
    handles.width === pixelWidth &&
    handles.height === pixelHeight &&
    handles.dpr === dpr
  ) {
    return;
  }

  handles.width = pixelWidth;
  handles.height = pixelHeight;
  handles.dpr = dpr;
  canvas.width = pixelWidth;
  canvas.height = pixelHeight;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  handles.context.configure({
    device: handles.device,
    format: handles.format,
    alphaMode: "opaque",
    usage: GPUTextureUsage.RENDER_ATTACHMENT,
  });

  handles.backdropTexture?.destroy();
  handles.backdropTexture = handles.device.createTexture({
    size: { width: pixelWidth, height: pixelHeight },
    format: handles.format,
    usage:
      GPUTextureUsage.COPY_DST |
      GPUTextureUsage.RENDER_ATTACHMENT |
      GPUTextureUsage.TEXTURE_BINDING,
  });
  handles.wallpaperFrameKey = "";
}

function renderLiquidCoreGlass(
  handles: LiquidCoreCanvasHandles,
  layout: CanvasToolbarLayout,
  size: Rect,
  regularProgress: number,
  tooltip: CanvasTooltipState,
  wallpaperState: CanvasWallpaperTransitionState,
) {
  if (!handles.backdropTexture || handles.width <= 0 || handles.height <= 0)
    return;

  syncLiquidCoreBackdrop(handles, wallpaperState);
  applyToolbarGlassOptions(handles.toolbarContainer, regularProgress);

  handles.toolbarGlass.x = layout.x;
  handles.toolbarGlass.y = layout.y;
  handles.toolbarGlass.width = layout.width;
  handles.toolbarGlass.height = layout.height;
  handles.toolbarGlass.cornerRadius = layout.height / 2;

  handles.tooltipContainer.opacity = tooltip.opacity;
  handles.tooltipBubble.x = tooltip.bubbleCenterX - tooltip.width / 2;
  handles.tooltipBubble.y = tooltip.top;
  handles.tooltipBubble.width = tooltip.width;
  handles.tooltipBubble.height = 34;
  handles.tooltipArrow.x = tooltip.rawCenterX - 6;
  handles.tooltipArrow.y = tooltip.top + 28;

  handles.core.render({
    scene: handles.scene,
    width: handles.width,
    height: handles.height,
    dpr: handles.dpr,
    outputTexture: handles.context.getCurrentTexture(),
    backdropTexture: handles.backdropTexture,
  });
}

function applyToolbarGlassOptions(container: CoreContainer, progress: number) {
  const amount = clamp(progress, 0, 1);

  container.blur = lerp(
    coreGlassOptions.blur,
    regularToolbarGlassOptions.blur,
    amount,
  );
  container.spacing = lerp(
    coreGlassOptions.spacing,
    regularToolbarGlassOptions.spacing,
    amount,
  );
  container.bezelWidth = lerp(
    coreGlassOptions.bezelWidth,
    regularToolbarGlassOptions.bezelWidth,
    amount,
  );
  container.shadowOffsetY = lerp(
    coreGlassOptions.shadowOffsetY,
    regularToolbarGlassOptions.shadowOffsetY,
    amount,
  );
  container.shadowBlur = lerp(
    coreGlassOptions.shadowBlur,
    regularToolbarGlassOptions.shadowBlur,
    amount,
  );
  container.specularOpacity = lerp(
    coreGlassOptions.specularOpacity,
    regularToolbarGlassOptions.specularOpacity,
    amount,
  );
  container.tint = lerpColor(
    coreGlassOptions.tint,
    regularToolbarGlassOptions.tint,
    amount,
  );
  container.shadowColor = lerpColor(
    coreGlassOptions.shadowColor,
    regularToolbarGlassOptions.shadowColor,
    amount,
  );
}

function syncLiquidCoreBackdrop(
  handles: LiquidCoreCanvasHandles,
  wallpaperState: CanvasWallpaperTransitionState,
) {
  if (!handles.backdropTexture) return;

  const frameKey = getCanvasWallpaperFrameKey(wallpaperState);
  if (handles.wallpaperFrameKey === frameKey) return;

  paintCanvasWallpaperFrame(
    handles.backdropCanvas,
    handles.wallpaperImages,
    wallpaperState,
    handles.width,
    handles.height,
  );
  handles.device.queue.copyExternalImageToTexture(
    { source: handles.backdropCanvas },
    { texture: handles.backdropTexture },
    { width: handles.width, height: handles.height },
  );
  handles.wallpaperFrameKey = frameKey;
}

function paintCanvasWallpaperFrame(
  canvas: HTMLCanvasElement,
  images: HTMLImageElement[],
  state: CanvasWallpaperTransitionState,
  width: number,
  height: number,
) {
  if (canvas.width !== width) canvas.width = width;
  if (canvas.height !== height) canvas.height = height;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const currentImage = images[state.currentIndex] ?? images[0];
  const nextImage = images[state.nextIndex] ?? currentImage;
  if (!currentImage) return;

  ctx.fillStyle = "#172554";
  ctx.fillRect(0, 0, width, height);
  ctx.filter = "brightness(0.78) saturate(1.08)";

  if (state.isTransitioning && currentImage !== nextImage) {
    const progress = clamp(state.progress, 0, 1);
    const offsetDirection = state.direction;
    drawCanvasCoverImage(
      ctx,
      currentImage,
      width,
      height,
      -progress * width * offsetDirection,
    );
    drawCanvasCoverImage(
      ctx,
      nextImage,
      width,
      height,
      (1 - progress) * width * offsetDirection,
    );
  } else {
    drawCanvasCoverImage(ctx, currentImage, width, height, 0);
  }

  ctx.filter = "none";
}

function drawCanvasCoverImage(
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
  width: number,
  height: number,
  panelX: number,
) {
  const imageRatio = image.naturalWidth / image.naturalHeight;
  const canvasRatio = width / height;
  const drawWidth = imageRatio > canvasRatio ? height * imageRatio : width;
  const drawHeight = imageRatio > canvasRatio ? height : width / imageRatio;
  const x = panelX + (width - drawWidth) / 2;
  const y = (height - drawHeight) / 2;

  ctx.save();
  ctx.beginPath();
  ctx.rect(panelX, 0, width, height);
  ctx.clip();
  ctx.drawImage(image, x, y, drawWidth, drawHeight);
  ctx.restore();
}

function startCanvasWallpaperTransition(
  state: CanvasWallpaperTransitionState,
  direction: CanvasWallpaperDirection,
  timestamp: number,
) {
  state.direction = direction;
  state.duration = canvasWallpaperTransitionDuration;
  state.isDragging = false;
  state.isTransitioning = true;
  state.nextIndex = getRelativeCanvasWallpaperIndex(
    state.currentIndex,
    direction,
  );
  state.progress = 0;
  state.startProgress = 0;
  state.startedAt = timestamp;
  state.targetProgress = 1;
}

function previewCanvasWallpaperDrag(
  state: CanvasWallpaperTransitionState,
  deltaX: number,
  width: number,
) {
  const progress = clamp(Math.abs(deltaX) / Math.max(1, width), 0, 1);

  state.isDragging = true;
  state.progress = progress;
  state.startProgress = progress;
  state.targetProgress = progress;
  state.startedAt = 0;
  state.duration = 0;

  if (progress <= 0.001) {
    state.isTransitioning = false;
    state.nextIndex = state.currentIndex;
    return;
  }

  const direction: CanvasWallpaperDirection = deltaX < 0 ? 1 : -1;
  state.direction = direction;
  state.isTransitioning = true;
  state.nextIndex = getRelativeCanvasWallpaperIndex(
    state.currentIndex,
    direction,
  );
}

function finishCanvasWallpaperDrag(
  state: CanvasWallpaperTransitionState,
  shouldCommit: boolean,
  timestamp: number,
) {
  const startProgress = clamp(state.progress, 0, 1);
  const targetProgress =
    shouldCommit && state.nextIndex !== state.currentIndex ? 1 : 0;

  state.isDragging = false;

  if (startProgress <= 0.001 && targetProgress === 0) {
    state.isTransitioning = false;
    state.nextIndex = state.currentIndex;
    state.progress = 0;
    state.startProgress = 0;
    state.targetProgress = 0;
    return false;
  }

  state.duration = getCanvasWallpaperSettleDuration(
    startProgress,
    targetProgress,
  );
  state.isTransitioning = true;
  state.progress = startProgress;
  state.startProgress = startProgress;
  state.startedAt = timestamp;
  state.targetProgress = targetProgress;
  return true;
}

function resetCanvasWallpaperDrag(state: CanvasWallpaperDragState) {
  state.currentX = 0;
  state.isDragging = false;
  state.pointerId = null;
  state.startX = 0;
  state.startY = 0;
  state.width = 1;
}

function releaseWallpaperDragCapture(
  element: HTMLDivElement,
  pointerId: number,
) {
  if (element.hasPointerCapture(pointerId)) {
    element.releasePointerCapture(pointerId);
  }
}

function getCanvasWallpaperDragThreshold(width: number) {
  return clamp(width * 0.18, 48, 96);
}

function getCanvasWallpaperSettleDuration(from: number, to: number) {
  return clamp(
    canvasWallpaperTransitionDuration * Math.abs(to - from),
    140,
    360,
  );
}

function getRelativeCanvasWallpaperIndex(
  index: number,
  direction: CanvasWallpaperDirection,
) {
  return (
    (index + direction + canvasWallpaperSources.length) %
    canvasWallpaperSources.length
  );
}

function getCanvasWallpaperFrameKey(state: CanvasWallpaperTransitionState) {
  if (!state.isTransitioning) return `static:${state.currentIndex}`;
  return `slide:${state.currentIndex}:${state.nextIndex}:${state.direction}:${state.progress.toFixed(3)}`;
}

function stepCanvasWallpaperTransition(
  state: CanvasWallpaperTransitionState,
  timestamp: number,
) {
  if (!state.isTransitioning) return false;
  if (state.isDragging) return false;

  const elapsedProgress =
    state.duration <= 0
      ? 1
      : clamp((timestamp - state.startedAt) / state.duration, 0, 1);
  state.progress = clamp(
    lerp(
      state.startProgress,
      state.targetProgress,
      easeInOutCubic(elapsedProgress),
    ),
    0,
    1,
  );

  if (elapsedProgress >= 1) {
    if (state.targetProgress >= 1) {
      state.currentIndex = state.nextIndex;
    }
    state.nextIndex = state.currentIndex;
    state.progress = 0;
    state.startProgress = 0;
    state.targetProgress = 1;
    state.duration = canvasWallpaperTransitionDuration;
    state.isTransitioning = false;
    return false;
  }

  return true;
}

function loadCanvasToolbarSymbols() {
  if (typeof window === "undefined") {
    return Promise.resolve();
  }

  if (!canvasToolbarSymbolLoadPromise) {
    const entries = Object.entries(canvasToolbarSymbolSources) as Array<
      [CanvasToolbarSymbolId, string]
    >;
    canvasToolbarSymbolLoadPromise = Promise.all(
      entries.map(([id, src]) =>
        loadCanvasImage(src).then((image) => {
          canvasToolbarSymbolImages.set(id, image);
        }),
      ),
    ).then(() => undefined);
  }

  return canvasToolbarSymbolLoadPromise;
}

function getCanvasSymbolTintCanvas() {
  canvasSymbolTintCanvas ??= document.createElement("canvas");
  return canvasSymbolTintCanvas;
}

function loadCanvasImages(srcs: string[]) {
  return Promise.all(srcs.map((src) => loadCanvasImage(src)));
}

function loadCanvasImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.decoding = "async";
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`Failed to load image: ${src}`));
    image.src = src;
  });
}

function computeCanvasToolbarLayout(
  canvasWidth: number,
  canvasHeight: number,
  groups: CanvasToolbarItem[][],
): CanvasToolbarLayout {
  const toolbarWidth = 620;
  const toolbarHeight = 54;
  const maxX = canvasWidth - 12 - toolbarWidth;
  const x = maxX;
  const y = canvasHeight / 2 - toolbarHeight / 2;
  const buttonY = y + (toolbarHeight - 46) / 2;
  const hits: CanvasToolbarHit[] = [];
  let cursor = x + 14;

  groups.forEach((group, groupIndex) => {
    if (groupIndex > 0) {
      cursor += 18;
    }

    group.forEach((item, itemIndex) => {
      if (itemIndex > 0) cursor += 4;

      hits.push({
        ...item,
        rect: {
          height: 46,
          width: item.width,
          x: cursor,
          y: buttonY,
        },
      });
      cursor += item.width;
    });
  });

  return {
    height: toolbarHeight,
    items: hits,
    width: toolbarWidth,
    x,
    y,
  };
}

function drawToolbarContent(
  ctx: CanvasRenderingContext2D,
  layout: CanvasToolbarLayout,
  activeId: string | null,
  timestamp: number,
) {
  const iconColor = "rgba(255,255,255,0.84)";
  const mutedColor = "rgba(255,255,255,0.34)";

  drawCanvasSeparators(ctx, layout);

  layout.items.forEach((item) => {
    const { rect } = item;
    const cx = rect.x + rect.width / 2;
    const iconY =
      item.type === "target" ? rect.y + 17 : rect.y + rect.height / 2;
    const color = item.muted ? mutedColor : iconColor;

    if (activeId === item.id) {
      const hoverRect = getCanvasToolbarHoverRect(item);
      ctx.fillStyle = "rgba(255,255,255,0.14)";
      if (item.id === "close") {
        roundedRect(
          ctx,
          hoverRect.x,
          hoverRect.y,
          hoverRect.width,
          hoverRect.height,
          hoverRect.height / 2,
        );
      } else if (item.id === "settings") {
        roundedRectCorners(
          ctx,
          hoverRect.x,
          hoverRect.y,
          hoverRect.width,
          hoverRect.height,
          {
            bottomLeft: 12,
            bottomRight: hoverRect.height / 2,
            topLeft: 12,
            topRight: hoverRect.height / 2,
          },
        );
      } else {
        roundedRect(
          ctx,
          hoverRect.x,
          hoverRect.y,
          hoverRect.width,
          hoverRect.height,
          12,
        );
      }
      ctx.fill();
    }

    ctx.save();
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = canvasToolbarIconStrokeWidth;
    drawToolbarIcon(
      ctx,
      item.id,
      cx,
      iconY,
      item.type === "target"
        ? canvasToolbarTargetIconDrawSize
        : canvasToolbarIconDrawSize,
      timestamp,
      item.muted,
      rect,
    );
    ctx.restore();

    if (item.type === "target" && item.label) {
      drawToolbarTargetLabel(ctx, item.label, cx, rect.y + 38, rect.width);
    }
  });
}

function drawToolbarTargetLabel(
  ctx: CanvasRenderingContext2D,
  label: string,
  x: number,
  y: number,
  maxWidth: number,
) {
  let fontSize = 10;
  ctx.font = `600 ${fontSize}px system-ui, -apple-system, BlinkMacSystemFont, sans-serif`;

  while (fontSize > 8 && ctx.measureText(label).width > maxWidth - 3) {
    fontSize -= 0.5;
    ctx.font = `600 ${fontSize}px system-ui, -apple-system, BlinkMacSystemFont, sans-serif`;
  }

  ctx.fillStyle = "rgba(255,255,255,0.86)";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(label, x, y);
}

function getCanvasToolbarHoverRect(item: CanvasToolbarHit): Rect {
  if (
    item.type === "close" ||
    item.type === "icon" ||
    item.type === "utility"
  ) {
    const size = canvasToolbarIconHoverSize;
    return {
      height: size,
      width: size,
      x: item.rect.x + item.rect.width / 2 - size / 2,
      y: item.rect.y + item.rect.height / 2 - size / 2,
    };
  }

  if (item.type === "meter") {
    return {
      height: 38,
      width: item.rect.width,
      x: item.rect.x,
      y: item.rect.y + 4,
    };
  }

  return item.rect;
}

function drawCanvasSeparators(
  ctx: CanvasRenderingContext2D,
  layout: CanvasToolbarLayout,
) {
  const groups = [
    layout.items[1]?.rect.x,
    layout.items[5]?.rect.x,
    layout.items[9]?.rect.x,
  ].filter((value): value is number => typeof value === "number");

  ctx.strokeStyle = "rgba(255,255,255,0.18)";
  ctx.lineWidth = 1;
  groups.forEach((groupStart) => {
    const x = groupStart - 9;
    ctx.beginPath();
    ctx.moveTo(x, layout.y + 17);
    ctx.lineTo(x, layout.y + layout.height - 17);
    ctx.stroke();
  });
}

function drawToolbarTooltip(
  ctx: CanvasRenderingContext2D,
  tooltip: CanvasTooltipState,
) {
  const alpha = tooltip.opacity;
  const left = tooltip.bubbleCenterX - tooltip.width / 2;
  const centerY = tooltip.top + 17;

  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.font =
    "500 10.5px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillStyle = "rgba(255,255,255,0.9)";
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";

  let textX = left + 14;
  const shortcutWidth = getCanvasTooltipShortcutWidth(ctx, tooltip.shortcut);
  const maxTextWidth = Math.max(0, tooltip.width - shortcutWidth - 28);
  const measuredTextWidth = ctx.measureText(tooltip.text).width;
  ctx.fillText(tooltip.text, textX, centerY, maxTextWidth);
  textX += Math.min(measuredTextWidth, maxTextWidth) + 9;

  if (tooltip.shortcut) {
    tooltip.shortcut.forEach((key) => {
      const keyWidth = Math.max(18, ctx.measureText(key).width + 11);
      ctx.fillStyle = "rgba(255,255,255,0.13)";
      roundedRect(ctx, textX, centerY - 8.5, keyWidth, 17, 4);
      ctx.fill();

      ctx.fillStyle = "rgba(255,255,255,0.9)";
      ctx.font =
        "600 9.5px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(key, textX + keyWidth / 2, centerY);
      ctx.textAlign = "left";
      ctx.font =
        "500 10.5px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
      textX += keyWidth + 3;
    });
  }

  ctx.restore();
}

function getCanvasTooltipShortcutWidth(
  ctx: CanvasRenderingContext2D,
  shortcut?: string[],
) {
  if (!shortcut) return 0;

  const previousFont = ctx.font;
  ctx.font =
    "600 9.5px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
  const width =
    shortcut.reduce(
      (total, key) => total + Math.max(18, ctx.measureText(key).width + 11),
      0,
    ) +
    Math.max(0, shortcut.length - 1) * 3;
  ctx.font = previousFont;

  return width + 8;
}

function drawToolbarIcon(
  ctx: CanvasRenderingContext2D,
  id: string,
  cx: number,
  cy: number,
  size: number,
  timestamp: number,
  muted = false,
  rect?: Rect,
) {
  const s = size / 24;
  const color =
    typeof ctx.strokeStyle === "string"
      ? ctx.strokeStyle
      : "rgba(255,255,255,0.84)";

  switch (id) {
    case "close":
      if (drawCanvasToolbarSymbol(ctx, "close", cx, cy, 24 * s, color)) {
        return;
      }
      ctx.beginPath();
      ctx.moveTo(cx - 7 * s, cy - 7 * s);
      ctx.lineTo(cx + 7 * s, cy + 7 * s);
      ctx.moveTo(cx + 7 * s, cy - 7 * s);
      ctx.lineTo(cx - 7 * s, cy + 7 * s);
      ctx.stroke();
      return;
    case "display":
      if (drawCanvasToolbarSymbol(ctx, "display", cx, cy, 31 * s, color)) {
        return;
      }
      roundedRect(ctx, cx - 10 * s, cy - 8 * s, 20 * s, 14 * s, 2 * s);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(cx, cy + 6 * s);
      ctx.lineTo(cx, cy + 10 * s);
      ctx.moveTo(cx - 6 * s, cy + 10 * s);
      ctx.lineTo(cx + 6 * s, cy + 10 * s);
      ctx.stroke();
      return;
    case "window":
      if (drawCanvasToolbarSymbol(ctx, "window", cx, cy, 31 * s, color)) {
        return;
      }
      roundedRect(ctx, cx - 10 * s, cy - 8 * s, 20 * s, 16 * s, 3 * s);
      ctx.stroke();
      ctx.fillStyle = ctx.strokeStyle;
      for (let i = 0; i < 3; i += 1) {
        ctx.beginPath();
        ctx.arc(cx - 6 * s + i * 4 * s, cy - 4.5 * s, 1.15 * s, 0, Math.PI * 2);
        ctx.fill();
      }
      return;
    case "area":
      if (drawCanvasToolbarSymbol(ctx, "area", cx, cy, 31 * s, color)) {
        return;
      }
      drawCornerBrackets(ctx, cx, cy, s);
      return;
    case "iphone":
      if (drawCanvasToolbarSymbol(ctx, "iphone", cx, cy, 31 * s, color)) {
        return;
      }
      roundedRect(ctx, cx - 6 * s, cy - 10 * s, 12 * s, 20 * s, 2.5 * s);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(cx, cy + 7 * s, 0.9 * s, 0, Math.PI * 2);
      ctx.fill();
      return;
    case "camera":
      if (
        drawCanvasToolbarSymbol(
          ctx,
          "camera",
          cx,
          cy,
          29 * s,
          color,
          muted ? 0.55 : 1,
        )
      ) {
        return;
      }
      ctx.globalAlpha *= muted ? 0.55 : 1;
      ctx.beginPath();
      ctx.moveTo(cx - 10 * s, cy - 6 * s);
      ctx.lineTo(cx + 1 * s, cy - 6 * s);
      ctx.quadraticCurveTo(cx + 5 * s, cy - 6 * s, cx + 5 * s, cy - 2 * s);
      ctx.lineTo(cx + 5 * s, cy + 2 * s);
      ctx.quadraticCurveTo(cx + 5 * s, cy + 6 * s, cx + 1 * s, cy + 6 * s);
      ctx.lineTo(cx - 10 * s, cy + 6 * s);
      ctx.closePath();
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(cx + 5 * s, cy - 2 * s);
      ctx.lineTo(cx + 11 * s, cy - 7 * s);
      ctx.lineTo(cx + 11 * s, cy + 7 * s);
      ctx.lineTo(cx + 5 * s, cy + 2 * s);
      ctx.stroke();
      drawSlash(ctx, cx, cy, s);
      return;
    case "microphone":
      if (
        drawCanvasToolbarSymbol(
          ctx,
          "microphone",
          cx,
          cy,
          29 * s,
          color,
          muted ? 0.55 : 1,
        )
      ) {
        return;
      }
      ctx.globalAlpha *= muted ? 0.55 : 1;
      roundedRect(ctx, cx - 4 * s, cy - 10 * s, 8 * s, 14 * s, 4 * s);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(cx - 9 * s, cy - 1 * s);
      ctx.quadraticCurveTo(cx - 8 * s, cy + 9 * s, cx, cy + 9 * s);
      ctx.quadraticCurveTo(cx + 8 * s, cy + 9 * s, cx + 9 * s, cy - 1 * s);
      ctx.moveTo(cx, cy + 9 * s);
      ctx.lineTo(cx, cy + 13 * s);
      ctx.stroke();
      drawSlash(ctx, cx, cy, s);
      return;
    case "system-audio":
      const speakerX = rect ? rect.x + 18 * s : cx - 31 * s;
      const meterX = rect ? rect.x + 36 * s : cx - 9 * s;

      if (
        !drawCanvasToolbarSymbol(
          ctx,
          "system-audio",
          speakerX,
          cy,
          29 * s,
          color,
        )
      ) {
        ctx.beginPath();
        ctx.moveTo(speakerX - 8 * s, cy - 5 * s);
        ctx.lineTo(speakerX - 3 * s, cy - 5 * s);
        ctx.lineTo(speakerX + 5 * s, cy - 11 * s);
        ctx.lineTo(speakerX + 5 * s, cy + 11 * s);
        ctx.lineTo(speakerX - 3 * s, cy + 5 * s);
        ctx.lineTo(speakerX - 8 * s, cy + 5 * s);
        ctx.closePath();
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(speakerX + 9 * s, cy, 7 * s, -0.75, 0.75);
        ctx.arc(speakerX + 9 * s, cy, 12 * s, -0.65, 0.65);
        ctx.stroke();
      }
      drawAudioMeterDots(ctx, meterX, cy, s, timestamp);
      return;
    case "keyboard":
      if (drawCanvasToolbarSymbol(ctx, "keyboard", cx, cy, 29 * s, color)) {
        return;
      }
      roundedRect(ctx, cx - 11 * s, cy - 7 * s, 22 * s, 14 * s, 3 * s);
      ctx.stroke();
      ctx.fillStyle = ctx.strokeStyle;
      for (let row = 0; row < 3; row += 1) {
        for (let col = 0; col < 6; col += 1) {
          const keyX = cx - 7.5 * s + col * 3 * s;
          const keyY = cy - 3.8 * s + row * 3.2 * s;
          ctx.beginPath();
          ctx.arc(keyX, keyY, 0.45 * s, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      return;
    case "workspace":
      if (drawCanvasToolbarSymbol(ctx, "workspace", cx, cy, 29 * s, color)) {
        return;
      }
      ctx.beginPath();
      ctx.moveTo(cx - 11 * s, cy - 7 * s);
      ctx.lineTo(cx - 2 * s, cy - 7 * s);
      ctx.lineTo(cx + 1 * s, cy - 4 * s);
      ctx.lineTo(cx + 11 * s, cy - 4 * s);
      ctx.lineTo(cx + 11 * s, cy + 8 * s);
      ctx.lineTo(cx - 11 * s, cy + 8 * s);
      ctx.closePath();
      ctx.stroke();
      return;
    case "settings":
      if (drawCanvasToolbarSymbol(ctx, "settings", cx, cy, 29 * s, color)) {
        return;
      }
      drawGear(ctx, cx, cy, s);
      return;
    default:
      return;
  }
}

function drawCanvasToolbarSymbol(
  ctx: CanvasRenderingContext2D,
  id: CanvasToolbarSymbolId,
  cx: number,
  cy: number,
  size: number,
  color: string,
  alpha = 1,
) {
  const image = canvasToolbarSymbolImages.get(id);
  if (!image?.complete || image.naturalWidth <= 0 || image.naturalHeight <= 0) {
    return false;
  }

  const ratio = image.naturalWidth / image.naturalHeight;
  const width = ratio >= 1 ? size : size * ratio;
  const height = ratio >= 1 ? size / ratio : size;
  const x = cx - width / 2;
  const y = cy - height / 2;
  const canvasScale =
    typeof ctx.getTransform === "function" ? ctx.getTransform().a : 1;
  const pixelRatio = Math.max(2, Math.min(canvasScale || 1, 3));
  const scratch = getCanvasSymbolTintCanvas();
  const scratchWidth = Math.max(1, Math.ceil(width * pixelRatio));
  const scratchHeight = Math.max(1, Math.ceil(height * pixelRatio));
  const scratchCtx = scratch.getContext("2d");
  if (!scratchCtx) return false;

  scratch.width = scratchWidth;
  scratch.height = scratchHeight;
  scratchCtx.imageSmoothingEnabled = true;
  scratchCtx.imageSmoothingQuality = "high";
  scratchCtx.clearRect(0, 0, scratchWidth, scratchHeight);
  scratchCtx.drawImage(image, 0, 0, scratchWidth, scratchHeight);
  scratchCtx.globalCompositeOperation = "source-in";
  scratchCtx.fillStyle = color;
  scratchCtx.fillRect(0, 0, scratchWidth, scratchHeight);
  scratchCtx.globalCompositeOperation = "source-over";

  ctx.save();
  ctx.globalAlpha *= alpha;
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(scratch, x, y, width, height);
  ctx.restore();

  return true;
}

function drawCornerBrackets(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  s: number,
) {
  const points = [
    [-10, -4, -10, -8, -6, -8],
    [6, -8, 10, -8, 10, -4],
    [10, 4, 10, 8, 6, 8],
    [-6, 8, -10, 8, -10, 4],
  ];

  points.forEach(([x1, y1, x2, y2, x3, y3]) => {
    ctx.beginPath();
    ctx.moveTo(cx + x1 * s, cy + y1 * s);
    ctx.lineTo(cx + x2 * s, cy + y2 * s);
    ctx.lineTo(cx + x3 * s, cy + y3 * s);
    ctx.stroke();
  });
}

function drawSlash(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  s: number,
) {
  ctx.beginPath();
  ctx.moveTo(cx - 11 * s, cy - 11 * s);
  ctx.lineTo(cx + 11 * s, cy + 11 * s);
  ctx.stroke();
}

function drawAudioMeterDots(
  ctx: CanvasRenderingContext2D,
  x: number,
  cy: number,
  s: number,
  timestamp: number,
) {
  const time = timestamp * 0.0032;

  for (let row = 0; row < 4; row += 1) {
    for (let col = 0; col < 8; col += 1) {
      const wave =
        Math.sin(time + col * 0.84) * 0.58 +
        Math.sin(time * 1.57 + col * 0.43) * 0.28 +
        Math.sin(time * 0.62 + col * 1.38) * 0.14;
      const level = clamp(Math.round((wave + 1) * 1.75), 1, 4);
      const isLit = row >= 4 - level;
      const shimmer = 0.06 * Math.sin(time * 3 + col * 0.8 + row * 0.4);
      const alpha = isLit ? 0.74 + shimmer : 0.17;
      ctx.fillStyle = `rgba(255,255,255,${alpha.toFixed(3)})`;
      ctx.beginPath();
      ctx.arc(
        x + col * 4.5 * s,
        cy - 7 * s + row * 4.5 * s,
        1.35 * s,
        0,
        Math.PI * 2,
      );
      ctx.fill();
    }
  }
}

function drawGear(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  s: number,
) {
  for (let i = 0; i < 8; i += 1) {
    const angle = (Math.PI * 2 * i) / 8;
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(angle) * 8 * s, cy + Math.sin(angle) * 8 * s);
    ctx.lineTo(cx + Math.cos(angle) * 11 * s, cy + Math.sin(angle) * 11 * s);
    ctx.stroke();
  }
  ctx.beginPath();
  ctx.arc(cx, cy, 7 * s, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(cx, cy, 2.5 * s, 0, Math.PI * 2);
  ctx.stroke();
}

function getCanvasTooltipTarget(
  item: CanvasToolbarHit,
  canvasWidth: number,
): CanvasTooltipState {
  const rawCenterX = item.rect.x + item.rect.width / 2;
  const width = Math.min(
    estimateToolbarTooltipWidth(item.text, item.shortcut),
    Math.max(120, canvasWidth - 28),
  );

  return {
    bubbleCenterX: clamp(
      rawCenterX,
      14 + width / 2,
      canvasWidth - 14 - width / 2,
    ),
    opacity: 1,
    rawCenterX,
    shortcut: item.shortcut,
    text: item.text,
    top: Math.max(28, item.rect.y - 44),
    width,
  };
}

function stepCanvasTooltip(
  current: CanvasTooltipState,
  target: CanvasTooltipState | null,
) {
  if (!target) {
    current.opacity += (0 - current.opacity) * 0.18;
    return current.opacity > 0.01;
  }

  const previous = {
    bubbleCenterX: current.bubbleCenterX,
    opacity: current.opacity,
    rawCenterX: current.rawCenterX,
    top: current.top,
    width: current.width,
  };

  current.bubbleCenterX +=
    (target.bubbleCenterX - current.bubbleCenterX) * 0.22;
  current.rawCenterX += (target.rawCenterX - current.rawCenterX) * 0.22;
  current.top += (target.top - current.top) * 0.22;
  current.width += (target.width - current.width) * 0.22;
  current.opacity += (target.opacity - current.opacity) * 0.28;
  current.shortcut = target.shortcut;
  current.text = target.text;

  return (
    Math.abs(current.bubbleCenterX - previous.bubbleCenterX) > 0.1 ||
    Math.abs(current.rawCenterX - previous.rawCenterX) > 0.1 ||
    Math.abs(current.top - previous.top) > 0.1 ||
    Math.abs(current.width - previous.width) > 0.1 ||
    Math.abs(current.opacity - previous.opacity) > 0.01
  );
}

function stepToolbarModeTransition(
  current: CanvasToolbarModeTransitionState,
  mode: ToolbarGlassMode,
  timestamp: number,
) {
  const target = mode === "regular" ? 1 : 0;
  const diff = target - current.progress;

  if (Math.abs(diff) <= 0.002) {
    current.progress = target;
    current.previousTimestamp = timestamp;
    return false;
  }

  const delta = current.previousTimestamp
    ? clamp(timestamp - current.previousTimestamp, 0, 50)
    : 16;
  current.previousTimestamp = timestamp;
  const blend = 1 - Math.exp((-delta * 4) / canvasToolbarModeTransitionMs);
  current.progress = clamp(current.progress + diff * blend, 0, 1);

  return Math.abs(target - current.progress) > 0.002;
}

function estimateToolbarTooltipWidth(text: string, shortcut?: string[]) {
  const ctx = getCanvasTooltipMeasureContext();
  ctx.font =
    "500 10.5px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
  const textWidth = ctx.measureText(text).width;
  const shortcutWidth = shortcut
    ? shortcut.reduce((width, key) => {
        ctx.font =
          "600 9.5px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
        return width + Math.max(18, ctx.measureText(key).width + 11);
      }, 0) +
      Math.max(0, shortcut.length - 1) * 3 +
      8
    : 0;
  return Math.ceil(textWidth + shortcutWidth + 28);
}

function getCanvasTooltipMeasureContext() {
  canvasTooltipMeasureCanvas ??= document.createElement("canvas");
  const ctx = canvasTooltipMeasureCanvas.getContext("2d");
  if (!ctx) {
    throw new Error("Unable to create tooltip measure canvas context");
  }

  return ctx;
}

function clamp(value: number, min: number, max: number) {
  if (min > max) return (min + max) / 2;
  return Math.min(Math.max(value, min), max);
}

function lerp(from: number, to: number, amount: number) {
  return from + (to - from) * amount;
}

function easeInOutCubic(value: number) {
  return value < 0.5
    ? 4 * value * value * value
    : 1 - Math.pow(-2 * value + 2, 3) / 2;
}

function lerpColor(
  from: { a: number; b: number; g: number; r: number },
  to: { a: number; b: number; g: number; r: number },
  amount: number,
) {
  return {
    a: lerp(from.a, to.a, amount),
    b: lerp(from.b, to.b, amount),
    g: lerp(from.g, to.g, amount),
    r: lerp(from.r, to.r, amount),
  };
}

function roundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + width - r, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + r);
  ctx.lineTo(x + width, y + height - r);
  ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
  ctx.lineTo(x + r, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function roundedRectCorners(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: {
    bottomLeft: number;
    bottomRight: number;
    topLeft: number;
    topRight: number;
  },
) {
  const tl = Math.min(radius.topLeft, width / 2, height / 2);
  const tr = Math.min(radius.topRight, width / 2, height / 2);
  const br = Math.min(radius.bottomRight, width / 2, height / 2);
  const bl = Math.min(radius.bottomLeft, width / 2, height / 2);

  ctx.beginPath();
  ctx.moveTo(x + tl, y);
  ctx.lineTo(x + width - tr, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + tr);
  ctx.lineTo(x + width, y + height - br);
  ctx.quadraticCurveTo(x + width, y + height, x + width - br, y + height);
  ctx.lineTo(x + bl, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - bl);
  ctx.lineTo(x, y + tl);
  ctx.quadraticCurveTo(x, y, x + tl, y);
  ctx.closePath();
}

function pointInRect(x: number, y: number, rect: Rect) {
  return (
    x >= rect.x &&
    x <= rect.x + rect.width &&
    y >= rect.y &&
    y <= rect.y + rect.height
  );
}

type ShortcutPressedState = {
  cmd: boolean;
  digit3: boolean;
  shift: boolean;
};

type ShortcutKeyColorScheme = {
  innerBackground: string;
  innerBackgroundPressed: string;
  outerBackground: string;
  textColor: string;
};

const shortcutPressedInitialState: ShortcutPressedState = {
  cmd: false,
  digit3: false,
  shift: false,
};

const shortcutKeyAriaLabels: Record<keyof ShortcutPressedState, string> = {
  cmd: "Command key",
  digit3: "3 key",
  shift: "Shift key",
};

const shortcutKeyColorSchemes: ShortcutKeyColorScheme[] = [
  {
    innerBackground: "rgba(255, 255, 255, 0.09)",
    innerBackgroundPressed: "rgba(255, 255, 255, 0.16)",
    outerBackground: "rgba(255, 255, 255, 0.045)",
    textColor: "rgba(255, 255, 255, 0.92)",
  },
  {
    innerBackground: "rgba(245, 244, 235, 0.88)",
    innerBackgroundPressed: "rgba(245, 244, 235, 0.98)",
    outerBackground: "rgba(204, 197, 174, 0.48)",
    textColor: "rgba(19, 18, 15, 0.9)",
  },
  {
    innerBackground: "rgba(248, 113, 113, 0.34)",
    innerBackgroundPressed: "rgba(248, 113, 113, 0.5)",
    outerBackground: "rgba(127, 29, 29, 0.5)",
    textColor: "rgba(255, 241, 242, 0.94)",
  },
  {
    innerBackground: "rgba(96, 165, 250, 0.34)",
    innerBackgroundPressed: "rgba(96, 165, 250, 0.5)",
    outerBackground: "rgba(30, 64, 175, 0.5)",
    textColor: "rgba(239, 246, 255, 0.94)",
  },
];

function isDigitThreeKey(event: KeyboardEvent) {
  return (
    event.key === "3" ||
    event.code === "Digit3" ||
    event.code === "Numpad3"
  );
}

function ShortcutsThumb() {
  const [pressedKeys, setPressedKeys] = useState<ShortcutPressedState>(
    shortcutPressedInitialState
  );
  const [pointerPressedKey, setPointerPressedKey] = useState<
    keyof ShortcutPressedState | null
  >(null);
  const [colorSchemeIndex, setColorSchemeIndex] = useState(0);
  const colorScheme = shortcutKeyColorSchemes[colorSchemeIndex];

  useEffect(() => {
    const resetPressedKeys = () => {
      setPressedKeys(shortcutPressedInitialState);
      setPointerPressedKey(null);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      setPressedKeys((current) => ({
        cmd: current.cmd || event.key === "Meta" || event.metaKey,
        digit3: current.digit3 || isDigitThreeKey(event),
        shift: current.shift || event.key === "Shift" || event.shiftKey,
      }));
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      setPressedKeys((current) => ({
        cmd: event.key === "Meta" ? false : event.metaKey,
        digit3: isDigitThreeKey(event) ? false : current.digit3,
        shift: event.key === "Shift" ? false : event.shiftKey,
      }));
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        resetPressedKeys();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("blur", resetPressedKeys);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("blur", resetPressedKeys);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return (
    <div className="relative aspect-[4/3] overflow-hidden rounded-[8px] border border-white/10 bg-[linear-gradient(140deg,#030303_0%,#101010_48%,#050505_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.075),transparent_38%,rgba(255,255,255,0.03))]" />
      <div className="absolute inset-0 bg-[linear-gradient(115deg,transparent_12%,rgba(255,255,255,0.055)_46%,transparent_62%)] opacity-45" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_42%,rgba(0,0,0,0.42)_100%)]" />

      <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-2">
        <KeyCap
          colorScheme={colorScheme}
          onPressChange={setPointerPressedKey}
          pressed={pressedKeys.cmd || pointerPressedKey === "cmd"}
          shortcutKey="cmd"
        >
          <Command className="h-[18px] w-[18px]" />
        </KeyCap>
        <KeyCap
          align="left"
          colorScheme={colorScheme}
          onPressChange={setPointerPressedKey}
          pressed={pressedKeys.shift || pointerPressedKey === "shift"}
          shortcutKey="shift"
          wide
        >
          <span className="text-[18px] leading-none">⇧</span>
          Shift
        </KeyCap>
        <KeyCap
          colorScheme={colorScheme}
          onPressChange={setPointerPressedKey}
          pressed={pressedKeys.digit3 || pointerPressedKey === "digit3"}
          shortcutKey="digit3"
        >
          <span className="text-[16px] leading-none">3</span>
        </KeyCap>
      </div>

      <button
        aria-label="切换按键配色"
        className="absolute bottom-2 left-2 z-20 flex h-7 w-7 items-center justify-center rounded-[8px] bg-transparent text-white/60 transition-colors hover:bg-white/14 hover:text-white"
        onClick={() => {
          setColorSchemeIndex(
            (current) => (current + 1) % shortcutKeyColorSchemes.length
          );
        }}
        type="button"
      >
        <Palette aria-hidden="true" className="h-[15px] w-[15px]" strokeWidth={2.2} />
      </button>
    </div>
  );
}

function KeyCap({
  align = "center",
  children,
  colorScheme,
  onPressChange,
  pressed = false,
  shortcutKey,
  wide = false,
}: {
  align?: "center" | "left";
  children: ReactNode;
  colorScheme: ShortcutKeyColorScheme;
  onPressChange?: (key: keyof ShortcutPressedState | null) => void;
  pressed?: boolean;
  shortcutKey?: keyof ShortcutPressedState;
  wide?: boolean;
}) {
  const handlePointerDown = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (!shortcutKey) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    onPressChange?.(shortcutKey);
  };

  const handlePointerEnd = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    onPressChange?.(null);
  };

  return (
    <button
      aria-label={shortcutKey ? shortcutKeyAriaLabels[shortcutKey] : undefined}
      aria-pressed={pressed}
      data-shortcut-key={shortcutKey}
      onPointerCancel={handlePointerEnd}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerEnd}
      type="button"
      className={`box-border flex shrink-0 cursor-pointer select-none appearance-none rounded-[8px] border border-black/35 transition-[height,padding,box-shadow,background-color] duration-100 ease-out focus:outline-none ${
        pressed
          ? "h-11 p-0.5 shadow-[0_7px_12px_rgba(0,0,0,0.56)]"
          : "h-12 px-0.5 pb-1.5 pt-0.5 shadow-[0_16px_36px_rgba(0,0,0,0.36)]"
      } ${wide ? "w-[5.25rem]" : "w-12"}`}
      style={{
        backgroundColor: colorScheme.outerBackground,
      }}
    >
      <div
        className={`flex h-full w-full items-center ${
          align === "left" ? "justify-start pl-3.5 pr-2" : "justify-center"
        } gap-1 rounded-[6px] text-xs font-semibold tracking-normal backdrop-blur-md transition-[background-color,box-shadow] duration-100 ${
          pressed
            ? "shadow-[inset_0_1px_0_rgba(255,255,255,0.18),inset_0_-2px_8px_rgba(0,0,0,0.22)]"
            : "shadow-[inset_0_1px_0_rgba(255,255,255,0.2),inset_0_-8px_18px_rgba(0,0,0,0.32)]"
      }`}
        style={{
          backgroundColor: pressed
            ? colorScheme.innerBackgroundPressed
            : colorScheme.innerBackground,
          color: colorScheme.textColor,
        }}
      >
        {children}
      </div>
    </button>
  );
}

function BeautyThumb({ copy }: { copy: FeatureCardsCopy["beautyThumb"] }) {
  const comparisonWindowRef = useRef<HTMLDivElement>(null);
  const activeComparisonTouchRef = useRef<number | null>(null);
  const beforeVideoRef = useRef<HTMLVideoElement>(null);
  const afterVideoRef = useRef<HTMLVideoElement>(null);
  const canLoadMediaRef = useRef(false);
  const dragFrameRef = useRef(0);
  const dragPointRef = useRef<{ clientX: number; clientY: number } | null>(
    null,
  );
  const dragRectRef = useRef<DOMRect | null>(null);
  const isVisibleRef = useRef(false);
  const shouldPlayRef = useRef(true);
  const [handleY, setHandleY] = useState(beautyHandleRestY);
  const [canLoadMedia, setCanLoadMedia] = useState(false);
  const [floatingShape, setFloatingShape] =
    useState<BeautyFloatingShape>("wide");
  const [isFloating, setIsFloating] = useState(false);
  const [isHandleDragging, setIsHandleDragging] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [split, setSplit] = useState(50);
  const windowTarget = {
    ...(isFloating
      ? beautyFloatingWindowTargets[floatingShape]
      : beautyFullWindowTarget),
  };
  const mediaFrame = beautyMediaFrames[isFloating ? floatingShape : "full"];

  const applyComparisonDragPosition = (
    clientX: number,
    clientY: number,
    rect = dragRectRef.current,
  ) => {
    if (!rect) return;

    setSplit(clamp(((clientX - rect.left) / rect.width) * 100, 0, 100));
    setHandleY(clamp(((clientY - rect.top) / rect.height) * 100, 14, 86));
  };

  const flushComparisonDragPosition = () => {
    dragFrameRef.current = 0;
    const point = dragPointRef.current;
    dragPointRef.current = null;
    if (!point) return;

    applyComparisonDragPosition(point.clientX, point.clientY);
  };

  const scheduleComparisonDragPosition = (
    clientX: number,
    clientY: number,
  ) => {
    dragPointRef.current = { clientX, clientY };
    if (!dragFrameRef.current) {
      dragFrameRef.current = requestAnimationFrame(
        flushComparisonDragPosition,
      );
    }
  };

  const cancelScheduledComparisonDrag = () => {
    if (dragFrameRef.current) {
      cancelAnimationFrame(dragFrameRef.current);
      dragFrameRef.current = 0;
    }
    dragPointRef.current = null;
  };

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRectRef.current = event.currentTarget.getBoundingClientRect();
    cancelScheduledComparisonDrag();
    setIsHandleDragging(true);
    applyComparisonDragPosition(
      event.clientX,
      event.clientY,
      dragRectRef.current,
    );
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!event.currentTarget.hasPointerCapture(event.pointerId)) return;
    scheduleComparisonDragPosition(event.clientX, event.clientY);
  };

  const handlePointerEnd = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      applyComparisonDragPosition(
        event.clientX,
        event.clientY,
        dragRectRef.current,
      );
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    cancelScheduledComparisonDrag();
    dragRectRef.current = null;
    setIsHandleDragging(false);
    setHandleY(beautyHandleRestY);
  };

  const getActiveComparisonTouch = (touches: TouchList) => {
    const activeTouchId = activeComparisonTouchRef.current;
    if (activeTouchId === null) return touches.item(0);

    for (let index = 0; index < touches.length; index += 1) {
      const touch = touches.item(index);
      if (touch?.identifier === activeTouchId) return touch;
    }

    return null;
  };

  const changedTouchesIncludeActiveComparisonTouch = (touches: TouchList) => {
    const activeTouchId = activeComparisonTouchRef.current;
    if (activeTouchId === null) return touches.length > 0;

    for (let index = 0; index < touches.length; index += 1) {
      if (touches.item(index)?.identifier === activeTouchId) return true;
    }

    return false;
  };

  const handleComparisonTouchStart = (event: TouchEvent) => {
    const touch = event.touches.item(0);
    const target = comparisonWindowRef.current;
    if (!touch || !target) return;

    activeComparisonTouchRef.current = touch.identifier;
    dragRectRef.current = target.getBoundingClientRect();
    cancelScheduledComparisonDrag();
    setIsHandleDragging(true);
    applyComparisonDragPosition(
      touch.clientX,
      touch.clientY,
      dragRectRef.current,
    );
    event.preventDefault();
  };

  const handleComparisonTouchMove = (event: TouchEvent) => {
    const touch = getActiveComparisonTouch(event.touches);
    if (!touch || activeComparisonTouchRef.current === null) return;

    scheduleComparisonDragPosition(touch.clientX, touch.clientY);
    event.preventDefault();
  };

  const handleComparisonTouchEnd = (event: TouchEvent) => {
    if (!changedTouchesIncludeActiveComparisonTouch(event.changedTouches)) return;

    const touch = getActiveComparisonTouch(event.changedTouches);
    if (touch) {
      applyComparisonDragPosition(
        touch.clientX,
        touch.clientY,
        dragRectRef.current,
      );
    }

    activeComparisonTouchRef.current = null;
    cancelScheduledComparisonDrag();
    dragRectRef.current = null;
    setIsHandleDragging(false);
    setHandleY(beautyHandleRestY);
    event.preventDefault();
  };

  useEffect(() => {
    const comparisonWindow = comparisonWindowRef.current;
    if (!comparisonWindow) return;

    const options = { passive: false };
    comparisonWindow.addEventListener("touchstart", handleComparisonTouchStart, options);
    comparisonWindow.addEventListener("touchmove", handleComparisonTouchMove, options);
    comparisonWindow.addEventListener("touchend", handleComparisonTouchEnd, options);
    comparisonWindow.addEventListener("touchcancel", handleComparisonTouchEnd, options);

    return () => {
      comparisonWindow.removeEventListener("touchstart", handleComparisonTouchStart);
      comparisonWindow.removeEventListener("touchmove", handleComparisonTouchMove);
      comparisonWindow.removeEventListener("touchend", handleComparisonTouchEnd);
      comparisonWindow.removeEventListener("touchcancel", handleComparisonTouchEnd);
    };
  });

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (
      !["ArrowLeft", "ArrowDown", "ArrowRight", "ArrowUp", "Home", "End"].includes(
        event.key,
      )
    ) {
      return;
    }

    event.preventDefault();

    if (event.key === "Home") {
      setSplit(0);
    } else if (event.key === "End") {
      setSplit(100);
    } else {
      const direction =
        event.key === "ArrowLeft" || event.key === "ArrowDown" ? -1 : 1;
      setSplit((current) => clamp(current + direction * 5, 0, 100));
    }
  };

  const setComparisonPlayback = (shouldPlay: boolean) => {
    shouldPlayRef.current = shouldPlay;
    setIsPlaying(shouldPlay);

    const beforeVideo = beforeVideoRef.current;
    const afterVideo = afterVideoRef.current;
    if (!beforeVideo || !afterVideo) return;

    if (
      !shouldPlay ||
      document.hidden ||
      !isVisibleRef.current ||
      !canLoadMediaRef.current
    ) {
      beforeVideo.pause();
      afterVideo.pause();
      return;
    }

    if (
      afterVideo.readyState >= HTMLMediaElement.HAVE_METADATA &&
      Math.abs(beforeVideo.currentTime - afterVideo.currentTime) > 0.08
    ) {
      afterVideo.currentTime = beforeVideo.currentTime;
    }

    void beforeVideo.play();
    void afterVideo.play();
  };

  useEffect(() => {
    const beforeVideo = beforeVideoRef.current;
    const afterVideo = afterVideoRef.current;
    if (!beforeVideo || !afterVideo) return;

    let syncInterval = 0;
    let visibilityObserver: IntersectionObserver | null = null;

    const syncAfterVideo = () => {
      if (afterVideo.readyState < HTMLMediaElement.HAVE_METADATA) return;
      if (Math.abs(beforeVideo.currentTime - afterVideo.currentTime) > 0.08) {
        afterVideo.currentTime = beforeVideo.currentTime;
      }
    };

    const applyDesiredPlayback = () => {
      syncAfterVideo();

      if (
        !shouldPlayRef.current ||
        document.hidden ||
        !isVisibleRef.current ||
        !canLoadMediaRef.current
      ) {
        beforeVideo.pause();
        afterVideo.pause();
        return;
      }

      void beforeVideo.play();
      void afterVideo.play();
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        beforeVideo.pause();
        afterVideo.pause();
      } else {
        applyDesiredPlayback();
      }
    };

    beforeVideo.addEventListener("loadeddata", applyDesiredPlayback);
    afterVideo.addEventListener("loadeddata", applyDesiredPlayback);
    beforeVideo.addEventListener("seeked", syncAfterVideo);
    beforeVideo.addEventListener("timeupdate", syncAfterVideo);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    const visibilityTarget = comparisonWindowRef.current;
    if (visibilityTarget) {
      visibilityObserver = new IntersectionObserver(
        ([entry]) => {
          isVisibleRef.current = entry.isIntersecting;
          if (entry.isIntersecting && !canLoadMediaRef.current) {
            canLoadMediaRef.current = true;
            setCanLoadMedia(true);
          }
          applyDesiredPlayback();
        },
        { threshold: 0.15 },
      );
      visibilityObserver.observe(visibilityTarget);
    } else {
      isVisibleRef.current = true;
      canLoadMediaRef.current = true;
      setCanLoadMedia(true);
    }
    applyDesiredPlayback();
    syncInterval = window.setInterval(syncAfterVideo, 350);

    return () => {
      window.clearInterval(syncInterval);
      visibilityObserver?.disconnect();
      beforeVideo.removeEventListener("loadeddata", applyDesiredPlayback);
      afterVideo.removeEventListener("loadeddata", applyDesiredPlayback);
      beforeVideo.removeEventListener("seeked", syncAfterVideo);
      beforeVideo.removeEventListener("timeupdate", syncAfterVideo);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    return () => {
      cancelScheduledComparisonDrag();
    };
  }, []);

  return (
    <div
      className="relative aspect-[4/3] overflow-hidden rounded-[8px] border border-white/10 bg-black shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: canLoadMedia
            ? `url(${beautyThumbBackgroundSource})`
            : undefined,
          opacity: isFloating ? 1 : 0,
          transition: "opacity 350ms ease-out",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-black/24"
        style={{
          opacity: isFloating ? 1 : 0,
          transition: "opacity 350ms ease-out",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_48%,rgba(0,0,0,0.34)_100%)]"
        style={{
          opacity: isFloating ? 1 : 0,
          transition: "opacity 350ms ease-out",
        }}
      />

      <div
        ref={comparisonWindowRef}
        aria-label="Compare camera beauty before and after"
        aria-valuemax={100}
        aria-valuemin={0}
        aria-valuenow={Math.round(split)}
        className="absolute z-10 cursor-ew-resize touch-none overflow-hidden border border-white/10 bg-black shadow-[0_18px_48px_rgba(0,0,0,0.36)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/70"
        data-screen-cam-drag-surface
        onKeyDown={handleKeyDown}
        onPointerCancel={handlePointerEnd}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerEnd}
        role="slider"
        style={{
          ...windowTarget,
          transition:
            "border-radius 550ms cubic-bezier(0.16,1,0.3,1), height 550ms cubic-bezier(0.16,1,0.3,1), left 550ms cubic-bezier(0.16,1,0.3,1), top 550ms cubic-bezier(0.16,1,0.3,1), width 550ms cubic-bezier(0.16,1,0.3,1)",
          willChange: "border-radius, height, left, top, width",
        }}
        tabIndex={0}
      >
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ clipPath: `inset(0 ${100 - split}% 0 0)` }}
        >
          <BeautyComparisonVideo
            canLoad={canLoadMedia}
            frame={mediaFrame}
            side="before"
            videoRef={beforeVideoRef}
          />
          <BeautyComparisonLabel side="left">
            {copy.beforeLabel}
          </BeautyComparisonLabel>
        </div>

        <div
          className="absolute inset-0 overflow-hidden"
          style={{ clipPath: `inset(0 0 0 ${split}%)` }}
        >
          <BeautyComparisonVideo
            canLoad={canLoadMedia}
            frame={mediaFrame}
            side="after"
            videoRef={afterVideoRef}
          />
          <BeautyComparisonLabel side="right">
            {copy.afterLabel}
          </BeautyComparisonLabel>
        </div>

        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),transparent_34%,rgba(0,0,0,0.18))]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_54%,rgba(0,0,0,0.28)_100%)]" />

        <div
          aria-hidden="true"
          className={`pointer-events-none absolute bottom-0 top-0 z-30 w-px bg-white/80 shadow-[0_0_18px_rgba(255,255,255,0.45)] ${
            isHandleDragging
              ? "transition-none"
              : "transition-[left] duration-150 ease-out"
          }`}
          style={{ left: `${split}%` }}
        >
          <div
            className={`absolute left-1/2 flex h-10 w-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/35 bg-black/42 text-white shadow-[0_10px_28px_rgba(0,0,0,0.42)] backdrop-blur-md ${
              isHandleDragging
                ? "transition-none"
                : "transition-[top,transform] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
            }`}
            style={{ top: `${handleY}%` }}
          >
            <ChevronsLeftRight
              aria-hidden="true"
              className="h-4 w-4"
              strokeWidth={2.4}
            />
          </div>
        </div>
      </div>

      <button
        type="button"
        aria-label={isPlaying ? copy.pauseAria : copy.playAria}
        className="absolute bottom-2 left-2 z-40 flex h-7 w-7 items-center justify-center rounded-[8px] bg-transparent text-white/60 transition-colors hover:bg-white/14 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/70"
        onClick={(event) => {
          event.stopPropagation();
          setComparisonPlayback(!shouldPlayRef.current);
        }}
        onMouseDown={(event) => {
          event.stopPropagation();
        }}
        onPointerDown={(event) => {
          event.stopPropagation();
        }}
      >
        {isPlaying ? (
          <Pause
            aria-hidden="true"
            className="h-[15px] w-[15px]"
            strokeWidth={2.2}
          />
        ) : (
          <Play
            aria-hidden="true"
            className="h-[15px] w-[15px]"
            strokeWidth={2.2}
          />
        )}
      </button>

      <button
        type="button"
        aria-label={isFloating ? copy.exitFloatingAria : copy.enterFloatingAria}
        aria-pressed={isFloating}
        className={`absolute bottom-2 left-11 z-40 flex h-7 w-7 items-center justify-center rounded-[8px] bg-transparent transition-colors hover:bg-white/14 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/70 ${
          isFloating ? "text-white" : "text-white/60"
        }`}
        onClick={(event) => {
          event.stopPropagation();
          if (!isFloating) {
            setFloatingShape("wide");
          }
          setIsFloating((current) => !current);
        }}
        onMouseDown={(event) => {
          event.stopPropagation();
        }}
        onPointerDown={(event) => {
          event.stopPropagation();
        }}
      >
        <PictureInPicture2
          aria-hidden="true"
          className="h-[15px] w-[15px]"
          strokeWidth={2.2}
        />
      </button>

      <button
        type="button"
        aria-hidden={!isFloating}
        aria-label={`${copy.shapeCycleAria}: ${copy.shapeLabels[floatingShape]}`}
        className={`absolute bottom-2 left-20 z-40 flex h-7 w-7 items-center justify-center rounded-[8px] bg-transparent transition-[background-color,color] hover:bg-white/14 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/70 ${
          isFloating
            ? "pointer-events-auto text-white/60"
            : "pointer-events-none text-white/60"
        }`}
        disabled={!isFloating}
        onClick={(event) => {
          event.stopPropagation();
          setFloatingShape((current) => {
            const currentIndex = beautyFloatingShapeOrder.indexOf(current);
            return beautyFloatingShapeOrder[
              (currentIndex + 1) % beautyFloatingShapeOrder.length
            ] ?? "wide";
          });
        }}
        onMouseDown={(event) => {
          event.stopPropagation();
        }}
        onPointerDown={(event) => {
          event.stopPropagation();
        }}
        style={{
          opacity: isFloating ? 1 : 0,
          transform: isFloating ? "translateY(0)" : "translateY(4px)",
          transition:
            "background-color 150ms ease-out, color 150ms ease-out, opacity 180ms ease-out, transform 180ms ease-out",
        }}
        tabIndex={isFloating ? 0 : -1}
      >
        <Shapes
          aria-hidden="true"
          className="h-[15px] w-[15px]"
          strokeWidth={2.2}
        />
      </button>
    </div>
  );
}

function BeautyComparisonVideo({
  canLoad,
  frame,
  side,
  videoRef,
}: {
  canLoad: boolean;
  frame: BeautyMediaFrame;
  side: "before" | "after";
  videoRef: MutableRefObject<HTMLVideoElement | null>;
}) {
  return (
    <div
      className="absolute left-1/2 top-1/2 overflow-hidden"
      style={{
        height: frame.height,
        transform: "translate(-50%, -50%)",
        width: frame.width,
      }}
    >
      <video
        ref={videoRef}
        aria-hidden="true"
        autoPlay={canLoad}
        className="absolute top-0 h-full w-[200%] max-w-none object-fill"
        disablePictureInPicture
        loop
        muted
        playsInline
        preload={canLoad ? "auto" : "none"}
        src={canLoad ? beautyComparisonVideoSource : undefined}
        style={{ left: side === "before" ? "0%" : "-100%" }}
      />
    </div>
  );
}

function BeautyComparisonLabel({
  children,
  side,
}: {
  children: ReactNode;
  side: "left" | "right";
}) {
  return (
    <span
      className={`pointer-events-none absolute top-2 z-20 rounded-full border border-white/15 bg-black/42 px-2.5 py-1 text-[10px] font-medium leading-none text-white/82 shadow-[0_8px_18px_rgba(0,0,0,0.24)] backdrop-blur-md ${
        side === "left" ? "left-2" : "right-2"
      }`}
    >
      {children}
    </span>
  );
}
