/**
 * A finished ScreenCam export frame (mesh background + recorded window), drawn
 * at any size for the device mockups. Landscape frames show the whole
 * window; portrait frames are the vertical export, framed on the issue panel.
 */
import { paintFrameBackground } from "./background-presets";
import { rr } from "./kit";
import { CH, CW, drawRecordedApp } from "./recorded-app";

const BG = { kind: "mesh" as const, gradient: 0, mesh: 0, color: "#000000" };

export function renderExportFrame(ctx: CanvasRenderingContext2D, w: number, h: number, time: number, portrait: boolean) {
  ctx.save();
  ctx.clearRect(0, 0, w, h);
  paintFrameBackground(ctx, { x: 0, y: 0, w, h }, BG);
  if (!portrait) {
    const pad = Math.min(w, h) * 0.09;
    const s = Math.min((w - pad * 2) / CW, (h - pad * 2) / CH);
    const ww = CW * s;
    const hh = CH * s;
    const x = (w - ww) / 2;
    const y = (h - hh) / 2;
    ctx.save();
    rr(ctx, x, y, ww, hh, 12 * s);
    ctx.shadowColor = "rgba(0,0,0,0.45)";
    ctx.shadowBlur = 40 * s;
    ctx.shadowOffsetY = 16 * s;
    ctx.fillStyle = "#000";
    ctx.fill();
    ctx.restore();
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(s, s);
    drawRecordedApp(ctx, time);
    ctx.restore();
  } else {
    // vertical export: the camera is zoomed onto the issue detail panel
    const panel = { x: 700, y: 8, w: 572, h: 784 };
    const s = (w * 0.9) / panel.w;
    const x = (w - panel.w * s) / 2 - panel.x * s;
    const y = h * 0.5 - (panel.y + panel.h * 0.42) * s;
    ctx.save();
    rr(ctx, (w - panel.w * s) / 2, Math.max(h * 0.08, y + panel.y * s), panel.w * s, Math.min(h * 0.84, panel.h * s), 14);
    ctx.shadowColor = "rgba(0,0,0,0.45)";
    ctx.shadowBlur = 30;
    ctx.shadowOffsetY = 12;
    ctx.fillStyle = "#000";
    ctx.fill();
    ctx.shadowColor = "transparent";
    ctx.clip();
    ctx.translate(x, y);
    ctx.scale(s, s);
    drawRecordedApp(ctx, time);
    ctx.restore();
  }
  ctx.restore();
}
