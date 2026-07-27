# NEVORA — Basket-to-Water Cadence Audit v2

Status: **Pass; proxy cadence preserved through the completed 2K promotion and encode.**

## Active sequence

- Timeline: F204–F251
- Duration: 2.00 seconds at 24 fps
- Active frame identities: 48
- Missing or duplicated identities: 0
- Proxy dimensions: 439 × 439 px
- Superseded proxies retained: 8

Review artifacts:

- [Numbered review sheet v3](./storyboards/basket-to-water-pilot-review-sequence-v3.jpg)
- [Interactive forward/reverse scrub](./storyboards/nevora-one-take_f0204-f0251_scrub-v001.html)
- [F223→F227 correction pack](./storyboards/basket-to-water-cluster-f223-f227-v1.png)
- [F228→F232 correction pack](./storyboards/basket-to-water-cluster-f228-f232-v1.png)

## Correction strategy

The first audit generated F225 and F230 independently. Those replacements
reduced individual exposure errors but could not guarantee identical basket
geometry and water texture across their neighboring frames.

Audit v2 replaces both problem areas as coherent multi-frame packs:

- F224, F225, and F226 are interpolated together between locked F223 and F227.
- F229, F230, and F231 are interpolated together between locked F228 and F232.

This keeps camera axis, basket structure, water volume, and lighting progression
inside one generation context for each cluster.

## Cluster A — basket to water

| Metric | Previous active pass | Coherent-cluster pass |
|---|---:|---:|
| Mean adjacent-frame delta | 14.7 | 11.1 |
| Maximum adjacent-frame delta | 28.3 | 15.4 |
| Largest absolute exposure step | 27.1 | 13.5 |

Active versions:

- F224 v2
- F225 v3
- F226 v2

## Cluster B — empty water

| Metric | Previous active pass | Coherent-cluster pass |
|---|---:|---:|
| Mean adjacent-frame delta | 9.8 | 6.5 |
| Maximum adjacent-frame delta | 14.3 | 10.1 |
| Largest absolute exposure step | 13.0 | 9.3 |

Active versions:

- F229 v2
- F230 v3
- F231 v2

## Full-sequence diagnostic

| Metric | Result |
|---|---:|
| Mean adjacent-frame delta | 8.3 |
| Maximum adjacent-frame delta | 15.4 |
| Largest absolute exposure step | 13.5 |

The measurements use 32 × 32 downsampled RGB proxies. They are continuity
signals, not aesthetic scores, and were reviewed together with the numbered
sheet and forward/reverse scrub.

## Acceptance decision

Pass the 48-frame proxy sequence as the timing and continuity authority.

## Promotion outcome

All 48 identities were promoted to 2048 × 2048 sRGB PNG masters with one
deterministic image pipeline, then encoded as a verified 48-frame, two-second,
24 fps H.264 movie.

See [2K Master Delivery v1](./basket-to-water-pilot-master-delivery-v1.md) for
frame checksums, codec metadata, decode count, and the encode-fidelity audit.
