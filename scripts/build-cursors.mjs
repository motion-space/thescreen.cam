#!/usr/bin/env node
import { createHash } from "node:crypto";
import {
  copyFileSync,
  existsSync,
  lstatSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const contentRoot = path.join(repoRoot, "content", "cursors");
const catalogPath = path.join(contentRoot, "catalog.json");
const sourcePacksRoot = path.join(contentRoot, "packs");
const publicRoot = path.join(repoRoot, "public", "cursor-style-packs");
const publicManifestPath = path.join(publicRoot, "manifest.json");
const generatedDataPath = path.join(repoRoot, "src", "data", "generated", "cursors.json");

const catalogSchemaVersion = 3;
const manifestSchemaVersion = 2;
const requiredNameLocales = [
  "en",
  "zh-Hans",
  "zh-Hant",
  "ja",
  "ko",
  "de",
  "es",
  "fr",
  "pt-BR",
  "it",
];
const maximumManifestBytes = 64 * 1024;
const maximumAssetBytes = 4 * 1024 * 1024;
const maximumPackAssetBytes = 32 * 1024 * 1024;
const maximumCellSize = 256;
const cursorOrder = [
  "arrow",
  "text",
  "pointer",
  "crosshair",
  "open-hand",
  "closed-hand",
  "resize-ew",
  "resize-ns",
  "resize-nwse",
  "resize-nesw",
  "not-allowed",
];

const args = new Set(process.argv.slice(2));
const checkOnly = args.has("--check");

if (args.has("--help")) {
  console.log(`Usage: node scripts/build-cursors.mjs [--check]

Options:
  --check  Validate sources and fail when generated files are missing or stale.
`);
  process.exit(0);
}

const fail = (message) => {
  console.error(`Cursor catalog build failed: ${message}`);
  process.exit(1);
};

const relative = (filePath) => path.relative(repoRoot, filePath).split(path.sep).join("/");
const sha256 = (data) => createHash("sha256").update(data).digest("hex");
const readJson = (filePath) => {
  try {
    return JSON.parse(readFileSync(filePath, "utf8"));
  } catch (error) {
    fail(`Could not read ${relative(filePath)}: ${error.message}`);
  }
};
const stableJson = (value) => `${JSON.stringify(value, null, 2)}\n`;
const writeJson = (filePath, value) => {
  mkdirSync(path.dirname(filePath), { recursive: true });
  writeFileSync(filePath, stableJson(value));
};
const isPlainObject = (value) =>
  value !== null && typeof value === "object" && !Array.isArray(value);
const assertInteger = (value, description, minimum, maximum) => {
  if (!Number.isInteger(value) || value < minimum || value > maximum) {
    fail(`${description} must be an integer from ${minimum} through ${maximum}.`);
  }
};
const assertOptionalString = (value, description, maximumLength) => {
  if (value === undefined || value === null) return;
  if (typeof value !== "string" || !value.trim() || value.length > maximumLength) {
    fail(`${description} must be a non-empty string no longer than ${maximumLength} characters.`);
  }
};
const assertRegularFile = (filePath, description) => {
  if (!existsSync(filePath)) fail(`Missing ${description}: ${relative(filePath)}`);
  const stats = lstatSync(filePath);
  if (!stats.isFile() || stats.isSymbolicLink()) {
    fail(`${description} must be a regular file: ${relative(filePath)}`);
  }
  return stats;
};

function inspectPng(data, description) {
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  if (data.length < 33 || !data.subarray(0, 8).equals(signature)) {
    fail(`${description} is not a PNG.`);
  }

  let offset = 8;
  let width;
  let height;
  let colorType;
  let hasTransparency = false;
  let hasIEND = false;

  while (offset + 12 <= data.length) {
    const length = data.readUInt32BE(offset);
    const chunkEnd = offset + 12 + length;
    if (chunkEnd > data.length) fail(`${description} has a truncated PNG chunk.`);
    const type = data.toString("ascii", offset + 4, offset + 8);

    if (type === "IHDR") {
      if (length !== 13 || width !== undefined) fail(`${description} has an invalid PNG header.`);
      width = data.readUInt32BE(offset + 8);
      height = data.readUInt32BE(offset + 12);
      colorType = data[offset + 17];
      hasTransparency = colorType === 4 || colorType === 6;
    } else if (type === "tRNS") {
      hasTransparency = true;
    } else if (type === "acTL") {
      fail(`${description} must not be animated.`);
    } else if (type === "IEND") {
      hasIEND = true;
      offset = chunkEnd;
      break;
    }

    offset = chunkEnd;
  }

  if (!width || !height || !hasIEND || offset !== data.length) {
    fail(`${description} has an invalid PNG structure.`);
  }
  if (!hasTransparency) fail(`${description} must support transparency.`);
  return { height, width };
}

function validateManifest(packagePath, packageReference, seenIds) {
  const packageStats = lstatSync(packagePath);
  if (!packageStats.isDirectory() || packageStats.isSymbolicLink()) {
    fail(`Cursor package must be a real directory: ${packageReference}`);
  }

  const rootEntries = readdirSync(packagePath).sort();
  if (rootEntries.length !== 2 || rootEntries[0] !== "cursors" || rootEntries[1] !== "manifest.json") {
    fail(`${packageReference} may contain only manifest.json and cursors/.`);
  }

  const manifestPath = path.join(packagePath, "manifest.json");
  const manifestStats = assertRegularFile(manifestPath, "cursor manifest");
  if (manifestStats.size <= 0 || manifestStats.size > maximumManifestBytes) {
    fail(`${relative(manifestPath)} is outside the 1–${maximumManifestBytes} byte manifest limit.`);
  }
  const manifest = readJson(manifestPath);
  if (!isPlainObject(manifest)) fail(`${relative(manifestPath)} must contain a JSON object.`);
  if (
    manifest.schemaVersion !== manifestSchemaVersion ||
    manifest.minimumReaderSchemaVersion !== manifestSchemaVersion
  ) {
    fail(`${packageReference} must use cursor manifest schema ${manifestSchemaVersion}.`);
  }

  const id = typeof manifest.id === "string" ? manifest.id.trim() : "";
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id)) {
    fail(`${packageReference} has invalid id "${manifest.id}". Use lowercase kebab-case.`);
  }
  if (seenIds.has(id)) fail(`Duplicate cursor id "${id}".`);
  seenIds.add(id);
  if (path.basename(packagePath) !== `${id}.sccursor`) {
    fail(`Cursor package directory must be named ${id}.sccursor.`);
  }

  if (typeof manifest.name !== "string" || !manifest.name.trim() || manifest.name.length > 80) {
    fail(`Cursor "${id}" must have a name no longer than 80 characters.`);
  }
  if (
    !isPlainObject(manifest.localizedNames) ||
    Object.keys(manifest.localizedNames).sort().join("\n") !== [...requiredNameLocales].sort().join("\n") ||
    manifest.localizedNames.en !== manifest.name ||
    requiredNameLocales.some((locale) => {
      const value = manifest.localizedNames[locale];
      return typeof value !== "string" || value !== value.trim() || !value || value.length > 80;
    })
  ) {
    fail(
      `Cursor "${id}" localizedNames must contain all supported locales, with en equal to name.`,
    );
  }
  if (
    typeof manifest.version !== "string" ||
    !/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?(?:\+[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?$/.test(manifest.version)
  ) {
    fail(`Cursor "${id}" must use a Semantic Versioning 2.0.0 version.`);
  }
  assertOptionalString(manifest.description, `Cursor "${id}" description`, 500);
  assertOptionalString(manifest.author, `Cursor "${id}" author`, 120);
  assertOptionalString(manifest.license, `Cursor "${id}" license`, 80);

  if (
    !Array.isArray(manifest.tags) ||
    manifest.tags.length > 16 ||
    manifest.tags.some((tag) => typeof tag !== "string" || !tag.trim() || tag.length > 40)
  ) {
    fail(`Cursor "${id}" tags must be an array of at most 16 short non-empty strings.`);
  }
  if (!Array.isArray(manifest.assets) || manifest.assets.length === 0) {
    fail(`Cursor "${id}" must declare at least the arrow asset.`);
  }

  const cursorsPath = path.join(packagePath, "cursors");
  const cursorDirectoryStats = lstatSync(cursorsPath);
  if (!cursorDirectoryStats.isDirectory() || cursorDirectoryStats.isSymbolicLink()) {
    fail(`Cursor "${id}" cursors path must be a real directory.`);
  }

  const expectedAssetNames = new Set();
  const seenTypes = new Set();
  let totalAssetBytes = 0;
  let previousOrder = -1;

  for (const asset of manifest.assets) {
    if (!isPlainObject(asset)) fail(`Cursor "${id}" contains an invalid asset entry.`);
    const order = cursorOrder.indexOf(asset.visualType);
    if (order < 0 || order <= previousOrder || seenTypes.has(asset.visualType)) {
      fail(`Cursor "${id}" assets must use unique states in canonical order.`);
    }
    previousOrder = order;
    seenTypes.add(asset.visualType);

    const expectedFileName = `cursors/${asset.visualType}.png`;
    if (asset.fileName !== expectedFileName) {
      fail(`Cursor "${id}" state "${asset.visualType}" must use ${expectedFileName}.`);
    }
    expectedAssetNames.add(path.basename(expectedFileName));
    assertInteger(asset.byteCount, `Cursor "${id}" ${asset.visualType} byteCount`, 1, maximumAssetBytes);
    assertInteger(asset.pixelWidth, `Cursor "${id}" ${asset.visualType} pixelWidth`, 1, maximumCellSize);
    assertInteger(asset.pixelHeight, `Cursor "${id}" ${asset.visualType} pixelHeight`, 1, maximumCellSize);
    assertInteger(asset.scale, `Cursor "${id}" ${asset.visualType} scale`, 1, 16);
    if (!isPlainObject(asset.hotspot)) fail(`Cursor "${id}" ${asset.visualType} needs a hotspot.`);
    assertInteger(asset.hotspot.x, `Cursor "${id}" ${asset.visualType} hotspot.x`, 0, asset.pixelWidth - 1);
    assertInteger(asset.hotspot.y, `Cursor "${id}" ${asset.visualType} hotspot.y`, 0, asset.pixelHeight - 1);
    if (typeof asset.sha256 !== "string" || !/^[0-9a-f]{64}$/.test(asset.sha256)) {
      fail(`Cursor "${id}" ${asset.visualType} has an invalid SHA-256.`);
    }

    const assetPath = path.join(packagePath, asset.fileName);
    const stats = assertRegularFile(assetPath, `cursor "${id}" ${asset.visualType} asset`);
    const data = readFileSync(assetPath);
    const dimensions = inspectPng(data, relative(assetPath));
    if (stats.size !== asset.byteCount) {
      fail(`${relative(assetPath)} byteCount is ${asset.byteCount}, but the file is ${stats.size} bytes.`);
    }
    if (dimensions.width !== asset.pixelWidth || dimensions.height !== asset.pixelHeight) {
      fail(
        `${relative(assetPath)} is ${dimensions.width}×${dimensions.height}, but the manifest declares ${asset.pixelWidth}×${asset.pixelHeight}.`,
      );
    }
    if (sha256(data) !== asset.sha256) fail(`${relative(assetPath)} does not match its manifest SHA-256.`);
    totalAssetBytes += stats.size;
  }

  if (!seenTypes.has("arrow")) fail(`Cursor "${id}" is missing the required arrow state.`);
  if (totalAssetBytes > maximumPackAssetBytes) {
    fail(`Cursor "${id}" exceeds the ${maximumPackAssetBytes} byte total asset limit.`);
  }

  const actualAssetNames = readdirSync(cursorsPath).sort();
  if (
    actualAssetNames.length !== expectedAssetNames.size ||
    actualAssetNames.some((name) => !expectedAssetNames.has(name))
  ) {
    fail(`Cursor "${id}" cursors/ must contain exactly the assets declared by its manifest.`);
  }

  return { manifest, packagePath };
}

function collectSourceCatalog() {
  const sourceCatalog = readJson(catalogPath);
  if (
    !isPlainObject(sourceCatalog) ||
    sourceCatalog.schemaVersion !== 1 ||
    !Array.isArray(sourceCatalog.packs) ||
    sourceCatalog.packs.length === 0
  ) {
    fail("content/cursors/catalog.json must use schema 1 and contain a non-empty packs array.");
  }
  if (
    typeof sourceCatalog.generatedAt !== "string" ||
    !Number.isFinite(Date.parse(sourceCatalog.generatedAt))
  ) {
    fail("content/cursors/catalog.json generatedAt must be an ISO-8601 date.");
  }

  const references = new Set();
  const seenIds = new Set();
  const packs = sourceCatalog.packs.map((reference) => {
    if (
      typeof reference !== "string" ||
      !/^packs\/[a-z0-9]+(?:-[a-z0-9]+)*\.sccursor$/.test(reference) ||
      references.has(reference)
    ) {
      fail(`Invalid or duplicate cursor package reference "${reference}".`);
    }
    references.add(reference);
    const packagePath = path.join(contentRoot, reference);
    if (!packagePath.startsWith(`${sourcePacksRoot}${path.sep}`)) {
      fail(`Cursor package reference escapes content/cursors/packs: ${reference}`);
    }
    return validateManifest(packagePath, reference, seenIds);
  });

  const sourceDirectories = readdirSync(sourcePacksRoot)
    .filter((name) => name.endsWith(".sccursor"))
    .map((name) => `packs/${name}`)
    .sort();
  const catalogDirectories = [...references].sort();
  if (JSON.stringify(sourceDirectories) !== JSON.stringify(catalogDirectories)) {
    fail("Every .sccursor directory must appear exactly once in content/cursors/catalog.json.");
  }

  return {
    manifest: {
      schemaVersion: catalogSchemaVersion,
      minimumReaderSchemaVersion: catalogSchemaVersion,
      generatedAt: new Date(sourceCatalog.generatedAt).toISOString(),
      packs: packs.map(({ manifest }) => ({
        manifest,
        assetBaseURL: `/cursor-style-packs/${manifest.id}/${manifest.version}/`,
      })),
    },
    packs,
  };
}

function expectedPublicFiles(catalog) {
  const files = new Map([[relative(publicManifestPath), Buffer.from(stableJson(catalog.manifest))]]);
  for (const pack of catalog.packs) {
    const destinationRoot = path.join(publicRoot, pack.manifest.id, pack.manifest.version);
    files.set(
      relative(path.join(destinationRoot, "manifest.json")),
      Buffer.from(stableJson(pack.manifest)),
    );
    for (const asset of pack.manifest.assets) {
      files.set(
        relative(path.join(destinationRoot, asset.fileName)),
        readFileSync(path.join(pack.packagePath, asset.fileName)),
      );
    }
  }
  return files;
}

function walkFiles(directory) {
  if (!existsSync(directory)) return [];
  const files = [];
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const entryPath = path.join(directory, entry.name);
    if (entry.isSymbolicLink()) fail(`Generated cursor output contains a symlink: ${relative(entryPath)}`);
    if (entry.isDirectory()) files.push(...walkFiles(entryPath));
    else if (entry.isFile()) files.push(relative(entryPath));
  }
  return files.sort();
}

function checkGenerated(catalog) {
  const expected = expectedPublicFiles(catalog);
  if (!existsSync(generatedDataPath)) {
    fail("src/data/generated/cursors.json is missing. Run npm run cursors:build.");
  }
  if (stableJson(readJson(generatedDataPath)) !== stableJson(catalog.manifest)) {
    fail("src/data/generated/cursors.json is stale. Run npm run cursors:build.");
  }

  const actualFiles = walkFiles(publicRoot);
  const expectedFiles = [...expected.keys()].sort();
  if (JSON.stringify(actualFiles) !== JSON.stringify(expectedFiles)) {
    fail("public/cursor-style-packs contains missing or stale files. Run npm run cursors:build.");
  }
  for (const [filePath, expectedData] of expected) {
    const absolutePath = path.join(repoRoot, filePath);
    if (!readFileSync(absolutePath).equals(expectedData)) {
      fail(`${filePath} is stale. Run npm run cursors:build.`);
    }
  }
  console.log(`Cursor catalog is valid and generated output is current (${catalog.packs.length} packs).`);
}

function writeGenerated(catalog) {
  rmSync(publicRoot, { recursive: true, force: true });
  mkdirSync(publicRoot, { recursive: true });
  writeJson(publicManifestPath, catalog.manifest);
  writeJson(generatedDataPath, catalog.manifest);

  for (const pack of catalog.packs) {
    const destinationRoot = path.join(publicRoot, pack.manifest.id, pack.manifest.version);
    writeJson(path.join(destinationRoot, "manifest.json"), pack.manifest);
    for (const asset of pack.manifest.assets) {
      const destinationPath = path.join(destinationRoot, asset.fileName);
      mkdirSync(path.dirname(destinationPath), { recursive: true });
      copyFileSync(path.join(pack.packagePath, asset.fileName), destinationPath);
    }
    console.log(`${pack.manifest.id}@${pack.manifest.version}: ${pack.manifest.assets.length} assets`);
  }
  console.log(`Wrote ${relative(publicManifestPath)}`);
  console.log(`Wrote ${relative(generatedDataPath)}`);
}

const catalog = collectSourceCatalog();
if (checkOnly) checkGenerated(catalog);
else writeGenerated(catalog);
