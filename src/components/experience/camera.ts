/**
 * Camera overlay with background removal.
 *
 * Every video frame was segmented offline with the
 * client's pipeline (ScreenCamCameraBackgroundRemoval/CameraBackgroundFilter:
 * VNGeneratePersonSegmentationRequest, accurate quality, mask feathered by
 * 1.1 px, blended over transparency). Turning removal on plays the client's
 * "Sticker Forge" dissolve (BackgroundRemovalDissolveEffect.swift): every
 * removed background pixel becomes a particle that drifts up and away.
 */
import { CameraMaskGL } from "./camera-gl";
import { squircle } from "./kit";
import { SPRINGS, springStep } from "./spring";

/**
 * The camera lane holds two clips split at `split`: the first keeps the
 * camera's own background, the second carries `remove` / `sticker`. As in
 * the client, removal belongs to a clip, so playback crossing into the second
 * clip is what takes the background away. `changedAt` records live toggles.
 */
export type CameraSettings = {
  show: boolean;
  remove: boolean;
  sticker: boolean;
  size: number;
  changedAt: number;
  split: number;
  /** Earlier cuts in the lane; the camera alternates right → left → right at each. */
  cuts: number[];
};

/** Clip boundaries in order (side 0 = bottom-right, 1 = bottom-left). */
export function cameraClips(cam: CameraSettings, duration: number) {
  const starts = [0, ...cam.cuts, cam.split];
  return starts.map((start, i) => ({
    start,
    end: i + 1 < starts.length ? starts[i + 1] : duration,
    side: i < starts.length - 1 ? i % 2 : 0,
    removes: i === starts.length - 1,
  }));
}

/** Horizontal side at `time`: adjacent clips hand over with a spring. */
function sideAt(cam: CameraSettings, time: number) {
  const clips = cameraClips(cam, Number.POSITIVE_INFINITY);
  let index = 0;
  clips.forEach((c, i) => {
    if (time >= c.start) index = i;
  });
  const clip = clips[index];
  const prev = clips[index - 1];
  if (!prev) return clip.side;
  // the move between clips rides the client's effect spring
  return prev.side + (clip.side - prev.side) * springStep(SPRINGS.effect, time - clip.start);
}

/** CameraOverlayFrameEvaluator.automaticScale (auto scale on, strength 60). */
export function cameraAutoScale(zoomScale: number) {
  const delta = Math.max(0, zoomScale - 1);
  return Math.max(0.42, Math.min(1, 1 / (1 + delta * 0.6)));
}

const SRC = "/feature-media/camera-portrait.webp";
const CUT = "/feature-media/camera-portrait-cutout.webp";

let original: HTMLImageElement | HTMLCanvasElement | null = null;
let cutout: HTMLImageElement | HTMLCanvasElement | null = null;
let stickerCanvas: HTMLCanvasElement | null = null;

function load(src: string, done: (img: HTMLImageElement) => void) {
  const img = new Image();
  img.decoding = "async";
  img.onload = () => done(img);
  img.src = src;
}

if (typeof window !== "undefined") {
  load(SRC, (img) => {
    original = img;
    prepareDissolve();
  });
  load(CUT, (img) => {
    cutout = img;
    prepareDissolve();
    prepareSticker();
  });
}

/** One video stores color and alpha side by side, so they cannot drift apart. */
let video: HTMLVideoElement | null = null;
let packedFrame: HTMLCanvasElement | null = null;
let colorFrame: HTMLCanvasElement | null = null;
let transparentFrame: HTMLCanvasElement | null = null;
let decodedFrame = -1;
let maskRenderer: CameraMaskGL | null | undefined;
let dissolveKey = "";
let playbackVisible = true;
let scrollControlled = false;
let requestedTime = 0;

/** Switch clocks when entering or leaving the scroll-driven feature chapters. */
export function setCameraScrollControlled(controlled: boolean) {
  if (scrollControlled === controlled) return;
  scrollControlled = controlled;
  if (video) {
    video.autoplay = !controlled;
    if (controlled && !video.paused) video.pause();
  }
}

/** Seek the portrait to the same deterministic clock as the editor preview. */
export function setCameraPlaybackTime(time: number) {
  requestedTime = time;
  if (!scrollControlled || !video || video.seeking || !Number.isFinite(video.duration) || video.duration <= 0) return;
  const wrapped = ((time % video.duration) + video.duration) % video.duration;
  const target = Math.min(video.duration - 1 / 24, Math.floor(wrapped * 24 + 1e-6) / 24);
  if (Math.abs(video.currentTime - target) >= 1 / 48) video.currentTime = Math.max(0, target);
}

/** Only explicit volume interaction unmutes the otherwise silent autoplay preview. */
export function setCameraVolume(volume: number) {
  if (!video) return;
  video.volume = Math.max(0, Math.min(1, volume));
  video.muted = volume === 0;
}

export function setCameraPlaybackVisible(visible: boolean) {
  playbackVisible = visible;
  if (!video) return;
  if (!scrollControlled && visible && !document.hidden) { if (video.paused) void video.play().catch(() => {}); }
  else if (!video.paused) video.pause();
}

export function startCameraPlayback(scrub = false) {
  scrollControlled = scrub;
  requestedTime = 0;
  const media = document.createElement("video");
  media.src = "/feature-media/camera-portrait-loop.mp4";
  media.muted = true;
  media.loop = true;
  media.autoplay = !scrub;
  media.playsInline = true;
  media.preload = "auto";
  media.setAttribute("aria-hidden", "true");
  media.dataset.cameraLoop = "true";
  media.style.cssText = "position:fixed;width:1px;height:1px;opacity:0;pointer-events:none;";
  document.body.appendChild(media);
  video = media;
  decodedFrame = -1;
  const play = () => { if (!scrollControlled && playbackVisible && !document.hidden && media.paused) void media.play().catch(() => {}); };
  const ready = () => window.dispatchEvent(new Event("xp-camera-frame-ready"));
  const metadata = () => setCameraPlaybackTime(requestedTime);
  media.addEventListener("loadedmetadata", metadata);
  media.addEventListener("loadeddata", ready);
  media.addEventListener("seeked", ready);
  play();
  document.addEventListener("pointerdown", play);
  return () => {
    document.removeEventListener("pointerdown", play);
    media.removeEventListener("loadedmetadata", metadata);
    media.removeEventListener("loadeddata", ready);
    media.removeEventListener("seeked", ready);
    media.pause();
    media.removeAttribute("src");
    media.load();
    media.remove();
    if(bubbleShadow)bubbleShadow.width=bubbleShadow.height=1;bubbleShadow=null;bubbleShadowKey="";
    if(shadowSprite)shadowSprite.width=shadowSprite.height=1;shadowSprite=null;shadowKey="";shadowSource=null;
    if (video === media) { video = null; scrollControlled = false; maskRenderer?.dispose(); maskRenderer = undefined; }
  };
}

function updateVideoFrame() {
  if (!video || video.readyState < 2 || video.seeking) return;
  const frame = Math.floor(video.currentTime * 24 + 1e-4);
  if (decodedFrame === frame) return;
  const width = video.videoWidth / 2;
  const height = video.videoHeight;
  if (!width || !height) return;
  colorFrame ??= document.createElement("canvas");
  if (colorFrame.width !== width || colorFrame.height !== height) { colorFrame.width = width; colorFrame.height = height; }
  const color = colorFrame.getContext("2d");
  if (!color) return;
  color.drawImage(video, 0, 0, width, height, 0, 0, width, height);
  if (maskRenderer === undefined) {
    try { maskRenderer = new CameraMaskGL(); } catch { maskRenderer = null; }
  }
  if (maskRenderer) {
    cutout = maskRenderer.render(video);
    original = colorFrame;
    stickerCanvas = null;
    decodedFrame = frame;
    return;
  }
  // CPU fallback only for browsers that cannot create a WebGL context.
  packedFrame ??= document.createElement("canvas");
  transparentFrame ??= document.createElement("canvas");
  if (packedFrame.width !== width * 2 || packedFrame.height !== height) {
    packedFrame.width = width * 2; packedFrame.height = height;
    transparentFrame.width = width; transparentFrame.height = height;
  }
  const packed = packedFrame.getContext("2d", { willReadFrequently: true });
  const transparent = transparentFrame.getContext("2d");
  if (!packed || !color || !transparent) return;
  packed.drawImage(video, 0, 0);
  const pixels = packed.getImageData(0, 0, width * 2, height).data;
  const result = transparent.createImageData(width, height);
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const input = (y * width * 2 + x) * 4;
      const output = (y * width + x) * 4;
      result.data[output] = pixels[input];
      result.data[output + 1] = pixels[input + 1];
      result.data[output + 2] = pixels[input + 2];
      // Remove tiny H.264 residuals in fully transparent/opaque regions.
      result.data[output + 3] = Math.max(0, Math.min(255, (pixels[input + width * 4] - 4) * 255 / 247));
    }
  }
  transparent.putImageData(result, 0, 0);
  original = colorFrame;
  cutout = transparentFrame;
  stickerCanvas = null;
  decodedFrame = frame;
}

/* ---------- Sticker Forge dissolve (port) ---------- */

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

/* ---------- sticker effect: white outline around the cut-out ---------- */

function prepareSticker() {
  if (!cutout || stickerCanvas) return;
  const w = cutout.width;
  const h = cutout.height;
  const outline = Math.max(2, Math.round(h * 0.018));
  const c = document.createElement("canvas");
  c.width = w + outline * 2;
  c.height = h + outline * 2;
  const g = c.getContext("2d");
  if (!g) return;
  // dilate the silhouette by stamping it around a circle, then tint white
  for (let a = 0; a < 24; a += 1) {
    const t = (a / 24) * Math.PI * 2;
    g.drawImage(cutout, outline + Math.cos(t) * outline, outline + Math.sin(t) * outline);
  }
  g.globalCompositeOperation = "source-in";
  g.fillStyle = "#ffffff";
  g.fillRect(0, 0, c.width, c.height);
  g.globalCompositeOperation = "source-over";
  g.drawImage(cutout, outline, outline);
  stickerCanvas = c;
}

let bubbleShadow: HTMLCanvasElement | null = null;
let bubbleShadowKey = "";
function drawBubbleShadow(ctx: CanvasRenderingContext2D,x:number,y:number,w:number,h:number,radius:number) {
  const key=[w,h,radius].join(":"),scale=4,pad=64;
  bubbleShadow??=document.createElement("canvas");
  if(key!==bubbleShadowKey) {
    bubbleShadow.width=Math.ceil((w+pad*2)*scale);bubbleShadow.height=Math.ceil((h+pad*2)*scale);
    const g=bubbleShadow.getContext("2d")!;g.setTransform(scale,0,0,scale,pad*scale,pad*scale);
    squircle(g,0,0,w,h,radius);g.shadowColor="rgba(0,0,0,0.35)";g.shadowBlur=24*scale;g.shadowOffsetY=10*scale;g.fillStyle="#000";g.fill();
    bubbleShadowKey=key;
  }
  ctx.drawImage(bubbleShadow,x-pad,y-pad,bubbleShadow.width/scale,bubbleShadow.height/scale);
}

let shadowSprite: HTMLCanvasElement | null = null;
let shadowKey = "";
let shadowSource: HTMLImageElement | HTMLCanvasElement | null = null;

/** The portrait changes at 24fps; retain its soft shadow between decoded frames. */
function drawShadowedPortrait(ctx: CanvasRenderingContext2D, source: HTMLImageElement | HTMLCanvasElement, x: number, y: number, width: number, stickerInset: number) {
  const scale=source.width/width;
  const pad=Math.ceil(54*scale), key=[decodedFrame,scale,source.width,source.height].join(":");
  shadowSprite??=document.createElement("canvas");
  if(key!==shadowKey || shadowSource!==source) {
    const w=source.width+pad*2,h=source.height+pad*2;
    if(shadowSprite.width!==w || shadowSprite.height!==h){shadowSprite.width=w;shadowSprite.height=h;}
    const g=shadowSprite.getContext("2d")!;
    g.clearRect(0,0,w,h);g.shadowColor="rgba(0,0,0,0.35)";g.shadowBlur=22*scale;g.shadowOffsetY=10*scale;
    g.drawImage(source,pad,pad);shadowKey=key;shadowSource=source;
  }
  ctx.shadowColor="transparent";
  ctx.drawImage(shadowSprite,x-stickerInset-pad/scale,y-stickerInset-pad/scale,shadowSprite.width/scale,shadowSprite.height/scale);
}

/* ---------- overlay ---------- */

const ease = (t: number) => {
  const x = Math.max(0, Math.min(1, t));
  return 1 - Math.pow(1 - x, 3);
};

/** Draws the camera overlay in the bottom-right of `comp` (world units). */
/**
 * The camera state at timeline `time`: which clip is under the playhead, and
 * how long ago removal took effect (the clip boundary, or a live toggle
 * inside the second clip, whichever happened last).
 */
export function cameraAt(cam: CameraSettings, time: number, now: number) {
  if (time < cam.split) return { remove: false, sticker: false, since: 1e9, key: "clip-1" };
  const sinceBoundary = (time - cam.split) * 1000;
  const sinceToggle = now - cam.changedAt;
  const live = sinceToggle >= 0 && sinceToggle < sinceBoundary;
  return {
    remove: cam.remove,
    sticker: cam.sticker,
    since: live ? sinceToggle : sinceBoundary,
    key: live ? `toggle:${cam.changedAt}` : `split:${cam.split}`,
  };
}

export function drawCamera(
  ctx: CanvasRenderingContext2D,
  comp: { x: number; y: number; w: number; h: number },
  settings: CameraSettings,
  time: number,
  now: number,
  reducedMotion = false,
  zoomScale = 1,
) {
  if (!settings.show) return;
  updateVideoFrame();
  if (!original) return;
  const at = cameraAt(settings, time, now);
  const cam = { ...settings, remove: at.remove, sticker: at.sticker };
  // particles are taken from the frame where removal starts
  if (cam.remove && at.since < DISSOLVE_MS && at.key !== dissolveKey) {
    dissolveKey = at.key;
    particles = null;
    prepareDissolve();
  }
  if (cam.sticker) prepareSticker();
  const aspect = original.width / original.height;
  const baseH = comp.h * (0.26 + cam.size * 0.2);
  const baseW = baseH * aspect;
  const margin = comp.h * 0.045;
  const since = reducedMotion ? 1e9 : at.since;
  // 0 = framed bubble, 1 = background removed
  const settle = Math.max(0, Math.min(1, springStep(SPRINGS.effect, since / 1000)));
  const removed = !cutout ? 0 : cam.remove ? settle : 1 - settle;
  // position follows the camera clip (right / left), the size shrinks while
  // the screen is zoomed in, anchored on the corner the camera sits in
  const side = sideAt(settings, time);
  const bx = comp.x + comp.w - baseW - margin + (comp.x + margin - (comp.x + comp.w - baseW - margin)) * side;
  const by = comp.y + comp.h - baseH - margin * (1 - removed);
  const scale = cameraAutoScale(zoomScale);
  const ax = bx + baseW * (1 - side);
  const ay = by + baseH;
  const w = baseW * scale;
  const h = baseH * scale;
  const x = ax + (bx - ax) * scale;
  const y = ay + (by - ay) * scale;
  const radius = h * 0.2;

  // framed bubble with its own background, fading as removal takes over
  if (removed < 1) {
    ctx.save();
    ctx.globalAlpha *= 1 - removed;
    drawBubbleShadow(ctx,x,y,w,h,radius);
    ctx.restore();
    ctx.save();
    ctx.globalAlpha *= cam.remove ? 1 - removed : 1;
    squircle(ctx, x, y, w, h, radius);
    ctx.clip();
    ctx.drawImage(original, x, y, w, h);
    ctx.restore();
    ctx.save();
    ctx.globalAlpha *= 1 - removed;
    squircle(ctx, x, y, w, h, radius);
    ctx.strokeStyle = "rgba(255,255,255,0.18)";
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.restore();
  }
  if (removed > 0 && cutout) {
    ctx.save();
    ctx.globalAlpha *= removed;
    if (cam.sticker && stickerCanvas) {
      const o=(stickerCanvas.width-cutout.width)/2, k=w/cutout.width;
      drawShadowedPortrait(ctx,stickerCanvas,x,y,stickerCanvas.width*k,o*k);
    } else drawShadowedPortrait(ctx,cutout,x,y,w,0);
    ctx.restore();
  }
  // the dissolve plays once, right after removal is switched on
  if (cam.remove && since < DISSOLVE_MS && particles) {
    const canvas = renderDissolve(since);
    if (canvas) {
      const k = w / dissolveW;
      ctx.save();
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(canvas, x - marginX * k, y - marginY * k, canvasW * k, canvasH * k);
      ctx.restore();
    }
  }
}
