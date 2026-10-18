import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { buildSync } from 'esbuild';

// Only pixel storage is mocked. Both evaluators run their real particle math,
// collision ordering, shrink animation and Uint8ClampedArray rounding.
globalThis.document = {
  fonts: { ready: Promise.resolve(), addEventListener() {} },
  createElement() {
    const canvas = { width: 0, height: 0, pixels: null };
    let source;
    canvas.getContext = () => ({
      drawImage(image) { source = image; },
      getImageData() { return { data: source.data.slice() }; },
      createImageData(w, h) { return { data: new Uint8ClampedArray(w * h * 4) }; },
      putImageData(image) { canvas.pixels = image.data.slice(); },
    });
    return canvas;
  },
};

async function evaluator(path, append = '') {
  const result = buildSync({
    stdin: { loader: 'ts', contents: readFileSync(path, 'utf8') + append, resolveDir: resolve(path, '..') },
    bundle: true, platform: 'node', format: 'esm', write: false,
  });
  return (await import(`data:text/javascript;base64,${Buffer.from(result.outputFiles[0].text).toString('base64')}`)).renderForTest;
}

const optimized = await evaluator('src/components/experience/camera.ts', `
  export function renderForTest(a, b, elapsed) {
    original = a; cutout = b; particles = null;
    prepareDissolve(); return renderDissolve(elapsed);
  }
`);
const reference = await evaluator('scripts/fixtures/experience-particles-reference.ts');

for (const [w, h] of [[16, 12], [64, 48], [256, 192], [256, 193], [256, 192]]) {
  test(`dissolve matches every reference pixel at ${w}×${h}, including reverse playback`, () => {
    const original = { width: w, height: h, data: new Uint8ClampedArray(w * h * 4) };
    const cutout = { ...original, data: original.data.slice() };
    for (let i = 0; i < original.data.length; i += 4) {
      original.data.set([(i * 17) % 256, (i * 31 + 3) % 256, (i * 13 + 9) % 256, 255], i);
      cutout.data.set([0, 0, 0, [0, 1, 127, 254, 255][(i / 4) % 5]], i);
    }
    const times = [0, 1, 120, 360, 800, 1400, 1640, 1740];
    for (const elapsed of [...times, ...times.toReversed()]) {
      assert.deepEqual(optimized(original, cutout, elapsed).pixels, reference(original, cutout, elapsed).pixels, `${elapsed}ms`);
    }
  });
}
