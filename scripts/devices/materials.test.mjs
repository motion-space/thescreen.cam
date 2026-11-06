import test from 'node:test';
import assert from 'node:assert/strict';
import {applyMaterialProfiles} from './materials.mjs';
const model={version:3,nodes:[{joint:'lid'}],materials:[{name:'shell',color:[.5,.5,.5],metalness:.85,roughness:.28,finishes:{silver:{color:[.5,.5,.5],roughness:.28,metalness:.85}}},{name:'screen',screen:{nativeUV:true},roughness:.5}]};
const catalog={schemaVersion:1,profiles:{matte:{roughness:.72,metalness:.85,clearcoat:0,clearcoatRoughness:1}}};
test('API profiles control base and every finish without changing geometry or screens',()=>{
 const result=applyMaterialProfiles(model,[{profile:'matte',materials:['shell']}],catalog);
 assert.equal(result.materials[0].roughness,.72);assert.equal(result.materials[0].finishes.silver.roughness,.72);
 assert.deepEqual(result.materials[1],model.materials[1]);assert.deepEqual(result.nodes,model.nodes);
 assert.deepEqual(result.materials[0].color,model.materials[0].color);assert.equal(model.materials[0].roughness,.28);
 assert.deepEqual(applyMaterialProfiles(model),model);
});
test('invalid material profiles and ambiguous/screen bindings fail before publication',()=>{
 for(const profile of [{roughness:NaN},{roughness:1.1},{roughness:-1},{unknown:1},{}])
  assert.throws(()=>applyMaterialProfiles(model,[{profile:'bad',materials:['shell']}],{schemaVersion:1,profiles:{bad:profile}}));
 for(const binding of [{profile:'missing',materials:['shell']},{profile:'matte',materials:['missing']},{profile:'matte',materials:['screen']},{profile:'matte',materials:['shell','shell']}])
  assert.throws(()=>applyMaterialProfiles(model,[binding],catalog));
});


test('published resource bytes cannot change until the device version is bumped',async()=>{
 const {mkdtemp,mkdir,writeFile,readFile,copyFile,rm}=await import('node:fs/promises');
 const {promisify}=await import('node:util');const {execFile}=await import('node:child_process');
 const run=promisify(execFile);const path=await import('node:path');
 await mkdir('tmp',{recursive:true});const root=await mkdtemp(path.resolve('tmp/material-immutability-'));
 try{
  await mkdir(path.join(root,'scripts/devices'),{recursive:true});
  await copyFile('scripts/build-devices.mjs',path.join(root,'scripts/build-devices.mjs'));
  await copyFile('scripts/devices/materials.mjs',path.join(root,'scripts/devices/materials.mjs'));
  const input=path.join(root,'content/devices/test-device/1.0.0');await mkdir(input,{recursive:true});
  const model={version:3,parameters:[],joints:[],nodes:[],materials:[{name:'shell',roughness:.28}]};
  const descriptor={id:'test-device',rendererSchemaVersion:3,colors:['silver'],finishes:[{id:'silver'}],screenSize:{width:1920,height:1080}};
  await writeFile(path.join(root,'content/devices/catalog.json'),JSON.stringify({schemaVersion:1,devices:[{id:'test-device',name:'Test',version:'1.0.0',rendererSchemaVersion:3,phoneModel:descriptor}]}));
  await writeFile(path.join(root,'content/devices/material-profiles.json'),JSON.stringify({schemaVersion:1,profiles:{}}));
  await writeFile(path.join(input,'model.json'),JSON.stringify(model));
  const script=path.join(root,'scripts/build-devices.mjs');await run(process.execPath,[script]);
  const pack=path.join(root,'public/devices/test-device/1.0.0/device.scdevice');const original=await readFile(pack);
  await run(process.execPath,[script]);assert.deepEqual(await readFile(pack),original);
  model.materials[0].roughness=.72;await writeFile(path.join(input,'model.json'),JSON.stringify(model));
  await assert.rejects(run(process.execPath,[script]),error=>error.stderr.includes('Immutable device package changed'));
  assert.deepEqual(await readFile(pack),original);
 }finally{await rm(root,{recursive:true,force:true});}
});
