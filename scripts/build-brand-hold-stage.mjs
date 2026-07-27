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
const proxyDir = path.join(storyboards, "brand-hold-pilot-keyframes");
const masterDir = path.join(storyboards, "brand-hold-masters-2k");
const reviewPath = path.join(storyboards, "brand-hold-review-sequence-v1.jpg");
const metricsPath = path.join(storyboards, "brand-hold-continuity-metrics-v1.json");
const previousWebDir = path.join(root, "frontend", "public", "images", "journey", "frames-v009");
const webDir = path.join(root, "frontend", "public", "images", "journey", "frames-v010");
const finalMaster = path.join(
  storyboards,
  "final-glass-masters-2k",
  "nevora-one-take_f0719_v001.png",
);
const startFrame = 720;
const endFrame = 743;
const frameCount = endFrame - startFrame + 1;

const padded = (frame) => String(frame).padStart(4, "0");
const keyName = (frame) => `nevora-one-take_f${padded(frame)}_key-v001.png`;
const masterName = (frame) => `nevora-one-take_f${padded(frame)}_v001.png`;
const webName = (frame) => `nevora-one-take_f${padded(frame)}.webp`;

async function cleanDirectory(directory) {
  await mkdir(directory, { recursive: true });
  if ((await readdir(directory)).length > 0) {
    throw new Error(`Refusing to overwrite non-empty directory: ${directory}`);
  }
}

async function reuse(source, output) {
  try {
    await link(source, output);
  } catch (error) {
    if (!["EXDEV", "EPERM", "EACCES", "ENOTSUP"].includes(error?.code)) throw error;
    await copyFile(source, output);
  }
}

async function sha256(file) {
  return createHash("sha256").update(await readFile(file)).digest("hex");
}

await Promise.all([cleanDirectory(proxyDir), cleanDirectory(masterDir), cleanDirectory(webDir)]);

const firstProxy = path.join(proxyDir, keyName(startFrame));
await sharp(finalMaster)
  .resize(512, 512, { fit: "fill", kernel: sharp.kernel.lanczos3 })
  .toColourspace("srgb")
  .png({ compressionLevel: 9, adaptiveFiltering: true })
  .toFile(firstProxy);

const masterFrames = [];
for (let frame = startFrame; frame <= endFrame; frame += 1) {
  const proxy = path.join(proxyDir, keyName(frame));
  const master = path.join(masterDir, masterName(frame));
  if (frame !== startFrame) await reuse(firstProxy, proxy);
  await reuse(finalMaster, master);
  masterFrames.push({
    frame,
    source_frame: 719,
    master: path.relative(root, master).replaceAll("\\", "/"),
    bytes: (await stat(master)).size,
    sha256: await sha256(master),
  });
}

const cell = 160;
const thumbnail = await sharp(firstProxy)
  .resize(152, 134, { fit: "cover" })
  .jpeg({ quality: 91 })
  .toBuffer();
const composites = [];
for (let frame = startFrame; frame <= endFrame; frame += 1) {
  const index = frame - startFrame;
  const label = Buffer.from(
    `<svg width="152" height="22" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#090e0d"/><text x="8" y="16" fill="#efbd72" font-family="Arial" font-size="13" font-weight="700">F${frame}</text></svg>`,
  );
  const left = (index % 8) * cell + 4;
  const top = Math.floor(index / 8) * cell;
  composites.push({ input: label, left, top }, { input: thumbnail, left, top: top + 22 });
}
await sharp({ create: { width: 1280, height: 480, channels: 3, background: "#090e0d" } })
  .composite(composites)
  .jpeg({ quality: 95, chromaSubsampling: "4:4:4" })
  .toFile(reviewPath);

await writeFile(
  metricsPath,
  `${JSON.stringify({
    project: "NEVORA",
    sequence: "post-film brand stillness hold",
    start_frame: startFrame,
    end_frame: endFrame,
    frame_count: frameCount,
    source_frame: 719,
    pixel_locked: true,
    transitions: Array.from({ length: frameCount }, (_, index) => ({
      from: 719 + index,
      to: 720 + index,
      mean_absolute_rgb_difference: 0,
    })),
  }, null, 2)}\n`,
  "utf8",
);

await writeFile(
  path.join(masterDir, "nevora-one-take_f0720-f0743_master-manifest-v001.json"),
  `${JSON.stringify({
    project: "NEVORA",
    sequence: "post-film brand stillness hold",
    start_frame: startFrame,
    end_frame: endFrame,
    frame_count: frameCount,
    frame_rate: 24,
    duration_seconds: 1,
    width: 2048,
    height: 2048,
    source_frame: 719,
    pixel_locked: true,
    frames: masterFrames,
  }, null, 2)}\n`,
  "utf8",
);

const webFrames = [];
for (let frame = 204; frame <= endFrame; frame += 1) {
  const output = path.join(webDir, webName(frame));
  const source =
    frame <= 719
      ? path.join(previousWebDir, webName(frame))
      : path.join(previousWebDir, webName(719));
  await reuse(source, output);
  webFrames.push({
    frame,
    beat: frame <= 719 ? "previous" : "brand-hold",
    source_frame: frame <= 719 ? frame : 719,
    web: `/images/journey/frames-v010/${webName(frame)}`,
    bytes: (await stat(output)).size,
  });
}

await writeFile(
  path.join(webDir, "manifest-v010.json"),
  `${JSON.stringify({
    project: "NEVORA",
    version: 10,
    start_frame: 204,
    end_frame: endFrame,
    frame_count: webFrames.length,
    added_frame_count: frameCount,
    timeline_fps: 24,
    width: 1280,
    height: 1280,
    format: "webp",
    brand_hold_source_frame: 719,
    brand_hold_pixel_locked: true,
    total_bytes: webFrames.reduce((sum, frame) => sum + frame.bytes, 0),
    frames: webFrames,
  }, null, 2)}\n`,
  "utf8",
);

process.stdout.write(`Built ${frameCount} locked hold masters and ${webFrames.length} web frames.\n`);
process.stdout.write(`Review: ${reviewPath}\n`);
