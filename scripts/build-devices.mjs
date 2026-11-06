import { createHash } from 'node:crypto';
import { readdir, readFile, mkdir, writeFile } from 'node:fs/promises';
import { deflateRawSync } from 'node:zlib';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { applyMaterialProfiles } from './devices/materials.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const catalog = JSON.parse(await readFile(path.join(root, 'content/devices/catalog.json'), 'utf8'));
if (catalog.schemaVersion !== 1 || !Array.isArray(catalog.devices)) throw new Error('Unsupported device catalog');
const groups = catalog.groups;
if (groups !== undefined) {
  const devices = new Set(catalog.devices.filter(d => d.phoneModel).map(d => d.id));
  const groupIDs = new Set(), assigned = new Set();
  if (!Array.isArray(groups) || groups.length > 128) throw new Error('Invalid device groups');
  for (const group of groups) {
    if (!group || typeof group.id !== 'string' || !/^[a-z0-9-]{1,128}$/.test(group.id) || groupIDs.has(group.id)
        || typeof group.name !== 'string' || !group.name.trim() || group.name.length > 160
        || !['phone','laptop','display'].includes(group.deviceKind)
        || !Array.isArray(group.deviceIDs) || !group.deviceIDs.length || group.deviceIDs.length > 128
        || group.defaultDeviceID !== undefined && !group.deviceIDs.includes(group.defaultDeviceID)
        || group.localizedNames !== undefined && (!group.localizedNames || typeof group.localizedNames !== 'object'
          || Array.isArray(group.localizedNames) || Object.entries(group.localizedNames).some(([key, value]) =>
            !key || key.length > 32 || typeof value !== 'string' || !value.trim() || value.length > 160))) {
      throw new Error(`Invalid device group: ${group?.id}`);
    }
    groupIDs.add(group.id);
    for (const id of group.deviceIDs) {
      if (!devices.has(id) || assigned.has(id)) throw new Error(`Invalid or duplicate group membership: ${id}`);
      assigned.add(id);
    }
  }
}

const materialProfiles = JSON.parse(await readFile(path.join(root, 'content/devices/material-profiles.json'), 'utf8'));
const manifests = [];
for (const device of catalog.devices) {
const { id, version, phoneModel } = device;
if (!/^[a-z0-9-]+$/.test(id) || !/^[0-9]+\.[0-9]+\.[0-9]+$/.test(version)) throw new Error('Invalid device identity');
if (phoneModel && (phoneModel.id !== id || phoneModel.rendererSchemaVersion !== device.rendererSchemaVersion
    || phoneModel.deviceKind !== undefined && !["phone","laptop","display"].includes(phoneModel.deviceKind)
    || !phoneModel.finishes.length || new Set(phoneModel.colors).size !== phoneModel.colors.length
    || JSON.stringify(phoneModel.finishes.map(f => f.id)) !== JSON.stringify(phoneModel.colors)
    || ![phoneModel.screenSize.width, phoneModel.screenSize.height].every(n => Number.isInteger(n) && n > 0 && n <= 16384))) {
  throw new Error(`Invalid phone metadata: ${id}`);
}
const parameters = phoneModel?.parameters ?? device.parameters ?? [];
if (parameters.length > 16 || new Set(parameters.map(p => p.id)).size !== parameters.length
    || parameters.some(p => !/^[a-z0-9-]+$/.test(p.id) || !p.name || !p.localizedNames?.en || !p.localizedNames?.['zh-Hans']
      || ![p.minimum,p.maximum,p.defaultValue,p.step].every(Number.isFinite)
      || p.minimum < -360 || p.maximum > 360 || p.minimum >= p.maximum
      || p.defaultValue < p.minimum || p.defaultValue > p.maximum || p.step <= 0 || p.step > p.maximum-p.minimum
      || !['joint','duoHinge'].includes(p.binding))
    || (phoneModel && (parameters.some(p => p.binding !== 'joint')
      || (parameters.length > 0 || phoneModel.layoutSize || phoneModel.followsSourceOrientation !== undefined) && device.rendererSchemaVersion !== 3))
    || (device.parameters && (id !== 'iphone-duo' || parameters.length > 1 || parameters.some(p => p.binding !== 'duoHinge' || p.minimum < 0 || p.maximum > 180)))) {
  throw new Error(`Invalid configurable device metadata: ${id}`);
}
const input = path.join(root, 'content/devices', id, version);
const output = path.join(root, 'public/devices', id, version);
const sha = data => createHash('sha256').update(data).digest('hex');
await mkdir(output, { recursive: true });
const sourceModel = JSON.parse(await readFile(path.join(input, 'model.json'), 'utf8'));
const model = applyMaterialProfiles(sourceModel, device.materialBindings, materialProfiles);
const blobs = [], files = [];
let offset = 0;
for (const name of (await readdir(input)).sort()) {
  const data = name === 'model.json' && device.materialBindings?.length ? Buffer.from(JSON.stringify(model)) : await readFile(path.join(input, name));
  const compressed = deflateRawSync(data, { level: 9 });
  files.push({ path: name, offset, compressedSize: compressed.length, size: data.length, sha256: sha(data) });
  blobs.push(compressed); offset += compressed.length;
}
const header = Buffer.from(JSON.stringify({ schemaVersion: 1, id, version, files }));
const size = Buffer.alloc(4); size.writeUInt32LE(header.length);
const pack = Buffer.concat([Buffer.from('SCDEVICE1'), size, header, ...blobs]);
const packagePath = path.join(output, 'device.scdevice');
try {
  const existing = await readFile(packagePath);
  if (!existing.equals(pack)) throw new Error(`Immutable device package changed: ${id}@${version}; bump its catalog version`);
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}
await writeFile(packagePath, pack);
if (phoneModel && (model.version !== device.rendererSchemaVersion
    || JSON.stringify(model.parameters ?? []) !== JSON.stringify(parameters)
    || (model.joints ?? []).length !== parameters.length
    || parameters.some(p => !(model.joints ?? []).some(j => j.parameterID === p.id)
        || !model.nodes.some(n => n.joint === p.id)))) {
  throw new Error(`Device rig does not match catalog: ${id}`);
}
const manifest = {
  schemaVersion: 1, id, name: device.name, version, rendererSchemaVersion: device.rendererSchemaVersion,
  requiredRecordingKind: phoneModel ? 'singleScreen' : 'iphoneDuo', colors: phoneModel?.colors ?? ['white', 'black'],
  ...(phoneModel ? { phoneModel } : {}),
  posePresets: model.posePresets,
  ...(device.parameters ? { parameters: device.parameters } : {}),
  postures: id !== 'iphone-duo' ? [] : ['foldedLandscape','foldedPortrait','tent','laptop','unfoldedLandscape','unfoldedPortrait','slightlyFolded'],
  package: { url: `/devices/${id}/${version}/device.scdevice`, size: pack.length,
    installedSize: files.reduce((n,f)=>n+f.size,0), sha256: sha(pack) }
};
await writeFile(path.join(root,'public/devices',id,'manifest.json'), JSON.stringify(manifest,null,2)+'\n');
manifests.push(manifest);
console.log(`${id}: ${files.length} files, ${pack.length} bytes download`);
}
const index = JSON.stringify({schemaVersion:1,devices:manifests,...(groups !== undefined ? {groups} : {})},null,2)+'\n';
await writeFile(path.join(root,'public/devices/index.json'), index);
await mkdir(path.join(root,'src/data/generated'),{recursive:true});
await writeFile(path.join(root,'src/data/generated/devices.json'), index);
