"use client";

import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import { useRef } from "react";
import type { DeviceMockupsCopy } from "../lib/translations";

export function DeviceMockupsSection({ copy }: { copy: DeviceMockupsCopy }) {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Scroll-based entry animations
  const iPhoneX = useTransform(scrollYProgress, [0, 0.42], [-80, 0]);
  const iPhoneOpacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);
  const iPhoneRotate = useTransform(scrollYProgress, [0, 0.42], [12, 0]);

  const studioY = useTransform(scrollYProgress, [0, 0.42], [90, 0]);
  const studioScale = useTransform(scrollYProgress, [0, 0.42], [0.92, 1]);
  const studioOpacity = useTransform(scrollYProgress, [0, 0.25], [0, 1]);

  const macBookX = useTransform(scrollYProgress, [0, 0.42], [80, 0]);
  const macBookOpacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);
  const macBookRotate = useTransform(scrollYProgress, [0, 0.42], [-12, 0]);

  return (
    <section
      id="export"
      ref={sectionRef}
      className="relative min-h-screen bg-background py-32 overflow-hidden"
    >
      {/* Radial gradient background */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          background: 'radial-gradient(ellipse 80% 50% at 50% 60%, rgba(180, 80, 60, 0.1), transparent)',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6 md:px-12">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16 md:mb-24"
        >
          <p className="text-accent text-sm tracking-widest uppercase mb-4">
            {copy.eyebrow}
          </p>
          <h2 className="text-[clamp(2rem,5vw,4rem)] font-bold leading-[1.1] tracking-tight text-foreground max-w-3xl mx-auto text-balance">
            {copy.title}
          </h2>
          <p className="text-muted-foreground text-lg mt-6 max-w-xl mx-auto">
            {copy.description}
          </p>
        </motion.div>

        {/* Devices showcase - Horizontal layout with overlap */}
        <div className="relative h-[330px] md:h-[430px] lg:h-[500px] mb-10 md:mb-14 flex items-center justify-center">

          {/* iPhone - Left side */}
          <motion.div
            style={{
              x: iPhoneX,
              opacity: iPhoneOpacity,
              rotate: iPhoneRotate,
            }}
            className="absolute z-30 left-[18%] bottom-[-6px] -translate-x-1/2 md:left-[22%] md:bottom-[-8px] lg:left-[23%] lg:bottom-[-10px]"
          >
            <DeviceCard>
              <div className="relative">
                <img
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/iPhone%2017%20Pro%20Max-kj34LciT8o3bTr44ashNVpOXqE7MwD.webp"
                  alt={copy.imageAlt.iPhone}
                  loading="lazy"
                  decoding="async"
                  className="w-[55px] md:w-[76px] lg:w-[92px] h-auto object-contain"
                  style={{
                    filter: 'drop-shadow(0 24px 46px rgba(0,0,0,0.48))',
                  }}
                />
                {/* Edge glow */}
                <div
                  className="absolute inset-0 rounded-[24px] md:rounded-[36px] pointer-events-none"
                  style={{
                    boxShadow: 'inset 0 0 40px rgba(200, 100, 60, 0.15)',
                  }}
                />
              </div>
            </DeviceCard>
          </motion.div>

          {/* Studio Display - Center, behind */}
          <motion.div
            style={{
              y: studioY,
              scale: studioScale,
              opacity: studioOpacity,
            }}
            className="absolute z-10 -translate-y-[3%]"
          >
            <DeviceCard>
              <div className="relative">
                <img
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Studio%20Display-6aWG7MxpqgCdzYGGF9nJRypUmyN1i4.webp"
                  alt={copy.imageAlt.studioDisplay}
                  loading="lazy"
                  decoding="async"
                  className="w-[360px] md:w-[560px] lg:w-[720px] h-auto object-contain"
                  style={{
                    filter: 'drop-shadow(0 42px 84px rgba(0,0,0,0.38))',
                  }}
                />
                {/* Ambient glow */}
                <div
                  className="absolute inset-0 pointer-events-none opacity-40"
                  style={{
                    background: 'radial-gradient(ellipse at center, rgba(180, 80, 60, 0.15), transparent 60%)',
                  }}
                />
              </div>
            </DeviceCard>
          </motion.div>

          {/* MacBook - Right side */}
          <motion.div
            style={{
              x: macBookX,
              opacity: macBookOpacity,
              rotate: macBookRotate,
            }}
            className="absolute z-20 left-[82%] bottom-[-2px] -translate-x-1/2 md:left-[73%] md:bottom-[-14px] lg:left-[75%] lg:bottom-[-22px]"
          >
            <DeviceCard>
              <div className="relative">
                <img
                  src="/1447.webp"
                  alt={copy.imageAlt.macBook}
                  loading="lazy"
                  decoding="async"
                  className="device-mockup-macbook h-auto object-contain"
                  style={{
                    maxWidth: 'none',
                    filter: 'drop-shadow(0 32px 64px rgba(0,0,0,0.42))',
                  }}
                />
                {/* Subtle reflection */}
                <div
                  className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-[70%] h-16 opacity-10"
                  style={{
                    background: 'linear-gradient(to bottom, rgba(255,255,255,0.15), transparent)',
                    filter: 'blur(20px)',
                  }}
                />
              </div>
            </DeviceCard>
          </motion.div>
        </div>

        {/* Export formats */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
          className="mt-0 flex flex-wrap items-center justify-center gap-3 md:gap-4 text-sm"
        >
          {copy.formats.map((format) => (
            <motion.span
              key={format}
              whileHover={{ scale: 1.05, y: -2 }}
              className="px-4 md:px-5 py-2 md:py-2.5 rounded-full border border-accent/50 bg-accent/10 text-accent transition-colors cursor-default"
            >
              {format}
            </motion.span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function DeviceCard({
  children,
}: {
  children: React.ReactNode;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, -10]), {
    stiffness: 150,
    damping: 20,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-10, 10]), {
    stiffness: 150,
    damping: 20,
  });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: 1000,
        transformStyle: "preserve-3d",
      }}
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          rotateZ: 0,
          transformStyle: "preserve-3d",
        }}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
