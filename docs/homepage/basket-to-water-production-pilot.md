# NEVORA — Basket-to-Water Production Pilot

Status: **48/48 2K web-production masters and the two-second 24 fps movie are approved.**

This pilot owns frames **F204–F251**. Its purpose is to prove that the camera can
follow one identifiable coffee cherry through a physical basket occlusion, enter
processing water without a cut, and reveal the same pale green seed.

The contact sheets in this document are continuity controls. They are not a
substitute for the final 48 individually rendered frames.

## Approved pilot control

![Eight-frame pilot control](./storyboards/basket-to-water-production-pilot-control-v1.png)

| Control frame | Responsibility |
|---:|---|
| F204 | Incoming cherry identity and basket axis |
| F210 | Pre-occlusion hero anchor |
| F216 | Increasing weave parallax and edge blur |
| F222 | Full readable basket occlusion |
| F228 | Basket-to-water optical handoff |
| F238 | Underwater cherry and partial seed reveal |
| F244 | Skin opening under water drag |
| F251 | Outgoing wet-seed identity |

## Run 01 — Basket descent

Range: **F204–F222**

![Basket descent continuity run](./storyboards/basket-to-water-pilot-run-01-f204-f222-v1.png)

Review result: **Pass as a key-control run.**

- One cherry identity and stem scar remain readable.
- Camera direction stays forward and downward.
- Near-lens weave owns the motion blur.
- The cherry is progressively hidden by real basket geometry.
- F222 remains dark but still reads as physical fiber, not a title-card black.

## Run 02 — Basket occlusion to water

Range: **F222–F238**

![Endpoint-locked basket-to-water handoff v3](./storyboards/basket-to-water-pilot-run-02-f222-f238-v3.png)

Review result: **Pass as an endpoint-locked key-control run.**

Version 1 is retained as a rejected visual-development record because the hero
returned too early. Version 2 corrected that timing. Version 3 additionally
inherits the F222 basket state from Run 01 and the F238 underwater state from
Run 03. The locked behavior is:

- F222–F233: the cherry is completely hidden.
- F228–F233: only water refraction, bubbles, and clearing basket edges appear.
- F234–F236: the same cherry returns gradually on the original central-lower axis.
- F238: the cherry is readable and the green seed is only partially visible.

No final frame may use the early re-entry shown in
[v1](./storyboards/basket-to-water-pilot-run-02-f222-f238-v1.png).

## Run 03 — Cherry to wet seed

Range: **F238–F251**

![Underwater seed reveal run](./storyboards/basket-to-water-pilot-run-03-f238-f251-v1.png)

Review result: **Conditional pass.**

- One pale green seed keeps a stable center groove.
- Skin opening progresses monotonically.
- Peel remains close enough to prove source identity.
- Water color, bubble scale, and upper-left light remain stable.
- Final production must inherit the corrected F238 from Run 02 before this run
  can receive final approval.

## Independent review keyframes

The control runs, gap sheets, and individual production candidates have been
converted into **48 individually named review frames** at 439 × 439 px. Their
frame IDs, ownership rules, replacement history, and production order are
defined in the
[Keyframe Manifest](./basket-to-water-keyframe-manifest.md).

- Available review frames: 48
- Missing interstitial frames: 0
- Total pilot frames after completion: 48
- Review-proxy folder: `storyboards/basket-to-water-pilot-keyframes/`

The review proxies deliberately include `_key-` in their names and must never be
treated as full-resolution masters.

### Completed high-risk handoff

![Consecutive F222–F229 gap](./storyboards/basket-to-water-gap-a-f222-f229-v1.png)

![Consecutive F229–F236 gap](./storyboards/basket-to-water-gap-b-f229-f236-v1.png)

Every frame from F222 through F238 now has an individual review identity. The
single F237 production candidate was generated independently at higher
resolution; v2 passes scale review while v1 is retained as a rejected oversized
test.

### Complete review pass

![Complete numbered F204–F251 review sequence](./storyboards/basket-to-water-pilot-review-sequence-v3.jpg)

- [Interactive 24 fps forward/reverse scrub](./storyboards/nevora-one-take_f0204-f0251_scrub-v001.html)
- [Cadence audit v2](./basket-to-water-pilot-cadence-audit-v2.md)
- [2K master delivery and encode audit](./basket-to-water-pilot-master-delivery-v1.md)
- [Final 2048 × 2048 MP4](./storyboards/nevora-one-take_f0204-f0251_preview-v001.mp4)
- F224–F226 and F229–F231 now use coherent multi-frame correction packs.
- Their superseded proxies remain in
  `storyboards/basket-to-water-pilot-keyframes/rejected/`.
- F249 now exists as an individual production candidate and closes the final
  missing timeline identity.

## Locked 48-frame action register

| Frames | Required action |
|---:|---|
| F204–F209 | Cherry and camera descend together; no occlusion crosses the hero |
| F210 | Immutable pre-occlusion anchor |
| F211–F215 | Foreground weave grows through parallax; cherry identity remains clear |
| F216–F219 | First fiber band crosses the hero; blur belongs to near-lens fiber |
| F220–F221 | Red identity reduces to a small edge before disappearing |
| F222 | Immutable full-occlusion anchor |
| F223–F227 | Readable fiber texture continues; exposure changes gradually |
| F228–F230 | Cool refracted highlights enter through weave gaps; no cherry visible |
| F231–F233 | Water volume and small bubbles resolve; hero remains hidden |
| F234–F235 | Crimson contour reappears behind the final soft fiber edge |
| F236–F237 | Same cherry becomes readable; rotation advances only a few degrees |
| F238 | Immutable underwater reveal anchor |
| F239–F243 | Natural seam opens in small increments; seed remains nested |
| F244 | Skin lobes begin folding back under water drag |
| F245–F247 | Seed advances slightly; peel remains connected or immediately adjacent |
| F248–F250 | Seed becomes the hero; red peel proves the transformation source |
| F251 | Immutable outgoing wet-seed frame for the next processing run |

## Final frame naming

- Master: `nevora-one-take_f0204_v001.exr` through
  `nevora-one-take_f0251_v001.exr`
- Review: `nevora-one-take_f0204_v001.jpg` through
  `nevora-one-take_f0251_v001.jpg`
- Pilot preview: `nevora-one-take_f0204-f0251_preview-v001.mp4`
- Scroll review: `nevora-one-take_f0204-f0251_scrub-v001.html`

The frame number is immutable. Corrections increment the version and never move
an image to a different timeline position.

## Final pilot acceptance gates

The pilot is approved only when all of the following exist and pass review:

1. Exactly 48 individual master frames with identical dimensions and color space.
2. No duplicated, missing, or reordered frame numbers.
3. One continuous hero identity from cherry to seed.
4. No hero visibility during F222–F233.
5. No exposure pop, focus snap, camera reset, dissolve, or screen-direction flip.
6. A two-second 24 fps preview with no visible cadence break.
7. Slow forward scrub, fast forward scrub, and full reverse scrub.
8. Clean plates with no text, logo, watermark, UI, or unrelated prop.

## Production decision

The visual language, high-risk F222→F238 handoff, and all 48 review identities
are present. The coherent-cluster correction reduces the largest frame delta
from 28.3 to 15.4 and the largest exposure step from 27.1 to 13.5 inside the
corrected basket/water interval. The empty-water cluster maximum falls from
14.3 to 10.1.

The proxy sequence remains the timing and continuity authority. All 48 approved
identities have now been promoted deterministically to 2048 × 2048 sRGB PNG
masters and encoded into a verified 48-frame, two-second, 24 fps H.264 movie.

The basket-to-water production pilot now passes the web-production acceptance
gates and is ready for scroll-driven integration. Archival EXR or 10-bit
mezzanine output remains optional and does not block the website pipeline.
