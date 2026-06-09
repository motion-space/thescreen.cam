# BGM source workflow

This directory is the source of truth for ScreenCam BGM assets.

API documentation lives in `content/bgm/API.md`.

## Add a track

1. Put the source audio file in `content/bgm/audio/`.
2. Add an entry to `content/bgm/tracks.json`.
3. Run `npm run bgm:build`.

The build script copies full tracks to `public/bgm/audio/`, cuts a 5 second preview from the middle of each track into `public/bgm/previews/`, and writes the public manifest to both `public/bgm/manifest.json` and `src/data/generated/bgm.json`.

## Rebuild behavior

`npm run bgm:build` skips generated audio when the source file hash matches the previous manifest.

Use `npm run bgm:build:force` to rebuild every copied track and preview.

## Size policy

Cloudflare static assets have a 25 MiB per-file limit, so the script fails by default when a source file exceeds that size. If the library grows past that, use one of these:

- Git LFS for source files when we still want public assets committed after local processing.
- Cloudflare R2 when individual tracks exceed the static asset limit or when BGM needs independent updates outside site deploys.

Current files are small enough to keep in normal Git.
