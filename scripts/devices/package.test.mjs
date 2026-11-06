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

for (const [id,colors] of [
 ['macbook-pro-14',['silver','space-gray','midnight']],['macbook-pro-16',['silver','space-gray','midnight']],
 ['macbook-air-13',['sky-blue','silver','starlight','midnight']],['macbook-air-15',['sky-blue','silver','starlight','midnight']],
 ['studio-display',['silver']],['pro-display-xdr',['silver']]]) {
 test(`${id}: configured finishes, screen and joint survive packaging`,async()=>{
  const m=JSON.parse(await readFile(`public/devices/${id}/manifest.json`,'utf8'));
  assert.equal(m.rendererSchemaVersion,3);assert.equal(m.requiredRecordingKind,'singleScreen');assert.deepEqual(m.colors,colors);
  assert.equal(m.phoneModel.followsSourceOrientation,false);assert.ok(m.phoneModel.layoutSize.width>m.phoneModel.layoutSize.height);
  const data=await readFile('public'+m.package.url);assert.equal(data.length,m.package.size);assert.equal(sha(data),m.package.sha256);
  const n=data.readUInt32LE(9),header=JSON.parse(data.subarray(13,13+n));let model,total=0,cursor=0;
  for(const f of header.files){
   assert.equal(f.offset,cursor);assert.match(f.path,/^[A-Za-z0-9_.-]+$/);
   const bytes=inflateRawSync(data.subarray(13+n+f.offset,13+n+f.offset+f.compressedSize));
   assert.equal(bytes.length,f.size);assert.equal(sha(bytes),f.sha256);total+=f.size;cursor+=f.compressedSize;
   if(f.path==='model.json')model=JSON.parse(bytes);
  }
  assert.equal(total,m.package.installedSize);assert.equal(cursor+13+n,data.length);
  assert.deepEqual(model.parameters,m.phoneModel.parameters);assert.equal(model.joints.length,1);
  const parameter=model.parameters[0],joint=model.joints[0];assert.equal(joint.parameterID,parameter.id);
  assert.equal(joint.referenceValue,parameter.defaultValue);assert.ok(joint.axis.every(Number.isFinite));assert.ok(joint.pivot.every(Number.isFinite));
  const moving=model.nodes.filter(n=>n.joint===parameter.id);assert.ok(moving.length);assert.ok(moving.length<model.nodes.length);
  assert.ok(moving.some(n=>n.materials.some(i=>model.materials[i].screen)));
  for(const color of colors)assert.ok(model.materials.some(m=>m.finishes?.[color]));
  if (id.startsWith('macbook-')) {
   const hasLevelDeck = model.nodes.filter(node => !node.joint).some(node => {
    const geometry = model.geometries[node.geometry];
    const positions = Buffer.from(geometry.positions, 'base64');
    const normals = Buffer.from(geometry.normals, 'base64');
    const planes = new Map();
    for (let offset = 0; offset < positions.length; offset += 12) {
     if (normals.readFloatLE(offset + 4) < 0.99999) continue;
     const height = Math.round(positions.readFloatLE(offset + 4) * 50);
     const depth = positions.readFloatLE(offset + 8);
     const [min, max] = planes.get(height) ?? [depth, depth];
     planes.set(height, [Math.min(min, depth), Math.max(max, depth)]);
    }
    return [...planes.values()].some(([min, max]) => max - min > model.physicalSize[0] * 0.6);
   });
   assert.ok(hasLevelDeck, 'The MacBook deck must be horizontal in the zero-rotation pose');
  }
  if(id==='macbook-air-13'){
   const active=model.nodes.filter(node=>node.materials.some(i=>model.materials[i].screen));
   assert.equal(active.length,1);
   assert.equal(model.materials[active[0].materials[0]].screen.nativeUV,true);
   const glass=model.nodes.find(node=>node.name.endsWith('/glass'));
   assert.ok(glass && glass.joint===active[0].joint);
   assert.ok(glass.materials.every(i=>!model.materials[i].screen));
   const positions=Buffer.from(model.geometries[active[0].geometry].positions,'base64');
   const normals=Buffer.from(model.geometries[active[0].geometry].normals,'base64');
   const axis=[0,4,8].map(i=>normals.readFloatLE(i));
   const depths=[];
   for(let i=0;i<positions.length;i+=12)depths.push(axis.reduce((d,n,c)=>d+n*positions.readFloatLE(i+c*4),0));
   assert.ok(Math.max(...depths)-Math.min(...depths)<0.05,'The active screen must contain only the aperture plane');
  }
  if (id === 'macbook-pro-14' || id === 'macbook-pro-16') {
   const grille = model.materials.find(material => material.map?.file === 'speaker-grille.png');
   assert.ok(grille);
   assert.equal(grille.transparent, false);
   assert.equal(grille.opacity, 1);
   assert.equal(grille.map.wrap, 'repeat');
   assert.equal(grille.normalMap.wrap, 'repeat');
   assert.deepEqual(Object.keys(grille.finishes), m.phoneModel.colors);
   // Check the physical case edges in model space with the lid closed.
   const is14 = id === 'macbook-pro-14';
   const [baseName, lidName] = is14 ? ['Object_1', 'Object_36'] : ['Object_29', 'Object_46.001'];
   const closed = (joint.referenceValue - parameter.minimum) * Math.PI / 180;
   function positions(name, rotates) {
    const node = model.nodes.find(node => node.name.split(':')[0] === name);
    assert.equal(node.joint === joint.parameterID, rotates);
    const data = Buffer.from(model.geometries[node.geometry].positions, 'base64');
    return Array.from({length: data.length / 12}, (_, index) => {
     const y = data.readFloatLE(index * 12 + 4) - joint.pivot[1];
     const z = data.readFloatLE(index * 12 + 8) - joint.pivot[2];
     const angle = rotates ? closed : 0;
     const posedY = joint.pivot[1] + y * Math.cos(angle) - z * Math.sin(angle);
     const posedZ = joint.pivot[2] + y * Math.sin(angle) + z * Math.cos(angle);
     return [posedY, posedZ];
    });
   }
   const base = positions(baseName, false);
   const lid = positions(lidName, true);
   for (const edge of [Math.min, Math.max]) {
    assert.ok(Math.abs(edge(...base.map(p => p[1])) - edge(...lid.map(p => p[1]))) < 0.5,
     'Closed lid must align with the rear and front chassis edges within 0.5 mm');
   }
   const screen = moving.find(node => node.materials.some(index => model.materials[index].screen));
   assert.ok(Math.min(...positions(screen.name.split(':')[0], true).map(p => p[0])) > Math.max(...base.map(p => p[0])),
    'Closed display must clear the top of the base');
   if (!is14) {
    for (const name of ['Object_44', 'Object_58']) {
     assert.ok(moving.some(node => node.name.split(':')[0] === name), 'The hinge cover must follow the lid');
    }
   }
  }
  if(id==='pro-display-xdr'){
   assert.equal(m.version,'1.0.4');
   for(const material of model.materials)for(const field of ['map','normalMap'])
    if(material[field])assert.equal(material[field].wrap,'repeat');
   const backing=model.materials.find(m=>m.name==='WMVfKEaOnnOqrKt');
   const grille=model.materials.find(m=>m.name==='nssRtVtXVzpjuEl');
   assert.ok(backing.transparent && backing.map);
   assert.deepEqual(backing.finishes.silver,grille.finishes.silver);
   assert.ok(model.materials.find(m=>m.name==='hbSPEctpwjkeQeL').normalMap);
  }
 });
}
test('Duo opening angle is a backward-compatible optional manifest control',async()=>{
 const m=JSON.parse(await readFile('public/devices/iphone-duo/manifest.json','utf8'));
 assert.equal(m.rendererSchemaVersion,2);assert.equal(m.parameters[0].binding,'duoHinge');
 assert.equal(m.parameters[0].minimum,0);assert.equal(m.parameters[0].maximum,180);
});
