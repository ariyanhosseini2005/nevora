import { createRequire } from "node:module";
import {
  access,
  mkdir,
  readdir,
  rename,
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
const proxyDirectory = path.join(storyboardRoot, "drying-pilot-keyframes");
const rejectedDirectory = path.join(proxyDirectory, "rejected");
const correctionDirectory = path.join(
  storyboardRoot,
  "drying-production-frames",
);
const reviewPath = path.join(storyboardRoot, "drying-review-sequence-v4.jpg");
const metricsPath = path.join(
  storyboardRoot,
  "drying-continuity-metrics-v4.json",
);
const followingAnchorPath = path.join(
  storyboardRoot,
  "drying-production-anchors",
  "nevora-one-take_f0348_anchor-v004.png",
);

const startFrame = 300;
const endFrame = 347;
const proxySize = 512;
const v4Frames = new Set([
  311, 315, 323, 327, 332, 333, 334, 337, 339, 345, 346, 347,
]);
const generatedCorrectionFrames = new Set([311, 315, 323, 327]);
const restoredOriginalFrames = new Set([332, 333, 334, 337, 339]);

function padded(frame) {
  return String(frame).padStart(4, "0");
}

function proxyName(frame, version) {
  return `nevora-one-take_f${padded(frame)}_key-v${String(version).padStart(
    3,
    "0",
  )}.png`;
}

function proxyPath(frame, version) {
  return path.join(proxyDirectory, proxyName(frame, version));
}

function activeVersion(frame) {
  return v4Frames.has(frame) ? 4 : 1;
}

function activeProxyPath(frame) {
  return proxyPath(frame, activeVersion(frame));
}

async function exists(input) {
  try {
    await access(input);
    return true;
  } catch {
    return false;
  }
}

async function renderProxy(source, output) {
  if (await exists(output)) {
    throw new Error(`Refusing to overwrite clean proxy: ${output}`);
  }
  await sharp(source, { failOn: "error" })
    .resize(proxySize, proxySize, {
      fit: "cover",
      kernel: sharp.kernel.lanczos3,
    })
    .toColourspace("srgb")
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .toFile(output);
}

async function buildCleanFrames() {
  for (const frame of generatedCorrectionFrames) {
    const source = path.join(
      correctionDirectory,
      `nevora-one-take_f${padded(frame)}_v002.png`,
    );
    await renderProxy(source, proxyPath(frame, 4));
    process.stdout.write(`Built clean single-seed F${frame} v004.\n`);
  }

  for (const frame of restoredOriginalFrames) {
    const source = path.join(rejectedDirectory, proxyName(frame, 1));
    await renderProxy(source, proxyPath(frame, 4));
    process.stdout.write(`Restored clean original F${frame} as v004.\n`);
  }

  const holdSource = proxyPath(344, 1);
  const holdFrames = [
    { frame: 345, scale: 1.003 },
    { frame: 346, scale: 1.006 },
    { frame: 347, scale: 1.009 },
  ];
  for (const { frame, scale } of holdFrames) {
    const size = Math.ceil(proxySize * scale);
    const output = proxyPath(frame, 4);
    if (await exists(output)) {
      throw new Error(`Refusing to overwrite clean hold frame: ${output}`);
    }
    await sharp(holdSource)
      .resize(size, size, {
        fit: "fill",
        kernel: sharp.kernel.lanczos3,
      })
      .extract({
        left: Math.floor((size - proxySize) / 2),
        top: Math.floor((size - proxySize) / 2),
        width: proxySize,
        height: proxySize,
      })
      .toColourspace("srgb")
      .png({ compressionLevel: 9, adaptiveFiltering: true })
      .toFile(output);
    process.stdout.write(`Built pre-contact camera hold F${frame} v004.\n`);
  }

  const firstContactSource = path.join(rejectedDirectory, proxyName(345, 1));
  await sharp(firstContactSource)
    .resize(1258, 1258, {
      fit: "fill",
      kernel: sharp.kernel.lanczos3,
    })
    .toColourspace("srgb")
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .toFile(followingAnchorPath);
}

async function archiveV3() {
  await mkdir(rejectedDirectory, { recursive: true });
  for (const frame of v4Frames) {
    const source = proxyPath(frame, 3);
    const destination = path.join(rejectedDirectory, proxyName(frame, 3));
    if (!(await exists(source))) {
      throw new Error(`Missing v003 proxy to archive: ${source}`);
    }
    if (await exists(destination)) {
      throw new Error(`Refusing to overwrite rejected v003: ${destination}`);
    }
    await rename(source, destination);
    process.stdout.write(`Archived F${frame} v003.\n`);
  }
}

function labelSvg(frame, width, height, version) {
  return Buffer.from(
    `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#090e0d"/>
      <text x="8" y="16" fill="#efbd72" font-family="Arial, sans-serif" font-size="13" font-weight="700">F${frame} · v${version}</text>
    </svg>`,
  );
}

async function buildReview() {
  const cell = 160;
  const labelHeight = 22;
  const imageWidth = cell - 8;
  const imageHeight = cell - labelHeight - 4;
  const composites = [];

  for (let frame = startFrame; frame <= endFrame; frame += 1) {
    const index = frame - startFrame;
    const column = index % 8;
    const row = Math.floor(index / 8);
    const left = column * cell + 4;
    const top = row * cell + labelHeight;
    const thumbnail = await sharp(activeProxyPath(frame))
      .resize(imageWidth, imageHeight, { fit: "cover" })
      .jpeg({ quality: 91 })
      .toBuffer();
    composites.push({
      input: labelSvg(frame, imageWidth, labelHeight, activeVersion(frame)),
      left,
      top: row * cell,
    });
    composites.push({ input: thumbnail, left, top });
  }

  await sharp({
    create: {
      width: cell * 8,
      height: cell * 6,
      channels: 3,
      background: "#090e0d",
    },
  })
    .composite(composites)
    .jpeg({ quality: 95, chromaSubsampling: "4:4:4" })
    .toFile(reviewPath);
}

async function normalizedRaw(input) {
  const metadata = await sharp(input).metadata();
  const width = metadata.width ?? 1;
  const height = metadata.height ?? 1;
  const side = Math.min(width, height);
  return sharp(input)
    .extract({
      left: Math.floor((width - side) / 2),
      top: Math.floor((height - side) / 2),
      width: side,
      height: side,
    })
    .resize(32, 32)
    .removeAlpha()
    .toColourspace("srgb")
    .raw()
    .toBuffer();
}

function difference(left, right) {
  let sum = 0;
  const length = Math.min(left.length, right.length);
  for (let index = 0; index < length; index += 1) {
    sum += Math.abs(left[index] - right[index]);
  }
  return sum / length / 255;
}

async function buildMetrics() {
  const sequence = [
    {
      frame: 299,
      input: path.join(
        storyboardRoot,
        "water-to-drying-pilot-keyframes",
        "nevora-one-take_f0299_key-v004.png",
      ),
      role: "preceding_anchor",
      version: 4,
    },
    ...Array.from(
      { length: endFrame - startFrame + 1 },
      (_, index) => startFrame + index,
    ).map((frame) => ({
      frame,
      input: activeProxyPath(frame),
      role: "active_proxy",
      version: activeVersion(frame),
    })),
    {
      frame: 348,
      input: followingAnchorPath,
      role: "following_anchor",
      version: 4,
    },
  ];

  const raw = [];
  for (const entry of sequence) {
    await stat(entry.input);
    raw.push(await normalizedRaw(entry.input));
  }

  const transitions = [];
  for (let index = 1; index < sequence.length; index += 1) {
    transitions.push({
      from: sequence[index - 1].frame,
      to: sequence[index].frame,
      mean_absolute_rgb_difference: Number(
        difference(raw[index - 1], raw[index]).toFixed(6),
      ),
    });
  }

  const ranked = [...transitions].sort(
    (left, right) =>
      right.mean_absolute_rgb_difference - left.mean_absolute_rgb_difference,
  );
  const activeFiles = (await readdir(proxyDirectory, { withFileTypes: true }))
    .filter((entry) => entry.isFile() && entry.name.endsWith(".png"))
    .map((entry) => entry.name)
    .sort();

  if (activeFiles.length !== 48) {
    throw new Error(`Expected 48 active proxies, found ${activeFiles.length}.`);
  }

  const report = {
    project: "NEVORA",
    sequence: "water contact to drying-bed and roaster approach",
    start_frame: startFrame,
    end_frame: endFrame,
    frame_count: 48,
    proxy_size: `${proxySize}x${proxySize}`,
    clean_single_seed_frames: [...v4Frames],
    temporal_method:
      "Clean generated single-seed intermediates, restored original camera frames, and a three-frame pre-contact camera ease; no crossfade ghost frames.",
    following_anchor: {
      frame: 348,
      version: 4,
      role: "first physical contact with the roaster lip",
    },
    metric:
      "Mean absolute RGB difference after center-crop and 32x32 normalization; jump detector only.",
    transitions,
    highest_differences: ranked.slice(0, 12),
    active_files: activeFiles,
  };
  await writeFile(metricsPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");
  return report;
}

await buildCleanFrames();
await archiveV3();
await buildReview();
const report = await buildMetrics();

process.stdout.write(`Review: ${reviewPath}\n`);
process.stdout.write(`Metrics: ${metricsPath}\n`);
process.stdout.write(
  `Highest differences: ${report.highest_differences
    .slice(0, 12)
    .map(
      (item) =>
        `F${item.from}->F${item.to}=${item.mean_absolute_rgb_difference}`,
    )
    .join(", ")}\n`,
);
