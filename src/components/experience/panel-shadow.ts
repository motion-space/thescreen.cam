import { rr } from "./kit";

type Panel = { canvas: HTMLCanvasElement; pad: number; inset: number; size: number; scale: number };
const panels = new Map<string, Panel>();

function panel(radius: number, fill: string, shadow: string, blur: number, offset: number, inset: number) {
  const key = [radius, fill, shadow, blur, offset, inset].join(":");
  let result = panels.get(key);
  if (result) return result;
  const scale=blur>80?2:4, pad=Math.ceil(blur*2+Math.abs(offset))+2, inner=inset*2+64, size=inner+pad*2;
  const canvas=document.createElement("canvas"); canvas.width=canvas.height=Math.ceil(size*scale);
  const ctx=canvas.getContext("2d")!;
  ctx.setTransform(scale,0,0,scale,0,0);
  rr(ctx,pad,pad,inner,inner,radius);
  ctx.shadowColor=shadow;ctx.shadowBlur=blur*scale;ctx.shadowOffsetY=offset*scale;ctx.fillStyle=fill;ctx.fill();
  result={canvas,pad,inset,size,scale};panels.set(key,result);
  while(panels.size>8){const first=panels.keys().next().value!,old=panels.get(first)!;panels.delete(first);old.canvas.width=old.canvas.height=1;}
  return result;
}

/** A nine-slice panel keeps soft shadows out of the per-frame raster workload. */
export function drawPanel(ctx: CanvasRenderingContext2D,x:number,y:number,w:number,h:number,radius:number,fill:string,shadow:string,blur:number,offset:number) {
  const inset=Math.min(radius+blur*2,w/2-1,h/2-1), p=panel(radius,fill,shadow,blur,offset,inset);
  const src=[0,p.pad+inset,p.size-p.pad-inset,p.size], dx=[x-p.pad,x+inset,x+w-inset,x+w+p.pad],dy=[y-p.pad,y+inset,y+h-inset,y+h+p.pad];
  ctx.save();ctx.shadowColor="transparent";
  for(let j=0;j<3;j++)for(let i=0;i<3;i++)ctx.drawImage(p.canvas,src[i]*p.scale,src[j]*p.scale,(src[i+1]-src[i])*p.scale,(src[j+1]-src[j])*p.scale,dx[i],dy[j],dx[i+1]-dx[i],dy[j+1]-dy[j]);
  ctx.restore();
}

export function warmPanel(radius:number,fill:string,shadow:string,blur:number,offset:number,w=Infinity,h=Infinity) {
  const p=panel(radius,fill,shadow,blur,offset,Math.min(radius+blur*2,w/2-1,h/2-1));
  if(typeof createImageBitmap==="function")void createImageBitmap(p.canvas).then(bitmap=>bitmap.close(),()=>{});
}

export function disposePanelShadows(){for(const p of panels.values())p.canvas.width=p.canvas.height=1;panels.clear();for(const p of shadowRasters.values())p.canvas.width=p.canvas.height=1;shadowRasters.clear();}

/*
 * Shadow-only nine-slice for shadows the user edits live (the screenshot
 * frame). Only blur and corner radius are baked: offset is a translate and
 * opacity is globalAlpha at draw time, so dragging the angle or opacity never
 * rasterises, and blur is quantised so a drag reuses a handful of rasters.
 */
type ShadowRaster = { canvas: HTMLCanvasElement; pad: number; inset: number; size: number; scale: number };
const shadowRasters = new Map<string, ShadowRaster>();
const BLUR_STEP = 4;

function shadowRaster(radius: number, blur: number, inset: number) {
  const key = [radius, blur, inset].join(":");
  let result = shadowRasters.get(key);
  if (result) {
    shadowRasters.delete(key);
    shadowRasters.set(key, result);
    return result;
  }
  // soft shadows don't need full density; keep big blurs cheap to rasterise
  const scale = blur > 24 ? 2 : 4, pad = Math.ceil(blur * 2) + 2, inner = inset * 2 + 64, size = inner + pad * 2;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = Math.ceil(size * scale);
  const ctx = canvas.getContext("2d")!;
  const far = 100000;
  ctx.setTransform(scale, 0, 0, scale, 0, 0);
  // the shape sits far off-canvas and only its shadow is offset back in
  rr(ctx, pad + far, pad, inner, inner, radius);
  ctx.shadowColor = "#000";
  ctx.shadowBlur = blur * scale;
  ctx.shadowOffsetX = -far * scale;
  ctx.fillStyle = "#000";
  ctx.fill();
  result = { canvas, pad, inset, size, scale };
  shadowRasters.set(key, result);
  while (shadowRasters.size > 24) {
    const first = shadowRasters.keys().next().value!, old = shadowRasters.get(first)!;
    shadowRasters.delete(first);
    old.canvas.width = old.canvas.height = 1;
  }
  return result;
}

const quantise = (blur: number) => Math.max(0, Math.round(blur / BLUR_STEP) * BLUR_STEP);

/** Draws only the drop shadow of a rounded rect: black at `alpha`, moved by (ox, oy). */
export function drawShadow(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, radius: number, blur: number, alpha: number, ox: number, oy: number) {
  if (alpha <= 0.002) return;
  const b = quantise(blur), r = Math.round(radius);
  const inset = Math.round(Math.min(r + b * 2, w / 2 - 1, h / 2 - 1)), p = shadowRaster(r, b, inset);
  const src = [0, p.pad + inset, p.size - p.pad - inset, p.size];
  const dx = [x - p.pad + ox, x + inset + ox, x + w - inset + ox, x + w + p.pad + ox];
  const dy = [y - p.pad + oy, y + inset + oy, y + h - inset + oy, y + h + p.pad + oy];
  ctx.save();
  ctx.shadowColor = "transparent";
  ctx.globalAlpha *= alpha;
  for (let j = 0; j < 3; j++) for (let i = 0; i < 3; i++) ctx.drawImage(p.canvas, src[i] * p.scale, src[j] * p.scale, (src[i + 1] - src[i]) * p.scale, (src[j + 1] - src[j]) * p.scale, dx[i], dy[j], dx[i + 1] - dx[i], dy[j + 1] - dy[j]);
  ctx.restore();
}

export function warmShadow(radius: number, blur: number, w: number, h: number) {
  const b = quantise(blur), r = Math.round(radius);
  const p = shadowRaster(r, b, Math.round(Math.min(r + b * 2, w / 2 - 1, h / 2 - 1)));
  if (typeof createImageBitmap === "function") void createImageBitmap(p.canvas).then((bitmap) => bitmap.close(), () => {});
}
