"use client";

import { useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import type { PerformanceCopy } from "../lib/translations";
import { FillText, prepareStrokes, useScene } from "./mg/scene";

type Metric = {
  label: string;
  note?: string;
  screenCam: number;
  others: number;
};

const RULER_TICKS = Array.from({ length: 41 }, (_, index) => index);

/**
 * Scene 5. Benchmarks drawn as editor tracks: the ruler draws, the playhead
 * sweeps and every clip grows to its measured cost while the view is pinned.
 */
export function PerformanceSection({ copy }: { copy: PerformanceCopy }) {
  const rootRef = useRef<HTMLElement>(null);
  const metrics: Metric[] = [
    { label: copy.metrics.cpuUsage, screenCam: 0.18, others: 0.72 },
    { label: copy.metrics.memory, screenCam: 0.44, others: 0.52 },
    { label: copy.metrics.appSize, note: copy.metrics.appSizeNote, screenCam: 0.033, others: 1 },
    // Export duration - shorter is faster
    { label: copy.metrics.exportTime, note: copy.metrics.exportTimeNote, screenCam: 0.44, others: 0.88 },
  ];

  useScene(rootRef, ({ q, gsap, reduced }) => {
    prepareStrokes(q("[data-draw]"));
    if (reduced) {
      gsap.set(q("[data-draw]"), { strokeDashoffset: 0 });
      gsap.set(q(".pf-clip"), { scaleX: 1 });
      gsap.set(q(".mg-word"), { color: "var(--foreground)" });
      return;
    }

    gsap.set(q(".pf-clip"), { scaleX: 0, transformOrigin: "0% 50%" });

    const tl = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: { trigger: q(".pf-stage")[0], start: "top top", end: "+=170%", scrub: 0.8, pin: true, anticipatePin: 1 },
    });

    tl.to(q(".pf-ruler [data-draw]"), { strokeDashoffset: 0, stagger: 0.008, duration: 0.6 }, 0.2)
      .fromTo(q(".pf-playhead"), { left: 0, x: 0, opacity: 1 }, { x: () => (q(".pf-playhead")[0] as HTMLElement).parentElement?.clientWidth ?? 0, duration: 2.2 }, 0.8)
      .to(q(".pf-clip-us"), { scaleX: 1, stagger: 0.35, duration: 0.8, ease: "power2.out" }, 0.9)
      .to(q(".pf-clip-them"), { scaleX: 1, stagger: 0.35, duration: 1.1, ease: "power1.out" }, 1)
      .to({}, { duration: 0.5 });
  });

  return (
    <section ref={rootRef} id="performance" className="mg-scene">
      <div className="pf-stage relative flex h-[100svh] flex-col justify-center overflow-hidden">
        <div className="mx-auto w-full max-w-[1240px] px-6 md:px-10">
          <div className="pf-head mb-12 flex flex-col gap-6 md:mb-16 md:flex-row md:items-end md:justify-between">
            <div>
              <span className="mg-label mg-index mb-6 tabular-nums">04</span>
              <h2 className="mg-h2 mt-4"><FillText text={copy.title} /></h2>
              <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-muted-foreground md:text-base">{copy.subtitle}</p>
            </div>
            <a href="https://benchmark.thescreen.cam" className="group inline-flex shrink-0 items-center gap-2 border-b border-foreground pb-1 text-sm font-medium text-foreground transition-colors hover:border-[var(--mg-accent)] hover:text-[var(--mg-accent)]">
              {copy.cta}
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
          </div>

          <div className="grid grid-cols-[6.5rem_1fr] md:grid-cols-[13rem_1fr]">
            {/* ruler */}
            <div />
            <div className="pf-ruler relative h-9">
              <svg className="absolute inset-0 h-full w-full overflow-visible text-foreground/40" aria-hidden="true">
                <line data-draw pathLength="1" className="mg-stroke" x1="0" y1="100%" x2="100%" y2="100%" />
                {RULER_TICKS.map((tick) => (
                  <line key={tick} data-draw pathLength="1" className="mg-stroke" x1={`${tick * 2.5}%`} y1="100%" x2={`${tick * 2.5}%`} y2={tick % 10 === 0 ? "35%" : "75%"} />
                ))}
              </svg>
              {[0, 25, 50, 75].map((tick) => (
                <span key={tick} className="mg-label absolute top-0 !text-[10px] tabular-nums" style={{ left: `calc(${tick}% + 6px)` }}>
                  {String(tick / 25).padStart(2, "0")}:00
                </span>
              ))}
            </div>

            {metrics.map((metric) => (
              <div key={metric.label} className="contents">
                <div className="flex flex-col justify-center gap-1 border-b border-border py-5 pr-4">
                  <span className="mg-label !text-foreground">{metric.label}</span>
                  {metric.note && <span className="text-[11px] leading-snug text-muted-foreground">{metric.note}</span>}
                </div>
                <div className="pf-lane relative space-y-2 border-b border-border py-5">
                  <div className="relative h-8">
                    <div className="pf-clip pf-clip-us flex h-full items-center overflow-hidden rounded-[5px] bg-[var(--mg-accent)] px-2.5" style={{ width: `${Math.max(metric.screenCam * 100, 3)}%` }}>
                      <span className="truncate font-mono text-[10px] font-semibold uppercase tracking-[0.1em] text-white">{copy.metrics.screenCam}</span>
                    </div>
                  </div>
                  <div className="relative h-8">
                    <div className="pf-clip pf-clip-them flex h-full items-center overflow-hidden rounded-[5px] border-[1.25px] border-foreground/40 px-2.5" style={{ width: `${metric.others * 100}%` }}>
                      <span className="truncate font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">{copy.metrics.others}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* playhead sweeps across the lanes */}
        <div className="pointer-events-none absolute inset-y-0 left-0 right-0 mx-auto w-full max-w-[1240px] px-6 md:px-10" aria-hidden="true">
          <div className="relative ml-[6.5rem] h-full md:ml-[13rem]">
            <span className="pf-playhead absolute bottom-[12%] top-[38%] w-[2px] bg-[var(--mg-accent)] opacity-0" />
          </div>
        </div>
      </div>
    </section>
  );
}
