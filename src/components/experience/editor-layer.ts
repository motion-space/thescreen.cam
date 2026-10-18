import { drawEditor, drawEditorDynamic, drawTimelineEffects, drawTimelineLabels, EH, EW, HEADER, TRANSPORT_Y, TIMELINE_Y, RULER_H, TL_X0, TL_X1, type EditorHandlers, type EditorState } from "./editor";
import { Anim, HitRegistry, recordRenderCost, rr, type UI, type Hit } from "./kit";
import { InspectorLayer } from "./inspector-layer";

/** Playback changes the playhead and inspector, not hundreds of timeline/UI paths. */
export class EditorLayer {
  readonly inspector = new InspectorLayer();
  private canvas = document.createElement("canvas");
  private hits = new HitRegistry();
  private key = "";
  private scale = 0;
  private timeline = document.createElement("canvas");
  private timelineKey = "";
  private labels = document.createElement("canvas");
  private labelsKey = "";
  private effects = document.createElement("canvas");
  private effectsKey = "";
  private effectsHits = new HitRegistry();
  private effectsBase = new DOMMatrix();
  private effectsAnim = new Anim();
  private effectsMoving = false;
  timelineLabels: { canvas: HTMLCanvasElement; key: string; x: number; y: number; w: number; h: number } | null = null;
  private timelineHits: Hit[] = [];
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
    const key = [scale, ui.t.dark, ui.t.accent, staticHover, state.mediaLibraryOpen, state.timelineScale, !!handlers.scrollControlled].join(":");
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
      const chrome=state.chrome, offset=state.timelineOffset;
      try { state.chrome=1; state.timelineOffset=0; drawEditor({ ...ui, ctx, hits: this.hits }, state, handlers, true); }
      finally { state.chrome=chrome; state.timelineOffset=offset; }
      this.sectionHits.header.hits=this.hits.hits.filter(hit=>hit.id.startsWith("hdr-"));
      this.sectionHits.transport.hits=this.hits.hits.filter(hit=>hit.id.startsWith("tp-"));
      this.sectionHits.ruler.hits=this.hits.hits.filter(hit=>hit.id==="tl-layout");
      this.key = key;
      recordRenderCost("editor-cache", started, { scale, width: this.canvas.width, height: this.canvas.height });
    }
    // Two cached viewport tiles cover the complete 100–200% timeline.
    // Panning changes only the source crop, never the shell raster/cache key.
    const span = EW, height = EH - TIMELINE_Y;
    if (this.timelineKey !== key) {
      this.timeline.width = Math.ceil(span * 2 * scale);
      this.timeline.height = Math.ceil(height * scale);
      const ctx = this.timeline.getContext("2d")!, hits = new HitRegistry();
      hits.ctx = ctx; this.timelineHits = [];
      const chrome = state.chrome, offset = state.timelineOffset;
      try {
        state.chrome = 1;
        for (let tile = 0; tile < 2; tile++) {
          ctx.save();
          ctx.beginPath(); ctx.rect(tile * span * scale, 0, span * scale, height * scale); ctx.clip();
          ctx.setTransform(scale, 0, 0, scale, tile * span * scale, -TIMELINE_Y * scale);
          state.timelineOffset = tile * span;
          hits.clear();
          drawEditor({ ...ui, ctx, hits, timelineLabelsHidden: true }, state, handlers, true, () => {});
          for (const hit of hits.hits) if (hit.id.startsWith("clip-")) this.timelineHits.push({ ...hit, x: hit.x + tile * span });
          ctx.restore();
        }
      } finally { state.chrome = chrome; state.timelineOffset = offset; }
      this.timelineKey = key;
    }
    const paintEffects = (u: UI, s: EditorState, h: EditorHandlers) => {
      const y = TIMELINE_Y + RULER_H, height = EH - y;
      const hover = u.hover?.startsWith("clip-") ? u.hover : null;
      const key = JSON.stringify([scale, u.t.dark, u.t.accent, u.t.window, s.chrome, s.selection,
        s.timelineScale, s.timelineOffset, s.zoomClips, s.captionText,
        s.camera.show, s.camera.remove, s.camera.cuts, s.camera.split, hover]);
      if (key !== this.effectsKey || this.effectsMoving) {
        const width = Math.ceil(EW * scale), pixelsHigh = Math.ceil(height * scale);
        if (this.effects.width !== width || this.effects.height !== pixelsHigh) {
          this.effects.width = width; this.effects.height = pixelsHigh;
        }
        const ctx = this.effects.getContext("2d")!;
        ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, width, pixelsHigh);
        ctx.setTransform(scale, 0, 0, scale, 0, -y * scale);
        this.effectsBase = ctx.getTransform();
        this.effectsHits.clear(); this.effectsHits.ctx = ctx;
        this.effectsAnim.startFrame();
        drawTimelineEffects({ ...u, ctx, hits: this.effectsHits, anim: this.effectsAnim }, s, h);
        this.effectsMoving = this.effectsAnim.busy(); this.effectsKey = key;
      }
      u.ctx.drawImage(this.effects, 0, y, EW, height);
      u.hits.appendLayer(this.effectsHits, this.effectsBase);
    };
    const paintTimeline = (rulerOnly = false) => {
      const h = rulerOnly ? RULER_H : height;
      // The tile includes the shell's shadow. Keep that cached shadow inside
      // the window here; only the main shell paints outside its rounded edge.
      // Clip the destination so panning across tile seams keeps the same corners.
      ui.ctx.save();
      rr(ui.ctx, 0, 0, EW, EH, 14);
      ui.ctx.clip();
      ui.ctx.drawImage(this.timeline, state.timelineOffset * scale, 0, span * scale, h * scale, 0, TIMELINE_Y, span, h);
      ui.ctx.restore();
      if (!rulerOnly) for (const hit of this.timelineHits) {
        const x = Math.max(0, hit.x - state.timelineOffset), end = Math.min(TL_X1, hit.x + hit.w - state.timelineOffset);
        if (end > x) ui.hits.add({ ...hit, x, w: end - x });
      }
    };
    const labelsKey = [scale, ui.t.dark, ui.t.text2].join(":");
    if (labelsKey !== this.labelsKey) {
      this.labels.width = Math.ceil(TL_X0 * scale); this.labels.height = Math.ceil(height * scale);
      const ctx = this.labels.getContext("2d")!; ctx.setTransform(scale, 0, 0, scale, 0, -TIMELINE_Y * scale);
      drawTimelineLabels({ ...ui, ctx }, state); this.labelsKey = labelsKey;
    }
    const m = ui.ctx.getTransform();
    this.timelineLabels = { canvas: this.labels, key: labelsKey, x: m.e, y: m.f + TIMELINE_Y*m.d, w: TL_X0*m.a, h: height*m.d };
    if (prepareOnly) return;
    if (state.chrome < 1) {
      const crop=(x:number,y:number,w:number,h:number)=>ui.ctx.drawImage(this.canvas,(x+pad)*scale,(y+pad)*scale,w*scale,h*scale,x,y,w,h);
      drawEditor(ui,state,handlers,true,inspector,name=>{
        if(name==="header")crop(0,0,EW,HEADER);
        else if(name==="transport")crop(0,TRANSPORT_Y,EW,56);
        else { crop(0,TIMELINE_Y,EW,RULER_H);paintTimeline(true); }
        ui.hits.appendLayer(this.sectionHits[name],this.base);
      });
      drawEditorDynamic(ui,state,handlers,inspector,paintEffects);
      return;
    }
    if (gpu) {
      const m = ui.ctx.getTransform();
      this.gpuLayer = { canvas: this.canvas, key, x: m.e - pad*m.a, y: m.f - pad*m.d, w: this.canvas.width/scale*m.a, h: this.canvas.height/scale*m.d };
    } else ui.ctx.drawImage(this.canvas, -pad, -pad, this.canvas.width / scale, this.canvas.height / scale);
    const shellHits = new HitRegistry(); shellHits.hits = this.hits.hits.filter(hit => !hit.id.startsWith("clip-"));
    ui.hits.appendLayer(shellHits, this.base);
    paintTimeline();
    drawEditorDynamic({ ...ui, timelineLabelsHidden: gpu }, state, handlers, inspector, paintEffects);
  }

  prepare(ui: UI, state: EditorState, handlers: EditorHandlers, pixelsPerUnit: number) {
    const chrome = state.chrome;
    try { state.chrome = 1; this.draw(ui, state, handlers, pixelsPerUnit, true, true); }
    finally { state.chrome = chrome; }
    return { canvas: this.canvas, key: this.key };
  }

  dispose() { this.canvas.width = this.canvas.height = this.timeline.width = this.timeline.height = this.labels.width = this.labels.height = this.effects.width = this.effects.height = 1; this.hits.clear(); this.inspector.dispose(); }
}
