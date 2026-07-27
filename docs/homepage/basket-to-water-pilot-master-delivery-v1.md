# NEVORA — Basket-to-Water 2K Master Delivery v1

Status: **Approved web-production master and 24 fps movie delivered.**

## Sequence delivery

| Property | Result |
|---|---:|
| Frame range | F204–F251 |
| Master-frame count | 48 |
| Missing or duplicated frames | 0 |
| Dimensions | 2048 × 2048 px |
| Format | PNG |
| Colour space | sRGB |
| Duration | 2.000 seconds |
| Frame rate | 24 fps |
| Total PNG size | 99.94 MB |

Master directory:

`storyboards/basket-to-water-pilot-masters-2k/`

Machine-readable frame manifest:

`storyboards/basket-to-water-pilot-masters-2k/nevora-one-take_f0204-f0251_master-manifest-v001.json`

Manifest SHA-256:

`827D2BEB600EAA1D4B2BD0BE6546F8DF515E39B8518311DD4E540E799112D612`

## Promotion method

The approved 439 × 439 proxy geometry was promoted deterministically with:

- Lanczos3 resize to 2048 × 2048
- one identical sharpening pass on every frame
- normalized sRGB output
- no generative detail synthesis
- per-frame source and master SHA-256 checksums

The deterministic path prevents a super-resolution model from changing the
locked basket geometry, coffee identity, peel anatomy, bubble positions, or
camera cadence independently from frame to frame.

Build script:

`scripts/build-basket-to-water-masters.mjs`

## Encoded movie

[Two-second 24 fps MP4](./storyboards/nevora-one-take_f0204-f0251_preview-v001.mp4)

| Property | Result |
|---|---:|
| Codec | H.264 High Profile |
| Dimensions | 2048 × 2048 px |
| Pixel format | yuv420p |
| Colour metadata | BT.709 |
| Average frame rate | 24/1 |
| Declared frame count | 48 |
| Decoded frame count | 48 |
| Duration | 2.000000 seconds |
| Approximate bitrate | 38.13 Mbps |
| File size | 9.53 MB |

Video SHA-256:

`643E3B67617188C806F14E1D065B481C4167C099A0104F88546D74820AA314A0`

Probe result:

`storyboards/nevora-one-take_f0204-f0251_preview-v001.ffprobe.json`

## Encode fidelity audit

The final MP4 was decoded back into 48 individual frames and every decoded
frame was compared directly with its corresponding 2K PNG master.

| Metric | Result |
|---|---:|
| Compared decoded frames | 48 |
| Mean RGB PSNR | 41.91 dB |
| Minimum RGB PSNR | 39.64 dB |
| Maximum RGB PSNR | 45.11 dB |
| Lowest-scoring frame | F229 |

The incomplete timestamp-based FFmpeg comparison logs were not accepted and are
retained separately under `storyboards/video-qc-rejected/`.

Visual decode sample:

![Decoded MP4 QC strip](./storyboards/nevora-one-take_f0204-f0251_video-qc-v001.jpg)

## Acceptance decision

Pass this delivery as the web-production master for the basket-to-water segment.
The 48-frame sequence can now be used for scroll-driven integration without
returning to the low-resolution proxies.

An archival EXR or 10-bit mezzanine delivery remains optional and is not
required for the current website pipeline.
