import assert from 'node:assert/strict';
import test from 'node:test';
import {createHash} from 'node:crypto';
import {readFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {canonicalBytes,parseManifest} from './transition-contract.mjs';
import {validateTransitionSources} from '../build-transitions.mjs';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
const sourceRoot=path.join(root,'content/transitions');
const archive=path.join(sourceRoot,'upstream/gl-transitions');
const effects=[
  {id:'gl-transitions.burn0',upstream:'burn0'},
  {id:'gl-transitions.edge-transition',upstream:'EdgeTransition'},
  {id:'gl-transitions.coord-from-in',upstream:'coord-from-in'},
  {id:'gl-transitions.butterfly-wave-scrawler',upstream:'ButterflyWaveScrawler'},
  {id:'gl-transitions.crosswarp',upstream:'crosswarp'},
];
const readJSON=async file=>JSON.parse(await readFile(file,'utf8'));
const loadEffect=async id=>parseManifest(await readFile(path.join(sourceRoot,'manifests',`${id}.json`)));
const withoutComments=source=>source.replace(/\/\*[\s\S]*?\*\//g,' ').replace(/\/\/[^\n]*/g,' ');
const parameter=(effect,key)=>{
  const result=effect.parameterDefinitions.find(item=>item.key===key);
  assert(result,`${effect.id} must expose ${key}`);
  return result;
};

for(const effect of effects) {
  test(`${effect.id} is self-contained with editable scalar controls matching its shader interface`,async()=>{
    const {manifest,sizeBytes}=await loadEffect(effect.id);
    assert.equal(manifest.id,effect.id);
    assert.equal(manifest.schemaVersion,2);
    assert.equal(manifest.kind,'shader');
    assert.equal(manifest.shader.language,'glsl');
    assert.deepEqual(manifest.requiredCapabilities,['transitions.shader.v1']);
    assert(manifest.parameterDefinitions.length>=2);
    // Parsing validates finite bounds/defaults/options and the portable package size.
    assert.deepEqual(parseManifest(canonicalBytes(manifest)).manifest,manifest);
    assert(sizeBytes<=256*1024);
    const source=withoutComments(manifest.shader.source);
    const uniforms=[...source.matchAll(/\buniform\s+(float|int|bool)\s+([A-Za-z_][A-Za-z0-9_]*)\s*;/g)];
    assert.equal(uniforms.length,(source.match(/\buniform\b/g)??[]).length,'Every uniform must be a supported scalar declaration');
    assert.deepEqual(uniforms.map(match=>match[2]).sort(),manifest.parameterDefinitions.map(item=>item.key).sort());
    for(const control of manifest.parameterDefinitions) {
      assert(control.step>0 && control.minimum<control.maximum);
      assert(control.defaultValue>=control.minimum && control.defaultValue<=control.maximum);
    }
    assert.doesNotMatch(source,/^\s*#\s*include\b/m,'Packages cannot depend on external includes');
    assert.doesNotMatch(source,/\b(?:sampler2D|sampler3D|samplerCube|texture2d|texture3d)\b/,'Packages must use the two supplied scene samplers');
    assert.doesNotMatch(source,/(?:https?|file):\/\//i,'Executable shader source cannot fetch external resources');
  });

  test(`${effect.id} preserves original author and complete MIT terms with verifiable upstream provenance`,async()=>{
    const {manifest}=await loadEffect(effect.id);
    const original=await readFile(path.join(archive,`${effect.upstream}.glsl`));
    const provenance=await readJSON(path.join(archive,`${effect.upstream}.provenance.json`));
    const author=provenance.upstreamAuthor??provenance.author;
    assert.equal(typeof author,'string');
    assert(author.length>0);
    assert(manifest.author.includes(author),'Do not replace the upstream author with the publisher');
    const headerAuthor=original.toString('utf8').match(/^\s*\/\/\s*Author:\s*(.+)$/m)?.[1]?.trim();
    assert.equal(headerAuthor,author);
    assert(manifest.shader.source.includes(`Author: ${author}`));
    assert.equal(createHash('sha256').update(original).digest('hex'),provenance.sourceSHA256);
    const sourceURL=new URL(provenance.downloadURL??provenance.sourceURL);
    assert.equal(sourceURL.origin,'https://raw.githubusercontent.com');
    assert.equal(sourceURL.pathname,`/gl-transitions/gl-transitions/master/transitions/${effect.upstream}.glsl`);
    assert.equal(sourceURL.search,'');
    assert.equal(provenance.license,'MIT');
    assert.equal(manifest.license,await readFile(path.join(archive,'LICENSE'),'utf8'));
    assert.match(manifest.license,/Permission is hereby granted/);
    assert.match(manifest.license,/THE SOFTWARE IS PROVIDED "AS IS"/);
    const adaptations=provenance.adaptation??provenance.adaptations;
    assert(Array.isArray(adaptations)&&adaptations.length>0,'Source adaptations must remain documented');
  });
}

test('burn, outline and warp controls stay inside meaningful finite geometry ranges',async()=>{
  const manifests=Object.fromEntries(await Promise.all(effects.map(async effect=>[effect.id,(await loadEffect(effect.id)).manifest])));
  const burn=manifests['gl-transitions.burn0'];
  assert(parameter(burn,'noiseScale').minimum>0);
  assert(parameter(burn,'edgeWidth').minimum>0);
  assert(parameter(burn,'edgeWidth').maximum<=1);
  assert(parameter(burn,'burnIntensity').minimum>=0);
  assert(parameter(burn,'burnHue').minimum>=0&&parameter(burn,'burnHue').maximum<=360);
  const edge=manifests['gl-transitions.edge-transition'];
  assert(parameter(edge,'edge_thickness').minimum>0);
  assert(parameter(edge,'edge_thickness').maximum<=1);
  assert(parameter(edge,'edge_brightness').minimum>=0);
  const butterfly=manifests['gl-transitions.butterfly-wave-scrawler'];
  assert(parameter(butterfly,'waves').minimum>0);
  for(const [id,key] of [
    ['gl-transitions.edge-transition','edgeMix'],
    ['gl-transitions.coord-from-in','distortionStrength'],
    ['gl-transitions.butterfly-wave-scrawler','colorSeparation'],
    ['gl-transitions.crosswarp','warpStrength'],
    ['gl-transitions.crosswarp','centerX'],
    ['gl-transitions.crosswarp','centerY'],
  ]) {
    const p=parameter(manifests[id],key);
    assert(p.minimum>=0&&p.maximum<=1,`${id}.${key} must stay normalized`);
  }
  for(const manifest of Object.values(manifests)) assert(manifest.shader.maximumScale>=1&&manifest.shader.maximumScale<=2);
  for(const [id,key,count] of [['gl-transitions.coord-from-in','coordinateChannels',3],['gl-transitions.crosswarp','direction',4]]) {
    const p=parameter(manifests[id],key);
    assert.equal(p.options.length,count);
    assert.equal(p.step,1);
    assert(p.options.every(option=>Number.isInteger(option.value)));
    assert(p.options.some(option=>option.value===p.defaultValue));
  }
});

test('active and shader-migration source catalogs contain the five new effects without losing prior entries',async()=>{
  const active=await readJSON(path.join(sourceRoot,'catalog.json'));
  const candidate=await readJSON(path.join(sourceRoot,'shader-v1.catalog.json'));
  assert.equal(active.effects.length,14);
  assert.equal(candidate.effects.length,14);
  assert.equal(new Set(active.effects).size,active.effects.length);
  assert.equal(new Set(candidate.effects).size,candidate.effects.length);
  for(const effect of effects) {
    assert(active.effects.includes(`${effect.id}.json`));
    assert(candidate.effects.includes(`${effect.id}.json`));
  }
  // Only the pending glitch implementation differs; all third-party additions
  // must remain available when the shader migration catalog is promoted.
  const normalized=entries=>entries.map(file=>file==='screencam.glitch-v2.json'?'screencam.glitch.json':file).sort();
  assert.deepEqual(normalized(candidate.effects),normalized(active.effects));
  const [activeValidation,candidateValidation]=await Promise.all([
    validateTransitionSources({directory:root}),
    validateTransitionSources({directory:root,catalogFile:path.join(sourceRoot,'shader-v1.catalog.json')}),
  ]);
  for(const validation of [activeValidation,candidateValidation]) {
    assert.equal(validation.signed,false);
    for(const effect of effects) {
      const entry=validation.effects.find(item=>item.id===effect.id);
      assert(entry);
      const parsed=await loadEffect(effect.id);
      assert.equal(entry.sha256,parsed.sha256);
      assert.equal(entry.sizeBytes,parsed.sizeBytes);
      assert.deepEqual(entry.requiredCapabilities,['transitions.shader.v1']);
    }
  }
});
