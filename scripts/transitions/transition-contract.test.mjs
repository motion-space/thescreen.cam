import assert from 'node:assert/strict';
import test from 'node:test';
import { canonicalBytes, parseManifest, templateManifest, shaderTemplateManifest, SHADER_RESERVED_NAMES, MAX_SHADER_BYTES, KINDS, MAX_BYTES } from './transition-contract.mjs';

for (const kind of KINDS) {
  test(`round-trip portable ${kind} package`, () => {
    const manifest = templateManifest(`example.${kind}`,kind);
    const bytes = canonicalBytes(manifest);
    const parsed = parseManifest(bytes);
    assert.deepEqual(parsed.manifest,manifest);
    assert.equal(parsed.sha256.length,64);
    assert.equal(parsed.sizeBytes,bytes.length);
    assert.deepEqual(canonicalBytes({...manifest,name:manifest.name}),bytes);
  });
}

test('composable recipe supports bounded new combinations', () => {
  const manifest = templateManifest('example.neon-slide');
  manifest.recipe.stages=[{kind:'horizontalTear',intensity:0.2,colorHex:'#00FFFF'},{kind:'colorOverlay',intensity:0.3,colorHex:'#FF00AA'}];
  assert.equal(parseManifest(canonicalBytes(manifest)).manifest.recipe.stages.length,2);
});

const mutations = [
  ['executable fields', value => {value.script='alert(1)';}],
  ['unknown operator', value => {value.recipe.stages=[{kind:'customShader',intensity:0.2,colorHex:'#FFFFFF'}];}],
  ['too many stages', value => {value.recipe.stages=Array.from({length:5},()=>({kind:'blur',intensity:0.2,colorHex:'#FFFFFF'}));}],
  ['unsupported capabilities', value => {value.requiredCapabilities=['transitions.scene.v999'];}],
  ['path traversal ids', value => {value.id='../escape';}],
  ['newline in id', value => {value.id='example.test\n';}],
  ['newline in version', value => {value.version='1.0.0\n';}],
  ['newline in color', value => {value.recipe.flashColorHex='#FFFFFF\n';}],
  ['mutable latest version', value => {value.version='latest';}],
  ['out of range zoom', value => {value.recipe.zoomScale=3;}],
  ['nonfinite blur', value => {value.recipe.blurMultiplier=NaN;}],
  ['invalid color', value => {value.recipe.flashColorHex='url(https://example.com)';}],
  ['unused parameter', value => {value.parameterDefinitions[0].key='code';}],
  ['duplicate parameter', value => {value.parameterDefinitions.push(value.parameterDefinitions[0]);}],
  ['nonfinite default', value => {value.parameterDefinitions[0].defaultValue=Infinity;}],
  ['zero range', value => {value.parameterDefinitions[0].maximum=0;}],
  ['fractional direction', value => {value.parameterDefinitions[0].defaultValue=0.5;}],
  ['duplicate option', value => {value.parameterDefinitions[0].options.push(value.parameterDefinitions[0].options[0]);}],
  ['zero step', value => {value.parameterDefinitions[0].step=0;}],
];
for (const [name, mutate] of mutations) test(`reject ${name}`, () => {
  const manifest=templateManifest('example.test');mutate(manifest);
  assert.throws(()=>canonicalBytes(manifest));
});
test('reject oversized files and invalid UTF-8', () => {
  assert.throws(()=>parseManifest(Buffer.alloc(MAX_BYTES+1)),/bytes/);
  assert.throws(()=>parseManifest(Buffer.from([0xFF])));
});
test('exact byte changes change package digest', () => {
  const bytes=canonicalBytes(templateManifest('example.test'));
  assert.notEqual(parseManifest(bytes).sha256,parseManifest(Buffer.concat([bytes,Buffer.from('\n')])).sha256);
});

for (const language of ['glsl','metal']) {
  test(`shader-v1 ${language} source survives canonical packing verbatim`, () => {
    const manifest = shaderTemplateManifest('example.custom',language);
    manifest.parameterDefinitions=[{key:'Seed',name:'Seed',defaultValue:2.31,minimum:-10,maximum:100,step:0.01,options:[]}];
    const parsed=parseManifest(canonicalBytes(manifest));
    assert.deepEqual(parsed.manifest,manifest);
    assert.equal(parsed.manifest.requiredCapabilities[0],'transitions.shader.v1');
    assert.equal(parsed.manifest.kind,'shader');
  });
}

for (const [name,mutate] of [
  ['legacy kind in schema 2', m=>{m.kind='glitch';}],
  ['shader under schema 1', m=>{m.schemaVersion=1;}],
  ['scene capability on shader', m=>{m.requiredCapabilities=['transitions.scene.v1'];}],
  ['unsupported shader language',m=>{m.shader.language='javascript';}],
  ['empty source',m=>{m.shader.source=' \n';}],
  ['NUL source',m=>{m.shader.source+='\0';}],
  ['source over UTF-8 byte limit',m=>{m.shader.source='界'.repeat(Math.ceil(MAX_SHADER_BYTES/3));}],
  ['unknown shader fields',m=>{m.shader.sourceURL='https://example.com/code';}],
  ['obsolete sample radius',m=>{m.shader.sampleRadius=1;}],
  ['underestimated scale below one',m=>{m.shader.maximumScale=0.9;}],
  ['excessive scale',m=>{m.shader.maximumScale=2.01;}],
  ['too many shader parameters',m=>{m.parameterDefinitions=Array.from({length:17},(_,i)=>({key:`amount${i}`,name:'Amount',minimum:0,maximum:1,defaultValue:0.5,step:0.01,options:[]}));}],
  ['unbounded parameter range',m=>{m.parameterDefinitions=[{key:'amount',name:'Amount',minimum:0,maximum:1e7,defaultValue:0.5,step:0.01,options:[]}];}],
]) test(`reject shader ${name}`,()=>{
  const manifest=shaderTemplateManifest('example.custom');mutate(manifest);
  assert.throws(()=>canonicalBytes(manifest));
});

for (const name of [...SHADER_RESERVED_NAMES,'gl_custom','screencam_amount','a__b','1foo','foo\n','vec3','dmat4x3','float4','a'.repeat(65)]) {
  test(`reject reserved or invalid shader parameter ${JSON.stringify(name)}`,()=>{
    const manifest=shaderTemplateManifest('example.custom');
    manifest.parameterDefinitions=[{key:name,name:'Parameter',minimum:0,maximum:1,defaultValue:0.5,step:0.01,options:[]}];
    assert.throws(()=>canonicalBytes(manifest),/parameter/);
  });
}

test('shader source limit measures UTF-8 bytes and preserves GLSL loops and macros',()=>{
  const manifest=shaderTemplateManifest('example.custom');
  manifest.shader.source='//'+ 'a'.repeat(MAX_SHADER_BYTES-2);
  assert.equal(parseManifest(canonicalBytes(manifest)).manifest.shader.source,manifest.shader.source);
  manifest.shader.source+='a';
  assert.throws(()=>canonicalBytes(manifest),/source/);
});
