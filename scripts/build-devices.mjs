import { createHash } from 'node:crypto';
import { readdir, readFile, mkdir, writeFile } from 'node:fs/promises';
import { deflateRawSync } from 'node:zlib';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const defaultVersion = '1.0.0';
const phoneColors = {
 'iphone-17': ['black','white','mist-blue','sage','lavender'],
 'iphone-17-pro': ['silver','cosmic-orange','deep-blue'],
 'iphone-17-pro-max': ['silver','cosmic-orange','deep-blue'],
 'iphone-air': ['space-black','cloud-white','light-gold','sky-blue'],
 'iphone-18-pro': ['silver','black','burgundy','glacier'],
 'iphone-18-pro-max': ['silver','black','burgundy','glacier'],
};
const versions = Object.fromEntries(Object.keys(phoneColors).map(id => [id, id === 'iphone-air' ? '1.0.5' : '1.0.3']));
const manifests = [];
for (const id of ['iphone-duo', ...Object.keys(phoneColors)]) {
const version = versions[id] ?? defaultVersion;
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
  schemaVersion: 1, id, name: id.replace('iphone', 'iPhone').replaceAll('-', ' ').replace(' pro', ' Pro').replace(' max', ' Max').replace(' air', ' Air').replace(' duo', ' Duo'), version, rendererSchemaVersion: 2,
  requiredRecordingKind: id === 'iphone-duo' ? 'iphoneDuo' : 'singleScreen', colors: phoneColors[id] ?? ['white', 'black'],
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
