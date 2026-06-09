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
const sourceRoot = path.join(repoRoot, "content", "bgm");
const sourceManifestPath = path.join(sourceRoot, "tracks.json");
const publicRoot = path.join(repoRoot, "public", "bgm");
const publicAudioRoot = path.join(publicRoot, "audio");
const publicPreviewRoot = path.join(publicRoot, "previews");
const publicManifestPath = path.join(publicRoot, "manifest.json");
const generatedDataPath = path.join(repoRoot, "src", "data", "generated", "bgm.json");

const staticAssetLimitBytes = 25 * 1024 * 1024;
const previewSeconds = 5;
const previewBitrate = "128k";
const allowedExtensions = new Set([".aac", ".aif", ".aiff", ".flac", ".m4a", ".mp3", ".ogg", ".wav"]);

const args = new Set(process.argv.slice(2));
const force = args.has("--force");
const allowLarge = args.has("--allow-large");

if (args.has("--help")) {
  console.log(`Usage: node scripts/build-bgm.mjs [--force] [--allow-large]

Options:
  --force        Rebuild copied tracks and previews even when the source hash matches.
  --allow-large  Allow files larger than Cloudflare's 25 MiB static asset limit.
`);
  process.exit(0);
}

const fail = (message) => {
  console.error(`BGM build failed: ${message}`);
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

const normalizeStringArray = (value, fieldName, trackId) => {
  if (value === undefined) return [];
  if (!Array.isArray(value) || value.some((item) => typeof item !== "string" || !item.trim())) {
    fail(`Track "${trackId}" field "${fieldName}" must be an array of non-empty strings.`);
  }

  return [...new Set(value.map((item) => item.trim()))];
};

const validateTrack = (track, ids) => {
  if (!track || typeof track !== "object" || Array.isArray(track)) {
    fail("Every track must be an object.");
  }

  const id = typeof track.id === "string" ? track.id.trim() : "";
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id)) {
    fail(`Invalid track id "${track.id}". Use lowercase kebab-case.`);
  }
  if (ids.has(id)) fail(`Duplicate track id "${id}".`);
  ids.add(id);

  const source = typeof track.source === "string" ? track.source.trim() : "";
  if (!source || source.startsWith("/") || source.includes("..")) {
    fail(`Track "${id}" has an invalid source path.`);
  }

  const sourcePath = path.join(sourceRoot, source);
  if (!existsSync(sourcePath)) {
    fail(`Track "${id}" source file does not exist: ${path.relative(repoRoot, sourcePath)}`);
  }

  const extension = path.extname(sourcePath).toLowerCase();
  if (!allowedExtensions.has(extension)) {
    fail(`Track "${id}" uses unsupported extension "${extension}".`);
  }

  const title = typeof track.title === "string" && track.title.trim() ? track.title.trim() : id;
  const tags = normalizeStringArray(track.tags, "tags", id);
  const keywords = normalizeStringArray(track.keywords, "keywords", id);

  return {
    extension,
    id,
    keywords,
    sourcePath,
    tags,
    title,
  };
};

const shouldReuseOutput = ({ currentHash, destinationPath, previousTrack }) => {
  if (force || !existsSync(destinationPath)) return false;
  if (previousTrack?.sourceSha256 === currentHash) return true;

  return hashFile(destinationPath) === currentHash;
};

const shouldReusePreview = ({ currentHash, destinationPath, previousTrack }) => {
  if (force || !existsSync(destinationPath)) return false;

  return previousTrack?.sourceSha256 === currentHash && previousTrack?.preview?.seconds === previewSeconds;
};

const copyTrack = ({ currentHash, destinationPath, previousTrack, sourcePath }) => {
  if (shouldReuseOutput({ currentHash, destinationPath, previousTrack })) {
    return "skipped";
  }

  mkdirSync(path.dirname(destinationPath), { recursive: true });
  copyFileSync(sourcePath, destinationPath);
  return "written";
};

const buildPreview = ({ currentHash, destinationPath, duration, previousTrack, sourcePath }) => {
  const seconds = Math.min(previewSeconds, duration);
  const start = Math.max(0, duration / 2 - seconds / 2);

  if (shouldReusePreview({ currentHash, destinationPath, previousTrack })) {
    return {
      seconds,
      start,
      status: "skipped",
    };
  }

  mkdirSync(path.dirname(destinationPath), { recursive: true });
  run("ffmpeg", [
    "-hide_banner",
    "-loglevel",
    "error",
    "-y",
    "-ss",
    String(start),
    "-i",
    sourcePath,
    "-t",
    String(seconds),
    "-map",
    "a:0",
    "-vn",
    "-codec:a",
    "libmp3lame",
    "-b:a",
    previewBitrate,
    destinationPath,
  ]);

  return {
    seconds,
    start,
    status: "written",
  };
};

requireCommand("ffmpeg");
requireCommand("ffprobe");

const sourceManifest = readJsonFile(sourceManifestPath);
if (!sourceManifest || !Array.isArray(sourceManifest.tracks)) {
  fail("content/bgm/tracks.json must contain a tracks array.");
}

const previousManifest = readJsonFile(publicManifestPath, { tracks: [] });
const previousTracks = new Map((previousManifest.tracks ?? []).map((track) => [track.id, track]));
const ids = new Set();
const tracks = [];
let latestSourceMtime = 0;

for (const rawTrack of sourceManifest.tracks) {
  const track = validateTrack(rawTrack, ids);
  const sourceStats = statSync(track.sourcePath);

  if (!allowLarge && sourceStats.size > staticAssetLimitBytes) {
    fail(
      `${path.relative(repoRoot, track.sourcePath)} is ${(sourceStats.size / 1024 / 1024).toFixed(1)} MiB, over the 25 MiB Cloudflare static asset limit. Move large BGM to R2 or rerun with --allow-large for local-only output.`,
    );
  }

  latestSourceMtime = Math.max(latestSourceMtime, sourceStats.mtimeMs);

  const sourceSha256 = hashFile(track.sourcePath);
  const previousTrack = previousTracks.get(track.id);
  const audioDestination = path.join(publicAudioRoot, `${track.id}${track.extension}`);
  const previewDestination = path.join(publicPreviewRoot, `${track.id}-preview.mp3`);
  const duration = getAudioDuration(track.sourcePath);
  const audioStatus = copyTrack({
    currentHash: sourceSha256,
    destinationPath: audioDestination,
    previousTrack,
    sourcePath: track.sourcePath,
  });
  const previewResult = buildPreview({
    currentHash: sourceSha256,
    destinationPath: previewDestination,
    duration,
    previousTrack,
    sourcePath: track.sourcePath,
  });
  const previewStats = statSync(previewDestination);

  tracks.push({
    id: track.id,
    title: track.title,
    tags: track.tags,
    keywords: track.keywords,
    duration: round(duration),
    durationMs: Math.round(duration * 1000),
    size: sourceStats.size,
    sourceSha256,
    audioUrl: toPublicPath(audioDestination),
    previewUrl: toPublicPath(previewDestination),
    downloadUrl: toPublicPath(audioDestination),
    preview: {
      start: round(previewResult.start),
      seconds: round(previewResult.seconds),
      size: previewStats.size,
    },
  });

  console.log(
    `${track.id}: audio ${audioStatus}, preview ${previewResult.status} (${round(previewResult.start)}s + ${round(previewResult.seconds)}s)`,
  );
}

const tags = [...new Set(tracks.flatMap((track) => track.tags))].sort((a, b) => a.localeCompare(b));
const keywords = [...new Set(tracks.flatMap((track) => track.keywords))].sort((a, b) => a.localeCompare(b));
const generatedAt = new Date(latestSourceMtime || Date.now()).toISOString();
const manifest = {
  version: 1,
  generatedAt,
  previewSeconds,
  tracks,
  tags,
  keywords,
};

writeJsonFile(publicManifestPath, manifest);
writeJsonFile(generatedDataPath, manifest);

console.log(`Wrote ${path.relative(repoRoot, publicManifestPath)}`);
console.log(`Wrote ${path.relative(repoRoot, generatedDataPath)}`);
