import { HEADER, PREVIEW, type EditorHandlers, type EditorState } from "./editor";
import { MEDIA_LIBRARY_MIN_WIDTH, MEDIA_LIBRARY_MAX_WIDTH, visibleMediaLibraryWidth } from "./preview-layout";
import { MONO, icon, rr, text, type UI } from "./kit";
import { CH, CW, drawRecordedApp } from "./recorded-app";

/** Presentation-only cards following the client's MediaLibraryPanel grid. */
const ASSETS = [
  { title: "Product walkthrough", duration: "00:24", time: 0, kind: "project" },
  { title: "Feature overview", duration: "00:18", time: 6.8, kind: "project" },
  { title: "Detail close-up", duration: "00:12", time: 12, kind: "video" },
  { title: "Final take", duration: "00:09", time: 19, kind: "video" },
  { title: "Voiceover", duration: "00:24", time: 0, kind: "audio" },
  { title: "Background music", duration: "01:32", time: 0, kind: "audio" },
] as const;

export class MediaLibraryLayer {
  private canvas = document.createElement("canvas");
  private key = "";
  private scrollOffset = 0;
  private maxScroll = 0;

  scrollBy(delta: number) {
    this.scrollOffset = Math.max(0, Math.min(this.maxScroll, this.scrollOffset + delta));
  }

  draw(ui: UI, state: EditorState, handlers: EditorHandlers) {
    if (state.mediaLibraryReveal <= 0 || state.chrome <= .25) return;
    const { ctx, t } = ui;
    const width = state.mediaLibraryWidth;
    const transform = ctx.getTransform();
    const scale = Math.max(1, Math.ceil(Math.abs(transform.a) * 2) / 2);
    const key = [scale, width, t.dark, t.accent, this.scrollOffset].join(":");
    if (key !== this.key) {
      this.canvas.width = Math.ceil(width * scale);
      this.canvas.height = Math.ceil(PREVIEW.h * scale);
      const c = this.canvas.getContext("2d")!;
      c.scale(scale, scale);
      c.fillStyle = t.panel2;
      c.fillRect(0, 0, width, PREVIEW.h);
      text(c, "Media Library", 8, 23, { size: 12, weight: 600, color: t.text });
      text(c, "6", 94, 23, { size: 11, color: t.text2, family: MONO });
      // Import is decorative in this showcase, as are the material cards.
      icon(c, "plus", width - 21, 23, 13, t.text2);
      const columns = Math.max(1, Math.floor((width - 16 + 10) / 110));
      const cardW = (width - 16 - (columns - 1) * 10) / columns;
      const thumbnailW = cardW - 10;
      const thumbnailH = thumbnailW * 9 / 16;
      const cardH = thumbnailH + 28;
      const draftsY = 48 + Math.ceil(ASSETS.length / columns) * (cardH + 10) + 10;
      this.maxScroll = Math.max(0, draftsY + 18 + Math.ceil(2 / columns) * (cardH + 10) - 2 - PREVIEW.h);
      this.scrollOffset = Math.min(this.scrollOffset, this.maxScroll);
      c.save(); c.beginPath(); c.rect(0, 46, width, PREVIEW.h - 46); c.clip();
      c.translate(0, -this.scrollOffset);
      const card = (asset: typeof ASSETS[number], x: number, y: number, index: number) => {
        rr(c, x, y, cardW, cardH, 9);
        c.fillStyle = t.fillSubtle; c.fill();
        const tx = x + 5, ty = y + 5;
        c.save();
        rr(c, tx, ty, thumbnailW, thumbnailH, 7); c.clip();
        c.fillStyle = asset.kind === "audio" ? (t.dark ? "#18342e" : "#dceee5") : t.control;
        c.fillRect(tx, ty, thumbnailW, thumbnailH);
        if (asset.kind === "audio") {
          c.strokeStyle = t.dark ? "#69c99c" : "#338564";
          c.lineWidth = 1.5;
          for (let i = 0; i < 28; i++) {
            const h = 3 + Math.abs(Math.sin(i * 1.7 + index) * Math.cos(i * .4)) * 23;
            const wx = tx + 8 + i * 3;
            c.beginPath(); c.moveTo(wx, ty + thumbnailH / 2 - h / 2); c.lineTo(wx, ty + thumbnailH / 2 + h / 2); c.stroke();
          }
        } else {
          c.save(); c.translate(tx, ty); c.scale(thumbnailW / CW, thumbnailH / CH);
          drawRecordedApp(c, asset.time); c.restore();
        }
        rr(c, tx + thumbnailW - 42, ty + thumbnailH - 19, 37, 14, 3);
        c.fillStyle = "rgba(0,0,0,0.65)"; c.fill();
        text(c, asset.duration, tx + thumbnailW - 23.5, ty + thumbnailH - 12, { size: 9, weight: 500, color: "#fff", family: MONO, align: "center" });
        c.restore();
        // Keep long titles on one line, just like the native cards.
        c.save(); c.beginPath(); c.rect(x + 5, y + cardH - 21, cardW - 10, 19); c.clip();
        icon(c, asset.kind === "audio" ? "music" : asset.kind === "project" ? "layers" : "video", x + 11, y + cardH - 11, 9, t.text2);
        let title = asset.title;
        c.font = '11px -apple-system, BlinkMacSystemFont, sans-serif';
        while (c.measureText(title).width > cardW - 29) title = title.slice(0, -2).trimEnd() + "…";
        text(c, title, x + 20, y + cardH - 10.5, { size: 11, color: t.text });
        c.restore();
      };
      ASSETS.forEach((asset, i) => card(asset, 8 + (i % columns) * (cardW + 10), 48 + Math.floor(i / columns) * (cardH + 10), i));
      icon(c, "chevron-down", 14, draftsY, 10, t.text2);
      text(c, "Drafts", 27, draftsY, { size: 12, weight: 600, color: t.text });
      text(c, "2", 70, draftsY, { size: 11, color: t.text2, family: MONO });
      const drafts = [
        { ...ASSETS[0], title: "Website demo", duration: "00:32", time: 4 },
        { ...ASSETS[1], title: "App preview", duration: "00:16", time: 16 },
      ];
      drafts.forEach((asset, i) => card(asset, 8 + (i % columns) * (cardW + 10),
        draftsY + 18 + Math.floor(i / columns) * (cardH + 10), 6 + i));
      c.restore();
      c.fillStyle = t.separator; c.fillRect(width - 1, 0, 1, PREVIEW.h);
      this.key = key;
    }
    ctx.save();
    const visibleWidth = visibleMediaLibraryWidth(width * state.mediaLibraryReveal, state.chrome);
    ctx.beginPath(); ctx.rect(0, HEADER, visibleWidth, PREVIEW.h); ctx.clip();
    ctx.drawImage(this.canvas, visibleWidth - width, HEADER, width, PREVIEW.h);
    ctx.restore();
    // Materials are decorative; only the divider resizes the docked panel.
    ui.hits.add({ id: "media-library", x: 0, y: HEADER, w: visibleWidth, h: PREVIEW.h, cursor: "default" });
    if (!state.mediaLibraryOpen || visibleWidth < width) return;
    const resize = (point: { x: number }) => {
      state.mediaLibraryWidth = Math.max(MEDIA_LIBRARY_MIN_WIDTH, Math.min(MEDIA_LIBRARY_MAX_WIDTH, point.x));
      handlers.touch();
    };
    if (ui.hover === "media-library-resize" || ui.active === "media-library-resize") {
      ctx.save(); ctx.fillStyle = t.accent;
      ctx.fillRect(width - 1, HEADER, 2, PREVIEW.h); ctx.restore();
    }
    ui.hits.add({ id: "media-library-resize", x: width - 5, y: HEADER, w: 10, h: PREVIEW.h,
      cursor: "ew-resize", onDrag: resize });
  }

  dispose() { this.canvas.width = this.canvas.height = 1; }
}
