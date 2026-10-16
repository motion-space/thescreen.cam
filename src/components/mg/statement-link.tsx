"use client";

import { useRef } from "react";
import { FillText, prepareStrokes, useScene } from "./scene";

/** Big statement that fills in word by word; the whole block links onward. */
export function StatementLink({
  eyebrow,
  title,
  description,
  cta,
  href,
}: {
  eyebrow: string;
  title: string;
  description: string;
  cta: string;
  href: string;
}) {
  const rootRef = useRef<HTMLElement>(null);

  useScene(rootRef, ({ q, gsap, reduced }) => {
    prepareStrokes(q("[data-draw]"));
    if (reduced) {
      gsap.set(q(".mg-word"), { color: "var(--foreground)" });
      gsap.set(q("[data-draw]"), { strokeDashoffset: 0 });
      return;
    }
    const trigger = q(".sl-title")[0];
    gsap.to(q(".mg-word"), {
      color: "var(--foreground)",
      stagger: 0.1,
      ease: "none",
      scrollTrigger: { trigger, start: "top 85%", end: "bottom 45%", scrub: 0.6 },
    });
    gsap.to(q("[data-draw]"), {
      strokeDashoffset: 0,
      ease: "none",
      scrollTrigger: { trigger, start: "top 70%", end: "bottom 40%", scrub: 0.6 },
    });
  });

  return (
    <section ref={rootRef} className="mg-scene" aria-labelledby="screen-studio-alternative-link">
      <a href={href} className="group mx-auto block w-full max-w-[1240px] px-6 py-28 md:px-10 md:py-40">
        <span className="mg-label mg-index mb-8">{eyebrow}</span>
        <h2 id="screen-studio-alternative-link" className="sl-title mg-h2 mt-6 max-w-[18ch]">
          <FillText text={title} />
        </h2>
        <div className="mt-10 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <p className="max-w-xl text-[15px] leading-relaxed text-muted-foreground md:text-base">{description}</p>
          <span className="inline-flex shrink-0 items-center gap-4 text-sm font-semibold text-foreground">
            {cta}
            <svg className="h-12 w-28 overflow-visible text-foreground transition-colors group-hover:text-[var(--mg-accent)]" viewBox="0 0 112 48" aria-hidden="true">
              <line data-draw pathLength="1" className="mg-stroke" x1="0" y1="24" x2="106" y2="24" strokeWidth="1.5" />
              <path data-draw pathLength="1" className="mg-stroke" d="M92 12 L106 24 L92 36" strokeWidth="1.5" />
            </svg>
          </span>
        </div>
      </a>
    </section>
  );
}
