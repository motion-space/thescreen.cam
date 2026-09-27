import assert from 'node:assert/strict';
import test from 'node:test';
import { createPublicKey, generateKeyPairSync, verify } from 'node:crypto';
import { cp, mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { buildTransitions, validateTransitionSources } from '../build-transitions.mjs';
import { canonicalBytes, templateManifest, shaderTemplateManifest } from './transition-contract.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
const writeJSON=(file,value)=>writeFile(file,JSON.stringify(value,null,2)+'\n');

async function fixture(t) {
  await mkdir(path.join(root,'tmp'),{recursive:true});
  const directory=await mkdtemp(path.join(root,'tmp/transition-tests-'));
  t.after(()=>rm(directory,{recursive:true,force:true}));
  const source=path.join(directory,'content/transitions');
  await mkdir(path.join(source,'manifests'),{recursive:true});
  const {privateKey,publicKey}=generateKeyPairSync('ed25519');
  const keyFile=path.join(directory,'signing-key.pem');
  await writeFile(keyFile,privateKey.export({type:'pkcs8',format:'pem'}),{mode:0o600});
  await writeJSON(path.join(source,'trusted-keys.json'),{schemaVersion:1,keys:[{id:'test',algorithm:'Ed25519',publicKey:publicKey.export({type:'spki',format:'der'}).subarray(-32).toString('base64')}]});
  const manifest=templateManifest('screencam.test');manifest.author='ScreenCam';
  const manifestFile=path.join(source,'manifests/test.json');await writeFile(manifestFile,canonicalBytes(manifest));
  const catalog={schemaVersion:1,revision:'test.1',signingKeyID:'test',effects:['test.json']};
  const catalogFile=path.join(source,'catalog.json');await writeJSON(catalogFile,catalog);
  return {directory,keyFile,publicKey,manifest,manifestFile,catalog,catalogFile};
}

test('publish authenticates discovery and exact immutable package bytes',async t=>{
  const f=await fixture(t);
  assert.equal((await buildTransitions(f)).effects,1);
  await buildTransitions({...f,check:true,keyFile:undefined});
  const envelope=JSON.parse(await readFile(path.join(f.directory,'src/data/generated/transitions.json')));
  const payload=Buffer.from(envelope.payload,'base64');
  assert(verify(null,payload,f.publicKey,Buffer.from(envelope.signature,'base64')));
  const entry=JSON.parse(payload).effects[0];
  const packageBytes=await readFile(path.join(f.directory,'public',new URL(entry.manifestURL).pathname));
  assert.deepEqual(entry.previewDefinition,JSON.parse(packageBytes));
  assert(verify(null,packageBytes,f.publicKey,Buffer.from(entry.signature,'base64')));
  const tampered=Buffer.concat([packageBytes,Buffer.from('\n')]);
  assert(!verify(null,tampered,f.publicKey,Buffer.from(entry.signature,'base64')));
});

test('same ID/version cannot change and revisions require an explicit bump',async t=>{
  const f=await fixture(t);await buildTransitions(f);
  f.manifest.recipe.zoomScale=1.8;
  await writeFile(f.manifestFile,canonicalBytes(f.manifest));
  await assert.rejects(buildTransitions(f),/immutable; publish a new version/);
  f.manifest.version='1.0.1';await writeFile(f.manifestFile,canonicalBytes(f.manifest));
  await assert.rejects(buildTransitions(f),/Catalog revision.*immutable/);
  f.catalog.revision='test.2';await writeJSON(f.catalogFile,f.catalog);
  await buildTransitions(f);await buildTransitions({...f,check:true,keyFile:undefined});
  const lock=JSON.parse(await readFile(path.join(f.directory,'content/transitions/releases.json')));
  assert.deepEqual(Object.keys(lock.effects),['screencam.test@1.0.0','screencam.test@1.0.1']);
});

test('reject forged catalog and corrupted immutable objects',async t=>{
  const f=await fixture(t);await buildTransitions(f);
  const file=path.join(f.directory,'src/data/generated/transitions.json');
  const original=await readFile(file);
  const envelope=JSON.parse(original);envelope.payload=Buffer.from('{}').toString('base64');
  await writeJSON(file,envelope);
  await assert.rejects(buildTransitions({...f,check:true}),/publisher signature is invalid/);
  await writeFile(file,original);
  const entry=JSON.parse(Buffer.from(JSON.parse(original).payload,'base64')).effects[0];
  await writeFile(path.join(f.directory,'public',new URL(entry.manifestURL).pathname),'{}');
  await assert.rejects(buildTransitions({...f,check:true}),/Stale generated output/);
});

test('author CLI writes reviewable packages, preserves existing files, reports errors on stderr',async t=>{
  const f=await fixture(t);
  const cli=path.join(root,'scripts/transitions/transition-pack.mjs');
  const file=path.join(f.directory,'author.json'),pack=path.join(f.directory,'author.sctransition');
  const run=(...args)=>spawnSync(process.execPath,[cli,...args],{encoding:'utf8'});
  let result=run('init','example.test',file,'glitch');assert.equal(result.status,0);assert.equal(JSON.parse(result.stdout).id,'example.test');
  result=run('pack',file,pack);assert.equal(result.status,0);
  result=run('validate',pack);assert.equal(result.status,0);assert.equal(JSON.parse(result.stdout).valid,true);
  result=run('pack',file,pack);assert.equal(result.status,1);assert.equal(result.stdout,'');assert.match(result.stderr,/EEXIST/);
  const signature=path.join(f.directory,'signature.json');result=run('sign',pack,f.keyFile,'test',signature);assert.equal(result.status,0);
  assert(verify(null,await readFile(pack),f.publicKey,Buffer.from(JSON.parse(result.stdout).signature,'base64')));
});


test('shader source candidates validate without publishing and schema 2 survives signed catalogs',async t=>{
  const f=await fixture(t);
  const manifest=shaderTemplateManifest('screencam.test');manifest.author='ScreenCam';
  manifest.parameterDefinitions=[{key:'Seed',name:'Pattern seed',defaultValue:2.31,minimum:0,maximum:100,step:0.01,options:[]}];
  manifest.shader.source='uniform float Seed;\nvec4 transition(vec2 uv) { return mix(getFromColor(uv),getToColor(uv),progress); }';
  await writeFile(f.manifestFile,canonicalBytes(manifest));
  const result=await validateTransitionSources(f);
  assert.equal(result.signed,false);assert.equal(result.effects[0].schemaVersion,2);
  assert.deepEqual(result.effects[0].requiredCapabilities,['transitions.shader.v1']);
  await assert.rejects(readFile(path.join(f.directory,'src/data/generated/transitions.json')),{code:'ENOENT'});
  await buildTransitions(f);await buildTransitions({...f,check:true,keyFile:undefined});
  const envelope=JSON.parse(await readFile(path.join(f.directory,'src/data/generated/transitions.json')));
  const entry=JSON.parse(Buffer.from(envelope.payload,'base64')).effects[0];
  assert.equal(entry.previewDefinition.shader.source,manifest.shader.source);
  assert.equal(entry.previewDefinition.kind,'shader');
});

test('source-only review enforces immutable published versions before signing',async t=>{
  const f=await fixture(t);await buildTransitions(f);
  const shader=shaderTemplateManifest('screencam.test');shader.author='ScreenCam';
  await writeFile(f.manifestFile,canonicalBytes(shader));
  await assert.rejects(validateTransitionSources(f),/immutable/);
  shader.version='2.0.0';await writeFile(f.manifestFile,canonicalBytes(shader));
  assert.equal((await validateTransitionSources(f)).effects[0].version,'2.0.0');
  await buildTransitions({...f,check:true}).then(()=>assert.fail('unsigned modified source cannot pass publication checks'),()=>{});
});

// Use the actual redistributable shader rather than changing the author's identity
// to match the publisher. The signing key authenticates the publisher separately.
test('publishing third-party FilmBurn preserves source, attribution, MIT and existing immutable packages',async t=>{
  const f=await fixture(t);
  await buildTransitions(f);
  const envelopeFile=path.join(f.directory,'src/data/generated/transitions.json');
  const previousEnvelope=JSON.parse(await readFile(envelopeFile));
  const oldEntry=JSON.parse(Buffer.from(previousEnvelope.payload,'base64')).effects[0];
  const oldPackageFile=path.join(f.directory,'public',new URL(oldEntry.manifestURL).pathname);
  const oldPackageBytes=await readFile(oldPackageFile);
  const oldLock=JSON.parse(await readFile(path.join(f.directory,'content/transitions/releases.json')));

  const sourceBytes=await readFile(path.join(root,'content/transitions/manifests/gl-transitions.film-burn.json'));
  const film=JSON.parse(sourceBytes);
  assert.equal(film.id,'gl-transitions.film-burn');
  assert.match(film.author,/Anastasia Dunbar/);
  assert.notEqual(film.author,'ScreenCam');
  assert.match(film.license,/MIT License/);
  assert.match(film.license,/Permission is hereby granted/);
  assert.match(film.license,/THE SOFTWARE IS PROVIDED "AS IS"/);
  assert.match(film.shader.source,/Author: Anastasia Dunbar/);
  assert.match(film.shader.source,/uniform float Seed/);
  assert.equal(film.schemaVersion,2);
  assert.equal(film.kind,'shader');
  assert.deepEqual(film.requiredCapabilities,['transitions.shader.v1']);
  assert.deepEqual(sourceBytes,canonicalBytes(film));
  const filmFile='film-burn.json';
  await writeFile(path.join(f.directory,'content/transitions/manifests',filmFile),sourceBytes);
  f.catalog.effects.push(filmFile);
  f.catalog.revision='test.film-burn';
  await writeJSON(f.catalogFile,f.catalog);

  const validation=await validateTransitionSources(f);
  assert.equal(validation.effects.length,2);
  assert.equal(validation.signed,false);
  assert.equal((await buildTransitions(f)).effects,2);
  await buildTransitions({...f,check:true,keyFile:undefined});
  const envelope=JSON.parse(await readFile(envelopeFile));
  const payload=Buffer.from(envelope.payload,'base64');
  assert(verify(null,payload,f.publicKey,Buffer.from(envelope.signature,'base64')));
  const entries=JSON.parse(payload).effects;
  const entry=entries.find(item=>item.id==='gl-transitions.film-burn');
  assert(entry);
  assert.equal(entry.signingKeyID,'test');
  assert.deepEqual(entry.requiredCapabilities,['transitions.shader.v1']);
  assert.deepEqual(entry.previewDefinition,film);
  const publishedBytes=await readFile(path.join(f.directory,'public',new URL(entry.manifestURL).pathname));
  assert.deepEqual(publishedBytes,sourceBytes);
  assert(verify(null,publishedBytes,f.publicKey,Buffer.from(entry.signature,'base64')));
  assert.deepEqual(await readFile(oldPackageFile),oldPackageBytes);
  assert.deepEqual(entries.find(item=>item.id===oldEntry.id),oldEntry);
  const lock=JSON.parse(await readFile(path.join(f.directory,'content/transitions/releases.json')));
  for (const [identity,digest] of Object.entries(oldLock.effects)) assert.equal(lock.effects[identity],digest);
  for (const [revision,digest] of Object.entries(oldLock.catalogRevisions)) assert.equal(lock.catalogRevisions[revision],digest);
  assert.equal(lock.effects[`${film.id}@${film.version}`],entry.sha256);
});

for (const field of ['author','license']) {
  for (const value of ['', ' \n\t']) {
    test(`publisher rejects ${field} ${value===''?'empty':'whitespace'} before writing outputs`,async t=>{
      const f=await fixture(t);
      f.manifest[field]=value;
      await writeFile(f.manifestFile,canonicalBytes(f.manifest));
      await assert.rejects(validateTransitionSources(f),/author|attribution|publisher|license/i);
      await assert.rejects(buildTransitions(f),/author|attribution|publisher|license/i);
      await assert.rejects(readFile(path.join(f.directory,'src/data/generated/transitions.json')),{code:'ENOENT'});
      await assert.rejects(readFile(path.join(f.directory,'content/transitions/releases.json')),{code:'ENOENT'});
    });
  }
}
