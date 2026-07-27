# Basket-to-Water Pilot — Keyframe Manifest

Status: **48/48 review frames promoted to verified 2048 × 2048 web-production masters.**

All files in `storyboards/basket-to-water-pilot-keyframes/` are square
**439 × 439 px review proxies** derived from the approved contact sheets. They
exist to lock timing, identity, and handoffs. They are not final-resolution web
or master frames.

## Locked review keyframes

| Source run | Frames | Count |
|---|---|---:|
| Run 01 — basket descent v1 | F204, F207, F210, F213, F216, F218, F220, F222 | 8 |
| Run 02 — endpoint-locked handoff v3 | F228, F233, F236 | 3 |
| Run 03 — underwater reveal v1 | F238, F240, F242, F244, F246, F248, F250, F251 | 8 |
| Consecutive gap A | F223, F227 | 2 |
| Consecutive gap B | F232, F234, F235 | 3 |
| Individual production candidate v2 | F237 | 1 |
| Gap C — basket descent | F205, F206, F208, F209, F211 | 5 |
| Gap D — weave approach | F212, F214, F215, F217 | 4 |
| Individual production candidates | F219, F221 | 2 |
| Gap E — skin opening | F239, F241, F243, F245 | 4 |
| Individual production candidates | F247, F249 | 2 |
| Coherent cluster corrections | F224–F226, F229–F231 | 6 replacements |
| **Total active timeline identities** |  | **48** |

The shared endpoint F222 is owned by Run 01. The shared endpoint F238 is owned
by Run 03. Run 02 v3 controls only the six internal handoff frames so duplicate
timeline identities never enter the review sequence.

## Missing interstitial frames

None. Every immutable timeline identity from **F204 through F251** now has
exactly one active 439 × 439 review proxy.

## Gap-production order

| Priority | Gap | Missing frames | Risk |
|---:|---:|---|---|
| Complete | F222→F238 | None | Environment handoff has every frame at review level |
| Complete | F204→F222 | None | Basket descent and physical occlusion have every frame |
| Complete | F238→F251 | None | Skin opening and wet-seed reveal have every frame |

## Completed high-risk handoff

Every timeline identity from **F222 through F238** now has an individual review
frame. Gap A supplies the hidden weave-to-water change, Gap B supplies the
empty-water-to-cherry return, and the individually generated F237 v2 connects
the intact cherry to the partial seed reveal.

- [Gap A — F222–F229](./storyboards/basket-to-water-gap-a-f222-f229-v1.png)
- [Gap B — F229–F236](./storyboards/basket-to-water-gap-b-f229-f236-v1.png)
- Individual F237 production candidate:
  `storyboards/basket-to-water-pilot-frames/nevora-one-take_f0237_v002.png`

F237 v1 is retained as a rejected scale test and must not be used.

All superseded review proxies are retained under
`basket-to-water-pilot-keyframes/rejected/`. The active coherent-cluster pass
uses F224 v2, F225 v3, F226 v2, F229 v2, F230 v3, and F231 v2.

The correction packs are:

- [F223→F227 coherent basket/water bridge](./storyboards/basket-to-water-cluster-f223-f227-v1.png)
- [F228→F232 coherent empty-water bridge](./storyboards/basket-to-water-cluster-f228-f232-v1.png)

## Complete review sequence

- [48-frame numbered review sheet v3](./storyboards/basket-to-water-pilot-review-sequence-v3.jpg)
- [Interactive 24 fps forward/reverse scrub](./storyboards/nevora-one-take_f0204-f0251_scrub-v001.html)
- [Cadence audit v2](./basket-to-water-pilot-cadence-audit-v2.md)
- [2K master delivery v1](./basket-to-water-pilot-master-delivery-v1.md)
- [48-frame 2K master folder](./storyboards/basket-to-water-pilot-masters-2k/)
- [Two-second 24 fps MP4](./storyboards/nevora-one-take_f0204-f0251_preview-v001.mp4)
- Active review-proxy folder:
  `storyboards/basket-to-water-pilot-keyframes/`

The review proxies remain the immutable timing authority. Their approved
identities have been promoted to deterministic 2K PNG masters for the website
pipeline. Archival EXR output remains a separate optional delivery.

## File pattern

Current review proxy:

`nevora-one-take_f0204_key-v001.png`

Future full-resolution review frame:

`nevora-one-take_f0204_v001.jpg`

Future master frame:

`nevora-one-take_f0204_v001.exr`

The `_key-` token is mandatory on cropped review proxies so they cannot be
mistaken for masters.

## Promotion gate

A keyframe may be promoted to a full-resolution frame only after its immediate
left and right neighbors exist and the three-frame group passes identity,
motion, exposure, focus, and reverse-scrub review.
