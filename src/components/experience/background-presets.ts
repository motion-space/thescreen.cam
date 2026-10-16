/**
 * Frame backgrounds from the macOS client: the gradient presets
 * (GradientPresetPicker.swift) and mesh gradient palettes
 * (MeshGradientPoint.palettes). Generated from the client source.
 */
export type GradientPreset = { name: string; angle: number; stops: Array<[string, number]> };
export type MeshPoint = [number, number, string];

export const GRADIENT_PRESETS: GradientPreset[] = [{"name": "darkSteel", "angle": 180, "stops": [["#323232", 0], ["#3F3F3F", 0.4], ["#252525", 1]]}, {"name": "silver", "angle": 0, "stops": [["#D5D4D0", 0], ["#D5D4D0", 0.01], ["#EEEEEC", 0.31], ["#EFEEEC", 0.75], ["#E9E9E7", 1]]}, {"name": "cloudMist", "angle": 0, "stops": [["#CFD9DF", 0.0], ["#E2EBF0", 1.0]]}, {"name": "warmPorcelain", "angle": 135.0, "stops": [["#FDFCFB", 0.0], ["#E2D1C3", 1.0]]}, {"name": "softLightSteel", "angle": 180, "stops": [["#F1EFEB", 0.0], ["#DCD9D4", 0.42], ["#A7A39E", 1.0]]}, {"name": "centerTopGlow", "angle": 180, "stops": [["#DADADA", 0.0], ["#989898", 0.45], ["#5C5C5C", 1.0]]}, {"name": "perfectWhite", "angle": 0, "stops": [["#E6E9F0", 0.0], ["#EEF1F5", 1.0]]}, {"name": "premiumGray", "angle": 270, "stops": [["#BDBBBE", 0.0], ["#AFAEB2", 0.5], ["#9D9EA3", 1.0]]}, {"name": "lightGraphite", "angle": -180.0, "stops": [["#F4F5F7", 0.0], ["#C9CCD3", 0.55], ["#9DA1A9", 1.0]]}, {"name": "steelFade", "angle": 90, "stops": [["#868F96", 0.0], ["#596164", 1.0]]}, {"name": "frostedSilver", "angle": 0, "stops": [["#C4C5C7", 0.0], ["#DCDDDF", 0.52], ["#EBEBEB", 1.0]]}, {"name": "blueSteel", "angle": -180.0, "stops": [["#BCC5CE", 0.0], ["#929EAD", 0.98]]}, {"name": "winterGray", "angle": 0, "stops": [["#D3D3D3", 0.0], ["#D3D3D3", 0.01], ["#E0E0E0", 0.26], ["#EFEFEF", 0.48], ["#D9D9D9", 0.75], ["#BCBCBC", 1.0]]}, {"name": "kindSteel", "angle": 180, "stops": [["#F4FBFB", 0.0], ["#CDDCDC", 0.45], ["#93A2A2", 1.0]]}, {"name": "skyBlue", "angle": 0, "stops": [["#00C6FB", 0.0], ["#005BEA", 1.0]]}, {"name": "berryRibbon", "angle": 90, "stops": [["#FF8177", 0.0], ["#FF867A", 0.0], ["#FF8C7F", 0.21], ["#F99185", 0.52], ["#CF556C", 0.78], ["#B12A5B", 1.0]]}, {"name": "peach", "angle": 90, "stops": [["#FFECD2", 0.0], ["#FCB69F", 1.0]]}, {"name": "roseMilk", "angle": 45.0, "stops": [["#FF9A9E", 0.0], ["#FAD0C4", 0.99], ["#FAD0C4", 1.0]]}, {"name": "mintOcean", "angle": 60.0, "stops": [["#3D3393", 0.0], ["#2B76B9", 0.37], ["#2CACD1", 0.65], ["#35EB93", 1.0]]}, {"name": "softWhite", "angle": 120.0, "stops": [["#FDFBFB", 0.0], ["#EBEDEE", 1.0]]}, {"name": "glassShade", "angle": 180, "stops": [["#E6E6E6", 0.0], ["#292929", 1.0]]}, {"name": "topGlow", "angle": 180, "stops": [["#CACACA", 0.0], ["#565656", 1.0]]}, {"name": "graphite", "angle": 90, "stops": [["#434343", 0.0], ["#000000", 1.0]]}, {"name": "fireGold", "angle": 90, "stops": [["#F83600", 0.0], ["#F9D423", 1.0]]}, {"name": "blueNight", "angle": 0, "stops": [["#09203F", 0.0], ["#537895", 1.0]]}, {"name": "orangeRed", "angle": -60.0, "stops": [["#FF5858", 0.0], ["#F09819", 1.0]]}, {"name": "aqua", "angle": -20.0, "stops": [["#00CDAC", 0.0], ["#8DDAD5", 1.0]]}, {"name": "electricBlue", "angle": 0, "stops": [["#4481EB", 0.0], ["#04BEFE", 1.0]]}, {"name": "coralOrange", "angle": -20.0, "stops": [["#FC6076", 0.0], ["#FF9A44", 1.0]]}, {"name": "limeGold", "angle": 0, "stops": [["#50CC7F", 0.0], ["#F5D100", 1.0]]}, {"name": "pinkPop", "angle": 0, "stops": [["#FF0844", 0.0], ["#FFB199", 1.0]]}];

export const MESH_PALETTES: MeshPoint[][] = [[[0.0, 1.0, "#101010"], [0.0, 0.0019, "#D31F02"], [0.7118, 0.262, "#AE5512"], [0.6507, 0.2228, "#460500"], [1.0, 0.5372, "#350200"]], [[0.0, 0.0019, "#272BDC"], [0.6311, 0.7352, "#000000"], [1.0, 0.0, "#3525BD"]], [[0.673, 0.5096, "#014479"], [1.0, 0.0, "#00F5C4"], [0.0, 0.5692, "#00212C"], [0.8391, 0.7116, "#001F0C"], [0.2563, 1.0, "#001504"]], [[0.6227, 0.6177, "#081128"], [0.402, 0.3855, "#A3B4C8"]], [[0.5125, 0.5254, "#081128"], [0.168, 0.0, "#539FAF"], [0.972, 0.5546, "#041631"]], [[0.8143, 0.6767, "#000000"], [0.8201, 0.1982, "#5D0700"], [0.9316, 0.0, "#FF4B0C"], [0.2054, 0.265, "#220807"], [0.0084, 1.0, "#F02300"], [0.2661, 0.8233, "#1A0101"]], [[0.603, 0.4884, "#FFA400"], [0.3644, 0.8308, "#1A1500"], [0.2112, 0.7034, "#2D1700"], [0.1963, 0.3202, "#110A00"], [0.9241, 0.7685, "#110A00"], [0.1546, 1.0, "#FFC800"]], [[0.871, 0.7479, "#230B35"], [0.7516, 0.9439, "#FF6A5C"], [0.2914, 0.1304, "#FFABA9"], [0.0985, 0.2581, "#3E0700"]], [[0.871, 0.7479, "#07443C"], [0.7516, 0.9439, "#85C1FF"], [0.2914, 0.1304, "#B6E1FF"], [0.0985, 0.2581, "#003B4F"]], [[0.871, 0.7479, "#767676"], [0.7516, 0.9439, "#F0F0F0"], [0.2914, 0.1304, "#F4F4F4"], [0.0985, 0.2581, "#7D7D7D"]], [[0.6406, 0.6039, "#767676"], [0.8612, 0.3344, "#F0F0F0"], [0.7283, 0.7902, "#F4F4F4"], [0.0, 0.9522, "#7D7D7D"]], [[0.5125, 0.5254, "#100A35"], [0.168, 0.0, "#24FA92"], [0.972, 0.5546, "#00756F"]], [[0.791, 0.046, "#FF5C00"], [0.7973, 0.1022, "#FFBE00"], [0.7013, 0.9969, "#AF1E51"], [0.7303, 0.9113, "#000000"]], [[0.791, 0.046, "#1033FF"], [0.614, 0.2311, "#020203"], [0.7013, 0.9969, "#237EBD"], [0.7676, 0.86, "#070B20"]]];

export type BackgroundKind = "gradient" | "mesh" | "color";
export type FrameBackground = { kind: BackgroundKind; gradient: number; mesh: number; color: string };

/** CSS-style linear gradient (0° = to top, clockwise) filling `r`. */
export function gradientFill(ctx: CanvasRenderingContext2D, r: { x: number; y: number; w: number; h: number }, preset: GradientPreset) {
  const a = (preset.angle * Math.PI) / 180;
  const dx = Math.sin(a);
  const dy = -Math.cos(a);
  const half = (Math.abs(r.w * dx) + Math.abs(r.h * dy)) / 2;
  const cx = r.x + r.w / 2;
  const cy = r.y + r.h / 2;
  const g = ctx.createLinearGradient(cx - dx * half, cy - dy * half, cx + dx * half, cy + dy * half);
  for (const [color, at] of preset.stops) g.addColorStop(Math.max(0, Math.min(1, at)), color);
  return g;
}

const meshCache = new Map<number, HTMLCanvasElement>();
let meshVersion = 0;
export const meshTextureVersion = () => meshVersion;

// These lossless 160px textures are baked from the exact client palette formula.
// Decode before the inspector appears instead of running millions of pixel operations on entry.
if (typeof window !== "undefined") {
  MESH_PALETTES.forEach((_, index) => {
    const image = new Image(); image.decoding = "async";
    image.src = `/feature-media/mesh-gradients/${index}.png`;
    void image.decode().then(() => {
      const canvas = document.createElement("canvas"); canvas.width = canvas.height = 160;
      canvas.getContext("2d")!.drawImage(image, 0, 0);
      meshCache.set(index, canvas); meshVersion++;
      window.dispatchEvent(new Event("xp-background-ready"));
    }, () => {});
  });
}

/**
 * MeshGradientRenderer: every pixel is the inverse-distance⁴ weighted mix of
 * the palette's points, in sRGB, over normalised coordinates (y down).
 */
export function meshTexture(index: number) {
  const cached = meshCache.get(index);
  if (cached) return cached;
  const points = MESH_PALETTES[index] ?? MESH_PALETTES[0];
  const size = 160;
  const c = document.createElement("canvas");
  c.width = size;
  c.height = size;
  const ctx = c.getContext("2d");
  if (ctx) {
    const img = ctx.createImageData(size, size);
    const rgb = points.map(([, , hex]) => {
      const n = parseInt(hex.slice(1), 16);
      return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
    });
    for (let y = 0; y < size; y += 1) {
      for (let x = 0; x < size; x += 1) {
        const u = (x + 0.5) / size;
        const v = (y + 0.5) / size;
        let r = 0;
        let g = 0;
        let b = 0;
        let total = 0;
        points.forEach(([px, py], i) => {
          const d2 = (u - px) * (u - px) + (v - py) * (v - py);
          const w = 1 / (d2 * d2 + 0.00001);
          r += rgb[i][0] * w;
          g += rgb[i][1] * w;
          b += rgb[i][2] * w;
          total += w;
        });
        const o = (y * size + x) * 4;
        img.data[o] = r / total;
        img.data[o + 1] = g / total;
        img.data[o + 2] = b / total;
        img.data[o + 3] = 255;
      }
    }
    ctx.putImageData(img, 0, 0);
  }
  meshCache.set(index, c);
  return c;
}

/** Paints a frame background into `r` (already clipped by the caller if needed). */
export function paintFrameBackground(ctx: CanvasRenderingContext2D, r: { x: number; y: number; w: number; h: number }, bg: FrameBackground) {
  if (bg.kind === "color") {
    ctx.fillStyle = bg.color;
    ctx.fillRect(r.x, r.y, r.w, r.h);
  } else if (bg.kind === "mesh") {
    ctx.save();
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(meshTexture(bg.mesh), r.x, r.y, r.w, r.h);
    ctx.restore();
  } else {
    ctx.fillStyle = gradientFill(ctx, r, GRADIENT_PRESETS[bg.gradient] ?? GRADIENT_PRESETS[0]);
    ctx.fillRect(r.x, r.y, r.w, r.h);
  }
}
