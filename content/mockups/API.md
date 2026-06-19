# Mockups API

This API exposes the generated ScreenCam mockup catalog for client-side download and update.

## Endpoints

```http
GET /api/mockups.json
GET /mockups/series/{seriesID}.json
GET /mockups/assets/{assetPath}
```

`/api/mockups.json` is a lightweight index. Each entry has a series-level `version` and a `manifestUrl`.

## Index Response

```ts
type MockupIndex = {
  schemaVersion: 2;
  generatedAt: string;
  series: MockupSeriesIndex[];
};

type MockupSeriesIndex = {
  id: string;
  name: string;
  kind: "phone" | "watch" | "laptop" | "display";
  version: number;
  manifestUrl: string;
  assetCount: number;
  totalSize: number;
};
```

## Series Manifest

```ts
type MockupSeriesManifest = {
  schemaVersion: 2;
  id: string;
  name: string;
  kind: "phone" | "watch" | "laptop" | "display";
  version: number;
  generatedAt: string;
  defaultModelID?: string;
  screenResolution?: Size;
  renderGeometry?: RenderGeometry;
  assets?: MockupAsset[];
  defaultOptionIDs?: Record<string, string>;
  optionGroups?: MockupOptionGroup[];
  defaultVariantID?: string;
  variants?: MockupVariant[];
  models?: MockupModel[];
  composition?: MockupComposition;
  legacyAliases: LegacyAlias[];
};

type MockupModel = {
  id: string;
  name: string;
  screenResolution: Size;
  renderGeometry: RenderGeometry;
  assets?: MockupAsset[];
  defaultOptionIDs?: Record<string, string>;
  optionGroups?: MockupOptionGroup[];
  defaultVariantID?: string;
  variants?: MockupVariant[];
  composition?: MockupComposition;
};

type MockupOptionGroup = {
  id: string;
  kind: "color" | "case" | "band";
  name: string;
  defaultOptionID: string;
  sections?: MockupOptionSection[];
  options: MockupOption[];
};

type MockupOptionSection = {
  id: string;
  name: string;
};

type MockupOption = {
  id: string;
  name: string;
  sectionID?: string;
  swatchHex?: string;
  assets: MockupAsset[];
};

type MockupVariant = {
  id: string;
  name: string;
  swatchHex: string;
  assets: MockupAsset[];
};

type MockupAsset = {
  role: "base" | "chrome" | "bottom" | "notch" | "case" | "band";
  url: string;
  downloadUrl: string;
  contentType: string;
  size: number;
  sha256: string;
  pixelWidth: number;
  pixelHeight: number;
};

type MockupComposition = {
  layers: MockupCompositionLayer[];
};

type MockupCompositionLayer =
  | { type: "optionAsset"; groupID: string; role: string; zIndex: number }
  | { type: "screen"; zIndex: number }
  | { type: "asset"; role: string; zIndex: number };
```

Series without a second-level model, such as `iPhone Air`, put `screenResolution`, `renderGeometry`, and `variants` directly on the series. Series with models, such as `iPhone 17 Series` or `MacBook Pro`, put those fields on each model.

Schema v2 adds `optionGroups` for multi-axis mockups. A simple color-only mockup can continue using `variants` for compatibility. A watch mockup uses `optionGroups` with `case` and `band` groups; each option may include `sectionID` so clients can group cases by material and bands by type.

## Updating The API Output

1. Edit a source file under `content/mockups/series/`.
2. Add or replace assets under `content/mockups/assets/`.
3. Run:

```bash
npm run mockups:build
```

The generator writes:

- `public/mockups/index.json`
- `public/mockups/series/*.json`
- `public/mockups/assets/**`
- `src/data/generated/mockups.json`
