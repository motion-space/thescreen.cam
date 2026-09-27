# ScreenCam downloadable transitions

This catalog supports self-contained shader-v1 packages alongside legacy scene-v1 recipes. Schema 2 packages define their algorithm in GLSL or Metal source inside the effect file and declare `transitions.shader.v1`; schema 1 remains supported for existing projects. New compatible shader algorithms can be published without an app update.

## Public contract

- `GET /api/transitions.json` and `/transitions/index.json`: signed discovery envelope.
- `/transitions/<id>/<version>/<sha256>.sctransition`: immutable UTF-8 JSON packages (maximum 256 KiB).
- Shader source is embedded UTF-8 text, limited to 128 KiB. No external textures, archives, host scripts, executable binaries, or recording uploads are involved.
- Package `schemaVersion:2` is independent of the signed catalog envelope/version, which remains 1.

The envelope is `{schemaVersion:1, signingKeyID, payload, signature}`. `payload` is Base64 of the exact UTF-8 inner catalog bytes; `signature` is Base64 Ed25519 over those decoded bytes. App trust is pinned independently of the catalog. The inner catalog is `{schemaVersion:1, revision, effects:[...]}`. Each entry contains `id`, `version`, `name`, `summary`, `manifestURL`, `sha256`, `sizeBytes`, `requiredCapabilities`, `previewDefinition`, `signingKeyID`, and `signature`. `previewDefinition` is the complete validated manifest object, authenticated inside the catalog, so the app can render the actual effect on built-in sample scenes before downloading. The installed package must equal this preview definition. The entire signed catalog is limited to 2 MiB. The entry signature authenticates the exact package file bytes. SHA-256 provides content identity, not publisher authentication.

Source manifests live in `manifests/`. `catalog.json` defines discovery order and revision; `trusted-keys.json` contains only public keys; `releases.json` prevents rewriting an existing ID/version or catalog revision. Generated objects under `public/transitions` and `src/data/generated/transitions.json` are deliberate product resources and should be reviewed and tracked. Old immutable objects must remain available after a catalog update or delisting.

## Validate and build

```sh
npm run transitions:check
npm run transitions:validate-sources
npm run transitions:test
TRANSITION_SIGNING_KEY_FILE=/secure/path/ed25519-private-key.pem npm run transitions:build
npm run build
```

`transitions:validate-sources` checks reviewable source manifests without reading private keys, signing, writing generated outputs or contacting production. `transitions:check` needs no private key. It checks canonical bytes, supported recipe bounds, signatures, digests, existing immutable objects and generated catalog freshness. Normal site builds include it. The publisher build verifies that the signing key matches the pinned public key. It will not silently re-sign edited bytes under an existing identity; increment the manifest version and catalog revision first.

The initial key was generated locally at `tmp/transitions/signing-key.pem` with mode 0600. This path is ignored and is **not** a backup. Before the first production release, the owner must preserve the private key in the release secret store outside disposable workspace storage. Neither the private key nor a generated replacement belongs in Git. Public key rotation requires adding the new key to the app's pinned trust set before publishing with it. The development key has not been uploaded or deployed by this change.

## Make a custom package

Node.js 20 or later is sufficient; the authoring CLI has no dependencies:

```sh
node scripts/transitions/transition-pack.mjs init-shader yourname.burn tmp/transitions/burn.json glsl
# Write tmp/transitions/burn.glsl and edit metadata/parameterDefinitions/maximumScale.
node scripts/transitions/transition-pack.mjs pack-shader tmp/transitions/burn.json tmp/transitions/burn.glsl tmp/transitions/burn.sctransition
node scripts/transitions/transition-pack.mjs validate tmp/transitions/burn.sctransition
```

The app repo contains the same standalone authoring tool and a complete agent prompt in `Documentation/TransitionAuthoring.md`. Keep the copies of `transition-contract.mjs`, `transition-pack.mjs`, and authoring/contract tests synchronized when the format evolves. The stable Swift contract is `ScreenCamCore/Models/TransitionModels.swift`; publisher validation uses canonical JSON and the same shader limits and reserved parameter names. Legacy integer direction options remain restricted under scene-v1 only.

Local imports are explicit user choices and do not need official signatures. They use an author-owned ID; `screencam.` is reserved. Distribution through the official catalog requires review, an allowed redistribution license, and the pinned publisher signature.

## Publication review

1. Edit or add source manifests; retain the exact schema, ID and numeric SemVer rules.
2. For any changed bytes, increment effect version. Update source catalog revision and review ordering.
3. Confirm names, intended visual behavior, direction semantics and redistribution license.
4. Run the authoring checks, compile the shader on a target Mac, and render in the app. Test landscape/portrait/square, source sizes, endpoint identity, text sharpness at 5x Zoom, random seeks, preview/export agreement, and the heaviest shader parameter/loop configuration. Count texture samples and measure actual preview/seek performance. Static tests do not substitute for device and image-quality review.
5. Build with the externally stored signing key; inspect generated resources and `releases.json`.
6. Run `transitions:test`, `transitions:check` and the site build. Deployment is a separate authorized action.

The full repository change is prepared locally only; it does not make the production URL available until deployment.


## Shader-v1 publication candidate

`manifests/screencam.glitch-v2.json` is the new **2.0.0** signal-glitch source package, copied from the app's effect resource and canonicalized. `shader-v1.catalog.json` is a reviewable candidate catalog replacing only the legacy glitch recommendation; it is not the active published source catalog. The active catalog includes FilmBurn while retaining the legacy glitch recommendation; the candidate switches glitch to 2.0.0. Existing immutable packages and prior release locks are preserved.

Validate the candidate without signing it:

```sh
node scripts/build-transitions.mjs --validate-sources --source-catalog content/transitions/shader-v1.catalog.json
```

`--source-directory` can also validate a separate source tree containing `catalog.json` and `manifests/`; immutable identity checks still use the repository's published release lock. These switches only work with `--validate-sources`. Source-only validation does not certify shader compilation or the eventual catalog signature. Once GPU/image/performance review and explicit release approval are complete, promote the reviewed candidate to `catalog.json`, sign through the ordinary publisher workflow, then deploy separately. Do not edit an old signed package in place.

## FilmBurn in the official catalog

`manifests/gl-transitions.film-burn.json` is included in the active `catalog.json` as `gl-transitions.film-burn` version **1.0.0**, and also remains in the shader-v1 candidate. It carries the original GLSL, the `Seed` control, Anastasia Dunbar / gl-transitions contributor attribution, and the complete MIT license. The shader was verified through the app's import, preview and MP4/GIF export paths before being added here.

Authorship is preserved independently from distribution: the ScreenCam pinned publisher key authenticates the catalog and package; publishing third-party effects does not rename their authors to ScreenCam. The local signed API resources include FilmBurn. Production availability still requires a separate deployment.

## Additional GL Transitions effects

The official source catalog also includes the following shader effects. Duration and animation curves are supplied by the app for all of them; the controls below come from each effect file.

| Effect | Adjustable controls |
| --- | --- |
| burn0 | Burn hue, burn intensity, noise scale, burning-edge width |
| EdgeTransition | Edge thickness, edge brightness, edge strength |
| coord-from-in | Distortion strength, coordinate channels (RG / RB / GB) |
| ButterflyWaveScrawler | Wave amplitude, wave density, color separation |
| crosswarp | Warp strength, four sweep directions, center X and Y |

Their immutable source references, upstream hashes, authors and per-effect adaptation notes live in `upstream/gl-transitions/`. Original upstream GLSL is retained there for review; the self-contained executable adaptation lives in each manifest's `shader.source`. Every package embeds the full MIT license.

The burn-color vector is exposed through hue/intensity scalar controls, and EdgeTransition's array function is expanded into explicit sample arguments for the GLSL-to-Metal compatibility layer. Effects preserve transparent scene alpha. Crosswarp keeps its directional crossfade and opposing zooms, but explicitly limits each branch's zoom to 2x rather than the upstream shader's unbounded zoom at vanishing blend weights; it requests correspondingly larger source scenes. Its center and direction controls, and coord-from-in's distortion/channel controls, extend the originals. Nonlinear coordinate distortion is intentional and is not a claim of a global bound on the warp's UV derivative.
