# ScreenCam Website

ScreenCam is a native macOS screen recording app. This repository contains the public website, docs pages, changelog pages, and downloadable BGM catalog for ScreenCam.

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

## Project Structure

- `src/pages/`: Astro routes and API endpoints
- `src/components/`: page sections and interactive React components
- `src/lib/`: i18n, translations, and shared site config
- `content/bgm/`: BGM source workflow and metadata
- `public/`: static assets served by the site
- `scripts/`: build utilities

## Notes

The site is built for Cloudflare. `npm run build` prerenders static routes and emits the Cloudflare server output under `dist/`.

## License

Source code is available under the [MIT License](LICENSE).

ScreenCam names, logos, screenshots, demo videos, wallpapers, audio files, and other website media assets are part of the official ScreenCam website asset bundle. Do not reuse those assets unless you have permission or a separate license applies.
