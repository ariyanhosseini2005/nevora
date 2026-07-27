# NEVORA — One-Take Visual Development Bible v1

Status: Final-look direction ready for approval  
Production state: Twelve hero frames locked as a contact-sheet reference; frame-sequence production remains frozen

## Approved look-development sheet

![Farm-to-shot photorealistic look-development contact sheet v1](./storyboards/farm-to-shot-lookdev-contact-sheet-v1.png)

This sheet translates the approved storyboard into the intended final visual
language. It is the shared reference for lighting, optics, texture, color,
atmosphere, and hero-object continuity. It does not yet replace the grayscale
animatic or represent a finished frame sequence.

## Global visual language

- Ultra-photorealistic live-action coffee advertising; never illustration or obvious CGI.
- Warm directional light enters from the upper-left in every environment.
- Deep controlled shadows and protected highlights preserve a premium filmic range.
- Macro proximity dominates the journey; the viewer should feel surface, moisture, heat, and viscosity.
- Depth of field is shallow but motivated: the hero object must always remain readable.
- Subtle organic 35 mm grain is acceptable; digital oversharpening and plastic smoothing are not.
- No text, logo, packaging, or commerce UI appears inside the transformation film.

## Color progression

| Range | Dominant color logic | Emotional purpose |
| --- | --- | --- |
| Frames 000–179 | Living deep greens, wet highlights, restrained crimson | Origin, freshness, human selection |
| Frames 180–347 | Basket umber, mineral water tones, pale seed green | Separation, cleansing, preparation |
| Frames 348–491 | Patinated steel, copper, ember warmth, roasted brown | Heat, transformation, intensity |
| Frames 492–671 | Graphite metal, dark grounds, amber espresso | Precision, pressure, release |
| Frames 672–719 | Warm crema gold against deep coffee brown | Completion, calm, luxury |

The grade must progress gradually. A new environment may change the dominant
material, but it may not flip light direction or introduce a disconnected color cast.

## Hero-frame specifications

### 01 — Origin at dawn

- Lens: 100 mm macro language at leaf height.
- Focus: wet foreground leaf and the path into the arabica plants.
- Material proof: real leaf veins, imperfect edges, dense dew beads, moist soil.
- Light: low golden dawn from upper-left with controlled haze.

### 02 — Ripe cherry discovery

- Lens: 100 mm macro.
- Focus: crimson hero cherry; branch and wet leaf fall away into organic bokeh.
- Material proof: natural skin pores, tiny imperfections, realistic water droplets.
- Continuity: same branch geometry and light direction as frame 01.

### 03 — Human selection

- Lens: 85–100 mm close macro.
- Focus: the contact point between weathered fingertips and cherry.
- Material proof: real skin texture, nail detail, fine creases; never glamorized hands.
- Constraint: no face, arm, jewelry, or second hand.

### 04 — Basket fall

- Lens: 85 mm with downward follow.
- Focus: same crimson cherry falling into dark woven fibers.
- Material proof: handmade plant-fiber weave, rough edges, deep physical occlusion.
- Transition duty: the dark weave must be capable of filling the full frame.

### 05 — Wet processing reveal

- Lens: 100–120 mm underwater macro.
- Focus: red skin opening around one pale green seed.
- Material proof: refracted light, bubbles, moving water, wet translucent pulp.
- Constraint: biologically believable separation; no surreal explosion.

### 06 — Water to drying bed

- Lens: 85 mm macro.
- Focus: same pale wet seed crossing from water onto sun-aged wood.
- Material proof: mineral water reflections, wet seed membrane, textured wooden edge.
- Transition duty: water highlight and wood edge share one continuous line.

### 07 — Roaster entry

- Lens: 65–85 mm.
- Focus: pale seed immediately before the circular drum mouth.
- Material proof: patinated steel, dark drum depth, worn wooden/metal guide surface.
- Continuity: the converging guide rails preserve the camera axis.

### 08 — Heat transformation

- Lens: 65 mm inside the drum.
- Focus: hero bean sharp while surrounding beans describe rotation.
- Material proof: progressive browning, expanding surface, developing pores and oils.
- Light: controlled copper/ember reflections; never open flame spectacle.

### 09 — Grinder alignment

- Lens: 85–100 mm macro.
- Focus: roasted bean crease aligned with the center of steel burrs.
- Material proof: sharp machined edges, restrained bean oils, micro-scratched metal.
- Transition duty: crease and burr geometry define the same scale-change axis.

### 10 — Grounds in portafilter

- Lens: 100 mm macro.
- Focus: falling particles and the forming coffee bed.
- Material proof: varied particle sizes, believable gravity, brushed metal reflections.
- Constraint: no pre-formed mound teleportation; the bed visibly accumulates.

### 11 — Extraction

- Lens: 100 mm macro below a bottomless portafilter.
- Focus: first viscous amber-brown streams.
- Material proof: translucent liquid edges, micro-bubbles, real steel reflections.
- Constraint: no latte art, cup rim, or decorative steam in this frame.

### 12 — Completed ritual

- Lens: visual language opens to 50 mm during the pullback.
- Focus: full double-wall espresso glass and settled crema.
- Material proof: optical glass distortion, restrained reflection, layered crema.
- Light: same warm upper-left source, now calmer and broader.
- Constraint: clean final composition with no props, logo, text, or packaging.

## Continuity invariants for image production

1. The hero object's crease, asymmetry, and scale evolution must remain traceable.
2. Screen direction never reverses without an on-screen physical cause.
3. Upper-left key light and lower-right falloff remain constant.
4. Every environment change is owned by an occlusion, matched edge, shared circle, or continuous material flow.
5. Background beans may exist only where the process requires them; the hero bean remains visually prioritized.
6. The final glass appears only after extraction begins.

## Master generation prompt

Use case: ads-marketing  
Asset type: cinematic hero frame for a luxury coffee transformation film  
Primary request: create the specified beat from a single continuous camera journey from coffee farm to finished espresso, matching the approved look-development contact sheet.  
Style/medium: ultra-photorealistic live-action premium commercial photography; real optical character; natural micro-imperfections; subtle 35 mm film grain; never illustration or CGI.  
Lighting/mood: warm directional key always from upper-left; deep controlled shadows; protected highlights; intimate, tactile, cinematic luxury.  
Color palette: follow the locked progression from living greens and crimson through mineral seed green, copper heat, roasted brown, amber extraction, and crema gold.  
Continuity constraints: preserve the hero object's identity, camera direction, light direction, and the transition geometry defined for the adjacent beats.  
Constraints: no text, captions, numbers, logos, watermark, unrelated props, packaging, faces, or extra hands.  
Avoid: painterly texture, sketch lines, sepia illustration, 3D-render look, plastic surfaces, surreal transformation, duplicated hero objects, flipped lighting, unrelated camera angles.

## Production method

The look-development sheet was produced with the built-in image-generation flow
using the approved sepia storyboard as the composition and narrative reference.
The photorealistic sheet is saved in the project at:

`docs/homepage/storyboards/farm-to-shot-lookdev-contact-sheet-v1.png`

## Next approval gate

The global final look now drives [Transition Pack 01](./transition-pack-01-basket-to-water.md),
which defines the before, full-occlusion, and water-reveal anchors for the
highest-risk basket-to-processing seam. The next approval gate is continuity of
that transition before solving the water-to-drying boundary.
