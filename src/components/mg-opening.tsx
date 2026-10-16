"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "lucide-react";
import { appStoreUrl } from "../lib/i18n";
import type { Locale } from "../lib/i18n";
import type { HeaderCopy, HeroCopy } from "../lib/translations";
import { SiteHeader } from "./site-header";

type Props = {
  copy: HeroCopy;
  currentPath?: string;
  headerCopy: HeaderCopy;
  languageLabel: string;
  locale: Locale;
};

/* Stage coordinates (SVG viewBox 1600 × 1000) */
const W = 1600;
const H = 1000;
const MID = 470;
const FRAME = { x: 320, y: 170, w: 960, h: 600 };
const CLICK = { x: 1068, y: 677 };
const TIMELINE = { x: 160, y: 820, w: 1280, h: 92 };
const WORDMARK = "SCREENCAM".split("");
const LANE = { x0: 60, x1: 1540 };
const WAVE_BARS = Array.from({ length: 149 }, (_, i) => LANE.x0 + 4 + i * 10);
const RULER = Array.from({ length: 75 }, (_, i) => LANE.x0 + i * 20);
const ZOOM_SEGMENTS: Array<[number, number]> = [[230, 380], [610, 720], [930, 1110], [1290, 1400]];
const LOOP_SECONDS = 16;

/**
 * The opening is one scroll-scrubbed motion graphic:
 * wordmark → a timeline hairline is cut open into a screen → the UI draws
 * itself → the cursor clicks and the camera zooms in → the screen collapses
 * back into the editor timeline while the headline fills in.
 * Everything is vector so it stays sharp at any zoom.
 */
export function MgOpening({ copy, currentPath = "/", headerCopy, languageLabel, locale }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const timecodeRef = useRef<HTMLSpanElement>(null);
  const zoomRef = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    gsap.registerPlugin(ScrollTrigger);

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(root);
      if (reduceMotion) {
        gsap.set(q("[data-draw]"), { strokeDashoffset: 0 });
        gsap.set(q(".mg-letter"), { yPercent: -120, opacity: 0 });
        gsap.set(q("[data-final], .mg-headline-wrap"), { opacity: 1, y: 0 });
        gsap.set(q(".mg-ui"), { opacity: 0 });
        gsap.set(q(".mg-word"), { color: "var(--foreground)" });
        return;
      }

      // ---------- Ambient "recording" loop that plays before any scroll ----------
      const bars = q(".mg-bar") as SVGLineElement[];
      const playhead = q(".mg-play")[0] as SVGGElement | undefined;
      const recClip = q(".mg-rec-clip")[0] as SVGRectElement | undefined;
      const zoomClips = q(".mg-zoom-seg") as SVGRectElement[];
      const cursor = q(".mg-amb-cursor")[0] as SVGGElement | undefined;
      const trail = q(".mg-amb-trail")[0] as SVGPolylineElement | undefined;
      const phases = bars.map((_, i) => [Math.random() * 6, 0.8 + Math.random() * 2.2, Math.sin(i * 0.37) * 0.5 + 0.5]);
      const trailPoints: Array<[number, number, number]> = [];
      let ambientOn = true;
      let lastClick = 0;
      const startTime = performance.now();

      const ambient = () => {
        if (!ambientOn) return;
        const t = (performance.now() - startTime) / 1000;
        const loop = (t % LOOP_SECONDS) / LOOP_SECONDS;
        const playX = LANE.x0 + loop * (LANE.x1 - LANE.x0);

        playhead?.setAttribute("transform", `translate(${playX} 0)`);
        recClip?.setAttribute("width", String(Math.max(0, playX - LANE.x0)));
        zoomClips.forEach((clip, i) => {
          const [a, b] = ZOOM_SEGMENTS[i];
          clip.setAttribute("width", String(Math.min(b - a, Math.max(0, playX - a))));
        });

        // waveform: recorded bars settle, the live edge jumps
        bars.forEach((bar, i) => {
          const x = WAVE_BARS[i];
          const [phase, speed, shape] = phases[i];
          const recorded = x < playX;
          const live = Math.max(0, 1 - Math.abs(x - playX) / 90);
          const energy = recorded ? 0.25 + 0.75 * Math.abs(Math.sin(phase + x * 0.021)) * (0.4 + shape * 0.6) : 0.06;
          const h = 4 + 34 * energy + 22 * live * Math.abs(Math.sin(t * speed * 3 + phase));
          bar.setAttribute("y1", String(MID - 10 - h));
        });

        // a cursor wanders, leaves a motion trail and clicks now and then
        const cx = 800 + 560 * Math.sin(t * 0.33) * Math.cos(t * 0.11);
        const cy = 700 + 70 * Math.sin(t * 0.67 + 1.2);
        cursor?.setAttribute("transform", `translate(${cx} ${cy})`);
        // trail keeps the last 0.35s, so it looks the same at any frame rate
        trailPoints.push([cx, cy, t]);
        while (trailPoints.length && t - trailPoints[0][2] > 0.35) trailPoints.shift();
        trail?.setAttribute("points", trailPoints.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" "));
        if (t - lastClick > 3.4) {
          lastClick = t;
          gsap.fromTo(q(".mg-amb-ripple"), { attr: { cx, cy, r: 2 }, opacity: 0.9 }, { attr: { r: 30 }, opacity: 0, duration: 0.7, ease: "power2.out" });
          gsap.fromTo(q(".mg-amb-region"), { attr: { x: cx - 90, y: cy - 34 }, opacity: 0, scale: 1.25, svgOrigin: `${cx} ${cy}` }, { opacity: 1, scale: 1, duration: 0.45, ease: "power3.out", yoyo: true, repeat: 1, repeatDelay: 1.1 });
        }

        if (timecodeRef.current) {
          const frames = Math.floor(t * 30);
          timecodeRef.current.textContent = `00:${String(Math.floor(frames / 1800) % 60).padStart(2, "0")}:${String(Math.floor(frames / 30) % 60).padStart(2, "0")}:${String(frames % 30).padStart(2, "0")}`;
        }
      };
      gsap.ticker.add(ambient);

      // wordmark rises in on load (inner spans, so the scroll tween owns the outer ones)
      gsap.from(q(".mg-letter-in"), { yPercent: 45, opacity: 0, filter: "blur(10px)", duration: 1.1, stagger: 0.05, ease: "expo.out", delay: 0.1, clearProps: "filter" });
      gsap.from(q(".mg-ambient"), { opacity: 0, duration: 1, delay: 0.5 });

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: q(".mg-pin")[0],
          start: "top top",
          end: "+=520%",
          scrub: 0.8,
          pin: true,
          anticipatePin: 1,
          // hand-off: the next scene draws the same strip on the same frame
          onLeave: () => gsap.set(q(".mg-handoff"), { autoAlpha: 0 }),
          onEnterBack: () => gsap.set(q(".mg-handoff"), { autoAlpha: 1 }),
          onRefresh: (self) => gsap.set(q(".mg-handoff"), { autoAlpha: self.scroll() > self.end ? 0 : 1 }),
          onUpdate: (self) => {
            ambientOn = self.progress < 0.12;
            if (ambientOn) return;
            const frames = Math.floor(self.progress * 30 * 42);
            const s = Math.floor(frames / 30);
            if (timecodeRef.current) {
              timecodeRef.current.textContent = `00:00:${String(s).padStart(2, "0")}:${String(frames % 30).padStart(2, "0")}`;
            }
          },
        },
      });

      // 0 → 1 : wordmark condenses and lifts away, labels fade
      tl.to(q(".mg-letter"), {
        yPercent: -130,
        opacity: 0,
        fontVariationSettings: "'wdth' 62, 'wght' 800",
        stagger: 0.06,
        duration: 1,
        ease: "power2.in",
      }, 0)
        .to(q(".mg-intro"), { opacity: 0, y: -16, duration: 0.6 }, 0.1)
        .to(q(".mg-ambient"), { scaleY: 0, svgOrigin: `800 ${MID}`, duration: 0.9, ease: "power3.in" }, 0)
        .to(q(".mg-ambient"), { opacity: 0, duration: 0.3 }, 0.7)
        .to(q(".mg-amb-cursor-layer"), { opacity: 0, duration: 0.4 }, 0)

        // 1 → 2.2 : the hairline is cut open into a screen
        .to(q(".mg-edge-top"), { attr: { y1: FRAME.y, y2: FRAME.y, x1: FRAME.x, x2: FRAME.x + FRAME.w }, duration: 1.2, ease: "power3.inOut" }, 0.9)
        .to(q(".mg-edge-bottom"), { attr: { y1: FRAME.y + FRAME.h, y2: FRAME.y + FRAME.h, x1: FRAME.x, x2: FRAME.x + FRAME.w }, duration: 1.2, ease: "power3.inOut" }, 0.9)
        .to(q(".mg-edge-left"), { attr: { y1: FRAME.y, y2: FRAME.y + FRAME.h }, duration: 1.2, ease: "power3.inOut" }, 0.9)
        .to(q(".mg-edge-right"), { attr: { y1: FRAME.y, y2: FRAME.y + FRAME.h }, duration: 1.2, ease: "power3.inOut" }, 0.9)
        .to(q(".mg-cut"), { attr: { r: 0 }, opacity: 0, duration: 0.4 }, 0.9)

        // 2 → 3.6 : the interface draws itself
        .to(q(".mg-ui [data-draw]"), { strokeDashoffset: 0, duration: 0.55, stagger: 0.022, ease: "power2.inOut" }, 2)
        .to(q(".mg-fill"), { opacity: 1, duration: 0.6, stagger: 0.05 }, 3)
        .to(q(".mg-grid"), { opacity: 0.35, duration: 0.5, stagger: 0.05 }, 2.8)

        // 3.6 → 4.6 : cursor travels and clicks
        .fromTo(q(".mg-cursor"), { opacity: 0, x: 380, y: 260 }, { opacity: 1, x: 0, y: 0, duration: 1, ease: "power2.inOut" }, 3.5)
        .fromTo(q(".mg-ripple"), { attr: { r: 0 }, opacity: 0.9 }, { attr: { r: 46 }, opacity: 0, duration: 0.5 }, 4.45)
        .to(q(".mg-target"), { fill: "var(--mg-accent)", stroke: "var(--mg-accent)", duration: 0.2 }, 4.45)
        .to(q(".mg-btn-label"), { opacity: 1, duration: 0.2 }, 4.5)

        // 4.6 → 6 : the camera zooms into the click — ScreenCam's directed zoom
        .to(q(".mg-ui"), {
          scale: 2.6,
          svgOrigin: `${CLICK.x} ${CLICK.y}`,
          x: FRAME.x + FRAME.w / 2 - CLICK.x,
          y: FRAME.y + FRAME.h / 2 - CLICK.y,
          duration: 1.4,
          ease: "power3.inOut",
          onUpdate() {
            const s = gsap.getProperty(q(".mg-ui")[0], "scale") as number;
            if (zoomRef.current) zoomRef.current.textContent = `×${s.toFixed(2)}`;
          },
        }, 4.7)
        .fromTo(q(".mg-speed"), { opacity: 0, scaleX: 0.2 }, { opacity: 0.9, scaleX: 1, duration: 0.5, stagger: 0.04, transformOrigin: "50% 50%" }, 4.8)
        .to(q(".mg-speed"), { opacity: 0, duration: 0.5 }, 5.5)
        .to(q(".mg-zoom-hud"), { opacity: 1, duration: 0.3 }, 4.7)
        .to(q(".mg-region"), { opacity: 1, duration: 0.3 }, 4.6)
        .to(q(".mg-region"), { opacity: 0, duration: 0.3 }, 6.1)

        // 6.2 → 7.4 : zoom back out
        .to(q(".mg-ui"), {
          scale: 1,
          x: 0,
          y: 0,
          duration: 1.1,
          ease: "power3.inOut",
          onUpdate() {
            const s = gsap.getProperty(q(".mg-ui")[0], "scale") as number;
            if (zoomRef.current) zoomRef.current.textContent = `×${s.toFixed(2)}`;
          },
        }, 6.3)
        .to(q(".mg-zoom-hud"), { opacity: 0, duration: 0.3 }, 7.2)

        // 7.4 → 8.8 : the screen collapses into the editor timeline
        .to(q(".mg-ui"), { opacity: 0, duration: 0.5 }, 7.5)
        .to(q(".mg-edge-top"), { attr: { y1: TIMELINE.y, y2: TIMELINE.y, x1: TIMELINE.x, x2: TIMELINE.x + TIMELINE.w }, duration: 1.2, ease: "power3.inOut" }, 7.6)
        .to(q(".mg-edge-bottom"), { attr: { y1: TIMELINE.y + TIMELINE.h, y2: TIMELINE.y + TIMELINE.h, x1: TIMELINE.x, x2: TIMELINE.x + TIMELINE.w }, duration: 1.2, ease: "power3.inOut" }, 7.6)
        .to(q(".mg-edge-left"), { attr: { x1: TIMELINE.x, x2: TIMELINE.x, y1: TIMELINE.y, y2: TIMELINE.y + TIMELINE.h }, duration: 1.2, ease: "power3.inOut" }, 7.6)
        .to(q(".mg-edge-right"), { attr: { x1: TIMELINE.x + TIMELINE.w, x2: TIMELINE.x + TIMELINE.w, y1: TIMELINE.y, y2: TIMELINE.y + TIMELINE.h }, duration: 1.2, ease: "power3.inOut" }, 7.6)
        .fromTo(q(".mg-clip"), { scaleX: 0, transformOrigin: "0% 50%" }, { scaleX: 1, duration: 0.6, stagger: 0.12, ease: "power2.out" }, 8.4)
        .set(q(".mg-playhead"), { opacity: 1 }, 8.6)
        .to(q(".mg-playhead"), { attr: { x1: TIMELINE.x + TIMELINE.w, x2: TIMELINE.x + TIMELINE.w }, duration: 2.6 }, 8.6)

        // 8.4 → 10.4 : headline fills in word by word, CTA lands
        .to(q(".mg-headline-wrap"), { opacity: 1, duration: 0.3 }, 8.3)
        .to(q(".mg-word"), { color: "var(--foreground)", duration: 0.35, stagger: 0.22 }, 8.6)
        .fromTo(q("[data-final]"), { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.15, ease: "power2.out" }, 9.6)
        .to({}, { duration: 0.8 });
    }, root);

    const refresh = window.requestAnimationFrame(() => {
      ScrollTrigger.sort();
      ScrollTrigger.refresh();
    });
    return () => {
      window.cancelAnimationFrame(refresh);
      ctx.revert();
      ctx.kill();
    };
  }, []);

  const words = copy.titleLines.flat().flatMap((part) => part.split(" "));

  return (
    <section ref={rootRef} className="mg relative bg-background">
      <SiteHeader copy={headerCopy} currentPath={currentPath} languageLabel={languageLabel} locale={locale} />

      <div className="mg-pin relative h-[100svh] overflow-hidden">
        {/* Wordmark */}
        <div className="mg-wordmark pointer-events-none absolute inset-x-0 top-[12vh] flex justify-center overflow-hidden px-[2vw]" aria-hidden="true">
          {WORDMARK.map((letter, index) => (
            <span key={index} className="mg-letter inline-block">
              <span className="mg-letter-in inline-block">{letter}</span>
            </span>
          ))}
        </div>

        {/* Stage */}
        <svg
          className="absolute inset-0 h-full w-full text-foreground"
          viewBox={`0 0 ${W} ${H}`}
          preserveAspectRatio="xMidYMid meet"
          aria-hidden="true"
        >
          <defs>
            <clipPath id="mg-frame-clip">
              <rect x={FRAME.x} y={FRAME.y} width={FRAME.w} height={FRAME.h} rx="2" />
            </clipPath>
          </defs>

          {/* Interface line drawing, clipped by the screen */}
          <g clipPath="url(#mg-frame-clip)">
            <g className="mg-ui" fill="none" stroke="currentColor" strokeWidth="1.25" vectorEffect="non-scaling-stroke">
              {/* menu bar */}
              <line data-draw pathLength="1" x1={FRAME.x} y1={FRAME.y + 26} x2={FRAME.x + FRAME.w} y2={FRAME.y + 26} />
              <rect data-draw pathLength="1" x={FRAME.x + 18} y={FRAME.y + 9} width="14" height="9" rx="2" />
              {[60, 110, 150, 196].map((x) => (
                <line key={x} data-draw pathLength="1" x1={FRAME.x + x} y1={FRAME.y + 13} x2={FRAME.x + x + 30} y2={FRAME.y + 13} />
              ))}
              <circle data-draw pathLength="1" cx={FRAME.x + FRAME.w - 30} cy={FRAME.y + 13} r="5" />

              {/* window */}
              <rect data-draw pathLength="1" x="380" y="230" width="840" height="510" rx="14" />
              <line data-draw pathLength="1" x1="380" y1="268" x2="1220" y2="268" />
              {[402, 422, 442].map((cx) => (
                <circle key={cx} data-draw pathLength="1" cx={cx} cy="249" r="5.5" />
              ))}
              <rect data-draw pathLength="1" x="690" y="241" width="220" height="16" rx="8" />

              {/* sidebar */}
              <line data-draw pathLength="1" x1="560" y1="268" x2="560" y2="740" />
              {[300, 332, 364, 396, 452, 484].map((y, i) => (
                <g key={y}>
                  <rect data-draw pathLength="1" x="400" y={y - 6} width="12" height="12" rx="3" />
                  <line data-draw pathLength="1" x1="424" y1={y} x2={i === 1 ? 530 : 500} y2={y} />
                </g>
              ))}
              <rect className="mg-fill" x="392" y="322" width="150" height="20" rx="6" fill="var(--mg-accent)" fillOpacity="0.14" stroke="none" opacity="0" />

              {/* content header */}
              <line data-draw pathLength="1" x1="592" y1="306" x2="800" y2="306" strokeWidth="3" />
              <line data-draw pathLength="1" x1="592" y1="330" x2="940" y2="330" />

              {/* chart card */}
              <rect data-draw pathLength="1" x="592" y="360" width="596" height="180" rx="12" />
              <path data-draw pathLength="1" d="M612 510 C 680 500, 700 420, 770 440 S 880 500, 950 430 S 1060 380, 1170 400" />
              <path className="mg-fill" d="M612 510 C 680 500, 700 420, 770 440 S 880 500, 950 430 S 1060 380, 1170 400 L 1170 530 L 612 530 Z" fill="var(--mg-accent)" fillOpacity="0.08" stroke="none" opacity="0" />
              {[0, 1, 2, 3].map((i) => (
                <line key={i} className="mg-grid" x1="612" y1={390 + i * 36} x2="1170" y2={390 + i * 36} strokeDasharray="2 6" opacity="0" vectorEffect="non-scaling-stroke" />
              ))}

              {/* cards */}
              <rect data-draw pathLength="1" x="592" y="562" width="180" height="156" rx="12" />
              <rect data-draw pathLength="1" x="790" y="562" width="180" height="156" rx="12" />
              <rect data-draw pathLength="1" x="988" y="562" width="200" height="156" rx="12" />
              {[592, 790].map((x) => (
                <g key={x}>
                  <circle data-draw pathLength="1" cx={x + 30} cy="594" r="12" />
                  <line data-draw pathLength="1" x1={x + 20} y1="640" x2={x + 150} y2="640" />
                  <line data-draw pathLength="1" x1={x + 20} y1="662" x2={x + 110} y2="662" />
                </g>
              ))}
              <line data-draw pathLength="1" x1="1008" y1="586" x2="1120" y2="586" strokeWidth="3" />
              <line data-draw pathLength="1" x1="1008" y1="610" x2="1160" y2="610" opacity="0.5" />
              {/* detail inside the target card — it is what the camera lands on */}
              <path data-draw pathLength="1" d="M1008 640 L1030 632 L1050 638 L1072 622 L1094 628 L1116 614 L1138 620 L1166 604" />
              {[1150, 1162, 1174].map((cx, i) => (
                <circle key={cx} className="mg-fill" cx={cx} cy="586" r="3" fill={i === 0 ? "var(--mg-accent)" : "currentColor"} stroke="none" opacity="0" />
              ))}
              <line data-draw pathLength="1" x1="1140" y1="677" x2="1172" y2="677" opacity="0.5" />
              {/* the button that gets clicked */}
              <rect className="mg-target" data-draw pathLength="1" x="1008" y="660" width="120" height="34" rx="17" fill="transparent" />
              <path className="mg-btn-label" d="M1024 670 l9 7 l-9 7 z" fill="#fff" stroke="none" opacity="0" />
              <line className="mg-btn-label" x1="1042" y1="677" x2="1100" y2="677" stroke="#fff" strokeWidth="2" strokeLinecap="round" opacity="0" vectorEffect="non-scaling-stroke" />
              <circle className="mg-ripple" cx={CLICK.x - 4} cy={CLICK.y} r="0" stroke="var(--mg-accent)" strokeWidth="2" vectorEffect="non-scaling-stroke" />

              {/* zoom region selector — lives in the UI so it zooms with it */}
              <rect className="mg-region" x={CLICK.x - 84} y={CLICK.y - 34} width="168" height="68" rx="8" fill="var(--mg-accent)" fillOpacity="0.05" stroke="var(--mg-accent)" strokeWidth="1.5" opacity="0" vectorEffect="non-scaling-stroke" />
              {/* cursor */}
              <g className="mg-cursor" opacity="0">
                <path
                  d={`M${CLICK.x - 4} ${CLICK.y - 2} l0 30 l8 -8 l6 13 l5 -2 l-6 -13 l11 0 z`}
                  fill="var(--background)"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                  vectorEffect="non-scaling-stroke"
                />
              </g>
            </g>

            {/* motion-blur speed lines while the camera moves */}
            <g stroke="currentColor" strokeWidth="1" vectorEffect="non-scaling-stroke">
              {[250, 300, 360, 430, 520, 600, 680, 730].map((y, i) => (
                <line key={y} className="mg-speed" x1={FRAME.x + 40 + (i % 3) * 60} y1={y} x2={FRAME.x + FRAME.w - 60 - (i % 2) * 90} y2={y} opacity="0" vectorEffect="non-scaling-stroke" />
              ))}
            </g>
          </g>

          {/* zoom region selector around the click */}

          {/* Ambient recording timeline: ruler, live waveform, clips, playhead */}
          <g className="mg-ambient">
            <g className="text-foreground/45" stroke="currentColor" strokeWidth="1" vectorEffect="non-scaling-stroke">
              {RULER.map((x, i) => (
                <line key={x} x1={x} y1={MID} x2={x} y2={MID + (i % 5 === 0 ? 12 : 6)} vectorEffect="non-scaling-stroke" />
              ))}
            </g>
            {RULER.filter((_, i) => i % 10 === 0).map((x, i) => (
              <text key={x} x={x + 4} y={MID + 26} className="fill-muted-foreground font-mono" fontSize="11" letterSpacing="1">
                {`00:${String(i * 2).padStart(2, "0")}`}
              </text>
            ))}
            <g stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="text-foreground/70">
              {WAVE_BARS.map((x) => (
                <line key={x} className="mg-bar" x1={x} y1={MID - 14} x2={x} y2={MID - 10} />
              ))}
            </g>
            {/* recording lane */}
            <rect x={LANE.x0} y={MID + 40} width={LANE.x1 - LANE.x0} height="26" rx="6" fill="none" stroke="currentColor" strokeOpacity="0.15" strokeWidth="1" vectorEffect="non-scaling-stroke" />
            <rect className="mg-rec-clip" x={LANE.x0} y={MID + 40} width="0" height="26" rx="6" fill="currentColor" fillOpacity="0.08" stroke="currentColor" strokeOpacity="0.55" strokeWidth="1" vectorEffect="non-scaling-stroke" />
            {/* zoom lane */}
            {ZOOM_SEGMENTS.map(([a], i) => (
              <rect key={a} className="mg-zoom-seg" x={a} y={MID + 74} width="0" height="18" rx="5" fill="var(--mg-accent)" fillOpacity={i % 2 ? 0.55 : 1} />
            ))}
            {/* playhead */}
            <g className="mg-play" transform={`translate(${LANE.x0} 0)`}>
              <line x1="0" y1={MID - 70} x2="0" y2={MID + 100} stroke="var(--mg-accent)" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
              <path d={`M-6 ${MID - 78} h12 v6 l-6 6 l-6 -6 z`} fill="var(--mg-accent)" />
            </g>
          </g>

          {/* Ambient cursor with a motion trail */}
          <g className="mg-amb-cursor-layer">
            <polyline className="mg-amb-trail" points="" fill="none" stroke="currentColor" strokeOpacity="0.25" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
            <rect className="mg-amb-region" x="0" y="0" width="180" height="68" rx="8" fill="var(--mg-accent)" fillOpacity="0.06" stroke="var(--mg-accent)" strokeWidth="1.5" opacity="0" vectorEffect="non-scaling-stroke" />
            <circle className="mg-amb-ripple" cx="0" cy="0" r="0" fill="none" stroke="var(--mg-accent)" strokeWidth="1.5" opacity="0" vectorEffect="non-scaling-stroke" />
            <g className="mg-amb-cursor">
              <path d="M0 0 l0 26 l7 -7 l5 11 l4 -2 l-5 -11 l10 0 z" fill="var(--background)" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
            </g>
          </g>

          {/* Screen edges: start as one hairline across the stage */}
          <g className="mg-handoff" stroke="currentColor" strokeWidth="1.5" vectorEffect="non-scaling-stroke">
            <line className="mg-edge-top" x1="0" y1={MID} x2={W} y2={MID} vectorEffect="non-scaling-stroke" />
            <line className="mg-edge-bottom" x1="0" y1={MID} x2={W} y2={MID} vectorEffect="non-scaling-stroke" />
            <line className="mg-edge-left" x1={FRAME.x} y1={MID} x2={FRAME.x} y2={MID} vectorEffect="non-scaling-stroke" />
            <line className="mg-edge-right" x1={FRAME.x + FRAME.w} y1={MID} x2={FRAME.x + FRAME.w} y2={MID} vectorEffect="non-scaling-stroke" />
          </g>
          <circle className="mg-cut" cx={W / 2} cy={MID} r="5" fill="var(--mg-accent)" />

          {/* Editor timeline clips (appear when the screen collapses) */}
          <g className="mg-handoff">
            <rect className="mg-clip" x={TIMELINE.x + 24} y={TIMELINE.y + 16} width="1232" height="24" rx="5" fill="none" stroke="currentColor" strokeWidth="1.25" vectorEffect="non-scaling-stroke" />
            <rect className="mg-clip" x={TIMELINE.x + 420} y={TIMELINE.y + 52} width="300" height="24" rx="5" fill="var(--mg-accent)" />
            <rect className="mg-clip" x={TIMELINE.x + 860} y={TIMELINE.y + 52} width="180" height="24" rx="5" fill="var(--mg-accent)" fillOpacity="0.55" />
            <line className="mg-playhead" x1={TIMELINE.x} y1={TIMELINE.y - 14} x2={TIMELINE.x} y2={TIMELINE.y + TIMELINE.h + 10} stroke="var(--mg-accent)" strokeWidth="2" opacity="0" vectorEffect="non-scaling-stroke" />
          </g>
        </svg>

        {/* Intro labels on the hairline */}
        <div className="mg-intro pointer-events-none absolute inset-x-0 top-[61%] flex justify-between px-6 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground md:px-10" aria-hidden="true">
          <span ref={timecodeRef} className="tabular-nums">00:00:00:00</span>
          <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-[var(--mg-accent)]" />Rec</span>
        </div>
        <div className="mg-intro absolute inset-x-0 bottom-8 flex flex-col justify-between gap-4 px-6 text-sm text-muted-foreground md:flex-row md:items-end md:px-10">
          <p className="max-w-sm leading-relaxed">{copy.tagline}</p>
          <p className="font-mono text-[11px] uppercase tracking-[0.14em]">
            {copy.builtWithLabel} <span className="text-foreground">{copy.builtWithValue}</span> · {copy.systemLabel} <span className="text-foreground">{copy.systemValue}</span>
          </p>
        </div>

        {/* Zoom readout */}
        <div className="mg-zoom-hud pointer-events-none absolute right-6 top-24 font-mono text-xs tabular-nums text-[var(--mg-accent)] opacity-0 md:right-10" aria-hidden="true">
          <span ref={zoomRef}>×1.00</span>
        </div>

        {/* Headline (fills in at the end) */}
        <div className="mg-headline-wrap absolute inset-x-0 top-[18vh] flex flex-col items-center px-6 text-center opacity-0">
          <h1 className="mg-headline max-w-[16ch]">
            {words.map((word, index) => (
              <span key={index} className="mg-word">
                {word}{" "}
              </span>
            ))}
          </h1>
          <div data-final className="mt-10 opacity-0">
            <a href={appStoreUrl} target="_blank" rel="noopener noreferrer" className="mg-cta group">
              <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              {copy.appStoreButton}
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
