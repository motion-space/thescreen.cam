# ScreenCam Cursor Catalog

This directory is the source of truth for the public ScreenCam cursor catalog.
Each accepted cursor is published by the website and becomes available to the
ScreenCam app through the cursor catalog API.

## Directory layout

```text
content/cursors/
├── catalog.json
└── packs/
    └── my-cursor.sccursor/
        ├── manifest.json
        └── cursors/
            ├── arrow.png
            └── ...
```

A source package must contain only `manifest.json` and the PNG files declared
by its manifest. Do not commit generated contact sheets, installation receipts,
downloaded catalog metadata, temporary files, or editor caches.

## Add a cursor with a pull request

1. Create and validate an import-ready schema 2 `.sccursor` package.
2. Use a stable lowercase kebab-case ID and name the directory
   `<id>.sccursor`.
3. Copy the package to `content/cursors/packs/`.
4. Add its relative path to `content/cursors/catalog.json` and update
   `generatedAt`.
5. Run:

   ```bash
   npm install
   npm run cursors:build
   npm run cursors:check
   npm run build
   ```

6. Commit the source package and generated files, then open a pull request.

Only submit artwork you created or have permission to redistribute. By opening
a pull request, you confirm the cursor may be hosted and distributed as part of
the public ScreenCam cursor catalog. Add `author` and `license` metadata to the
manifest when attribution or a specific license is required.

The generator rejects unsafe paths, duplicate IDs, unsupported schema versions,
non-canonical cursor state order, bad dimensions or hotspots, animated/non-PNG
assets, missing transparency, file-size mismatches, and SHA-256 mismatches.

## Generated API

Do not edit generated files by hand. `npm run cursors:build` writes:

- `public/cursor-style-packs/manifest.json`
- `public/cursor-style-packs/<id>/<version>/manifest.json`
- `public/cursor-style-packs/<id>/<version>/cursors/*.png`
- `src/data/generated/cursors.json`

Public endpoints:

- `GET /api/cursor-style-packs.json` — canonical ScreenCam app catalog
- `GET /api/cursors.json` — public alias of the same catalog
- `GET /cursor-style-packs/manifest.json` — static catalog
- `GET /cursor-style-packs/<id>/<version>/manifest.json` — pack manifest
- `GET /cursor-style-packs/<id>/<version>/cursors/<state>.png` — cursor asset

Catalog schema 3 embeds the schema 2 package manifest and adds an
`assetBaseURL`. ScreenCam downloads and verifies each declared asset
individually.
