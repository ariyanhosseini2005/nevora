import { createRequire } from "node:module";
import { mkdir, readdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDirectory, "..");
const requireFromFrontend = createRequire(
  path.join(projectRoot, "frontend", "package.json"),
);
const sharp = requireFromFrontend("sharp");

const storyboardRoot = path.join(projectRoot, "docs", "homepage", "storyboards");
const outputDirectory = path.join(
  projectRoot,
  "frontend",
  "public",
  "images",
  "journey",
  "frames",
);
const manifestPath = path.join(outputDirectory, "manifest.json");

const ranges = [
  {
    start: 204,
    end: 251,
    directory: "basket-to-water-pilot-masters-2k",
    version: 1,
    beat: "basket-to-water",
  },
  {
    start: 252,
    end: 299,
    directory: "water-to-drying-masters-2k",
    version: 1,
    beat: "water-to-drying",
  },
  {
    start: 300,
    end: 347,
    directory: "drying-masters-2k-v002",
    version: 2,
    beat: "drying-to-roaster-approach",
  },
];

const outputSize = 1280;

function padded(frame) {
  return String(frame).padStart(4, "0");
}

function masterName(frame, version) {
  return `nevora-one-take_f${padded(frame)}_v${String(version).padStart(
    3,
    "0",
  )}.png`;
}

function webName(frame) {
  return `nevora-one-take_f${padded(frame)}.webp`;
}

await mkdir(outputDirectory, { recursive: true });
const existing = await readdir(outputDirectory);
if (existing.length > 0) {
  throw new Error(
    `Web-frame destination is not empty: ${outputDirectory}. Refusing to overwrite.`,
  );
}

const frames = [];
for (const range of ranges) {
  for (let frame = range.start; frame <= range.end; frame += 1) {
    const source = path.join(
      storyboardRoot,
      range.directory,
      masterName(frame, range.version),
    );
    const output = path.join(outputDirectory, webName(frame));
    await stat(source);
    await sharp(source, { failOn: "error" })
      .resize(outputSize, outputSize, {
        fit: "fill",
        kernel: sharp.kernel.lanczos3,
      })
      .toColourspace("srgb")
      .webp({
        quality: 82,
        alphaQuality: 100,
        effort: 5,
        smartSubsample: true,
      })
      .toFile(output);

    frames.push({
      frame,
      beat: range.beat,
      source: path.relative(projectRoot, source).replaceAll("\\", "/"),
      web: `/images/journey/frames/${webName(frame)}`,
      bytes: (await stat(output)).size,
    });
    process.stdout.write(`Built web F${frame} (${frames.length}/144)\n`);
  }
}

const manifest = {
  project: "NEVORA",
  version: 1,
  status: "local cinematic preview",
  start_frame: 204,
  end_frame: 347,
  frame_count: frames.length,
  timeline_fps: 24,
  width: outputSize,
  height: outputSize,
  format: "webp",
  quality: 82,
  total_bytes: frames.reduce((total, frame) => total + frame.bytes, 0),
  frames,
};

await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
process.stdout.write(`Completed ${frames.length} web frames.\n`);
process.stdout.write(`Manifest: ${manifestPath}\n`);
