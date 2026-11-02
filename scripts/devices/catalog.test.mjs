import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('API discovery includes complete model descriptors independent of client allowlists', async () => {
  const source = JSON.parse(await readFile('content/devices/catalog.json', 'utf8'));
  const api = JSON.parse(await readFile('src/data/generated/devices.json', 'utf8'));
  const staticIndex = JSON.parse(await readFile('public/devices/index.json', 'utf8'));
  assert.deepEqual(api, staticIndex);
  assert.equal(new Set(api.devices.map(d => d.id)).size, api.devices.length);
  for (const entry of source.devices) {
    const manifest = api.devices.find(d => d.id === entry.id);
    assert.ok(manifest);
    assert.deepEqual(manifest, JSON.parse(await readFile(`public/devices/${entry.id}/manifest.json`, 'utf8')));
    if (!entry.phoneModel) continue;
    assert.deepEqual(manifest.phoneModel, entry.phoneModel);
    assert.deepEqual(manifest.colors, entry.phoneModel.colors);
    assert.equal(manifest.requiredRecordingKind, 'singleScreen');
    assert.equal(manifest.phoneModel.rendererSchemaVersion, manifest.rendererSchemaVersion);
    for (const finish of manifest.phoneModel.finishes) {
      assert.match(finish.swatchHex, /^#[0-9a-fA-F]{6}$/);
      assert.ok(finish.localizedNames.en);
      assert.ok(finish.localizedNames['zh-Hans']);
    }
  }
});
