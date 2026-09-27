#!/usr/bin/env node
import { createPrivateKey, createPublicKey, sign } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { canonicalBytes, parseManifest, templateManifest, shaderTemplateManifest, MAX_SHADER_BYTES } from './transition-contract.mjs';

const usage = `ScreenCam transition authoring (Node.js 20+, no dependencies)
  node transition-pack.mjs init-shader <id> <output.json> [glsl|metal]
  node transition-pack.mjs pack-shader <metadata.json> <source.glsl|source.metal> <effect.sctransition>
  node transition-pack.mjs init <id> <output.json> [kind]
  node transition-pack.mjs validate <manifest.json|effect.sctransition>
  node transition-pack.mjs pack <manifest.json> <effect.sctransition>
  node transition-pack.mjs sign <effect.sctransition> <private-key.pem> <key-id> <signature.json>
Legacy scene-v1 kinds: blurSlide fade slide blurZoom slideCover parallaxPush glitch flash
All generated working files should be placed under your project's tmp/ directory.
`;

async function createFile(file, bytes) {
  await mkdir(path.dirname(path.resolve(file)), {recursive:true});
  // Do not accidentally overwrite an immutable package or an author's edits.
  await writeFile(file, bytes, {flag:'wx'});
}

async function main() {
  const [command, ...args] = process.argv.slice(2);
  if (!command || command === '--help' || command === '-h') { console.log(usage); return; }
  if (command === 'init-shader' && (args.length === 2 || args.length === 3)) {
    const bytes = canonicalBytes(shaderTemplateManifest(args[0], args[2]));
    await createFile(args[1], bytes);
    console.log(JSON.stringify({output:path.resolve(args[1]), ...metadata(bytes)}));
  } else if (command === 'pack-shader' && args.length === 3) {
    if (path.extname(args[2]) !== '.sctransition') throw new Error('Package output must have a .sctransition extension');
    const {manifest} = parseManifest(await readFile(args[0]));
    if (manifest.schemaVersion !== 2 || manifest.kind !== 'shader') throw new Error('pack-shader requires schemaVersion 2 shader metadata');
    const languages = {'.glsl':'glsl', '.metal':'metal'};
    const language = languages[path.extname(args[1])];
    if (!language) throw new Error('Shader source must have a .glsl or .metal extension');
    if (manifest.shader.language !== language) throw new Error('Source extension must match shader.language');
    const sourceBytes = await readFile(args[1]);
    if (sourceBytes.length > MAX_SHADER_BYTES) throw new Error(`Shader source exceeds ${MAX_SHADER_BYTES} bytes`);
    manifest.shader.source = new TextDecoder('utf-8', {fatal:true}).decode(sourceBytes);
    const bytes = canonicalBytes(manifest);
    await createFile(args[2], bytes);
    console.log(JSON.stringify({output:path.resolve(args[2]), ...metadata(bytes)}));
  } else if (command === 'init' && (args.length === 2 || args.length === 3)) {
    const bytes = canonicalBytes(templateManifest(args[0], args[2]));
    await createFile(args[1], bytes);
    console.log(JSON.stringify({output:path.resolve(args[1]), ...metadata(bytes)}));
  } else if (command === 'validate' && args.length === 1) {
    console.log(JSON.stringify({valid:true, ...metadata(await readFile(args[0]))}));
  } else if (command === 'pack' && args.length === 2) {
    if (path.extname(args[1]) !== '.sctransition') throw new Error('Package output must have a .sctransition extension');
    const {manifest} = parseManifest(await readFile(args[0]));
    const bytes = canonicalBytes(manifest);
    await createFile(args[1], bytes);
    console.log(JSON.stringify({output:path.resolve(args[1]), ...metadata(bytes)}));
  } else if (command === 'sign' && args.length === 4) {
    const bytes = await readFile(args[0]);
    const info = metadata(bytes);
    if (!/^[a-zA-Z0-9][a-zA-Z0-9._-]{0,127}$/.test(args[2])) throw new Error('Invalid signing key ID');
    const key = createPrivateKey(await readFile(args[1]));
    if (key.asymmetricKeyType !== 'ed25519') throw new Error('Signing key must be Ed25519');
    const result = {...info, signingKeyID:args[2], signature:sign(null, bytes, key).toString('base64'),publicKey:createPublicKey(key).export({type:'spki',format:'der'}).subarray(-32).toString('base64')};
    await createFile(args[3], `${JSON.stringify(result,null,2)}\n`);
    console.log(JSON.stringify(result));
  } else { throw new Error(usage); }
}
function metadata(bytes) { const {manifest,sha256,sizeBytes}=parseManifest(bytes);return {id:manifest.id,version:manifest.version,sha256,sizeBytes}; }
main().catch(error => { console.error(`transition-pack: ${error.message}`);process.exitCode=1; });
