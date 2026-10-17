"use client";

import { ArrowRight } from "lucide-react";
import { basicsDocsTimeline } from "../data/docs";
import type { DocsCopy } from "../lib/translations";
import { DocsFeatureDemo } from "./docs/interactive-docs";
import type { DocsFeatureDemoCopy } from "./docs/interactive-docs";
import { useRef } from "react";
import { FillText, fillWords, useScene } from "./mg/scene";

type DocsBasicsSectionCopy = DocsFeatureDemoCopy &
  Pick<DocsCopy, "eyebrow" | "title"> & {
    feature: DocsCopy["features"]["basics"];
  };

export function DocsBasicsSection({
  copy,
  docsHref,
}: {
  copy: DocsBasicsSectionCopy;
  docsHref: string;
}) {
  const rootRef = useRef<HTMLElement>(null);

  useScene(rootRef, ({ q, gsap, reduced }) => {
    fillWords(q, q(".ds-head")[0], "top 85%", "top 45%");
    if (reduced) return;
    gsap.fromTo(q(".ds-player")[0], { clipPath: "inset(12% 18% 12% 18% round 16px)", scale: 0.94 }, {
      // The demo frame has a 10px radius. Keep the reveal mask just
      // outside its border so the corner stroke is not cut away.
      clipPath: "inset(-1px -1px -1px -1px round 10px)",
      scale: 1,
      ease: "power2.out",
      scrollTrigger: { trigger: q(".ds-player")[0], start: "top 95%", end: "top 30%", scrub: 0.8 },
    });
  });

  return (
    <section ref={rootRef} id="docs" className="mg-scene">
      <div className="mx-auto w-full max-w-[1240px] px-6 py-28 md:px-10 md:py-40">
        <div className="ds-head mb-12 flex flex-col gap-6 md:mb-16 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="mg-label mg-index mb-6 tabular-nums">06 — {copy.eyebrow}</span>
            <h2 className="mg-h2 mt-4"><FillText text={copy.title} /></h2>
          </div>
          <a
            href={docsHref}
            className="group inline-flex w-fit shrink-0 items-center gap-2 border-b border-foreground pb-1 text-sm font-medium text-foreground transition-colors hover:border-[var(--mg-accent)] hover:text-[var(--mg-accent)]"
          >
            <span>view all docs</span>
            <ArrowRight aria-hidden="true" className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" strokeWidth={2} />
          </a>
        </div>

        <div className="ds-player">
          <DocsFeatureDemo
            copy={copy}
            deferMediaUntilVisible
            feature={copy.feature}
            timeline={basicsDocsTimeline}
          />
        </div>
      </div>
    </section>
  );
}
