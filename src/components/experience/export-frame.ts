/** A finished export frame. Static mesh and shadows are retained per device. */
import { meshTextureVersion, paintFrameBackground } from "./background-presets";
import { rr } from "./kit";
import { CH, CW, drawRecordedApp } from "./recorded-app";

const BG = { kind: "mesh" as const, gradient: 0, mesh: 0, color: "#000000" };
const backdrops = new WeakMap<CanvasRenderingContext2D, { key: string; canvas: HTMLCanvasElement }>();

export function renderExportFrame(ctx: CanvasRenderingContext2D, w: number, h: number, time: number, portrait: boolean) {
  const pad = Math.min(w, h) * 0.09;
  const panel = { x: 700, y: 8, w: 572, h: 784 };
  const scale = portrait ? (w * 0.9) / panel.w : Math.min((w - pad * 2) / CW, (h - pad * 2) / CH);
  const x = portrait ? (w - panel.w * scale) / 2 - panel.x * scale : (w - CW * scale) / 2;
  const y = portrait ? h * 0.5 - (panel.y + panel.h * 0.42) * scale : (h - CH * scale) / 2;
  const clip = portrait
    ? { x: (w - panel.w * scale) / 2, y: Math.max(h * 0.08, y + panel.y * scale), w: panel.w * scale, h: Math.min(h * 0.84, panel.h * scale), r: 14 }
    : { x, y, w: CW * scale, h: CH * scale, r: 12 * scale };
  const key = `${w}:${h}:${portrait}:${meshTextureVersion()}`;
  let backdrop = backdrops.get(ctx);
  if (backdrop?.key !== key) {
    const canvas = backdrop?.canvas ?? document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const b = canvas.getContext("2d")!;
    paintFrameBackground(b, { x: 0, y: 0, w, h }, BG);
    if (!portrait) {
      rr(b, clip.x, clip.y, clip.w, clip.h, clip.r);
      b.shadowColor = "rgba(0,0,0,0.45)";
      b.shadowBlur = 40 * scale;
      b.shadowOffsetY = 16 * scale;
      b.fillStyle = "#000";
      b.fill();
    }
    backdrop = { key, canvas };
    backdrops.set(ctx, backdrop);
  }
  ctx.save();
  ctx.clearRect(0, 0, w, h);
  ctx.drawImage(backdrop.canvas, 0, 0);
  if (portrait) {
    // Keep the portrait's fill and clip in the same context: splitting them
    // across cached layers changes antialiasing at the rounded window edge.
    rr(ctx, clip.x, clip.y, clip.w, clip.h, clip.r);
    ctx.shadowColor = "rgba(0,0,0,0.45)";
    ctx.shadowBlur = 30;
    ctx.shadowOffsetY = 12;
    ctx.fillStyle = "#000";
    ctx.fill();
    ctx.shadowColor = "transparent";
    ctx.clip();
  }
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  drawRecordedApp(ctx, time);
  ctx.restore();
}
