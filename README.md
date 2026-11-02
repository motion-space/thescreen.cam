# ScreenCam Website

ScreenCam is a native macOS screen recording app. This repository contains the public website, docs pages, changelog pages, downloadable BGM catalog, and open cursor catalog for ScreenCam.

## Links

- Website: https://thescreen.cam
- Repository: https://github.com/motion-space/thescreen.cam
- App Store: configured in `src/lib/i18n.ts`

## Tech Stack

- Astro 5
- React 19 islands
- Tailwind CSS 4
- Framer Motion
- Cloudflare adapter and Wrangler

## Local Development

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Build the site:

```bash
npm run build
```

Preview with Wrangler:

```bash
npm run preview
```

Deploy:

```bash
npm run deploy
```

## BGM Catalog

BGM source files live in `content/bgm/audio/`, with track metadata in `content/bgm/tracks.json`.

Generate public audio files, 5 second previews, and JSON manifests:

```bash
npm run bgm:build
```

Force regeneration:

```bash
npm run bgm:build:force
```

The generator writes:

- `public/bgm/audio/`
- `public/bgm/previews/`
- `public/bgm/manifest.json`
- `src/data/generated/bgm.json`

`ffmpeg` and `ffprobe` are required for BGM generation.

## Cursor Catalog

Cursor pack sources live in `content/cursors/packs/` and are curated by
`content/cursors/catalog.json`.

Validate and publish the static cursor API:

```bash
npm run cursors:build
npm run cursors:check
```

See [`content/cursors/README.md`](content/cursors/README.md) for the API layout
and pull request contribution workflow.

## Transition Catalog

Signed, immutable transition packages are served by `/api/transitions.json`. The publisher supports legacy recipes and schema 2 packages with embedded GLSL/Metal shader source.
Source data and publisher workflow live in [`content/transitions/README.md`](content/transitions/README.md).

```bash
npm run transitions:check
npm run transitions:test
```

The standalone `scripts/transitions/transition-pack.mjs` tool lets users author,
validate, and pack self-contained `.sctransition` shader files for local import. Publishing an
updated official catalog requires the externally stored Ed25519 signing key.

## Device Catalog

Native data-only device resources live in `content/devices/iphone-duo/1.0.0/`. They are delivered separately from the ScreenCam App.

```bash
npm run devices:build
npm run devices:test
```

The normal build publishes `/api/devices.json`, `/devices/iphone-duo/manifest.json`, and an immutable versioned `device.scdevice`. The manifest declares recording-kind restrictions, colors, postures, compatibility, sizes and SHA-256. `SCDEVICE1` indexes raw-deflate file payloads with individual hashes; the App verifies and installs them before enabling Duo recording. Model provenance and preserved source settings are in the device's `NOTICE.txt` and `source-config.json`. Bump the device version before changing published asset contents. Generated `public/devices/` output is ignored.

Single-screen phones are described in `content/devices/catalog.json`; the build script discovers the device list from that data file. To add a model without changing the App:

1. Add its versioned data-only renderer resources under `content/devices/<id>/<version>/`.
2. Add a catalog entry with `id`, `version`, `name`, `rendererSchemaVersion`, and `phoneModel`. The descriptor contains the same `id`/`name`, `colors`, `screenSize` in native pixels, `modelIdentifiers` for USB recognition, `rendererSchemaVersion`, and `finishes` (stable `id`, display `name`, `swatchHex`, optional `localizedNames`).
3. Run `npm run devices:build` and `npm run devices:test`, then publish the API and generated resources together through the normal deployment workflow.

Current single-screen clients support manifest schema 1 and renderer schema 2. Each entry is checked independently: future renderer versions, invalid metadata and unrelated recording kinds are excluded from the phone picker. Keep this 3D catalog separate from `/api/mockups.json`; static-list older Apps do not read it and will not display newly published models. Existing per-device manifests retain their schema and color IDs, so older Apps can still download the models they already know. The new App stores a descriptor snapshot with each selected model; such projects require workspace reader 19 and automation capability `supportsDynamicPhone3DModels`.

## Project Structure

- `src/pages/`: Astro routes and API endpoints
- `src/components/`: page sections and interactive React components
- `src/lib/`: i18n, translations, and shared site config
- `content/bgm/`: BGM source workflow and metadata
- `content/cursors/`: cursor pack sources, catalog order, and contribution guide
- `content/transitions/`: signed transition sources, release locks, and publisher guide
- `public/`: static assets served by the site
- `scripts/`: build utilities

## Notes

The site is built for Cloudflare. `npm run build` prerenders static routes and emits the Cloudflare server output under `dist/`.

## License

Source code is available under the [MIT License](LICENSE).

ScreenCam names, logos, screenshots, demo videos, wallpapers, audio files, and other website media assets are part of the official ScreenCam website asset bundle. Do not reuse those assets unless you have permission or a separate license applies.
