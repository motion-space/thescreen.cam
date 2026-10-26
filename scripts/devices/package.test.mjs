import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {inflateRawSync} from 'node:zlib';
import {createHash} from 'node:crypto';
const sha=b=>createHash('sha256').update(b).digest('hex');

test('Duo device is versioned, recording-restricted, and has two finishes and seven poses',async()=>{
 const m=JSON.parse(await readFile('public/devices/iphone-duo/manifest.json','utf8'));
 assert.equal(m.requiredRecordingKind,'iphoneDuo');assert.equal(m.rendererSchemaVersion,2);
 assert.deepEqual(m.colors,['white','black']);assert.equal(new Set(m.postures).size,7);
 const index=JSON.parse(await readFile('src/data/generated/devices.json','utf8'));
 assert.deepEqual(index.devices[0],m);
});

test('Published device pack verifies every decompressed resource and the complete download',async()=>{
 const m=JSON.parse(await readFile('public/devices/iphone-duo/manifest.json','utf8'));
 const data=await readFile('public'+m.package.url);
 assert.equal(data.length,m.package.size);assert.equal(sha(data),m.package.sha256);
 assert.equal(data.subarray(0,9).toString(),'SCDEVICE1');
 const length=data.readUInt32LE(9),header=JSON.parse(data.subarray(13,13+length));
 assert.equal(header.id,m.id);assert.equal(header.version,m.version);
 let offset=0,total=0;
 for(const file of header.files){
  assert.match(file.path,/^[A-Za-z0-9_.-]+$/);assert.equal(file.offset,offset);
  const bytes=inflateRawSync(data.subarray(13+length+file.offset,13+length+file.offset+file.compressedSize));
  assert.equal(bytes.length,file.size);assert.equal(sha(bytes),file.sha256);
  offset+=file.compressedSize;total+=file.size;
 }
 assert.equal(total,m.package.installedSize);assert.equal(offset+13+length,data.length);
 assert.ok(header.files.some(f=>f.path==='model.json'));
 assert.ok(header.files.filter(f=>f.path.startsWith('environment-')).length===5);
});
