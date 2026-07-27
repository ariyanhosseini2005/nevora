# NEVORA — Drying-Bed to Roaster-Approach Production Pilot

Status: **Approved clean-frame revision v002**

This production slice completes canonical frames **F300–F347**. It begins at
the water/wood boundary, reveals the drying bed without a cut, approaches the
industrial roaster mouth, and stops one frame before the seed first touches the
lower steel lip.

## Approved deliverables

- 48 consecutive clean master frames at **2048 × 2048**
- 48-frame H.264 review movie at **24 fps**
- Exact review duration: **2.000 seconds**
- Pixel format and color metadata: **yuv420p / BT.709**
- Interactive forward/reverse frame scrub
- Full contact review and transition-difference audit
- Immutable outgoing boundary: **F348 v004**, first physical metal contact

## Approved files

- Master sequence:
  `storyboards/drying-masters-2k-v002/nevora-one-take_f0300_v002.png`
  through `nevora-one-take_f0347_v002.png`
- Master manifest:
  `storyboards/drying-masters-2k-v002/nevora-one-take_f0300-f0347_master-manifest-v002.json`
- Movie:
  `storyboards/nevora-one-take_f0300-f0347_preview-v002.mp4`
- Interactive scrub:
  `storyboards/nevora-one-take_f0300-f0347_scrub-v002.html`
- QC sheet:
  `storyboards/nevora-one-take_f0300-f0347_video-qc-v002.jpg`
- Active sequence review:
  `storyboards/drying-review-sequence-v4.jpg`
- Continuity metrics:
  `storyboards/drying-continuity-metrics-v4.json`
- Outgoing F348 boundary:
  `storyboards/drying-production-anchors/nevora-one-take_f0348_anchor-v004.png`

## Visual continuity result

The approved v002 revision removes every duplicate/transparent seed created by
the rejected crossfade experiment. F311, F315, F323, and F327 use clean
single-seed generated intermediates. F332–F339 restore the cleaner original
camera progression. F345–F347 use a restrained three-frame camera ease while
the seed remains fully supported by wood; F348 is the first metal-contact
frame.

The automated RGB-difference report remains a jump detector, not the approval
criterion. Visual frame stepping, reverse scrub, physical support, single-seed
identity, and the absence of crossfade ghosts are the governing checks.

## Production and image-generation method

Anchor and correction imagery was made with the built-in image-generation
flow in photorealistic luxury-advertising mode: warm motivated light, macro
optics, tactile aged wood, wet pale seed material, and patinated industrial
steel. Generation prompts locked the same seed identity, camera direction,
wood-to-steel tangent, no premature roasting, and no first metal contact before
F348.

Approved geometry was then normalized deterministically with Lanczos3 resizing,
controlled sharpening, sRGB PNG output, SHA-256 manifests, and a lossless
frame-count pipeline. No generative detail synthesis was used during the 2K
master build.

## Superseded comparison

Preview v001 and its 2K masters are retained only as a rejected comparison.
They reduced the numeric transition score with crossfade bridges but created
visible duplicate-seed artifacts. They must not be used by the website.

## Next gate

Produce **F348–F395**, entering the roaster from the locked F348 v004 contact
frame. The seed remains pale until the dedicated heat-transformation range
begins at F396.
