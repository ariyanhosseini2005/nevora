# NEVORA — Grinder Transition Production Pilot

Status: F492–F539 production slice complete  
Website state: 336-frame continuous preview active from F204 through F539  
Next gate: F540–F587, particle tunnel, gravity bend, and portafilter descent

## Delivered sequence

This two-second production slice continues directly from the finished roast.
The same hero bean moves away from the near lens on its center-crease axis,
transfers the surrounding circular geometry from warm drum metal into graphite
grinder steel, enters the burr threshold, and begins a controlled crease-led
fracture.

| Range | Production responsibility |
| --- | --- |
| F492–F503 | Bean moves into depth while its occlusion transfers the drum circle into the grinder ring |
| F504–F515 | Opposing machined burr faces become readable without touching the whole bean |
| F516–F527 | Burrs close the remaining gap and load the natural center crease |
| F528–F539 | Crease-led separation creates four to six traceable pieces and a central granular path |
| F540 | Particle-tunnel boundary; no portafilter is visible yet |

## Continuity acceptance

- F492 uses the approved crease-ownership anchor rather than a regenerated first
  panel.
- Exactly one identifiable hero bean remains whole through the threshold.
- The camera stays on the original vertical crease axis.
- Drum geometry becomes graphite burr geometry behind the bean’s occlusion.
- Burr approach precedes load; load precedes stress; stress precedes separation.
- Fracture follows the natural crease rather than creating an explosion.
- Large pieces retain recognizable outer skin, crease edges, tips, and dry porous
  interiors.
- No duplicate bean, spark, smoke, dust wall, glass-like shard, oil, char, or
  portafilter appears in the active slice.

The visual review is stored at:

`docs/homepage/storyboards/grinder-transition-review-sequence-v1.jpg`

The boundary metrics and extraction map are stored at:

`docs/homepage/storyboards/grinder-transition-continuity-metrics-v1.json`

## Master and video delivery

- Master range: F492–F539
- Master format: 2048×2048 sRGB PNG
- Frame count: 48
- Playback: 24 fps
- Duration: 2.000 seconds
- Video: H.264 High, yuv420p, 2048×2048

Master manifest:

`docs/homepage/storyboards/grinder-transition-masters-2k/nevora-one-take_f0492-f0539_master-manifest-v001.json`

Video preview:

`docs/homepage/storyboards/nevora-one-take_f0492-f0539_preview-v001.mp4`

## Website integration

Web package v005 contains 336 WebP frames at 1280×1280:

`frontend/public/images/journey/frames-v005/manifest-v005.json`

The scroll film now contains eight bilingual story beats. The grinder beat spans
F492–F539, and F539 reaches completion before the sticky scene releases, leaving
a six-percent full-frame hold. The scroll runway is 2320svh on smaller viewports
and 2580svh from the desktop breakpoint.

Production verification passed:

- Next.js production build and TypeScript
- 48 decoded video frames at 24 fps and exactly 2.000 seconds
- HTTP 200 for the homepage, v005 manifest, and F539 WebP
- Persian RTL and English LTR language switching at F539
- No browser console warnings or errors

## Generation method

The selected visuals were created with the built-in image-generation flow and
copied into versioned project folders. The prompt set requested:

1. F492–F503 restrained depth travel and drum-to-grinder ring transfer.
2. F504–F515 symmetrical burr reveal with no contact.
3. F516–F527 controlled approach and crease loading.
4. F528–F539 natural crease-led fracture into traceable large pieces.
5. A clean F540 particle-tunnel boundary without a portafilter.

All prompts locked one bean identity, vertical crease axis, fixed upper-left
light, dry roasted material, real machined graphite steel, mechanically ordered
contact, and the absence of explosion, sparks, smoke, dust walls, or unrelated
particles.

## Next production gate

F540–F551 continues through the same particle tunnel while the forward vector
begins bending downward. F552 introduces the empty portafilter rim below the
stream. F553–F571 transfers grinder circles into the basket circle and starts an
uneven accumulation. F572–F587 stabilizes the falling grounds for the following
coffee-bed preparation slice.
