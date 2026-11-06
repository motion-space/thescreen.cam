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


test('device presentation kinds select laptop/display icons independently of phone defaults',async()=>{
 const api=JSON.parse(await readFile('src/data/generated/devices.json','utf8'));
 for(const entry of api.devices.filter(d=>d.phoneModel)){
  assert.ok(['phone','laptop','display'].includes(entry.phoneModel.deviceKind));
  if(entry.id.startsWith('macbook-'))assert.equal(entry.phoneModel.deviceKind,'laptop');
  if(['studio-display','pro-display-xdr'].includes(entry.id))assert.equal(entry.phoneModel.deviceKind,'display');
 }
});


test('optional API device groups retain order, stable device IDs and standalone Duo', async () => {
  const source = JSON.parse(await readFile('content/devices/catalog.json', 'utf8'));
  const api = JSON.parse(await readFile('src/data/generated/devices.json', 'utf8'));
  assert.equal(api.schemaVersion, 1);
  assert.deepEqual(api.groups, source.groups);
  assert.deepEqual(api.groups.map(g => g.id), ['iphone-17-series','iphone-18-series','macbook-pro','macbook-air','apple-display']);
  assert.deepEqual(api.groups.find(g => g.id === 'apple-display').deviceIDs, ['studio-display','pro-display-xdr']);
  const members = api.groups.flatMap(g => g.deviceIDs);
  assert.equal(new Set(members).size, members.length);
  assert.deepEqual([...members].sort(), api.devices.filter(d => d.phoneModel).map(d => d.id).sort());
  assert.ok(api.devices.some(d => d.id === 'iphone-duo'));
  for (const group of api.groups) assert.ok(group.deviceIDs.includes(group.defaultDeviceID));
});
