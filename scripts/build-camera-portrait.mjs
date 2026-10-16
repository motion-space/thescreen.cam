// macOS only; requires ffmpeg and Xcode command line tools.
// One H.264 video carries synchronized color (left) and Vision alpha (right).
// The browser reconstructs transparent frames; no segmentation model is shipped.
import { execFileSync } from "node:child_process";
import { mkdtempSync, mkdirSync, rmSync, statSync } from "node:fs";
import { tmpdir } from "node:os";
import { resolve, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const temporary = mkdtempSync(join(tmpdir(), "screencam-portrait-"));
const run = (command, args) => execFileSync(command, args, { cwd: root, stdio: "inherit" });
try {
  const frames = join(temporary, "frames");
  const masks = join(temporary, "masks");
  mkdirSync(frames);
  mkdirSync(masks);
  run("ffmpeg", ["-y", "-loglevel", "error", "-i", "public/feature-media/beauty-comparison.mp4", "-vf", "crop=iw/2:ih:0:0,scale=420:316,setsar=1,fps=24", join(frames, "%04d.png")]);
  run("swift", ["-module-cache-path", join(temporary, "swift-cache"), "scripts/camera-portrait.swift", frames, masks]);
  const output = resolve(root, "public/feature-media/camera-portrait-loop.mp4");
  run("ffmpeg", ["-y", "-loglevel", "error", "-framerate", "24", "-i", join(frames, "%04d.png"), "-framerate", "24", "-i", join(masks, "%04d.png"), "-filter_complex", "[0:v][1:v]hstack=inputs=2[v]", "-map", "[v]", "-c:v", "libx264", "-preset", "slow", "-crf", "20", "-pix_fmt", "yuv420p", "-movflags", "+faststart", "-an", output]);
  console.log(`camera-portrait-loop.mp4: ${(statSync(output).size / 1024).toFixed(1)} KiB`);
} finally {
  rmSync(temporary, { recursive: true, force: true });
}
