import assert from 'node:assert/strict';
import test from 'node:test';
import {mkdir,mkdtemp,readFile,rm,writeFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';
import {parseManifest} from './transition-contract.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
const cli=path.join(path.dirname(fileURLToPath(import.meta.url)),'transition-pack.mjs');
const run=(...args)=>spawnSync(process.execPath,[cli,...args],{encoding:'utf8'});

async function fixture(t) {
  await mkdir(path.join(root,'tmp'),{recursive:true});
  const directory=await mkdtemp(path.join(root,'tmp/transition-authoring-'));
  t.after(()=>rm(directory,{recursive:true,force:true}));
  return directory;
}

test('pack-shader embeds local source exactly and never overwrites output',async t=>{
  const dir=await fixture(t),metadata=path.join(dir,'metadata.json'),source=path.join(dir,'source.glsl'),output=path.join(dir,'effect.sctransition');
  let result=run('init-shader','example.custom',metadata);
  assert.equal(result.status,0,result.stderr);
  const text='// Custom source and macro\n#define T 0.3\nuniform float Amount;\nvec4 transition(vec2 uv) { return mix(getFromColor(uv),getToColor(uv),progress * Amount); }\n';
  await writeFile(source,text);
  const manifest=JSON.parse(await readFile(metadata,'utf8'));
  manifest.parameterDefinitions=[{key:'Amount',name:'Amount',minimum:-3,maximum:4,defaultValue:1,step:0.1,options:[]}];
  await writeFile(metadata,JSON.stringify(manifest));
  result=run('pack-shader',metadata,source,output);assert.equal(result.status,0,result.stderr);
  const bytes=await readFile(output),info=JSON.parse(result.stdout);
  assert.equal(parseManifest(bytes).manifest.shader.source,text);
  assert.equal(info.sha256,parseManifest(bytes).sha256);
  result=run('pack-shader',metadata,source,output);assert.equal(result.status,1);assert.match(result.stderr,/EEXIST/);assert.equal(result.stdout,'');
  assert.deepEqual(await readFile(output),bytes);
});

test('pack-shader validates source encoding, extension and metadata language before writing',async t=>{
  const dir=await fixture(t),metadata=path.join(dir,'metadata.json'),source=path.join(dir,'source.glsl'),output=path.join(dir,'effect.sctransition');
  assert.equal(run('init-shader','example.custom',metadata,'metal').status,0);
  await writeFile(source,'float4 transition(float2 uv) { return getFromColor(uv); }');
  let result=run('pack-shader',metadata,source,output);assert.equal(result.status,1);assert.match(result.stderr,/language/);
  const metal=path.join(dir,'source.metal');await writeFile(metal,Buffer.from([0xFF]));
  result=run('pack-shader',metadata,metal,output);assert.equal(result.status,1);assert.equal(result.stdout,'');
  await assert.rejects(readFile(output),{code:'ENOENT'});
});
