#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  statSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourceRoot = path.join(repoRoot, "content", "click-sounds");
const sourceManifestPath = path.join(sourceRoot, "sounds.json");
const publicRoot = path.join(repoRoot, "public", "click-sounds");
const publicAudioRoot = path.join(publicRoot, "audio");
const publicManifestPath = path.join(publicRoot, "manifest.json");
const generatedDataPath = path.join(repoRoot, "src", "data", "generated", "click-sounds.json");

const staticAssetLimitBytes = 25 * 1024 * 1024;
const allowedExtensions = new Set([".aac", ".aif", ".aiff", ".flac", ".m4a", ".mp3", ".ogg", ".wav"]);

const args = new Set(process.argv.slice(2));
const force = args.has("--force");
const allowLarge = args.has("--allow-large");

if (args.has("--help")) {
  console.log(`Usage: node scripts/build-click-sounds.mjs [--force] [--allow-large]

Options:
  --force        Rebuild copied sounds even when the source hash matches.
  --allow-large  Allow files larger than Cloudflare's 25 MiB static asset limit.
`);
  process.exit(0);
}

const fail = (message) => {
  console.error(`Click sound build failed: ${message}`);
  process.exit(1);
};

const run = (command, commandArgs, options = {}) => {
  const result = spawnSync(command, commandArgs, {
    encoding: "utf8",
    stdio: options.capture ? ["ignore", "pipe", "pipe"] : "inherit",
  });

  if (result.status !== 0) {
    const stderr = result.stderr?.trim();
    throw new Error(stderr || `${command} exited with ${result.status ?? "unknown status"}`);
  }

  return result.stdout ?? "";
};

const requireCommand = (command) => {
  const result = spawnSync("sh", ["-c", `command -v ${command}`], {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });

  if (result.status !== 0) {
    fail(`Missing required command "${command}". Install ffmpeg locally before running this script.`);
  }
};

const readJsonFile = (filePath, fallback = null) => {
  if (!existsSync(filePath)) return fallback;
  return JSON.parse(readFileSync(filePath, "utf8"));
};

const writeJsonFile = (filePath, value) => {
  mkdirSync(path.dirname(filePath), { recursive: true });
  writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
};

const toPublicPath = (filePath) => `/${path.relative(path.join(repoRoot, "public"), filePath).split(path.sep).join("/")}`;

const hashFile = (filePath) => {
  const hash = createHash("sha256");
  hash.update(readFileSync(filePath));
  return hash.digest("hex");
};

const round = (value, digits = 3) => Number(value.toFixed(digits));

const getAudioDuration = (filePath) => {
  const output = run(
    "ffprobe",
    ["-v", "error", "-print_format", "json", "-show_format", "-show_streams", filePath],
    { capture: true },
  );
  const probe = JSON.parse(output);
  const audioStream = probe.streams?.find((stream) => stream.codec_type === "audio");
  const duration = Number.parseFloat(probe.format?.duration ?? audioStream?.duration ?? "");

  if (!Number.isFinite(duration) || duration <= 0) {
    fail(`Unable to read duration for ${path.relative(repoRoot, filePath)}`);
  }

  return duration;
};

const normalizeStringArray = (value, fieldName, soundId) => {
  if (value === undefined) return [];
  if (!Array.isArray(value) || value.some((item) => typeof item !== "string" || !item.trim())) {
    fail(`Sound "${soundId}" field "${fieldName}" must be an array of non-empty strings.`);
  }

  return [...new Set(value.map((item) => item.trim()))];
};

const validateSound = (sound, ids) => {
  if (!sound || typeof sound !== "object" || Array.isArray(sound)) {
    fail("Every sound must be an object.");
  }

  const id = typeof sound.id === "string" ? sound.id.trim() : "";
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id)) {
    fail(`Invalid sound id "${sound.id}". Use lowercase kebab-case.`);
  }
  if (ids.has(id)) fail(`Duplicate sound id "${id}".`);
  ids.add(id);

  const source = typeof sound.source === "string" ? sound.source.trim() : "";
  if (!source || source.startsWith("/") || source.includes("..")) {
    fail(`Sound "${id}" has an invalid source path.`);
  }

  const sourcePath = path.join(sourceRoot, source);
  if (!existsSync(sourcePath)) {
    fail(`Sound "${id}" source file does not exist: ${path.relative(repoRoot, sourcePath)}`);
  }

  const extension = path.extname(sourcePath).toLowerCase();
  if (!allowedExtensions.has(extension)) {
    fail(`Sound "${id}" uses unsupported extension "${extension}".`);
  }

  const title = typeof sound.title === "string" && sound.title.trim() ? sound.title.trim() : id;
  const tags = normalizeStringArray(sound.tags, "tags", id);
  const keywords = normalizeStringArray(sound.keywords, "keywords", id);

  return {
    extension,
    id,
    keywords,
    sourcePath,
    tags,
    title,
  };
};

const shouldReuseOutput = ({ currentHash, destinationPath, previousSound }) => {
  if (force || !existsSync(destinationPath)) return false;
  if (previousSound?.sourceSha256 === currentHash) return true;

  return hashFile(destinationPath) === currentHash;
};

const copySound = ({ currentHash, destinationPath, previousSound, sourcePath }) => {
  if (shouldReuseOutput({ currentHash, destinationPath, previousSound })) {
    return "skipped";
  }

  mkdirSync(path.dirname(destinationPath), { recursive: true });
  copyFileSync(sourcePath, destinationPath);
  return "written";
};

requireCommand("ffprobe");

const sourceManifest = readJsonFile(sourceManifestPath);
if (!sourceManifest || !Array.isArray(sourceManifest.sounds)) {
  fail("content/click-sounds/sounds.json must contain a sounds array.");
}

const previousManifest = readJsonFile(publicManifestPath, { sounds: [] });
const previousSounds = new Map((previousManifest.sounds ?? []).map((sound) => [sound.id, sound]));
const ids = new Set();
const sounds = [];
let latestSourceMtime = 0;

for (const rawSound of sourceManifest.sounds) {
  const sound = validateSound(rawSound, ids);
  const sourceStats = statSync(sound.sourcePath);

  if (!allowLarge && sourceStats.size > staticAssetLimitBytes) {
    fail(
      `${path.relative(repoRoot, sound.sourcePath)} is ${(sourceStats.size / 1024 / 1024).toFixed(1)} MiB, over the 25 MiB Cloudflare static asset limit. Move large sounds to R2 or rerun with --allow-large for local-only output.`,
    );
  }

  latestSourceMtime = Math.max(latestSourceMtime, sourceStats.mtimeMs);

  const sourceSha256 = hashFile(sound.sourcePath);
  const previousSound = previousSounds.get(sound.id);
  const audioDestination = path.join(publicAudioRoot, `${sound.id}${sound.extension}`);
  const duration = getAudioDuration(sound.sourcePath);
  const audioStatus = copySound({
    currentHash: sourceSha256,
    destinationPath: audioDestination,
    previousSound,
    sourcePath: sound.sourcePath,
  });

  sounds.push({
    id: sound.id,
    title: sound.title,
    tags: sound.tags,
    keywords: sound.keywords,
    duration: round(duration),
    durationMs: Math.round(duration * 1000),
    size: sourceStats.size,
    sourceSha256,
    audioUrl: toPublicPath(audioDestination),
    downloadUrl: toPublicPath(audioDestination),
  });

  console.log(`${sound.id}: audio ${audioStatus}`);
}

const tags = [...new Set(sounds.flatMap((sound) => sound.tags))].sort((a, b) => a.localeCompare(b));
const keywords = [...new Set(sounds.flatMap((sound) => sound.keywords))].sort((a, b) => a.localeCompare(b));
const generatedAt = new Date(latestSourceMtime || Date.now()).toISOString();
const manifest = {
  version: 1,
  generatedAt,
  sounds,
  tags,
  keywords,
};

writeJsonFile(publicManifestPath, manifest);
writeJsonFile(generatedDataPath, manifest);

console.log(`Wrote ${path.relative(repoRoot, publicManifestPath)}`);
console.log(`Wrote ${path.relative(repoRoot, generatedDataPath)}`);
