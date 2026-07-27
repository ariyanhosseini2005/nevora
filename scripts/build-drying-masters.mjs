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
const sourceDirectory = path.join(storyboardRoot, "drying-pilot-keyframes");
const outputDirectory = path.join(storyboardRoot, "drying-masters-2k");
const manifestPath = path.join(
  outputDirectory,
  "nevora-one-take_f0300-f0347_master-manifest-v001.json",
);

const startFrame = 300;
const endFrame = 347;
const masterSize = 2048;
const frameRate = 24;
const resume = process.argv.includes("--resume");
const v3Frames = new Set([
  311, 315, 323, 327, 332, 333, 334, 337, 339, 345, 346, 347,
]);

function versionFor(frame) {
  return v3Frames.has(frame) ? 3 : 1;
}

function sourceName(frame) {
  return `nevora-one-take_f${String(frame).padStart(4, "0")}_key-v${String(
    versionFor(frame),
  ).padStart(3, "0")}.png`;
}

function masterName(frame) {
  return `nevora-one-take_f${String(frame).padStart(4, "0")}_v001.png`;
}

async function exists(filePath) {
  try {
    await stat(filePath);
    return true;
  } catch (error) {
    if (error?.code === "ENOENT") {
      return false;
    }
    throw error;
  }
}

async function sha256(filePath) {
  return createHash("sha256").update(await readFile(filePath)).digest("hex");
}

async function assertCleanDestination() {
  await mkdir(outputDirectory, { recursive: true });
  const existing = await readdir(outputDirectory);

  if (existing.length > 0 && !resume) {
    throw new Error(
      `Master destination is not empty: ${outputDirectory}. Use a new versioned directory or pass --resume for an interrupted build.`,
    );
  }

  if (resume) {
    const unexpected = existing.filter(
      (name) =>
        !/^nevora-one-take_f\d{4}_v001\.png$/.test(name) &&
        name !== path.basename(manifestPath),
    );
    if (unexpected.length > 0) {
      throw new Error(
        `Refusing to resume with unexpected files: ${unexpected.join(", ")}`,
      );
    }
  }
}

async function buildFrame(frame) {
  const source = path.join(sourceDirectory, sourceName(frame));
  const output = path.join(outputDirectory, masterName(frame));
  await stat(source);
  const sourceMetadata = await sharp(source).metadata();
  const reused = resume && (await exists(output));

  if (!reused) {
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
      `Master validation failed for F${frame}: ${JSON.stringify(
        outputMetadata,
      )}`,
    );
  }

  return {
    frame,
    source: path.relative(projectRoot, source).replaceAll("\\", "/"),
    source_version: versionFor(frame),
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
    resumed_existing_master: reused,
  };
}

await assertCleanDestination();

const frames = [];
for (let frame = startFrame; frame <= endFrame; frame += 1) {
  const result = await buildFrame(frame);
  frames.push(result);
  process.stdout.write(
    `${result.resumed_existing_master ? "Verified" : "Built"} F${frame} (${frames.length}/48)\n`,
  );
}

const manifest = {
  project: "NEVORA",
  sequence: "drying-bed to roaster-approach production pilot",
  version: 1,
  start_frame: startFrame,
  end_frame: endFrame,
  frame_count: frames.length,
  frame_rate: frameRate,
  duration_seconds: frames.length / frameRate,
  master_width: masterSize,
  master_height: masterSize,
  active_sources: {
    "F300-F310": "v001",
    F311: "v003 temporal bridge",
    "F312-F314": "v001",
    F315: "v003 temporal bridge",
    "F316-F322": "v001",
    F323: "v003 temporal bridge",
    "F324-F326": "v001",
    F327: "v003 temporal bridge",
    "F328-F331": "v001",
    "F332-F334": "v003 temporal bridges",
    "F335-F336": "v001",
    F337: "v003 temporal bridge",
    F338: "v001",
    F339: "v003 temporal bridge",
    "F340-F344": "v001",
    "F345-F347": "v003 eased pre-contact bridge",
    "F348 boundary anchor": "v003 first metal contact",
  },
  continuity_audit: {
    report:
      "docs/homepage/storyboards/drying-continuity-metrics-v3.json",
    review:
      "docs/homepage/storyboards/drying-review-sequence-v3.jpg",
    highest_internal_mean_absolute_rgb_difference: 0.069262,
  },
  scaling: {
    method: "deterministic",
    resize_kernel: "Lanczos3",
    sharpening: { sigma: 0.8, m1: 0.6, m2: 1.2 },
    generative_detail_synthesis: false,
    reason:
      "Preserve approved geometry, seed identity and temporal continuity across all frames.",
  },
  frames,
};

await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
process.stdout.write(
  `Completed ${frames.length} masters at ${masterSize}x${masterSize}.\n`,
);
process.stdout.write(`Manifest: ${manifestPath}\n`);
