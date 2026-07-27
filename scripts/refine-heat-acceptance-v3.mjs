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
const keyframeDirectory = path.join(
  storyboardRoot,
  "heat-acceptance-pilot-keyframes",
);
const reviewPath = path.join(
  storyboardRoot,
  "heat-acceptance-review-sequence-v3.jpg",
);
const metricsPath = path.join(
  storyboardRoot,
  "heat-acceptance-continuity-metrics-v3.json",
);

function padded(frame) {
  return String(frame).padStart(4, "0");
}

function proxyName(frame, version) {
  return `nevora-one-take_f${padded(frame)}_key-v${String(version).padStart(3, "0")}.png`;
}

function activeVersion(frame) {
  return frame <= 419 ? 3 : 1;
}

function smoothstep(value) {
  return value * value * (3 - 2 * value);
}

async function buildCameraEase() {
  for (let frame = 396; frame <= 419; frame += 1) {
    const progress = (frame - 396) / (419 - 396);
    const zoom = 1.58 + (1 - 1.58) * smoothstep(progress);
    const source = path.join(keyframeDirectory, proxyName(frame, 1));
    const output = path.join(keyframeDirectory, proxyName(frame, 3));

    try {
      await stat(output);
      throw new Error(`Refusing to overwrite: ${output}`);
    } catch (error) {
      if (error?.code !== "ENOENT") throw error;
    }

    const metadata = await sharp(source).metadata();
    const width = metadata.width ?? 512;
    const height = metadata.height ?? 512;
    const cropWidth = Math.max(1, Math.round(width / zoom));
    const cropHeight = Math.max(1, Math.round(height / zoom));
    const left = Math.floor((width - cropWidth) / 2);
    const top = Math.floor((height - cropHeight) / 2);

    await sharp(source, { failOn: "error" })
      .extract({ left, top, width: cropWidth, height: cropHeight })
      .resize(512, 512, {
        fit: "fill",
        kernel: sharp.kernel.lanczos3,
      })
      .sharpen({ sigma: 0.55, m1: 0.45, m2: 0.9 })
      .toColourspace("srgb")
      .png({ compressionLevel: 9, adaptiveFiltering: true })
      .toFile(output);
    process.stdout.write(`Camera-eased F${frame} · ${zoom.toFixed(3)}x\n`);
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

  for (let frame = 396; frame <= 443; frame += 1) {
    const index = frame - 396;
    const column = index % 8;
    const row = Math.floor(index / 8);
    const left = column * cell + 4;
    const top = row * cell + labelHeight;
    const version = activeVersion(frame);
    const thumbnail = await sharp(
      path.join(keyframeDirectory, proxyName(frame, version)),
    )
      .resize(imageWidth, imageHeight, { fit: "cover" })
      .jpeg({ quality: 91 })
      .toBuffer();
    composites.push({
      input: labelSvg(frame, imageWidth, labelHeight, version),
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
      frame: 395,
      input: path.join(
        storyboardRoot,
        "roaster-entry-pilot-keyframes",
        "nevora-one-take_f0395_key-v001.png",
      ),
      role: "preceding_anchor",
    },
    ...Array.from({ length: 48 }, (_, index) => {
      const frame = 396 + index;
      return {
        frame,
        input: path.join(
          keyframeDirectory,
          proxyName(frame, activeVersion(frame)),
        ),
        role: "active_proxy",
      };
    }),
    {
      frame: 444,
      input: path.join(
        storyboardRoot,
        "heat-acceptance-production-anchors",
        "nevora-one-take_f0444_anchor-v001.png",
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
    sequence: "heat acceptance and controlled yellowing",
    version: 3,
    status: "approved deterministic camera-ease revision",
    start_frame: 396,
    end_frame: 443,
    active_sources: {
      "F396-F419": "v003 deterministic camera pull-back from v001 clean frames",
      "F420-F443": "v001 production sheets",
      "F444 boundary": "v001 early-cinnamon anchor",
    },
    correction: {
      method: "single-frame center crop and Lanczos3 resize; no crossfade",
      start_zoom: 1.58,
      end_zoom: 1,
      easing: "smoothstep",
      duplicate_or_ghost_creation: false,
    },
    metric:
      "Mean absolute RGB difference after 32x32 cover normalization; jump detector only.",
    transitions,
    highest_differences: highestDifferences,
  };

  await writeFile(metricsPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");
  return report;
}

await buildCameraEase();
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
