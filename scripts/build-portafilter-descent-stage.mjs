import { createHash } from "node:crypto";
import { createRequire } from "node:module";
import {
  copyFile,
  link,
  mkdir,
  readFile,
  readdir,
  stat,
  writeFile,
} from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(scriptDirectory, "..");
const requireFromFrontend = createRequire(path.join(root, "frontend", "package.json"));
const sharp = requireFromFrontend("sharp");
const storyboards = path.join(root, "docs", "homepage", "storyboards");
const packDir = path.join(storyboards, "portafilter-descent-production-packs");
const proxyDir = path.join(storyboards, "portafilter-descent-pilot-keyframes");
const masterDir = path.join(storyboards, "portafilter-descent-masters-2k");
const reviewPath = path.join(storyboards, "portafilter-descent-review-sequence-v1.jpg");
const metricsPath = path.join(storyboards, "portafilter-descent-continuity-metrics-v1.json");
const previousWebDir = path.join(root, "frontend", "public", "images", "journey", "frames-v005");
const webDir = path.join(root, "frontend", "public", "images", "journey", "frames-v006");

const packs = [
  { start: 540, file: "portafilter-descent-run-01-f540-f551-v1.png" },
  { start: 552, file: "portafilter-descent-run-02-f552-f563-v1.png" },
  { start: 564, file: "portafilter-descent-run-03-f564-f575-v1.png" },
  { start: 576, file: "portafilter-descent-run-04-f576-f587-v1.png" },
];
const startFrame = 540;
const endFrame = 587;
const columns = 4;
const rows = 3;

function padded(frame) {
  return String(frame).padStart(4, "0");
}
function keyName(frame) {
  return `nevora-one-take_f${padded(frame)}_key-v001.png`;
}
function masterName(frame) {
  return `nevora-one-take_f${padded(frame)}_v001.png`;
}
function webName(frame) {
  return `nevora-one-take_f${padded(frame)}.webp`;
}
function cropForCell(width, height, index) {
  const column = index % columns;
  const row = Math.floor(index / columns);
  const x0 = Math.round((column * width) / columns);
  const x1 = Math.round(((column + 1) * width) / columns);
  const y0 = Math.round((row * height) / rows);
  const y1 = Math.round(((row + 1) * height) / rows);
  const inset = Math.max(2, Math.round(Math.min(width, height) * 0.003));
  const innerWidth = x1 - x0 - inset * 2;
  const innerHeight = y1 - y0 - inset * 2;
  const side = Math.min(innerWidth, innerHeight);
  return {
    left: x0 + inset + Math.floor((innerWidth - side) / 2),
    top: y0 + inset + Math.floor((innerHeight - side) / 2),
    width: side,
    height: side,
  };
}
async function cleanDirectory(directory) {
  await mkdir(directory, { recursive: true });
  if ((await readdir(directory)).length > 0) {
    throw new Error(`Refusing to overwrite non-empty directory: ${directory}`);
  }
}
async function sha256(file) {
  return createHash("sha256").update(await readFile(file)).digest("hex");
}
async function normalizedRaw(input) {
  return sharp(input).resize(32, 32, { fit: "cover" }).removeAlpha().toColourspace("srgb").raw().toBuffer();
}
function difference(left, right) {
  let sum = 0;
  for (let index = 0; index < Math.min(left.length, right.length); index += 1) {
    sum += Math.abs(left[index] - right[index]);
  }
  return sum / Math.min(left.length, right.length) / 255;
}

await Promise.all([cleanDirectory(proxyDir), cleanDirectory(masterDir), cleanDirectory(webDir)]);

const extraction = [];
const anchor540 = path.join(
  storyboards,
  "grinder-transition-production-anchors",
  "nevora-one-take_f0540_anchor-v001.png",
);
await sharp(anchor540)
  .resize(512, 512, { fit: "fill", kernel: sharp.kernel.lanczos3 })
  .toColourspace("srgb")
  .png({ compressionLevel: 9, adaptiveFiltering: true })
  .toFile(path.join(proxyDir, keyName(540)));
extraction.push({ frame: 540, source: path.relative(root, anchor540).replaceAll("\\", "/") });

for (const pack of packs) {
  const source = path.join(packDir, pack.file);
  const metadata = await sharp(source).metadata();
  const firstIndex = pack.start === 540 ? 1 : 0;
  for (let index = firstIndex; index < 12; index += 1) {
    const frame = pack.start + index;
    await sharp(source)
      .extract(cropForCell(metadata.width, metadata.height, index))
      .resize(512, 512, { fit: "fill", kernel: sharp.kernel.lanczos3 })
      .toColourspace("srgb")
      .png({ compressionLevel: 9, adaptiveFiltering: true })
      .toFile(path.join(proxyDir, keyName(frame)));
    extraction.push({ frame, source_pack: pack.file });
  }
}

const cell = 160;
const composites = [];
for (let frame = startFrame; frame <= endFrame; frame += 1) {
  const index = frame - startFrame;
  const thumbnail = await sharp(path.join(proxyDir, keyName(frame)))
    .resize(152, 134, { fit: "cover" })
    .jpeg({ quality: 91 })
    .toBuffer();
  const label = Buffer.from(
    `<svg width="152" height="22" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#090e0d"/><text x="8" y="16" fill="#efbd72" font-family="Arial" font-size="13" font-weight="700">F${frame}</text></svg>`,
  );
  const left = (index % 8) * cell + 4;
  const top = Math.floor(index / 8) * cell;
  composites.push({ input: label, left, top }, { input: thumbnail, left, top: top + 22 });
}
await sharp({
  create: { width: 1280, height: 960, channels: 3, background: "#090e0d" },
})
  .composite(composites)
  .jpeg({ quality: 95, chromaSubsampling: "4:4:4" })
  .toFile(reviewPath);

const metricInputs = [
  {
    frame: 539,
    input: path.join(
      storyboards,
      "grinder-transition-pilot-keyframes",
      "nevora-one-take_f0539_key-v001.png",
    ),
  },
  ...Array.from({ length: 48 }, (_, index) => ({
    frame: startFrame + index,
    input: path.join(proxyDir, keyName(startFrame + index)),
  })),
];
const raw = [];
for (const entry of metricInputs) raw.push(await normalizedRaw(entry.input));
const transitions = raw.slice(1).map((value, index) => ({
  from: metricInputs[index].frame,
  to: metricInputs[index + 1].frame,
  mean_absolute_rgb_difference: Number(difference(raw[index], value).toFixed(6)),
  pack_boundary: [540, 552, 564, 576].includes(metricInputs[index + 1].frame),
}));
await writeFile(
  metricsPath,
  `${JSON.stringify({
    project: "NEVORA",
    sequence: "particle tunnel to portafilter descent",
    start_frame: startFrame,
    end_frame: endFrame,
    frame_count: 48,
    transitions,
    highest_differences: [...transitions]
      .sort((a, b) => b.mean_absolute_rgb_difference - a.mean_absolute_rgb_difference)
      .slice(0, 12),
    extraction,
  }, null, 2)}\n`,
  "utf8",
);

const masterFrames = [];
for (let frame = startFrame; frame <= endFrame; frame += 1) {
  const source = path.join(proxyDir, keyName(frame));
  const output = path.join(masterDir, masterName(frame));
  await sharp(source)
    .resize(2048, 2048, { fit: "fill", kernel: sharp.kernel.lanczos3 })
    .sharpen({ sigma: 0.8, m1: 0.6, m2: 1.2 })
    .toColourspace("srgb")
    .png({ compressionLevel: 6, adaptiveFiltering: true })
    .toFile(output);
  masterFrames.push({
    frame,
    source: path.relative(root, source).replaceAll("\\", "/"),
    master: path.relative(root, output).replaceAll("\\", "/"),
    bytes: (await stat(output)).size,
    sha256: await sha256(output),
  });
}
await writeFile(
  path.join(masterDir, "nevora-one-take_f0540-f0587_master-manifest-v001.json"),
  `${JSON.stringify({
    project: "NEVORA",
    sequence: "particle tunnel to portafilter descent",
    version: 1,
    start_frame: startFrame,
    end_frame: endFrame,
    frame_count: 48,
    frame_rate: 24,
    duration_seconds: 2,
    width: 2048,
    height: 2048,
    frames: masterFrames,
  }, null, 2)}\n`,
  "utf8",
);

async function reuseWeb(frame, output) {
  const source = path.join(previousWebDir, webName(frame));
  try {
    await link(source, output);
  } catch (error) {
    if (!["EXDEV", "EPERM", "EACCES", "ENOTSUP"].includes(error?.code)) throw error;
    await copyFile(source, output);
  }
}
const webFrames = [];
for (let frame = 204; frame <= endFrame; frame += 1) {
  const output = path.join(webDir, webName(frame));
  if (frame <= 539) {
    await reuseWeb(frame, output);
  } else {
    await sharp(path.join(masterDir, masterName(frame)))
      .resize(1280, 1280, { fit: "fill", kernel: sharp.kernel.lanczos3 })
      .toColourspace("srgb")
      .webp({ quality: 82, effort: 4, smartSubsample: true })
      .toFile(output);
  }
  webFrames.push({
    frame,
    beat: frame <= 539 ? "previous" : "portafilter-descent",
    web: `/images/journey/frames-v006/${webName(frame)}`,
    bytes: (await stat(output)).size,
  });
}
await writeFile(
  path.join(webDir, "manifest-v006.json"),
  `${JSON.stringify({
    project: "NEVORA",
    version: 6,
    start_frame: 204,
    end_frame: endFrame,
    frame_count: webFrames.length,
    added_frame_count: 48,
    timeline_fps: 24,
    width: 1280,
    height: 1280,
    format: "webp",
    total_bytes: webFrames.reduce((sum, frame) => sum + frame.bytes, 0),
    frames: webFrames,
  }, null, 2)}\n`,
  "utf8",
);

process.stdout.write(`Built 48 proxies, 48 masters, and ${webFrames.length} web frames.\n`);
process.stdout.write(`Review: ${reviewPath}\n`);
