import assert from 'node:assert/strict';
import test from 'node:test';
import { buildSync } from 'esbuild';

// Bundle the production evaluators so these checks exercise the actual renderer math.
const bundle = buildSync({
  stdin: {
    contents: `export { createState, COMP, screenRectIn, zoomScaleAt, zoomEntryLevel, horizonOf, zoomWaveform } from './src/components/experience/editor';
      export { camera2D, spatial } from './src/components/experience/preview';`,
    resolveDir: process.cwd(),
  },
  bundle: true, platform: 'node', format: 'esm', write: false,
});
const { createState, COMP, screenRectIn, camera2D, spatial, zoomScaleAt, zoomEntryLevel, horizonOf, zoomWaveform } = await import(
  `data:text/javascript;base64,${Buffer.from(bundle.outputFiles[0].text).toString('base64')}`
);
const state = createState(false, 'Click export and every zoom lands exactly where you placed it.');
const screen = screenRectIn(COMP, state.background.padding);
const corners = [[0, 0], [1, 0], [0, 1], [1, 1], [.5, .5]];
function projected(time, u, v) {
  const plane = spatial(state, time, screen);
  if (plane) return plane.project(u, v);
  const camera = camera2D(state, time, screen);
  return { x: (screen.x + u * screen.w) * camera.s + camera.ox,
    y: (screen.y + v * screen.h) * camera.s + camera.oy };
}

test('the 5.1 second retarget continues from the preceding camera frame', () => {
  for (const [u, v] of corners) {
    const before = projected(5.1 - 1e-6, u, v), after = projected(5.1 + 1e-6, u, v);
    assert.ok(Math.hypot(after.x - before.x, after.y - before.y) < .01);
  }
});

test('every clip and optical mode boundary preserves screen-space continuity', () => {
  for (const clip of state.zoomClips) for (const time of [clip.start, clip.end]) {
    for (const [u, v] of corners) {
      const before = projected(time - 1e-6, u, v), after = projected(time + 1e-6, u, v);
      assert.ok(Math.hypot(after.x - before.x, after.y - before.y) < .01,
        `camera jumped at ${time}s, corner ${u},${v}`);
    }
  }
});

test('the second half zooms into narration, typing, and the posted comment', () => {
  assert.ok(camera2D(state, 13, screen).s > 1.4);
  assert.ok(camera2D(state, 16.5, screen).s > 1.7);
  assert.ok(camera2D(state, 18.7, screen).s > 1.6);
  const typing = camera2D(state, 16.5, screen), sent = camera2D(state, 18.7, screen);
  assert.ok(Math.hypot(sent.ox - typing.ox, sent.oy - typing.oy) > 20);
  assert.deepEqual(camera2D(state, 21, screen), { s: 1, ox: 0, oy: 0 });
});


test('joined 2D to 3D inherits 1.8x without a return to the overview', () => {
  const flat = state.zoomClips[4], tilted = state.zoomClips[5];
  assert.equal(flat.end, tilted.start);
  assert.equal(zoomEntryLevel(state.zoomClips, tilted), flat.zoom);
  assert.equal(camera2D(state, flat.end - .001, screen).s, flat.zoom);
  assert.equal(spatial(state, tilted.start, screen).zoomScale, flat.zoom);
  let previousScale = flat.zoom;
  for (let i = 0; i <= 100; i++) {
    const time = tilted.start + horizonOf(tilted) * i / 100;
    const rendered = spatial(state, time, screen);
    const waveformScale = zoomScaleAt(state, time);
    assert.ok(waveformScale >= tilted.zoom - 1e-10 && waveformScale <= flat.zoom + 1e-10);
    assert.ok(waveformScale <= previousScale + 1e-10);
    assert.equal(rendered.zoomScale, waveformScale);
    previousScale = waveformScale;
  }
  assert.ok(Math.abs(previousScale - tilted.zoom) < 1e-10);
});


test('cached waveform samples remain exact and invalidate when neighbouring settings change', () => {
  const local = createState(false, 'Sample');
  const clip = local.zoomClips[5], count = 64;
  const first = zoomWaveform(local.zoomClips, clip, count);
  assert.strictEqual(zoomWaveform(local.zoomClips, clip, count), first);
  first.scales.forEach((scale, i) => assert.equal(scale,
    zoomScaleAt(local, clip.start + (clip.end - clip.start) * i / count)));
  local.zoomClips[4].zoom = 2.4;
  const changed = zoomWaveform(local.zoomClips, clip, count);
  assert.notStrictEqual(changed, first);
  assert.equal(changed.scales[0], 2.4);
  local.zoomClips[4].enabled = false;
  assert.notStrictEqual(zoomWaveform(local.zoomClips, clip, count), changed);
});
