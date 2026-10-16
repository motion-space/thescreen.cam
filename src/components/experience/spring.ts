/**
 * Damped springs with the macOS client's parameters
 * (ScreenCamCore/Models/CursorMotionSettings.swift `SpringSettings`,
 * EffectModels.swift `defaultAnimationSpring`).
 *
 * `springStep` is the analytic step response of a mass–spring–damper that
 * starts at rest at 0 and is released towards 1, so animations driven by time
 * stay deterministic when the timeline is scrubbed. `SpringValue` integrates
 * the same equation frame by frame for interactive UI.
 */
export type Spring = { mass: number; stiffness: number; damping: number };

export const SPRINGS = {
  /** zoom and camera moves */
  camera: { mass: 2.6, stiffness: 160, damping: 42 },
  cursor: { mass: 3, stiffness: 470, damping: 70 },
  /** press feedback: lively, with a small overshoot */
  click: { mass: 1, stiffness: 700, damping: 30 },
  /** overlays, transitions and UI state changes */
  effect: { mass: 2.2, stiffness: 435, damping: 52 },
} satisfies Record<string, Spring>;

/** SpringSettings.scaled(responseSpeed:) — `speed` 0..1 maps to 0..100. */
export function scaledSpring(s: Spring, speed: number): Spring {
  const k = 0.75 + Math.max(0, Math.min(1, speed)) * 0.5;
  return { mass: s.mass, stiffness: s.stiffness * k * k, damping: s.damping * k };
}

function params(s: Spring) {
  const omega = Math.sqrt(s.stiffness / s.mass);
  const zeta = s.damping / (2 * Math.sqrt(s.stiffness * s.mass));
  return { omega, zeta };
}

/** Position at `t` seconds of a spring released from 0 towards 1. */
export function springStep(s: Spring, t: number) {
  if (t <= 0) return 0;
  const { omega, zeta } = params(s);
  if (zeta < 0.999) {
    const wd = omega * Math.sqrt(1 - zeta * zeta);
    return 1 - Math.exp(-zeta * omega * t) * (Math.cos(wd * t) + ((zeta * omega) / wd) * Math.sin(wd * t));
  }
  if (zeta <= 1.001) return 1 - Math.exp(-omega * t) * (1 + omega * t);
  const r = Math.sqrt(zeta * zeta - 1);
  const r1 = -omega * (zeta - r);
  const r2 = -omega * (zeta + r);
  return 1 - (r2 * Math.exp(r1 * t) - r1 * Math.exp(r2 * t)) / (r2 - r1);
}

/** Time for the response to settle within ~1% (decay coefficient 4.6, as in the client). */
export function springSettle(s: Spring) {
  const { omega, zeta } = params(s);
  const decay = zeta < 1 ? zeta * omega : omega * (zeta - Math.sqrt(Math.max(0, zeta * zeta - 1)));
  return 4.6 / Math.max(1e-3, decay);
}

/**
 * The spring's response used as an easing curve for progress-driven motion
 * (scroll scrubbing), normalised so it lands exactly on 1 at x = 1.
 */
export function springEase(s: Spring) {
  const d = springSettle(s);
  const end = springStep(s, d);
  return (x: number) => {
    if (x <= 0) return 0;
    if (x >= 1) return 1;
    return springStep(s, x * d) / end;
  };
}

/** A value that follows its target with spring physics, integrated per frame. */
export class SpringValue {
  value: number;
  velocity = 0;
  private last = 0;
  constructor(value: number, private spring: Spring = SPRINGS.effect) {
    this.value = value;
  }
  /** Advance to `now` (ms) chasing `target`; returns the new value. */
  update(target: number, now: number) {
    const dt = this.last ? Math.min(0.064, Math.max(0, (now - this.last) / 1000)) : 0;
    this.last = now;
    const { mass, stiffness, damping } = this.spring;
    const steps = Math.max(1, Math.ceil(dt / (1 / 240)));
    const h = dt / steps;
    for (let i = 0; i < steps; i += 1) {
      const force = -stiffness * (this.value - target) - damping * this.velocity;
      this.velocity += (force / mass) * h;
      this.value += this.velocity * h;
    }
    if (Math.abs(this.value - target) < 1e-4 && Math.abs(this.velocity) < 1e-3) {
      this.value = target;
      this.velocity = 0;
    }
    return this.value;
  }
  settled(target: number) {
    return this.value === target && this.velocity === 0;
  }
}

/** framer-motion transition for the client's effect spring. */
export const FRAMER_SPRING = { type: "spring" as const, ...SPRINGS.effect };
