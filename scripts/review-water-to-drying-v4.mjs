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

const storyboardRoot = path.join(
  projectRoot,
  "docs",
  "homepage",
  "storyboards",
);
const proxyDirectory = path.join(
  storyboardRoot,
  "water-to-drying-pilot-keyframes",
);
const reviewPath = path.join(
  storyboardRoot,
  "water-to-drying-review-sequence-v4.jpg",
);
const metricsPath = path.join(
  storyboardRoot,
  "water-to-drying-continuity-metrics-v4.json",
);

function versionFor(frame) {
  if (frame === 299) {
    return 4;
  }
  return frame >= 292 ? 3 : 1;
}

function proxyPath(frame) {
  return path.join(
    proxyDirectory,
    `nevora-one-take_f${String(frame).padStart(4, "0")}_key-v${String(
      versionFor(frame),
    ).padStart(3, "0")}.png`,
  );
}

function labelSvg(frame, version, width, height) {
  return Buffer.from(
    `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#071114"/>
      <text x="7" y="15" fill="#f0c878" font-family="Arial, sans-serif" font-size="12" font-weight="700">F${frame} · v${String(version).padStart(3, "0")}</text>
    </svg>`,
  );
}

async function buildReview() {
  const cell = 160;
  const labelHeight = 22;
  const imageWidth = cell - 8;
  const imageHeight = cell - labelHeight - 4;
  const composites = [];

  for (let frame = 252; frame <= 299; frame += 1) {
    const index = frame - 252;
    const column = index % 8;
    const row = Math.floor(index / 8);
    const left = column * cell + 4;
    const top = row * cell + labelHeight;
    const input = proxyPath(frame);
    await stat(input);
    const thumbnail = await sharp(input)
      .resize(imageWidth, imageHeight, { fit: "cover" })
      .jpeg({ quality: 91 })
      .toBuffer();

    composites.push({
      input: labelSvg(frame, versionFor(frame), imageWidth, labelHeight),
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
      background: "#071114",
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

function meanAbsoluteDifference(left, right) {
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
      frame: 251,
      version: 1,
      role: "preceding_anchor",
      input: path.join(
        storyboardRoot,
        "basket-to-water-pilot-masters-2k",
        "nevora-one-take_f0251_v001.png",
      ),
    },
    ...Array.from({ length: 48 }, (_, index) => {
      const frame = 252 + index;
      return {
        frame,
        version: versionFor(frame),
        role: "active_proxy",
        input: proxyPath(frame),
      };
    }),
    {
      frame: 300,
      version: 2,
      role: "following_anchor",
      input: path.join(
        storyboardRoot,
        "water-to-drying-production-anchors",
        "nevora-one-take_f0300_anchor-v002.png",
      ),
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
      from_version: sequence[index - 1].version,
      to_version: sequence[index].version,
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
    active_version: 4,
    active_versions: {
      "F252-F291": 1,
      "F292-F298": 3,
      F299: 4,
      "F300 boundary": 2,
    },
    frame_count: 48,
    frame_rate: 24,
    duration_seconds: 2,
    metric:
      "Mean absolute RGB difference after center-crop and 32x32 normalization. This flags visual jumps but does not replace artistic review.",
    transitions,
    highest_differences: ranked.slice(0, 12),
  };

  await writeFile(metricsPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");
  return report;
}

await buildReview();
const report = await buildMetrics();

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
