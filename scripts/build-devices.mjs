import { createHash } from 'node:crypto';
import { readdir, readFile, mkdir, writeFile } from 'node:fs/promises';
import { deflateRawSync } from 'node:zlib';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const version = '1.0.0';
const input = path.join(root, 'content/devices/iphone-duo', version);
const output = path.join(root, 'public/devices/iphone-duo', version);
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
const header = Buffer.from(JSON.stringify({ schemaVersion: 1, id: 'iphone-duo', version, files }));
const size = Buffer.alloc(4); size.writeUInt32LE(header.length);
const pack = Buffer.concat([Buffer.from('SCDEVICE1'), size, header, ...blobs]);
await writeFile(path.join(output, 'device.scdevice'), pack);
const manifest = {
  schemaVersion: 1, id: 'iphone-duo', name: 'iPhone Duo', version, rendererSchemaVersion: 2,
  requiredRecordingKind: 'iphoneDuo', colors: ['white', 'black'],
  postures: ['foldedLandscape','foldedPortrait','tent','laptop','unfoldedLandscape','unfoldedPortrait','slightlyFolded'],
  package: { url: `/devices/iphone-duo/${version}/device.scdevice`, size: pack.length,
    installedSize: files.reduce((n,f)=>n+f.size,0), sha256: sha(pack) }
};
await writeFile(path.join(root,'public/devices/iphone-duo/manifest.json'), JSON.stringify(manifest,null,2)+'\n');
await writeFile(path.join(root,'public/devices/index.json'), JSON.stringify({schemaVersion:1,devices:[manifest]},null,2)+'\n');
await mkdir(path.join(root,'src/data/generated'),{recursive:true});
await writeFile(path.join(root,'src/data/generated/devices.json'), JSON.stringify({schemaVersion:1,devices:[manifest]},null,2)+'\n');
console.log(`iPhone Duo: ${files.length} files, ${pack.length} bytes download, ${manifest.package.installedSize} bytes installed`);
