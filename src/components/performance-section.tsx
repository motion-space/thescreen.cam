"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowRight } from "lucide-react";

export function PerformanceSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="relative min-h-screen bg-background py-32 overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/5 rounded-full blur-[150px]" />
      </div>

      <div className="relative max-w-6xl mx-auto px-6 md:px-12">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-32"
        >
          <h2 className="text-[clamp(2.5rem,6vw,5rem)] font-bold leading-[1.05] tracking-tight text-foreground text-balance">
            Native means fast.
          </h2>
          <p className="text-muted-foreground text-lg mt-6 max-w-lg mx-auto">
            No Electron. No web views. Pure native performance.
          </p>
        </motion.div>

        {/* Visual comparison - horizontal bars */}
        <div ref={ref} className="max-w-3xl mx-auto space-y-16 mb-24">
          {/* CPU Usage */}
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground uppercase tracking-widest text-xs">CPU Usage</span>
            </div>
            <div className="space-y-3">
              {/* ScreenCam bar */}
              <div className="flex items-center gap-4">
                <span className="text-sm text-foreground w-24 shrink-0">ScreenCam</span>
                <div className="flex-1 h-2 bg-muted/30 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-accent to-accent/70 rounded-full"
                    initial={{ width: 0 }}
                    animate={isInView ? { width: "18%" } : {}}
                    transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                  />
                </div>
              </div>
              {/* Others bar */}
              <div className="flex items-center gap-4 opacity-50">
                <span className="text-sm text-muted-foreground w-24 shrink-0">Others</span>
                <div className="flex-1 h-2 bg-muted/30 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-muted-foreground/40 rounded-full"
                    initial={{ width: 0 }}
                    animate={isInView ? { width: "72%" } : {}}
                    transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Memory Usage */}
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground uppercase tracking-widest text-xs">Memory</span>
            </div>
            <div className="space-y-3">
              {/* ScreenCam bar */}
              <div className="flex items-center gap-4">
                <span className="text-sm text-foreground w-24 shrink-0">ScreenCam</span>
                <div className="flex-1 h-2 bg-muted/30 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-accent to-accent/70 rounded-full"
                    initial={{ width: 0 }}
                    animate={isInView ? { width: "44%" } : {}}
                    transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
                  />
                </div>
              </div>
              {/* Others bar */}
              <div className="flex items-center gap-4 opacity-50">
                <span className="text-sm text-muted-foreground w-24 shrink-0">Others</span>
                <div className="flex-1 h-2 bg-muted/30 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-muted-foreground/40 rounded-full"
                    initial={{ width: 0 }}
                    animate={isInView ? { width: "52%" } : {}}
                    transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* App Size */}
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground uppercase tracking-widest text-xs">App Size</span>
              <span className="text-muted-foreground text-xs">Mac App Store: about 20MB</span>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-4">
                <span className="text-sm text-foreground w-24 shrink-0">ScreenCam</span>
                <div className="flex-1 h-2 bg-muted/30 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-accent to-accent/70 rounded-full"
                    initial={{ width: 0 }}
                    animate={isInView ? { width: "20%" } : {}}
                    transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.6 }}
                  />
                </div>
              </div>
              <div className="flex items-center gap-4 opacity-50">
                <span className="text-sm text-muted-foreground w-24 shrink-0">Others</span>
                <div className="flex-1 h-2 bg-muted/30 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-muted-foreground/40 rounded-full"
                    initial={{ width: 0 }}
                    animate={isInView ? { width: "68%" } : {}}
                    transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.7 }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Export Speed */}
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground uppercase tracking-widest text-xs">Export Speed</span>
            </div>
            <div className="space-y-3">
              {/* ScreenCam bar - longer = faster */}
              <div className="flex items-center gap-4">
                <span className="text-sm text-foreground w-24 shrink-0">ScreenCam</span>
                <div className="flex-1 h-2 bg-muted/30 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-accent to-accent/70 rounded-full"
                    initial={{ width: 0 }}
                    animate={isInView ? { width: "88%" } : {}}
                    transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.8 }}
                  />
                </div>
              </div>
              {/* Others bar */}
              <div className="flex items-center gap-4 opacity-50">
                <span className="text-sm text-muted-foreground w-24 shrink-0">Others</span>
                <div className="flex-1 h-2 bg-muted/30 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-muted-foreground/40 rounded-full"
                    initial={{ width: 0 }}
                    animate={isInView ? { width: "44%" } : {}}
                    transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.9 }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center"
        >
          <a
            href="https://benchmark.thescreen.cam"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
          >
            <span>View full benchmark data</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
