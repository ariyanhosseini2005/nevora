import { createHash } from "node:crypto";
import { createRequire } from "node:module";
import { mkdir, readFile, readdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDirectory, "..");
const requireFromFrontend = createRequire(
  path.join(projectRoot, "frontend", "package.json"),
);
const sharp = requireFromFrontend("sharp");

const storyboardRoot = path.join(projectRoot, "docs", "homepage", "storyboards");
const sourceDirectory = path.join(
  storyboardRoot,
  "heat-acceptance-pilot-keyframes",
);
const outputDirectory = path.join(
  storyboardRoot,
  "heat-acceptance-masters-2k",
);
const manifestPath = path.join(
  outputDirectory,
  "nevora-one-take_f0396-f0443_master-manifest-v001.json",
);

const startFrame = 396;
const endFrame = 443;
const masterSize = 2048;
const frameRate = 24;

function padded(frame) {
  return String(frame).padStart(4, "0");
}

function sourceVersion(frame) {
  return frame <= 407 ? 2 : 1;
}

function sourceName(frame) {
  return `nevora-one-take_f${padded(frame)}_key-v${String(
    sourceVersion(frame),
  ).padStart(3, "0")}.png`;
}

function masterName(frame) {
  return `nevora-one-take_f${padded(frame)}_v001.png`;
}

async function sha256(filePath) {
  return createHash("sha256").update(await readFile(filePath)).digest("hex");
}

async function assertCleanDestination() {
  await mkdir(outputDirectory, { recursive: true });
  const existing = await readdir(outputDirectory);
  if (existing.length > 0) {
    throw new Error(
      `Master destination is not empty: ${outputDirectory}. Refusing to overwrite.`,
    );
  }
}

async function buildFrame(frame) {
  const source = path.join(sourceDirectory, sourceName(frame));
  const output = path.join(outputDirectory, masterName(frame));
  await stat(source);
  const sourceMetadata = await sharp(source).metadata();

  await sharp(source, { failOn: "error" })
    .resize(masterSize, masterSize, {
      fit: "fill",
      kernel: sharp.kernel.lanczos3,
    })
    .sharpen({ sigma: 0.8, m1: 0.6, m2: 1.2 })
    .toColourspace("srgb")
    .png({
      compressionLevel: 6,
      adaptiveFiltering: true,
      palette: false,
    })
    .toFile(output);

  const outputMetadata = await sharp(output).metadata();
  if (
    outputMetadata.width !== masterSize ||
    outputMetadata.height !== masterSize ||
    outputMetadata.format !== "png" ||
    outputMetadata.space !== "srgb"
  ) {
    throw new Error(
      `Master validation failed for F${frame}: ${JSON.stringify(outputMetadata)}`,
    );
  }

  return {
    frame,
    source: path.relative(projectRoot, source).replaceAll("\\", "/"),
    source_version: sourceVersion(frame),
    source_width: sourceMetadata.width,
    source_height: sourceMetadata.height,
    source_sha256: await sha256(source),
    master: path.relative(projectRoot, output).replaceAll("\\", "/"),
    master_width: outputMetadata.width,
    master_height: outputMetadata.height,
    master_format: outputMetadata.format,
    master_colourspace: outputMetadata.space,
    master_bytes: (await stat(output)).size,
    master_sha256: await sha256(output),
  };
}

await assertCleanDestination();

const frames = [];
for (let frame = startFrame; frame <= endFrame; frame += 1) {
  frames.push(await buildFrame(frame));
  process.stdout.write(`Rendered F${frame} (${frames.length}/48)\n`);
}

const manifest = {
  project: "NEVORA",
  sequence: "heat acceptance and controlled yellowing",
  version: 1,
  status: "production pilot master",
  start_frame: startFrame,
  end_frame: endFrame,
  frame_count: frames.length,
  frame_rate: frameRate,
  duration_seconds: frames.length / frameRate,
  master_width: masterSize,
  master_height: masterSize,
  active_sources: {
    "F396-F407": "v002 camera-scale continuity correction",
    "F408-F443": "v001 production sheets",
    "F444 boundary": "v001 early-cinnamon anchor",
  },
  continuity_audit: {
    report:
      "docs/homepage/storyboards/heat-acceptance-continuity-metrics-v2.json",
    review:
      "docs/homepage/storyboards/heat-acceptance-review-sequence-v2.jpg",
    visual_rules: [
      "Exactly one hero seed in every frame.",
      "No ghosted crossfade or transparent duplicate.",
      "Color progresses from pale green to early cinnamon without patches.",
      "No flame, smoke wall, background bean, oil, or char.",
    ],
  },
  scaling: {
    method: "deterministic",
    resize_kernel: "Lanczos3",
    sharpening: { sigma: 0.8, m1: 0.6, m2: 1.2 },
    png_compression_level: 6,
    generative_detail_synthesis: false,
  },
  frames,
};

await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
process.stdout.write(
  `Completed ${frames.length} masters at ${masterSize}x${masterSize}.\n`,
);
process.stdout.write(`Manifest: ${manifestPath}\n`);
