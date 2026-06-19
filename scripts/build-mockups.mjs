import { createHash } from "node:crypto";
import { mkdir, readFile, readdir, rm, stat, writeFile, copyFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const sourceDir = path.join(rootDir, "content", "mockups", "series");
const publicDir = path.join(rootDir, "public", "mockups");
const generatedDir = path.join(rootDir, "src", "data", "generated");

const schemaVersion = 2;

async function main() {
  const files = (await readdir(sourceDir))
    .filter((file) => file.endsWith(".json"))
    .sort();

  await rm(publicDir, { recursive: true, force: true });
  await mkdir(path.join(publicDir, "series"), { recursive: true });
  await mkdir(path.join(publicDir, "assets"), { recursive: true });
  await mkdir(generatedDir, { recursive: true });

  const seriesManifests = [];
  for (const file of files) {
    const source = JSON.parse(await readFile(path.join(sourceDir, file), "utf8"));
    const manifest = await enrichSeriesManifest(source);
    seriesManifests.push(manifest);
    const { generatedAtMs: _generatedAtMs, ...publicManifest } = manifest;
    await writeJSON(path.join(publicDir, "series", `${manifest.id}.json`), publicManifest);
  }

  const generatedAt = new Date(
    Math.max(...seriesManifests.map((series) => series.generatedAtMs))
  ).toISOString();

  const index = {
    schemaVersion,
    generatedAt,
    series: seriesManifests.map(({ generatedAtMs: _generatedAtMs, ...series }) => ({
      id: series.id,
      name: series.name,
      kind: series.kind,
      version: series.version,
      manifestUrl: `/mockups/series/${series.id}.json`,
      assetCount: countAssets(series),
      totalSize: totalAssetSize(series),
    })),
  };

  await writeJSON(path.join(publicDir, "index.json"), index);
  await writeJSON(path.join(generatedDir, "mockups.json"), index);
}

async function enrichSeriesManifest(source) {
  const sourcePath = path.join(sourceDir, `${source.id}.json`);
  const sourceStats = await stat(sourcePath);
  const manifest = structuredClone(source);
  manifest.schemaVersion = schemaVersion;

  let newestMtimeMs = sourceStats.mtimeMs;

  async function enrichAsset(asset, assetBasePath) {
    const sourceAssetPath = path.join(rootDir, "content", "mockups", "assets", asset.source);
    const publicAssetPath = path.join(publicDir, "assets", asset.source);
    const stats = await stat(sourceAssetPath);
    newestMtimeMs = Math.max(newestMtimeMs, stats.mtimeMs);
    await mkdir(path.dirname(publicAssetPath), { recursive: true });
    await copyFile(sourceAssetPath, publicAssetPath);

    const bytes = await readFile(sourceAssetPath);
    const sha256 = createHash("sha256").update(bytes).digest("hex");
    const { source: _source, ...rest } = asset;
    return {
      ...rest,
      url: `/mockups/assets/${asset.source}`,
      downloadUrl: `/mockups/assets/${asset.source}`,
      contentType: contentTypeForPath(asset.source),
      size: stats.size,
      sha256,
    };
  }

  async function enrichAssets(owner, assetBasePath) {
    if (!owner.assets) return;
    owner.assets = await Promise.all(owner.assets.map((asset) => enrichAsset(asset, assetBasePath)));
  }

  await enrichAssets(manifest, manifest.id);
  if (manifest.variants) {
    for (const variant of manifest.variants) {
      await enrichAssets(variant, manifest.id);
    }
  }
  if (manifest.optionGroups) {
    for (const group of manifest.optionGroups) {
      await enrichOptionGroup(group, manifest.id);
    }
  }
  if (manifest.models) {
    for (const model of manifest.models) {
      await enrichAssets(model, `${manifest.id}/${model.id}`);
      if (model.variants) {
        for (const variant of model.variants) {
          await enrichAssets(variant, `${manifest.id}/${model.id}`);
        }
      }
      if (model.optionGroups) {
        for (const group of model.optionGroups) {
          await enrichOptionGroup(group, `${manifest.id}/${model.id}`);
        }
      }
    }
  }

  manifest.generatedAt = new Date(newestMtimeMs).toISOString();
  manifest.generatedAtMs = newestMtimeMs;
  return manifest;

  async function enrichOptionGroup(group, assetBasePath) {
    if (!group.options) return;
    for (const option of group.options) {
      await enrichAssets(option, assetBasePath);
    }
  }
}

function countAssets(series) {
  return assetList(series).length;
}

function totalAssetSize(series) {
  return assetList(series).reduce((sum, asset) => sum + asset.size, 0);
}

function assetList(series) {
  const assets = [];
  if (series.assets) assets.push(...series.assets);
  if (series.variants) {
    for (const variant of series.variants) {
      if (variant.assets) assets.push(...variant.assets);
    }
  }
  if (series.optionGroups) {
    for (const group of series.optionGroups) {
      if (!group.options) continue;
      for (const option of group.options) {
        if (option.assets) assets.push(...option.assets);
      }
    }
  }
  if (series.models) {
    for (const model of series.models) {
      if (model.assets) assets.push(...model.assets);
      if (model.variants) {
        for (const variant of model.variants) {
          if (variant.assets) assets.push(...variant.assets);
        }
      }
      if (model.optionGroups) {
        for (const group of model.optionGroups) {
          if (!group.options) continue;
          for (const option of group.options) {
            if (option.assets) assets.push(...option.assets);
          }
        }
      }
    }
  }
  return assets;
}

function contentTypeForPath(filePath) {
  switch (path.extname(filePath).toLowerCase()) {
    case ".webp":
      return "image/webp";
    case ".png":
      return "image/png";
    case ".svg":
      return "image/svg+xml";
    default:
      return "application/octet-stream";
  }
}

async function writeJSON(filePath, value) {
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
