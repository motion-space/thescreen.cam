import { RECORDING_DURATION, STORY as T } from "./story-timing";
import { measureWidth } from "./kit";
/**
 * The app "being recorded" inside the editor preview: a Linear-style issue
 * tracker for the ScreenCam project, drawn in content space (1280 × 800).
 * Everything is a pure function of the timeline time, so scrubbing, the 3D
 * texture, the lens optics and the screenshot all agree on what is on screen.
 *
 * Story (24 s loop): change SCR-482's status to Done from the status menu,
 * open SCR-479, play its attached preview, then inspect the playing preview.
 */
import { font, icon, rr, text, recordRenderCost } from "./kit";
import { SPRINGS, springStep } from "./spring";

export const CW = 1280;
export const CH = 800;

/* ---------- palette (Linear dark / light) ---------- */

const DARK = {
  chrome: "#08090a",
  panel: "#0f1011",
  panelBorder: "#1f2023",
  row: "#0f1011",
  rowHover: "#17181b",
  rowSelected: "#1a1b23",
  group: "#121315",
  line: "#1b1c1f",
  text: "#f7f8f8",
  text2: "#d0d3d7",
  body: "#b5b8be",
  muted: "#8a8f98",
  faint: "#62666d",
  accent: "#5e6ad2",
  menu: "#1c1d21",
  menuBorder: "#2c2e33",
  menuHover: "#2a2c33",
  chip: "#1c1d21",
  chipBorder: "#2b2d31",
  todo: "#a0a4ab",
  barOn: "#c9ccd1",
  barOff: "#3a3c42",
  detail: "#111214",
  input: "#16171a",
  teamIcon: "#3a2a20",
  yellow: "#f2c94c",
  green: "#4cb782",
  orange: "#f2994a",
};

const LIGHT: typeof DARK = {
  chrome: "#f4f5f7",
  panel: "#ffffff",
  panelBorder: "#e4e5e9",
  row: "#ffffff",
  rowHover: "#f5f6f8",
  rowSelected: "#eef0fb",
  group: "#f8f9fa",
  line: "#eeeff2",
  text: "#1b1c1f",
  text2: "#3c3f45",
  body: "#4d5158",
  muted: "#6b6f76",
  faint: "#9ca0a8",
  accent: "#5e6ad2",
  menu: "#ffffff",
  menuBorder: "#e2e3e7",
  menuHover: "#f1f2f5",
  chip: "#eef0f3",
  chipBorder: "#e2e3e7",
  todo: "#9ca0a8",
  barOn: "#3c3f45",
  barOff: "#d6d8dd",
  detail: "#ffffff",
  input: "#f7f8fa",
  teamIcon: "#fde8dc",
  yellow: "#e2b33a",
  green: "#3fa874",
  orange: "#ef8a2c",
};

let C = DARK;
let appDark = true;

/** Switch the recorded app between Linear's dark and light themes. */
export function setAppTheme(dark: boolean) {
  appDark = dark;
  C = dark ? DARK : LIGHT;
}

/** Changes whenever the app's look changes (used to invalidate caches). */
export const appThemeKey = () => (appDark ? 1 : 0);

/* ---------- geometry ---------- */

const SIDEBAR_W = 220;
const PANEL = { x: 228, y: 8, w: 1044, h: 784 };
const HEADER_H = 44;
const ROW_H = 40;
const GROUP_H = 36;

type Status = "backlog" | "todo" | "progress" | "review" | "done" | "canceled";
type Priority = 0 | 1 | 2 | 3 | 4; // none, urgent, high, medium, low
type Issue = { id: string; title: string; label: [string, string]; priority: Priority; date: string; who: [string, string] };
type Group = { status: Status; name: string; issues: Issue[] };

const GROUPS: Group[] = [
  {
    status: "progress",
    name: "In Progress",
    issues: [
      { id: "SCR-482", title: "Glass loupe: edge refraction and dispersion", label: ["Rendering", "#8b5cf6"], priority: 1, date: "Oct 14", who: ["CJ", "#e5484d"] },
      { id: "SCR-479", title: "3D camera: depth of field follows the cursor", label: ["Rendering", "#8b5cf6"], priority: 2, date: "Oct 13", who: ["PX", "#3e63dd"] },
      { id: "SCR-476", title: "Read-along captions drop words at 2× speed", label: ["Captions", "#22d3ee"], priority: 3, date: "Oct 12", who: ["LZ", "#30a46c"] },
    ],
  },
  {
    status: "todo",
    name: "Todo",
    issues: [
      { id: "SCR-488", title: "Click wave should respect the cursor scale", label: ["Cursor", "#ec4899"], priority: 3, date: "Oct 15", who: ["CJ", "#e5484d"] },
      { id: "SCR-485", title: "Export: sample motion blur at 120 fps", label: ["Export", "#30a46c"], priority: 2, date: "Oct 15", who: ["PX", "#3e63dd"] },
      { id: "SCR-471", title: "Timeline: snap the zoom curve anchor", label: ["Timeline", "#f2994a"], priority: 4, date: "Oct 11", who: ["LZ", "#30a46c"] },
      { id: "SCR-468", title: "Windows: adopt the new slider style", label: ["Windows", "#3e63dd"], priority: 4, date: "Oct 10", who: ["PX", "#3e63dd"] },
    ],
  },
  {
    status: "backlog",
    name: "Backlog",
    issues: [
      { id: "SCR-463", title: "Screenshot spotlight with a feathered edge", label: ["Screenshot", "#f2c94c"], priority: 0, date: "Oct 9", who: ["CJ", "#e5484d"] },
      { id: "SCR-459", title: "Mockups: device shadow presets", label: ["Mockups", "#8a8f98"], priority: 0, date: "Oct 8", who: ["LZ", "#30a46c"] },
    ],
  },
  {
    status: "done",
    name: "Done",
    issues: [
      { id: "SCR-455", title: "Signed shader effect catalog", label: ["Rendering", "#8b5cf6"], priority: 3, date: "Oct 7", who: ["CJ", "#e5484d"] },
      { id: "SCR-452", title: "Localize release notes in 10 languages", label: ["Docs", "#8a8f98"], priority: 4, date: "Oct 6", who: ["PX", "#3e63dd"] },
      { id: "SCR-447", title: "iPhone 18 Pro and Pro Max mockups", label: ["Mockups", "#8a8f98"], priority: 3, date: "Oct 3", who: ["LZ", "#30a46c"] },
    ],
  },
];

/** Row geometry, computed once. */
const ROWS: Array<{ issue: Issue; group: Group; y: number }> = [];
const GROUP_Y: number[] = [];
{
  let y = PANEL.y + HEADER_H;
  for (const g of GROUPS) {
    GROUP_Y.push(y);
    y += GROUP_H;
    for (const issue of g.issues) {
      ROWS.push({ issue, group: g, y });
      y += ROW_H;
    }
  }
}
const rowOf = (id: string) => ROWS.find((r) => r.issue.id === id) ?? ROWS[0];

const ROW_482 = rowOf("SCR-482");
const ROW_479 = rowOf("SCR-479");
const COL = { priority: 252, id: 270, status: 336, title: 356 };

/** Status menu (opened from SCR-482's status icon). */
const MENU = { x: COL.status - 8, y: ROW_482.y + ROW_H - 4, w: 232, item: 30 };
const MENU_ITEMS: Array<[Status, string, string]> = [
  ["backlog", "Backlog", "1"],
  ["todo", "Todo", "2"],
  ["progress", "In Progress", "3"],
  ["review", "In Review", "4"],
  ["done", "Done", "5"],
  ["canceled", "Canceled", "6"],
];
const menuItemY = (i: number) => MENU.y + 40 + i * MENU.item;

/** Issue detail panel (SCR-479). */
const DETAIL = { x: 700, y: PANEL.y, w: PANEL.x + PANEL.w - 700, h: PANEL.h };
export const ATTACHMENT = { x: DETAIL.x + 28, y: 214, w: DETAIL.w - 56, h: Math.round(((DETAIL.w - 56) * 9) / 16) };
const PLAY = { x: ATTACHMENT.x + ATTACHMENT.w / 2, y: ATTACHMENT.y + ATTACHMENT.h / 2 };

/* ---------- typing: a comment, then ⌘↩ to send ---------- */

export const TYPED_COMMENT = "Looks great, ship it!";

/** A physical key press: label as printed on the key, with held modifiers. */
export type KeyPress = { down: number; up: number; label: string; mods: string[] };

const SHIFTED: Record<string, string> = { "!": "1", "@": "2", "?": "/", ":": ";" };

export const KEY_PRESSES: KeyPress[] = (() => {
  const out: KeyPress[] = [];
  let t = T.typeStart;
  Array.from(TYPED_COMMENT).forEach((ch, i) => {
    // human rhythm: quicker inside words, a beat after spaces and punctuation
    const jitter = (Math.sin(i * 12.9898) * 43758.5453) % 1;
    const gap = 0.075 + Math.abs(jitter) * 0.06 + (ch === " " ? 0.05 : 0) + (ch === "," ? 0.08 : 0);
    let label = ch.toUpperCase();
    const mods: string[] = [];
    if (ch === " ") label = "Space";
    else if (SHIFTED[ch]) {
      label = SHIFTED[ch];
      mods.push("⇧");
    } else if (ch !== ch.toLowerCase()) mods.push("⇧");
    out.push({ down: t, up: t + 0.07, label, mods });
    t += gap;
  });
  // Fit the complete sentence before send; keep deterministic human rhythm.
  const available = T.submit - T.typeStart - 0.24;
  const factor = Math.min(1, available / (t - T.typeStart));
  for (const press of out) {
    press.down = T.typeStart + (press.down - T.typeStart) * factor;
    press.up = T.typeStart + (press.up - T.typeStart) * factor;
  }
  out.push({ down: T.submit, up: T.submit + 0.16, label: "Return", mods: ["⌘"] });
  return out;
})();

/** Keyboard lane clips: [start, end, label]. */
export const KEY_CLIPS: Array<[number, number, string]> = [
  [T.typeStart - 0.05, KEY_PRESSES[KEY_PRESSES.length - 2].up + 0.05, TYPED_COMMENT],
  [T.submit - 0.05, T.submit + 0.3, "⌘ ↩"],
];

/** How much of the comment is in the box at `t`. */
function typedAt(t: number) {
  if (t < T.typeStart || t >= T.submit) return "";
  let n = 0;
  for (let i = 0; i < KEY_PRESSES.length - 1; i += 1) if (KEY_PRESSES[i].down <= t) n = i + 1;
  return TYPED_COMMENT.slice(0, n);
}

/** Targets other parts of the page aim at (zoom focus, screenshot annotations). */
export const TARGETS = {
  statusMenu: { x: MENU.x + MENU.w / 2 - 20, y: MENU.y + 90 },
  statusIcon: { x: COL.status, y: ROW_482.y + ROW_H / 2 },
  detailStatus: { x: DETAIL.x + 120, y: DETAIL.y + 22 },
  toast: { x: PANEL.x + PANEL.w / 2, y: PANEL.y + PANEL.h - 50 },
  /** SCR-479, the issue that gets opened */
  openRow: { x: COL.title + 110, y: ROW_479.y + ROW_H / 2 },
  /** the comment box at the bottom of the detail panel */
  comment: { x: DETAIL.x + 150, y: DETAIL.y + DETAIL.h - 40 },
  activity: { x: DETAIL.x + 220, y: ATTACHMENT.y + ATTACHMENT.h + 178 },
  title: { x: DETAIL.x + 28, y: 72, w: DETAIL.w - 56, h: 30 },
  attachment: ATTACHMENT,
  play: PLAY,
};

/* ---------- small glyphs ---------- */

function statusIcon(ctx: CanvasRenderingContext2D, status: Status, x: number, y: number, pop = 1) {
  const r = 6.5 * pop;
  ctx.save();
  ctx.lineWidth = 1.5;
  switch (status) {
    case "backlog":
      ctx.setLineDash([2, 2.2]);
      ctx.strokeStyle = C.faint;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.stroke();
      break;
    case "todo":
      ctx.strokeStyle = C.todo;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.stroke();
      break;
    case "progress":
    case "review": {
      const col = status === "progress" ? C.yellow : C.green;
      ctx.strokeStyle = col;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = col;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.arc(x, y, r - 2.6, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * (status === "progress" ? 0.5 : 0.75));
      ctx.closePath();
      ctx.fill();
      break;
    }
    case "done":
      ctx.fillStyle = C.accent;
      ctx.beginPath();
      ctx.arc(x, y, r + 0.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 1.6;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.beginPath();
      ctx.moveTo(x - 2.8 * pop, y + 0.2 * pop);
      ctx.lineTo(x - 0.8 * pop, y + 2.2 * pop);
      ctx.lineTo(x + 3 * pop, y - 2 * pop);
      ctx.stroke();
      break;
    case "canceled":
      ctx.fillStyle = C.faint;
      ctx.beginPath();
      ctx.arc(x, y, r + 0.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = C.panel;
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(x - 2.4, y - 2.4);
      ctx.lineTo(x + 2.4, y + 2.4);
      ctx.moveTo(x + 2.4, y - 2.4);
      ctx.lineTo(x - 2.4, y + 2.4);
      ctx.stroke();
      break;
  }
  ctx.restore();
}

function priorityIcon(ctx: CanvasRenderingContext2D, p: Priority, x: number, y: number) {
  if (p === 0) {
    ctx.fillStyle = C.faint;
    for (let i = 0; i < 3; i += 1) ctx.fillRect(x - 6 + i * 4.5, y - 0.75, 3, 1.5);
    return;
  }
  if (p === 1) {
    rr(ctx, x - 7, y - 7, 14, 14, 3.5);
    ctx.fillStyle = C.orange;
    ctx.fill();
    ctx.fillStyle = C.chrome;
    ctx.fillRect(x - 0.9, y - 4.2, 1.8, 5);
    ctx.fillRect(x - 0.9, y + 2, 1.8, 1.8);
    return;
  }
  const filled = p === 2 ? 3 : p === 3 ? 2 : 1;
  for (let i = 0; i < 3; i += 1) {
    const h = 4 + i * 3;
    rr(ctx, x - 6 + i * 4.5, y + 6 - h, 3, h, 1);
    ctx.fillStyle = i < filled ? C.barOn : C.barOff;
    ctx.fill();
  }
}

function avatar(ctx: CanvasRenderingContext2D, who: [string, string], x: number, y: number, r = 9) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fillStyle = who[1];
  ctx.fill();
  text(ctx, who[0], x, y + 0.5, { size: r * 0.85, weight: 500, color: "#fff", align: "center" });
}

function labelChip(ctx: CanvasRenderingContext2D, label: [string, string], rightX: number, y: number) {
  ctx.font = font(11.5, 400);
  const w = measureWidth(ctx,label[0]) + 26;
  const x = rightX - w;
  rr(ctx, x, y - 10, w, 20, 10);
  ctx.strokeStyle = C.chipBorder;
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(x + 10, y, 3.5, 0, Math.PI * 2);
  ctx.fillStyle = label[1];
  ctx.fill();
  text(ctx, label[0], x + 18, y + 0.5, { size: 11.5, weight: 400, color: C.body });
  return x;
}

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
/** UI transitions inside the recorded app ride the client's effect spring (t in seconds). */
const springIn = (t: number) => clamp01(springStep(SPRINGS.effect, t));
/** Press "pop": the click spring overshoots a little before settling. */
const springPop = (t: number) => (t <= 0 ? 1 : 0.55 + 0.45 * springStep(SPRINGS.click, t));
const inside = (p: { x: number; y: number }, r: { x: number; y: number; w: number; h: number }) => p.x >= r.x && p.x <= r.x + r.w && p.y >= r.y && p.y <= r.y + r.h;

/* ---------- the playing attachment: a ScreenCam export preview ---------- */

const MONO = "\"SF Mono\", \"Geist Mono\", ui-monospace, monospace";

/** Attachment colours per theme: a quiet player surface that sits in Linear's detail panel. */
function attachmentPalette() {
  const dark = C === DARK;
  return dark
    ? {
        dark,
        surface: "#0d0e11",
        lane: "rgba(255,255,255,0.035)",
        laneLine: "rgba(255,255,255,0.05)",
        window: "#16171c",
        windowLine: "#24262d",
        bar: "#2c2f38",
        label: "#5d6169",
        value: "#c4c7cd",
        strong: "#f7f8f8",
        waveOn: "#3fb67d",
        waveOff: "rgba(63,182,125,0.28)",
        clipZoom: "rgba(255,166,23,0.18)",
        clipZoomLine: "rgba(255,166,23,0.45)",
        clipZoomText: "#ffc773",
        clipCap: "rgba(56,189,248,0.16)",
        clipCapLine: "rgba(56,189,248,0.4)",
        clipCapText: "#9adcfb",
        scrim: "rgba(8,9,11,0.42)",
      }
    : {
        dark,
        surface: "#f6f7f9",
        lane: "rgba(15,20,40,0.035)",
        laneLine: "rgba(15,20,40,0.06)",
        window: "#ffffff",
        windowLine: "#e6e7eb",
        bar: "#dfe1e6",
        label: "#9a9ea6",
        value: "#4d5158",
        strong: "#1b1c1f",
        waveOn: "#2f9e6a",
        waveOff: "rgba(47,158,106,0.25)",
        clipZoom: "rgba(245,140,10,0.14)",
        clipZoomLine: "rgba(230,130,0,0.42)",
        clipZoomText: "#a35a00",
        clipCap: "rgba(14,150,210,0.12)",
        clipCapLine: "rgba(14,150,210,0.38)",
        clipCapText: "#0b6f9c",
        scrim: "rgba(246,247,249,0.38)",
      };
}

function drawAttachment(ctx: CanvasRenderingContext2D, time: number) {
  const a = ATTACHMENT;
  const view = visibleAppBounds(ctx);
  if (a.x >= view.x + view.w || a.y >= view.y + view.h || a.x + a.w <= view.x || a.y + a.h <= view.y) return;
  const P = attachmentPalette();
  const playing = time >= T.play;
  const pt = playing ? (time - T.play) * 1.6 : 0; // playback time
  const progress = (pt * 0.12) % 1;
  ctx.save();
  rr(ctx, a.x, a.y, a.w, a.h, 12);
  ctx.clip();
  ctx.fillStyle = P.surface;
  ctx.fillRect(a.x, a.y, a.w, a.h);

  // ---- the exported frame: a gradient backdrop with the recorded window, zooming in ----
  const pv = { x: a.x + 16, y: a.y + 16, w: a.w * 0.5, h: a.h * 0.5 };
  const zoom = 1 + 0.35 * (0.5 - 0.5 * Math.cos(pt * 1.3));
  ctx.save();
  rr(ctx, pv.x, pv.y, pv.w, pv.h, 8);
  ctx.clip();
  const bg = ctx.createLinearGradient(pv.x, pv.y, pv.x + pv.w, pv.y + pv.h);
  bg.addColorStop(0, P.dark ? "#3a1d5c" : "#c9b8ff");
  bg.addColorStop(0.55, P.dark ? "#7a2f3f" : "#ffc2b0");
  bg.addColorStop(1, P.dark ? "#c2551f" : "#ffd98a");
  ctx.fillStyle = bg;
  ctx.fillRect(pv.x, pv.y, pv.w, pv.h);
  const focus = { x: pv.x + pv.w * 0.66, y: pv.y + pv.h * 0.58 };
  ctx.translate(focus.x, focus.y);
  ctx.scale(zoom, zoom);
  ctx.translate(-focus.x, -focus.y);
  const win = { x: pv.x + pv.w * 0.09, y: pv.y + pv.h * 0.13, w: pv.w * 0.82, h: pv.h * 0.74 };
  ctx.save();
  rr(ctx, win.x, win.y, win.w, win.h, 5);
  ctx.shadowColor = "rgba(0,0,0,0.28)";
  ctx.shadowBlur = 10;
  ctx.shadowOffsetY = 3;
  ctx.fillStyle = P.window;
  ctx.fill();
  ctx.restore();
  paintCachedLayer(ctx, `attachment-window:${appThemeKey()}`, win, c => {
    const ctx = c;
  ["#ff5f57", "#febc2e", "#28c840"].forEach((col, i) => {
    ctx.beginPath();
    ctx.arc(win.x + 7 + i * 6, win.y + 6.5, 1.8, 0, Math.PI * 2);
    ctx.fillStyle = col;
    ctx.fill();
  });
  ctx.fillStyle = P.windowLine;
  ctx.fillRect(win.x, win.y + 13, win.w, 0.6);
  ctx.fillRect(win.x + win.w * 0.27, win.y + 13, 0.6, win.h - 13);
  for (let i = 0; i < 5; i += 1) {
    rr(ctx, win.x + 6, win.y + 20 + i * 9, win.w * (0.13 + ((i * 7) % 5) / 60), 3.2, 1.6);
    ctx.fillStyle = i === 1 ? C.accent : P.bar;
    ctx.fill();
  }
  for (let i = 0; i < 4; i += 1) {
    rr(ctx, win.x + win.w * 0.32, win.y + 20 + i * 11, win.w * (0.42 - i * 0.06), 3.6, 1.8);
    ctx.fillStyle = P.bar;
    ctx.fill();
  }
  const btn = { x: focus.x - 21, y: focus.y - 7, w: 42, h: 14 };
  rr(ctx, btn.x, btn.y, btn.w, btn.h, 4);
  ctx.fillStyle = C.accent;
  ctx.fill();
  text(ctx, "Export", btn.x + btn.w / 2, btn.y + 7.5, { size: 7, weight: 600, color: "#fff", align: "center" });
  });
  ctx.restore();
  // a soft focus ring breathing on the target
  if (playing) {
    const ring = (pt * 0.9) % 1;
    ctx.beginPath();
    ctx.arc(focus.x, focus.y, 9 + ring * 18, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(255,255,255,${0.75 * (1 - ring)})`;
    ctx.lineWidth = 1.2;
    ctx.stroke();
  }
  rr(ctx, pv.x + 0.5, pv.y + 0.5, pv.w - 1, pv.h - 1, 8);
  ctx.strokeStyle = P.dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)";
  ctx.lineWidth = 1;
  ctx.stroke();

  // ---- export readout: timecode and settings (small enough to want the lens) ----
  const tc = (s: number) => {
    const f = Math.floor((s % 1) * 30);
    const sec = Math.floor(s) % 60;
    return `00:00:${String(sec).padStart(2, "0")}:${String(f).padStart(2, "0")}`;
  };
  const sx = pv.x + pv.w + 20;
  paintCachedLayer(ctx, `attachment-readout:${appThemeKey()}`, {x:sx-2,y:pv.y,w:a.x+a.w-sx+2,h:82}, c => {
    text(c, "TIMECODE", sx, pv.y + 7, { size: 6, weight: 600, color: P.label });
    ["ZOOM", "FOCUS", "BLUR"].forEach((label, i) => text(c, label, sx, pv.y + 42 + i * 13, { size: 6.5, weight: 600, color: P.label }));
    text(c, "f/2.8 · 50 mm", sx + 36, pv.y + 55, { size: 6.5, weight: 500, color: P.value, family: MONO });
  });
  text(ctx, tc(pt), sx, pv.y + 21, { size: 12, weight: 600, color: P.strong, family: MONO });
  text(ctx, `${zoom.toFixed(2)}×`, sx + 36, pv.y + 42, { size: 6.5, weight: 500, color: P.dark ? "#ffb547" : "#c26a00", family: MONO });
  text(ctx, `${Math.round(30 + 20 * Math.sin(pt * 2))}%`, sx + 36, pv.y + 68, { size: 6.5, weight: 500, color: P.value, family: MONO });
  // export progress: a ring with its percentage
  const ringC = { x: a.x + a.w - 30, y: a.y + 30 };
  const done = playing ? clamp01(0.18 + progress * 0.8) : 0.18;
  ctx.lineCap = "round";
  ctx.lineWidth = 2.2;
  ctx.beginPath();
  ctx.arc(ringC.x, ringC.y, 11, 0, Math.PI * 2);
  ctx.strokeStyle = P.dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)";
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(ringC.x, ringC.y, 11, -Math.PI / 2, -Math.PI / 2 + done * Math.PI * 2);
  ctx.strokeStyle = C.accent;
  ctx.stroke();
  ctx.lineCap = "butt";
  text(ctx, `${Math.round(done * 100)}`, ringC.x, ringC.y + 0.5, { size: 6.5, weight: 600, color: P.value, align: "center", family: MONO });

  // ---- timeline: zoom curve, audio, clips, playhead ----
  const tl = { x: a.x + 16, y: a.y + a.h * 0.6, w: a.w - 32, h: a.h * 0.32 };
  const lane = tl.h / 3;
  const ph = tl.x + progress * tl.w;
  paintCachedLayer(ctx, `attachment-timeline:${appThemeKey()}`, { x: tl.x - 6, y: tl.y - 14, w: tl.w + 12, h: tl.h + 16 }, c => {
    const ctx = c;
  for (let i = 0; i < 3; i += 1) {
    rr(ctx, tl.x - 4, tl.y + i * lane + 1.5, tl.w + 8, lane - 3, 5);
    ctx.fillStyle = P.lane;
    ctx.fill();
  }

  // zoom curve: an area under the curve and round keyframes, like the editor's zoom lane
  const curveY = (u: number) => tl.y + lane * 0.85 - (0.5 - 0.5 * Math.cos(u * Math.PI * 4)) * lane * 0.6;
  const curve = new Path2D();
  for (let i = 0; i <= 96; i += 1) {
    const u = i / 96;
    if (i === 0) curve.moveTo(tl.x + u * tl.w, curveY(u));
    else curve.lineTo(tl.x + u * tl.w, curveY(u));
  }
  const area = new Path2D(curve);
  area.lineTo(tl.x + tl.w, tl.y + lane - 1.5);
  area.lineTo(tl.x, tl.y + lane - 1.5);
  area.closePath();
  const fill = ctx.createLinearGradient(0, tl.y, 0, tl.y + lane);
  fill.addColorStop(0, P.dark ? "rgba(255,166,23,0.22)" : "rgba(245,140,10,0.2)");
  fill.addColorStop(1, "rgba(255,166,23,0)");
  ctx.fillStyle = fill;
  ctx.fill(area);
  ctx.strokeStyle = P.dark ? "rgba(255,180,60,0.9)" : "rgba(225,125,0,0.9)";
  ctx.lineWidth = 1.2;
  ctx.stroke(curve);
  for (let i = 0; i < 5; i += 1) {
    const u = i / 4;
    const px = tl.x + u * tl.w;
    const py = curveY(u);
    ctx.beginPath();
    ctx.arc(px, py, 2.6, 0, Math.PI * 2);
    ctx.fillStyle = P.dark ? "#ffb547" : "#e8890b";
    ctx.fill();
    ctx.strokeStyle = P.surface;
    ctx.lineWidth = 1.2;
    ctx.stroke();
    // keyframes alternate between the resting 1× and the zoomed 2×, like the curve
    const label = i % 2 ? "2.0×" : "1.0×";
    text(ctx, label, Math.min(px + 5, tl.x + tl.w - 12), py + (i % 2 ? 8 : -6), { size: 6, weight: 600, color: P.dark ? "#ffc773" : "#a35a00" });
  }
  // clips
  const clip = (x: number, w: number, fillC: string, line: string, label: string, color: string) => {
    const y = tl.y + lane * 2 + 3;
    rr(ctx, x, y, w, lane - 6, 4);
    ctx.fillStyle = fillC;
    ctx.fill();
    ctx.strokeStyle = line;
    ctx.lineWidth = 0.8;
    ctx.stroke();
    text(ctx, label, x + 6, y + (lane - 6) / 2 + 0.5, { size: 6, weight: 500, color });
  };
  clip(tl.x, tl.w * 0.42, P.clipZoom, P.clipZoomLine, "Zoom · 1.0× ↔ 2.0×", P.clipZoomText);
  clip(tl.x + tl.w * 0.45, tl.w * 0.33, P.clipCap, P.clipCapLine, "Click export and every zoom lands…", P.clipCapText);

  });

  // audio: mirrored bars, brighter where the playhead has been
  const wy = tl.y + lane * 1.5;
  // Bars never overlap. One path per colour preserves every pixel while
  // avoiding 96 separate fill/style submissions per animated frame.
  const played = new Path2D(), upcoming = new Path2D();
  for (let i = 0; i < 96; i += 1) {
    const x = tl.x + (i / 96) * tl.w;
    const amp = Math.abs(Math.sin(i * 0.7 + pt * 5) * Math.cos(i * 0.23 - pt * 2.3));
    const h = 1.6 + amp * lane * 0.62;
    (x <= ph ? played : upcoming).roundRect(x, wy - h / 2, 1.8, h, 0.9);
  }
  ctx.fillStyle = P.waveOn; ctx.fill(played);
  ctx.fillStyle = P.waveOff; ctx.fill(upcoming);


  // playhead
  ctx.fillStyle = "#e5484d";
  ctx.fillRect(ph - 0.6, tl.y - 4, 1.2, tl.h + 4);
  ctx.beginPath();
  ctx.arc(ph, tl.y - 5, 3, 0, Math.PI * 2);
  ctx.fill();

  // ---- paused: a light scrim and a frosted play button ----
  const pausedA = playing ? 1 - clamp01((time - T.play) / 0.25) : 1;
  if (pausedA > 0) {
    ctx.fillStyle = P.scrim;
    ctx.globalAlpha = pausedA;
    ctx.fillRect(a.x, a.y, a.w, a.h);
    const s = 1 + (playing ? (1 - pausedA) * 0.3 : 0);
    ctx.save();
    ctx.beginPath();
    ctx.arc(PLAY.x, PLAY.y, 24 * s, 0, Math.PI * 2);
    ctx.shadowColor = P.dark ? "rgba(0,0,0,0.45)" : "rgba(20,24,40,0.18)";
    ctx.shadowBlur = 18;
    ctx.shadowOffsetY = 4;
    ctx.fillStyle = P.dark ? "rgba(255,255,255,0.94)" : "#ffffff";
    ctx.fill();
    ctx.restore();
    ctx.beginPath();
    ctx.moveTo(PLAY.x - 5 * s, PLAY.y - 8 * s);
    ctx.lineTo(PLAY.x + 9 * s, PLAY.y);
    ctx.lineTo(PLAY.x - 5 * s, PLAY.y + 8 * s);
    ctx.closePath();
    ctx.lineJoin = "round";
    ctx.lineWidth = 2;
    ctx.fillStyle = "#16171b";
    ctx.strokeStyle = "#16171b";
    ctx.fill();
    ctx.stroke();
    ctx.lineJoin = "miter";
    ctx.globalAlpha = 1;
  }
  ctx.restore();
  rr(ctx, a.x + 0.5, a.y + 0.5, a.w - 1, a.h - 1, 12);
  ctx.strokeStyle = C.panelBorder;
  ctx.lineWidth = 1;
  ctx.stroke();
}


type Bounds = { x: number; y: number; w: number; h: number };
type CachedLayer = { canvas: HTMLCanvasElement; pixels: number; scale: number };
const appSprites = new Map<string, CachedLayer>();
const highSprites = new Map<string, CachedLayer>();
let highPixels = 0;
let spritePixels = 0;
const SPRITE_BUDGET = 64 * 1024 * 1024;
const TILE = 256;

function spriteCanvas() { return document.createElement("canvas"); }
const appViewports = new WeakMap<CanvasRenderingContext2D, Bounds>();
function visibleAppBounds(ctx: CanvasRenderingContext2D): Bounds {
  const inv = ctx.getTransform().inverse();
  const viewport = appViewports.get(ctx) ?? { x: 0, y: 0, w: ctx.canvas.width, h: ctx.canvas.height };
  const { x: vx, y: vy, w: vw, h: vh } = viewport;
  const corners = [[vx,vy],[vx+vw,vy],[vx,vy+vh],[vx+vw,vy+vh]]
    .map(([x,y]) => inv.transformPoint(new DOMPoint(x,y)));
  const x = Math.min(...corners.map(p=>p.x)), y = Math.min(...corners.map(p=>p.y));
  return { x, y, w: Math.max(...corners.map(p=>p.x))-x, h: Math.max(...corners.map(p=>p.y))-y };
}

function paintCachedLayer(ctx: CanvasRenderingContext2D, key: string, bounds: Bounds, paint: (ctx: CanvasRenderingContext2D)=>void, sampling?: {scale:number;view:Bounds}) {
  const m = sampling ? null : ctx.getTransform();
  const scale = sampling?.scale ?? Math.pow(2, Math.ceil(Math.log2(Math.max(0.5,Math.hypot(m!.a,m!.b),Math.hypot(m!.c,m!.d)))));
  const view = sampling?.view ?? visibleAppBounds(ctx);
  const tiled = scale > 4;
  const pool = tiled ? highSprites : appSprites;
  const left = tiled ? Math.max(Math.floor(bounds.x/TILE),Math.floor(view.x/TILE))*TILE : bounds.x;
  const top = tiled ? Math.max(Math.floor(bounds.y/TILE),Math.floor(view.y/TILE))*TILE : bounds.y;
  const right = tiled ? Math.min(Math.ceil((bounds.x+bounds.w)/TILE),Math.ceil((view.x+view.w)/TILE))*TILE : bounds.x+bounds.w;
  const bottom = tiled ? Math.min(Math.ceil((bounds.y+bounds.h)/TILE),Math.ceil((view.y+view.h)/TILE))*TILE : bounds.y+bounds.h;
  for (let gy=top;gy<bottom;gy+=tiled?TILE:bounds.h) for (let gx=left;gx<right;gx+=tiled?TILE:bounds.w) {
    // Edge tiles contain only this layer's real bounds. A 44px issue row must
    // not allocate/rasterise a full 256px tile (or paint neighbouring rows).
    const x = Math.max(bounds.x, gx), y = Math.max(bounds.y, gy);
    const w = Math.min(bounds.x + bounds.w, tiled ? gx + TILE : right) - x;
    const h = Math.min(bounds.y + bounds.h, tiled ? gy + TILE : bottom) - y;
    const pad = 2;
    const id = [key,scale,x,y,w,h].join("|");
    let layer = pool.get(id);
    if (!layer) {
      const started = performance.now(), canvas = spriteCanvas();
      canvas.width = Math.ceil((w+pad*2)*scale); canvas.height = Math.ceil((h+pad*2)*scale);
      const c = canvas.getContext("2d")!;
      c.setTransform(scale,0,0,scale,(pad-x)*scale,(pad-y)*scale);
      paint(c);
      layer = { canvas, pixels: canvas.width*canvas.height, scale };
      pool.set(id,layer); if(tiled)highPixels+=layer.pixels;else spritePixels+=layer.pixels;
      recordRenderCost("app-sprite",started,{key,scale,x,y,width:canvas.width,height:canvas.height});
    } else { pool.delete(id); pool.set(id,layer); }
    ctx.drawImage(layer.canvas,pad*scale,pad*scale,w*scale,h*scale,x,y,w,h);
  }
  while ((tiled ? highPixels > 28*1024*1024 : spritePixels > SPRITE_BUDGET) && pool.size > 1) {
    // Retain overview scales and small overlay sprites when large detail rasters compete for the budget.
    const first = (!tiled ? [...pool].find(([,entry])=>entry.scale>2 && entry.pixels>1024*1024)?.[0] : undefined) ?? pool.keys().next().value!;
    const old = pool.get(first)!;
    pool.delete(first); if(tiled)highPixels-=old.pixels;else spritePixels-=old.pixels;
    old.canvas.width = old.canvas.height = 1;
  }
}

/** Content and overlays are cached separately: fades move bitmaps, not hundreds of text/path commands. */
export function drawRecordedApp(ctx: CanvasRenderingContext2D, time = 0, viewport?: Bounds) {
  const previous = appViewports.get(ctx);
  if (viewport) appViewports.set(ctx, viewport);
  try { drawRecordedAppVisible(ctx, time); }
  finally {
    if (previous) appViewports.set(ctx, previous);
    else appViewports.delete(ctx);
  }
}

function drawRecordedAppVisible(ctx: CanvasRenderingContext2D, time: number) {
  const t = ((time % RECORDING_DURATION) + RECORDING_DURATION) % RECORDING_DURATION, cursor = cursorAt(t), theme = appThemeKey();
  const menuOpen = t>=T.menuOpen && t<T.done;
  const detail = t>=T.openDetail && t<T.closeDetail+0.3;
  const row = ROWS.findIndex(({y})=>!menuOpen && inside(cursor,{x:PANEL.x,y,w:PANEL.w,h:ROW_H}) && !(detail && cursor.x>DETAIL.x));
  const selected = t>=T.openDetail && t<T.closeDetail;
  const key = String(theme);
  const view = visibleAppBounds(ctx);
  const insideDetail = detail && t>=T.openDetail+0.32 && t<T.closeDetail && view.x>DETAIL.x+14;
  if (insideDetail) { ctx.save(); rr(ctx,0,0,CW,CH,12);ctx.clip();ctx.fillStyle=C.chrome;ctx.fillRect(0,0,CW,CH);ctx.restore(); }
  if (!insideDetail) paintCachedLayer(ctx,"base:"+key,{x:0,y:0,w:CW,h:CH},c=>drawRecordedAppRaw(c,0,false,false,false));
  const pop = t>=T.done ? springPop(t-T.done) : 1;
  ctx.save(); rr(ctx,0,0,CW,CH,12); ctx.clip(); rr(ctx,PANEL.x,PANEL.y,PANEL.w,PANEL.h,10); ctx.clip();
  if (!insideDetail) {
    const m=ctx.getTransform();
    const sampling={view,scale:Math.pow(2,Math.ceil(Math.log2(Math.max(0.5,Math.hypot(m.a,m.b),Math.hypot(m.c,m.d)))))};
    for (let i=0;i<ROWS.length;i++) {
      const item=ROWS[i];
      if(item.y+ROW_H<view.y || item.y>view.y+view.h || PANEL.x>view.x+view.w || PANEL.x+PANEL.w<view.x)continue;
      const hovered=i===row, chosen=item.issue.id==="SCR-479" && selected;
      const active=item.issue.id==="SCR-482" && menuOpen, done=item.issue.id==="SCR-482" && t>=T.done;
      paintCachedLayer(ctx,`row:${theme}:${i}:${hovered}:${chosen}:${active}:${done}`,{x:PANEL.x,y:item.y,w:PANEL.w,h:ROW_H},c=>paintIssueRow(c,t,item),sampling);
    }
    if(t>=T.done) [0,3].forEach(i=>{
      const group=GROUPS[i],y=GROUP_Y[i];
      ctx.font=font(13,400); const x=PANEL.x+52+measureWidth(ctx,group.name);
      ctx.fillStyle=C.group;ctx.fillRect(x-2,y+4,22,GROUP_H-8);
      text(ctx,String(group.issues.length+(i===0?-1:1)),x,y+GROUP_H/2+0.5,{size:12,color:C.muted});
    });
  }
  statusIcon(ctx,t>=T.done?"done":"progress",COL.status,ROW_482.y+ROW_H/2,pop);
  if (t>=T.menuOpen-0.02 && t<T.done+0.16) {
    const k = t<T.done ? springIn(t-T.menuOpen) : 1-springIn(t-T.done);
    const item = MENU_ITEMS.findIndex((_,i)=>inside(cursor,{x:MENU.x,y:menuItemY(i),w:MENU.w,h:MENU.item}));
    ctx.save(); ctx.globalAlpha *= k; ctx.translate(MENU.x,MENU.y); ctx.scale(0.96+0.04*k,0.96+0.04*k); ctx.translate(-MENU.x,-MENU.y);
    paintCachedLayer(ctx,`menu:${theme}:${item}`,{x:MENU.x-40,y:MENU.y-40,w:MENU.w+80,h:40+MENU_ITEMS.length*MENU.item+86},c=>paintStatusMenu(c,t,true));
    ctx.restore();
  }
  if (t>=T.done && t<T.toastEnd) {
    const k = Math.min(springIn(t-T.done),1-springIn(t-(T.toastEnd-0.3)));
    ctx.save(); ctx.globalAlpha *= k; ctx.translate(0,(1-k)*16);
    paintCachedLayer(ctx,`toast:${theme}`,{x:PANEL.x+PANEL.w/2-180,y:PANEL.y+PANEL.h-94,w:360,h:100},c=>paintToast(c,t,true));
    ctx.restore();
  }
  if (detail) {
    const k = t<T.closeDetail ? springIn(t-T.openDetail) : 1-springIn(t-T.closeDetail);
    const focused = t>=T.focusComment && t<T.submit+0.4;
    ctx.save(); ctx.globalAlpha *= Math.min(1,k*1.4); ctx.translate((1-k)*60,0);
    paintCachedLayer(ctx,`detail:${theme}:${focused}`,{x:DETAIL.x-60,y:DETAIL.y-60,w:DETAIL.w+120,h:DETAIL.h+120},c=>paintDetail(c,t,false,true));
    drawAttachment(ctx,t); drawComment(ctx,t);
    if (t>=T.submit) {
      const dx=DETAIL.x+28, ay=ATTACHMENT.y+ATTACHMENT.h+58, y=ay+120, fresh=springIn(t-T.submit);
      ctx.save(); ctx.globalAlpha *= fresh; ctx.translate(0,(1-fresh)*8);
      paintCachedLayer(ctx, `activity:${theme}`, {x:dx-2,y:y-14,w:DETAIL.w-52,h:28}, c => {
        avatar(c,["CJ","#e5484d"],dx+9,y,9);
        text(c,`Cats Juice: ${TYPED_COMMENT}`,dx+26,y+0.5,{size:12.5,color:C.text2});
        text(c,"now",DETAIL.x+DETAIL.w-28,y+0.5,{size:12,color:C.faint,align:"right"});
      }); ctx.restore();
    }
    ctx.restore();
  }
  ctx.restore();
}

function drawComment(ctx: CanvasRenderingContext2D, t: number) {
  const dx = DETAIL.x + 28, ty = DETAIL.y + DETAIL.h - 40.5;
  const focused = t >= T.focusComment && t < T.submit + 0.4;
  const typed = typedAt(t);
  if (typed) text(ctx, typed, dx + 14, ty, { size: 13, color: C.text });
  else if (!focused || t < T.typeStart) text(ctx, "Leave a comment…", dx + 14, ty, { size: 13, color: C.faint });
  if (focused && t < T.submit && Math.floor(t * 2.2) % 2 === 0) {
    ctx.font = font(13, 400);
    const cx = dx + 14 + measureWidth(ctx,typed) + 1;
    ctx.fillStyle = C.accent; ctx.fillRect(cx, ty - 8, 1.5, 16);
  }
}

/** Rasterise the first-use detail scales and lens tiles while the page is idle. */
export function warmRecordedApp() {
  let stopped=false, idle=0;
  const scratch=document.createElement("canvas");
  const jobs: Array<()=>void> = [];
  const context=(scale:number,x:number,y:number,w:number,h:number)=>{
    scratch.width=Math.ceil(w*scale);scratch.height=Math.ceil(h*scale);
    const c=scratch.getContext("2d")!;c.setTransform(scale,0,0,scale,-x*scale,-y*scale);return c;
  };
  jobs.push(()=>drawRecordedApp(context(1,0,0,CW,CH),8));
  for (const scale of [2, 4]) jobs.push(() => drawRecordedApp(context(scale, 0, 0, CW, CH), 19.4));
  for(const scale of [1,2,4]) for(const focused of [false,true]) jobs.push(()=>{
    const bounds={x:DETAIL.x-60,y:DETAIL.y-60,w:DETAIL.w+120,h:DETAIL.h+120};
    paintCachedLayer(context(scale,bounds.x,bounds.y,bounds.w,bounds.h),`detail:${appThemeKey()}:${focused}`,bounds,c=>paintDetail(c,focused?T.focusComment+0.1:19.2,false,true));
  });
  for(const y of [0,1,2])for(const x of [3,4])jobs.push(()=>{
    paintCachedLayer(context(8,x*TILE,y*TILE,TILE,TILE),`detail:${appThemeKey()}:false`,{x:DETAIL.x-60,y:DETAIL.y-60,w:DETAIL.w+120,h:DETAIL.h+120},c=>paintDetail(c,19.2,false,true));
  });
  const next=()=>{
    if(stopped || !jobs.length){scratch.width=scratch.height=1;return;}
    idle=requestIdleCallback(async()=>{
      if(stopped)return;
      jobs.shift()!();
      try { const bitmap=await createImageBitmap(scratch);bitmap.close(); } catch {}
      next();
    });
  };
  if(typeof requestIdleCallback==="function" && typeof createImageBitmap==="function")next();
  return()=>{stopped=true;if(idle)cancelIdleCallback(idle);scratch.width=scratch.height=1;};
}

export function disposeRecordedAppCaches() {
  for(const pool of [appSprites,highSprites]) { for(const entry of pool.values()) entry.canvas.width=entry.canvas.height=1;pool.clear(); }
  spritePixels=highPixels=0;
}

/* ---------- the app ---------- */

export function drawRecordedAppRaw(ctx: CanvasRenderingContext2D, time = 0, attachment = true, overlays = true, rows = true) {
  const t = ((time % RECORDING_DURATION) + RECORDING_DURATION) % RECORDING_DURATION;
  const cursor = cursorAt(t);

  ctx.save();
  rr(ctx, 0, 0, CW, CH, 12);
  ctx.fillStyle = C.chrome;
  ctx.fill();
  ctx.clip();

  // ---- sidebar ----
  ["#ff5f57", "#febc2e", "#28c840"].forEach((col, i) => {
    ctx.beginPath();
    ctx.arc(20 + i * 19, 20, 6, 0, Math.PI * 2);
    ctx.fillStyle = col;
    ctx.fill();
  });
  rr(ctx, 16, 44, 20, 20, 5);
  const lg = ctx.createLinearGradient(16, 44, 36, 64);
  lg.addColorStop(0, "#ff6a3d");
  lg.addColorStop(1, "#e5484d");
  ctx.fillStyle = lg;
  ctx.fill();
  ctx.beginPath();
  ctx.arc(26, 54, 4, 0, Math.PI * 2);
  ctx.fillStyle = "#fff";
  ctx.fill();
  text(ctx, "ScreenCam", 44, 54.5, { size: 13, weight: 500, color: C.text });
  icon(ctx, "search", 172, 54, 14, C.muted);
  icon(ctx, "square-pen", 198, 54, 14, C.muted);
  const side = (y: number, name: string, label: string, opts: { active?: boolean; badge?: string; indent?: number } = {}) => {
    const x = 12 + (opts.indent ?? 0);
    if (opts.active) {
      rr(ctx, x - 4, y - 13, SIDEBAR_W - x - 4, 26, 6);
      ctx.fillStyle = C.chip;
      ctx.fill();
    }
    icon(ctx, name, x + 9, y, 14, opts.active ? C.text : C.muted);
    text(ctx, label, x + 26, y + 0.5, { size: 13, weight: 400, color: opts.active ? C.text : C.text2 });
    if (opts.badge) text(ctx, opts.badge, SIDEBAR_W - 22, y + 0.5, { size: 11, weight: 400, color: C.muted, align: "right" });
  };
  side(92, "inbox", "Inbox", { badge: "3" });
  side(120, "user-round", "My issues");
  text(ctx, "Workspace", 16, 160, { size: 11.5, weight: 400, color: C.faint });
  side(186, "box", "Projects");
  side(214, "layers", "Views");
  text(ctx, "Your teams", 16, 254, { size: 11.5, weight: 400, color: C.faint });
  rr(ctx, 16, 272, 18, 18, 5);
  ctx.fillStyle = C.teamIcon;
  ctx.fill();
  text(ctx, "🎥", 25, 281.5, { size: 10, color: "#fff", align: "center" });
  text(ctx, "ScreenCam", 42, 281.5, { size: 13, weight: 400, color: C.text2 });
  side(310, "copy", "Issues", { active: true, indent: 14 });
  side(338, "refresh-cw", "Cycles", { indent: 14 });
  side(366, "box", "Projects", { indent: 14 });
  side(394, "layers", "Views", { indent: 14 });
  text(ctx, "Try", 16, 436, { size: 11.5, weight: 400, color: C.faint });
  side(462, "star", "Import issues");
  side(490, "user-round", "Invite people");

  // ---- main panel ----
  rr(ctx, PANEL.x, PANEL.y, PANEL.w, PANEL.h, 10);
  ctx.fillStyle = C.panel;
  ctx.fill();
  ctx.strokeStyle = C.panelBorder;
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.save();
  rr(ctx, PANEL.x, PANEL.y, PANEL.w, PANEL.h, 10);
  ctx.clip();

  // header
  const hy = PANEL.y + HEADER_H / 2;
  text(ctx, "ScreenCam", PANEL.x + 20, hy + 0.5, { size: 13, weight: 400, color: C.muted });
  icon(ctx, "chevron-right", PANEL.x + 96, hy, 12, C.faint);
  text(ctx, "Issues", PANEL.x + 108, hy + 0.5, { size: 13, weight: 400, color: C.text });
  const tabs = ["All issues", "Active", "Backlog"];
  let tx = PANEL.x + 170;
  tabs.forEach((label, i) => {
    ctx.font = font(12, 400);
    const w = measureWidth(ctx,label) + 20;
    rr(ctx, tx, hy - 12, w, 24, 6);
    if (i === 0) {
      ctx.fillStyle = C.chip;
      ctx.fill();
    }
    ctx.strokeStyle = i === 0 ? C.menuBorder : "transparent";
    ctx.stroke();
    text(ctx, label, tx + 10, hy + 0.5, { size: 12, weight: 400, color: i === 0 ? C.text : C.muted });
    tx += w + 6;
  });
  icon(ctx, "list-filter", PANEL.x + PANEL.w - 72, hy, 14, C.muted);
  icon(ctx, "sliders-horizontal", PANEL.x + PANEL.w - 44, hy, 14, C.muted);
  ctx.fillStyle = C.line;
  ctx.fillRect(PANEL.x, PANEL.y + HEADER_H - 1, PANEL.w, 1);

  // groups + rows
  const doneAt = T.done;
  const statusOf = (issue: Issue, group: Group): Status => (issue.id === "SCR-482" && t >= doneAt ? "done" : group.status);
  GROUPS.forEach((g, gi) => {
    const y = GROUP_Y[gi];
    ctx.fillStyle = C.group;
    ctx.fillRect(PANEL.x, y, PANEL.w, GROUP_H);
    statusIcon(ctx, g.status, PANEL.x + 26, y + GROUP_H / 2);
    text(ctx, g.name, PANEL.x + 42, y + GROUP_H / 2 + 0.5, { size: 13, weight: 400, color: C.text });
    ctx.font = font(13, 400);
    const nw = measureWidth(ctx,g.name);
    const count = g.status === "progress" && t >= doneAt ? g.issues.length - 1 : g.issues.length;
    text(ctx, String(g.status === "done" && t >= doneAt ? count + 1 : count), PANEL.x + 52 + nw, y + GROUP_H / 2 + 0.5, { size: 12, color: C.muted });
    icon(ctx, "ellipsis", PANEL.x + PANEL.w - 48, y + GROUP_H / 2, 14, C.faint);
  });
  const menuOpen = t >= T.menuOpen && t < T.done;
  if (rows) for (const row of ROWS) paintIssueRow(ctx,t,row,overlays);

  if (overlays) {
    paintStatusMenu(ctx, t);
    paintToast(ctx, t);
    paintDetail(ctx, t, attachment);
  }

  ctx.restore();
  ctx.restore();
}

function paintIssueRow(ctx: CanvasRenderingContext2D, t: number, row: typeof ROWS[number], overlays = false) {
  const cursor=cursorAt(t), doneAt=T.done;
  const menuOpen=t>=T.menuOpen && t<T.done;
  const statusOf=(issue: Issue,group:Group):Status=>issue.id==="SCR-482" && t>=doneAt?"done":group.status;

    const { issue, group, y } = row;
    const hover = !menuOpen && inside(cursor, { x: PANEL.x, y, w: PANEL.w, h: ROW_H }) && !(t >= T.openDetail && t < T.closeDetail + 0.3 && cursor.x > DETAIL.x);
    const selected = issue.id === "SCR-479" && t >= T.openDetail && t < T.closeDetail;
    if (hover || selected || (issue.id === "SCR-482" && menuOpen)) {
      ctx.fillStyle = selected ? C.rowSelected : C.rowHover;
      ctx.fillRect(PANEL.x, y, PANEL.w, ROW_H);
    }
    ctx.fillStyle = C.line;
    ctx.fillRect(PANEL.x + 16, y + ROW_H - 0.5, PANEL.w - 32, 0.5);
    const cy = y + ROW_H / 2;
    priorityIcon(ctx, issue.priority, COL.priority, cy);
    text(ctx, issue.id, COL.id, cy + 0.5, { size: 12, weight: 400, color: C.muted });
    const st = statusOf(issue, group);
    const pop = issue.id === "SCR-482" && t >= doneAt ? springPop(t - doneAt) : 1;
    if (overlays || issue.id !== "SCR-482") statusIcon(ctx, st, COL.status, cy, pop);
    text(ctx, issue.title, COL.title, cy + 0.5, { size: 13, weight: 400, color: st === "done" && group.status !== "done" ? C.muted : C.text });
    avatar(ctx, issue.who, PANEL.x + PANEL.w - 30, cy);
    text(ctx, issue.date, PANEL.x + PANEL.w - 50, cy + 0.5, { size: 12, color: C.muted, align: "right" });
    labelChip(ctx, issue.label, PANEL.x + PANEL.w - 104, cy);
}

function paintStatusMenu(ctx: CanvasRenderingContext2D, t: number, fixed = false) {
 const cursor = cursorAt(t);
  // ---- status menu ----
  if (fixed || (t >= T.menuOpen - 0.02 && t < T.done + 0.16)) {
    const k = fixed ? 1 : t < T.done ? springIn(t - T.menuOpen) : 1 - springIn(t - T.done);
    ctx.save();
    ctx.globalAlpha = k;
    ctx.translate(MENU.x, MENU.y);
    ctx.scale(0.96 + 0.04 * k, 0.96 + 0.04 * k);
    ctx.translate(-MENU.x, -MENU.y);
    const mh = 40 + MENU_ITEMS.length * MENU.item + 6;
    rr(ctx, MENU.x, MENU.y, MENU.w, mh, 8);
    ctx.shadowColor = `rgba(0,0,0,${appDark ? 0.55 : 0.14})`;
    ctx.shadowBlur = 24;
    ctx.shadowOffsetY = 10;
    ctx.fillStyle = C.menu;
    ctx.fill();
    ctx.shadowColor = "transparent";
    ctx.strokeStyle = C.menuBorder;
    ctx.lineWidth = 1;
    ctx.stroke();
    text(ctx, "Change status…", MENU.x + 14, MENU.y + 19, { size: 12.5, color: C.faint });
    text(ctx, "S", MENU.x + MENU.w - 16, MENU.y + 19, { size: 11, weight: 400, color: C.faint, align: "right" });
    ctx.fillStyle = C.menuBorder;
    ctx.fillRect(MENU.x, MENU.y + 36, MENU.w, 1);
    MENU_ITEMS.forEach(([st, label, key], i) => {
      const iy = menuItemY(i);
      const hovered = inside(cursor, { x: MENU.x, y: iy, w: MENU.w, h: MENU.item });
      if (hovered) {
        rr(ctx, MENU.x + 4, iy + 1, MENU.w - 8, MENU.item - 2, 5);
        ctx.fillStyle = C.menuHover;
        ctx.fill();
      }
      statusIcon(ctx, st, MENU.x + 22, iy + MENU.item / 2);
      text(ctx, label, MENU.x + 40, iy + MENU.item / 2 + 0.5, { size: 13, weight: 400, color: C.text2 });
      if (st === "progress") icon(ctx, "check", MENU.x + MENU.w - 44, iy + MENU.item / 2, 13, C.text2, 2);
      text(ctx, key, MENU.x + MENU.w - 16, iy + MENU.item / 2 + 0.5, { size: 11, weight: 400, color: C.faint, align: "right" });
    });
    ctx.restore();
  }

}

function paintToast(ctx: CanvasRenderingContext2D, t: number, fixed = false) {
  // ---- toast ----
  if (fixed || (t >= T.done && t < T.toastEnd)) {
    const k = fixed ? 1 : Math.min(springIn(t - T.done), 1 - springIn(t - (T.toastEnd - 0.3)));
    const w = 300;
    const x = PANEL.x + PANEL.w / 2 - w / 2;
    const y = PANEL.y + PANEL.h - 64 + (1 - k) * 16;
    ctx.save();
    ctx.globalAlpha = k;
    rr(ctx, x, y, w, 40, 8);
    ctx.shadowColor = `rgba(0,0,0,${appDark ? 0.5 : 0.12})`;
    ctx.shadowBlur = 20;
    ctx.fillStyle = C.menu;
    ctx.fill();
    ctx.shadowColor = "transparent";
    ctx.strokeStyle = C.menuBorder;
    ctx.stroke();
    statusIcon(ctx, "done", x + 22, y + 20);
    text(ctx, "SCR-482 moved to Done", x + 38, y + 20.5, { size: 13, weight: 400, color: C.text });
    text(ctx, "Undo", x + w - 16, y + 20.5, { size: 12.5, weight: 400, color: C.accent, align: "right" });
    ctx.restore();
  }

}

function paintDetail(ctx: CanvasRenderingContext2D, t: number, attachment = true, fixed = false) {
  // ---- issue detail (SCR-479) ----
  if (fixed || (t >= T.openDetail && t < T.closeDetail + 0.3)) {
    const k = fixed ? 1 : t < T.closeDetail ? springIn(t - T.openDetail) : 1 - springIn(t - T.closeDetail);
    const x = DETAIL.x + (1 - k) * 60;
    ctx.save();
    ctx.globalAlpha = Math.min(1, k * 1.4);
    ctx.translate(x - DETAIL.x, 0);
    ctx.shadowColor = `rgba(0,0,0,${appDark ? 0.6 : 0.1})`;
    ctx.shadowBlur = 40;
    ctx.fillStyle = C.detail;
    ctx.fillRect(DETAIL.x, DETAIL.y, DETAIL.w, DETAIL.h);
    ctx.shadowColor = "transparent";
    ctx.fillStyle = C.panelBorder;
    ctx.fillRect(DETAIL.x, DETAIL.y, 1, DETAIL.h);
    const dx = DETAIL.x + 28;
    // top bar
    text(ctx, "SCR-479", dx, DETAIL.y + 22.5, { size: 12, weight: 400, color: C.muted });
    rr(ctx, dx + 64, DETAIL.y + 10, 104, 24, 6);
    ctx.fillStyle = C.chip;
    ctx.fill();
    statusIcon(ctx, "progress", dx + 78, DETAIL.y + 22);
    text(ctx, "In Progress", dx + 90, DETAIL.y + 22.5, { size: 12, weight: 400, color: C.text2 });
    icon(ctx, "link-2", DETAIL.x + DETAIL.w - 76, DETAIL.y + 22, 14, C.muted);
    icon(ctx, "star", DETAIL.x + DETAIL.w - 50, DETAIL.y + 22, 14, C.muted);
    icon(ctx, "ellipsis", DETAIL.x + DETAIL.w - 24, DETAIL.y + 22, 14, C.muted);
    ctx.fillStyle = C.line;
    ctx.fillRect(DETAIL.x, DETAIL.y + HEADER_H - 1, DETAIL.w, 1);
    // title + description
    text(ctx, "3D camera: depth of field follows the cursor", dx, 88, { size: 19, weight: 500, color: C.text });
    const desc = [
      "Focus should track the cursor's depth on the tilted plane, so the far",
      "edge falls off naturally. CoC grows linearly with distance from the",
      "focus line; aperture scales the maximum radius.",
    ];
    desc.forEach((line, i) => text(ctx, line, dx, 124 + i * 21, { size: 13, color: C.body }));
    text(ctx, "Preview attached below ↓", dx, 190, { size: 12, color: C.faint });
    if (attachment) drawAttachment(ctx, t);
    icon(ctx, "paperclip", dx + 6, ATTACHMENT.y + ATTACHMENT.h + 20, 12, C.muted);
    text(ctx, "dof-preview.mov · 0:12 · 4.2 MB", dx + 18, ATTACHMENT.y + ATTACHMENT.h + 20.5, { size: 12, color: C.muted });
    // activity
    const ay = ATTACHMENT.y + ATTACHMENT.h + 58;
    text(ctx, "Activity", dx, ay, { size: 13, weight: 500, color: C.text });
    const acts: Array<[[string, string], string, string]> = [
      [["PX", "#3e63dd"], "Peng moved from Todo to In Progress", "2h ago"],
      [["CJ", "#e5484d"], "Cats Juice attached dof-preview.mov", "1h ago"],
      [["LZ", "#30a46c"], "Lin: the falloff reads much better now 👌", "12m ago"],
    ];
    if (attachment && t >= T.submit) acts.push([["CJ", "#e5484d"], `Cats Juice: ${TYPED_COMMENT}`, "now"]);
    acts.forEach(([who, line, when], i) => {
      const y = ay + 30 + i * 30;
      const fresh = i === 3 ? springIn(t - T.submit) : 1;
      ctx.save();
      ctx.globalAlpha *= fresh;
      ctx.translate(0, (1 - fresh) * 8);
      avatar(ctx, who, dx + 9, y, 9);
      text(ctx, line, dx + 26, y + 0.5, { size: 12.5, color: C.text2 });
      text(ctx, when, DETAIL.x + DETAIL.w - 28, y + 0.5, { size: 12, color: C.faint, align: "right" });
      ctx.restore();
    });
    // comment box: focused by the click, then typed into
    const focused = t >= T.focusComment && t < T.submit + 0.4;
    rr(ctx, dx, DETAIL.y + DETAIL.h - 62, DETAIL.w - 56, 42, 8);
    ctx.fillStyle = C.input;
    ctx.fill();
    ctx.strokeStyle = focused ? C.accent : C.menuBorder;
    ctx.lineWidth = focused ? 1.5 : 1;
    ctx.stroke();
    ctx.lineWidth = 1;
    if (attachment) drawComment(ctx, t);
    icon(ctx, "paperclip", DETAIL.x + DETAIL.w - 70, DETAIL.y + DETAIL.h - 41, 14, C.muted);
    icon(ctx, "arrow-up", DETAIL.x + DETAIL.w - 46, DETAIL.y + DETAIL.h - 41, 14, C.muted);
    ctx.restore();
  }
}

/* ---------- cursor choreography ---------- */

/**
 * Moves are quick, Fitts-timed aimed movements (≈0.3–0.65 s): a fast,
 * slightly curved ballistic phase that lands a little past the target, then
 * a short corrective sub-movement. Between moves the hand rests.
 */
type Move = { t: number; x: number; y: number; dur?: number };

const HOME = { x: 720, y: 430 };
const MOVES: Move[] = [
  { t: 0.1, x: 520, y: ROW_482.y + 22 },
  { t: 1.15, x: COL.status + 1, y: ROW_482.y + ROW_H / 2 + 1 },
  // status menu: down to "Done"
  { t: 2.1, x: MENU.x + 70, y: menuItemY(4) + MENU.item / 2 },
  { t: 3.1, x: 640, y: 380 },
  { t: 4.1, x: COL.title + 110, y: ROW_479.y + ROW_H / 2 },
  // detail panel
  { t: 5.1, x: TARGETS.detailStatus.x, y: TARGETS.detailStatus.y },
  { t: 5.8, x: PLAY.x + 2, y: PLAY.y + 2 },
  { t: 7.0, x: ATTACHMENT.x + ATTACHMENT.w * 0.62, y: ATTACHMENT.y + ATTACHMENT.h * 0.3 },
  // lens stops: timecode (small, strong), waveform (large, gentle), keyframes (medium)
  { t: 8.05, x: ATTACHMENT.x + ATTACHMENT.w * 0.6, y: ATTACHMENT.y + 30 },
  { t: 9.15, x: ATTACHMENT.x + ATTACHMENT.w * 0.42, y: ATTACHMENT.y + ATTACHMENT.h * 0.78 },
  { t: 10.25, x: ATTACHMENT.x + ATTACHMENT.w * 0.78, y: ATTACHMENT.y + ATTACHMENT.h * 0.66 },
  // Narration runs over the playing attachment; reach the comment as it ends.
  { t: 11.4, x: DETAIL.x + 260, y: 300, dur: 0.36 },
  { t: 14.9, x: TARGETS.comment.x, y: TARGETS.comment.y },
  { t: 19.1, x: DETAIL.x + 260, y: 300 },
  { t: 23.62, x: HOME.x, y: HOME.y, dur: 0.36 },
];

/** Clicks (also drive the click wave and the press feedback). */
export const CURSOR_KEYS: Array<{ t: number; x: number; y: number; click: true }> = [
  { t: T.menuOpen, x: MOVES[1].x, y: MOVES[1].y, click: true },
  { t: T.done, x: MOVES[2].x, y: MOVES[2].y, click: true },
  { t: T.openDetail, x: MOVES[4].x, y: MOVES[4].y, click: true },
  { t: T.play, x: PLAY.x + 2, y: PLAY.y + 2, click: true },
  { t: T.focusComment, x: TARGETS.comment.x, y: TARGETS.comment.y, click: true },
];

/** Lens stops: [start, end, size 0..1, magnification]. */
export const LENS_STOPS: Array<[number, number, number, number]> = [
  [8.4, 9.5, 0.2, 3.2],
  [9.5, 10.6, 0.62, 1.6], // joined: the loupe morphs instead of closing
  [10.6, 11.4, 0.38, 2.4], // joined again
];

const fittsDuration = (d: number) => 0.14 + 0.1 * Math.log2(1 + d / 24);
const minimumJerk = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);
/** Skewed bell: real reaches peak in velocity a little before the midpoint. */
const reach = (t: number) => minimumJerk(Math.pow(t, 0.85));

type Leg = { t0: number; t1: number; ax: number; ay: number; bx: number; by: number };

const LEGS: Leg[] = (() => {
  const legs: Leg[] = [];
  let from = HOME;
  for (const m of MOVES) {
    const d = Math.hypot(m.x - from.x, m.y - from.y);
    legs.push({ t0: m.t, t1: m.t + (m.dur ?? fittsDuration(d)), ax: from.x, ay: from.y, bx: m.x, by: m.y });
    from = m;
  }
  return legs;
})();

function sampleLeg(leg: Leg, time: number) {
  const dx = leg.bx - leg.ax;
  const dy = leg.by - leg.ay;
  const d = Math.hypot(dx, dy) || 1;
  const ux = dx / d;
  const uy = dy / d;
  // perpendicular bow (wrist arc), signed by direction so arcs feel consistent
  const side = dx >= 0 ? -1 : 1;
  const bow = Math.min(40, d * 0.07) * side;
  const u = Math.max(0, Math.min(1, (time - leg.t0) / (leg.t1 - leg.t0)));
  const split = 0.8;
  const over = Math.min(14, d * 0.035);
  if (u < split) {
    // ballistic phase towards a point slightly past the target
    const k = reach(u / split);
    const tx = leg.bx + ux * over;
    const ty = leg.by + uy * over;
    const arc = Math.sin(Math.PI * k) * bow;
    return { x: leg.ax + (tx - leg.ax) * k - uy * arc, y: leg.ay + (ty - leg.ay) * k + ux * arc };
  }
  // corrective sub-movement back onto the target
  const k = minimumJerk((u - split) / (1 - split));
  const sx = leg.bx + ux * over;
  const sy = leg.by + uy * over;
  return { x: sx + (leg.bx - sx) * k, y: sy + (leg.by - sy) * k };
}

export function cursorAt(time: number) {
  const t = ((time % RECORDING_DURATION) + RECORDING_DURATION) % RECORDING_DURATION;
  let pos = { x: HOME.x, y: HOME.y };
  for (const leg of LEGS) {
    if (t < leg.t0) break;
    if (t <= leg.t1) return sampleLeg(leg, t);
    pos = { x: leg.bx, y: leg.by };
  }
  return pos;
}

/** 0..1 click pulse around click keyframes. */
export function clickPulse(time: number) {
  let best = 0;
  for (const key of CURSOR_KEYS) {
    const d = time - key.t;
    if (d >= -0.05 && d <= 0.6) best = Math.max(best, 1 - Math.max(0, d) / 0.6);
  }
  return best;
}

/**
 * Press feedback: the cursor squeezes down as the button goes down, holds
 * briefly, and springs back with a small overshoot on release.
 */
export function cursorPressScale(time: number) {
  // button down at t − 0.06, up at t + 0.09; both ride the client's click spring
  for (const key of CURSOR_KEYS) {
    const down = key.t - 0.06;
    const up = key.t + 0.09;
    if (time < down || time > up + 0.6) continue;
    const pressed = 0.76;
    if (time < up) return 1 - (1 - pressed) * springStep(SPRINGS.click, time - down);
    const atRelease = 1 - (1 - pressed) * springStep(SPRINGS.click, up - down);
    return atRelease + (1 - atRelease) * springStep(SPRINGS.click, time - up);
  }
  return 1;
}

/** Glyph size in content pixels (the client's rounded arrow is drawn in a 23 pt box). */
export const CURSOR_SIZE = 30;
let arrowPath: Path2D | null = null;

/** macOS-style rounded arrow — RoundedCursorArrow from the client, 23 × 23 units. */
function roundedArrow() {
  if (arrowPath) return arrowPath;
  const p = new Path2D();
  p.moveTo(1.1626, 4.37388);
  p.bezierCurveTo(0.422627, 2.37122, 2.37146, 0.422383, 4.37412, 1.16236);
  p.lineTo(19.8636, 6.88565);
  p.bezierCurveTo(22.3071, 7.78854, 21.9132, 11.3597, 19.3315, 11.7082);
  p.lineTo(14.5033, 12.36);
  p.bezierCurveTo(13.388, 12.5105, 12.5108, 13.3878, 12.3602, 14.5031);
  p.lineTo(11.7085, 19.3313);
  p.bezierCurveTo(11.36, 21.9129, 7.78878, 22.3069, 6.88589, 19.8633);
  p.closePath();
  arrowPath = p;
  return p;
}

/** Draws the cursor with its hotspot (the rounded tip) at (x, y). */
export function drawCursor(ctx: CanvasRenderingContext2D, x: number, y: number, scale = 1, pixelScale = 1) {
  const k = (CURSOR_SIZE / 23) * scale;
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(k, k);
  ctx.translate(-2.3, -2.3);
  const path = roundedArrow();
  // shadow metrics are in canvas pixels, unaffected by the transform
  ctx.shadowColor = "rgba(0,0,0,0.36)";
  ctx.shadowBlur = 5 * k * pixelScale;
  ctx.shadowOffsetY = 2 * k * pixelScale;
  ctx.fillStyle = "#000";
  ctx.fill(path);
  ctx.shadowColor = "transparent";
  ctx.lineJoin = "round";
  ctx.strokeStyle = "#fff";
  ctx.lineWidth = 2;
  ctx.stroke(path);
  ctx.restore();
}
