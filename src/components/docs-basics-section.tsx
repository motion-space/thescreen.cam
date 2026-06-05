"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { basicsDocsTimeline } from "../data/docs";
import type { DocsCopy } from "../lib/translations";
import { DocsFeatureDemo } from "./docs/interactive-docs";
import type { DocsFeatureDemoCopy } from "./docs/interactive-docs";

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
  const shouldReduceMotion = useReducedMotion();

  return (
    <section id="docs" className="relative overflow-hidden bg-background py-28 md:py-32">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:80px_80px] opacity-[0.12]" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="relative mx-auto w-full max-w-7xl px-6 md:px-12">
        <motion.header
          initial={shouldReduceMotion ? false : { opacity: 0, y: 36 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end"
        >
          <div className="max-w-3xl">
            <p className="mb-4 text-sm uppercase text-accent">{copy.eyebrow}</p>
            <h2 className="text-[clamp(2rem,5vw,4rem)] font-bold leading-[1.08] text-foreground text-balance">
              {copy.title}
            </h2>
          </div>

          <a
            href={docsHref}
            className="inline-flex w-fit items-center gap-1.5 text-sm font-medium leading-none text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-foreground/70 lg:justify-self-end"
          >
            <span>view all docs</span>
            <ArrowRight aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={2} />
          </a>
        </motion.header>

        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1], delay: 0.08 }}
          className="mt-12"
        >
          <DocsFeatureDemo
            copy={copy}
            deferMediaUntilVisible
            feature={copy.feature}
            timeline={basicsDocsTimeline}
          />
        </motion.div>
      </div>
    </section>
  );
}
