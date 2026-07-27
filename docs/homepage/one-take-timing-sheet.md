# NEVORA — One-Take Timing & Camera Map v1

Status: Timing proposal ready for review  
Production state: Design only; implementation remains frozen

## Master timing

- Reference playback: 720 frames at 24 fps (30 seconds)
- Scroll mapping: frame 000 = 0%; frame 719 = 100%
- Playback time is an animatic reference. In the website, the user's scroll position owns the frame.
- The journey must remain readable in both forward and reverse scrolling.
- No transition may consume a standalone shot; each transition is part of the surrounding camera movement.

## Frame allocation

| Beat | Story event | Frames | Time | Scroll | Camera and lens | Focus | Transition out |
| --- | --- | ---: | ---: | ---: | --- | --- | --- |
| 01 | Enter the origin | 000–071 | 3.0 s | 0–10% | 100 mm macro; slow forward glide at leaf height | Dew and foreground leaves, then mid-plane | Focus settles naturally into the hero branch |
| 02 | Discover the cherry | 072–119 | 2.0 s | 10–16.7% | 100 mm macro; strong deceleration | Rack focus onto the ripe hero cherry | The branch remains fixed as the hand enters |
| 03 | Human selection | 120–179 | 2.5 s | 16.7–25% | 85–100 mm; subtle lateral track with the fingertips | Contact point between finger and cherry | Gravity takes ownership of camera direction |
| 04 | Fall into the basket | 180–227 | 2.0 s | 25–31.7% | 85 mm; accelerating downward follow | The falling cherry | Basket weave closes around the lens as a physical occlusion |
| 05 | Reveal the seed | 228–299 | 3.0 s | 31.7–41.7% | 100–120 mm macro; buoyant water-follow | Skin separation, then pale green seed | A bright moving waterline becomes the drying-bed edge |
| 06 | Water to drying | 300–347 | 2.0 s | 41.7–48.3% | 85 mm; smooth horizontal glide | The same seed crossing from water to wood | Wooden bed edge acts as a rail toward the roaster |
| 07 | Enter the roaster | 348–395 | 2.0 s | 48.3–55% | 65–85 mm; controlled forward push | Circular drum opening | Drum darkness fills the frame before heat appears |
| 08 | Transformation by heat | 396–491 | 4.0 s | 55–68.3% | 65 mm; controlled orbit matching drum rotation | Locked on the hero bean through color change | Bean crease rotates into alignment with grinder burrs |
| 09 | Enter the grind | 492–539 | 2.0 s | 68.3–75% | 85–100 mm macro; decisive forward plunge | Bean crease, then burr contact | Fragments travel around the lens and become grounds |
| 10 | Settle in the portafilter | 540–599 | 2.5 s | 75–83.3% | 100 mm macro; vertical descent with particles | Hero fragments settling in the coffee bed | Camera stops below the bed as water enters above |
| 11 | Become the extraction | 600–671 | 3.0 s | 83.3–93.3% | 100 mm macro; flow-follow with a gentle speed ramp | First viscous espresso stream | The stream remains an unbroken spatial line into the glass |
| 12 | Complete the ritual | 672–719 | 2.0 s | 93.3–100% | Lens language opens from 100 mm to 50 mm during pullback | Focus expands from crema to the full glass | Movement settles completely before brand reveal |

## Camera velocity arc

1. **Invitation — 0–16.7%:** calm, almost suspended forward motion.
2. **Harvest — 16.7–31.7%:** a controlled acceleration driven by the hand and gravity.
3. **Processing — 31.7–48.3%:** floating, horizontal movement carried by water.
4. **Heat — 48.3–68.3%:** stable forward movement becomes a circular, rising-energy orbit.
5. **Grind — 68.3–83.3%:** the fastest passage, followed by a clean braking motion in the portafilter.
6. **Extraction — 83.3–100%:** a liquid speed ramp that resolves into the slowest final pullback.

## Transition overlap rules

- Physical occlusions may hide the environment change for 8–16 frames, but must preserve motion direction.
- Focus racks should begin before the object reaches its hero position and finish after it arrives.
- The hero object must occupy a traceable screen position for at least the first and last 8 frames of every beat.
- The roaster transformation receives the longest allocation because color, surface, and scale must remain legible.
- The brand is not visible inside these 720 frames. It fades in only after an additional 24-frame stillness gate.

## Approval gate

The overall rhythm now drives the [grayscale low-detail animatic](./one-take-animatic-v1.md). Review it especially at the ten transition boundaries and in reverse. Final photorealistic frame production and website implementation remain out of scope until that animatic reads as one continuous take.
