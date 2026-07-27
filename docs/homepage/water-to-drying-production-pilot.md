# NEVORA — Water-to-Drying Production Pilot

Status: **48/48 review frames, 48/48 2K masters, and the two-second 24 fps movie are approved.**

This pilot owns frames **F252–F299** and hands directly to the approved
**F300 v002** first-contact boundary. It proves that one identifiable pale
coffee seed can leave the receding cherry skin, travel through mineral water,
approach the drying rail, and reach the instant before physical contact without
a cut or dissolve.

## Approved sequence

![F252–F299 final review sheet](./storyboards/water-to-drying-review-sequence-v4.jpg)

| Frames | Active version | Visual responsibility |
|---:|---:|---|
| F252–F259 | v001 | Seed clears the two red peel lobes while scale and seam stay locked |
| F260–F267 | v001 | Seed becomes the sole hero; peel recedes and softens |
| F268–F275 | v001 | Bubble and caustic flow straighten into a rightward carrier |
| F276–F283 | v001 | Seed becomes fully independent; peel exits the hero plane |
| F284–F291 | v001 | Underwater carrier aligns toward the future drying boundary |
| F292–F298 | v003 | Wet wooden rail enters progressively from the upper-right |
| F299 | v004 | A thin water band remains between seed and wet wood |
| F300 boundary | v002 | First physical contact; same composition, only the gap closes |

## Approved delivery

- [Interactive forward/reverse frame scrub](./storyboards/nevora-one-take_f0252-f0299_scrub-v001.html)
- [Final 2048 × 2048 MP4](./storyboards/nevora-one-take_f0252-f0299_preview-v001.mp4)
- [Video QC contact sheet](./storyboards/nevora-one-take_f0252-f0299_video-qc-v001.jpg)
- [48-frame numbered review sheet](./storyboards/water-to-drying-review-sequence-v4.jpg)
- [Continuity metric report](./storyboards/water-to-drying-continuity-metrics-v4.json)
- [48-frame 2K master folder](./storyboards/water-to-drying-masters-2k/)
- [2K master manifest](./storyboards/water-to-drying-masters-2k/nevora-one-take_f0252-f0299_master-manifest-v001.json)

Verified movie properties:

- 48 frames
- 24 fps
- 2.000 seconds
- 2048 × 2048
- H.264, yuv420p
- BT.709 primaries, transfer, and matrix

## Continuity audit

The first full extraction exposed a hard environment pop at **F291→F292**
and a composition mismatch at the original **F299→F300** boundary.

The approved correction:

1. Rebuilt F292–F298 as sequential standalone frames.
2. Rebuilt F299 against F298 instead of forcing it into the old F300
   composition.
3. Rebuilt F300 v002 as a one-change contact frame from F299 v004.
4. Preserved all rejected versions for traceability.

Normalized mean absolute RGB differences:

| Transition | Before | Approved |
|---|---:|---:|
| F291→F292 | 0.089078 | 0.032289 |
| F298→F299 | 0.049050 in the original run; 0.145727 during the first endpoint correction | 0.039324 |
| F299→F300 | 0.140991 | 0.004502 |

The metric is a jump detector, not an artistic score. Final approval also used
the numbered sheet, full-size frame inspection, forward stepping, and reverse
scrub.

## Version and archive rules

- Active review proxies live directly in
  `storyboards/water-to-drying-pilot-keyframes/`.
- Superseded F292–F299 proxies live in
  `storyboards/water-to-drying-pilot-keyframes/rejected/`.
- The rejected optical interpolation test remains in
  `storyboards/water-to-drying-interpolated-frames-v2/` and must not enter a
  delivery.
- Contact-sheet and standalone development images remain versioned in their
  source folders.
- Corrections increment the version; frame numbers never move.

## Production method

The visual sources were created with the built-in image-generation flow in
photorealistic-natural mode. Prompt sets were separated by responsibility:

- F252–F291: six short continuity runs for seed release, peel recession, and
  horizontal water-carrier alignment.
- F292–F298: sequential one-frame corrections with the previous frame as the
  dominant reference.
- F299: one-frame-before-contact boundary prompt.
- F300: first-contact-only prompt with camera, crop, lighting, scale, and
  exposure locked to F299.

Approved proxies were promoted deterministically to 2K with Lanczos3 resizing,
light sharpening, sRGB output, and no generative detail synthesis.

## Next production gate

Continue from **F300 v002** through **F347**:

- F300–F306: prove contact and transfer weight onto wet wood.
- F307–F320: retain a wet trail while motion transfers from water to the rail.
- F321–F335: reveal the drying bed without changing hero identity or direction.
- F336–F347: prepare the drying-to-roaster geometry owned by Transition Pack 03.

F300 v002 is now the immutable incoming reference for that run.
