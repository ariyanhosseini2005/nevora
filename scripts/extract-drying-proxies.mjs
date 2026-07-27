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
const packDirectory = path.join(storyboardRoot, "drying-production-packs");
const outputDirectory = path.join(storyboardRoot, "drying-pilot-keyframes");
const reviewPath = path.join(storyboardRoot, "drying-review-sequence-v1.jpg");
const metricsPath = path.join(
  storyboardRoot,
  "drying-continuity-metrics-v1.json",
);

const packs = [
  { start: 300, file: "drying-run-01-f300-f307-v1.png" },
  { start: 308, file: "drying-run-02-f308-f315-v1.png" },
  { start: 316, file: "drying-run-03-f316-f323-v1.png" },
  { start: 324, file: "drying-run-04-f324-f331-v1.png" },
  { start: 332, file: "drying-run-05-f332-f339-v1.png" },
  { start: 340, file: "drying-run-06-f340-f347-v1.png" },
];

const proxySize = 512;
const columns = 4;
const rows = 2;

function proxyName(frame, version = 1) {
  return `nevora-one-take_f${String(frame).padStart(4, "0")}_key-v${String(
    version,
  ).padStart(3, "0")}.png`;
}

function cropForCell(width, height, index) {
  const column = index % columns;
  const row = Math.floor(index / columns);
  const x0 = Math.round((column * width) / columns);
  const x1 = Math.round(((column + 1) * width) / columns);
  const y0 = Math.round((row * height) / rows);
  const y1 = Math.round(((row + 1) * height) / rows);
  const inset = 4;
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

async function assertCleanDestination() {
  await mkdir(outputDirectory, { recursive: true });
  const existing = await readdir(outputDirectory);
  if (existing.length > 0) {
    throw new Error(
      `Proxy destination is not empty: ${outputDirectory}. Use a new version instead of overwriting.`,
    );
  }
}

async function extractFrames() {
  const manifest = [];
  for (const pack of packs) {
    const source = path.join(packDirectory, pack.file);
    const metadata = await sharp(source).metadata();
    if (!metadata.width || !metadata.height) {
      throw new Error(`Missing source dimensions: ${source}`);
    }

    for (let index = 0; index < 8; index += 1) {
      const frame = pack.start + index;
      const crop = cropForCell(metadata.width, metadata.height, index);
      const output = path.join(outputDirectory, proxyName(frame));
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
      <rect width="100%" height="100%" fill="#090e0d"/>
      <text x="8" y="16" fill="#efbd72" font-family="Arial, sans-serif" font-size="13" font-weight="700">F${frame}</text>
    </svg>`,
  );
}

async function buildReview() {
  const cell = 160;
  const labelHeight = 22;
  const imageWidth = cell - 8;
  const imageHeight = cell - labelHeight - 4;
  const composites = [];

  for (let frame = 300; frame <= 347; frame += 1) {
    const index = frame - 300;
    const column = index % 8;
    const row = Math.floor(index / 8);
    const left = column * cell + 4;
    const top = row * cell + labelHeight;
    const thumbnail = await sharp(
      path.join(outputDirectory, proxyName(frame)),
    )
      .resize(imageWidth, imageHeight, { fit: "cover" })
      .jpeg({ quality: 91 })
      .toBuffer();
    composites.push({
      input: labelSvg(frame, imageWidth, labelHeight),
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

async function buildMetrics(manifest) {
  const sequence = [
    {
      frame: 299,
      input: path.join(
        storyboardRoot,
        "water-to-drying-pilot-keyframes",
        "nevora-one-take_f0299_key-v004.png",
      ),
      role: "preceding_anchor",
    },
    ...manifest.map((entry) => ({
      frame: entry.frame,
      input: path.join(projectRoot, entry.output),
      role: "active_proxy",
    })),
    {
      frame: 348,
      input: path.join(
        storyboardRoot,
        "drying-production-anchors",
        "nevora-one-take_f0348_anchor-v001.png",
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
        difference(raw[index - 1], raw[index]).toFixed(6),
      ),
    });
  }
  const ranked = [...transitions].sort(
    (left, right) =>
      right.mean_absolute_rgb_difference - left.mean_absolute_rgb_difference,
  );
  const report = {
    project: "NEVORA",
    sequence: "water contact to drying-bed and roaster approach",
    start_frame: 300,
    end_frame: 347,
    frame_count: 48,
    proxy_size: `${proxySize}x${proxySize}`,
    metric:
      "Mean absolute RGB difference after center-crop and 32x32 normalization; jump detector only.",
    transitions,
    highest_differences: ranked.slice(0, 12),
    extraction_manifest: manifest,
  };
  await writeFile(metricsPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");
  return report;
}

await assertCleanDestination();
const manifest = await extractFrames();
await buildReview();
const report = await buildMetrics(manifest);

process.stdout.write(`Completed ${manifest.length} proxies.\n`);
process.stdout.write(`Review: ${reviewPath}\n`);
process.stdout.write(`Metrics: ${metricsPath}\n`);
process.stdout.write(
  `Highest differences: ${report.highest_differences
    .slice(0, 10)
    .map(
      (item) =>
        `F${item.from}->F${item.to}=${item.mean_absolute_rgb_difference}`,
    )
    .join(", ")}\n`,
);
