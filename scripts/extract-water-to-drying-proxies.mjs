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

const storyboardRoot = path.join(
  projectRoot,
  "docs",
  "homepage",
  "storyboards",
);
const packDirectory = path.join(storyboardRoot, "water-to-drying-packs");
const outputDirectory = path.join(
  storyboardRoot,
  "water-to-drying-pilot-keyframes",
);
const reviewPath = path.join(
  storyboardRoot,
  "water-to-drying-review-sequence-v1.jpg",
);
const metricsPath = path.join(
  storyboardRoot,
  "water-to-drying-continuity-metrics-v1.json",
);

const packs = [
  { start: 252, end: 259, file: "water-to-drying-run-01-f252-f259-v1.png" },
  { start: 260, end: 267, file: "water-to-drying-run-02-f260-f267-v1.png" },
  { start: 268, end: 275, file: "water-to-drying-run-03-f268-f275-v1.png" },
  { start: 276, end: 283, file: "water-to-drying-run-04-f276-f283-v1.png" },
  { start: 284, end: 291, file: "water-to-drying-run-05-f284-f291-v1.png" },
  { start: 292, end: 299, file: "water-to-drying-run-06-f292-f299-v1.png" },
];

const proxySize = 512;
const gridColumns = 4;
const gridRows = 2;

function frameName(frame) {
  return `nevora-one-take_f${String(frame).padStart(4, "0")}_key-v001.png`;
}

async function assertCleanDestination() {
  await mkdir(outputDirectory, { recursive: true });
  const existing = await readdir(outputDirectory);
  if (existing.length > 0) {
    throw new Error(
      `Proxy destination is not empty: ${outputDirectory}. Use a new versioned directory instead of overwriting approved assets.`,
    );
  }
}

function cellCrop(width, height, index) {
  const column = index % gridColumns;
  const row = Math.floor(index / gridColumns);
  const x0 = Math.round((column * width) / gridColumns);
  const x1 = Math.round(((column + 1) * width) / gridColumns);
  const y0 = Math.round((row * height) / gridRows);
  const y1 = Math.round(((row + 1) * height) / gridRows);
  const inset = 4;
  const innerWidth = x1 - x0 - inset * 2;
  const innerHeight = y1 - y0 - inset * 2;
  const size = Math.min(innerWidth, innerHeight);

  return {
    left: x0 + inset + Math.floor((innerWidth - size) / 2),
    top: y0 + inset + Math.floor((innerHeight - size) / 2),
    width: size,
    height: size,
  };
}

async function extractFrames() {
  const manifest = [];

  for (const pack of packs) {
    const source = path.join(packDirectory, pack.file);
    const metadata = await sharp(source).metadata();
    if (!metadata.width || !metadata.height) {
      throw new Error(`Missing dimensions for ${source}`);
    }

    for (let index = 0; index < 8; index += 1) {
      const frame = pack.start + index;
      const output = path.join(outputDirectory, frameName(frame));
      const crop = cellCrop(metadata.width, metadata.height, index);

      await sharp(source, { failOn: "error" })
        .extract(crop)
        .resize(proxySize, proxySize, {
          fit: "fill",
          kernel: sharp.kernel.lanczos3,
        })
        .toColourspace("srgb")
        .png({ compressionLevel: 9, adaptiveFiltering: true })
        .toFile(output);

      manifest.push({
        frame,
        source_pack: pack.file,
        source_width: metadata.width,
        source_height: metadata.height,
        source_crop: crop,
        output: path.relative(projectRoot, output).replaceAll("\\", "/"),
      });
      process.stdout.write(`Extracted F${frame}\n`);
    }
  }

  return manifest;
}

function labelSvg(frame, width, height) {
  return Buffer.from(
    `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#071114"/>
      <text x="8" y="16" fill="#f0c878" font-family="Arial, sans-serif" font-size="13" font-weight="700">F${frame}</text>
    </svg>`,
  );
}

async function buildReviewSheet() {
  const cell = 160;
  const labelHeight = 22;
  const thumbnail = cell - 8;
  const width = cell * 8;
  const height = cell * 6;
  const composites = [];

  for (let frame = 252; frame <= 299; frame += 1) {
    const index = frame - 252;
    const column = index % 8;
    const row = Math.floor(index / 8);
    const left = column * cell + 4;
    const top = row * cell + labelHeight;
    const input = path.join(outputDirectory, frameName(frame));
    const thumbBuffer = await sharp(input)
      .resize(thumbnail, cell - labelHeight - 4, { fit: "cover" })
      .jpeg({ quality: 90 })
      .toBuffer();

    composites.push({ input: labelSvg(frame, thumbnail, labelHeight), left, top: row * cell });
    composites.push({ input: thumbBuffer, left, top });
  }

  await sharp({
    create: {
      width,
      height,
      channels: 3,
      background: "#071114",
    },
  })
    .composite(composites)
    .jpeg({ quality: 94, chromaSubsampling: "4:4:4" })
    .toFile(reviewPath);
}

async function normalizedRaw(input) {
  const metadata = await sharp(input).metadata();
  const side = Math.min(metadata.width ?? 1, metadata.height ?? 1);
  const left = Math.floor(((metadata.width ?? side) - side) / 2);
  const top = Math.floor(((metadata.height ?? side) - side) / 2);
  return sharp(input)
    .extract({ left, top, width: side, height: side })
    .resize(32, 32, { fit: "fill" })
    .removeAlpha()
    .toColourspace("srgb")
    .raw()
    .toBuffer();
}

function meanAbsoluteDifference(left, right) {
  let sum = 0;
  const length = Math.min(left.length, right.length);
  for (let index = 0; index < length; index += 1) {
    sum += Math.abs(left[index] - right[index]);
  }
  return sum / length / 255;
}

async function buildMetrics(manifest) {
  const sequence = [
    {
      frame: 251,
      input: path.join(
        storyboardRoot,
        "basket-to-water-pilot-masters-2k",
        "nevora-one-take_f0251_v001.png",
      ),
      role: "preceding_anchor",
    },
    ...manifest.map((entry) => ({
      frame: entry.frame,
      input: path.join(projectRoot, entry.output),
      role: "active_proxy",
    })),
    {
      frame: 300,
      input: path.join(
        storyboardRoot,
        "water-to-drying-production-anchors",
        "nevora-one-take_f0300_anchor-v001.png",
      ),
      role: "following_anchor",
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
        meanAbsoluteDifference(raw[index - 1], raw[index]).toFixed(6),
      ),
    });
  }

  const ranked = [...transitions].sort(
    (left, right) =>
      right.mean_absolute_rgb_difference - left.mean_absolute_rgb_difference,
  );

  const report = {
    project: "NEVORA",
    sequence: "water-to-drying production pilot",
    start_frame: 252,
    end_frame: 299,
    frame_count: 48,
    proxy_size: `${proxySize}x${proxySize}`,
    metric:
      "Mean absolute RGB difference after center-crop and 32x32 normalization; used as a jump detector, not as an artistic approval score.",
    transitions,
    highest_differences: ranked.slice(0, 12),
    extraction_manifest: manifest,
  };

  await writeFile(metricsPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");
  return report;
}

await assertCleanDestination();
const manifest = await extractFrames();
await buildReviewSheet();
const report = await buildMetrics(manifest);

process.stdout.write(`Completed ${manifest.length} proxies at ${proxySize}x${proxySize}.\n`);
process.stdout.write(`Review: ${reviewPath}\n`);
process.stdout.write(`Metrics: ${metricsPath}\n`);
process.stdout.write(
  `Highest differences: ${report.highest_differences
    .slice(0, 8)
    .map(
      (item) =>
        `F${item.from}->F${item.to}=${item.mean_absolute_rgb_difference}`,
    )
    .join(", ")}\n`,
);
