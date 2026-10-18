import { CAPTION } from "./story-timing";
import { measureWidth } from "./kit";
/**
 * The editor preview. The scene (background + recorded screen) is drawn with
 * canvas 2D at device resolution, then a WebGL pass applies the client's
 * optical effects: camera motion blur, click wave, glass loupe, and the
 * spatial (3D) camera with depth of field. Cursor and captions are composed
 * afterwards, as in the client's pipeline.
 */
import {
  COMP,
  type EditorState,
  type Rect,
  activeZoom,
  type ZoomClip,
  zoomAt,
  zoomScaleAt,
  horizonOf,
  padShadow,
  captionTokens,
  clamp,
  ease,
  lerp,
  screenRectIn,
} from "./editor";
import { font, rr, squircle } from "./kit";
import { paintFrameBackground, meshTextureVersion } from "./background-presets";
import { CH, CURSOR_KEYS, CURSOR_SIZE, CW, appThemeKey, cursorAt, cursorPressScale, drawCursor, drawRecordedApp } from "./recorded-app";
import { drawKeyOverlay } from "./keyboard";
import { drawCamera } from "./camera";
import { drawShadow } from "./panel-shadow";
import { FrameBlurGL, PreviewGL, type PreviewLayer, type CursorLayer } from "./preview-gl";

const WAVE_MS = 0.6;
const FRAME = 1 / 60; // motion is measured over one 60 fps frame, as in the client

type Cam2D = { s: number; ox: number; oy: number };
type Screen = ReturnType<typeof screenRectIn>;

/**
 * Where the camera aims when it follows the cursor: the cursor path passed
 * through a critically damped spring (impulse response t·e^(−t/τ)), sampled
 * statelessly so scrubbing and playback agree. Quick flicks no longer jerk
 * the camera around; it glides after the hand like the client's camera spring.
 */
export function cameraTarget(time: number) {
  const tau = 0.2;
  const h = 1 / 60;
  let x = 0;
  let y = 0;
  let wsum = 0;
  for (let i = 0; i <= 72; i += 1) {
    const age = i * h;
    const w = (age + h * 0.5) * Math.exp(-age / tau);
    const c = cursorAt(time - age);
    x += c.x * w;
    y += c.y * w;
    wsum += w;
  }
  return { x: x / wsum, y: y / wsum };
}

/** The view a 2D clip settles on: its scale and the view centre (world). */
function clipView(clip: ZoomClip, time: number, screen: Screen) {
  const comp = COMP;
  const focus = clip.manual ? clip.focus : cameraTarget(time);
  const S = Math.max(1, clip.zoom);
  // the composition shrunk by S, centred on the focus but kept inside the
  // recorded screen so no background shows at full zoom
  const w1 = comp.w / S;
  const h1 = comp.h / S;
  const fx = screen.x + focus.x * screen.s;
  const fy = screen.y + focus.y * screen.s;
  const keep = (v: number, lo: number, hi: number, half: number) => (hi - lo < half * 2 ? (lo + hi) / 2 : Math.min(hi - half, Math.max(lo + half, v)));
  return { S, cx: keep(fx, screen.x, screen.x + screen.w, w1 / 2), cy: keep(fy, screen.y, screen.y + screen.h, h1 / 2) };
}

export function camera2D(state: EditorState, time: number, screen: Screen): Cam2D {
  const comp = COMP;
  const z = zoomAt(state, time);
  if (!z || z.clip.mode !== 0) return { s: 1, ox: 0, oy: 0 };
  const c0x = comp.x + comp.w / 2;
  const c0y = comp.y + comp.h / 2;
  // A camera frame as a transform: screen = world · s + o. `at` is when an
  // auto clip samples the cursor: like the client, entry targets stay
  // precomputed (where the cursor will be when the move lands) and the
  // outgoing / exiting frame stays where it was, so a move is never bent
  // by the cursor wandering mid-transition.
  const frameOf = (clip: ZoomClip, at: number) => {
    const v = clipView(clip, at, screen);
    return { s: v.S, ox: c0x - v.cx * v.S, oy: c0y - v.cy * v.S };
  };
  const identity = { s: 1, ox: 0, oy: 0 };
  // CameraSpringTimeline.zoomTransitionFrame: scale and offset interpolate
  // linearly with the spring progress, so every point on screen (the zoom
  // centre included) travels along a straight line, never a curve.
  const mix = (a: Cam2D, b: Cam2D, t: number): Cam2D => ({
    s: a.s + (b.s - a.s) * t,
    ox: a.ox + (b.ox - a.ox) * t,
    oy: a.oy + (b.oy - a.oy) * t,
  });
  const landing = (clip: ZoomClip) => Math.max(time, Math.min(clip.end, clip.start + horizonOf(clip)));
  if (z.from && z.to) {
    const start = mix(identity, frameOf(z.from, Math.min(z.from.end, z.to.start)), z.fromF ?? 1);
    return mix(start, frameOf(z.to, landing(z.to)), z.u);
  }
  const at = time >= z.clip.end ? z.clip.end : landing(z.clip);
  return mix(identity, frameOf(z.clip, at), z.f);
}

/** Perspective camera for the spatial zoom; returns a projector and depth. */
export function spatial(state: EditorState, time: number, screen: Screen) {
  const z = activeZoom(state, time);
  if (!z || z.clip.mode !== 1) return null;
  const clip = z.clip;
  const transition = zoomAt(state, time);
  const fromFlat = transition?.from?.mode === 0 ? transition.from : null;
  // The client's incoming frame carries scale/offset while spatial presentation blends in.
  const incoming = fromFlat ? camera2D(state, clip.start - 1e-7, screen) : null;
  const blend = incoming ? transition!.u : z.f;
  const span = Math.max(0.0001, clip.end - clip.start);
  const orbit = clamp((time - clip.start) / span);
  const yaw = ((lerp(-30, -10, ease(orbit)) * Math.PI) / 180) * blend;
  const pitch = ((lerp(16, 8, orbit) * Math.PI) / 180) * blend;
  const push = zoomScaleAt(state, time);
  const focal = lerp(1100, 2400, clip.focal);
  const aim = cameraTarget(time);
  const fu = aim.x / CW;
  const fv = aim.y / CH;
  const cx = screen.x + screen.w / 2;
  const cy = screen.y + screen.h / 2;
  const raw = (u: number, v: number) => {
    const px = (u - 0.5) * screen.w * push;
    const py = (v - 0.5) * screen.h * push;
    const x1 = px * Math.cos(yaw);
    const z1 = -px * Math.sin(yaw);
    const y2 = py * Math.cos(pitch) - z1 * Math.sin(pitch);
    const z2 = py * Math.sin(pitch) + z1 * Math.cos(pitch);
    const k = focal / (focal + z2);
    return { x: x1 * k, y: y2 * k, d: z2 };
  };
  // keep the focus point drifting towards the centre of the frame
  const f = raw(fu, fv);
  const shiftX = incoming ? lerp(cx * incoming.s + incoming.ox - cx, -f.x * 0.75, blend) : -f.x * 0.75 * blend;
  const shiftY = incoming ? lerp(cy * incoming.s + incoming.oy - cy, -f.y * 0.75, blend) : -f.y * 0.75 * blend;
  const project = (u: number, v: number) => {
    const r = raw(u, v);
    return { x: cx + r.x + shiftX, y: cy + r.y + shiftY, d: r.d };
  };
  return { project, focusDepth: f.d, f: blend, zoomScale: push, aperture: 1 };
}

function clicks(time: number) {
  const out: Array<{ t: number; x: number; y: number }> = [];
  for (const key of CURSOR_KEYS) {
    const age = time - key.t;
    if (age > 0 && age < WAVE_MS) out.push({ t: age / WAVE_MS, x: key.x, y: key.y });
  }
  return out;
}

/** Homography mapping unit square (u, v) to the four projected corners. */
function homography(p: Array<{ x: number; y: number }>) {
  const [p0, p1, p2, p3] = p;
  const dx1 = p1.x - p2.x;
  const dx2 = p3.x - p2.x;
  const dy1 = p1.y - p2.y;
  const dy2 = p3.y - p2.y;
  const sx = p0.x - p1.x + p2.x - p3.x;
  const sy = p0.y - p1.y + p2.y - p3.y;
  const den = dx1 * dy2 - dx2 * dy1;
  const g = (sx * dy2 - dx2 * sy) / den;
  const h = (dx1 * sy - sx * dy1) / den;
  const a = p1.x - p0.x + g * p1.x;
  const b = p3.x - p0.x + h * p3.x;
  const c = p0.x;
  const d = p1.y - p0.y + g * p1.y;
  const e = p3.y - p0.y + h * p3.y;
  const f = p0.y;
  // [a b c; d e f; g h 1] maps (u, v, 1)
  return [a, b, c, d, e, f, g, h, 1];
}

function invert3(m: number[]) {
  const [a, b, c, d, e, f, g, h, i] = m;
  const A = e * i - f * h;
  const B = -(d * i - f * g);
  const C = d * h - e * g;
  const det = a * A + b * B + c * C;
  const k = 1 / det;
  return [
    A * k, -(b * i - c * h) * k, (b * f - c * e) * k,
    B * k, (a * i - c * g) * k, -(a * f - c * d) * k,
    C * k, -(a * h - b * g) * k, (a * e - b * d) * k,
  ];
}

/** The recorded screen as a texture for the 3D plane, re-rendered when time changes. */
let screenTex: HTMLCanvasElement | null = null;
let screenTexTime = Number.NaN;
let screenTexTheme = -1;
let screenTexVersion = 0;
function screenTexture(time: number) {
  if (!screenTex) {
    screenTex = document.createElement("canvas");
    screenTex.width = CW * 1.5;
    screenTex.height = CH * 1.5;
  }
  if (time !== screenTexTime || appThemeKey() !== screenTexTheme) {
    const ctx = screenTex.getContext("2d");
    if (ctx) {
      ctx.setTransform(1.5, 0, 0, 1.5, 0, 0);
      ctx.clearRect(0, 0, CW, CH);
      drawRecordedApp(ctx, time);
    }
    screenTexTime = time;
    screenTexTheme = appThemeKey();
    screenTexVersion += 1;
  }
  return { canvas: screenTex, version: screenTexVersion };
}

export class Preview {
  private base = document.createElement("canvas");
  private optical = document.createElement("canvas");
  private sprite = document.createElement("canvas");
  private backdrop = document.createElement("canvas");
  private backdropKey = "";
  private sourceSettings = "";
  private sourceTime = Number.NaN;
  private gl: PreviewGL | null;
  private cursorGL: FrameBlurGL | null = null;

  get canCompose() { return this.shared && !!this.gl; }
  private shared = false;
  gpuLayer: PreviewLayer | null = null;
  cursorLayer: CursorLayer | null = null;

  constructor(shared?: WebGL2RenderingContext) {
    this.shared = !!shared;
    let gl: PreviewGL | null = null;
    try {
      gl = new PreviewGL(shared);
    } catch {
      gl = null;
    }
    this.gl = gl;
    try {
      this.cursorGL = new FrameBlurGL(false, this.canCompose ? shared : undefined);
    } catch {
      this.cursorGL = null;
    }
  }

  dispose() {
    for(const canvas of captionSprites.values())canvas.width=canvas.height=1;captionSprites.clear();captionPixels=0;captionSprite.canvas=null;captionSprite.key="";captionSprite.scale=0; this.gl?.dispose(); this.cursorGL?.dispose(); }

  /**
   * Draws the preview into `ctx` (world transform active) at `pixelsPerUnit`
   * device pixels per world unit.
   */
  draw(ctx: CanvasRenderingContext2D, state: EditorState, pixelsPerUnit: number, radius: number, reducedMotion = false, renderSource = true) {
    this.gpuLayer = null;
    this.cursorLayer = null;
    const comp = COMP;
    const time = state.time;
    // Reuse only an identical source frame (e.g. a paused preview while the
    // outer camera moves). Advancing time always paints; there is no rate cap.
    const settings = JSON.stringify([state.background, state.zoomClips, state.motionBlur, state.captions, state.captionText, appThemeKey(), meshTextureVersion()]);
    renderSource = time !== this.sourceTime || settings !== this.sourceSettings || !this.gl?.texture;
    // Resolution steps in quarter octaves, so the buffers are not reallocated
    // (and the content re-quantised) on every frame of a camera zoom; the
    // drawing scale is derived from the integer buffer size so it maps exactly.
    // up to 3000 px across: the closest chapter framings reach about 2x
    const wanted = Math.max(0.2, Math.min(pixelsPerUnit, 3000 / comp.w));
    const kq = Math.min(3000 / comp.w, Math.pow(2, Math.ceil(Math.log2(wanted) * 4) / 4));
    const pw = Math.max(2, Math.ceil(comp.w * kq));
    const ph = Math.max(2, Math.ceil(comp.h * kq));
    const k = pw / comp.w;
    const ky = ph / comp.h;
    const caption = state.captions.background > 0 ? captionLayout(ctx, state, comp) : undefined;
    const screen = screenRectIn(comp, state.background.padding);
    const cam = camera2D(state, time, screen);
    const prev = camera2D(state, time - FRAME, screen);
    const sp = spatial(state, time, screen);
    const z = activeZoom(state, time);
    const lensOn = !!(z && z.clip.mode === 2);
    const screenRadius = (4 + state.background.radius * 26) * screen.s * 1.6;

    // ---- base scene (world → base pixels) ----
    if (this.base.width !== pw || this.base.height !== ph) {
      renderSource = true;
      this.base.width = pw;
      this.base.height = ph;
    }
    const b = this.base.getContext("2d");
    if (!b) return;
    const toBase = (c: CanvasRenderingContext2D, extra?: (c: CanvasRenderingContext2D) => void) => {
      c.setTransform(1, 0, 0, 1, 0, 0);
      c.clearRect(0, 0, c.canvas.width, c.canvas.height);
      c.setTransform(k, 0, 0, ky, -comp.x * k, -comp.y * ky);
      extra?.(c);
    };
    if (renderSource) {
      toBase(b);
      this.drawScene(b, state, screen, cam, !!sp, screenRadius, sp);
    }

    // ---- optical source for the loupe: the scene magnified about the lens ----
    let lens: { x: number; y: number; r: number; presence: number; box: Rect; mag: number; samplingRatio: number } | null = null;
    const cursor = cursorAt(time);
    const curWorld = sp
      ? sp.project(cursor.x / CW, cursor.y / CH)
      : { x: (screen.x + cursor.x * screen.s) * cam.s + cam.ox, y: (screen.y + cursor.y * screen.s) * cam.s + cam.oy, d: 0 };
    if (lensOn && z) {
      // Match EvaluatedGlassLoupe: grow the content from its native 1x size
      // and scale the aperture with it, retaining the same source footprint.
      const zz = zoomAt(state, time);
      const morph = zz?.from && zz.to ? zz : null;
      const size = morph ? lerp(morph.from!.lensSize, morph.to!.lensSize, morph.u) : z.clip.lensSize;
      const target = morph ? lerp(morph.from!.zoom, morph.to!.zoom, morph.u) : z.clip.zoom;
      const presence = morph ? lerp(morph.fromF ?? 1, 1, morph.u) : z.f;
      const mag = 1 + (target - 1) * presence;
      const r = comp.w * (0.05 + size * 0.2) * (mag / target);
      // Keep full-resolution backing through entry/exit and joined clips;
      // the shader resolves the animated magnification via sampling coordinates.
      const backingMag = morph ? Math.max(morph.from!.zoom, morph.to!.zoom) : target;
      const samplingRatio = backingMag / mag;
      // optical buffer sized for the lens's full radius and rounded up, so it
      // keeps its size while the lens opens and closes
      const backingRatio = morph ? backingMag / Math.min(morph.from!.zoom, morph.to!.zoom) : 1;
      const full = comp.w * (0.05 + Math.max(size, 0.62) * 0.2) * 2.6 * backingRatio;
      const side = Math.ceil((full * k) / 128) * 128 / k;
      const box = { x: curWorld.x - side / 2, y: curWorld.y - side / 2, w: side, h: side };
      lens = { x: curWorld.x, y: curWorld.y, r, presence, box, mag, samplingRatio };
      const ow = Math.max(2, Math.round(box.w * k));
      if (this.optical.width !== ow || this.optical.height !== ow) {
        this.optical.width = ow;
        this.optical.height = ow;
      }
      const o = this.optical.getContext("2d");
      if (o && renderSource) {
        o.setTransform(1, 0, 0, 1, 0, 0);
        o.clearRect(0, 0, ow, ow);
        // world q → ((q - c) * backingMag + c - box) * k
        o.setTransform(k * backingMag, 0, 0, k * backingMag, (curWorld.x * (1 - backingMag) - box.x) * k, (curWorld.y * (1 - backingMag) - box.y) * k);
        // The shader never samples beyond this aperture (refraction bends inward).
        // Cull source tiles against those exact pixels, not the oversized backing canvas.
        const sampleRadius = (r * k + 2) * samplingRatio;
        this.drawScene(o, state, screen, cam, false, screenRadius, null, {
          x: ow / 2 - sampleRadius, y: ow / 2 - sampleRadius,
          w: sampleRadius * 2, h: sampleRadius * 2,
        });
      }
    }

    // ---- GPU effects ----
    let output: CanvasImageSource = this.base;
    if (this.gl && renderSource) {
      const A = prev.s / cam.s;
      const motion = {
        a: A,
        bx: (prev.ox - cam.ox * A - comp.x * (1 - A)) * k,
        by: (prev.oy - cam.oy * A - comp.y * (1 - A)) * k,
      };
      const waves = clicks(time).map((w) => {
        const p = sp
          ? sp.project(w.x / CW, w.y / CH)
          : { x: (screen.x + w.x * screen.s) * cam.s + cam.ox, y: (screen.y + w.y * screen.s) * cam.s + cam.oy };
        return { x: (p.x - comp.x) * k, y: (p.y - comp.y) * k, progress: w.t };
      });
      let plane = null;
      if (sp) {
        const corners = [sp.project(0, 0), sp.project(1, 0), sp.project(1, 1), sp.project(0, 1)];
        const px = corners.map((c) => ({ x: (c.x - comp.x) * k, y: (c.y - comp.y) * k }));
        const inv = invert3(homography(px));
        const depths = corners.map((c) => c.d);
        const range = Math.max(1, Math.max(...depths) - Math.min(...depths));
        plane = {
          inverse: inv,
          depths,
          focusDepth: sp.focusDepth,
          range,
          coc: 30 * k * sp.aperture * sp.f,
          radius: screenRadius / screen.s,
          ...(() => {
            const tex = screenTexture(time);
            return { texture: tex.canvas, version: tex.version };
          })(),
        };
      }
      // The shader is exactly an identity operation without motion, waves,
      // a loupe or a projected plane. Present the already-rendered base directly.
      const blurOn = state.motionBlur && (Math.abs(motion.a - 1) > 1e-7 || Math.abs(motion.bx) > 1e-5 || Math.abs(motion.by) > 1e-5);
      if (this.shared || blurOn || waves.length > 0 || lens || plane || caption) output = this.gl.render({
        base: this.base,
        width: pw,
        height: ph,
        pixelScale: Math.min(pw, ph) / 1080,
        caption: caption ? { x: (caption.bx - comp.x) * k, y: (caption.by - comp.y) * ky, w: caption.boxW * k, h: caption.boxH * ky, radius: caption.fs * 0.7 * k, alpha: caption.a, mode: state.captions.background as 1 | 2 } : null,
        motion: state.motionBlur ? motion : { a: 1, bx: 0, by: 0 },
        blur: 0.5,
        waves,
        lens: lens
          ? {
              x: (lens.x - comp.x) * k,
              y: (lens.y - comp.y) * k,
              r: lens.r * k,
              presence: lens.presence,
              samplingRatio: lens.samplingRatio,
              box: [(lens.box.x - comp.x) * k, (lens.box.y - comp.y) * k, lens.box.w * k, lens.box.h * k],
              optical: this.optical,
            }
          : null,
        plane,
      });
    }

    if (renderSource) {
      this.sourceTime = time;
      this.sourceSettings = settings;
    }

    ctx.save();
    squircle(ctx, comp.x, comp.y, comp.w, comp.h, radius);
    ctx.clip();
    if (this.shared && this.gl?.texture) {
      const m = ctx.getTransform();
      this.gpuLayer = { u: pw/this.gl.targetSize!.w, v: ph/this.gl.targetSize!.h, texture: this.gl.texture, x: m.e + comp.x * m.a, y: m.f + comp.y * m.d, w: comp.w * m.a, h: comp.h * m.d, radius: radius * m.a };
      ctx.save(); ctx.globalCompositeOperation = "destination-out";
      ctx.fillStyle = "#000";
      ctx.fillRect(comp.x, comp.y, comp.w, comp.h); ctx.restore();
    } else ctx.drawImage(output, comp.x, comp.y, comp.w, comp.h);
    if (!this.gl && caption && state.captions.background === 1) {
      // Canvas fallback also blurs the footage, before the sharp text is composed.
      ctx.save();
      rr(ctx, caption.bx, caption.by, caption.boxW, caption.boxH, caption.fs * 0.7);
      ctx.clip();
      ctx.globalAlpha *= caption.a;
      const matrix = ctx.getTransform();
      ctx.filter = `blur(${caption.fs * 0.7 * 0.65 * Math.hypot(matrix.a, matrix.b)}px)`;
      ctx.drawImage(output, comp.x, comp.y, comp.w, comp.h);
      ctx.restore();
    }

    // ---- cursor, with the client's directional motion blur ----
    const before = cursorAt(time - FRAME);
    const prevWorld = sp
      ? sp.project(before.x / CW, before.y / CH)
      : { x: (screen.x + before.x * screen.s) * prev.s + prev.ox, y: (screen.y + before.y * screen.s) * prev.s + prev.oy };
    let glyph = screen.s * cam.s;
    if (sp) {
      const u = cursor.x / CW;
      const v = cursor.y / CH;
      const a = sp.project(u, v);
      const b2 = sp.project(u + 0.02, v);
      glyph = (Math.hypot(b2.x - a.x, b2.y - a.y) / (0.02 * CW));
    } else if (lensOn && lens) {
      glyph = screen.s * (1 + (lens.mag - 1) * 0.3);
    }
    glyph *= cursorPressScale(time);
    // motion over ~1.5 frames of exposure; pixels behind the cursor sample
    // forward into it, so the streak trails the direction of travel
    let mx = (curWorld.x - prevWorld.x) * 1.5;
    let my = (curWorld.y - prevWorld.y) * 1.5;
    const mlen = Math.hypot(mx, my);
    const cap = 46 * glyph;
    if (mlen > cap) {
      mx *= cap / mlen;
      my *= cap / mlen;
    }
    this.drawCursorSprite(ctx, curWorld.x, curWorld.y, glyph, k, state.motionBlur ? mx : 0, state.motionBlur ? my : 0);
    ctx.restore();

    ctx.save();
    squircle(ctx, comp.x, comp.y, comp.w, comp.h, radius);
    ctx.clip();
    // the camera overlay shrinks with the screen camera's zoom (2D scale, or the 3D push)
    const zoomScale = sp ? sp.zoomScale : cam.s;
    drawCamera(ctx, comp, state.camera, time, performance.now(), reducedMotion, zoomScale);
    const captionBounds = drawCaptions(ctx, state, comp, !!this.gl);
    drawKeyOverlay(ctx, comp, time, state.keys, state.captions.bottom ? captionBounds?.y : undefined);
    ctx.restore();
  }

  /** Renders the cursor into a sprite, blurs it along its motion on the GPU, then composites it. */
  private drawCursorSprite(ctx: CanvasRenderingContext2D, x: number, y: number, glyph: number, k: number, mx: number, my: number) {
    const size = CURSOR_SIZE * glyph;
    const pad = 10 * glyph;
    const x0 = Math.min(x, x - mx) - pad;
    const y0 = Math.min(y, y - my) - pad;
    const x1 = Math.max(x, x - mx) + size + pad;
    const y1 = Math.max(y, y - my) + size + pad;
    const pw = Math.max(64, Math.ceil(((x1 - x0) * k) / 64) * 64);
    const ph = Math.max(64, Math.ceil(((y1 - y0) * k) / 64) * 64);
    const moving = Math.hypot(mx, my) * k > 0.75 && this.cursorGL;
    if (!moving) {
      drawCursor(ctx, x, y, glyph, ctx.getTransform().a);
      return;
    }
    if (this.sprite.width !== pw || this.sprite.height !== ph) {
      this.sprite.width = pw;
      this.sprite.height = ph;
    }
    const s = this.sprite.getContext("2d");
    if (!s || !this.cursorGL) return;
    s.setTransform(1, 0, 0, 1, 0, 0);
    s.clearRect(0, 0, pw, ph);
    s.setTransform(k, 0, 0, k, -x0 * k, -y0 * k);
    drawCursor(s, x, y, glyph, k);
    // constant motion field (A = 1): every pixel samples back along the path
    const out = this.cursorGL.render(this.sprite, 1, mx * k, my * k, 1e6, {
      mode: 0,
      start: 0,
      full: 0,
      radius: 0,
      strength: 0,
      color: [0, 0, 0],
      tint: 0,
    });
    if (this.canCompose && this.cursorGL.texture) {
      // Keep the original 25-tap blur on the same GPU as the final compositor.
      // No WebGL canvas readback into 2D and subsequent re-upload is needed.
      const m = ctx.getTransform(), target = this.cursorGL.targetSize!;
      this.cursorLayer = {
        texture: this.cursorGL.texture, u: pw / target.w, v: ph / target.h,
        x: m.e + x0 * m.a, y: m.f + y0 * m.d, w: pw / k * m.a, h: ph / k * m.d,
        alpha: ctx.globalAlpha,
      };
    } else ctx.drawImage(out, x0, y0, pw / k, ph / k);
  }

  private drawScene(
    c: CanvasRenderingContext2D,
    state: EditorState,
    screen: Screen,
    cam: Cam2D,
    planeMode: boolean,
    screenRadius: number,
    sp: ReturnType<typeof spatial>,
    viewport?: Rect,
  ) {
    c.save();
    c.translate(cam.ox, cam.oy);
    c.scale(cam.s, cam.s);
    // the Background panel's Angle / Strength pads, in world units
    const shade = padShadow(state.background.shadowAngle, state.background.shadowStrength, screen.s);
    if (planeMode && sp) {
      paintFrameBackground(c, COMP, state.background.frame);
      // The plane itself is rendered on the GPU; only its soft shadow lives
      // here. Its outline is the plane's rounded rectangle projected through
      // the same camera, and only the shadow is painted (the shape is drawn
      // far off-canvas and its shadow offset back), so no hard-cornered fill
      // can peek out from behind the plane's rounded corners.
      const rx = screenRadius / screen.s / CW;
      const ry = screenRadius / screen.s / CH;
      const outline: Array<{ x: number; y: number }> = [];
      const corner = (cu: number, cv: number, from: number) => {
        for (let i = 0; i <= 10; i += 1) {
          const a = from + (i / 10) * (Math.PI / 2);
          outline.push(sp.project(cu + Math.cos(a) * rx, cv + Math.sin(a) * ry));
        }
      };
      corner(1 - rx, ry, -Math.PI / 2);
      corner(1 - rx, 1 - ry, 0);
      corner(rx, 1 - ry, Math.PI / 2);
      corner(rx, ry, Math.PI);
      const far = 100000;
      const m = c.getTransform();
      c.beginPath();
      outline.forEach((p, i) => (i ? c.lineTo(p.x + far, p.y) : c.moveTo(p.x + far, p.y)));
      c.closePath();
      // the tilted plane reads further from its backdrop: a slightly larger shadow
      c.shadowColor = `rgba(0,0,0,${Math.min(1, shade.alpha * 1.2)})`;
      c.shadowBlur = shade.blur * 1.4 * m.a;
      c.shadowOffsetX = (-far + shade.ox * 1.4) * m.a;
      c.shadowOffsetY = shade.oy * 1.4 * m.d;
      c.fillStyle = "#000";
      c.fill();
      c.shadowColor = "transparent";
      c.shadowOffsetX = 0;
      c.shadowOffsetY = 0;
    } else {
      // At close zoom the opaque recording can completely cover the backing
      // canvas. Do not submit the large backdrop/shadow textures underneath
      // pixels that the recording will replace. Keep a two-pixel guard for AA.
      const m = c.getTransform();
      const view = viewport ?? { x: 0, y: 0, w: c.canvas.width, h: c.canvas.height };
      const covered = (px: number, py: number) => {
        const x = (px - m.e) / m.a, y = (py - m.f) / m.d;
        const r = Math.max(screenRadius, 12 * screen.s);
        const dx = Math.max(screen.x + r - x, 0, x - (screen.x + screen.w - r));
        const dy = Math.max(screen.y + r - y, 0, y - (screen.y + screen.h - r));
        return Math.hypot(dx, dy) < r - 2 / Math.min(m.a, m.d);
      };
      const opaque = [0, 1].every(i => [0, 1].every(j => covered(view.x + i * view.w, view.y + j * view.h)));
      if (!opaque) {
        // the backdrop only holds the background; the shadow is drawn per frame from
        // a cached raster, so dragging the shadow pads never re-bakes this bitmap
        const key = JSON.stringify([state.background.frame, state.background.padding]);
        if (key !== this.backdropKey) {
          const scale = 4;
          const bw=Math.ceil(COMP.w*scale), bh=Math.ceil(COMP.h*scale);
          if(this.backdrop.width!==bw || this.backdrop.height!==bh) { this.backdrop.width=bw;this.backdrop.height=bh; }
          const b = this.backdrop.getContext("2d")!;
          b.setTransform(scale, 0, 0, scale, -COMP.x * scale, -COMP.y * scale);
          paintFrameBackground(b, COMP, state.background.frame);
          this.backdropKey = key;
        }
        c.drawImage(this.backdrop, COMP.x, COMP.y, COMP.w, COMP.h);
        // Shadow only (no filled underlay): a light rim under the window would
        // shimmer against its vector edge whenever the camera zooms.
        drawShadow(c, screen.x, screen.y, screen.w, screen.h, screenRadius, shade.blur, shade.alpha, shade.ox, shade.oy);
      }
      c.save();
      rr(c, screen.x, screen.y, screen.w, screen.h, screenRadius);
      c.clip();
      c.translate(screen.x, screen.y);
      c.scale(screen.s, screen.s);
      drawRecordedApp(c, state.time, viewport);
      c.restore();
    }
    c.restore();
  }
}

/* ---------- read-along captions ---------- */

const captionSprite = { canvas: null as HTMLCanvasElement | null, key: "", scale: 0 };
const captionSprites = new Map<string,HTMLCanvasElement>();
let captionPixels = 0;

function captionLayout(ctx: CanvasRenderingContext2D, state: EditorState, comp: Rect) {
  const time = state.time;
  const capStart = CAPTION.start;
  const capEnd = CAPTION.end;
  if (!(state.captions.enabled && time > capStart - CAPTION.fade && time < capEnd + CAPTION.fade)) return;
  const a = clamp(Math.min((time - (capStart - CAPTION.fade)) / CAPTION.fade, (capEnd + CAPTION.fade - time) / CAPTION.fade));
  const tokens = captionTokens(state.captionText);
  const progress = clamp((time - capStart) / (capEnd - capStart - CAPTION.readTail));
  const fs = Math.round(lerp(14, 22, state.captions.size));
  ctx.font = font(fs, 650);
  const joiner = /\s/.test(state.captionText) ? " " : "";
  const full = tokens.join(joiner);
  const maxW = comp.w * 0.72;
  const lines: string[][] = [[]];
  tokens.forEach((tok) => {
    const line = lines[lines.length - 1];
    const candidate = [...line, tok].join(joiner);
    if (measureWidth(ctx,candidate) > maxW && line.length) lines.push([tok]);
    else line.push(tok);
  });
  const lineH = fs * 1.35;
  const boxW = Math.min(maxW, measureWidth(ctx,full)) + fs * 1.6;
  const boxH = lines.length * lineH + fs * 0.9;
  const bx = comp.x + (comp.w - boxW) / 2;
  const by = state.captions.bottom ? comp.y + comp.h - boxH - comp.h * 0.06 : comp.y + comp.h * 0.06;
  const bounds = { x: bx, y: by, w: boxW, h: boxH };
  return { a, tokens, progress, fs, joiner, lines, lineH, boxW, boxH, bx, by, bounds };
}

export function drawCaptions(ctx: CanvasRenderingContext2D, state: EditorState, comp: Rect, backgroundRendered = false): Rect | undefined {
  const layout = captionLayout(ctx, state, comp);
  if (!layout) return;
  const { a, tokens, progress, fs, joiner, lines, lineH, boxW, boxH, bx, by, bounds } = layout;
  ctx.save();
  const read = state.captions.readAlong ? Math.floor(progress*tokens.length+0.0001) : tokens.length;
  const matrix=ctx.getTransform();
  const scale=Math.max(captionSprite.scale,Math.ceil(Math.max(Math.hypot(matrix.a,matrix.b),Math.hypot(matrix.c,matrix.d))*2)/2);
  const key=JSON.stringify([scale,state.captionText,state.captions,read,comp.w,comp.h,backgroundRendered]);
  const target=ctx, pad=12, x0=bx-pad, y0=by-pad;
  const present=()=>{target.globalAlpha=a;target.drawImage(captionSprite.canvas!,x0,y0,captionSprite.canvas!.width/scale,captionSprite.canvas!.height/scale);target.restore();};
  const cached=captionSprites.get(key);
  if(cached){captionSprites.delete(key);captionSprites.set(key,cached);captionSprite.canvas=cached;present();return bounds;}
  captionSprite.canvas=document.createElement("canvas");
  const width=Math.ceil((boxW+pad*2)*scale),height=Math.ceil((boxH+pad*2)*scale);
  if(captionSprite.canvas.width!==width || captionSprite.canvas.height!==height){captionSprite.canvas.width=width;captionSprite.canvas.height=height;}
  ctx=captionSprite.canvas.getContext("2d")!;
  ctx.setTransform(1,0,0,1,0,0);ctx.clearRect(0,0,width,height);ctx.save();ctx.setTransform(scale,0,0,scale,-x0*scale,-y0*scale);
  ctx.globalAlpha = 1;
  const mode = state.captions.background;
  if (mode > 0 && !backgroundRendered) {
    rr(ctx, bx, by, boxW, boxH, fs * 0.7);
    ctx.fillStyle = mode === 2 ? "rgba(36,36,40,0.5)" : "rgba(10,10,12,0.36)";
    ctx.fill();
    if (mode === 2) {
      const sheen = ctx.createLinearGradient(bx, by, bx, by + boxH);
      sheen.addColorStop(0, "rgba(255,255,255,0.16)");
      sheen.addColorStop(0.5, "rgba(255,255,255,0.03)");
      sheen.addColorStop(1, "rgba(255,255,255,0.08)");
      ctx.fillStyle = sheen;
      ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,0.26)";
      ctx.lineWidth = 1;
      ctx.stroke();
    }
  }
  let n = 0;
  ctx.font = font(fs, 650);
  lines.forEach((line, li) => {
    const lw = measureWidth(ctx,line.join(joiner));
    let x = comp.x + (comp.w - lw) / 2;
    const y = by + fs * 0.45 + lineH * li + lineH / 2;
    line.forEach((tok, ti) => {
      ctx.fillStyle = n < read ? "#ffffff" : `rgba(255,255,255,${state.captions.unread})`;
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      if (mode === 0) {
        ctx.shadowColor = "rgba(0,0,0,0.6)";
        ctx.shadowBlur = 6;
      }
      ctx.fillText(tok, x, y);
      ctx.shadowColor = "transparent";
      x += measureWidth(ctx,tok + (ti < line.length - 1 ? joiner : ""));
      n += 1;
    });
  });
  ctx.restore();
  captionSprite.key=key;captionSprite.scale=scale;
  captionSprites.set(key,captionSprite.canvas);captionPixels+=width*height;
  while((captionPixels>8*1024*1024 || captionSprites.size>32) && captionSprites.size>1){
    const oldest=captionSprites.keys().next().value!, canvas=captionSprites.get(oldest)!;
    captionSprites.delete(oldest);captionPixels-=canvas.width*canvas.height;canvas.width=canvas.height=1;
  }
  present();
  return bounds;
}

/** Prepare every read-along state so highlighting never rasterises new text during scroll. */
export function warmCaptions(state: EditorState,density: number) {
  let stopped=false,idle=0,index=0;
  const count=state.captions.readAlong?captionTokens(state.captionText).length:0;
  const scratch=document.createElement("canvas");scratch.width=scratch.height=1;
  const ctx=scratch.getContext("2d")!;ctx.setTransform(density,0,0,density,0,0);
  const next=()=>{
    if(stopped||index>count){scratch.width=scratch.height=1;return;}
    idle=requestIdleCallback(async()=>{
      if(stopped)return;
      const time=state.time;
      try{state.time=CAPTION.start+(CAPTION.end-CAPTION.start-CAPTION.readTail)*(index+0.001)/Math.max(1,count);drawCaptions(ctx,state,COMP,true);}
      finally{state.time=time;}
      index++;
      if(captionSprite.canvas)try{const bitmap=await createImageBitmap(captionSprite.canvas);bitmap.close();}catch{}
      next();
    });
  };
  if(typeof requestIdleCallback==="function" && typeof createImageBitmap==="function")next();
  return()=>{stopped=true;if(idle)cancelIdleCallback(idle);scratch.width=scratch.height=1;};
}
