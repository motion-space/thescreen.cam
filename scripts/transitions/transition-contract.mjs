import { createHash } from 'node:crypto';

export const CAPABILITY = 'transitions.scene.v1';
export const SHADER_CAPABILITY = 'transitions.shader.v1';
export const MAX_SHADER_BYTES = 128 * 1024;
export const MAX_BYTES = 256 * 1024;
export const KINDS = ['blurSlide', 'fade', 'slide', 'blurZoom', 'slideCover', 'parallaxPush', 'glitch', 'flash'];
export const STAGES = ['blur', 'colorOverlay', 'zoom', 'horizontalTear'];
export const PARAMETER_KEYS = ['blurStrength', 'direction', 'dimming', 'parallaxStrength', 'intensity'];
const idPattern = /^[a-zA-Z0-9][a-zA-Z0-9._-]{0,127}$/;
const versionPattern = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/;
const shaderIdentifierPattern = /^[A-Za-z_][A-Za-z0-9_]{0,63}$/;
export const SHADER_RESERVED_NAMES = new Set(["progress", "ratio", "seed", "seedVector", "resolution", "from", "to", "uv", "getFromColor", "getToColor", "transition", "void", "bool", "int", "uint", "float", "half", "double", "char", "short", "long", "true", "false", "if", "else", "for", "while", "do", "break", "continue", "return", "switch", "case", "default", "struct", "class", "enum", "typedef", "const", "constexpr", "static", "uniform", "varying", "attribute", "in", "out", "inout", "precision", "highp", "mediump", "lowp", "layout", "centroid", "flat", "smooth", "noperspective", "patch", "sample", "coherent", "volatile", "restrict", "readonly", "writeonly", "buffer", "shared", "atomic_uint", "sampler", "sampler2D", "sampler3D", "samplerCube", "texture2d", "texture3d", "namespace", "using", "template", "typename", "thread", "threadgroup", "device", "constant", "kernel", "vertex", "fragment", "auto", "sizeof", "discard"]);
export function isShaderParameterName(value) {
  return exactMatch(shaderIdentifierPattern, value) && !SHADER_RESERVED_NAMES.has(value) && !value.includes('__') && !/^(gl_|screencam_)/.test(value) && !/^([biud]?vec[234]|d?mat[234](x[234])?|(bool|int|uint|float|half|double|char|short|long)[234](x[234])?)$/.test(value);
}
const colorPattern = /^#[0-9a-fA-F]{6}$/;
const exactMatch = (pattern, value) => typeof value === 'string' && pattern.exec(value)?.[0] === value;

function assert(condition, message) { if (!condition) throw new Error(message); }
function object(value, fields, label) {
  assert(value && typeof value === 'object' && !Array.isArray(value), `${label} must be an object`);
  for (const key of Object.keys(value)) assert(fields.includes(key), `${label}.${key} is unsupported`);
  for (const key of fields) assert(Object.hasOwn(value, key), `${label}.${key} is required`);
}
function string(value, max, label, empty = true) {
  assert(typeof value === 'string' && value.length <= max && (empty || value.trim().length > 0), `${label} must be ${empty ? 'a' : 'a nonempty'} string of at most ${max} characters`);
}
function range(value, min, max, label) { assert(typeof value === 'number' && Number.isFinite(value) && value >= min && value <= max, `${label} must be finite and between ${min} and ${max}`); }
function array(value, max, label) { assert(Array.isArray(value) && value.length <= max, `${label} must be an array of at most ${max} items`); }

/** Validate portable scene-v1 and shader-v1 manifests. GPU compilation is a separate runtime check. */
export function validateManifest(value) {
  const isShader = value?.schemaVersion === 2;
  object(value, ['schemaVersion', 'id', 'version', 'name', 'summary', 'kind', 'parameterDefinitions', 'recipe', 'requiredCapabilities', 'author', 'license', ...(isShader ? ['shader'] : [])], 'manifest');
  assert(value.schemaVersion === 1 || isShader, 'schemaVersion must be 1 or 2');
  assert(exactMatch(idPattern, value.id), 'Invalid effect id');
  assert(exactMatch(versionPattern, value.version) && value.version.length <= 32, 'version must be numeric SemVer x.y.z without leading zeros');
  string(value.name, 128, 'name', false);
  string(value.summary, 2048, 'summary');
  string(value.author, 256, 'author');
  string(value.license, 2048, 'license');
  assert(isShader ? value.kind === 'shader' : KINDS.includes(value.kind), 'Unsupported effect kind');
  if (isShader) {
    object(value.shader, ['language', 'source', 'maximumScale'], 'shader');
    assert(['glsl', 'metal'].includes(value.shader.language), 'Unsupported shader language');
    string(value.shader.source, MAX_SHADER_BYTES, 'shader.source', false);
    assert(Buffer.byteLength(value.shader.source, 'utf8') <= MAX_SHADER_BYTES, `shader.source exceeds ${MAX_SHADER_BYTES} bytes`);
    assert(!value.shader.source.includes('\0'), 'shader.source cannot contain NUL');
    range(value.shader.maximumScale, 1, 2, 'shader.maximumScale');
  }
  array(value.requiredCapabilities, 8, 'requiredCapabilities');
  const capability = isShader ? SHADER_CAPABILITY : CAPABILITY;
  assert(value.requiredCapabilities.includes(capability) && value.requiredCapabilities.every(item => item === capability), `requiredCapabilities must contain only ${capability}`);
  assert(new Set(value.requiredCapabilities).size === value.requiredCapabilities.length, 'Duplicate capabilities');
  array(value.parameterDefinitions, isShader ? 16 : 12, 'parameterDefinitions');
  const keys = new Set();
  for (const parameter of value.parameterDefinitions) {
    object(parameter, ['key', 'name', 'defaultValue', 'minimum', 'maximum', 'step', 'options'], 'parameter');
    assert((isShader ? isShaderParameterName(parameter.key) : PARAMETER_KEYS.includes(parameter.key)) && !keys.has(parameter.key), `Unsupported or duplicate parameter ${parameter.key}`);
    keys.add(parameter.key);
    string(parameter.name, 128, 'parameter.name', false);
    const upper = isShader ? 1_000_000 : parameter.key === 'direction' ? 3 : 1;
    range(parameter.minimum, isShader ? -1_000_000 : 0, upper, 'parameter.minimum');
    range(parameter.maximum, parameter.minimum, upper, 'parameter.maximum');
    assert(parameter.minimum < parameter.maximum, 'Parameter minimum must be less than maximum');
    range(parameter.defaultValue, parameter.minimum, parameter.maximum, 'parameter.defaultValue');
    range(parameter.step, isShader ? Number.MIN_VALUE : Number.EPSILON, upper, 'parameter.step');
    array(parameter.options, 16, 'parameter.options');
    const optionValues = new Set();
    for (const option of parameter.options) {
      object(option, ['value', 'label'], 'option');
      range(option.value, parameter.minimum, parameter.maximum, 'option.value');
      string(option.label, 128, 'option.label', false);
      assert(!optionValues.has(option.value), 'Duplicate parameter option');
      optionValues.add(option.value);
    }
    if (parameter.options.length) assert(optionValues.has(parameter.defaultValue), 'Parameter default must be a declared option');
    if (!isShader && parameter.key === 'direction') {
      assert(Number.isInteger(parameter.minimum) && Number.isInteger(parameter.maximum) && Number.isInteger(parameter.defaultValue), 'Direction values must be integers');
      assert(parameter.step === 1 && parameter.options.length > 0 && parameter.options.every(option => Number.isInteger(option.value)), 'Direction requires integer options and step 1');
    }
  }
  object(value.recipe, ['easing', 'blurMultiplier', 'zoomScale', 'flashColorHex', 'stages'], 'recipe');
  assert(['linear', 'smoothstep', 'easeInOut'].includes(value.recipe.easing), 'Unsupported easing');
  range(value.recipe.blurMultiplier, 0, 2, 'recipe.blurMultiplier');
  range(value.recipe.zoomScale, 1, 2, 'recipe.zoomScale');
  assert(exactMatch(colorPattern, value.recipe.flashColorHex), 'Invalid flashColorHex');
  array(value.recipe.stages, 4, 'recipe.stages');
  for (const stage of value.recipe.stages) {
    object(stage, ['kind', 'intensity', 'colorHex'], 'stage');
    assert(STAGES.includes(stage.kind), 'Unsupported stage kind');
    range(stage.intensity, 0, 1, 'stage.intensity');
    assert(exactMatch(colorPattern, stage.colorHex), 'Invalid stage colorHex');
  }
  return value;
}

export function parseManifest(bytes) {
  assert(bytes.length > 0 && bytes.length <= MAX_BYTES, `Manifest must be 1...${MAX_BYTES} bytes`);
  // Roundtrip check also rejects invalid UTF-8 before a platform decoder can repair it differently.
  const text = new TextDecoder('utf-8', { fatal: true }).decode(bytes);
  const manifest = validateManifest(JSON.parse(text));
  return { manifest, sha256: createHash('sha256').update(bytes).digest('hex'), sizeBytes: bytes.length };
}

export function canonicalBytes(manifest) {
  validateManifest(manifest);
  const order = value => Array.isArray(value) ? value.map(order) : value && typeof value === 'object'
    ? Object.fromEntries(Object.keys(value).sort().map(key => [key, order(value[key])])) : value;
  const bytes = Buffer.from(`${JSON.stringify(order(manifest), null, 2)}\n`, 'utf8');
  assert(bytes.length <= MAX_BYTES, `Manifest exceeds ${MAX_BYTES} bytes`);
  return bytes;
}

export function templateManifest(id, kind = 'slide') {
  assert(KINDS.includes(kind), 'Unsupported effect kind');
  const direction = {key:'direction',name:'Direction',defaultValue:0,minimum:0,maximum:3,step:1,options:[{value:0,label:'Left'},{value:1,label:'Right'},{value:2,label:'Up'},{value:3,label:'Down'}]};
  const strength = (key, name, defaultValue) => ({key,name,defaultValue,minimum:0,maximum:1,step:0.01,options:[]});
  const parameters = {
    blurSlide:[strength('blurStrength','Blur strength',0.5),direction], fade:[], slide:[direction],
    blurZoom:[strength('blurStrength','Blur strength',0.5)], slideCover:[direction,strength('dimming','Covered area dimming',0.35)],
    parallaxPush:[direction,strength('parallaxStrength','Parallax strength',0.5)], glitch:[strength('intensity','Intensity',0.5)], flash:[strength('intensity','Intensity',0.8)]
  };
  return validateManifest({schemaVersion:1,id,version:'1.0.0',name:'My transition',summary:'Describe the visual result.',kind,parameterDefinitions:parameters[kind],recipe:{easing:'smoothstep',blurMultiplier:1,zoomScale:1.3,flashColorHex:'#FFFFFF',stages:[]},requiredCapabilities:[CAPABILITY],author:'Your name',license:'CC0-1.0'});
}


export function shaderTemplateManifest(id, language = 'glsl') {
  assert(['glsl', 'metal'].includes(language), 'Unsupported shader language');
  const vector = language === 'glsl' ? 'vec' : 'float';
  const manifest = templateManifest(id, 'fade');
  return validateManifest({...manifest, schemaVersion:2, kind:'shader', requiredCapabilities:[SHADER_CAPABILITY],
    shader:{language, source:`${vector}4 transition(${vector}2 uv) {\n    return mix(getFromColor(uv), getToColor(uv), progress);\n}\n`, maximumScale:1}});
}
