"use client";

import {
  Check,
  Code2,
  Copy,
  ImagePlus,
  RefreshCcw,
  SlidersHorizontal,
  Trash2,
  Upload,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type ResizeHandle = "n" | "ne" | "e" | "se" | "s" | "sw" | "w" | "nw";
type TransformMode = "move" | ResizeHandle;

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

type UploadedImage = {
  height: number;
  name: string;
  url: string;
  width: number;
};

type TransformState = {
  mode: TransformMode;
  startPoint: Point;
  startRect: Rect;
};

type WorkspaceSize = {
  height: number;
  width: number;
};

const resizeHandles: Array<{ className: string; cursor: string; mode: ResizeHandle }> = [
  { mode: "nw", cursor: "cursor-nwse-resize", className: "-left-2 -top-2" },
  { mode: "n", cursor: "cursor-ns-resize", className: "left-1/2 -top-2 -translate-x-1/2" },
  { mode: "ne", cursor: "cursor-nesw-resize", className: "-right-2 -top-2" },
  { mode: "e", cursor: "cursor-ew-resize", className: "-right-2 top-1/2 -translate-y-1/2" },
  { mode: "se", cursor: "cursor-nwse-resize", className: "-bottom-2 -right-2" },
  { mode: "s", cursor: "cursor-ns-resize", className: "-bottom-2 left-1/2 -translate-x-1/2" },
  { mode: "sw", cursor: "cursor-nesw-resize", className: "-bottom-2 -left-2" },
  { mode: "w", cursor: "cursor-ew-resize", className: "-left-2 top-1/2 -translate-y-1/2" },
];

export function MockupMakerTool() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const workspaceRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const [sourceImage, setSourceImage] = useState<UploadedImage | null>(null);
  const [screenRect, setScreenRect] = useState<Rect | null>(null);
  const [screenCornerRadius, setScreenCornerRadius] = useState(0);
  const [screenBottomCornerRadius, setScreenBottomCornerRadius] = useState(0);
  const [workspaceSize, setWorkspaceSize] = useState<WorkspaceSize>({ height: 0, width: 0 });
  const [activeTransform, setActiveTransform] = useState<TransformState | null>(null);
  const [isDraggingFile, setIsDraggingFile] = useState(false);
  const [copied, setCopied] = useState(false);

  const display = useMemo(() => {
    if (!sourceImage || workspaceSize.width <= 0 || workspaceSize.height <= 0) {
      return { height: 0, scale: 1, width: 0 };
    }

    const scale = Math.min(
      workspaceSize.width / sourceImage.width,
      workspaceSize.height / sourceImage.height,
    );

    return {
      height: Math.max(1, sourceImage.height * scale),
      scale,
      width: Math.max(1, sourceImage.width * scale),
    };
  }, [sourceImage, workspaceSize]);

  const schemaJSON = useMemo(() => {
    const rect = screenRect ? roundRect(screenRect) : { height: 0, width: 0, x: 0, y: 0 };
    const image = sourceImage ?? { height: 0, name: "mockup.png", width: 0 };

    return JSON.stringify(
      {
        id: "mockup-id",
        name: "Mockup Name",
        kind: "phone",
        version: 1,
        screenResolution: {
          width: rect.width,
          height: rect.height,
        },
        renderGeometry: {
          canvasSize: {
            width: image.width,
            height: image.height,
          },
          screenRect: rect,
          screenCornerRadius: roundNumber(screenCornerRadius),
          screenBottomCornerRadius: roundNumber(screenBottomCornerRadius),
          clipShape: "roundedRect",
        },
        variants: [
          {
            id: "default",
            name: "Default",
            assets: [
              {
                role: "chrome",
                source: image.name,
                pixelWidth: image.width,
                pixelHeight: image.height,
              },
            ],
          },
        ],
      },
      null,
      2,
    );
  }, [screenBottomCornerRadius, screenCornerRadius, screenRect, sourceImage]);

  useEffect(() => {
    const element = workspaceRef.current;
    if (!element) return undefined;

    const updateSize = () => {
      const rect = element.getBoundingClientRect();
      setWorkspaceSize({
        height: Math.max(1, rect.height - 24),
        width: Math.max(1, rect.width - 24),
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
    if (!sourceImage || !activeTransform) return undefined;

    const handlePointerMove = (event: PointerEvent) => {
      const point = getImagePointFromClient(stageRef.current, display.scale, event.clientX, event.clientY);
      if (!point) return;

      setScreenRect(
        transformRect(
          activeTransform,
          point.x - activeTransform.startPoint.x,
          point.y - activeTransform.startPoint.y,
          sourceImage.width,
          sourceImage.height,
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
    if (!copied) return undefined;

    const timeout = window.setTimeout(() => setCopied(false), 1200);
    return () => window.clearTimeout(timeout);
  }, [copied]);

  useEffect(() => {
    if (!screenRect) return;

    const maxRadius = Math.min(screenRect.width, screenRect.height) / 2;
    setScreenCornerRadius((value) => clamp(value, 0, maxRadius));
    setScreenBottomCornerRadius((value) => clamp(value, 0, maxRadius));
  }, [screenRect]);

  const updateScreenRect = useCallback(
    (patch: Partial<Rect>) => {
      if (!sourceImage || !screenRect) return;

      setScreenRect(clampRect({ ...screenRect, ...patch }, sourceImage.width, sourceImage.height));
    },
    [screenRect, sourceImage],
  );

  const loadFile = useCallback((file: File | undefined) => {
    if (!file || !file.type.startsWith("image/")) return;

    const url = URL.createObjectURL(file);
    const image = new window.Image();
    image.decoding = "async";

    image.onload = () => {
      const width = image.naturalWidth;
      const height = image.naturalHeight;
      const insetX = width * 0.12;
      const insetY = height * 0.12;
      const initialRect = {
        height: height - insetY * 2,
        width: width - insetX * 2,
        x: insetX,
        y: insetY,
      };
      const radius = Math.min(initialRect.width, initialRect.height) * 0.055;

      setSourceImage({
        height,
        name: file.name,
        url,
        width,
      });
      setScreenRect(clampRect(initialRect, width, height));
      setScreenCornerRadius(radius);
      setScreenBottomCornerRadius(radius);
      setActiveTransform(null);
      setCopied(false);
    };

    image.onerror = () => URL.revokeObjectURL(url);
    image.src = url;
  }, []);

  const clearImage = useCallback(() => {
    setSourceImage(null);
    setScreenRect(null);
    setScreenCornerRadius(0);
    setScreenBottomCornerRadius(0);
    setActiveTransform(null);
    setCopied(false);
  }, []);

  const handleFileInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      loadFile(event.currentTarget.files?.[0]);
      event.currentTarget.value = "";
    },
    [loadFile],
  );

  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setIsDraggingFile(false);
      loadFile(event.dataTransfer.files?.[0]);
    },
    [loadFile],
  );

  const beginTransform = useCallback(
    (event: React.PointerEvent, mode: TransformMode) => {
      if (!sourceImage || !screenRect) return;

      const point = getImagePointFromClient(stageRef.current, display.scale, event.clientX, event.clientY);
      if (!point) return;

      event.preventDefault();
      event.stopPropagation();
      setActiveTransform({
        mode,
        startPoint: point,
        startRect: screenRect,
      });
    },
    [display.scale, screenRect, sourceImage],
  );

  const copySchema = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(schemaJSON);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }, [schemaJSON]);

  return (
    <section className="min-h-screen bg-background px-4 pb-8 pt-24 text-foreground sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-[98rem] flex-col gap-5">
        <div className="flex flex-col gap-4 border-b border-border/60 pb-5 md:flex-row md:items-end md:justify-between">
          <div className="space-y-3">
            <p className="text-xs font-medium uppercase tracking-[0.28em] text-accent">Internal Tool</p>
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-5xl">
                Mockup Maker
              </h1>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">
                Upload a mockup asset, drag the screen rectangle into place, and copy the generated schema.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              className="inline-flex h-10 items-center gap-2 border border-border/70 bg-foreground/[0.04] px-4 text-sm font-medium text-foreground transition-colors hover:border-foreground/40 hover:bg-foreground/[0.08]"
              type="button"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-4 w-4" />
              <span>{sourceImage ? "Replace image" : "Upload image"}</span>
            </button>
            <button
              className="inline-flex h-10 items-center gap-2 border border-border/70 px-4 text-sm font-medium text-muted-foreground transition-colors hover:border-destructive/60 hover:text-destructive disabled:cursor-not-allowed disabled:opacity-35"
              disabled={!sourceImage}
              type="button"
              onClick={clearImage}
            >
              <Trash2 className="h-4 w-4" />
              <span>Clear</span>
            </button>
          </div>
        </div>

        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_28rem]">
          <div
            ref={workspaceRef}
            className={`relative flex min-h-[30rem] items-center justify-center overflow-hidden border border-border/70 bg-[#070707] p-3 shadow-2xl shadow-black/25 transition-colors xl:min-h-[calc(100vh-13rem)] ${
              isDraggingFile ? "border-accent bg-accent/10" : ""
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
            {sourceImage && screenRect ? (
              <div
                ref={stageRef}
                className="relative touch-none select-none overflow-hidden bg-black shadow-[0_28px_90px_rgba(0,0,0,0.45)]"
                style={{
                  height: display.height,
                  width: display.width,
                }}
              >
                <img
                  alt=""
                  className="block h-full w-full pointer-events-none select-none"
                  draggable={false}
                  src={sourceImage.url}
                />

                <div
                  aria-label="Screen rectangle"
                  className="absolute touch-none select-none cursor-move"
                  role="button"
                  tabIndex={0}
                  style={{
                    background: "rgba(255, 59, 48, 0.2)",
                    border: "2px dashed rgba(255, 59, 48, 0.96)",
                    borderBottomLeftRadius: screenBottomCornerRadius * display.scale,
                    borderBottomRightRadius: screenBottomCornerRadius * display.scale,
                    borderTopLeftRadius: screenCornerRadius * display.scale,
                    borderTopRightRadius: screenCornerRadius * display.scale,
                    height: screenRect.height * display.scale,
                    left: screenRect.x * display.scale,
                    top: screenRect.y * display.scale,
                    width: screenRect.width * display.scale,
                  }}
                  onPointerDown={(event) => beginTransform(event, "move")}
                >
                  {resizeHandles.map((handle) => (
                    <div
                      aria-hidden="true"
                      className={`absolute h-4 w-4 border border-red-400 bg-background shadow-sm ${handle.cursor} ${handle.className}`}
                      key={handle.mode}
                      onPointerDown={(event) => beginTransform(event, handle.mode)}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex h-full min-h-[26rem] w-full flex-col items-center justify-center border border-dashed border-border/80 bg-foreground/[0.025] p-8 text-center">
                <div className="mb-5 flex h-14 w-14 items-center justify-center border border-border/80 bg-background">
                  <ImagePlus className="h-7 w-7 text-accent" />
                </div>
                <h2 className="text-xl font-semibold text-foreground">Upload a mockup image</h2>
                <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                  Drop an asset here or choose a file. The tool reads the image dimensions and maps the rectangle in source pixels.
                </p>
                <button
                  className="mt-6 inline-flex h-10 items-center gap-2 bg-foreground px-4 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-4 w-4" />
                  <span>Choose image</span>
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
                  <h2 className="text-sm font-medium text-foreground">Source image</h2>
                </div>
                {sourceImage ? (
                  <button
                    aria-label="Replace image"
                    className="inline-flex h-8 w-8 items-center justify-center border border-border/70 text-muted-foreground transition-colors hover:border-foreground/40 hover:text-foreground"
                    title="Replace image"
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
                    <Metric label="Width" value={`${sourceImage.width}px`} />
                    <Metric label="Height" value={`${sourceImage.height}px`} />
                  </div>
                </div>
              ) : (
                <button
                  className="inline-flex h-10 w-full items-center justify-center gap-2 bg-foreground px-4 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-4 w-4" />
                  <span>Choose image</span>
                </button>
              )}
            </div>

            <div className="border border-border/70 bg-foreground/[0.035] p-4">
              <div className="mb-4 flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4 text-accent" />
                <h2 className="text-sm font-medium text-foreground">Screen rect</h2>
              </div>

              {sourceImage && screenRect ? (
                <div className="grid grid-cols-2 gap-2">
                  <NumberField label="X" value={screenRect.x} onChange={(x) => updateScreenRect({ x })} />
                  <NumberField label="Y" value={screenRect.y} onChange={(y) => updateScreenRect({ y })} />
                  <NumberField
                    label="Width"
                    value={screenRect.width}
                    onChange={(width) => updateScreenRect({ width })}
                  />
                  <NumberField
                    label="Height"
                    value={screenRect.height}
                    onChange={(height) => updateScreenRect({ height })}
                  />
                  <NumberField
                    label="Radius"
                    value={screenCornerRadius}
                    onChange={(value) => setScreenCornerRadius(clamp(value, 0, Math.min(screenRect.width, screenRect.height) / 2))}
                  />
                  <NumberField
                    label="Bottom radius"
                    value={screenBottomCornerRadius}
                    onChange={(value) =>
                      setScreenBottomCornerRadius(clamp(value, 0, Math.min(screenRect.width, screenRect.height) / 2))
                    }
                  />
                </div>
              ) : (
                <p className="text-sm leading-6 text-muted-foreground">
                  Upload an image to edit the screen position, size, and corner radii.
                </p>
              )}
            </div>

            <div className="min-h-0 border border-border/70 bg-foreground/[0.035] p-4">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Code2 className="h-4 w-4 text-accent" />
                  <h2 className="text-sm font-medium text-foreground">Schema JSON</h2>
                </div>
                <button
                  className="inline-flex h-8 items-center gap-2 border border-border/70 px-3 text-xs font-medium text-muted-foreground transition-colors hover:border-foreground/40 hover:text-foreground"
                  type="button"
                  onClick={copySchema}
                >
                  {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copied ? "Copied" : "Copy"}</span>
                </button>
              </div>
              <pre className="max-h-[34rem] overflow-auto border border-border/60 bg-background/80 p-3 text-[11px] leading-5 text-muted-foreground">
                <code>{schemaJSON}</code>
              </pre>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-border/60 bg-background/70 p-3">
      <div className="mb-1 uppercase tracking-[0.16em]">{label}</div>
      <div className="font-mono text-sm text-foreground">{value}</div>
    </div>
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
        inputMode="decimal"
        min={0}
        step={0.1}
        type="number"
        value={formatInputNumber(value)}
        onChange={(event) => onChange(Number(event.currentTarget.value))}
      />
    </label>
  );
}

function getImagePointFromClient(
  stage: HTMLDivElement | null,
  scale: number,
  clientX: number,
  clientY: number,
): Point | null {
  if (!stage || scale <= 0) return null;

  const bounds = stage.getBoundingClientRect();

  return {
    x: (clientX - bounds.left) / scale,
    y: (clientY - bounds.top) / scale,
  };
}

function transformRect(
  transform: TransformState,
  deltaX: number,
  deltaY: number,
  imageWidth: number,
  imageHeight: number,
): Rect {
  if (transform.mode === "move") {
    return clampRect(
      {
        ...transform.startRect,
        x: transform.startRect.x + deltaX,
        y: transform.startRect.y + deltaY,
      },
      imageWidth,
      imageHeight,
    );
  }

  let left = transform.startRect.x;
  let top = transform.startRect.y;
  let right = transform.startRect.x + transform.startRect.width;
  let bottom = transform.startRect.y + transform.startRect.height;

  if (transform.mode.includes("w")) left += deltaX;
  if (transform.mode.includes("e")) right += deltaX;
  if (transform.mode.includes("n")) top += deltaY;
  if (transform.mode.includes("s")) bottom += deltaY;

  left = clamp(left, 0, imageWidth);
  right = clamp(right, 0, imageWidth);
  top = clamp(top, 0, imageHeight);
  bottom = clamp(bottom, 0, imageHeight);

  if (right - left < 1) {
    if (transform.mode.includes("w")) {
      left = Math.max(0, right - 1);
    } else {
      right = Math.min(imageWidth, left + 1);
    }
  }

  if (bottom - top < 1) {
    if (transform.mode.includes("n")) {
      top = Math.max(0, bottom - 1);
    } else {
      bottom = Math.min(imageHeight, top + 1);
    }
  }

  return clampRect(
    {
      height: bottom - top,
      width: right - left,
      x: left,
      y: top,
    },
    imageWidth,
    imageHeight,
  );
}

function clampRect(rect: Rect, imageWidth: number, imageHeight: number): Rect {
  const width = clamp(toFiniteNumber(rect.width, 1), 1, imageWidth);
  const height = clamp(toFiniteNumber(rect.height, 1), 1, imageHeight);

  return {
    height,
    width,
    x: clamp(toFiniteNumber(rect.x, 0), 0, imageWidth - width),
    y: clamp(toFiniteNumber(rect.y, 0), 0, imageHeight - height),
  };
}

function clamp(value: number, min: number, max: number) {
  if (!Number.isFinite(value)) return min;
  return Math.min(Math.max(value, min), max);
}

function toFiniteNumber(value: number, fallback: number) {
  return Number.isFinite(value) ? value : fallback;
}

function roundRect(rect: Rect): Rect {
  return {
    height: roundNumber(rect.height),
    width: roundNumber(rect.width),
    x: roundNumber(rect.x),
    y: roundNumber(rect.y),
  };
}

function roundNumber(value: number) {
  const rounded = Math.round(value * 1000) / 1000;
  return Object.is(rounded, -0) ? 0 : rounded;
}

function formatInputNumber(value: number) {
  return String(roundNumber(value));
}
