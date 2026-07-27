import { createHash } from "node:crypto";
import { createRequire } from "node:module";
import { copyFile, link, mkdir, readFile, readdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(scriptDirectory, "..");
const requireFromFrontend = createRequire(path.join(root, "frontend", "package.json"));
const sharp = requireFromFrontend("sharp");
const storyboards = path.join(root, "docs", "homepage", "storyboards");
const stageName = process.env.NEVORA_BUILD_STAGE ?? "bed-to-extraction";
const stageConfigs = {
  "bed-to-extraction": {
    slug: "bed-to-extraction",
    sequence: "tamping to first extraction",
    startFrame: 588,
    endFrame: 635,
    previousEndFrame: 587,
    previousProxySlug: "portafilter-descent",
    previousWebVersion: 6,
    webVersion: 7,
    beat: "extraction",
    packs: [
      { start: 588, file: "bed-to-extraction-run-01-f588-f599-v1.png" },
      { start: 600, file: "bed-to-extraction-run-02-f600-f611-v1.png" },
      { start: 612, file: "bed-to-extraction-run-03-f612-f623-v1.png" },
      { start: 624, file: "bed-to-extraction-run-04-f624-f635-v1.png" },
    ],
  },
  "extraction-to-glass": {
    slug: "extraction-to-glass",
    sequence: "established extraction to first crema bloom",
    startFrame: 636,
    endFrame: 683,
    previousEndFrame: 635,
    previousProxySlug: "bed-to-extraction",
    previousWebVersion: 7,
    webVersion: 8,
    beat: "glass",
    packs: [
      { start: 636, file: "extraction-to-glass-run-01-f636-f647-v1.png" },
      { start: 648, file: "extraction-to-glass-run-02-f648-f659-v1.png" },
      { start: 660, file: "extraction-to-glass-run-03-f660-f671-v1.png" },
      { start: 672, file: "extraction-to-glass-run-04-f672-f683-v1.png" },
    ],
  },
  "final-glass": {
    slug: "final-glass",
    sequence: "final pullback to completed espresso ritual",
    startFrame: 684,
    endFrame: 719,
    previousEndFrame: 683,
    previousProxySlug: "extraction-to-glass",
    previousWebVersion: 8,
    webVersion: 9,
    beat: "final-glass",
    packs: [
      { start: 684, file: "final-glass-run-01-f684-f695-v1.png" },
      { start: 696, file: "final-glass-run-02-f696-f707-v1.png" },
      { start: 708, file: "final-glass-run-03-f708-f719-v1.png" },
    ],
  },
};
const stage = stageConfigs[stageName];
if (!stage) throw new Error(`Unknown NEVORA_BUILD_STAGE: ${stageName}`);

const {
  slug,
  sequence,
  startFrame,
  endFrame,
  previousEndFrame,
  previousProxySlug,
  previousWebVersion,
  webVersion,
  beat,
  packs,
} = stage;
const packDir = path.join(storyboards, `${slug}-production-packs`);
const proxyDir = path.join(storyboards, `${slug}-pilot-keyframes`);
const masterDir = path.join(storyboards, `${slug}-masters-2k`);
const reviewPath = path.join(storyboards, `${slug}-review-sequence-v1.jpg`);
const metricsPath = path.join(storyboards, `${slug}-continuity-metrics-v1.json`);
const previousWebDir = path.join(
  root,
  "frontend",
  "public",
  "images",
  "journey",
  `frames-v${String(previousWebVersion).padStart(3, "0")}`,
);
const webDir = path.join(
  root,
  "frontend",
  "public",
  "images",
  "journey",
  `frames-v${String(webVersion).padStart(3, "0")}`,
);
const columns = 4;
const rows = 3;
const stageFrameCount = endFrame - startFrame + 1;
const durationSeconds = stageFrameCount / 24;

const padded = (frame) => String(frame).padStart(4, "0");
const keyName = (frame) => `nevora-one-take_f${padded(frame)}_key-v001.png`;
const masterName = (frame) => `nevora-one-take_f${padded(frame)}_v001.png`;
const webName = (frame) => `nevora-one-take_f${padded(frame)}.webp`;

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
  return sharp(input)
    .resize(32, 32, { fit: "cover" })
    .removeAlpha()
    .toColourspace("srgb")
    .raw()
    .toBuffer();
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
for (const pack of packs) {
  const source = path.join(packDir, pack.file);
  const metadata = await sharp(source).metadata();
  for (let index = 0; index < 12; index += 1) {
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
  create: {
    width: 1280,
    height: Math.ceil(stageFrameCount / 8) * cell,
    channels: 3,
    background: "#090e0d",
  },
})
  .composite(composites)
  .jpeg({ quality: 95, chromaSubsampling: "4:4:4" })
  .toFile(reviewPath);

const metricInputs = [
  {
    frame: previousEndFrame,
    input: path.join(
      storyboards,
      `${previousProxySlug}-pilot-keyframes`,
      keyName(previousEndFrame),
    ),
  },
  ...Array.from({ length: stageFrameCount }, (_, index) => ({
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
  pack_boundary: packs.map((pack) => pack.start).includes(metricInputs[index + 1].frame),
}));
await writeFile(
  metricsPath,
  `${JSON.stringify({
    project: "NEVORA",
    sequence,
    start_frame: startFrame,
    end_frame: endFrame,
    frame_count: stageFrameCount,
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
  path.join(
    masterDir,
    `nevora-one-take_f${padded(startFrame)}-f${padded(endFrame)}_master-manifest-v001.json`,
  ),
  `${JSON.stringify({
    project: "NEVORA",
    sequence,
    version: 1,
    start_frame: startFrame,
    end_frame: endFrame,
    frame_count: stageFrameCount,
    frame_rate: 24,
    duration_seconds: durationSeconds,
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
  if (frame <= previousEndFrame) {
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
    beat: frame <= previousEndFrame ? "previous" : beat,
    web: `/images/journey/frames-v${String(webVersion).padStart(3, "0")}/${webName(frame)}`,
    bytes: (await stat(output)).size,
  });
}
await writeFile(
  path.join(webDir, `manifest-v${String(webVersion).padStart(3, "0")}.json`),
  `${JSON.stringify({
    project: "NEVORA",
    version: webVersion,
    start_frame: 204,
    end_frame: endFrame,
    frame_count: webFrames.length,
    added_frame_count: stageFrameCount,
    timeline_fps: 24,
    width: 1280,
    height: 1280,
    format: "webp",
    total_bytes: webFrames.reduce((sum, frame) => sum + frame.bytes, 0),
    frames: webFrames,
  }, null, 2)}\n`,
  "utf8",
);

process.stdout.write(
  `Built ${stageFrameCount} proxies, ${stageFrameCount} masters, and ${webFrames.length} web frames.\n`,
);
process.stdout.write(`Review: ${reviewPath}\n`);
