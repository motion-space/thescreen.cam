/** Reconstruct the packed video's alpha on the GPU, without CPU pixel readback. */
export class CameraMaskGL {
  readonly canvas = document.createElement("canvas");
  private gl: WebGLRenderingContext;
  private texture: WebGLTexture;
  private program: WebGLProgram;

  constructor() {
    const gl = this.canvas.getContext("webgl", { premultipliedAlpha: true, preserveDrawingBuffer: true, antialias: false });
    if (!gl) throw new Error("Camera mask WebGL unavailable");
    this.gl = gl;
    const shader = (type: number, source: string) => {
      const shader = gl.createShader(type)!;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(shader) ?? "Camera shader");
      return shader;
    };
    const vertex = shader(gl.VERTEX_SHADER, "attribute vec2 a; varying vec2 uv; void main(){uv=(a+1.0)*0.5;gl_Position=vec4(a,0.0,1.0);}");
    const fragment = shader(gl.FRAGMENT_SHADER, `precision mediump float;
      varying vec2 uv; uniform sampler2D video;
      void main(){
        vec3 rgb=texture2D(video,vec2(uv.x*0.5,uv.y)).rgb;
        float mask=texture2D(video,vec2(0.5+uv.x*0.5,uv.y)).r;
        float alpha=clamp((mask*255.0-4.0)/247.0,0.0,1.0);
        gl_FragColor=vec4(rgb*alpha,alpha);
      }`);
    const program = gl.createProgram()!;
    gl.attachShader(program, vertex); gl.attachShader(program, fragment);
    gl.bindAttribLocation(program, 0, "a"); gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error("Camera mask link failed");
    gl.deleteShader(vertex); gl.deleteShader(fragment);
    this.program = program;
    gl.useProgram(program);
    const buffer = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,1,1]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0); gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    this.texture = gl.createTexture()!;
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
  }

  render(video: HTMLVideoElement) {
    const gl = this.gl;
    const width = video.videoWidth / 2, height = video.videoHeight;
    if (this.canvas.width !== width || this.canvas.height !== height) { this.canvas.width = width; this.canvas.height = height; }
    gl.useProgram(this.program); gl.viewport(0, 0, width, height);
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, video);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    return this.canvas;
  }

  dispose() { this.gl.getExtension("WEBGL_lose_context")?.loseContext(); }
}
