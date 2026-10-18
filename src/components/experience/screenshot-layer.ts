import { drawScreenshotWindow, drawScreenshotAnnotations, SHOT, SHOT_PADS, clamp, ease, type EditorState, type EditorHandlers } from "./editor";
import { ShadowPads } from "./shadow-pad";
import { Anim, HitRegistry, type UI } from "./kit";

/** The captured source uses the tour’s capture time; only annotations animate. */
export class ScreenshotLayer {
  private canvas = document.createElement("canvas");
  private hits = new HitRegistry();
  private anim = new Anim();
  private base = new DOMMatrix();
  private key = "";
  private scale = 0;
  private moving = false;
  /** drawn live over the cached window, so dragging them never re-renders it per frame */
  private pads = new ShadowPads();

  draw(ui: UI, state: EditorState, handlers: EditorHandlers, pixelsPerUnit: number, prepare = false) {
    const a = ease(clamp(state.shot));
    if (!prepare && a <= 0) return;
    const pad = 160;
    const scale = Math.max(this.scale, Math.ceil(pixelsPerUnit * 2) / 2, 1);
    const hover = ui.hover?.startsWith("shot-") ? ui.hover : null;
    const key = JSON.stringify([scale, state.shotFrame, state.shotTool, state.shotBackground, ui.t.dark, ui.t.accent, hover]);
    if (key !== this.key || this.moving) {
      if (scale !== this.scale) {
        this.canvas.width = Math.ceil((SHOT.w + pad * 2) * scale);
        this.canvas.height = Math.ceil((SHOT.h + pad * 2) * scale);
        this.scale = scale;
      }
      const ctx = this.canvas.getContext("2d")!;
      ctx.setTransform(1,0,0,1,0,0); ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
      ctx.setTransform(scale,0,0,scale,(pad-SHOT.x)*scale,(pad-SHOT.y)*scale);
      this.base = ctx.getTransform(); this.hits.clear(); this.hits.ctx = ctx;
      const shot = state.shot, annotate = state.annotate;
      try {
        state.shot = 1; state.annotate = 0; this.anim.startFrame();
        drawScreenshotWindow({...ui,ctx,hits:this.hits,anim:this.anim,hover},state,handlers);
        this.moving = this.anim.busy(); this.key = key;
      } finally { state.shot = shot; state.annotate = annotate; }
    }
    if (prepare) {
      if (typeof createImageBitmap === "function") void createImageBitmap(this.canvas).then(b=>b.close(),()=>{});
      return;
    }
    const ctx=ui.ctx;
    ctx.save(); ctx.globalAlpha=a; ctx.translate((1-a)*80,0);
    ctx.drawImage(this.canvas,SHOT.x-pad,SHOT.y-pad,this.canvas.width/scale,this.canvas.height/scale);
    ui.hits.appendLayer(this.hits,this.base);
    ctx.translate(SHOT.x,SHOT.y);
    if (state.shotFrame.inspector && SHOT_PADS.angle.size > 0) {
      this.pads.draw(
        ctx, ui.t, ui.hits, SHOT_PADS,
        { angle: state.shotFrame.shadowAngle, strength: state.shotFrame.shadowStrength },
        (style, p) => {
          const q = { x: Math.round(p.x * 200) / 200, y: Math.round(p.y * 200) / 200 };
          if (style === "angle") state.shotFrame.shadowAngle = q;
          else state.shotFrame.shadowStrength = q;
        },
        handlers.touch, scale,
      );
    }
    const padding=state.shotFrame.padding*320, width=SHOT.w-(state.shotFrame.inspector?320:0);
    const k=Math.min((width-72)/(1280+padding*2),(SHOT.h-104-72)/(800+padding*2));
    const sx=(width-1280*k)/2, sy=52+(SHOT.h-104-800*k)/2;
    drawScreenshotAnnotations(ctx,state,a,sx,sy,1280*k,800*k,k);
    ctx.restore();
  }

  dispose() { this.canvas.width=this.canvas.height=1; this.hits.clear(); }
}
