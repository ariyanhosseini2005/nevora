import { createRequire } from "node:module";
import {
  copyFile,
  link,
  mkdir,
  readdir,
  stat,
  writeFile,
} from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDirectory, "..");
const requireFromFrontend = createRequire(
  path.join(projectRoot, "frontend", "package.json"),
);
const sharp = requireFromFrontend("sharp");

const storyboardRoot = path.join(projectRoot, "docs", "homepage", "storyboards");
const previousDirectory = path.join(
  projectRoot,
  "frontend",
  "public",
  "images",
  "journey",
  "frames-v003",
);
const outputDirectory = path.join(
  projectRoot,
  "frontend",
  "public",
  "images",
  "journey",
  "frames-v004",
);
const manifestPath = path.join(outputDirectory, "manifest-v004.json");

const startFrame = 204;
const previousEndFrame = 443;
const endFrame = 491;
const outputSize = 1280;

function padded(frame) {
  return String(frame).padStart(4, "0");
}

function webName(frame) {
  return `nevora-one-take_f${padded(frame)}.webp`;
}

function masterName(frame) {
  return `nevora-one-take_f${padded(frame)}_v001.png`;
}

function beatForFrame(frame) {
  if (frame <= 227) return "basket-release";
  if (frame <= 299) return "water-to-drying";
  if (frame <= 331) return "drying";
  if (frame <= 347) return "roaster-threshold";
  if (frame <= 395) return "roaster-entry";
  if (frame <= 443) return "heat-acceptance";
  return "roast-development";
}

async function assertCleanDestination() {
  await mkdir(outputDirectory, { recursive: true });
  const existing = await readdir(outputDirectory);
  if (existing.length > 0) {
    throw new Error(
      `Web-frame v004 destination is not empty: ${outputDirectory}. Refusing to overwrite.`,
    );
  }
}

async function reusePreviousFrame(frame, output) {
  const source = path.join(previousDirectory, webName(frame));
  await stat(source);
  try {
    await link(source, output);
    return { source, mode: "hardlink" };
  } catch (error) {
    if (!["EXDEV", "EPERM", "EACCES", "ENOTSUP"].includes(error?.code)) {
      throw error;
    }
    await copyFile(source, output);
    return { source, mode: "copy" };
  }
}

async function buildNewFrame(frame, output) {
  const source = path.join(
    storyboardRoot,
    "roast-development-masters-2k",
    masterName(frame),
  );
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
      effort: 4,
      smartSubsample: true,
    })
    .toFile(output);
  return { source, mode: "rendered" };
}

await assertCleanDestination();

const frames = [];
for (let frame = startFrame; frame <= endFrame; frame += 1) {
  const output = path.join(outputDirectory, webName(frame));
  const build =
    frame <= previousEndFrame
      ? await reusePreviousFrame(frame, output)
      : await buildNewFrame(frame, output);

  frames.push({
    frame,
    beat: beatForFrame(frame),
    source: path.relative(projectRoot, build.source).replaceAll("\\", "/"),
    web: `/images/journey/frames-v004/${webName(frame)}`,
    bytes: (await stat(output)).size,
    build_mode: build.mode,
  });
  process.stdout.write(
    `${build.mode === "rendered" ? "Built" : "Reused"} web F${frame} (${frames.length}/288)\n`,
  );
}

const manifest = {
  project: "NEVORA",
  version: 4,
  status: "local cinematic preview",
  start_frame: startFrame,
  end_frame: endFrame,
  frame_count: frames.length,
  timeline_fps: 24,
  width: outputSize,
  height: outputSize,
  format: "webp",
  quality: 82,
  previous_frame_count: previousEndFrame - startFrame + 1,
  added_frame_count: endFrame - previousEndFrame,
  total_bytes: frames.reduce((total, frame) => total + frame.bytes, 0),
  frames,
};

await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
process.stdout.write(`Completed ${frames.length} web frames.\n`);
process.stdout.write(`Manifest: ${manifestPath}\n`);
