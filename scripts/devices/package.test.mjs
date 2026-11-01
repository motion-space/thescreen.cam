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

for (const id of ['iphone-17','iphone-17-pro','iphone-17-pro-max','iphone-air','iphone-18-pro','iphone-18-pro-max']) {
 test(`${id}: package identity, finishes, all file hashes and native screen mesh`, async()=>{
  const m=JSON.parse(await readFile(`public/devices/${id}/manifest.json`,'utf8'));
  assert.equal(m.id,id); assert.equal(m.requiredRecordingKind,'singleScreen'); assert.deepEqual(m.postures,[]);
  const data=await readFile('public'+m.package.url); assert.equal(sha(data),m.package.sha256); assert.equal(data.length,m.package.size);
  const n=data.readUInt32LE(9),header=JSON.parse(data.subarray(13,13+n)); assert.equal(header.id,id);
  let total=0, cursor=0, model;
  for(const f of header.files){
   assert.equal(f.offset,cursor); assert.match(f.path,/^[A-Za-z0-9_.-]+$/);
   const bytes=inflateRawSync(data.subarray(13+n+f.offset,13+n+f.offset+f.compressedSize));
   assert.equal(bytes.length,f.size); assert.equal(sha(bytes),f.sha256); total+=f.size; cursor+=f.compressedSize;
   if(f.path==='model.json')model=JSON.parse(bytes);
  }
  assert.equal(total,m.package.installedSize); assert.equal(13+n+cursor,data.length);
  assert.equal(model.physicalSize.length,2); assert.ok(model.materials.some(x=>x.screen));
  if(id!=='iphone-air')assert.equal(m.version,'1.0.3');
  if(id==='iphone-17-pro')assert.equal(model.materials.find(m=>m.name==='back side stuff').map.file,'camera-optics.png');
  if(id==='iphone-17-pro-max'){
   const back=model.materials.find(m=>m.name==='SMUhrjUPCjJkPUK');
   assert.ok(back.map.file.startsWith('neutral-'));
   for(const color of m.colors)assert.ok(back.finishes[color]);
   const frame=model.materials.find(m=>m.name==='SLmJkLdkhbbuEfG');
   assert.ok(frame.roughMap);assert.ok(frame.normalMap);
  }

  for(const color of m.colors)assert.ok(model.materials.some(x=>x.finishes?.[color]));
  assert.equal(m.posePresets.length,6);assert.deepEqual(m.posePresets,model.posePresets);
  assert.deepEqual(m.posePresets.find(p=>p.id==='bottom').rotation,{pitchDegrees:-78,yawDegrees:0,rollDegrees:0});
  for(const pose of m.posePresets){assert.ok(pose.id);assert.ok(pose.name);assert.ok(pose.localizedNames['zh-Hans']);for(const value of Object.values(pose.rotation))assert.ok(Number.isFinite(value)&&Math.abs(value)<=180);}

  if(id==='iphone-air'){
   assert.equal(m.version,'1.0.5');
   for(const role of ['polished-titanium','back-glass','camera-glass']){
    const material=model.materials.find(x=>x.name===`Air / ${role}`);assert.ok(material);
    for(const color of m.colors){
     const f=material.finishes[color];assert.ok(f);
     assert.equal(f.metalness,role==='polished-titanium'?1:0);
     assert.ok(f.roughness<(role==='camera-glass'?.12:.3));
     if(role!=='polished-titanium')assert.equal(f.clearcoat,1);
    }
   }
   const rear=model.materials.find(x=>x.name==='Air / back-glass');
   assert.equal(rear.map.file,'air-back-pigment.png');assert.equal(rear.roughMap.file,'air-back-surface.png');
   for(const node of model.nodes.filter(n=>n.name.startsWith('Body5:')))
    assert.equal(!!model.materials[node.materials[0]].screen,node.name.endsWith('/display'));
  }

 });
}
