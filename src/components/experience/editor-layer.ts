import { drawEditor, drawEditorDynamic, EH, EW, HEADER, TRANSPORT_Y, TIMELINE_Y, RULER_H, TL_X0, type EditorHandlers, type EditorState } from "./editor";
import { HitRegistry, recordRenderCost, type UI } from "./kit";
import { InspectorLayer } from "./inspector-layer";

/** Playback changes the playhead and inspector, not hundreds of timeline/UI paths. */
export class EditorLayer {
  readonly inspector = new InspectorLayer();
  private canvas = document.createElement("canvas");
  private hits = new HitRegistry();
  private key = "";
  private scale = 0;
  private base = new DOMMatrix();
  private sectionHits = { header: new HitRegistry(), transport: new HitRegistry(), ruler: new HitRegistry() };

  gpuLayer: { canvas: HTMLCanvasElement; key: string; x: number; y: number; w: number; h: number } | null = null;
  draw(ui: UI, state: EditorState, handlers: EditorHandlers, pixelsPerUnit: number, gpu = false, prepareOnly = false) {
    this.gpuLayer = null;
    const inspector = (u: UI, s: EditorState, h: EditorHandlers) => this.inspector.draw(u, s, h, pixelsPerUnit, gpu && state.chrome === 1);
    this.inspector.gpuLayer = null;
    const pad = 120;
    const scale = Math.max(1, Math.ceil(pixelsPerUnit * 2) / 2, this.scale);
    const staticHover = ui.hover && /^(hdr-|tp-|tl-layout$|clip-(rec$|key-|sys$|mic$))/.test(ui.hover) ? ui.hover : null;
    const key = [scale, ui.t.dark, ui.t.accent, staticHover].join(":");
    if (key !== this.key) {
      const started = performance.now();
      const ctx = this.canvas.getContext("2d")!;
      if (scale !== this.scale) {
        this.canvas.width = Math.ceil((EW + pad * 2) * scale);
        this.canvas.height = Math.ceil((EH + pad * 2) * scale);
        this.scale = scale;
      }
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      ctx.setTransform(scale, 0, 0, scale, pad * scale, pad * scale);
      this.base = ctx.getTransform();
      this.hits.clear(); this.hits.ctx = ctx;
      const chrome=state.chrome;
      try { state.chrome=1; drawEditor({ ...ui, ctx, hits: this.hits }, state, handlers, true); }
      finally { state.chrome=chrome; }
      this.sectionHits.header.hits=this.hits.hits.filter(hit=>hit.id.startsWith("hdr-"));
      this.sectionHits.transport.hits=this.hits.hits.filter(hit=>hit.id.startsWith("tp-"));
      this.sectionHits.ruler.hits=this.hits.hits.filter(hit=>hit.id==="tl-layout");
      this.key = key;
      recordRenderCost("editor-cache", started, { scale, width: this.canvas.width, height: this.canvas.height });
    }
    if (prepareOnly) return;
    if (state.chrome < 1) {
      const crop=(x:number,y:number,w:number,h:number)=>ui.ctx.drawImage(this.canvas,(x+pad)*scale,(y+pad)*scale,w*scale,h*scale,x,y,w,h);
      drawEditor(ui,state,handlers,true,inspector,name=>{
        if(name==="header")crop(0,0,EW,HEADER);
        else if(name==="transport")crop(0,TRANSPORT_Y,EW,56);
        else { crop(0,TIMELINE_Y,EW,RULER_H);crop(0,TIMELINE_Y+RULER_H,TL_X0-8,EH-TIMELINE_Y-RULER_H); }
        ui.hits.appendLayer(this.sectionHits[name],this.base);
      });
      drawEditorDynamic(ui,state,handlers,inspector);
      return;
    }
    if (gpu) {
      const m = ui.ctx.getTransform();
      this.gpuLayer = { canvas: this.canvas, key, x: m.e - pad*m.a, y: m.f - pad*m.d, w: this.canvas.width/scale*m.a, h: this.canvas.height/scale*m.d };
    } else ui.ctx.drawImage(this.canvas, -pad, -pad, this.canvas.width / scale, this.canvas.height / scale);
    ui.hits.appendLayer(this.hits, this.base);
    drawEditorDynamic(ui, state, handlers, inspector);
  }

  prepare(ui: UI, state: EditorState, handlers: EditorHandlers, pixelsPerUnit: number) {
    const chrome = state.chrome;
    try { state.chrome = 1; this.draw(ui, state, handlers, pixelsPerUnit, true, true); }
    finally { state.chrome = chrome; }
    return { canvas: this.canvas, key: this.key };
  }

  dispose() { this.canvas.width = this.canvas.height = 1; this.hits.clear(); this.inspector.dispose(); }
}
