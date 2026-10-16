"use client";

import { useRef } from "react";
import type { Locale } from "../lib/i18n";
import { getShowcaseCopy, showcaseFeatureOrder } from "../lib/showcase-copy";
import {
  CaptionsInspector,
  CursorArrow,
  EDITOR_H,
  EDITOR_W,
  EditorChrome,
  INSPECTOR_X,
  MONO_FONT,
  PREVIEW,
  RecordedApp,
  SCREEN,
  SYSTEM_FONT,
  TARGET,
  Toggle,
  TraceSlider,
  ZoomInspector,
} from "./mg/editor-mock";
import { FillText, useScene } from "./mg/scene";

/* Chapter boundaries on the scrubbed timeline */
const CHAPTERS = [0, 2.2, 4.2, 6.2, 8.2];
const LENS_PATH: Array<[number, number]> = [
  [260, 62],
  [330, 180],
  [470, 300],
  [620, 270],
  [675, 365],
];
const SEG_X = INSPECTOR_X + 118 + 2;
const SEG_W = 204 / 3;

/** Splits a caption into read-along tokens (words, or 2-char runs for CJK). */
function captionTokens(text: string) {
  if (/\s/.test(text)) return text.split(/\s+/);
  const chars = Array.from(text);
  const tokens: string[] = [];
  for (let i = 0; i < chars.length; i += 2) tokens.push(chars.slice(i, i + 2).join(""));
  return tokens;
}

function Wallpaper() {
  return (
    <svg className="absolute inset-0 h-full w-full" viewBox="0 0 940 464" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id="sc-wall" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#1b1446" />
          <stop offset="0.55" stopColor="#3a1f6b" />
          <stop offset="1" stopColor="#c2562b" />
        </linearGradient>
        <filter id="sc-wall-blur" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="60" />
        </filter>
      </defs>
      <rect width="940" height="464" fill="url(#sc-wall)" />
      <g filter="url(#sc-wall-blur)" opacity="0.9">
        <ellipse cx="180" cy="90" rx="260" ry="150" fill="#4f46e5" />
        <ellipse cx="760" cy="380" rx="280" ry="160" fill="#ff7a3d" />
        <ellipse cx="520" cy="230" rx="180" ry="120" fill="#c026d3" opacity="0.6" />
      </g>
    </svg>
  );
}

function ScreenshotEditor() {
  const tools = ["select", "arrow", "line", "rect", "rectFill", "ellipse", "text", "mosaic", "spotlight", "counter", "pen", "marker"];
  const k = 640 / 740;
  const map = (x: number, y: number) => [110 + x * k, 214 + y * k] as const;
  const [chartX, chartY] = map(172, 222);
  const [checkX, checkY] = map(540, 222);
  const [pubX, pubY] = map(675, 365);
  const swatches: Array<[string, string]> = [
    ["#ff9a5a", "#ff3d77"],
    ["#5b8cff", "#a855f7"],
    ["#22d3ee", "#3b82f6"],
    ["#fde047", "#fb7185"],
    ["#34d399", "#0ea5e9"],
    ["#f472b6", "#8b5cf6"],
    ["#1f2937", "#4b5563"],
    ["#f5f5f4", "#d6d3d1"],
  ];

  return (
    <svg className="h-full w-full" viewBox="0 0 1180 740" aria-hidden="true" fontFamily={SYSTEM_FONT}>
      <defs>
        <linearGradient id="shot-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ff9a5a" />
          <stop offset="1" stopColor="#ff3d77" />
        </linearGradient>
        {swatches.map(([a, b], i) => (
          <linearGradient key={i} id={`shot-sw-${i}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={a} />
            <stop offset="1" stopColor={b} />
          </linearGradient>
        ))}
        <mask id="shot-spot">
          <rect x="60" y="164" width="740" height="460" fill="#fff" />
          <rect x={checkX - 8} y={checkY - 8} width={180 * k + 16} height={120 * k + 16} rx="12" fill="#000" />
        </mask>
        <filter id="shot-shadow" x="-20%" y="-20%" width="140%" height="160%">
          <feDropShadow dx="0" dy="18" stdDeviation="18" floodColor="#000" floodOpacity="0.35" />
        </filter>
      </defs>

      <rect x="0.5" y="0.5" width="1179" height="739" rx="14" fill="#1c1c1e" stroke="rgba(255,255,255,0.14)" />
      {/* header + annotation toolbar */}
      <line x1="0" y1="48" x2="1180" y2="48" stroke="rgba(255,255,255,0.08)" />
      <circle cx="22" cy="24" r="6" fill="#ff5f57" />
      <circle cx="42" cy="24" r="6" fill="#febc2e" />
      <circle cx="62" cy="24" r="6" fill="#28c840" />
      <text x="84" y="28" fontSize="12" fill="rgba(255,255,255,0.5)">Screenshot — 2,960×1,850</text>
      <g transform="translate(400 12)" stroke="rgba(255,255,255,0.82)" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
        {tools.map((tool, i) => {
          const x = i * 30;
          return (
            <g key={tool} transform={`translate(${x} 0)`}>
              {i === 1 && <rect x="-3" y="-1" width="26" height="26" rx="6" fill="var(--mg-accent)" stroke="none" />}
              {tool === "select" && <path d="M7 6 v12 l3 -3 l2.5 5 l2 -1 l-2.5 -5 h4 z" />}
              {tool === "arrow" && <path d="M5 19 L17 7 M10 7 h7 v7" stroke="#fff" />}
              {tool === "line" && <path d="M5 19 L17 7" />}
              {tool === "rect" && <rect x="4" y="7" width="14" height="11" rx="2" />}
              {tool === "rectFill" && <rect x="4" y="7" width="14" height="11" rx="2" fill="rgba(255,255,255,0.82)" />}
              {tool === "ellipse" && <ellipse cx="11" cy="12.5" rx="7.5" ry="5.5" />}
              {tool === "text" && <path d="M6 7 h10 M11 7 v12" />}
              {tool === "mosaic" && <path d="M5 7 h12 v12 h-12 z M5 13 h12 M11 7 v12" />}
              {tool === "spotlight" && <><circle cx="11" cy="13" r="4" /><path d="M11 4.5 v2 M3.5 13 h2 M16.5 13 h2" /></>}
              {tool === "counter" && <><circle cx="11" cy="12.5" r="7" /><path d="M10 10 l1.5 -1 v8" /></>}
              {tool === "pen" && <path d="M6 18 l2 -5 l8 -8 l3 3 l-8 8 z" />}
              {tool === "marker" && <path d="M6 18 h10 M8 15 l6 -9 l3 2 l-6 9 z" />}
            </g>
          );
        })}
      </g>
      <rect x="1006" y="12" width="64" height="24" rx="7" fill="rgba(255,255,255,0.1)" />
      <text x="1038" y="28.5" textAnchor="middle" fontSize="12" fill="rgba(255,255,255,0.88)">Copy</text>
      <rect x="1078" y="12" width="88" height="24" rx="7" fill="var(--mg-accent)" />
      <text x="1122" y="28.5" textAnchor="middle" fontSize="12" fontWeight="600" fill="#fff">Save</text>

      {/* canvas */}
      <rect x="0" y="48" width="860" height="691" fill="#141416" />
      <rect className="shot-frame" x="60" y="164" width="740" height="460" rx="18" fill="url(#shot-bg)" />
      <g filter="url(#shot-shadow)">
        <svg x="110" y="214" width="640" height={416 * k} viewBox="0 0 740 416">
          <RecordedApp idPrefix="shot" />
        </svg>
      </g>

      {/* annotations */}
      <rect className="shot-spotlight" x="60" y="164" width="740" height="460" rx="18" fill="#000" fillOpacity="0.45" mask="url(#shot-spot)" opacity="0" />
      <rect data-draw pathLength="1" className="shot-rect" x={chartX - 6} y={chartY - 6} width={356 * k + 12} height={120 * k + 12} rx="10" fill="none" stroke="#ff3b30" strokeWidth="3" />
      <path data-draw pathLength="1" className="shot-arrow" d={`M${pubX - 210} ${pubY + 74} C ${pubX - 140} ${pubY + 70}, ${pubX - 80} ${pubY + 50}, ${pubX - 46} ${pubY + 14}`} fill="none" stroke="#ff3b30" strokeWidth="3.5" strokeLinecap="round" />
      <path className="shot-arrowhead" d={`M${pubX - 46} ${pubY + 14} l-3 -15 m3 15 l-15 -2`} fill="none" stroke="#ff3b30" strokeWidth="3.5" strokeLinecap="round" opacity="0" />
      <g className="shot-counter" opacity="0">
        <circle cx={chartX - 6} cy={chartY - 6} r="13" fill="#ff3b30" stroke="#fff" strokeWidth="2" />
        <text x={chartX - 6} y={chartY - 1.5} textAnchor="middle" fontSize="13" fontWeight="700" fill="#fff">1</text>
      </g>
      <g className="shot-counter" opacity="0">
        <circle cx={pubX + 46} cy={pubY - 22} r="13" fill="#ff3b30" stroke="#fff" strokeWidth="2" />
        <text x={pubX + 46} y={pubY - 17.5} textAnchor="middle" fontSize="13" fontWeight="700" fill="#fff">2</text>
      </g>
      <text className="shot-text" x={pubX - 300} y={pubY + 82} fontSize="20" fontWeight="800" fill="#fff" opacity="0" style={{ paintOrder: "stroke" }} stroke="#ff3b30" strokeWidth="6" strokeLinejoin="round">Ship it!</text>

      {/* inspector */}
      <line x1="860" y1="48" x2="860" y2="740" stroke="rgba(255,255,255,0.08)" />
      <text x="880" y="84" fontSize="13" fontWeight="600" fill="rgba(255,255,255,0.88)">Background</text>
      {swatches.map((_, i) => {
        const x = 880 + (i % 4) * 72;
        const y = 102 + Math.floor(i / 4) * 52;
        return (
          <g key={i}>
            <rect x={x} y={y} width="62" height="42" rx="8" fill={`url(#shot-sw-${i})`} />
            {i === 0 && <rect x={x - 3} y={y - 3} width="68" height="48" rx="10" fill="none" stroke="var(--mg-accent)" strokeWidth="2" />}
          </g>
        );
      })}
      <text x="880" y="236" fontSize="11.5" fill="rgba(255,255,255,0.5)">Padding</text>
      <text x="1160" y="236" textAnchor="end" fontSize="11.5" fontWeight="600" fill="rgba(255,255,255,0.88)">48</text>
      <g transform="translate(-60 0)"><TraceSlider x={940} y={256} w={280} value={0.48} /></g>
      <text x="880" y="292" fontSize="11.5" fill="rgba(255,255,255,0.5)">Corner Radius</text>
      <text x="1160" y="292" textAnchor="end" fontSize="11.5" fontWeight="600" fill="rgba(255,255,255,0.88)">18</text>
      <g transform="translate(-60 0)"><TraceSlider x={940} y={312} w={280} value={0.36} /></g>
      <text x="880" y="348" fontSize="11.5" fill="rgba(255,255,255,0.5)">Shadow</text>
      <g transform="translate(-120 0)"><Toggle x={1250} y={335} /></g>
      <text x="880" y="384" fontSize="11.5" fill="rgba(255,255,255,0.5)">3D Tilt</text>
      <g transform="translate(-120 0)"><Toggle x={1250} y={371} on={false} /></g>
    </svg>
  );
}

/**
 * Scene: the real editor, rebuilt in vector. The view pins while the scroll
 * runs through five chapters — zoom, 3D zoom, lens, captions, screenshot —
 * on the same editor, so the line of sight never breaks.
 */
export function FeatureShowcase({ locale }: { locale: Locale }) {
  const copy = getShowcaseCopy(locale);
  const rootRef = useRef<HTMLElement>(null);
  const tokens = captionTokens(copy.captionSample);
  const third = Math.ceil(tokens.length / 3);
  const joiner = /\s/.test(copy.captionSample) ? " " : "";
  const captionClips = [0, 1, 2].map((i) => {
    const part = tokens.slice(i * third, (i + 1) * third).join(joiner);
    return part.length > 12 ? `${part.slice(0, 11)}…` : part;
  });

  useScene(rootRef, ({ q, gsap, reduced }) => {
    const items = q(".sc-item");
    const preview = q(".sc-preview")[0] as HTMLElement;
    const lens = q(".sc-lens")[0] as HTMLElement;
    const lensInner = q(".sc-lens-inner")[0] as HTMLElement;
    const cursor = q(".sc-cursor")[0];
    const lensCursor = q(".sc-lens-cursor")[0];
    const zoomValue = q(".val-zoom")[0];
    const hud = q(".sc-zoom-hud")[0];
    const playheadLabel = q(".ed-playhead-label")[0];
    const timeLabel = q(".ed-time")[0];

    const setActive = (index: number) => {
      items.forEach((item, i) => item.classList.toggle("is-active", i === index));
    };
    setActive(0);

    const cursorPos = { x: 300, y: 190 };
    const renderCursor = () => {
      gsap.set(cursor, { attr: { transform: `translate(${cursorPos.x} ${cursorPos.y})` } });
    };
    renderCursor();

    const lensState = { p: 0 };
    const renderLens = () => {
      const rect = preview.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      const sx = (SCREEN.x / PREVIEW.w) * w;
      const sy = (SCREEN.y / PREVIEW.h) * h;
      const sw = (SCREEN.w / PREVIEW.w) * w;
      const sh = (SCREEN.h / PREVIEW.h) * h;
      const mag = 2.1;
      const d = w * 0.21;
      // walk the lens path
      const seg = Math.min(LENS_PATH.length - 1.0001, lensState.p * (LENS_PATH.length - 1));
      const i = Math.floor(seg);
      const t = seg - i;
      const ease = t * t * (3 - 2 * t);
      const cx = LENS_PATH[i][0] + (LENS_PATH[i + 1][0] - LENS_PATH[i][0]) * ease;
      const cy = LENS_PATH[i][1] + (LENS_PATH[i + 1][1] - LENS_PATH[i][1]) * ease;
      cursorPos.x = cx;
      cursorPos.y = cy;
      renderCursor();
      const px = sx + (cx / SCREEN.w) * sw;
      const py = sy + (cy / SCREEN.h) * sh;
      lens.style.width = `${d}px`;
      lens.style.height = `${d}px`;
      lens.style.left = `${px - d / 2}px`;
      lens.style.top = `${py - d / 2}px`;
      lensInner.style.width = `${sw * mag}px`;
      lensInner.style.height = `${sh * mag}px`;
      lensInner.style.left = `${d / 2 - (cx / SCREEN.w) * sw * mag}px`;
      lensInner.style.top = `${d / 2 - (cy / SCREEN.h) * sh * mag}px`;
      lensCursor.setAttribute("transform", `translate(${cx} ${cy})`);
    };

    const fmt = (s: number) => `00:${String(Math.floor(s)).padStart(2, "0")}`;
    const playhead = { x: 200 };
    const renderPlayhead = () => {
      gsap.set(q(".ed-playhead"), { x: playhead.x });
      const seconds = ((playhead.x - 104) / 1150) * 66;
      if (playheadLabel) playheadLabel.textContent = fmt(seconds);
      if (timeLabel) timeLabel.textContent = `${fmt(seconds)} / 01:06`;
    };
    renderPlayhead();

    const zoom = { v: 1 };
    const renderZoom = () => {
      if (zoomValue) zoomValue.textContent = `${zoom.v.toFixed(2)}x`;
      if (hud) hud.textContent = `×${zoom.v.toFixed(2)}`;
      const fill = 0.2 + ((zoom.v - 1) / 1) * 0.3;
      gsap.set(q(".slider-zoom .ts-fill"), { attr: { width: 304 * fill } });
      gsap.set(q(".slider-zoom .ts-thumb"), { attr: { x: INSPECTOR_X + 18 + 304 * fill - 3 } });
    };

    gsap.set(q(".ed-captions > g"), { scaleX: 0, transformOrigin: "0% 50%" });
    gsap.set(q(".sc-word"), { opacity: 0.35 });

    if (reduced) {
      gsap.set(q(".ed-captions > g"), { scaleX: 1 });
      return;
    }

    const originX = ((SCREEN.x + TARGET.x) / PREVIEW.w) * 100;
    const originY = ((SCREEN.y + TARGET.y) / PREVIEW.h) * 100;

    const tl = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: {
        trigger: q(".sc-stage")[0],
        start: "top top",
        end: "+=650%",
        scrub: 0.8,
        pin: true,
        anticipatePin: 1,
      },
      // Runs on every render of the scrubbed timeline, including scrubbing back past the start.
      onUpdate: () => {
        const time = tl.time();
        let index = 0;
        CHAPTERS.forEach((start, i) => {
          if (time >= start) index = i;
        });
        setActive(index);
        gsap.set(q(".sc-progress"), { scaleY: tl.progress() });
      },
    });

    tl.to(q(".sc-head .mg-word"), { color: "var(--foreground)", stagger: 0.05, duration: 0.4 }, 0)

      // ---- 1. Zoom ----
      .to(cursorPos, { x: TARGET.x, y: TARGET.y, duration: 0.7, ease: "power2.inOut", onUpdate: renderCursor }, 0.2)
      .to(playhead, { x: 300, duration: 1.6, onUpdate: renderPlayhead }, 0.2)
      .to(q(".ed-zoom-0 rect"), { attr: { "stroke-width": 2.5 }, duration: 0.2 }, 0.8)
      .fromTo(q(".sc-ripple"), { attr: { r: 0 }, opacity: 0.9 }, { attr: { r: 26 }, opacity: 0, duration: 0.4 }, 0.9)
      .to(q(".sc-comp"), { scale: 2, xPercent: -(originX - 50) * 0.8, yPercent: -(originY - 50) * 0.8, transformOrigin: `${originX}% ${originY}%`, duration: 0.8, ease: "power3.inOut" }, 1)
      .to(zoom, { v: 2, duration: 0.8, ease: "power3.inOut", onUpdate: renderZoom }, 1)
      .to(hud, { opacity: 1, duration: 0.2 }, 1)
      .to(q(".sc-comp"), { scale: 1, xPercent: 0, yPercent: 0, duration: 0.6, ease: "power3.inOut" }, 1.9)
      .to(zoom, { v: 1, duration: 0.6, ease: "power3.inOut", onUpdate: renderZoom }, 1.9)
      .to(hud, { opacity: 0, duration: 0.2 }, 2.3)
      .to(q(".ed-zoom-0 rect"), { attr: { "stroke-width": 1 }, duration: 0.2 }, 2.2)

      // ---- 2. 3D zoom ----
      .to(q(".seg-mode .seg-thumb"), { attr: { x: SEG_X + SEG_W }, duration: 0.3, ease: "power2.inOut" }, 2.3)
      .to(q(".rows-2d"), { opacity: 0, duration: 0.25 }, 2.3)
      .to(q(".rows-3d"), { opacity: 1, duration: 0.25 }, 2.45)
      .to(q(".ed-zoom-1 rect"), { attr: { "stroke-width": 2.5 }, duration: 0.2 }, 2.4)
      .to(playhead, { x: 560, duration: 1.8, onUpdate: renderPlayhead }, 2.3)
      .to(q(".sc-screen"), { rotationY: -26, rotationX: 12, scale: 0.92, z: 0, duration: 1, ease: "power3.inOut" }, 2.6)
      .to(q(".pad-dot"), { attr: { cx: INSPECTOR_X + 110, cy: 296 }, duration: 1, ease: "power3.inOut" }, 2.6)
      .to(q(".sc-screen"), { rotationY: 18, rotationX: -8, scale: 1.05, duration: 0.8, ease: "power2.inOut" }, 3.5)
      .to(q(".pad-dot"), { attr: { cx: INSPECTOR_X + 236, cy: 336 }, duration: 0.8, ease: "power2.inOut" }, 3.5)
      .to(q(".sc-screen"), { rotationY: 0, rotationX: 0, scale: 1, z: 0, duration: 0.5, ease: "power2.inOut" }, 3.9)
      .to(q(".pad-dot"), { attr: { cx: INSPECTOR_X + 170, cy: 320 }, duration: 0.5 }, 3.9)
      .to(q(".ed-zoom-1 rect"), { attr: { "stroke-width": 1 }, duration: 0.2 }, 4.2)

      // ---- 3. Lens ----
      .to(q(".seg-mode .seg-thumb"), { attr: { x: SEG_X + SEG_W * 2 }, duration: 0.3, ease: "power2.inOut" }, 4.3)
      .to(q(".rows-3d"), { opacity: 0, duration: 0.25 }, 4.3)
      .to(q(".rows-lens"), { opacity: 1, duration: 0.25 }, 4.45)
      .to(q(".ed-zoom-2 rect"), { attr: { "stroke-width": 2.5 }, duration: 0.2 }, 4.4)
      .to(playhead, { x: 800, duration: 1.8, onUpdate: renderPlayhead }, 4.3)
      .call(renderLens, [], 4.4)
      .fromTo(lens, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.35, ease: "back.out(1.6)", immediateRender: false, onStart: renderLens }, 4.45)
      .to(lensState, { p: 1, duration: 1.4, ease: "power1.inOut", onUpdate: renderLens }, 4.6)
      .to(lens, { scale: 0, opacity: 0, duration: 0.3, ease: "power2.in" }, 6)
      .to(q(".ed-zoom-2 rect"), { attr: { "stroke-width": 1 }, duration: 0.2 }, 6.2)

      // ---- 4. Captions ----
      .to(q(".insp-zoom"), { opacity: 0, x: -12, duration: 0.3 }, 6.25)
      .to(q(".insp-captions"), { opacity: 1, duration: 0.3 }, 6.4)
      .to(q(".ed-label-6"), { attr: { fill: "rgba(255,255,255,0.88)" }, duration: 0.2 }, 6.3)
      .to(q(".ed-captions > g"), { scaleX: 1, stagger: 0.15, duration: 0.4, ease: "power2.out" }, 6.4)
      .to(playhead, { x: 1180, duration: 1.8, onUpdate: renderPlayhead }, 6.4)
      .fromTo(q(".sc-caption"), { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.3, immediateRender: false }, 6.6)
      .to(q(".sc-word"), { opacity: 1, stagger: 1.2 / tokens.length, duration: 0.15 }, 6.8)

      // ---- 5. Screenshot ----
      .fromTo(q(".sc-flash"), { opacity: 0 }, { opacity: 0.95, duration: 0.12, immediateRender: false }, 8.2)
      .to(q(".sc-flash"), { opacity: 0, duration: 0.3 }, 8.32)
      .to(q(".sc-dim"), { opacity: 1, duration: 0.4 }, 8.4)
      .fromTo(q(".sc-shot"), { opacity: 0, scale: 0.92, y: 24 }, { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: "power3.out", immediateRender: false }, 8.4)
      .to(q(".shot-spotlight"), { opacity: 1, duration: 0.4 }, 9)
      .to(q(".shot-rect"), { strokeDashoffset: 0, duration: 0.5, ease: "power2.inOut" }, 9.2)
      .fromTo(q(".shot-counter"), { opacity: 0, scale: 0.3, transformOrigin: "50% 50%" }, { opacity: 1, scale: 1, stagger: 0.4, duration: 0.25, ease: "back.out(2)", immediateRender: false }, 9.5)
      .to(q(".shot-arrow"), { strokeDashoffset: 0, duration: 0.5, ease: "power2.inOut" }, 9.7)
      .to(q(".shot-arrowhead"), { opacity: 1, duration: 0.1 }, 10.15)
      .to(q(".shot-text"), { opacity: 1, duration: 0.25 }, 10.2)
      .to({}, { duration: 0.6 });

    gsap.set(q(".sc-shot"), { opacity: 0 });
    gsap.set(lens, { opacity: 0, scale: 0 });
  }, [locale]);

  return (
    <section ref={rootRef} id="showcase" className="mg-scene">
      <div className="sc-stage relative flex min-h-[100svh] items-center overflow-hidden py-20 lg:h-[100svh] lg:py-0">
        <div className="mx-auto grid w-full max-w-[1440px] items-center gap-8 px-6 md:px-10 lg:grid-cols-[minmax(300px,0.32fr)_1fr] lg:gap-12">
          {/* chapter list */}
          <div className="sc-head">
            <span className="mg-label mg-index mb-5">{copy.eyebrow}</span>
            <h2 className="mg-h2 mt-4 !text-[clamp(1.9rem,3.2vw,3.25rem)]"><FillText text={copy.title} /></h2>
            <div className="relative mt-8 pl-5">
              <span className="absolute left-0 top-1 bottom-1 w-px bg-border" aria-hidden="true" />
              <span className="sc-progress absolute left-0 top-1 bottom-1 w-px origin-top scale-y-0 bg-[var(--mg-accent)]" aria-hidden="true" />
              <ol className="space-y-1">
                {showcaseFeatureOrder.map((key, index) => {
                  const item = copy.items[key];
                  return (
                    <li key={key} className="sc-item">
                      <div className="flex items-baseline gap-3 py-1.5">
                        <span className="mg-label tabular-nums">{String(index + 1).padStart(2, "0")}</span>
                        <h3 className="sc-item-label mg-h3">{item.label}</h3>
                      </div>
                      <div className="sc-detail">
                        <div className="overflow-hidden">
                          <p className="pb-3 pt-1 text-[15px] font-semibold text-foreground">{item.title}</p>
                          <p className="pb-4 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </div>
          </div>

          {/* editor */}
          <div className="sc-editor relative mx-auto w-full max-w-[min(100%,calc((100svh-120px)*1.6))]" style={{ aspectRatio: `${EDITOR_W} / ${EDITOR_H}` }}>
            <div className="theme-dark absolute inset-0 overflow-hidden rounded-[1.1%/1.75%] shadow-elevated">
              <svg className="absolute inset-0 h-full w-full" viewBox={`0 0 ${EDITOR_W} ${EDITOR_H}`} aria-hidden="true">
                <EditorChrome captionClips={captionClips} />
                <ZoomInspector />
                <CaptionsInspector />
              </svg>

              {/* preview */}
              <div
                className="sc-preview absolute overflow-hidden"
                style={{
                  left: 0,
                  top: `${(PREVIEW.y / EDITOR_H) * 100}%`,
                  width: `${(PREVIEW.w / EDITOR_W) * 100}%`,
                  height: `${(PREVIEW.h / EDITOR_H) * 100}%`,
                  perspective: "1100px",
                }}
              >
                <div className="sc-comp absolute inset-0" style={{ transformStyle: "preserve-3d" }}>
                  <Wallpaper />
                  <div
                    className="sc-screen absolute overflow-hidden rounded-[1.4%/2.4%] shadow-[0_20px_50px_rgba(0,0,0,0.45)]"
                    style={{
                      left: `${(SCREEN.x / PREVIEW.w) * 100}%`,
                      top: `${(SCREEN.y / PREVIEW.h) * 100}%`,
                      width: `${(SCREEN.w / PREVIEW.w) * 100}%`,
                      height: `${(SCREEN.h / PREVIEW.h) * 100}%`,
                    }}
                  >
                    <svg className="h-full w-full" viewBox={`0 0 ${SCREEN.w} ${SCREEN.h}`} aria-hidden="true">
                      <RecordedApp idPrefix="sc" />
                      <circle className="sc-ripple" cx={TARGET.x} cy={TARGET.y} r="0" fill="none" stroke="#0a84ff" strokeWidth="2.5" opacity="0" />
                      <g className="sc-cursor"><CursorArrow scale={1.3} /></g>
                    </svg>
                  </div>
                </div>

                {/* glass loupe */}
                <div className="sc-lens pointer-events-none absolute overflow-hidden rounded-full opacity-0">
                  <div className="sc-lens-inner absolute">
                    <svg className="h-full w-full" viewBox={`0 0 ${SCREEN.w} ${SCREEN.h}`} aria-hidden="true">
                      <rect width={SCREEN.w} height={SCREEN.h} fill="#fbfbfd" />
                      <RecordedApp idPrefix="lens" />
                      <g className="sc-lens-cursor"><CursorArrow scale={1.3} /></g>
                    </svg>
                  </div>
                  <span className="sc-lens-rim" aria-hidden="true" />
                </div>

                {/* read-along caption */}
                <div className="sc-caption pointer-events-none absolute inset-x-0 bottom-[7%] flex justify-center opacity-0">
                  <p className="sc-caption-pill" style={{ fontFamily: SYSTEM_FONT }}>
                    {tokens.map((token, i) => (
                      <span key={i} className="sc-word">{token}{/\s/.test(copy.captionSample) ? " " : ""}</span>
                    ))}
                  </p>
                </div>

                <div className="sc-zoom-hud pointer-events-none absolute right-[2%] top-[3%] rounded-md bg-black/50 px-2 py-1 text-[11px] font-semibold tabular-nums text-white opacity-0 backdrop-blur" style={{ fontFamily: MONO_FONT }}>×1.00</div>
                <div className="sc-flash pointer-events-none absolute inset-0 bg-white opacity-0" />
              </div>

              <div className="sc-dim pointer-events-none absolute inset-0 bg-black/45 opacity-0" />
              {/* screenshot editor window */}
              <div className="sc-shot absolute inset-[3%_4%] opacity-0 drop-shadow-[0_30px_60px_rgba(0,0,0,0.5)]">
                <ScreenshotEditor />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
