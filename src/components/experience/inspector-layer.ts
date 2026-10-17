import { meshTextureVersion } from "./background-presets";
import { drawInspector, drawInspectorDynamic, HEADER, INS_X, EW, PREVIEW, type EditorHandlers, type EditorState } from "./editor";
import { HitRegistry, type UI } from "./kit";
import type { EditorGpuLayer } from "./preview-gl";

export class InspectorLayer {
  private canvas = document.createElement("canvas");
  private hits = new HitRegistry();
  private base = new DOMMatrix();
  private key = "";
  private scale = 0;
  private moving = false;
  private version = 0;
  gpuLayer: (EditorGpuLayer & { alpha: number }) | null = null;

  draw(ui: UI, state: EditorState, handlers: EditorHandlers, pixelsPerUnit: number, gpu: boolean) {
    this.gpuLayer = null;
    const { time, chrome, captionsShown, shot, flash, annotate, camera, playing, volume, timelineScale, timelineOffset, ...settings } = state;
    const scale = Math.max(this.scale, Math.ceil(pixelsPerUnit * 2) / 2, 1);
    const key = JSON.stringify([scale, meshTextureVersion(), settings, camera.show, camera.remove, camera.sticker, camera.size, ui.t.dark, ui.t.accent, ui.hover]);
    if (key !== this.key || this.moving) {
      if (scale !== this.scale) { this.canvas.width = Math.ceil((EW-INS_X)*scale); this.canvas.height = Math.ceil(PREVIEW.h*scale); this.scale = scale; }
      const ctx = this.canvas.getContext("2d")!;
      ctx.setTransform(1,0,0,1,0,0); ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
      ctx.setTransform(scale,0,0,scale,-INS_X*scale,-HEADER*scale);
      ctx.fillStyle = ui.t.panel; ctx.fillRect(INS_X,HEADER,EW-INS_X,PREVIEW.h);
      ctx.fillStyle = ui.t.separator; ctx.fillRect(INS_X,HEADER,1,PREVIEW.h);
      this.base = ctx.getTransform(); this.hits.clear(); this.hits.ctx = ctx;
      ui.anim.startFrame();
      drawInspector({ ...ui, ctx, hits: this.hits }, state, handlers, true);
      this.moving = ui.anim.busy(); this.key = key; this.version++;
    }
    if (gpu) {
      const m = ui.ctx.getTransform();
      this.gpuLayer = { canvas: this.canvas, key: String(this.version), x: m.e+INS_X*m.a, y:m.f+HEADER*m.d, w:(EW-INS_X)*m.a, h:PREVIEW.h*m.d, alpha: ui.ctx.globalAlpha };
    } else ui.ctx.drawImage(this.canvas, INS_X, HEADER, EW-INS_X, PREVIEW.h);
    ui.hits.appendLayer(this.hits, this.base);
    drawInspectorDynamic(ui, state, handlers);
  }

  dispose() { this.canvas.width = this.canvas.height = 1; this.hits.clear(); }
}
