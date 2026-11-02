import { createHash } from 'node:crypto';
import { readdir, readFile, mkdir, writeFile } from 'node:fs/promises';
import { deflateRawSync } from 'node:zlib';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const catalog = JSON.parse(await readFile(path.join(root, 'content/devices/catalog.json'), 'utf8'));
if (catalog.schemaVersion !== 1 || !Array.isArray(catalog.devices)) throw new Error('Unsupported device catalog');
const manifests = [];
for (const device of catalog.devices) {
const { id, version, phoneModel } = device;
if (!/^[a-z0-9-]+$/.test(id) || !/^[0-9]+\.[0-9]+\.[0-9]+$/.test(version)) throw new Error('Invalid device identity');
if (phoneModel && (phoneModel.id !== id || phoneModel.rendererSchemaVersion !== device.rendererSchemaVersion
    || !phoneModel.finishes.length || new Set(phoneModel.colors).size !== phoneModel.colors.length
    || JSON.stringify(phoneModel.finishes.map(f => f.id)) !== JSON.stringify(phoneModel.colors)
    || ![phoneModel.screenSize.width, phoneModel.screenSize.height].every(n => Number.isInteger(n) && n > 0 && n <= 16384))) {
  throw new Error(`Invalid phone metadata: ${id}`);
}
const input = path.join(root, 'content/devices', id, version);
const output = path.join(root, 'public/devices', id, version);
const sha = data => createHash('sha256').update(data).digest('hex');
await mkdir(output, { recursive: true });
const blobs = [], files = [];
let offset = 0;
for (const name of (await readdir(input)).sort()) {
  const data = await readFile(path.join(input, name));
  const compressed = deflateRawSync(data, { level: 9 });
  files.push({ path: name, offset, compressedSize: compressed.length, size: data.length, sha256: sha(data) });
  blobs.push(compressed); offset += compressed.length;
}
const header = Buffer.from(JSON.stringify({ schemaVersion: 1, id, version, files }));
const size = Buffer.alloc(4); size.writeUInt32LE(header.length);
const pack = Buffer.concat([Buffer.from('SCDEVICE1'), size, header, ...blobs]);
await writeFile(path.join(output, 'device.scdevice'), pack);
const model = JSON.parse(await readFile(path.join(input, 'model.json'), 'utf8'));
const manifest = {
  schemaVersion: 1, id, name: device.name, version, rendererSchemaVersion: device.rendererSchemaVersion,
  requiredRecordingKind: phoneModel ? 'singleScreen' : 'iphoneDuo', colors: phoneModel?.colors ?? ['white', 'black'],
  ...(phoneModel ? { phoneModel } : {}),
  posePresets: model.posePresets,
  postures: id !== 'iphone-duo' ? [] : ['foldedLandscape','foldedPortrait','tent','laptop','unfoldedLandscape','unfoldedPortrait','slightlyFolded'],
  package: { url: `/devices/${id}/${version}/device.scdevice`, size: pack.length,
    installedSize: files.reduce((n,f)=>n+f.size,0), sha256: sha(pack) }
};
await writeFile(path.join(root,'public/devices',id,'manifest.json'), JSON.stringify(manifest,null,2)+'\n');
manifests.push(manifest);
console.log(`${id}: ${files.length} files, ${pack.length} bytes download`);
}
await writeFile(path.join(root,'public/devices/index.json'), JSON.stringify({schemaVersion:1,devices:manifests},null,2)+'\n');
await mkdir(path.join(root,'src/data/generated'),{recursive:true});
await writeFile(path.join(root,'src/data/generated/devices.json'), JSON.stringify({schemaVersion:1,devices:manifests},null,2)+'\n');
