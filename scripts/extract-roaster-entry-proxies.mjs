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

const storyboardRoot = path.join(projectRoot, "docs", "homepage", "storyboards");
const packDirectory = path.join(
  storyboardRoot,
  "roaster-entry-production-packs",
);
const outputDirectory = path.join(
  storyboardRoot,
  "roaster-entry-pilot-keyframes",
);
const reviewPath = path.join(
  storyboardRoot,
  "roaster-entry-review-sequence-v1.jpg",
);
const metricsPath = path.join(
  storyboardRoot,
  "roaster-entry-continuity-metrics-v1.json",
);

const packs = [
  { start: 348, file: "roaster-entry-run-01-f348-f355-v1.png" },
  { start: 356, file: "roaster-entry-run-02-f356-f363-v1.png" },
  { start: 364, file: "roaster-entry-run-03-f364-f371-v1.png" },
  { start: 372, file: "roaster-entry-run-04-f372-f379-v1.png" },
  { start: 380, file: "roaster-entry-run-05-f380-f387-v1.png" },
  { start: 388, file: "roaster-entry-run-06-f388-f395-v1.png" },
];

const proxySize = 512;
const columns = 4;
const rows = 2;

function padded(frame) {
  return String(frame).padStart(4, "0");
}

function proxyName(frame) {
  return `nevora-one-take_f${padded(frame)}_key-v001.png`;
}

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

function labelSvg(frame, width, height, role = "") {
  return Buffer.from(
    `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#090e0d"/>
      <text x="8" y="16" fill="#efbd72" font-family="Arial, sans-serif" font-size="13" font-weight="700">F${frame}${role ? ` · ${role}` : ""}</text>
    </svg>`,
  );
}

async function buildReview() {
  const cell = 160;
  const labelHeight = 22;
  const imageWidth = cell - 8;
  const imageHeight = cell - labelHeight - 4;
  const composites = [];

  for (let frame = 348; frame <= 395; frame += 1) {
    const index = frame - 348;
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
  return sharp(input)
    .resize(32, 32, { fit: "cover" })
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
      frame: 347,
      input: path.join(
        storyboardRoot,
        "drying-pilot-keyframes",
        "nevora-one-take_f0347_key-v004.png",
      ),
      role: "preceding_anchor",
    },
    ...manifest.map((entry) => ({
      frame: entry.frame,
      input: path.join(projectRoot, entry.output),
      role: "active_proxy",
    })),
    {
      frame: 396,
      input: path.join(
        storyboardRoot,
        "roaster-entry-production-anchors",
        "nevora-one-take_f0396_anchor-v001.png",
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

  const highestDifferences = [...transitions]
    .sort(
      (left, right) =>
        right.mean_absolute_rgb_difference - left.mean_absolute_rgb_difference,
    )
    .slice(0, 12);

  const report = {
    project: "NEVORA",
    sequence: "roaster threshold contact to cold drum interior",
    start_frame: 348,
    end_frame: 395,
    frame_count: 48,
    proxy_size: `${proxySize}x${proxySize}`,
    boundary_frames: {
      preceding: 347,
      following: 396,
    },
    identity_rules: [
      "Exactly one pale green hero seed per active frame.",
      "No browning, yellowing, chaff, vapor, flame, or background beans.",
      "Physical contact with wood/steel remains readable.",
    ],
    metric:
      "Mean absolute RGB difference after 32x32 cover normalization; jump detector only.",
    transitions,
    highest_differences: highestDifferences,
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
    .map(
      (item) =>
        `F${item.from}->F${item.to}=${item.mean_absolute_rgb_difference}`,
    )
    .join(", ")}\n`,
);
