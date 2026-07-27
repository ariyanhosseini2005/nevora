# NEVORA — Step-by-Step Development Plan

Status: Working delivery plan  
Method: Build, review, approve, then unlock the next phase

## Delivery principle

The site is developed scene by scene, not page section by page section. Every
phase ends with a working browser demo and an explicit quality gate. Temporary
assets are allowed for motion validation, but no scene is considered final
until its art, performance, responsive behavior, and reduced-motion version pass.

## Bilingual experience lock

- The complete website ships in Persian and English.
- Language selection is available in the cinematic hero, desktop navigation,
  and mobile navigation.
- Persian uses native RTL document direction and Vazirmatn typography; English
  uses LTR direction and the Latin display/body system.
- The browser language selects the first visit; the visitor's manual choice is
  persisted locally.
- Navigation, cinematic copy, product data, accessibility labels, form states,
  numbers, ratings, and footer copy must change together. No mixed-language
  production state is acceptable.

## Phase 0 — Narrative and technical foundation

Deliverables:

- Lock the farm-to-cup master timeline
- Define scene contracts, normalized scroll progress, shared transitions, and copy
- Establish asset naming, responsive crops, and performance budgets
- Add a development-only scene/debug HUD

Quality gate:

- Every scene has a beginning frame, end frame, transition owner, and fallback state
- No contradiction remains between storyboard and implementation docs

## Phase 1 — Scroll engine prototype

Status: 144-frame vertical slice integrated locally; user visual approval pending

Deliverables:

- `CinematicJourney` scene orchestrator
- Native-scroll progress hook with `requestAnimationFrame` updates
- Sticky viewport and scene lifecycle management
- Canvas image sequence using 144 approved frames from F204 through F347
- Keyboard, touch, reverse-scroll, resize, and restored-scroll-position handling
- Reduced-motion mode and loading/error poster behavior

Current local integration:

- 144 scroll-addressable WebP frames at 1280 × 1280
- 11.39 MB total sequence payload for the local production preview
- Six-worker progressive buffering with the current canvas frame retained while
  later frames load
- Native-scroll playhead damping with an 82 ms visual response; no scroll
  hijacking and identical forward/reverse behavior
- Authored per-beat pacing for release, water, drying, and roaster threshold
- Priority buffering for the first frames, outgoing frame, beat boundaries, and
  evenly spaced scrub anchors
- Nearest-loaded-frame fallback so fast scrubbing never clears the canvas
- Frame HUD and four production-beat labels for F204–F347
- Immutable next boundary: F348 v004, first metal contact

Quality gate:

- Stable forward and reverse playback with no visible scene jump
- No scroll hijacking
- Prototype maintains target frame rate on desktop and a mid-range mobile profile

## Phase 2 — Origin and harvest

Scenes: 01 and 02

Deliverables:

- Final farm keyframes and portrait crops
- Dawn reveal, focus transfer, ripening, hand contact, pick, and basket transition
- Accessible story copy and first optional sound layers
- Automated visual and interaction checks for the opening journey

Quality gate:

- Farm is the first meaningful paint
- Scene 01 to Scene 02 reads as one continuous camera experience
- Critical opening asset budget passes

## Phase 3 — Processing and drying

Scenes: 03 and 04

Deliverables:

- Cherry-to-seed transformation
- Water processing sequence
- Scroll-controlled drying-bed wave and time progression
- Basket-to-water and drying-row-to-burlap match transitions

Quality gate:

- Transformations remain photographically credible in both scroll directions
- Educational meaning is understandable without long text

## Phase 4 — Journey and roasting

Scenes: 05 and 06

Deliverables:

- Accessible origin facts integrated into the film
- Roastery lighting transition
- Color-development sequence and first-crack moment
- Roasted-bean asset continuity into the grinder

Quality gate:

- Origin facts remain readable and keyboard accessible
- Heat effects stay restrained and realistic
- Memory use remains within the per-scene loading budget

## Phase 5 — Grinding and brewing

Scenes: 07 and 08

Deliverables:

- Macro fracture and even-ground sequence
- Bloom, circular pour, extraction, and first stream
- Fine-grain scroll mapping for the sensory climax

Quality gate:

- Scrubbing backward never exposes missing or incorrect frames
- Particle and liquid motion degrade gracefully on mobile

## Phase 6 — The cup and brand reveal

Scenes: 09 and 10

Deliverables:

- Final ceramic mug and coffee surface simulation/sequence
- Steam and light continuity back to the opening sunrise
- Brand reveal, final copy, replay action, and product-entry CTA
- Smooth transition into the current product experience

Quality gate:

- The user sees a complete transformation from farm to coffee in the mug
- Commercial UI appears only after the narrative climax
- Replay returns to a valid, accessible initial state

## Phase 7 — Commerce integration

Deliverables:

- Replace the current generic homepage order with the cinematic journey plus
  editorial product discovery
- Product data/API boundary, product details, cart foundation, and newsletter API
- Analytics events based on scene milestones without tracking raw scroll noise

Quality gate:

- The cinematic layer does not block navigation, cart, or crawlable content
- The page remains useful when JavaScript or heavy media fails

## Phase 8 — Production hardening

Deliverables:

- Desktop, tablet, and mobile art direction pass
- Screen-reader and keyboard audit
- Reduced-motion and data-saving audits
- Lighthouse, Web Vitals, memory, thermal, and long-scroll testing
- Cross-browser testing and automated regression coverage
- Asset CDN, caching, preload, and fallback strategy

Quality gate:

- No critical accessibility issue
- No scene exceeds its agreed asset or frame-time budget
- Production build, test suite, and visual regression suite pass

## Working cycle for every scene

1. Storyboard the scene frame by frame.
2. Generate or source 1–3 approved keyframes.
3. Build a low-resolution motion prototype.
4. Review timing, camera path, copy, and transition in the browser.
5. Produce final image/video/sequence assets only after motion approval.
6. Implement responsive and reduced-motion variants.
7. Measure performance and accessibility.
8. Approve and lock the scene before starting the next one.

## Immediate next implementation milestone

Build Phase 1 as a vertical slice containing only:

- Scene 01 poster and sticky timeline
- Dawn light reveal
- One focus transition to the cherry
- Temporary transition marker into Scene 02
- Debug progress indicator enabled only in development

This milestone validates the scroll engine before expensive frame sequences are produced.
