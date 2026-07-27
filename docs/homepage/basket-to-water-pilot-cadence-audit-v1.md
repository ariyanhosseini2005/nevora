# NEVORA — Basket-to-Water Cadence Audit v1

Status: **Complete 48-frame review sequence; conditional fail for final-master promotion.**

## Audit scope

- Timeline: F204–F251
- Review cadence: 24 fps
- Duration: 2.00 seconds
- Active proxies: 48
- Proxy dimensions: 439 × 439 px
- Missing or duplicated active frame identities: 0

Review artifacts:

- [Numbered review sheet v2](./storyboards/basket-to-water-pilot-review-sequence-v2.jpg)
- [Interactive forward/reverse scrub](./storyboards/nevora-one-take_f0204-f0251_scrub-v001.html)

## Passes

- One red-cherry identity remains readable through the basket descent.
- The hero is fully hidden from F222 through F233.
- The same red contour returns at F234 and becomes the pale green seed.
- Skin opening is monotonic from F238 through F251.
- F249 now bridges F248 and F250 without introducing a new seed or peel shape.
- All active proxies have identical dimensions and chronological filenames.

## Corrections completed in this audit

### F225 exposure bridge

The original F225 created the strongest detected exposure jump in the sequence.
An independently generated v2 now bridges the last basket geometry and incoming
water volume more gradually.

| Pair | Mean pixel delta | Exposure delta |
|---|---:|---:|
| F224→F225 v1 | 31.0 | +31.3 |
| F224→F225 v2 | 28.3 | +27.1 |
| F225 v1→F226 | 15.0 | −2.6 |
| F225 v2→F226 | 11.9 | +1.6 |

### F230 water-volume bridge

The original F230 carried a sharp darkening after F229. The active v2 distributes
that change more evenly across the F229→F231 interval.

| Pair | Mean pixel delta | Exposure delta |
|---|---:|---:|
| F229→F230 v1 | 18.6 | −16.8 |
| F229→F230 v2 | 5.5 | −3.9 |
| F230 v1→F231 | 5.5 | −0.2 |
| F230 v2→F231 | 14.3 | −13.0 |

The mean-delta values are downsampled diagnostic signals, not aesthetic scores.
They identify where a human forward/reverse review must concentrate.

## Remaining blockers

1. F224→F225 still changes exposure too quickly for final-master approval.
2. F230 v2→F231 still carries a visible water-volume and exposure change.
3. Basket texture and focus cadence from F204 through F217 require a slow reverse
   scrub before promotion.
4. No 48-frame full-resolution EXR sequence exists yet.
5. No encoded 24 fps MP4 master exists yet; the HTML scrub is the current review
   transport.

## Decision

Keep the complete 48-frame proxy timeline as the timing authority. Do not wire it
into the production website yet. The next pass should rebalance the F224–F226 and
F229–F231 clusters, then perform full forward, reverse, 0.25×, 1×, and 2× review
before any frame is promoted to a web or EXR master.
