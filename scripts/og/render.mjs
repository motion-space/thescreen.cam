// Renders scripts/og/*.html to 1200x630 PNG/JPG via headless Edge/Chrome.
// Usage: node scripts/og/render.mjs [outDir] [name...]
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import sharp from "sharp";

const here = dirname(fileURLToPath(import.meta.url));
const outDir = resolve(process.argv[2] ?? join(here, "out"));
const only = process.argv.slice(3);
const browser = [
  process.env.CHROME_BIN,
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
].find((p) => p && existsSync(p));
if (!browser) throw new Error("No Chrome/Edge found; set CHROME_BIN.");

mkdirSync(outDir, { recursive: true });
const pages = readdirSync(here).filter((f) => f.endsWith(".html") && (!only.length || only.some((n) => f.startsWith(n))));
for (const page of pages) {
  const name = page.replace(/\.html$/, "");
  const raw = join(outDir, `${name}@2x.png`);
  execFileSync(browser, [
    "--headless=new", "--disable-gpu", "--hide-scrollbars", "--allow-file-access-from-files",
    "--force-device-scale-factor=2", "--window-size=1200,630", "--virtual-time-budget=8000",
    `--screenshot=${raw}`, pathToFileURL(join(here, page)).href,
  ], { stdio: "ignore" });
  await sharp(raw).resize(1200, 630).jpeg({ quality: 90, mozjpeg: true }).toFile(join(outDir, `${name}.jpg`));
  console.log("rendered", name);
}
