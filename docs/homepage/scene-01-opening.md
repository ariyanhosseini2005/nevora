# Scene 01 — Origin at Dawn

Status: Phase 1 vertical-slice prototype implemented  
Sequence position: 01 of 10  
Narrative role: Open in the living origin of coffee

## Story purpose

NEVORA begins before roasting, packaging, and commerce. The visitor enters a
real high-altitude coffee farm at the first light of day and discovers one ripe
cherry. The sequence must feel observed, not staged.

Emotional progression:

`Stillness → Presence → Discovery → Respect → Forward motion`

## Key art

![Plantation at dawn keyframe](../../frontend/public/images/storyboard/scene-01-plantation-dawn-keyframe.png)

This frame is the source of truth for the opening palette, upper-left light
direction, dew, foliage texture, depth, and restrained crimson accent.

## Scene structure

- Desktop scroll length: `360vh`
- Tablet scroll length: `300vh`
- Mobile scroll length: `230vh`
- Presentation: sticky `100svh` cinematic viewport
- Timeline: native scroll mapped to normalized progress `0.00–1.00`
- Transition target: Scene 02, hand harvest

## Frame-by-frame storyboard

### Frame 01A — Before sunrise

- Progress: `0.00–0.10`
- Visual: near-black shapes of coffee leaves; the page appears to wake gradually
- Camera: stationary macro position inside the crop row
- Light: cool pre-dawn shadow with no visible sun
- UI: no navigation, logo, copy, or CTA
- Purpose: begin inside the origin instead of presenting it as a later section

### Frame 01B — First light on dew

- Progress: `0.10–0.25`
- Visual: a thin amber highlight travels across the edge of the foreground leaf
- Camera: 100 mm macro character; slow 4% dolly forward
- Focus: first visible dew droplet comes into focus
- Sound: optional distant morning air, muted by default
- Purpose: introduce the visual language through light rather than text

### Frame 01C — The farm breathes

- Progress: `0.25–0.42`
- Visual: shadow detail opens and reveals layered coffee plants in humid depth
- Camera: gentle forward drift through the row; no artificial orbit
- Motion: two leaf layers move at different speeds to create physical depth
- Copy: none
- Purpose: establish a living place, not a generic landscape photograph

### Frame 01D — Discovery of the cherry

- Progress: `0.42–0.60`
- Visual: focus transfers from the wet leaf to one mature crimson coffee cherry
- Camera: subtle lateral move brings the cherry into the optical center
- Light: one warm edge highlight; green and red remain natural and restrained
- Copy enters:

  **Every ritual begins at origin.**

  `Raised slowly. Chosen at its moment.`

- Purpose: connect agricultural care to the final coffee ritual

### Frame 01E — Time held in color

- Progress: `0.60–0.78`
- Visual: a restrained scroll-controlled ripening transition moves a nearby
  cherry from deep green through amber to crimson
- Camera: stable; the visitor controls the passage of time with scroll
- Copy: supporting line fades before the transition completes
- Purpose: make time and selection tangible without using an infographic

### Frame 01F — Approach

- Progress: `0.78–0.92`
- Visual: the ripe cherry fills more of the frame; background drops into softness
- Camera: slow macro push to roughly 2.2× the starting scale
- Focus: skin texture and a single dew highlight remain sharp
- UI: the NEVORA wordmark appears quietly at the top edge; navigation stays hidden
- Purpose: prepare a match cut from the round cherry to the harvesting gesture

### Frame 01G — The first touch

- Progress: `0.92–1.00`
- Visual: fingertips enter softly from the shadow side and stop just before contact
- Camera: motion settles; no cut before the finger reaches the cherry
- Transition: Scene 02 inherits the exact composition and completes the pick
- Purpose: end origin with human intention and begin craftsmanship

## Copy rules

- Text remains accessible HTML over the visual layer.
- Copy uses no sales language and never names price or product.
- The headline appears once and remains under 42 characters in English.
- A future Persian localization must be authored, not machine-fitted into the frame.

## Responsive behavior

### Desktop

- Full cinematic timeline and three depth layers.
- Optional pointer parallax capped at 6 px and disabled during active scrolling.

### Tablet

- Reduce camera travel by 18% and use two depth layers.
- Preserve the focus transition and ripening beat.

### Mobile

- Use a dedicated portrait art crop.
- Reduce darkness to the first 6% of the timeline.
- Replace layered pointer motion with one scroll-linked camera push.
- Place copy in the upper half only when the cherry occupies the lower half.

### Reduced motion

- Present four still states with short opacity crossfades.
- Do not simulate focus pull, parallax, or continuous camera travel.
- Preserve the discovery, ripening, copy, and handoff to harvest.

## Technical notes

- Use native scrolling; never lock or replace the user's wheel/touch behavior.
- Prototype with layered responsive images before committing to a full sequence.
- Use canvas only for the ripening/focus passage if DOM layers cannot meet quality.
- Bind visual updates through `requestAnimationFrame`, not directly to every scroll event.
- Preload the opening poster and the next two required states only.
- Keep all copy and controls outside canvas for semantics and accessibility.

## Performance budget

- Opening critical media: under 1.6 MB desktop and 800 KB mobile
- Scene 01 deferred media: under 4.5 MB desktop
- No cumulative layout shift
- Target 60 FPS desktop and 45–60 FPS on mid-range mobile
- Automatically lower asset density on memory-constrained devices

## Acceptance criteria

- The first meaningful visual is the farm, not a product or logo.
- Dawn, cherry discovery, ripening, and first human touch form one continuous shot.
- The scroll position deterministically controls scene progress in both directions.
- Scrolling backward reverses the story without visual jumps.
- The opening remains complete when audio, pointer motion, or continuous animation is disabled.
- The last frame aligns exactly with the first frame of Scene 02.
