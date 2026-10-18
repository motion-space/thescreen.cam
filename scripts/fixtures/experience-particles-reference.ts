// Frozen pre-optimization evaluator: pixel oracle for particle order and rounding.
let original: HTMLCanvasElement | null = null;
let cutout: HTMLCanvasElement | null = null;
const SETTINGS = {
  particleSize: 2.5,
  spread: 0.7,
  speedMin: 0.25,
  speedMax: 2.35,
  chaos: 0.9,
  durationMin: 300,
  durationMax: 1640,
  swayAmplitude: 29,
  swaySpeed: 1.6,
  shrinkDelay: 0,
  shrinkDuration: 50,
};
const LAUNCH_WINDOW = 1000;
const BASE_DIRECTION = -Math.PI * 0.22;
const MAX_DIM = 256;

/** Deterministic port of the client's pixelNoise (Math.imul hash). */
function pixelNoise(x: number, y: number, seed: number) {
  let v = Math.imul((x + seed * 1013) >>> 0, 374761393) >>> 0;
  const w = Math.imul((y + seed * 1619) >>> 0, 668265263) >>> 0;
  v = Math.imul((v ^ w) >>> 0, 1274126177) >>> 0;
  v = (v ^ (v >>> 16)) >>> 0;
  return v / 4294967295;
}

type Particles = {
  count: number;
  sx: Float32Array;
  sy: Float32Array;
  colors: Uint8Array;
  delays: Float32Array;
  travels: Float32Array;
  dirs: Float32Array;
  phases: Float32Array;
  speeds: Float32Array;
  lifetimes: Float32Array;
  swayA: Float32Array;
  swayF: Float32Array;
  launch: Float64Array;
  moveDuration: Float64Array;
  cosDir: Float64Array;
  sinDir: Float64Array;
  vx: Float64Array;
  vy: Float64Array;
};

let particles: Particles | null = null;
let dissolveW = 0;
let dissolveH = 0;
let canvasW = 0;
let canvasH = 0;
let marginX = 0;
let marginY = 0;
let dissolveCanvas: HTMLCanvasElement | null = null;
let dissolvePixels: ImageData | null = null;

function rgbaOf(img: HTMLImageElement | HTMLCanvasElement, w: number, h: number) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const g = c.getContext("2d", { willReadFrequently: true });
  if (!g) return null;
  g.drawImage(img, 0, 0, w, h);
  return g.getImageData(0, 0, w, h).data;
}

function prepareDissolve() {
  if (!original || !cutout || particles) return;
  const scale = Math.min(1, MAX_DIM / Math.max(original.width, original.height));
  dissolveW = Math.max(1, Math.round(original.width * scale));
  dissolveH = Math.max(1, Math.round(original.height * scale));
  const a = rgbaOf(original, dissolveW, dissolveH);
  const b = rgbaOf(cutout, dissolveW, dissolveH);
  if (!a || !b) return;
  // room for particles to drift up and to the right of the frame
  marginX = Math.round(dissolveW * 0.45);
  marginY = Math.round(dissolveH * 0.55);
  canvasW = dissolveW + marginX * 2;
  canvasH = dissolveH + marginY * 2;
  let count = 0;
  for (let i = 3; i < a.length; i += 4) if (a[i] > b[i]) count += 1;
  const p: Particles = {
    count,
    sx: new Float32Array(count),
    sy: new Float32Array(count),
    colors: new Uint8Array(count * 4),
    delays: new Float32Array(count),
    travels: new Float32Array(count),
    dirs: new Float32Array(count),
    phases: new Float32Array(count),
    speeds: new Float32Array(count),
    lifetimes: new Float32Array(count),
    swayA: new Float32Array(count),
    swayF: new Float32Array(count),
    launch: new Float64Array(count),
    moveDuration: new Float64Array(count),
    cosDir: new Float64Array(count),
    sinDir: new Float64Array(count),
    vx: new Float64Array(count),
    vy: new Float64Array(count),
  };
  let n = 0;
  const maxX = Math.max(1, dissolveW - 1);
  for (let y = 0; y < dissolveH; y += 1) {
    for (let x = 0; x < dissolveW; x += 1) {
      const i = (y * dissolveW + x) * 4;
      const removed = Math.max(0, a[i + 3] - b[i + 3]);
      if (!removed) continue;
      p.sx[n] = marginX + x;
      p.sy[n] = marginY + y;
      p.colors[n * 4] = a[i];
      p.colors[n * 4 + 1] = a[i + 1];
      p.colors[n * 4 + 2] = a[i + 2];
      p.colors[n * 4 + 3] = removed;
      p.delays[n] = (x / maxX) * 0.18 + pixelNoise(x, y, 1) * 0.22;
      p.travels[n] = 125 + pixelNoise(x, y, 2) * 225;
      p.dirs[n] = pixelNoise(x, y, 3) - 0.5;
      p.phases[n] = pixelNoise(x, y, 4) * Math.PI * 2;
      p.speeds[n] = SETTINGS.speedMin + pixelNoise(x, y, 5) * (SETTINGS.speedMax - SETTINGS.speedMin);
      p.lifetimes[n] = SETTINGS.durationMin + pixelNoise(x, y, 6) * (SETTINGS.durationMax - SETTINGS.durationMin);
      p.swayA[n] = 0.65 + pixelNoise(x, y, 7) * 0.7;
      p.swayF[n] = 0.72 + pixelNoise(x, y, 8) * 0.68;
      // Retain double precision and the original Float32 inputs so trajectories
      // stay identical; these terms depend on the particle, never on elapsed time.
      p.launch[n] = Math.min(p.delays[n] * LAUNCH_WINDOW, p.lifetimes[n] * 0.35);
      p.moveDuration[n] = Math.max(1, p.lifetimes[n] - p.launch[n]);
      const dir = BASE_DIRECTION + p.dirs[n] * 1.1 * SETTINGS.chaos;
      p.cosDir[n] = Math.cos(dir);
      p.sinDir[n] = Math.sin(dir);
      p.vx[n] = p.cosDir[n] * p.travels[n] * SETTINGS.spread * p.speeds[n];
      p.vy[n] = (p.sinDir[n] * p.travels[n] - 18) * SETTINGS.spread * p.speeds[n];
      n += 1;
    }
  }
  particles = p;
  dissolveCanvas = document.createElement("canvas");
  dissolveCanvas.width = canvasW;
  dissolveCanvas.height = canvasH;
  dissolvePixels = null;
}

export const DISSOLVE_MS = SETTINGS.durationMax + 100;

/** BackgroundRemovalDissolveRenderer.render(elapsedMilliseconds:) */
function renderDissolve(elapsed: number) {
  if (!particles || !dissolveCanvas) return null;
  const g = dissolveCanvas.getContext("2d");
  if (!g) return null;
  const img = dissolvePixels ??= g.createImageData(canvasW, canvasH);
  const out = img.data;
  out.fill(0);
  const p = particles;
  const denom = 1 - Math.exp(-8);
  const terminalDrift = 0.08;
  const vDrift = 12 * SETTINGS.spread;
  const write = (idx: number, ci: number, alpha: number) => {
    if (alpha <= out[idx + 3]) return;
    out[idx] = p.colors[ci];
    out[idx + 1] = p.colors[ci + 1];
    out[idx + 2] = p.colors[ci + 2];
    out[idx + 3] = Math.min(255, alpha);
  };
  for (let i = 0; i < p.count; i += 1) {
    const life = p.lifetimes[i];
    if (elapsed >= life) continue;
    const move = Math.min(1, Math.max(0, elapsed - p.launch[i]) / p.moveDuration[i]);
    let x: number;
    let y: number;
    if (move === 0) {
      x = Math.round(p.sx[i]);
      y = Math.round(p.sy[i]);
    } else {
      const travelP = ((1 - Math.exp(-8 * move * move)) / denom) * (1 - terminalDrift) + move * move * move * terminalDrift;
      const env = Math.min(1, move * 2.4);
      const dc = p.cosDir[i];
      const ds = p.sinDir[i];
      const sway = Math.sin(p.phases[i] + travelP * SETTINGS.swaySpeed * p.swayF[i] * Math.PI) * SETTINGS.swayAmplitude * p.swayA[i] * env;
      x = Math.round(p.sx[i] + p.vx[i] * travelP - ds * sway);
      y = Math.round(p.sy[i] + p.vy[i] * travelP + dc * sway + vDrift * travelP);
    }
    if (x < 0 || x >= canvasW || y < 0 || y >= canvasH) continue;
    const shrinkDur = Math.min(SETTINGS.shrinkDuration, Math.max(50, life - SETTINGS.shrinkDelay - 10));
    const shrinkDelay = Math.max(SETTINGS.shrinkDelay, life - shrinkDur);
    let size = SETTINGS.particleSize;
    if (elapsed > shrinkDelay) {
      if (elapsed >= shrinkDelay + shrinkDur) continue;
      const sp = (elapsed - shrinkDelay) / shrinkDur;
      size = SETTINGS.particleSize * (1 - sp * sp * (3 - 2 * sp));
    }
    if (size <= 0.15) continue;
    const ci = i * 4;
    const alpha = Math.round(p.colors[ci + 3] * (1 - move));
    if (alpha <= 0) continue;
    const idx = (y * canvasW + x) * 4;
    write(idx, ci, alpha);
    if (move === 0) continue;
    const shoulders = Math.ceil(Math.max(0, size - 1));
    for (let s = 1; s <= shoulders; s += 1) {
      const coverage = Math.max(0, Math.min(1, size - s));
      const sa = Math.round(alpha * Math.min(0.48, move * 1.35) * coverage);
      if (sa <= 0) continue;
      if (x - s >= 0) write(idx - s * 4, ci, sa);
      if (x + s < canvasW) write(idx + s * 4, ci, sa);
      if (y - s >= 0) write(idx - s * canvasW * 4, ci, sa);
      if (y + s < canvasH) write(idx + s * canvasW * 4, ci, sa);
    }
  }
  g.putImageData(img, 0, 0);
  return dissolveCanvas;
}


export function renderForTest(a: HTMLCanvasElement, b: HTMLCanvasElement, elapsed: number) {
  original = a; cutout = b; particles = null;
  prepareDissolve(); return renderDissolve(elapsed);
}
