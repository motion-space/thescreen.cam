"use client";

import { useEffect, useRef } from "react";

export function LiquidGlassMaterial() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;
    if (!canvas || !parent) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let raf = 0;
    let frameTimer = 0;
    let isRunning = false;
    let isVisible = true;
    let width = 0;
    let height = 0;
    let dpr = 1;

    const resize = () => {
      const rect = parent.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      width = Math.max(1, Math.round(rect.width));
      height = Math.max(1, Math.round(rect.height));
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = (time: number) => {
      if (!isRunning) return;

      const t = time * 0.001;
      ctx.clearRect(0, 0, width, height);

      const radius = height / 2;
      ctx.save();
      roundedRect(ctx, 0, 0, width, height, radius);
      ctx.clip();

      const base = ctx.createLinearGradient(0, 0, width, height);
      base.addColorStop(0, "rgba(255,255,255,0.13)");
      base.addColorStop(0.42, "rgba(255,255,255,0.045)");
      base.addColorStop(0.62, "rgba(180,210,255,0.045)");
      base.addColorStop(1, "rgba(255,255,255,0.10)");
      ctx.fillStyle = base;
      ctx.fillRect(0, 0, width, height);

      const sweepX = width * (0.32 + Math.sin(t * 0.8) * 0.08);
      const sweep = ctx.createLinearGradient(sweepX - width * 0.48, 0, sweepX + width * 0.48, height);
      sweep.addColorStop(0, "rgba(255,255,255,0)");
      sweep.addColorStop(0.45, "rgba(255,255,255,0.055)");
      sweep.addColorStop(0.52, "rgba(255,255,255,0.22)");
      sweep.addColorStop(0.6, "rgba(120,180,255,0.065)");
      sweep.addColorStop(1, "rgba(255,255,255,0)");
      ctx.globalCompositeOperation = "screen";
      ctx.fillStyle = sweep;
      ctx.fillRect(0, 0, width, height);

      const caustic = ctx.createRadialGradient(
        width * (0.2 + Math.sin(t * 0.7) * 0.05),
        height * 0.15,
        0,
        width * 0.2,
        height * 0.15,
        width * 0.65,
      );
      caustic.addColorStop(0, "rgba(255,255,255,0.18)");
      caustic.addColorStop(0.2, "rgba(255,255,255,0.065)");
      caustic.addColorStop(0.55, "rgba(255,255,255,0.012)");
      caustic.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = caustic;
      ctx.fillRect(0, 0, width, height);

      for (let i = 0; i < 3; i += 1) {
        const y = height * (0.25 + i * 0.18 + Math.sin(t * 1.1 + i) * 0.025);
        const wave = ctx.createLinearGradient(0, y - height * 0.2, width, y + height * 0.2);
        wave.addColorStop(0, "rgba(255,255,255,0)");
        wave.addColorStop(0.5, `rgba(255,255,255,${0.06 - i * 0.012})`);
        wave.addColorStop(1, "rgba(255,255,255,0)");
        ctx.strokeStyle = wave;
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (let x = -10; x <= width + 10; x += 8) {
          const yy = y + Math.sin(x * 0.035 + t * 1.4 + i) * (3.5 + i);
          if (x === -10) ctx.moveTo(x, yy);
          else ctx.lineTo(x, yy);
        }
        ctx.stroke();
      }

      ctx.restore();
      ctx.globalCompositeOperation = "source-over";

      const rim = ctx.createLinearGradient(0, 0, 0, height);
      rim.addColorStop(0, "rgba(255,255,255,0.72)");
      rim.addColorStop(0.5, "rgba(255,255,255,0.16)");
      rim.addColorStop(1, "rgba(255,255,255,0.36)");
      ctx.strokeStyle = rim;
      ctx.lineWidth = 1;
      roundedRect(ctx, 0.5, 0.5, width - 1, height - 1, radius - 0.5);
      ctx.stroke();

      frameTimer = window.setTimeout(() => {
        raf = requestAnimationFrame(draw);
      }, 1000 / 24);
    };

    const start = () => {
      if (isRunning || !isVisible || document.hidden) return;
      isRunning = true;
      raf = requestAnimationFrame(draw);
    };

    const stop = () => {
      isRunning = false;
      cancelAnimationFrame(raf);
      window.clearTimeout(frameTimer);
    };

    const observer = new ResizeObserver(resize);
    observer.observe(parent);
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
      if (entry.isIntersecting) {
        start();
      } else {
        stop();
      }
    });
    visibilityObserver.observe(parent);
    const handleVisibilityChange = () => {
      if (document.hidden) {
        stop();
      } else {
        start();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    resize();
    start();

    return () => {
      observer.disconnect();
      visibilityObserver.disconnect();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      stop();
    };
  }, []);

  return <canvas ref={canvasRef} className="liquid-glass-canvas" aria-hidden="true" />;
}

function roundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + width, y, x + width, y + height, r);
  ctx.arcTo(x + width, y + height, x, y + height, r);
  ctx.arcTo(x, y + height, x, y, r);
  ctx.arcTo(x, y, x + width, y, r);
  ctx.closePath();
}
