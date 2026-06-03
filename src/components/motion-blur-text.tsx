"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";

interface MotionBlurTextProps {
  children: string;
  className?: string;
  delay?: number;
  entranceBlurY?: number;
}

interface CharState {
  blurX: number;
  blurY: number;
  offsetX: number;
  offsetY: number;
}

const CHAR_STAGGER_SECONDS = 0.03;
const ENTRY_EASE = [0.16, 1, 0.3, 1] as const;
const ENTRY_BLUR_TRANSITION = {
  duration: 0.76,
  ease: ENTRY_EASE,
  times: [0, 0.44, 1],
};

export function MotionBlurText({
  children,
  className = "",
  delay = 0,
}: MotionBlurTextProps) {
  const filterId = useId();
  const letters = useMemo(() => children.split(""), [children]);
  const containerRef = useRef<HTMLDivElement>(null);
  const charRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const lastMousePos = useRef({ x: 0, y: 0 });
  const lastTime = useRef(Date.now());
  const velocity = useRef({ x: 0, y: 0 });
  const rafId = useRef<number | null>(null);
  const selectionFrameRef = useRef<number>(0);
  const [selectedCharIndexes, setSelectedCharIndexes] = useState<Set<number>>(
    () => new Set()
  );

  const [charStates, setCharStates] = useState<CharState[]>(
    letters.map(() => ({ blurX: 0, blurY: 0, offsetX: 0, offsetY: 0 }))
  );

  // Spring values for smooth decay
  const springConfigs = useRef(
    letters.map(() => ({
      blurX: 0,
      blurY: 0,
      targetBlurX: 0,
      targetBlurY: 0,
    }))
  );

  const updateCharStates = useCallback(() => {
    const configs = springConfigs.current;
    let hasChanges = false;

    const newStates = configs.map((config, i) => {
      // Decay towards target (usually 0) - slower for longer persistence
      const decayRate = 0.04;
      config.blurX += (config.targetBlurX - config.blurX) * decayRate;
      config.blurY += (config.targetBlurY - config.blurY) * decayRate;

      // Reset target to 0 for natural decay - much slower fade
      config.targetBlurX *= 0.985;
      config.targetBlurY *= 0.985;

      if (Math.abs(config.blurX) > 0.1 || Math.abs(config.blurY) > 0.1) {
        hasChanges = true;
      }

      return {
        blurX: config.blurX,
        blurY: config.blurY,
        offsetX: config.blurX * 0.5,
        offsetY: config.blurY * 0.5,
      };
    });

    if (hasChanges) {
      setCharStates(newStates);
      rafId.current = requestAnimationFrame(updateCharStates);
    } else {
      rafId.current = null;
    }
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const now = Date.now();
    const dt = Math.max(now - lastTime.current, 1);

    // Calculate velocity
    velocity.current = {
      x: (e.clientX - lastMousePos.current.x) / dt * 16,
      y: (e.clientY - lastMousePos.current.y) / dt * 16,
    };

    lastMousePos.current = { x: e.clientX, y: e.clientY };
    lastTime.current = now;

    // Calculate speed
    const speed = Math.sqrt(
      velocity.current.x ** 2 + velocity.current.y ** 2
    );

    if (speed < 0.5) return;

    // Normalize direction
    const dirX = velocity.current.x / (speed || 1);
    const dirY = velocity.current.y / (speed || 1);

    // Blur intensity based on speed
    const maxBlur = 25;
    const blurIntensity = Math.min(speed * 1.5, maxBlur);

    // Check which characters are near the mouse
    charRefs.current.forEach((charEl, i) => {
      if (!charEl) return;

      const rect = charEl.getBoundingClientRect();
      const charCenterX = rect.left + rect.width / 2;
      const charCenterY = rect.top + rect.height / 2;

      const distX = e.clientX - charCenterX;
      const distY = e.clientY - charCenterY;
      const distance = Math.sqrt(distX ** 2 + distY ** 2);

      // Radius of effect
      const effectRadius = 120;

      if (distance < effectRadius) {
        const falloff = 1 - distance / effectRadius;
        const intensity = falloff * falloff * blurIntensity;

        springConfigs.current[i].targetBlurX = dirX * intensity;
        springConfigs.current[i].targetBlurY = dirY * intensity;
      }
    });

    // Start animation loop if not already running
    if (!rafId.current) {
      rafId.current = requestAnimationFrame(updateCharStates);
    }
  }, [updateCharStates]);

  const handleMouseLeave = useCallback(() => {
    // Let the decay handle the reset
  }, []);

  useEffect(() => {
    return () => {
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, []);

  useEffect(() => {
    const updateSelectedChars = () => {
      window.cancelAnimationFrame(selectionFrameRef.current);
      selectionFrameRef.current = window.requestAnimationFrame(() => {
        const selection = window.getSelection();

        if (!selection || selection.isCollapsed || selection.rangeCount === 0) {
          setSelectedCharIndexes(new Set());
          return;
        }

        const nextSelectedIndexes = new Set<number>();

        charRefs.current.forEach((charEl, i) => {
          if (!charEl) return;

          for (let rangeIndex = 0; rangeIndex < selection.rangeCount; rangeIndex += 1) {
            if (selection.getRangeAt(rangeIndex).intersectsNode(charEl)) {
              nextSelectedIndexes.add(i);
              break;
            }
          }
        });

        setSelectedCharIndexes(nextSelectedIndexes);
      });
    };

    document.addEventListener("selectionchange", updateSelectedChars);
    return () => {
      window.cancelAnimationFrame(selectionFrameRef.current);
      document.removeEventListener("selectionchange", updateSelectedChars);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`-mx-[0.04em] -my-[0.38em] inline-flex overflow-hidden px-[0.04em] py-[0.38em] ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* SVG Filters - one for each character */}
      <svg className="absolute w-0 h-0" aria-hidden="true">
        <defs>
          {letters.map((_, i) => (
            <filter
              key={`${filterId}-${i}`}
              id={`${filterId}-blur-${i}`}
              x="-80%"
              y="-160%"
              width="260%"
              height="420%"
            >
              <feGaussianBlur
                in="SourceGraphic"
                stdDeviation={`${Math.abs(charStates[i]?.blurX || 0)} ${Math.abs(charStates[i]?.blurY || 0)}`}
              />
            </filter>
          ))}
        </defs>
      </svg>

      {/* Characters */}
      {letters.map((letter, i) => {
        const state = charStates[i] || { blurX: 0, blurY: 0, offsetX: 0, offsetY: 0 };
        const hasHoverBlur = Math.abs(state.blurX) > 0.5 || Math.abs(state.blurY) > 0.5;
        const isSelected = selectedCharIndexes.has(i);
        const displayLetter = letter === " " ? "\u00A0" : letter;
        const charDelay = delay + i * CHAR_STAGGER_SECONDS;

        return (
          <motion.span
            key={i}
            ref={(el) => {
              charRefs.current[i] = el;
            }}
            initial={{ y: 200, rotateX: -90, opacity: 0 }}
            animate={{ y: 0, rotateX: 0, opacity: 1 }}
            transition={{
              duration: 1,
              ease: ENTRY_EASE,
              delay: charDelay,
            }}
            className="relative inline-block will-change-transform"
            style={{
              transformOrigin: "bottom",
              filter: hasHoverBlur ? `url(#${filterId}-blur-${i})` : "none",
              transform: hasHoverBlur
                ? `translate(${state.offsetX}px, ${state.offsetY}px)`
                : "none",
            }}
          >
            <motion.span
              className={`motion-blur-text-glyph ${isSelected ? "is-selection-active" : ""}`}
              initial={{
                filter: "blur(18px)",
                y: "0.26em",
                scaleY: 1.2,
              }}
              animate={{
                filter: ["blur(18px)", "blur(9px)", "blur(0px)"],
                y: ["0.26em", "0.11em", "0em"],
                scaleY: [1.2, 1.1, 1],
              }}
              transition={{
                ...ENTRY_BLUR_TRANSITION,
                delay: charDelay,
              }}
            >
              {displayLetter}
            </motion.span>
          </motion.span>
        );
      })}
    </div>
  );
}
