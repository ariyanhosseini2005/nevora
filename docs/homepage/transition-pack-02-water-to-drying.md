# NEVORA — Transition Pack 02: Water to Drying Bed

Status: **F252–F299 production sequence and F300 v002 boundary approved.**  
Production state: 48 review frames, 48 2K masters, 24 fps movie, and interactive scrub complete

## Approved transition anchors

![Water-to-drying transition pack v1](./storyboards/transition-pack-02-water-to-drying-v1.png)

These frames describe one continuous left-to-right glide at seed height. The
camera tracks beside the hero seed, so the seed remains near the optical center
while the waterline and wooden rail move through the frame.

## Anchor map

| Anchor | Frame | Reference time | Scroll | Visual responsibility |
| --- | ---: | ---: | ---: | --- |
| A — Water approach | 288 | 12.00 s | 40.1% | Fully released pale seed moves through mineral water toward one bright boundary; red skin recedes behind |
| B — Shared boundary | 300 | 12.50 s | 41.7% | Same seed makes physical contact with the wet wooden edge while part of its surface remains in moving water |
| C — Drying reveal | 312 | 13.00 s | 43.4% | Same seed continues onto the drying bed; a wet trail connects it to the boundary and the rail leads into depth |

## Frame-by-frame transition logic

### Frames 280–291 — Establish the new carrier

- The seed is fully separated from the cherry skin.
- Water current owns the movement and bends the seed path into a horizontal glide.
- Two red skin fragments fall behind and leave the hero plane.
- The upper-left caustic becomes progressively straighter as the wooden edge approaches.

### Frames 292–299 — Match the line

- Water caustic and wooden edge overlap on the same screen axis.
- The camera reduces its underwater pitch without changing horizontal direction.
- The seed maintains the same seam orientation and relative scale.
- Wood may enter only from the forward/right side of the shared boundary.

### Frames 300–306 — Prove physical contact

- Water remains visibly attached to the left/lower half of the seed.
- The right/upper half rolls onto wet wood under real gravity and current pressure.
- A thin sheet of water crosses the wooden edge and drains back.
- Focus breathes from the water surface into the wet wood grain; it does not snap.

### Frames 307–320 — Transfer movement to the rail

- The seed continues along the exact same screen direction.
- A short wet trail proves the previous position and prevents teleportation.
- The former caustic is now read as the illuminated wooden rail.
- Background drying seeds may appear gradually, only outside the hero focus plane.

## Optical and material rules

- Lens language transitions gradually from 100 mm underwater macro to 85 mm close macro.
- Camera height stays aligned with the seed center; no sudden top-down view.
- Key light remains upper-left while water refraction gives way to warm wood reflection.
- The seed surface remains wet through anchor C; it cannot become matte instantly.
- Wood requires age, grain, wet darkening, capillary sheen, and imperfect edges.
- Hero-seed rotation change across the pack should remain under 12 degrees.

## Rejection conditions

- A dissolve between an underwater image and an unrelated drying-bed image.
- A floating seed with no contact, weight, wet trail, or water flow.
- Reversed travel direction, camera-height jump, or rotation reset.
- Multiple sharp foreground seeds competing with the hero.
- Instant dry surface, plastic wood, artificial splash, or magical glow.
- Light moving from upper-left to another direction.

## Final generation prompt

Use case: ads-marketing  
Asset type: three-frame cinematic transition pack for a luxury coffee film  
Input images: approved NEVORA look-development sheet for final optics, grade, wood, and lighting; Transition Pack 01 for underwater material and hero identity.  
Primary request: create exactly three equal horizontal frames from one uninterrupted seed-height camera glide—released pale seed approaching a bright boundary in water at frame 288; the same seed physically straddling the water and wet wooden edge at frame 300; the same seed continuing onto the drying bed with a wet trail at frame 312.  
Style/medium: ultra-photorealistic live-action premium commercial; 100 mm underwater macro moving toward 85 mm close macro; natural imperfections; restrained film grain; physically plausible liquid behavior.  
Continuity constraints: same seed identity, seam, axis, scale evolution, and left-to-right path; upper-left light never flips; water caustic becomes wet wood edge and then the drying-bed rail.  
Constraints: exactly three panels; no text, labels, logo, watermark, person, basket, machine, cup, roasted beans, or extra foreground hero.  
Avoid: split-screen inside a panel, crossfade, magical transformation, floating seed, instant dry surface, splash explosion, direction reversal, duplicate hero, illustration, or CGI.

## Production method

Generated with the built-in image-generation flow and saved in the project at:

`docs/homepage/storyboards/transition-pack-02-water-to-drying-v1.png`

The anchor sheet remains the visual-development source, while the approved
frame-by-frame delivery is documented in the
[Water-to-Drying Production Pilot](./water-to-drying-production-pilot.md).

Approved active source versions:

- F252–F291: v001
- F292–F298: v003 sequential corrections
- F299: v004 one-frame-before-contact
- F300 boundary: v002 first contact

The verified delivery includes 48 consecutive 2048 × 2048 frames and a
two-second 24 fps H.264 movie.

## Next approval gate

Produce F300–F347 from the immutable F300 v002 contact boundary. This run must
transfer the wet seed onto the drying rail, preserve a visible wet trail, and
reveal the drying bed before handing to
[Transition Pack 03](./transition-pack-03-drying-to-roaster.md).
