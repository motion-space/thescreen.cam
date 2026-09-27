import { createHash, createPrivateKey, createPublicKey, sign, verify } from 'node:crypto';
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { canonicalBytes, parseManifest } from './transitions/transition-contract.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const baseURL = 'https://thescreen.cam';
const jsonBytes = value => Buffer.from(`${JSON.stringify(value, null, 2)}\n`);
const sha256 = bytes => createHash('sha256').update(bytes).digest('hex');
const fail = message => { throw new Error(message); };
const sameBytes = (a, b) => Buffer.compare(a, b) === 0;
async function readJSON(file) { return JSON.parse(await readFile(file, 'utf8')); }
async function maybeJSON(file, fallback) { try { return await readJSON(file); } catch (error) { if (error.code === 'ENOENT') return fallback; throw error; } }
function publicKeyFromRaw(raw) {
  const bytes = Buffer.from(raw, 'base64');
  if (bytes.length !== 32) fail('Ed25519 public key must be 32 bytes');
  return createPublicKey({key:Buffer.concat([Buffer.from('302a300506032b6570032100','hex'),bytes]),format:'der',type:'spki'});
}

/** Validate a reviewable publication candidate without reading private keys or writing/signing outputs. */
export async function validateTransitionSources({directory = root, sourceDirectory = path.join(directory, 'content/transitions'), catalogFile = path.join(sourceDirectory, 'catalog.json')} = {}) {
  const source = await readJSON(catalogFile);
  if (source.schemaVersion !== 1 || typeof source.revision !== 'string' || !source.revision.trim() || source.revision.length > 128 || !Array.isArray(source.effects) || source.effects.length > 256) fail('Invalid source catalog');
  const lock = await maybeJSON(path.join(directory, 'content/transitions/releases.json'), {effects:{}});
  const ids = new Set(), effects = [];
  for (const file of source.effects) {
    if (typeof file !== 'string' || path.basename(file) !== file || !file.endsWith('.json')) fail('Manifest source must be a direct JSON filename');
    const bytes = await readFile(path.join(sourceDirectory, 'manifests', file));
    const {manifest, sha256:digest, sizeBytes} = parseManifest(bytes);
    if (!sameBytes(bytes, canonicalBytes(manifest))) fail(`${file} must use canonical authoring pack output`);
    if (ids.has(manifest.id)) fail(`Duplicate catalog effect ${manifest.id}`);
    ids.add(manifest.id);
    // Authorship is independent of the ScreenCam publisher's pinned signing key.
    if (!manifest.author.trim() || !manifest.license.trim()) fail(`${file}: author and redistribution license are required`);
    const identity = `${manifest.id}@${manifest.version}`;
    if (lock.effects[identity] && lock.effects[identity] !== digest) fail(`${identity} is immutable; publish a new version`);
    effects.push({id:manifest.id, version:manifest.version, schemaVersion:manifest.schemaVersion, requiredCapabilities:manifest.requiredCapabilities, sha256:digest, sizeBytes});
  }
  return {mode:'validated-sources', revision:source.revision, effects, signed:false};
}

export async function buildTransitions({check = false, keyFile, directory = root} = {}) {
  const sourceRoot = path.join(directory, 'content/transitions');
  const source = await readJSON(path.join(sourceRoot, 'catalog.json'));
  if (source.schemaVersion !== 1 || typeof source.revision !== 'string' || !source.revision.trim() || source.revision.length > 128 || !Array.isArray(source.effects) || source.effects.length > 256) fail('Invalid source catalog');
  const trustedKeys = await readJSON(path.join(sourceRoot, 'trusted-keys.json'));
  const signingKey = trustedKeys.keys.find(key => key.id === source.signingKeyID && key.algorithm === 'Ed25519');
  if (!signingKey) fail('The catalog signing key is not pinned');
  const publicKey = publicKeyFromRaw(signingKey.publicKey);
  let privateKey;
  if (!check) {
    if (!keyFile) fail('Set TRANSITION_SIGNING_KEY_FILE or pass --signing-key <external-private-key.pem>');
    privateKey = createPrivateKey(await readFile(keyFile));
    if (privateKey.asymmetricKeyType !== 'ed25519' || !createPublicKey(privateKey).equals(publicKey)) fail('Signing key does not match the pinned publisher public key');
  }
  const existingEnvelope = await maybeJSON(path.join(directory,'src/data/generated/transitions.json'), null);
  let existingCatalog;
  if (existingEnvelope) {
    const existingPublic = trustedKeys.keys.find(key => key.id === existingEnvelope.signingKeyID);
    const payload = Buffer.from(existingEnvelope.payload ?? '', 'base64');
    if (!existingPublic || !verify(null,payload,publicKeyFromRaw(existingPublic.publicKey),Buffer.from(existingEnvelope.signature ?? '', 'base64'))) fail('Existing catalog publisher signature is invalid');
    existingCatalog = JSON.parse(payload.toString('utf8'));
  }
  const lockPath = path.join(sourceRoot,'releases.json');
  const lock = await maybeJSON(lockPath,{schemaVersion:1,effects:{},catalogRevisions:{}});
  const nextLock = structuredClone(lock);
  const outputs = [];
  const entries = [];
  const ids = new Set();
  for (const file of source.effects) {
    if (typeof file !== 'string' || path.basename(file) !== file || !file.endsWith('.json')) fail('Manifest source must be a direct JSON filename');
    const bytes = await readFile(path.join(sourceRoot,'manifests',file));
    const {manifest,sha256:digest,sizeBytes} = parseManifest(bytes);
    if (!sameBytes(bytes,canonicalBytes(manifest))) fail(`${file} must use canonical authoring pack output`);
    if (ids.has(manifest.id)) fail(`Duplicate catalog effect ${manifest.id}`);
    ids.add(manifest.id);
    // Authorship is independent of the ScreenCam publisher's pinned signing key.
    if (!manifest.author.trim() || !manifest.license.trim()) fail(`${file}: author and redistribution license are required`);
    const identity = `${manifest.id}@${manifest.version}`;
    if (lock.effects[identity] && lock.effects[identity] !== digest) fail(`${identity} is immutable; publish a new version`);
    nextLock.effects[identity] = digest;
    const relative = `transitions/${manifest.id}/${manifest.version}/${digest}.sctransition`;
    const manifestURL = `${baseURL}/${relative}`;
    const previous = existingCatalog?.effects.find(entry => entry.id === manifest.id && entry.version === manifest.version && entry.sha256 === digest && entry.signingKeyID === source.signingKeyID);
    const signature = privateKey ? sign(null, bytes, privateKey).toString('base64') : previous?.signature;
    if (!signature || !verify(null,bytes,publicKey,Buffer.from(signature,'base64'))) fail(`${identity} has no valid publisher signature; regenerate with the signing key`);
    entries.push({id:manifest.id,version:manifest.version,name:manifest.name,summary:manifest.summary,manifestURL,sha256:digest,sizeBytes,requiredCapabilities:manifest.requiredCapabilities,previewDefinition:manifest,signingKeyID:source.signingKeyID,signature});
    outputs.push([path.join(directory,'public',relative),bytes]);
  }
  const catalog = {schemaVersion:1,revision:source.revision,effects:entries};
  const payload = jsonBytes(catalog);
  const payloadDigest = sha256(payload);
  if (lock.catalogRevisions[source.revision] && lock.catalogRevisions[source.revision] !== payloadDigest) fail(`Catalog revision ${source.revision} is immutable; increment revision`);
  nextLock.catalogRevisions[source.revision] = payloadDigest;
  const signature = privateKey ? sign(null,payload,privateKey).toString('base64') : existingEnvelope?.signature;
  if (!signature || !verify(null,payload,publicKey,Buffer.from(signature,'base64'))) fail('Catalog changed; increment revision and sign the new catalog');
  const envelope = {schemaVersion:1,signingKeyID:source.signingKeyID,payload:payload.toString('base64'),signature};
  if (jsonBytes(envelope).length > 2 * 1024 * 1024) fail('Signed catalog exceeds the app 2 MiB download limit');
  outputs.push([path.join(directory,'src/data/generated/transitions.json'),jsonBytes(envelope)]);
  outputs.push([path.join(directory,'public/transitions/index.json'),jsonBytes(envelope)]);
  outputs.push([lockPath,jsonBytes(nextLock)]);
  for (const [file,bytes] of outputs) {
    if (check) {
      let saved; try { saved = await readFile(file); } catch { fail(`Missing generated output ${path.relative(directory,file)}`); }
      if (!sameBytes(saved,bytes)) fail(`Stale generated output ${path.relative(directory,file)}`);
    } else {
      await mkdir(path.dirname(file),{recursive:true});
      await writeFile(file,bytes);
    }
  }
  // Old immutable objects stay addressable even when no longer recommended by the catalog.
  for (const [identity,digest] of Object.entries(nextLock.effects)) {
    const split = identity.lastIndexOf('@');
    const file = path.join(directory,'public/transitions',identity.slice(0,split),identity.slice(split+1),`${digest}.sctransition`);
    const archived = parseManifest(await readFile(file));
    if (archived.sha256 !== digest) fail(`Corrupt immutable package ${identity}`);
  }
  return {effects:entries.length,revision:source.revision,mode:check?'checked':'built'};
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  let check = false, validateSources = false, sourceDirectory, catalogFile, keyFile = process.env.TRANSITION_SIGNING_KEY_FILE;
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--check') check = true;
    else if (args[i] === '--validate-sources') validateSources = true;
    else if (args[i] === '--source-catalog' && args[i+1]) catalogFile = path.resolve(args[++i]);
    else if (args[i] === '--source-directory' && args[i+1]) sourceDirectory = path.resolve(args[++i]);
    else if (args[i] === '--signing-key' && args[i+1]) keyFile = args[++i];
    else throw new Error(`Unknown argument ${args[i]}`);
  }
  if ((sourceDirectory || catalogFile) && !validateSources) throw new Error('--source-directory/--source-catalog require --validate-sources');
  if (validateSources && (check || args.includes('--signing-key'))) throw new Error('--validate-sources cannot sign or check generated outputs');
  const operation = validateSources ? validateTransitionSources({sourceDirectory,catalogFile}) : buildTransitions({check,keyFile});
  operation.then(result=>console.log(JSON.stringify(result))).catch(error=>{console.error(`transitions: ${error.message}`);process.exitCode=1;});
}
