"use client";

import {
  Download,
  ImagePlus,
  Layers,
  Plus,
  RefreshCcw,
  SlidersHorizontal,
  Trash2,
  Upload,
  Wand2,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Slider } from "./slider";
import type { MotionBlurMaskToolCopy } from "../lib/translations";

type BlurMode = "uniform" | "linear";
type ResizeHandle = "n" | "ne" | "e" | "se" | "s" | "sw" | "w" | "nw";
type TransformMode = "move" | ResizeHandle;

type UploadedImage = {
  element: HTMLImageElement;
  height: number;
  name: string;
  url: string;
  width: number;
};

type BlurMask = {
  angle: number;
  height: number;
  id: string;
  mode: BlurMode;
  name: string;
  strength: number;
  width: number;
  x: number;
  y: number;
};

type TransformState = {
  id: string;
  mode: TransformMode;
  startPoint: Point;
  startRect: Rect;
};

type Point = {
  x: number;
  y: number;
};

type Rect = {
  height: number;
  width: number;
  x: number;
  y: number;
};

type WorkspaceSize = {
  height: number;
  width: number;
};

type MotionBlurShaderRenderer = {
  canvas: HTMLCanvasElement;
  gl: WebGLRenderingContext;
  localUvBuffer: WebGLBuffer;
  locations: {
    direction: WebGLUniformLocation;
    image: WebGLUniformLocation;
    imageSizePx: WebGLUniformLocation;
    maskOriginPx: WebGLUniformLocation;
    maskSizePx: WebGLUniformLocation;
    mode: WebGLUniformLocation;
    position: number;
    localUv: number;
    strengthPx: WebGLUniformLocation;
  };
  positionBuffer: WebGLBuffer;
  program: WebGLProgram;
  texture: WebGLTexture;
};

const DEFAULT_STRENGTH = 28;
const DEFAULT_ANGLE = 0;
const MAX_PREVIEW_EDGE = 1800;
const SHADER_SAMPLE_COUNT = 65;

const MOTION_BLUR_VERTEX_SHADER = `
attribute vec2 a_position;
attribute vec2 a_localUv;

varying vec2 v_localUv;

void main() {
  v_localUv = a_localUv;
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

const MOTION_BLUR_FRAGMENT_SHADER = `
precision highp float;

const int SAMPLE_COUNT = ${SHADER_SAMPLE_COUNT};

uniform sampler2D u_image;
uniform vec2 u_imageSizePx;
uniform vec2 u_maskOriginPx;
uniform vec2 u_maskSizePx;
uniform vec2 u_direction;
uniform float u_strengthPx;
uniform int u_mode;

varying vec2 v_localUv;

void main() {
  vec2 sourcePx = u_maskOriginPx + v_localUv * u_maskSizePx;
  float strength = u_strengthPx;

  if (u_mode == 1) {
    vec2 centered = (v_localUv - vec2(0.5)) * u_maskSizePx;
    float projectedSpan = max(abs(u_direction.x) * u_maskSizePx.x + abs(u_direction.y) * u_maskSizePx.y, 1.0);
    float ramp = clamp(dot(centered, u_direction) / projectedSpan + 0.5, 0.0, 1.0);
    strength *= smoothstep(0.0, 1.0, ramp);
  }

  vec4 color = vec4(0.0);
  float weightSum = 0.0;

  for (int i = 0; i < SAMPLE_COUNT; i++) {
    float progress = float(i) / float(SAMPLE_COUNT - 1);
    float centeredProgress = progress - 0.5;
    float normalizedDistance = abs(centeredProgress) * 2.0;
    float weight = exp(-normalizedDistance * normalizedDistance * 4.5);
    vec2 samplePx = sourcePx + u_direction * centeredProgress * strength;
    samplePx = clamp(samplePx, vec2(0.5), u_imageSizePx - vec2(0.5));
    color += texture2D(u_image, samplePx / u_imageSizePx) * weight;
    weightSum += weight;
  }

  gl_FragColor = color / weightSum;
}
`;

const resizeHandles: Array<{ className: string; cursor: string; mode: ResizeHandle }> = [
  { mode: "nw", cursor: "cursor-nwse-resize", className: "-left-1.5 -top-1.5" },
  { mode: "n", cursor: "cursor-ns-resize", className: "left-1/2 -top-1.5 -translate-x-1/2" },
  { mode: "ne", cursor: "cursor-nesw-resize", className: "-right-1.5 -top-1.5" },
  { mode: "e", cursor: "cursor-ew-resize", className: "-right-1.5 top-1/2 -translate-y-1/2" },
  { mode: "se", cursor: "cursor-nwse-resize", className: "-bottom-1.5 -right-1.5" },
  { mode: "s", cursor: "cursor-ns-resize", className: "-bottom-1.5 left-1/2 -translate-x-1/2" },
  { mode: "sw", cursor: "cursor-nesw-resize", className: "-bottom-1.5 -left-1.5" },
  { mode: "w", cursor: "cursor-ew-resize", className: "-left-1.5 top-1/2 -translate-y-1/2" },
];

const shaderRendererCache = new WeakMap<HTMLImageElement, MotionBlurShaderRenderer | null>();

export function MotionBlurMaskTool({ copy }: { copy: MotionBlurMaskToolCopy }) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const workspaceRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const [sourceImage, setSourceImage] = useState<UploadedImage | null>(null);
  const [masks, setMasks] = useState<BlurMask[]>([]);
  const [selectedMaskId, setSelectedMaskId] = useState<string | null>(null);
  const [workspaceSize, setWorkspaceSize] = useState<WorkspaceSize>({ height: 0, width: 0 });
  const [activeTransform, setActiveTransform] = useState<TransformState | null>(null);
  const [isDraggingFile, setIsDraggingFile] = useState(false);

  const selectedMask = useMemo(
    () => masks.find((mask) => mask.id === selectedMaskId) ?? null,
    [masks, selectedMaskId],
  );

  const display = useMemo(() => {
    if (!sourceImage || workspaceSize.width <= 0 || workspaceSize.height <= 0) {
      return { height: 0, scale: 1, width: 0 };
    }

    const scale = Math.min(
      workspaceSize.width / sourceImage.width,
      workspaceSize.height / sourceImage.height,
      1,
    );

    return {
      height: Math.max(1, Math.round(sourceImage.height * scale)),
      scale,
      width: Math.max(1, Math.round(sourceImage.width * scale)),
    };
  }, [sourceImage, workspaceSize]);

  const previewPixelScale = useMemo(() => {
    if (!sourceImage) return 1;
    return Math.min(1, MAX_PREVIEW_EDGE / Math.max(sourceImage.width, sourceImage.height));
  }, [sourceImage]);

  const canExport = Boolean(sourceImage);

  useEffect(() => {
    const element = workspaceRef.current;
    if (!element) return undefined;

    const updateSize = () => {
      const rect = element.getBoundingClientRect();
      setWorkspaceSize({
        height: Math.max(1, rect.height),
        width: Math.max(1, rect.width),
      });
    };

    updateSize();
    const observer = new ResizeObserver(updateSize);
    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    return () => {
      if (sourceImage) {
        URL.revokeObjectURL(sourceImage.url);
      }
    };
  }, [sourceImage]);

  useEffect(() => {
    const canvas = previewCanvasRef.current;
    if (!canvas || !sourceImage) return;

    renderComposite(canvas, sourceImage.element, masks, previewPixelScale);
  }, [masks, previewPixelScale, sourceImage]);

  useEffect(() => {
    if (!sourceImage || !activeTransform) return undefined;

    const handlePointerMove = (event: PointerEvent) => {
      const point = getImagePointFromClient(stageRef.current, display.scale, event.clientX, event.clientY);
      if (!point) return;

      const nextRect = transformRect(
        activeTransform,
        point.x - activeTransform.startPoint.x,
        point.y - activeTransform.startPoint.y,
        sourceImage.width,
        sourceImage.height,
      );

      setMasks((currentMasks) =>
        currentMasks.map((mask) =>
          mask.id === activeTransform.id
            ? {
                ...mask,
                ...nextRect,
              }
            : mask,
        ),
      );
    };

    const handlePointerEnd = () => setActiveTransform(null);

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerEnd, { once: true });
    window.addEventListener("pointercancel", handlePointerEnd, { once: true });

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerEnd);
      window.removeEventListener("pointercancel", handlePointerEnd);
    };
  }, [activeTransform, display.scale, sourceImage]);

  useEffect(() => {
    if (!selectedMaskId) return undefined;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Backspace" && event.key !== "Delete") return;
      if (isFormElement(event.target)) return;

      event.preventDefault();
      deleteSelectedMask();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedMaskId]);

  const loadFile = useCallback((file: File | undefined) => {
    if (!file || !file.type.startsWith("image/")) return;

    const url = URL.createObjectURL(file);
    const image = new window.Image();
    image.decoding = "async";

    image.onload = () => {
      setSourceImage({
        element: image,
        height: image.naturalHeight,
        name: file.name,
        url,
        width: image.naturalWidth,
      });
      setMasks([]);
      setSelectedMaskId(null);
    };

    image.onerror = () => URL.revokeObjectURL(url);
    image.src = url;
  }, []);

  const handleFileInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      loadFile(event.currentTarget.files?.[0]);
      event.currentTarget.value = "";
    },
    [loadFile],
  );

  const addMask = useCallback(() => {
    if (!sourceImage) return;

    const width = Math.max(getMinMaskSize(sourceImage.width, sourceImage.height) * 2, sourceImage.width * 0.36);
    const height = Math.max(getMinMaskSize(sourceImage.width, sourceImage.height) * 2, sourceImage.height * 0.24);
    const id = createId();
    const nextMask: BlurMask = {
      angle: DEFAULT_ANGLE,
      height,
      id,
      mode: "uniform",
      name: `${copy.defaultMaskName} ${masks.length + 1}`,
      strength: DEFAULT_STRENGTH,
      width,
      x: (sourceImage.width - width) / 2,
      y: (sourceImage.height - height) / 2,
    };

    setMasks((currentMasks) => [...currentMasks, nextMask]);
    setSelectedMaskId(id);
  }, [copy.defaultMaskName, masks.length, sourceImage]);

  const resetImage = useCallback(() => {
    setSourceImage(null);
    setMasks([]);
    setSelectedMaskId(null);
    setActiveTransform(null);
  }, []);

  const deleteSelectedMask = useCallback(() => {
    if (!selectedMaskId) return;

    setMasks((currentMasks) => currentMasks.filter((mask) => mask.id !== selectedMaskId));
    setSelectedMaskId(null);
  }, [selectedMaskId]);

  const updateSelectedMask = useCallback(
    (patch: Partial<BlurMask>) => {
      if (!selectedMaskId || !sourceImage) return;

      setMasks((currentMasks) =>
        currentMasks.map((mask) => {
          if (mask.id !== selectedMaskId) return mask;

          const nextMask = {
            ...mask,
            ...patch,
          };
          const rect = clampRect(nextMask, sourceImage.width, sourceImage.height);

          return {
            ...nextMask,
            ...rect,
          };
        }),
      );
    },
    [selectedMaskId, sourceImage],
  );

  const beginTransform = useCallback(
    (event: React.PointerEvent, mask: BlurMask, mode: TransformMode) => {
      if (!sourceImage) return;

      const point = getImagePointFromClient(stageRef.current, display.scale, event.clientX, event.clientY);
      if (!point) return;

      event.preventDefault();
      event.stopPropagation();
      setSelectedMaskId(mask.id);
      setActiveTransform({
        id: mask.id,
        mode,
        startPoint: point,
        startRect: {
          height: mask.height,
          width: mask.width,
          x: mask.x,
          y: mask.y,
        },
      });
    },
    [display.scale, sourceImage],
  );

  const exportComposite = useCallback(() => {
    if (!sourceImage) return;

    const canvas = document.createElement("canvas");
    renderComposite(canvas, sourceImage.element, masks, 1);

    canvas.toBlob((blob) => {
      if (!blob) return;

      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `${stripFileExtension(sourceImage.name)}-motion-blur-mask.png`;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    }, "image/png");
  }, [masks, sourceImage]);

  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setIsDraggingFile(false);
      loadFile(event.dataTransfer.files?.[0]);
    },
    [loadFile],
  );

  return (
    <section className="min-h-screen bg-background px-4 pb-10 pt-24 text-foreground sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-[96rem] flex-col gap-5">
        <div className="flex flex-col gap-4 border-b border-border/60 pb-5 md:flex-row md:items-end md:justify-between">
          <div className="space-y-3">
            <p className="text-xs font-medium uppercase tracking-[0.28em] text-accent">{copy.toolEyebrow}</p>
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-5xl">
                {copy.title}
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
                {copy.description}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              className="inline-flex h-10 items-center gap-2 border border-border/70 bg-foreground/[0.04] px-4 text-sm font-medium text-foreground transition-colors hover:border-foreground/40 hover:bg-foreground/[0.08] disabled:cursor-not-allowed disabled:opacity-40"
              disabled={!sourceImage}
              type="button"
              onClick={addMask}
            >
              <Plus className="h-4 w-4" />
              <span>{copy.maskButton}</span>
            </button>
            <button
              className="inline-flex h-10 items-center gap-2 bg-foreground px-4 text-sm font-medium text-background transition-colors hover:bg-foreground/90 disabled:cursor-not-allowed disabled:bg-foreground/20 disabled:text-background/50"
              disabled={!canExport}
              type="button"
              onClick={exportComposite}
            >
              <Download className="h-4 w-4" />
              <span>{copy.exportButton}</span>
            </button>
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_23rem]">
          <div
            ref={workspaceRef}
            className="relative flex min-h-[26rem] items-center justify-center overflow-hidden border border-border/70 bg-[#070707] p-3 shadow-2xl shadow-black/25 lg:min-h-[calc(100vh-14rem)]"
          >
            {sourceImage ? (
              <div
                ref={stageRef}
                className="relative touch-none select-none overflow-hidden bg-black shadow-[0_28px_90px_rgba(0,0,0,0.45)]"
                style={{
                  height: display.height,
                  width: display.width,
                }}
                onPointerDown={() => setSelectedMaskId(null)}
              >
                <canvas
                  ref={previewCanvasRef}
                  aria-label={copy.previewAria}
                  className="block h-full w-full"
                />

                {masks.map((mask) => {
                  const isSelected = mask.id === selectedMaskId;
                  const left = mask.x * display.scale;
                  const top = mask.y * display.scale;
                  const width = mask.width * display.scale;
                  const height = mask.height * display.scale;

                  return (
                    <div
                      aria-label={mask.name}
                      className={`absolute touch-none select-none border ${
                        isSelected
                          ? "border-accent bg-accent/10 shadow-[0_0_0_1px_rgba(255,166,23,0.35),0_0_32px_rgba(255,166,23,0.18)]"
                          : "border-white/55 bg-white/5 hover:border-white/85"
                      }`}
                      key={mask.id}
                      role="button"
                      tabIndex={0}
                      style={{
                        height,
                        left,
                        top,
                        width,
                      }}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          event.preventDefault();
                          setSelectedMaskId(mask.id);
                        }
                      }}
                      onPointerDown={(event) => beginTransform(event, mask, "move")}
                    >
                      <div className="absolute left-2 top-2 flex max-w-[calc(100%-1rem)] items-center gap-1.5 bg-black/60 px-2 py-1 text-[11px] font-medium text-white backdrop-blur-sm">
                        <Wand2 className="h-3 w-3 text-accent" />
                        <span className="truncate">{mask.name}</span>
                      </div>

                      {isSelected
                        ? resizeHandles.map((handle) => (
                            <div
                              aria-hidden="true"
                              className={`absolute h-3 w-3 border border-background bg-accent shadow-sm ${handle.cursor} ${handle.className}`}
                              key={handle.mode}
                              onPointerDown={(event) => beginTransform(event, mask, handle.mode)}
                            />
                          ))
                        : null}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div
                className={`flex h-full min-h-[22rem] w-full flex-col items-center justify-center border border-dashed p-8 text-center transition-colors ${
                  isDraggingFile
                    ? "border-accent bg-accent/10"
                    : "border-border/80 bg-foreground/[0.025]"
                }`}
                onDragEnter={(event) => {
                  event.preventDefault();
                  setIsDraggingFile(true);
                }}
                onDragLeave={(event) => {
                  event.preventDefault();
                  setIsDraggingFile(false);
                }}
                onDragOver={(event) => event.preventDefault()}
                onDrop={handleDrop}
              >
                <div className="mb-5 flex h-14 w-14 items-center justify-center border border-border/80 bg-background">
                  <ImagePlus className="h-7 w-7 text-accent" />
                </div>
                <h2 className="text-xl font-semibold text-foreground">{copy.uploadTitle}</h2>
                <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                  {copy.uploadDescription}
                </p>
                <button
                  className="mt-6 inline-flex h-10 items-center gap-2 bg-foreground px-4 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-4 w-4" />
                  <span>{copy.chooseImage}</span>
                </button>
              </div>
            )}
          </div>

          <aside className="flex flex-col gap-4">
            <input
              ref={fileInputRef}
              accept="image/*"
              className="hidden"
              type="file"
              onChange={handleFileInputChange}
            />

            <div className="border border-border/70 bg-foreground/[0.035] p-4">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Upload className="h-4 w-4 text-accent" />
                  <h2 className="text-sm font-medium text-foreground">{copy.sourceTitle}</h2>
                </div>
                {sourceImage ? (
                  <button
                    aria-label={copy.replaceImageAria}
                    className="inline-flex h-8 w-8 items-center justify-center border border-border/70 text-muted-foreground transition-colors hover:border-foreground/40 hover:text-foreground"
                    title={copy.replaceImageAria}
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <RefreshCcw className="h-4 w-4" />
                  </button>
                ) : null}
              </div>

              {sourceImage ? (
                <div className="space-y-3">
                  <div className="truncate text-sm text-foreground">{sourceImage.name}</div>
                  <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                    <div className="border border-border/60 bg-background/70 p-3">
                      <div className="mb-1 uppercase tracking-[0.16em]">{copy.widthLabel}</div>
                      <div className="font-mono text-sm text-foreground">{sourceImage.width}px</div>
                    </div>
                    <div className="border border-border/60 bg-background/70 p-3">
                      <div className="mb-1 uppercase tracking-[0.16em]">{copy.heightLabel}</div>
                      <div className="font-mono text-sm text-foreground">{sourceImage.height}px</div>
                    </div>
                  </div>
                  <button
                    className="inline-flex h-9 w-full items-center justify-center gap-2 border border-border/70 text-sm text-muted-foreground transition-colors hover:border-foreground/40 hover:text-foreground"
                    type="button"
                    onClick={resetImage}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>{copy.clearImage}</span>
                  </button>
                </div>
              ) : (
                <button
                  className="inline-flex h-10 w-full items-center justify-center gap-2 bg-foreground px-4 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-4 w-4" />
                  <span>{copy.chooseImage}</span>
                </button>
              )}
            </div>

            <div className="border border-border/70 bg-foreground/[0.035] p-4">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Layers className="h-4 w-4 text-accent" />
                  <h2 className="text-sm font-medium text-foreground">{copy.masksTitle}</h2>
                </div>
                <button
                  aria-label={copy.addMaskAria}
                  className="inline-flex h-8 w-8 items-center justify-center border border-border/70 text-muted-foreground transition-colors hover:border-foreground/40 hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
                  disabled={!sourceImage}
                  title={copy.addMaskAria}
                  type="button"
                  onClick={addMask}
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              {masks.length > 0 ? (
                <div className="space-y-2">
                  {masks.map((mask) => (
                    <button
                      className={`flex h-10 w-full items-center justify-between gap-3 border px-3 text-left text-sm transition-colors ${
                        mask.id === selectedMaskId
                          ? "border-accent bg-accent/10 text-foreground"
                          : "border-border/60 bg-background/60 text-muted-foreground hover:border-foreground/30 hover:text-foreground"
                      }`}
                      key={mask.id}
                      type="button"
                      onClick={() => setSelectedMaskId(mask.id)}
                    >
                      <span className="truncate">{mask.name}</span>
                      <span className="shrink-0 font-mono text-xs">{Math.round(mask.strength)}px</span>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-sm leading-6 text-muted-foreground">
                  {sourceImage ? copy.emptyMasksWithImage : copy.emptyMasksWithoutImage}
                </p>
              )}
            </div>

            <div className="border border-border/70 bg-foreground/[0.035] p-4">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="h-4 w-4 text-accent" />
                  <h2 className="text-sm font-medium text-foreground">{copy.blurSettingsTitle}</h2>
                </div>
                <button
                  aria-label={copy.deleteSelectedMaskAria}
                  className="inline-flex h-8 w-8 items-center justify-center border border-border/70 text-muted-foreground transition-colors hover:border-destructive/60 hover:text-destructive disabled:cursor-not-allowed disabled:opacity-35"
                  disabled={!selectedMask}
                  title={copy.deleteSelectedMaskAria}
                  type="button"
                  onClick={deleteSelectedMask}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              {selectedMask ? (
                <div className="space-y-5">
                  <label className="block space-y-2">
                    <span className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                      {copy.nameLabel}
                    </span>
                    <input
                      className="h-10 w-full border border-border/70 bg-background px-3 text-sm text-foreground outline-none transition-colors focus:border-accent"
                      type="text"
                      value={selectedMask.name}
                      onChange={(event) => updateSelectedMask({ name: event.currentTarget.value })}
                    />
                  </label>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                        {copy.strengthLabel}
                      </span>
                      <span className="font-mono text-xs text-foreground">
                        {Math.round(selectedMask.strength)}px
                      </span>
                    </div>
                    <Slider
                      ariaLabel={copy.strengthAria}
                      max={120}
                      min={0}
                      step={1}
                      unit="px"
                      value={selectedMask.strength}
                      onChange={(strength) => updateSelectedMask({ strength })}
                    />
                  </div>

                  <div className="space-y-2">
                    <span className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                      {copy.modeLabel}
                    </span>
                    <div className="grid grid-cols-2 border border-border/70 bg-background">
                      {(["uniform", "linear"] as BlurMode[]).map((mode) => (
                        <button
                          className={`h-10 text-sm font-medium transition-colors ${
                            selectedMask.mode === mode
                              ? "bg-foreground text-background"
                              : "text-muted-foreground hover:text-foreground"
                          }`}
                          key={mode}
                          type="button"
                          onClick={() => updateSelectedMask({ mode })}
                        >
                          {mode === "uniform" ? copy.uniformMode : copy.linearMode}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                        {copy.angleLabel}
                      </span>
                      <span className="font-mono text-xs text-foreground">
                        {Math.round(selectedMask.angle)}deg
                      </span>
                    </div>
                    <Slider
                      ariaLabel={copy.angleAria}
                      formatter={(value) => `${Math.round(value)}deg`}
                      max={180}
                      min={-180}
                      step={1}
                      value={selectedMask.angle}
                      onChange={(angle) => updateSelectedMask({ angle })}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <NumberField
                      label={copy.xLabel}
                      value={selectedMask.x}
                      onChange={(x) => updateSelectedMask({ x })}
                    />
                    <NumberField
                      label={copy.yLabel}
                      value={selectedMask.y}
                      onChange={(y) => updateSelectedMask({ y })}
                    />
                    <NumberField
                      label={copy.widthLabel}
                      value={selectedMask.width}
                      onChange={(width) => updateSelectedMask({ width })}
                    />
                    <NumberField
                      label={copy.heightLabel}
                      value={selectedMask.height}
                      onChange={(height) => updateSelectedMask({ height })}
                    />
                  </div>
                </div>
              ) : (
                <p className="text-sm leading-6 text-muted-foreground">
                  {copy.selectedMaskEmpty}
                </p>
              )}
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

function NumberField({
  label,
  onChange,
  value,
}: {
  label: string;
  onChange: (value: number) => void;
  value: number;
}) {
  return (
    <label className="block space-y-1">
      <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
        {label}
      </span>
      <input
        className="h-9 w-full border border-border/70 bg-background px-2 font-mono text-sm text-foreground outline-none transition-colors focus:border-accent"
        min={0}
        step={1}
        type="number"
        value={Math.round(value)}
        onChange={(event) => onChange(Number(event.currentTarget.value))}
      />
    </label>
  );
}

function renderComposite(
  canvas: HTMLCanvasElement,
  image: HTMLImageElement,
  masks: BlurMask[],
  pixelScale: number,
) {
  const width = Math.max(1, Math.round(image.naturalWidth * pixelScale));
  const height = Math.max(1, Math.round(image.naturalHeight * pixelScale));
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d");
  if (!context) return;

  context.clearRect(0, 0, width, height);
  context.drawImage(image, 0, 0, width, height);

  const shaderRenderer = getMotionBlurShaderRenderer(image);

  masks.forEach((mask) => {
    drawMotionBlurMask(context, image, mask, pixelScale, shaderRenderer);
  });
}

function drawMotionBlurMask(
  context: CanvasRenderingContext2D,
  image: HTMLImageElement,
  mask: BlurMask,
  pixelScale: number,
  shaderRenderer: MotionBlurShaderRenderer | null,
) {
  if (mask.strength <= 0 || mask.width <= 0 || mask.height <= 0) return;

  if (shaderRenderer && drawShaderMotionBlurMask(context, image, mask, pixelScale, shaderRenderer)) {
    return;
  }

  drawCanvasFallbackMotionBlurMask(context, image, mask, pixelScale);
}

function getMotionBlurShaderRenderer(image: HTMLImageElement): MotionBlurShaderRenderer | null {
  if (shaderRendererCache.has(image)) {
    return shaderRendererCache.get(image) ?? null;
  }

  const renderer = createMotionBlurShaderRenderer(image);
  shaderRendererCache.set(image, renderer);
  return renderer;
}

function compileShader(
  gl: WebGLRenderingContext,
  type: number,
  source: string,
): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}

function createMotionBlurShaderRenderer(image: HTMLImageElement): MotionBlurShaderRenderer | null {
  const canvas = document.createElement("canvas");
  const gl = canvas.getContext("webgl", {
    alpha: true,
    antialias: false,
    depth: false,
    premultipliedAlpha: false,
    preserveDrawingBuffer: true,
    stencil: false,
  });

  if (!gl) return null;

  const vertexShader = compileShader(gl, gl.VERTEX_SHADER, MOTION_BLUR_VERTEX_SHADER);
  const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, MOTION_BLUR_FRAGMENT_SHADER);
  if (!vertexShader || !fragmentShader) return null;

  const program = gl.createProgram();
  if (!program) return null;

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  gl.deleteShader(vertexShader);
  gl.deleteShader(fragmentShader);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    gl.deleteProgram(program);
    return null;
  }

  const position = gl.getAttribLocation(program, "a_position");
  const localUv = gl.getAttribLocation(program, "a_localUv");
  const imageLocation = gl.getUniformLocation(program, "u_image");
  const imageSizePx = gl.getUniformLocation(program, "u_imageSizePx");
  const maskOriginPx = gl.getUniformLocation(program, "u_maskOriginPx");
  const maskSizePx = gl.getUniformLocation(program, "u_maskSizePx");
  const direction = gl.getUniformLocation(program, "u_direction");
  const strengthPx = gl.getUniformLocation(program, "u_strengthPx");
  const mode = gl.getUniformLocation(program, "u_mode");

  if (
    position < 0 ||
    localUv < 0 ||
    !imageLocation ||
    !imageSizePx ||
    !maskOriginPx ||
    !maskSizePx ||
    !direction ||
    !strengthPx ||
    !mode
  ) {
    gl.deleteProgram(program);
    return null;
  }

  const positionBuffer = gl.createBuffer();
  const localUvBuffer = gl.createBuffer();
  const texture = gl.createTexture();

  if (!positionBuffer || !localUvBuffer || !texture) {
    gl.deleteProgram(program);
    return null;
  }

  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([
      -1, -1,
      1, -1,
      -1, 1,
      -1, 1,
      1, -1,
      1, 1,
    ]),
    gl.STATIC_DRAW,
  );

  gl.bindBuffer(gl.ARRAY_BUFFER, localUvBuffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([
      0, 1,
      1, 1,
      0, 0,
      0, 0,
      1, 1,
      1, 0,
    ]),
    gl.STATIC_DRAW,
  );

  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.pixelStorei(gl.UNPACK_COLORSPACE_CONVERSION_WEBGL, gl.NONE);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

  return {
    canvas,
    gl,
    localUvBuffer,
    locations: {
      direction,
      image: imageLocation,
      imageSizePx,
      localUv,
      maskOriginPx,
      maskSizePx,
      mode,
      position,
      strengthPx,
    },
    positionBuffer,
    program,
    texture,
  };
}

function drawShaderMotionBlurMask(
  context: CanvasRenderingContext2D,
  image: HTMLImageElement,
  mask: BlurMask,
  pixelScale: number,
  renderer: MotionBlurShaderRenderer,
) {
  const width = Math.max(1, Math.round(mask.width * pixelScale));
  const height = Math.max(1, Math.round(mask.height * pixelScale));
  const { canvas, gl, locations } = renderer;

  if (gl.isContextLost()) return false;

  canvas.width = width;
  canvas.height = height;

  gl.viewport(0, 0, width, height);
  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.useProgram(renderer.program);

  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, renderer.texture);
  gl.uniform1i(locations.image, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, renderer.positionBuffer);
  gl.enableVertexAttribArray(locations.position);
  gl.vertexAttribPointer(locations.position, 2, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, renderer.localUvBuffer);
  gl.enableVertexAttribArray(locations.localUv);
  gl.vertexAttribPointer(locations.localUv, 2, gl.FLOAT, false, 0, 0);

  const radians = (mask.angle * Math.PI) / 180;
  gl.uniform2f(locations.imageSizePx, image.naturalWidth, image.naturalHeight);
  gl.uniform2f(locations.maskOriginPx, mask.x, mask.y);
  gl.uniform2f(locations.maskSizePx, mask.width, mask.height);
  gl.uniform2f(locations.direction, Math.cos(radians), Math.sin(radians));
  gl.uniform1f(locations.strengthPx, mask.strength);
  gl.uniform1i(locations.mode, mask.mode === "linear" ? 1 : 0);
  gl.drawArrays(gl.TRIANGLES, 0, 6);
  gl.flush();

  context.drawImage(canvas, Math.round(mask.x * pixelScale), Math.round(mask.y * pixelScale), width, height);
  return true;
}

function drawCanvasFallbackMotionBlurMask(
  context: CanvasRenderingContext2D,
  image: HTMLImageElement,
  mask: BlurMask,
  pixelScale: number,
) {
  const width = Math.max(1, Math.round(mask.width * pixelScale));
  const height = Math.max(1, Math.round(mask.height * pixelScale));
  const tempCanvas = document.createElement("canvas");
  tempCanvas.width = width;
  tempCanvas.height = height;

  const tempContext = tempCanvas.getContext("2d");
  if (!tempContext) return;

  const blurLength = mask.strength * pixelScale;
  const sampleCount = Math.max(3, Math.min(64, Math.ceil(blurLength * 1.5) + 1));
  const radians = (mask.angle * Math.PI) / 180;
  const unitX = Math.cos(radians);
  const unitY = Math.sin(radians);
  const imageWidth = image.naturalWidth * pixelScale;
  const imageHeight = image.naturalHeight * pixelScale;
  const sourceX = mask.x * pixelScale;
  const sourceY = mask.y * pixelScale;

  tempContext.save();
  tempContext.beginPath();
  tempContext.rect(0, 0, width, height);
  tempContext.clip();

  const offsets = Array.from({ length: sampleCount }, (_, index) => {
    const progress = sampleCount === 1 ? 0.5 : index / (sampleCount - 1);
    return (progress - 0.5) * blurLength;
  }).sort((a, b) => Math.abs(a) - Math.abs(b));

  offsets.forEach((offset, index) => {
    tempContext.globalAlpha = index === 0 ? 1 : 1 / (index + 1);
    tempContext.drawImage(
      image,
      -sourceX + unitX * offset,
      -sourceY + unitY * offset,
      imageWidth,
      imageHeight,
    );
  });

  tempContext.restore();
  tempContext.globalAlpha = 1;

  if (mask.mode === "linear") {
    const gradientLength = Math.hypot(width, height);
    const centerX = width / 2;
    const centerY = height / 2;
    const gradient = tempContext.createLinearGradient(
      centerX - unitX * gradientLength * 0.5,
      centerY - unitY * gradientLength * 0.5,
      centerX + unitX * gradientLength * 0.5,
      centerY + unitY * gradientLength * 0.5,
    );

    gradient.addColorStop(0, "rgba(0, 0, 0, 0)");
    gradient.addColorStop(0.35, "rgba(0, 0, 0, 0.28)");
    gradient.addColorStop(1, "rgba(0, 0, 0, 1)");
    tempContext.globalCompositeOperation = "destination-in";
    tempContext.fillStyle = gradient;
    tempContext.fillRect(0, 0, width, height);
    tempContext.globalCompositeOperation = "source-over";
  }

  context.drawImage(tempCanvas, mask.x * pixelScale, mask.y * pixelScale);
}

function transformRect(
  transform: TransformState,
  deltaX: number,
  deltaY: number,
  imageWidth: number,
  imageHeight: number,
): Rect {
  const { startRect } = transform;
  const minSize = getMinMaskSize(imageWidth, imageHeight);

  if (transform.mode === "move") {
    return {
      ...startRect,
      x: clamp(startRect.x + deltaX, 0, Math.max(0, imageWidth - startRect.width)),
      y: clamp(startRect.y + deltaY, 0, Math.max(0, imageHeight - startRect.height)),
    };
  }

  let left = startRect.x;
  let right = startRect.x + startRect.width;
  let top = startRect.y;
  let bottom = startRect.y + startRect.height;

  if (transform.mode.includes("w")) {
    left = clamp(startRect.x + deltaX, 0, right - minSize);
  }

  if (transform.mode.includes("e")) {
    right = clamp(startRect.x + startRect.width + deltaX, left + minSize, imageWidth);
  }

  if (transform.mode.includes("n")) {
    top = clamp(startRect.y + deltaY, 0, bottom - minSize);
  }

  if (transform.mode.includes("s")) {
    bottom = clamp(startRect.y + startRect.height + deltaY, top + minSize, imageHeight);
  }

  return {
    height: bottom - top,
    width: right - left,
    x: left,
    y: top,
  };
}

function clampRect(rect: Rect, imageWidth: number, imageHeight: number): Rect {
  const minSize = getMinMaskSize(imageWidth, imageHeight);
  const width = clamp(Number.isFinite(rect.width) ? rect.width : minSize, minSize, imageWidth);
  const height = clamp(Number.isFinite(rect.height) ? rect.height : minSize, minSize, imageHeight);
  const x = clamp(Number.isFinite(rect.x) ? rect.x : 0, 0, Math.max(0, imageWidth - width));
  const y = clamp(Number.isFinite(rect.y) ? rect.y : 0, 0, Math.max(0, imageHeight - height));

  return { height, width, x, y };
}

function getImagePointFromClient(
  stage: HTMLDivElement | null,
  scale: number,
  clientX: number,
  clientY: number,
): Point | null {
  if (!stage || scale <= 0) return null;

  const rect = stage.getBoundingClientRect();
  return {
    x: (clientX - rect.left) / scale,
    y: (clientY - rect.top) / scale,
  };
}

function getMinMaskSize(imageWidth: number, imageHeight: number) {
  return Math.max(6, Math.min(64, Math.min(imageWidth, imageHeight) * 0.04));
}

function isFormElement(target: EventTarget | null) {
  return (
    target instanceof HTMLInputElement ||
    target instanceof HTMLTextAreaElement ||
    target instanceof HTMLSelectElement
  );
}

function stripFileExtension(fileName: string) {
  return fileName.replace(/\.[^.]+$/, "") || "image";
}

function createId() {
  return window.crypto?.randomUUID?.() ?? `mask-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}
