/**
 * WebGL2 port of the macOS client's preview kernels:
 *  - cameraMotionBlur (CameraMotionBlur.metal / CameraMotionBlurKernelSource)
 *  - clickWave (ClickWaveRenderer)
 *  - glassLoupe (GlassLoupeRenderer)
 *  - spatial plane + depth of field (SpatialLensRenderer: linear CoC across the
 *    projected plane, focus on the cursor's depth)
 */

const VERT = `#version 300 es
in vec2 a;
void main() { gl_Position = vec4(a, 0.0, 1.0); }
`;

const FRAG = `#version 300 es
precision highp float;
out vec4 outColor;

uniform sampler2D uBase;
uniform sampler2D uOptical;
uniform sampler2D uScreen;
uniform vec2 uSize;
uniform vec2 uBaseStorage;
uniform vec2 uOpticalStorage;
uniform vec2 uOpticalSize;
uniform float uPixelScale;

uniform float uMotionA;
uniform vec2 uMotionB;
uniform float uBlur;

uniform vec4 uWave[4];

uniform vec4 uLens;     // x, y, radius, presence (0 = off)
uniform vec4 uOptBox;   // x, y, w, h

uniform int uPlaneOn;
uniform mat3 uInv;      // pixel -> plane uv (homogeneous)
uniform vec4 uDepth;    // depth at (0,0) (1,0) (1,1) (0,1)
uniform vec3 uFocus;    // focus depth, depth range, max CoC (px)
uniform float uPlaneRadius;

const vec2 CONTENT = vec2(1280.0, 800.0);

vec4 base(vec2 p) {
  return texture(uBase, clamp(p, vec2(0.5), uSize - 0.5) / uBaseStorage);
}

vec2 planeUV(vec2 p) {
  vec3 q = uInv * vec3(p, 1.0);
  return q.xy / q.z;
}

float roundedBox(vec2 uv) {
  vec2 q = (uv - 0.5) * CONTENT;
  vec2 d = abs(q) - (CONTENT * 0.5 - uPlaneRadius);
  return length(max(d, 0.0)) + min(max(d.x, d.y), 0.0) - uPlaneRadius;
}

vec4 planeAt(vec2 p) {
  vec2 uv = planeUV(p);
  vec4 bg = base(p);
  float sd = roundedBox(uv);
  // pixel footprint of one content unit, for antialiasing the silhouette
  vec2 uvx = planeUV(p + vec2(1.0, 0.0)) - uv;
  float fw = max(0.0001, length(uvx * CONTENT));
  float cover = clamp(0.5 - sd / fw, 0.0, 1.0);
  if (cover <= 0.0) return bg;
  float depth = mix(mix(uDepth.x, uDepth.y, uv.x), mix(uDepth.w, uDepth.z, uv.x), uv.y);
  float coc = uFocus.z * clamp(abs(depth - uFocus.x) / max(1.0, uFocus.y), 0.0, 1.0);
  // Both the sharp and the blurred reads use the same explicit mip level
  // (matched to the on-screen texel density), and they cross-fade, so there
  // is no seam where the circle of confusion becomes visible.
  vec2 tex = vec2(textureSize(uScreen, 0));
  float texelsPerPx = length(uvx * tex);
  float baseLod = log2(max(1.0, texelsPerPx));
  vec4 sharp = textureLod(uScreen, clamp(uv, vec2(0.0), vec2(1.0)), baseLod);
  vec4 col = sharp;
  float blurMix = smoothstep(0.25, 1.5, coc);
  if (blurMix > 0.0) {
    vec4 acc = vec4(0.0);
    float lod = log2(max(1.0, max(texelsPerPx, coc * texelsPerPx * 0.35)));
    for (int i = 0; i < 28; i++) {
      float fi = float(i);
      float r = sqrt((fi + 0.5) / 28.0) * coc;
      float a = fi * 2.39996323;
      vec2 suv = planeUV(p + vec2(cos(a), sin(a)) * r);
      acc += textureLod(uScreen, clamp(suv, vec2(0.0), vec2(1.0)), lod);
    }
    col = mix(sharp, acc / 28.0, blurMix);
  }
  return mix(bg, vec4(col.rgb, 1.0), cover);
}

vec4 scene(vec2 p) {
  if (uPlaneOn == 1) return planeAt(p);
  return base(p);
}

vec4 sceneBlurred(vec2 p) {
  vec2 motion = ((uMotionA - 1.0) * p + uMotionB) * uBlur;
  float len = length(motion);
  if (len < 0.5 * uPixelScale) return scene(p);
  float maxMotion = mix(4.0, 46.0, uBlur) * uPixelScale;
  if (len > maxMotion) motion *= maxMotion / len;
  vec4 color = vec4(0.0);
  float wsum = 0.0;
  for (int i = 0; i < 25; i++) {
    float t = float(i) / 24.0;
    float w = mix(1.0, 0.32, t) * exp(-t * t * 1.35);
    color += scene(p + motion * t) * w;
    wsum += w;
  }
  return color / wsum;
}

vec4 waveOffset(vec2 p, vec4 wave) {
  if (wave.w < 0.5) return vec4(0.0);
  float scale = uPixelScale;
  vec2 delta = (p - wave.xy) / scale;
  float dist = length(delta);
  float radiusScale = 1.35;
  float band = (dist - wave.z * 280.0 * radiusScale) / (48.0 * radiusScale);
  float envelope = exp(-band * band * 2.0);
  float fade = smoothstep(0.0, 0.12, wave.z) * pow(1.0 - wave.z, 1.5);
  vec2 dir = delta / max(dist, 0.001);
  float displacement = sin(band * 3.14159265) * envelope * fade * 48.0 * 0.33;
  float dispersion = envelope * fade * 10.0 * 0.74;
  return vec4(dir * displacement, dir * dispersion) * scale;
}

vec4 sceneWithWaves(vec2 p) {
  vec4 off = vec4(0.0);
  for (int i = 0; i < 4; i++) off += waveOffset(p, uWave[i]);
  if (dot(off, off) < 0.0004) return sceneBlurred(p);
  off.xy *= min(1.0, 32.0 * 0.33 * uPixelScale / max(length(off.xy), 0.001));
  off.zw *= min(1.0, 10.0 * 0.74 * uPixelScale / max(length(off.zw), 0.001));
  vec4 r = sceneBlurred(p + off.xy + off.zw);
  vec4 g = sceneBlurred(p + off.xy);
  vec4 b = sceneBlurred(p + off.xy - off.zw);
  return vec4(r.r, g.g, b.b, g.a);
}

vec4 optical(vec2 q) {
  vec2 uv = (q - uOptBox.xy) / uOptBox.zw;
  return texture(uOptical, clamp(uv, 0.5/uOpticalSize, 1.0-0.5/uOpticalSize)*uOpticalSize/uOpticalStorage);
}

vec4 loupe(vec2 p, vec4 backdrop) {
  vec2 center = uLens.xy;
  float radius = uLens.z;
  float presence = smoothstep(0.0, 1.0, uLens.w);
  vec2 delta = p - center;
  float dist = length(delta);
  float sdist = dist - radius;
  vec2 dir = delta / max(dist, 0.00001);
  // y-down: light comes from the upper left
  float light = clamp(dot(dir, vec2(-0.60, -0.80)), -1.0, 1.0);

  float ambientDim = 0.24 * presence;
  vec2 shadowOffset = vec2(0.07, 0.12) * radius;
  float shadowReach = max(radius * 1.5, uSize.x * 0.65);
  float shadowDist = max(0.0, length(delta - shadowOffset) - radius);
  float falloff = max(0.0, 1.0 - shadowDist / max(1.0, shadowReach));
  float shadow = 0.24 * presence * falloff * falloff * (0.78 - 0.22 * light);
  vec4 outside = vec4(backdrop.rgb * (1.0 - ambientDim) * (1.0 - shadow), backdrop.a);
  float coverage = 1.0 - smoothstep(-0.75, 0.75, sdist);
  if (coverage <= 0.0) return outside;

  float radial = dist / max(radius, 0.001);
  float shoulder = clamp((radial - 0.72) / 0.28, 0.0, 1.0);
  float curvature = shoulder * shoulder * shoulder;
  float refraction = radius * 0.13 * curvature * presence;
  float dispersion = radius * 0.012 * curvature * shoulder * presence * 2.5;
  vec2 q = center + (delta - dir * refraction);
  vec4 red = optical(q + dir * dispersion);
  vec4 green = optical(q);
  vec4 blue = optical(q - dir * dispersion);
  vec3 color = vec3(red.r, green.g, blue.b);

  float bevel = smoothstep(0.76, 0.985, radial);
  float innerShade = bevel * bevel * (0.11 + 0.15 * max(light, 0.0));
  color *= 1.0 - innerShade * presence;

  vec2 reflectedPoint = center + dir * radius * (1.0 + 0.18 * (1.0 - curvature));
  vec4 reflected = base(reflectedPoint);
  vec3 reflectedColor = reflected.rgb * (1.0 - ambientDim) * (1.0 - 0.16 * presence);
  float fresnel = curvature * curvature * 0.16;
  color = mix(color, reflectedColor, fresnel * presence);

  float rim = smoothstep(0.985, 0.997, radial);
  float sheen = curvature * curvature * (0.012 + 0.030 * max(light, 0.0));
  float highlight = sheen + rim * (0.07 + 0.48 * pow(max(light, 0.0), 4.0));
  color = mix(color, vec3(1.0, 0.985, 0.96), highlight * presence);
  float returnLight = rim * 0.12 * pow(max(-light, 0.0), 4.0);
  color = mix(color, vec3(0.89, 0.95, 1.0), returnLight * presence);
  return mix(outside, vec4(color, 1.0), coverage);
}

void main() {
  vec2 p = vec2(gl_FragCoord.x, uSize.y - gl_FragCoord.y);
  vec4 c = sceneWithWaves(p);
  if (uLens.w > 0.001) c = loupe(p, c);
  outColor = c;
}
`;

export type PreviewEffects = {
  base: HTMLCanvasElement;
  width: number;
  height: number;
  pixelScale: number;
  motion: { a: number; bx: number; by: number };
  blur: number;
  waves: Array<{ x: number; y: number; progress: number }>;
  lens: { x: number; y: number; r: number; presence: number; box: number[]; optical: HTMLCanvasElement } | null;
  plane: {
    inverse: number[];
    depths: number[];
    focusDepth: number;
    range: number;
    coc: number;
    radius: number;
    texture: HTMLCanvasElement;
    version: number;
  } | null;
};

export class PreviewGL {
  canvas = document.createElement("canvas");
  private gl: WebGL2RenderingContext;
  private program: WebGLProgram;
  private textures: WebGLTexture[];
  private loc: Record<string, WebGLUniformLocation | null> = {};
  private screenVersion = -1;
  private textureSizes: Array<{ w: number; h: number }> = [];
  private waves = new Float32Array(16);
  private shared: boolean;
  private target: Level | null = null;
  get texture() { return this.target?.tex ?? null; }
  get targetSize() { return this.target; }

  constructor(shared?: WebGL2RenderingContext) {
    this.shared = !!shared;
    const gl = shared ?? this.canvas.getContext("webgl2", { premultipliedAlpha: true, preserveDrawingBuffer: true, antialias: false });
    if (!gl) throw new Error("webgl2 unavailable");
    this.gl = gl;
    const compile = (type: number, src: string) => {
      const s = gl.createShader(type);
      if (!s) throw new Error("shader");
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) ?? "compile");
      return s;
    };
    const program = gl.createProgram();
    if (!program) throw new Error("program");
    gl.attachShader(program, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(program, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.bindAttribLocation(program, 0, "a");
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program) ?? "link");
    this.program = program;
    gl.useProgram(program);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const a = gl.getAttribLocation(program, "a");
    gl.enableVertexAttribArray(a);
    gl.vertexAttribPointer(a, 2, gl.FLOAT, false, 0, 0);
    this.textures = [0, 1, 2].map((unit) => {
      const t = gl.createTexture();
      if (!t) throw new Error("texture");
      gl.activeTexture(gl.TEXTURE0 + unit);
      gl.bindTexture(gl.TEXTURE_2D, t);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      const w = unit === 0 ? 2400 : unit === 1 ? 2048 : 1920;
      const h = unit === 0 ? 1350 : unit === 1 ? 2048 : 1200;
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
      this.textureSizes[unit] = { w, h };
      return t;
    });
    for (const name of ["uBase", "uOptical", "uScreen", "uSize", "uBaseStorage", "uOpticalStorage", "uOpticalSize", "uPixelScale", "uMotionA", "uMotionB", "uBlur", "uWave", "uLens", "uOptBox", "uPlaneOn", "uInv", "uDepth", "uFocus", "uPlaneRadius"]) {
      this.loc[name] = gl.getUniformLocation(program, name);
    }
    gl.uniform1i(this.loc.uBase, 0);
    gl.uniform1i(this.loc.uOptical, 1);
    gl.uniform1i(this.loc.uScreen, 2);
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
  }

  private upload(unit: number, source: HTMLCanvasElement) {
    const gl = this.gl;
    gl.activeTexture(gl.TEXTURE0 + unit);
    gl.bindTexture(gl.TEXTURE_2D, this.textures[unit]);
    const size = this.textureSizes[unit];
    if (size?.w >= source.width && size.h >= source.height) {
      gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, gl.RGBA, gl.UNSIGNED_BYTE, source);
    } else {
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source);
      this.textureSizes[unit] = { w: source.width, h: source.height };
    }
  }

  render(e: PreviewEffects) {
    const gl = this.gl;
    if (this.shared) {
      if (!this.target || this.target.w < e.width || this.target.h < e.height) {
        if (this.target) { gl.deleteTexture(this.target.tex); gl.deleteFramebuffer(this.target.fbo); }
        const tex = gl.createTexture()!, fbo = gl.createFramebuffer()!;
        gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        const w = Math.max(2400, e.width), h = Math.max(1350, e.height);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
        gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
        this.target = { tex, fbo, w, h };
      }
      gl.bindFramebuffer(gl.FRAMEBUFFER, this.target.fbo);
    } else if (this.canvas.width !== e.width || this.canvas.height !== e.height) {
      this.canvas.width = e.width;
      this.canvas.height = e.height;
    }
    this.textures.forEach((tex, unit) => { gl.activeTexture(gl.TEXTURE0 + unit); gl.bindTexture(gl.TEXTURE_2D, tex); });
    gl.viewport(0, 0, e.width, e.height);
    gl.useProgram(this.program);
    this.upload(0, e.base);
    const L = this.loc;
    gl.uniform2f(L.uSize, e.width, e.height);
    gl.uniform2f(L.uBaseStorage, this.textureSizes[0].w, this.textureSizes[0].h);
    gl.uniform1f(L.uPixelScale, Math.max(0.2, e.pixelScale));
    gl.uniform1f(L.uMotionA, e.motion.a);
    gl.uniform2f(L.uMotionB, e.motion.bx, e.motion.by);
    gl.uniform1f(L.uBlur, e.blur);
    const waves = this.waves;
    waves.fill(0);
    e.waves.slice(0, 4).forEach((w, i) => waves.set([w.x, w.y, w.progress, 1], i * 4));
    gl.uniform4fv(L.uWave, waves);
    if (e.lens) {
      this.upload(1, e.lens.optical);
      gl.uniform2f(L.uOpticalStorage, this.textureSizes[1].w, this.textureSizes[1].h);
      gl.uniform2f(L.uOpticalSize, e.lens.optical.width, e.lens.optical.height);
      gl.uniform4f(L.uLens, e.lens.x, e.lens.y, e.lens.r, e.lens.presence);
      gl.uniform4f(L.uOptBox, e.lens.box[0], e.lens.box[1], e.lens.box[2], e.lens.box[3]);
    } else {
      gl.uniform4f(L.uLens, 0, 0, 0, 0);
    }
    if (e.plane) {
      if (this.screenVersion !== e.plane.version) {
        this.upload(2, e.plane.texture);
        gl.generateMipmap(gl.TEXTURE_2D);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
        this.screenVersion = e.plane.version;
      }
      const m = e.plane.inverse;
      // column-major
      gl.uniformMatrix3fv(L.uInv, false, [m[0], m[3], m[6], m[1], m[4], m[7], m[2], m[5], m[8]]);
      gl.uniform4f(L.uDepth, e.plane.depths[0], e.plane.depths[1], e.plane.depths[2], e.plane.depths[3]);
      gl.uniform3f(L.uFocus, e.plane.focusDepth, e.plane.range, e.plane.coc);
      gl.uniform1f(L.uPlaneRadius, e.plane.radius);
      gl.uniform1i(L.uPlaneOn, 1);
    } else {
      gl.uniform1i(L.uPlaneOn, 0);
    }
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    return this.canvas;
  }
  dispose() {
    this.textures.forEach((texture) => this.gl.deleteTexture(texture));
    this.gl.deleteProgram(this.program);
    if (this.target) { this.gl.deleteTexture(this.target.tex); this.gl.deleteFramebuffer(this.target.fbo); }
    if (!this.shared) this.gl.getExtension("WEBGL_lose_context")?.loseContext();
  }

}

/* ---------- final frame pass: camera motion blur + progressive blur ---------- */

export type EditorGpuLayer = { canvas: HTMLCanvasElement; key: string; x: number; y: number; w: number; h: number };
export type GridLayer = { step: number; x: number; y: number; dpr: number; dark: boolean };

export type PreviewLayer = { u: number; v: number; texture: WebGLTexture; x: number; y: number; w: number; h: number; radius: number };
export type CursorLayer = Omit<PreviewLayer, "radius"> & { alpha: number };

const COMPOSE_FRAG = `#version 300 es
precision highp float;
out vec4 outColor;
uniform sampler2D uUi;
uniform sampler2D uPreview;
uniform sampler2D uEditor;
uniform sampler2D uInspector;
uniform sampler2D uCursor;
uniform vec4 uCursorRect;
uniform vec2 uCursorScale;
uniform float uCursorAlpha;
uniform int uCursorOn;
uniform vec4 uInspectorRect;
uniform float uInspectorAlpha;
uniform vec4 uEditorRect;
uniform vec4 uGrid;
uniform float uGridColor;
uniform int uEditorOn;
uniform vec2 uSize;
uniform vec4 uRect;
uniform float uRadius;
uniform vec2 uPreviewScale;
void main() {
  // Internal scene textures use a top-down origin, matching uploaded 2D canvases.
  vec2 p = gl_FragCoord.xy;
  vec4 ui = texture(uUi, p / uSize);
  vec2 uv = (p - uRect.xy) / uRect.zw;
  float r = max(0.01, uRadius * 1.28);
  vec2 q = max(abs(p - uRect.xy - uRect.zw * 0.5) - (uRect.zw * 0.5 - r), 0.0) / r;
  float distance = (pow(pow(q.x, 4.6) + pow(q.y, 4.6), 1.0 / 4.6) - 1.0) * r;
  float coverage = clamp(0.5 - distance, 0.0, 1.0);
  vec2 previewSize=vec2(textureSize(uPreview,0));
  vec2 previewUv=clamp(vec2(uv.x,1.0-uv.y)*uPreviewScale,0.5/previewSize,uPreviewScale-0.5/previewSize);
  vec4 preview = texture(uPreview, previewUv) * coverage;
  vec4 background = vec4(0.0);
  if (uEditorOn == 1) {
    vec2 cell = abs(mod(p-uGrid.xy+uGrid.z*0.5,uGrid.z)-uGrid.z*0.5);
    vec2 cov = clamp(vec2(0.5+uGrid.w*0.5)-cell,0.0,1.0);
    float alpha = cov.x*cov.y*(uGridColor>0.5?0.075:0.07);
    background = vec4(vec3(uGridColor)*alpha,alpha);
    vec2 eUv = (p-uEditorRect.xy)/uEditorRect.zw;
    float insideRect = step(0.0,eUv.x)*step(0.0,eUv.y)*step(eUv.x,1.0)*step(eUv.y,1.0);
    vec4 editor = texture(uEditor,clamp(eUv,0.0,1.0))*insideRect;
    background = editor + background*(1.0-editor.a);
  }
  vec4 scene = preview + background*(1.0-preview.a);
  vec2 iUv = (p-uInspectorRect.xy)/max(vec2(1.0),uInspectorRect.zw);
  float iCover = step(0.0,iUv.x)*step(0.0,iUv.y)*step(iUv.x,1.0)*step(iUv.y,1.0);
  vec4 inspector = texture(uInspector,clamp(iUv,0.0,1.0))*iCover*uInspectorAlpha;
  scene = inspector + scene*(1.0-inspector.a);
  if (uCursorOn == 1) {
    vec2 cUv = (p-uCursorRect.xy)/uCursorRect.zw;
    if (cUv.x >= 0.0 && cUv.y >= 0.0 && cUv.x <= 1.0 && cUv.y <= 1.0) {
      vec2 size = vec2(textureSize(uCursor, 0));
      vec2 uv = clamp(vec2(cUv.x,1.0-cUv.y)*uCursorScale,0.5/size,uCursorScale-0.5/size);
      vec4 cursor = texture(uCursor,uv)*coverage*uCursorAlpha;
      scene = cursor + scene*(1.0-cursor.a);
    }
  }
  outColor = ui + scene*(1.0-ui.a);
}
`;

const LEVELS = 7;

/**
 * Dual-filter downsample: a centre tap plus four diagonal bilinear taps, i.e.
 * a tent over 4×4 source texels. Unlike a 2×2 box (what generateMipmap does),
 * its response to a thin line moving across texels is continuous, so moving
 * details do not pop as they cross texel boundaries.
 */
const DOWN_FRAG = `#version 300 es
precision highp float;
out vec4 outColor;
uniform sampler2D uTex;
uniform vec2 uTexel;   // source texel size
uniform vec2 uOutSize;
void main() {
  vec2 uv = gl_FragCoord.xy / uOutSize;
  vec4 c = texture(uTex, uv) * 4.0;
  c += texture(uTex, uv + uTexel * vec2(-1.0, -1.0));
  c += texture(uTex, uv + uTexel * vec2(1.0, -1.0));
  c += texture(uTex, uv + uTexel * vec2(-1.0, 1.0));
  c += texture(uTex, uv + uTexel * vec2(1.0, 1.0));
  outColor = c / 8.0;
}
`;

const BLUR_FRAG = `#version 300 es
precision highp float;
out vec4 outColor;
uniform sampler2D uSrc;
uniform sampler2D uL1;
uniform sampler2D uL2;
uniform sampler2D uL3;
uniform sampler2D uL4;
uniform sampler2D uL5;
uniform sampler2D uL6;
uniform sampler2D uL7;
uniform vec2 uSize;
uniform float uA;
uniform vec2 uB;
uniform float uMax;
uniform vec4 uVeil;      // mode (1 left, 2 bottom), unused, max radius px, strength
uniform vec2 uVeilBand;  // distance from the edge where the band starts / is at full strength
uniform vec4 uVeilColor; // page background (rgb), max tint

vec4 src(vec2 p) {
  return texture(uSrc, clamp(p, vec2(0.5), uSize - 0.5) / uSize);
}

// Cubic B-spline reconstruction from four bilinear taps: C2-smooth, so the
// coarse pyramid levels read back without blocks or steps.
vec4 bspline(sampler2D t, vec2 uv) {
  vec2 size = vec2(textureSize(t, 0));
  vec2 q = uv * size - 0.5;
  vec2 i = floor(q);
  vec2 f = q - i;
  vec2 f2 = f * f;
  vec2 f3 = f2 * f;
  vec2 w0 = (1.0 - 3.0 * f + 3.0 * f2 - f3) / 6.0;
  vec2 w1 = (4.0 - 6.0 * f2 + 3.0 * f3) / 6.0;
  vec2 w2 = (1.0 + 3.0 * f + 3.0 * f2 - 3.0 * f3) / 6.0;
  vec2 w3 = f3 / 6.0;
  vec2 g0 = w0 + w1;
  vec2 g1 = w2 + w3;
  vec2 h0 = (i - 0.5 + w1 / g0) / size;
  vec2 h1 = (i + 1.5 + w3 / g1) / size;
  return g0.y * (g0.x * texture(t, vec2(h0.x, h0.y)) + g1.x * texture(t, vec2(h1.x, h0.y)))
       + g1.y * (g0.x * texture(t, vec2(h0.x, h1.y)) + g1.x * texture(t, vec2(h1.x, h1.y)));
}

vec4 level(int l, vec2 uv) {
  if (l <= 0) return texture(uSrc, uv);
  if (l == 1) return bspline(uL1, uv);
  if (l == 2) return bspline(uL2, uv);
  if (l == 3) return bspline(uL3, uv);
  if (l == 4) return bspline(uL4, uv);
  if (l == 5) return bspline(uL5, uv);
  if (l == 6) return bspline(uL6, uv);
  return bspline(uL7, uv);
}

// Progressive: 0 where the band starts, rising continuously all the way to
// the screen edge (no plateau), with a gentle ease-in so the onset is soft.
float veilLinear(vec2 p) {
  if (uVeil.x < 0.5) return 0.0;
  float dist = uVeil.x < 1.5 ? p.x : uSize.y - p.y;
  return clamp((uVeilBand.x - dist) / max(1.0, uVeilBand.x - uVeilBand.y), 0.0, 1.0);
}

float veilRamp(vec2 p) {
  return pow(veilLinear(p), 1.35);
}

void main() {
  vec2 p = vec2(gl_FragCoord.x, uSize.y - gl_FragCoord.y);
  vec2 uv = clamp(p, vec2(0.5), uSize - 0.5) / uSize;
  float ramp = veilRamp(p) * uVeil.w;
  float radius = uVeil.z * ramp;

  vec4 color;
  if (radius > 0.75) {
    // continuous level of detail: interpolate between neighbouring levels
    float lf = clamp(log2(radius) - 0.6, 0.0, float(${LEVELS}));
    int l0 = int(floor(lf));
    float t = lf - float(l0);
    color = mix(level(l0, uv), level(min(l0 + 1, ${LEVELS}), uv), t);
  } else {
    vec2 motion = (uA - 1.0) * p + uB;
    float len = length(motion);
    if (len < 0.5) {
      color = src(p);
    } else {
      if (len > uMax) motion *= uMax / len;
      color = vec4(0.0);
      float wsum = 0.0;
      for (int i = 0; i < 25; i++) {
        float k = float(i) / 24.0;
        float w = mix(1.0, 0.32, k) * exp(-k * k * 1.35);
        color += src(p + motion * k) * w;
        wsum += w;
      }
      color /= wsum;
    }
  }
  // Settle the band into the page colour along the same continuous ramp,
  // rising faster than the blur so the footage under the text is already a
  // soft, light field (no shapes, no edges).
  // smootherstep: zero slope where the band begins (no visible onset line),
  // full by ~70% of the way to the edge
  float tl = clamp(veilLinear(p) / 0.7, 0.0, 1.0);
  float tint = uVeilColor.a * tl * tl * tl * (tl * (tl * 6.0 - 15.0) + 10.0) * uVeil.w;
  outColor = color * (1.0 - tint) + vec4(uVeilColor.rgb, 1.0) * tint;
}
`;

type Level = { tex: WebGLTexture; fbo: WebGLFramebuffer; w: number; h: number };

/**
 * The last pass over the whole frame: motion blur for the scroll-driven camera
 * (an exact affine field for a pan + zoom camera, with the client's sample
 * weights) and the progressive blur behind the chapter text.
 */
export class FrameBlurGL {
  canvas = document.createElement("canvas");
  private gl: WebGL2RenderingContext;
  private blur: WebGLProgram;
  private down: WebGLProgram;
  private src: WebGLTexture;
  private levels: Level[] = [];
  private loc: Record<string, WebGLUniformLocation | null> = {};
  private downLoc: Record<string, WebGLUniformLocation | null> = {};
  private sourceWidth = 0;
  private sourceHeight = 0;
  private compose: WebGLProgram;
  private composed: Level | null = null;
  private composeLoc: Record<string, WebGLUniformLocation | null> = {};
  private editorTex: WebGLTexture | null = null;
  private editorKey = "";
  private inspectorTex: WebGLTexture | null = null;
  private inspectorKey = "";
  private shared: boolean;
  private target: Level | null = null;
  get context() { return this.gl; }
  get texture() { return this.target?.tex ?? null; }
  get targetSize() { return this.target; }

  constructor(presented = false, shared?: WebGL2RenderingContext) {
    this.shared = !!shared;
    const gl = shared ?? this.canvas.getContext("webgl2", { premultipliedAlpha: true, preserveDrawingBuffer: !presented, antialias: false });
    if (!gl) throw new Error("webgl2 unavailable");
    this.gl = gl;
    const compile = (type: number, source: string) => {
      const sh = gl.createShader(type);
      if (!sh) throw new Error("shader");
      gl.shaderSource(sh, source);
      gl.compileShader(sh);
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(sh) ?? "compile");
      return sh;
    };
    const link = (frag: string) => {
      const program = gl.createProgram();
      if (!program) throw new Error("program");
      gl.attachShader(program, compile(gl.VERTEX_SHADER, VERT));
      gl.attachShader(program, compile(gl.FRAGMENT_SHADER, frag));
      gl.bindAttribLocation(program, 0, "a");
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program) ?? "link");
      return program;
    };
    this.blur = link(BLUR_FRAG);
    this.down = link(DOWN_FRAG);
    this.compose = link(COMPOSE_FRAG);
    gl.useProgram(this.compose);
    for (const name of ["uUi", "uPreview", "uSize", "uRect", "uRadius", "uPreviewScale", "uEditor", "uEditorOn", "uEditorRect", "uGrid", "uGridColor", "uInspector", "uInspectorRect", "uInspectorAlpha", "uCursor", "uCursorRect", "uCursorScale", "uCursorAlpha", "uCursorOn"]) this.composeLoc[name] = gl.getUniformLocation(this.compose, name);
    gl.uniform1i(this.composeLoc.uUi, 0); gl.uniform1i(this.composeLoc.uPreview, 1); gl.uniform1i(this.composeLoc.uEditor, 2); gl.uniform1i(this.composeLoc.uInspector, 3); gl.uniform1i(this.composeLoc.uCursor, 4);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    this.src = this.makeTexture();
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
    gl.useProgram(this.blur);
    for (const name of ["uSrc", "uL1", "uL2", "uL3", "uL4", "uL5", "uL6", "uL7", "uSize", "uA", "uB", "uMax", "uVeil", "uVeilBand", "uVeilColor"]) {
      this.loc[name] = gl.getUniformLocation(this.blur, name);
    }
    gl.uniform1i(this.loc.uSrc, 0);
    for (let i = 1; i <= LEVELS; i += 1) gl.uniform1i(this.loc[`uL${i}`], i);
    gl.useProgram(this.down);
    for (const name of ["uTex", "uTexel", "uOutSize"]) this.downLoc[name] = gl.getUniformLocation(this.down, name);
    gl.uniform1i(this.downLoc.uTex, 0);
  }

  prepareEditor(editor: { canvas: HTMLCanvasElement; key: string }) {
    const gl = this.gl;
    gl.activeTexture(gl.TEXTURE2);
    if (!this.editorTex) this.editorTex = this.makeTexture();
    gl.bindTexture(gl.TEXTURE_2D, this.editorTex);
    if (this.editorKey !== editor.key) {
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, editor.canvas);
      this.editorKey = editor.key;
    }
  }

  private makeTexture() {
    const gl = this.gl;
    const t = gl.createTexture();
    if (!t) throw new Error("texture");
    gl.bindTexture(gl.TEXTURE_2D, t);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    return t;
  }

  private ensureLevels(width: number, height: number) {
    const gl = this.gl;
    if (this.levels.length && this.levels[0].w === Math.max(1, Math.ceil(width / 2)) && this.levels[0].h === Math.max(1, Math.ceil(height / 2))) return;
    for (const l of this.levels) {
      gl.deleteTexture(l.tex);
      gl.deleteFramebuffer(l.fbo);
    }
    this.levels = [];
    let w = width;
    let h = height;
    for (let i = 1; i <= LEVELS; i += 1) {
      w = Math.max(1, Math.ceil(w / 2));
      h = Math.max(1, Math.ceil(h / 2));
      const tex = this.makeTexture();
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
      const fbo = gl.createFramebuffer();
      if (!fbo) throw new Error("framebuffer");
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
      this.levels.push({ tex, fbo, w, h });
    }
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  }

  render(
    source: HTMLCanvasElement,
    a: number,
    bx: number,
    by: number,
    max: number,
    veil: {
      mode: number;
      start: number;
      full: number;
      radius: number;
      strength: number;
      color: [number, number, number];
      tint: number;
    },
    preview?: PreviewLayer | null,
    editor?: EditorGpuLayer | null,
    grid?: GridLayer,
    inspector?: (EditorGpuLayer & { alpha: number }) | null,
    cursor?: CursorLayer | null,
  ) {
    const gl = this.gl;
    const { width, height } = source;
    if (!this.shared && (this.canvas.width !== width || this.canvas.height !== height)) {
      this.canvas.width = width;
      this.canvas.height = height;
    }
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.src);
    if (this.sourceWidth === width && this.sourceHeight === height) {
      gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, gl.RGBA, gl.UNSIGNED_BYTE, source);
    } else {
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source);
      this.sourceWidth = width;
      this.sourceHeight = height;
    }

    let scene = this.src;
    if (preview) {
      if (!this.composed || this.composed.w !== width || this.composed.h !== height) {
        if (this.composed) { gl.deleteTexture(this.composed.tex); gl.deleteFramebuffer(this.composed.fbo); }
        const tex = this.makeTexture(), fbo = gl.createFramebuffer()!;
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
        gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
        this.composed = { tex, fbo, w: width, h: height };
      }
      gl.bindFramebuffer(gl.FRAMEBUFFER, this.composed.fbo);
      gl.viewport(0, 0, width, height); gl.useProgram(this.compose);
      gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, this.src);
      gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, preview.texture);
      gl.uniform2f(this.composeLoc.uSize, width, height);
      gl.uniform4f(this.composeLoc.uRect, preview.x, preview.y, preview.w, preview.h);
      gl.uniform1f(this.composeLoc.uRadius, preview.radius);
      gl.uniform2f(this.composeLoc.uPreviewScale, preview.u, preview.v);
      gl.activeTexture(gl.TEXTURE2);
      if (!this.editorTex) this.editorTex = this.makeTexture();
      gl.bindTexture(gl.TEXTURE_2D, this.editorTex);
      if (editor && this.editorKey !== editor.key) {
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, editor.canvas);
        this.editorKey = editor.key;
      } else if (!editor && !this.editorKey) {
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array(4));
        this.editorKey = "empty";
      }
      gl.activeTexture(gl.TEXTURE3);
      if (!this.inspectorTex) this.inspectorTex = this.makeTexture();
      gl.bindTexture(gl.TEXTURE_2D, this.inspectorTex);
      if (inspector && this.inspectorKey !== inspector.key) {
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, inspector.canvas);
        this.inspectorKey = inspector.key;
      } else if (!this.inspectorKey) {
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array(4));
        this.inspectorKey = "empty";
      }
      gl.activeTexture(gl.TEXTURE4);
      gl.bindTexture(gl.TEXTURE_2D, cursor?.texture ?? this.src);
      gl.uniform1i(this.composeLoc.uCursorOn, cursor ? 1 : 0);
      gl.uniform4f(this.composeLoc.uCursorRect, cursor?.x ?? 0, cursor?.y ?? 0, cursor?.w ?? 1, cursor?.h ?? 1);
      gl.uniform2f(this.composeLoc.uCursorScale, cursor?.u ?? 1, cursor?.v ?? 1);
      gl.uniform1f(this.composeLoc.uCursorAlpha, cursor?.alpha ?? 0);
      gl.uniform1f(this.composeLoc.uInspectorAlpha, inspector?.alpha ?? 0);
      gl.uniform4f(this.composeLoc.uInspectorRect, inspector?.x ?? 0, inspector?.y ?? 0, inspector?.w ?? 1, inspector?.h ?? 1);
      gl.uniform1i(this.composeLoc.uEditorOn, editor ? 1 : 0);
      if (editor && grid) {
        gl.uniform4f(this.composeLoc.uEditorRect, editor.x, editor.y, editor.w, editor.h);
        gl.uniform4f(this.composeLoc.uGrid, grid.x, grid.y, grid.step, grid.dpr);
        gl.uniform1f(this.composeLoc.uGridColor, grid.dark ? 1 : 0);
      }
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      scene = this.composed.tex;
    }

    const veilOn = veil.strength > 0 && veil.radius > 0;
    if (veilOn) {
      // build the tent-filtered pyramid
      this.ensureLevels(width, height);
      gl.useProgram(this.down);
      let prevTex = scene;
      let pw = width;
      let ph = height;
      for (const l of this.levels) {
        gl.bindFramebuffer(gl.FRAMEBUFFER, l.fbo);
        gl.viewport(0, 0, l.w, l.h);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, prevTex);
        gl.uniform2f(this.downLoc.uTexel, 1 / pw, 1 / ph);
        gl.uniform2f(this.downLoc.uOutSize, l.w, l.h);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        prevTex = l.tex;
        pw = l.w;
        ph = l.h;
      }
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    }

    if (this.shared && (!this.target || this.target.w < width || this.target.h < height)) {
      const w = Math.max(this.target?.w ?? 64, 2 ** Math.ceil(Math.log2(width)));
      const h = Math.max(this.target?.h ?? 64, 2 ** Math.ceil(Math.log2(height)));
      if (this.target) { gl.deleteTexture(this.target.tex); gl.deleteFramebuffer(this.target.fbo); }
      gl.activeTexture(gl.TEXTURE0);
      const tex = this.makeTexture(), fbo = gl.createFramebuffer()!;
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
      this.target = { tex, fbo, w, h };
    }
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.shared ? this.target!.fbo : null);
    gl.useProgram(this.blur);
    gl.viewport(0, 0, width, height);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, scene);
    // All sampler bindings belong to this pass, even when the veil branch is
    // disabled. A shared context may still have our output texture bound by
    // the compositor; leaving it on an unused level creates a feedback loop
    // and makes WebGL reject the draw (notably on repeated, retained frames).
    for (let i = 0; i < LEVELS; i += 1) {
      gl.activeTexture(gl.TEXTURE1 + i);
      gl.bindTexture(gl.TEXTURE_2D, this.levels[i]?.tex ?? scene);
    }
    gl.uniform4f(this.loc.uVeil, veilOn ? veil.mode : 0, 0, veil.radius, veil.strength);
    gl.uniform2f(this.loc.uVeilBand, veil.start, veil.full);
    gl.uniform4f(this.loc.uVeilColor, veil.color[0], veil.color[1], veil.color[2], veil.tint);
    gl.uniform2f(this.loc.uSize, width, height);
    gl.uniform1f(this.loc.uA, a);
    gl.uniform2f(this.loc.uB, bx, by);
    gl.uniform1f(this.loc.uMax, max);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    return this.canvas;
  }
  dispose() {
    const gl = this.gl;
    gl.deleteTexture(this.src); if (this.editorTex) gl.deleteTexture(this.editorTex); if (this.inspectorTex) gl.deleteTexture(this.inspectorTex);
    this.levels.forEach((level) => { gl.deleteTexture(level.tex); gl.deleteFramebuffer(level.fbo); });
    gl.deleteProgram(this.blur); gl.deleteProgram(this.down); gl.deleteProgram(this.compose);
    if (this.composed) { gl.deleteTexture(this.composed.tex); gl.deleteFramebuffer(this.composed.fbo); }
    if (this.target) { gl.deleteTexture(this.target.tex); gl.deleteFramebuffer(this.target.fbo); }
    if (!this.shared) gl.getExtension("WEBGL_lose_context")?.loseContext();
  }

}
