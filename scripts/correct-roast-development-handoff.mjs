import { createRequire } from "node:module";
import { stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDirectory, "..");
const requireFromFrontend = createRequire(
  path.join(projectRoot, "frontend", "package.json"),
);
const sharp = requireFromFrontend("sharp");

const storyboardRoot = path.join(projectRoot, "docs", "homepage", "storyboards");
const corrections = [
  {
    start: 444,
    file: "roast-development-run-01-f444-f455-v2.png",
  },
  {
    start: 480,
    file: "roast-development-run-04-f480-f491-v2.png",
  },
];
const proxyDirectory = path.join(
  storyboardRoot,
  "roast-development-pilot-keyframes",
);
const reviewPath = path.join(
  storyboardRoot,
  "roast-development-review-sequence-v3.jpg",
);
const metricsPath = path.join(
  storyboardRoot,
  "roast-development-continuity-metrics-v3.json",
);

const startFrame = 444;
const endFrame = 491;
const columns = 4;
const rows = 3;
const proxySize = 512;

function padded(frame) {
  return String(frame).padStart(4, "0");
}

function versionForFrame(frame) {
  return frame <= 455 || frame >= 480 ? 2 : 1;
}

function proxyName(frame, version = versionForFrame(frame)) {
  return `nevora-one-take_f${padded(frame)}_key-v${String(version).padStart(
    3,
    "0",
  )}.png`;
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

async function extractCorrection() {
  for (const correction of corrections) {
    const sourcePath = path.join(
      storyboardRoot,
      "roast-development-production-packs",
      correction.file,
    );
    const metadata = await sharp(sourcePath).metadata();
    if (!metadata.width || !metadata.height) {
      throw new Error(`Missing source dimensions: ${sourcePath}`);
    }

    for (let index = 0; index < 12; index += 1) {
      const frame = correction.start + index;
      const output = path.join(proxyDirectory, proxyName(frame, 2));
      try {
        await stat(output);
        process.stdout.write(`Kept existing corrected F${frame}\n`);
        continue;
      } catch (error) {
        if (error?.code !== "ENOENT") throw error;
      }

      await sharp(sourcePath, { failOn: "error" })
        .extract(cropForCell(metadata.width, metadata.height, index))
        .resize(proxySize, proxySize, {
          fit: "fill",
          kernel: sharp.kernel.lanczos3,
        })
        .toColourspace("srgb")
        .png({ compressionLevel: 9, adaptiveFiltering: true })
        .toFile(output);
      process.stdout.write(`Corrected F${frame}\n`);
    }
  }
}

function labelSvg(frame, version, width, height) {
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
    const version = versionForFrame(frame);
    const left = column * cell + 4;
    const top = row * cell + labelHeight;
    const thumbnail = await sharp(
      path.join(proxyDirectory, proxyName(frame, version)),
    )
      .resize(imageWidth, imageHeight, { fit: "cover" })
      .jpeg({ quality: 91 })
      .toBuffer();
    composites.push({
      input: labelSvg(frame, version, imageWidth, labelHeight),
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

async function buildMetrics() {
  const sequence = [
    {
      frame: 443,
      input: path.join(
        storyboardRoot,
        "heat-acceptance-pilot-keyframes",
        "nevora-one-take_f0443_key-v001.png",
      ),
      role: "preceding_anchor",
    },
  ];
  for (let frame = startFrame; frame <= endFrame; frame += 1) {
    sequence.push({
      frame,
      input: path.join(proxyDirectory, proxyName(frame)),
      role: "active_proxy",
      version: versionForFrame(frame),
    });
  }
  sequence.push({
    frame: 492,
    input: path.join(
      storyboardRoot,
      "roast-development-production-anchors",
      "nevora-one-take_f0492_anchor-v001.png",
    ),
    role: "following_anchor",
  });

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
      pack_boundary: [444, 456, 468, 480, 492].includes(
        sequence[index].frame,
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
    sequence: "roast development and grinder handoff",
    version: 3,
    start_frame: startFrame,
    end_frame: endFrame,
    frame_count: 48,
    active_sources: {
      "F444-F455": "v002 entry-boundary continuity correction",
      "F456-F479": "v001 production sheets",
      "F480-F491": "v002 camera-scale and background continuity correction",
      "F492 boundary": "v001 crease-ownership anchor",
    },
    boundary_frames: { preceding: 443, following: 492 },
    metric:
      "Mean absolute RGB difference after 32x32 cover normalization; jump detector only.",
    transitions,
    highest_differences: highestDifferences,
  };
  await writeFile(metricsPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");
  return report;
}

await extractCorrection();
await buildReview();
const report = await buildMetrics();
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
