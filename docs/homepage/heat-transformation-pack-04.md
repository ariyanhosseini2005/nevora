# NEVORA — Heat Transformation Pack 04

Status: F396–F491 heat transformation complete; F492 crease-ownership boundary locked  
Production state: Both 48-frame heat slices are in the website; F492–F539 grinder handoff is the next production gate

## Approved transformation anchors

![Five-stage coffee heat transformation pack v1](./storyboards/heat-transformation-pack-04-v1.png)

This sheet locks the hero bean's material evolution across the longest transformation
in the film. Hero framing is intentionally normalized for clear material comparison.
The production sequence must add continuous clockwise rotation and drum motion between
these anchors while preserving the same object identity.

## Anchor map

| Anchor | Frame | Reference time | Scroll | Material state |
| --- | ---: | ---: | ---: | --- |
| A — Green charge | 396 | 16.50 s | 55.1% | Pale mineral green, dense, smallest volume, matte, narrow crease |
| B — Yellowing | 420 | 17.50 s | 58.4% | Straw yellow with faint olive near the crease; first controlled expansion and moisture release |
| C — Cinnamon | 444 | 18.50 s | 61.8% | Warm cinnamon-tan, wider crease, more open surface, fine silver-skin chaff lifting |
| D — Developed roast | 468 | 19.50 s | 65.1% | Even medium chestnut, clear pores, dry matte surface, fuller volume |
| E — Finished hero roast | 491 | 20.46 s | 68.3% | Rich roasted brown, restrained satin highlight, deep crease, no oil glaze or char |

## Locked hero identity

- Asymmetrical oval silhouette with the left lobe slightly fuller than the right.
- Gently S-shaped central crease that widens gradually but never changes topology.
- One small shallow scar on the upper-right lobe.
- Consistent upper and lower tip shapes.
- Expansion is monotonic and moderate; the bean may not inflate like popcorn.
- Screen-space scale stays controlled because the camera compensates while co-orbiting.

## Frame-by-frame transformation logic

### Frames 396–415 — Heat acceptance

- Pale green color remains dominant at entry.
- Surface moisture begins to leave as transparent vapor, not smoke.
- Drum rotation and camera co-orbit establish one clockwise movement.
- No yellow or brown patch may appear abruptly.

### Frames 416–439 — Yellowing and drying

- Color moves evenly from mineral green toward straw yellow.
- Fine surface wrinkles relax while internal pressure begins expansion.
- The crease becomes marginally wider and darker.
- Any moisture vapor stays sparse, transparent, and physically attached to motion.

### Frames 440–459 — Cinnamon and chaff release

- Color progresses into a warm cinnamon-tan without orange clipping.
- Silver skin separates in small papery fragments and trails clockwise.
- Micro-porosity becomes visible; the surface remains dry.
- First-crack energy may create a subtle vibration but never a dramatic rupture.

### Frames 460–479 — Roast development

- Brown develops evenly through the full surface.
- Volume continues increasing gradually while mass loss is implied by a lighter tumble.
- The crease deepens and pores open.
- No glossy oil, black edge, burn spot, or smoke wall is allowed.

### Frames 480–491 — Finish and align

- The hero reaches rich roasted brown with restrained satin highlights.
- Surface remains tactile, porous, and dry rather than lacquered.
- Camera and drum rotation decelerate just enough for the crease to become readable.
- Final crease orientation aligns with the forward axis used by the grinder transition.

## Motion rules between anchors

- Hero rotation advances clockwise across all 96 frames with no pause or reset.
- Drum perforations and defocused background beans move on the same clockwise vector.
- The camera co-orbits to keep the hero inside the central focus zone.
- Rotation and camera movement must be reversible during reverse scroll.
- Chaff trails behind the current rotation direction and reverses plausibly when scrubbed backward.
- Heat haze remains subtle and spatial; it cannot become a full-frame distortion layer.

## Color and surface interpolation

All material properties must change monotonically. No single production frame may
be created by applying a flat color filter to the previous frame. Each step needs
coordinated changes in hue, moisture, volume, crease depth, pore size, chaff, and
specular response.

| Property | F396 | F420 | F444 | F468 | F491 |
| --- | --- | --- | --- | --- | --- |
| Moisture appearance | Restrained internal sheen | Transparent vapor trace | Dry | Dry | Dry |
| Apparent volume | Baseline | Slight increase | Moderate increase | Near final | Final |
| Crease | Narrow | Slightly open | Widening | Deep | Deep and aligned |
| Pores | Minimal | Beginning | Visible | Open | Open and crisp |
| Chaff | Attached | Loosening | Releasing | Sparse fragments | Nearly cleared |
| Specular response | Soft matte | Matte | Matte | Dry matte | Restrained satin |

## Rejection conditions

- Five different bean identities or changing crease topology.
- A copied bean with only flat color-filter changes.
- Abrupt half-green/half-brown bands or patchy gimmicks.
- Melting, splitting open, exploding, or popcorn-like inflation.
- Flames, sparks, glowing embers, dense smoke, black char, or oily lacquer.
- Rotation reset, reversed drum direction, focus jump, or camera-distance jump.
- Background beans becoming sharper or more important than the hero.

## Final generation prompt

Use case: ads-marketing  
Asset type: five-frame cinematic heat-transformation pack for a luxury coffee film  
Input images: approved NEVORA look-development sheet for the final roast and drum grade; Transition Pack 03 for the exact pale hero identity, perforated steel, camera axis, and rim light.  
Primary request: create exactly five equal horizontal frames of the same coffee seed during one uninterrupted clockwise drum rotation—pale green at frame 396; straw yellow at 420; cinnamon with chaff at 444; developed chestnut at 468; rich finished roasted brown at 491.  
Hero identity: preserve the asymmetrical oval silhouette, fuller left lobe, S-shaped crease, upper-right scar, and tip shapes while moisture, volume, pores, chaff, color, and specular response evolve gradually.  
Style/medium: ultra-photorealistic live-action premium commercial; real 65 mm macro optics; subtle heat haze, film grain, and motion blur; physically plausible coffee roasting.  
Continuity constraints: monotonic color and volume progression; stable camera distance and focus; clockwise drum motion; fixed upper-left light; final crease aligns with the grinder axis.  
Constraints: exactly five panels; no text, logo, watermark, person, water, wood, flames, sparks, grinder, or cup.  
Avoid: different bean identities, flat color filters, abrupt patches, melting, explosion, popcorn shape, black char, oil glaze, smoke wall, rotation reset, illustration, or CGI.

## Production method

Generated with the built-in image-generation flow and saved in the project at:

`docs/homepage/storyboards/heat-transformation-pack-04-v1.png`

## Next approval gate

The [Heat Acceptance Production Pilot](./heat-acceptance-production-pilot.md)
completes F396–F443 and hands off to the early-cinnamon boundary.
The [Roast Development Production Pilot](./roast-development-production-pilot.md)
now completes F444–F491, including the final dry-roast alignment and the F492
crease-ownership anchor.

[Transition Pack 05](./transition-pack-05-roast-to-grinder.md) is now the active
production gate for F492–F539.
