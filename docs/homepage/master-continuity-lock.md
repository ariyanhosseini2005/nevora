# NEVORA — Master Continuity Lock

Status: **Master preproduction continuity map ready for approval.**

This is the single source of truth for the continuous farm-to-espresso film. It
locks timing, camera intent, visual handoffs, anchor ownership, production
batches, naming, and review gates before any full frame production or website
implementation begins.

## Canonical timeline

- Transformation film: **F000–F719**, 720 canonical frames at 24 fps, 30 seconds.
- Scroll mapping: **0–100%** maps only to F000–F719.
- Post-film stillness: **F720–F743**, 24 frames, outside the transformation film.
- Frame identity is canonical. Delivery format and runtime implementation remain
  separate technical decisions.

## Twelve story beats

| Beat | Frame range | Duration | Visual event | Camera / continuity owner |
|---|---:|---:|---|---|
| B01 Enter origin | F000–071 | 72 | Dawn mist reveals the living farm | 70 mm drift-in; sunrise parallax |
| B02 Discover cherry | F072–119 | 48 | Camera finds one ripe cherry | 85 mm macro; leaf wipe |
| B03 Human selection | F120–179 | 60 | Hand selects and releases the hero cherry | 85 mm tracking; hand occlusion |
| B04 Fall into basket | F180–227 | 48 | Cherry falls into woven basket | 90 mm descent; basket weave occlusion |
| B05 Reveal seed | F228–299 | 72 | Fruit skin and pulp resolve into wet seed | 100 mm probe; water and skin geometry |
| B06 Water to drying | F300–347 | 48 | Wet seed rises into sunlit drying bed | 85 mm rise; water-glare wipe |
| B07 Enter roaster | F348–395 | 48 | Dry seed enters the roaster drum | 75 mm push; drum-mouth occlusion |
| B08 Heat transformation | F396–491 | 96 | Green seed becomes roasted coffee | 70 mm orbit; heat shimmer and shell rotation |
| B09 Enter grind | F492–539 | 48 | Roasted bean enters burrs and fractures | 85 mm chase; burr geometry match |
| B10 Settle portafilter | F540–599 | 60 | Grounds resolve into a stable coffee bed | 90 mm settle; particle flow and rim match |
| B11 Extraction | F600–671 | 72 | Pressure turns the bed into the first stream | 100→85 mm pull; liquid emergence |
| B12 Complete ritual | F672–719 | 48 | Stream fills the glass and reaches stillness | 85→50 mm pullback; glass rim and liquid axis |

## Eight transition packs

| Pack | Owned range | Locked anchors | Physical handoff | Reference |
|---|---:|---|---|---|
| P01 Basket → water | F204–244 | 210, 222, 238 | Basket weave closes frame; highlight becomes water veil | [Pack 01](./transition-pack-01-basket-to-water.md) |
| P02 Water → drying | F280–320 | 288, 300, 312 | Water glare expands into the drying-bed highlight field | [Pack 02](./transition-pack-02-water-to-drying.md) |
| P03 Drying → roaster | F328–368 | 336, 350, 364 | Repeating seed geometry compresses into drum-mouth darkness | [Pack 03](./transition-pack-03-drying-to-roaster.md) |
| P04 Heat transformation | F396–491 | 396, 420, 444, 468, 491 | One identifiable seed changes color, volume, and shell texture | [Pack 04](./heat-transformation-pack-04.md) |
| P05 Roaster → grinder | F472–515 | 480, 492, 508 | Roasted shell rotation aligns to the burr entry and first fracture | [Pack 05](./transition-pack-05-roast-to-grinder.md) |
| P06 Grinder → portafilter | F512–560 | 520, 532, 540, 552 | Fracture cloud becomes controlled particle flow inside one rim | [Pack 06](./transition-pack-06-grinder-to-portafilter.md) |
| P07 Bed → extraction | F568–623 | 576, 592, 600, 616 | Coffee bed darkens and produces one physically continuous liquid source | [Pack 07](./transition-pack-07-bed-to-extraction.md) |
| P08 Extraction → glass | F624–719 | 648, 664, 680, 700, 719 | Stream axis introduces the glass and owns the final pullback | [Pack 08](./final-transition-pack-08-extraction-to-glass.md) |

### Overlap audit

- P04 and P05 intentionally overlap at **F472–491** so the same roasted shell
  owns both the end of heat transformation and the grinder approach.
- P05 and P06 intentionally overlap at **F512–515** so the burr fracture remains
  the source of the particle cloud entering the portafilter.
- No other transition ranges overlap.
- No story-boundary seam is unowned: every environment change is concealed by
  physical occlusion, matched geometry, continuous material flow, or a
  motivated optical event.
- Every transition must pass both forward and reverse scrub review. Reverse
  motion may expose no teleport, identity swap, scale jump, or exposure pop.

## Twelve hero frames

| Hero | Frame | Approval subject |
|---|---:|---|
| H01 | F036 | Origin atmosphere and sunrise direction |
| H02 | F096 | Hero cherry identity |
| H03 | F144 | Harvest hand and cherry scale |
| H04 | F204 | Basket entry geometry |
| H05 | F264 | Wet seed identity and water behavior |
| H06 | F324 | Drying-bed scale and sun continuity |
| H07 | F372 | Roaster entry geometry |
| H08 | F444 | Mid-roast color, expansion, and shell texture |
| H09 | F516 | Grinder entry and fracture scale |
| H10 | F570 | Portafilter rim and settled bed |
| H11 | F636 | First stable extraction stream |
| H12 | F719 | Final glass, crema, table, and brand-safe composition |

## Production batches

The batches are visual-production units only. They do not decide how the browser
will eventually receive or render the sequence.

| Batch | Frame range | Frames | Scope |
|---|---:|---:|---|
| A | F000–203 | 204 | Origin, cherry discovery, harvest |
| B | F204–319 | 116 | Basket, fruit processing, water |
| C | F320–395 | 76 | Drying bed and roaster entry |
| D | F396–491 | 96 | Heat transformation |
| E | F492–559 | 68 | Grinder entry and fracture |
| F | F560–623 | 64 | Portafilter and extraction onset |
| G | F624–719 | 96 | Extraction, glass, final stillness |
| H | F720–743 | 24 | Post-film stillness / future brand gate |

Batch A–G total: **720 transformation frames**. Batch H is deliberately excluded
from that count.

## Canonical naming

- Master frame: `nevora-one-take_f0000_v001.exr`
- Review frame: `nevora-one-take_f0000_v001.jpg`
- Future web delivery example: `nevora-one-take_f0000_v001.avif`
- Contact sheet: `nevora-one-take_batch-a_contact-v001.jpg`
- Review notes: `nevora-one-take_batch-a_review-v001.md`

The frame number is immutable. A visual correction increments the version; it
never changes the frame's timeline identity.

## Continuity QC gates

Every produced frame must pass all of these checks:

1. **Identity and geometry** — hero cherry, seed, roasted bean, grinder, rim,
   stream, and glass stay identifiable without swaps.
2. **Screen direction** — travel direction and camera orbit do not flip.
3. **Lighting** — warm upper-left key remains motivated; highlights do not jump.
4. **Exposure and grade** — the image stays premium and realistic without
   crushed coffee blacks or synthetic orange drift.
5. **Lens and focus** — focal-length changes are gradual; focus pulls have a
   visible subject and no breathing jump.
6. **Material continuity** — skin, pulp, water, seed, roast shell, grounds,
   espresso, crema, and glass behave physically.
7. **Forward and reverse scrub** — the transition remains believable in both
   directions at slow and fast scroll speeds.
8. **Clean plate** — no text, logo, watermark, UI, duplicate object, or
   unmotivated prop appears inside the transformation film.

## Frame-production sequence

1. Produce and approve all hero and transition-anchor frames first.
2. Fill the near-anchor intervals in short, overlap-aware runs.
3. Produce the remaining interstitial frames only after those intervals pass QC.
4. Assemble every batch against this master timeline.
5. Review frame stepping, slow forward scrub, fast forward scrub, and full reverse.
6. Reject local beauty fixes that break identity or motion continuity with the
   preceding or following frame.

The full 720-frame film must not be attempted as one unconstrained generation
run. Short runs inherit an approved incoming frame and export an approved
outgoing frame, which becomes the next run's immutable reference.

## Next approval gate: 48-frame production pilot

Before full production, create one representative consecutive slice:
**F204–F251, Basket → Water**. This is the best pilot because it tests the most
difficult combination of moving macro subject, full-frame physical occlusion,
environment replacement, water behavior, focus transfer, and reverse-scroll
readability.

The pilot must deliver all 48 consecutive frames, a contact sheet, a real-time
24 fps preview, a scroll-scrub preview, and a continuity review. Only after the
pilot passes should the remaining batches be produced.

The first local runtime integration is now active for review: F204–F347 is
available as a 144-frame scroll-controlled canvas sequence using 1280 × 1280
WebP delivery frames. This is a production-preview delivery layer; the 2K PNG
masters remain the visual source of truth. Final responsive crops and production
delivery policy remain open until the complete F000–F719 film is approved.

### Pilot progress

The [Basket-to-Water Production Pilot](./basket-to-water-production-pilot.md)
is approved with 48 consecutive 2048 × 2048 masters, a verified two-second
24 fps movie, and an interactive forward/reverse scrub.

The [Water-to-Drying Production Pilot](./water-to-drying-production-pilot.md)
is also approved with 48 consecutive F252–F299 masters. Its corrected
F299 v004 hands to F300 v002 with a normalized boundary difference of 0.004502,
so the first physical seed-to-wood contact is now locked without a composition
or exposure jump.

The [Drying-Bed to Roaster-Approach Production Pilot](./drying-production-pilot.md)
adds 48 approved clean-frame masters from F300 through F347. Its verified v002
movie is exactly 48 frames, 24 fps, and 2.000 seconds at 2048 × 2048, with F348
v004 locked as the first physical metal-contact boundary.

Together these pilots now provide **144 consecutive 2K production frames from
F204 through F347**. The next production gate is F348–F395: cross the roaster
lip, enter the drum, and preserve the pale seed identity until heat
transformation begins at F396.
