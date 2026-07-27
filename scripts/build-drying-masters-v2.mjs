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
const projectRoot = path.resolve(scriptDirectory, "..");
const requireFromFrontend = createRequire(
  path.join(projectRoot, "frontend", "package.json"),
);
const sharp = requireFromFrontend("sharp");

const storyboardRoot = path.join(projectRoot, "docs", "homepage", "storyboards");
const sourceDirectory = path.join(storyboardRoot, "drying-pilot-keyframes");
const previousMasterDirectory = path.join(
  storyboardRoot,
  "drying-masters-2k",
);
const outputDirectory = path.join(storyboardRoot, "drying-masters-2k-v002");
const manifestPath = path.join(
  outputDirectory,
  "nevora-one-take_f0300-f0347_master-manifest-v002.json",
);

const startFrame = 300;
const endFrame = 347;
const masterSize = 2048;
const frameRate = 24;
const changedFrames = new Set([
  311, 315, 323, 327, 332, 333, 334, 337, 339, 345, 346, 347,
]);

function padded(frame) {
  return String(frame).padStart(4, "0");
}

function sourceName(frame) {
  const version = changedFrames.has(frame) ? 4 : 1;
  return `nevora-one-take_f${padded(frame)}_key-v${String(version).padStart(
    3,
    "0",
  )}.png`;
}

function previousMasterName(frame) {
  return `nevora-one-take_f${padded(frame)}_v001.png`;
}

function masterName(frame) {
  return `nevora-one-take_f${padded(frame)}_v002.png`;
}

async function sha256(filePath) {
  return createHash("sha256").update(await readFile(filePath)).digest("hex");
}

async function assertCleanDestination() {
  await mkdir(outputDirectory, { recursive: true });
  const existing = await readdir(outputDirectory);
  if (existing.length > 0) {
    throw new Error(
      `Master v002 destination is not empty: ${outputDirectory}. Refusing to overwrite.`,
    );
  }
}

async function reuseUnchanged(frame, output) {
  const previous = path.join(
    previousMasterDirectory,
    previousMasterName(frame),
  );
  await stat(previous);
  try {
    await link(previous, output);
    return "hardlink";
  } catch (error) {
    if (!["EXDEV", "EPERM", "EACCES", "ENOTSUP"].includes(error?.code)) {
      throw error;
    }
    await copyFile(previous, output);
    return "copy";
  }
}

async function buildFrame(frame) {
  const source = path.join(sourceDirectory, sourceName(frame));
  const output = path.join(outputDirectory, masterName(frame));
  await stat(source);
  const sourceMetadata = await sharp(source).metadata();
  let buildMode = "rendered";

  if (changedFrames.has(frame)) {
    await sharp(source, { failOn: "error" })
      .resize(masterSize, masterSize, {
        fit: "fill",
        kernel: sharp.kernel.lanczos3,
      })
      .sharpen({ sigma: 0.8, m1: 0.6, m2: 1.2 })
      .toColourspace("srgb")
      .png({
        compressionLevel: 9,
        adaptiveFiltering: true,
        palette: false,
      })
      .toFile(output);
  } else {
    buildMode = await reuseUnchanged(frame, output);
  }

  const outputMetadata = await sharp(output).metadata();
  if (
    outputMetadata.width !== masterSize ||
    outputMetadata.height !== masterSize ||
    outputMetadata.format !== "png" ||
    outputMetadata.space !== "srgb"
  ) {
    throw new Error(
      `Master validation failed for F${frame}: ${JSON.stringify(
        outputMetadata,
      )}`,
    );
  }

  return {
    frame,
    source: path.relative(projectRoot, source).replaceAll("\\", "/"),
    source_version: changedFrames.has(frame) ? 4 : 1,
    source_width: sourceMetadata.width,
    source_height: sourceMetadata.height,
    source_sha256: await sha256(source),
    master: path.relative(projectRoot, output).replaceAll("\\", "/"),
    master_version: 2,
    master_width: outputMetadata.width,
    master_height: outputMetadata.height,
    master_format: outputMetadata.format,
    master_colourspace: outputMetadata.space,
    master_bytes: (await stat(output)).size,
    master_sha256: await sha256(output),
    build_mode: buildMode,
  };
}

await assertCleanDestination();

const frames = [];
for (let frame = startFrame; frame <= endFrame; frame += 1) {
  const result = await buildFrame(frame);
  frames.push(result);
  process.stdout.write(
    `${result.build_mode === "rendered" ? "Rendered" : "Reused"} F${frame} (${frames.length}/48)\n`,
  );
}

const manifest = {
  project: "NEVORA",
  sequence: "drying-bed to roaster-approach production pilot",
  version: 2,
  status: "approved clean-frame revision",
  supersedes: "master version 1 with crossfade ghost artifacts",
  start_frame: startFrame,
  end_frame: endFrame,
  frame_count: frames.length,
  frame_rate: frameRate,
  duration_seconds: frames.length / frameRate,
  master_width: masterSize,
  master_height: masterSize,
  active_sources: {
    "F300-F310": "v001",
    F311: "v004 clean generated bridge",
    "F312-F314": "v001",
    F315: "v004 clean generated bridge",
    "F316-F322": "v001",
    F323: "v004 clean generated bridge",
    "F324-F326": "v001",
    F327: "v004 clean generated bridge",
    "F328-F331": "v001",
    "F332-F334": "v004 restored clean camera sequence",
    "F335-F336": "v001",
    F337: "v004 restored clean camera sequence",
    F338: "v001",
    F339: "v004 restored clean camera sequence",
    "F340-F344": "v001",
    "F345-F347": "v004 clean pre-contact camera ease",
    "F348 boundary anchor": "v004 first metal contact",
  },
  continuity_audit: {
    report:
      "docs/homepage/storyboards/drying-continuity-metrics-v4.json",
    review:
      "docs/homepage/storyboards/drying-review-sequence-v4.jpg",
    visual_rule: "No duplicate or transparent seed in any approved frame.",
  },
  scaling: {
    method: "deterministic",
    resize_kernel: "Lanczos3",
    sharpening: { sigma: 0.8, m1: 0.6, m2: 1.2 },
    generative_detail_synthesis: false,
  },
  frames,
};

await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
process.stdout.write(
  `Completed ${frames.length} clean masters at ${masterSize}x${masterSize}.\n`,
);
process.stdout.write(`Manifest: ${manifestPath}\n`);
