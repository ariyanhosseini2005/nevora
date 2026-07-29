import { mkdir, readFile, readdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const START_FRAME = 204;
const END_FRAME = 719;
const CONCURRENCY = 4;
const appRoot = process.cwd();
const journeyRoot = path.join(appRoot, "public", "images", "journey");
const sourceDirectory = path.join(journeyRoot, "frames-v010");
const sourceManifest = JSON.parse(await readFile(path.join(sourceDirectory, "manifest-v010.json"), "utf8"));
const sourceFrames = new Map(sourceManifest.frames.map((frame) => [frame.frame, frame]));

const tiers = [
  { directory: "frames-v010-1024", size: 1024, quality: 80 },
  { directory: "frames-v010-768", size: 768, quality: 78 },
];

function frameFileName(frame) {
  return `nevora-one-take_f${String(frame).padStart(4, "0")}.webp`;
}

async function ensureEmptyDirectory(directory) {
  try {
    const entries = await readdir(directory);
    if (entries.length > 0) {
      throw new Error(`${path.relative(appRoot, directory)} already contains files.`);
    }
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && error.code === "ENOENT") {
      await mkdir(directory, { recursive: true });
      return;
    }
    throw error;
  }
}

async function runWithConcurrency(items, worker) {
  let cursor = 0;

  await Promise.all(
    Array.from({ length: Math.min(CONCURRENCY, items.length) }, async () => {
      while (cursor < items.length) {
        const item = items[cursor];
        cursor += 1;
        await worker(item);
      }
    }),
  );
}

async function buildTier(tier) {
  const destinationDirectory = path.join(journeyRoot, tier.directory);
  await ensureEmptyDirectory(destinationDirectory);

  const frames = Array.from({ length: END_FRAME - START_FRAME + 1 }, (_, index) => START_FRAME + index);
  const outputFrames = [];
  let completed = 0;

  await runWithConcurrency(frames, async (frame) => {
    const filename = frameFileName(frame);
    const input = path.join(sourceDirectory, filename);
    const output = path.join(destinationDirectory, filename);

    await sharp(input, { failOn: "error" })
      .resize(tier.size, tier.size, { fit: "fill", kernel: sharp.kernel.lanczos3 })
      .toColourspace("srgb")
      .webp({
        quality: tier.quality,
        alphaQuality: 100,
        effort: 4,
        smartSubsample: true,
      })
      .toFile(output);

    const outputStat = await stat(output);
    const sourceFrame = sourceFrames.get(frame);
    outputFrames.push({
      frame,
      beat: sourceFrame?.beat ?? null,
      source_frame: frame,
      web: `/images/journey/${tier.directory}/${filename}`,
      bytes: outputStat.size,
    });

    completed += 1;
    if (completed % 64 === 0 || completed === frames.length) {
      console.log(`${tier.directory}: ${completed}/${frames.length}`);
    }
  });

  outputFrames.sort((first, second) => first.frame - second.frame);
  const totalBytes = outputFrames.reduce((total, frame) => total + frame.bytes, 0);
  const manifest = {
    project: "NEVORA",
    version: 10,
    source_directory: "frames-v010",
    start_frame: START_FRAME,
    end_frame: END_FRAME,
    frame_count: outputFrames.length,
    timeline_fps: 24,
    width: tier.size,
    height: tier.size,
    format: "webp",
    quality: tier.quality,
    total_bytes: totalBytes,
    frames: outputFrames,
  };

  await writeFile(
    path.join(destinationDirectory, `manifest-v010-${tier.size}.json`),
    `${JSON.stringify(manifest, null, 2)}\n`,
  );
  console.log(`${tier.directory}: ${(totalBytes / 1024 / 1024).toFixed(2)} MiB`);
}

for (const tier of tiers) {
  await buildTier(tier);
}
