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
  "roaster-entry-pilot-keyframes",
);
const outputDirectory = path.join(
  storyboardRoot,
  "roaster-entry-masters-2k",
);
const manifestPath = path.join(
  outputDirectory,
  "nevora-one-take_f0348-f0395_master-manifest-v001.json",
);

const startFrame = 348;
const endFrame = 395;
const masterSize = 2048;
const frameRate = 24;

function padded(frame) {
  return String(frame).padStart(4, "0");
}

function sourceName(frame) {
  return `nevora-one-take_f${padded(frame)}_key-v001.png`;
}

function masterName(frame) {
  return `nevora-one-take_f${padded(frame)}_v001.png`;
}

async function sha256(filePath) {
  return createHash("sha256").update(await readFile(filePath)).digest("hex");
}

async function assertResumableDestination() {
  await mkdir(outputDirectory, { recursive: true });
  const existing = await readdir(outputDirectory);
  const expectedNames = new Set(
    Array.from({ length: endFrame - startFrame + 1 }, (_, index) =>
      masterName(startFrame + index),
    ),
  );
  expectedNames.add(path.basename(manifestPath));
  const unexpected = existing.filter((name) => !expectedNames.has(name));
  if (unexpected.length > 0) {
    throw new Error(
      `Master destination contains unexpected files: ${unexpected.join(", ")}`,
    );
  }
}

async function buildFrame(frame) {
  const source = path.join(sourceDirectory, sourceName(frame));
  const output = path.join(outputDirectory, masterName(frame));
  await stat(source);
  const sourceMetadata = await sharp(source).metadata();
  let buildMode = "rendered";

  try {
    await stat(output);
    buildMode = "reused";
  } catch {
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
  }

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
    build_mode: buildMode,
  };
}

await assertResumableDestination();

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
  sequence: "roaster threshold contact to cold drum interior",
  version: 1,
  status: "production pilot master",
  start_frame: startFrame,
  end_frame: endFrame,
  frame_count: frames.length,
  frame_rate: frameRate,
  duration_seconds: frames.length / frameRate,
  master_width: masterSize,
  master_height: masterSize,
  boundary_anchors: {
    preceding:
      "docs/homepage/storyboards/drying-pilot-keyframes/nevora-one-take_f0347_key-v004.png",
    following:
      "docs/homepage/storyboards/roaster-entry-production-anchors/nevora-one-take_f0396_anchor-v001.png",
  },
  continuity_audit: {
    report:
      "docs/homepage/storyboards/roaster-entry-continuity-metrics-v1.json",
    review:
      "docs/homepage/storyboards/roaster-entry-review-sequence-v1.jpg",
    visual_rules: [
      "Exactly one hero seed in every frame.",
      "No ghosted crossfade or transparent duplicate.",
      "Seed remains pale and unroasted through F395.",
      "Physical wood-to-steel and steel-floor contact remains visible.",
    ],
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
  `Completed ${frames.length} masters at ${masterSize}x${masterSize}.\n`,
);
process.stdout.write(`Manifest: ${manifestPath}\n`);
