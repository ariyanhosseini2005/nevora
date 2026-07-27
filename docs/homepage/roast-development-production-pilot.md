# NEVORA — Roast Development Production Pilot

Status: F444–F491 production slice complete  
Website state: 288-frame continuous preview active from F204 through F491  
Next gate: completed in the [Grinder Transition Production Pilot](./grinder-transition-production-pilot.md)

## Delivered sequence

This two-second production slice continues the same hero bean from early cinnamon
through a dry finished roast. The camera remains inside the perforated drum,
co-orbits with the clockwise tumble, then pushes toward the center crease so the
bean can occlude the environment handoff at F492.

| Range | Active source | Responsibility |
| --- | --- | --- |
| F444–F455 | v002 | Entry-boundary correction from F443; early cinnamon, restrained chaff, stable scale |
| F456–F467 | v001 | Even cinnamon-to-chestnut development |
| F468–F479 | v001 | Open pores, deeper crease, dry finished-brown material |
| F480–F491 | v002 | Camera-scale and background correction; crease rotates front-on |
| F492 | v001 boundary anchor | Bean owns the frame before any grinder tooth appears |

## Continuity acceptance

- Exactly one identifiable hero bean is present in every active frame.
- The perforated drum, upper-left light, shadow direction, and clockwise movement
  remain coherent.
- Color deepens monotonically from early cinnamon to rich chestnut.
- Chaff decreases while pore and crease definition increase.
- The final surface is dry and tactile: no oil glaze, black char, flame, sparks,
  smoke wall, background beans, or visible grinder teeth.
- No dissolve, crossfade, transparent duplicate, or identity replacement is used.
- The rejected middle-pack alternative was not imported because it missed the
  approved F468 scale and axis.

The visual audit is stored at:

`docs/homepage/storyboards/roast-development-review-sequence-v3.jpg`

The transition metrics and active-version map are stored at:

`docs/homepage/storyboards/roast-development-continuity-metrics-v3.json`

## Master and video delivery

- Master range: F444–F491
- Master format: 2048×2048 sRGB PNG
- Frame count: 48
- Playback: 24 fps
- Duration: 2.000 seconds
- Video: H.264 High, yuv420p, 2048×2048

Master manifest:

`docs/homepage/storyboards/roast-development-masters-2k/nevora-one-take_f0444-f0491_master-manifest-v001.json`

Video preview:

`docs/homepage/storyboards/nevora-one-take_f0444-f0491_preview-v001.mp4`

## Website integration

Web package v004 contains 288 square WebP frames at 1280×1280:

`frontend/public/images/journey/frames-v004/manifest-v004.json`

The scroll timeline now includes seven bilingual story beats. The seventh beat
covers F444–F491 and reaches its final frame before the sticky scene releases,
leaving a six-percent full-frame hold on F491. The scroll runway was extended
for slower frame scrubbing on mobile and desktop, and the language control
remains available through 94% of the sequence.

## Generation method

The visual production used the built-in image-generation flow with versioned
project copies. The working prompt set requested:

1. A clean F492 crease-ownership anchor.
2. F444–F455 early-cinnamon continuity with restrained chaff.
3. F456–F467 cinnamon-to-chestnut development.
4. F468–F479 dry chestnut-to-finished-brown development.
5. F480–F491 gradual crease alignment and camera push.

Every prompt locked the same single bean, clockwise co-orbit, fixed upper-left
light, monotonic material development, diminishing chaff, dry surface, and the
absence of background beans, oil, char, fire, smoke, or grinder teeth.

## Next production gate

F492–F539 is now complete in the website. The whole finished bean transfers the
peripheral circle from warm drum metal to cool grinder steel, enters the opposing
burr threshold, and fractures along its original crease into traceable pieces.
F540–F587 is the active particle-tunnel and portafilter-descent gate.
