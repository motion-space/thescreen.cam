import type { CSSProperties, PointerEvent } from "react";
import { useRef, useState } from "react";
import { createPortal } from "react-dom";

type SliderProps = {
  value: number;
  min: number;
  max: number;
  step?: number;
  disabled?: boolean;
  className?: string;
  ariaLabel?: string;
  ticksHoverable?: boolean;
  unit?: string;
  formatter?: (value: number) => string;
  onChange: (value: number) => void;
};

type HoverTick = {
  index: number;
  value: number;
  left: number;
  tooltipX: number;
  tooltipY: number;
  tooltipPlacement: "top" | "bottom";
};

const SLIDER_TICK_SPACING_PX = 4;
const SLIDER_FILL_COVER_PX = 1;
const SLIDER_TOOLTIP_GAP_PX = 12;
const SLIDER_TOOLTIP_HEIGHT_PX = 28;
const SLIDER_HOVER_TICK_HEIGHT_PX = 24;

export function Slider({
  value,
  min,
  max,
  step = 1,
  disabled = false,
  className = "",
  ariaLabel,
  ticksHoverable = true,
  unit = "",
  formatter,
  onChange,
}: SliderProps) {
  const visualRef = useRef<HTMLDivElement | null>(null);
  const [hoverTick, setHoverTick] = useState<HoverTick | null>(null);
  const range = Math.max(0.000001, max - min);
  const progress = clamp01((value - min) / range) * 100;
  const style = {
    "--slider-progress": `${progress}%`,
  } as CSSProperties;

  const clearHoverTick = () => {
    setHoverTick((current) => (current === null ? current : null));
  };

  const updateHoverTick = (event: PointerEvent<HTMLDivElement>) => {
    if (!ticksHoverable || disabled) return;

    const sliderRect = event.currentTarget.getBoundingClientRect();
    const trackRect = visualRef.current?.getBoundingClientRect() ?? sliderRect;
    const rawX = event.clientX - trackRect.left;
    const filledWidth = trackRect.width * (progress / 100) + SLIDER_FILL_COVER_PX;

    if (rawX <= filledWidth) {
      clearHoverTick();
      return;
    }

    const tickIndex = Math.round(rawX / SLIDER_TICK_SPACING_PX);
    const maxIndex = Math.max(0, Math.floor(trackRect.width / SLIDER_TICK_SPACING_PX));
    const safeIndex = clamp(tickIndex, 0, maxIndex);
    const left = safeIndex * SLIDER_TICK_SPACING_PX;
    const nextValue = min + clamp01(left / Math.max(1, trackRect.width)) * range;
    const tickTop = trackRect.top + trackRect.height / 2 - SLIDER_HOVER_TICK_HEIGHT_PX / 2;
    const tickBottom = trackRect.top + trackRect.height / 2 + SLIDER_HOVER_TICK_HEIGHT_PX / 2;
    const tooltipPlacement: HoverTick["tooltipPlacement"] =
      tickTop >= SLIDER_TOOLTIP_HEIGHT_PX + SLIDER_TOOLTIP_GAP_PX ? "top" : "bottom";
    const tooltipX = trackRect.left + left;
    const tooltipY =
      tooltipPlacement === "top"
        ? tickTop - SLIDER_TOOLTIP_GAP_PX - SLIDER_TOOLTIP_HEIGHT_PX
        : tickBottom + SLIDER_TOOLTIP_GAP_PX;

    const nextHoverTick = {
      index: safeIndex,
      left,
      value: snapValue(nextValue, min, max, step),
      tooltipX,
      tooltipY,
      tooltipPlacement,
    };

    setHoverTick((current) =>
      current?.index === nextHoverTick.index &&
      current.value === nextHoverTick.value &&
      current.tooltipX === nextHoverTick.tooltipX &&
      current.tooltipY === nextHoverTick.tooltipY &&
      current.tooltipPlacement === nextHoverTick.tooltipPlacement
        ? current
        : nextHoverTick,
    );
  };

  return (
    <div
      className={`trace-slider ${className}`}
      style={style}
      onPointerEnter={updateHoverTick}
      onPointerMove={updateHoverTick}
      onPointerLeave={clearHoverTick}
    >
      <input
        aria-label={ariaLabel}
        className="trace-slider-native"
        disabled={disabled}
        max={max}
        min={min}
        step={step}
        type="range"
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
      <div ref={visualRef} className="trace-slider-visual">
        <div className="trace-slider-bars" />
        <div className="trace-slider-fill" />
        {ticksHoverable && hoverTick ? (
          <div
            className="trace-slider-hover-tick"
            style={{ left: `${hoverTick.left}px` }}
          />
        ) : null}
        <div className="trace-slider-thumb" />
      </div>
      {ticksHoverable && hoverTick
        ? createPortal(
            <div
              className={`trace-slider-tooltip ${
                hoverTick.tooltipPlacement === "top"
                  ? "trace-slider-tooltip-top"
                  : "trace-slider-tooltip-bottom"
              }`}
              style={{
                left: hoverTick.tooltipX,
                top: hoverTick.tooltipY,
              }}
            >
              {formatSliderValue(hoverTick.value, unit, formatter)}
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}

function snapValue(value: number, min: number, max: number, step: number): number {
  const snapped = min + Math.round((value - min) / step) * step;
  return clamp(snapped, min, max);
}

function formatSliderValue(value: number, unit: string, formatter?: (value: number) => string): string {
  if (formatter) return formatter(value);

  const formatted = Number.isInteger(value) ? String(value) : value.toFixed(2);
  return `${formatted}${unit}`;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}
