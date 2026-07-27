# NEVORA — Farm to Cup Scroll Journey

Status: Narrative master plan  
Experience model: One continuous scroll-controlled film

## Core rule

The visitor's scroll is the timeline. Scrolling forward advances the coffee
journey; scrolling backward reverses it. The experience uses native scrolling,
so the visitor always retains control.

The film begins on the farm and finishes only when brewed coffee settles inside
the final ceramic mug. Commercial UI appears after the story has earned it.

## Master timeline

| Progress | Scene | Narrative beat | Continuous transition |
| --- | --- | --- | --- |
| 0–10% | 01. Origin at Dawn | Dew, leaf, ripe cherry | Fingertips approach the cherry |
| 10–19% | 02. Hand Harvest | One cherry is selected by hand | Cherry falls into a dark woven basket |
| 19–29% | 03. Processing | Skin opens, seed is washed clean | Water reflection becomes morning sky |
| 29–38% | 04. Sun Drying | Beans move across raised drying beds | A raking line becomes a burlap seam |
| 38–45% | 05. The Journey | Green coffee rests and travels | Bag shadow becomes the roaster drum |
| 45–58% | 06. Roasting | Heat builds; green turns cinnamon then brown | Rotating bean matches grinder rotation |
| 58–68% | 07. Grinding | Structure breaks into precise grounds | Falling grounds become a dark vertical stream |
| 68–84% | 08. Brewing | Water meets coffee; bloom, extraction, aroma | Coffee stream continues into the mug |
| 84–94% | 09. The Ritual | Coffee surface settles; steam catches light | Steam creates the NEVORA reveal space |
| 94–100% | 10. Brand & Discovery | Brand promise and product entry | Film opens into the shoppable experience |

## Scene 02 — Hand Harvest

### Story beat

The hand completes the touch established in Scene 01. It twists the ripe cherry
gently; the branch rebounds; the cherry lands among only a few carefully chosen
fruits. Harvest is presented as selection, not volume.

### Frame progression

- `0.00–0.18`: fingertips make contact; skin and dew compress naturally
- `0.18–0.42`: a small twist releases the cherry without shaking the branch
- `0.42–0.62`: focus follows the cherry through a controlled fall
- `0.62–0.82`: the cherry lands in a dark woven basket in slow visual time
- `0.82–1.00`: basket weave fills the frame and becomes the texture of processing

Copy: **Chosen by hand. Not by chance.**

## Scene 03 — Processing

### Story beat

The fruit gives way to the seed. Water, pressure, and time reveal what will
eventually become coffee.

### Frame progression

- Cherry skin separates in an intimate mechanical macro shot
- Pale seeds slide into clear moving water
- Floating material separates without turning the scene into a factory demo
- Water slows; one clean seed remains in sharp focus
- Reflection on water expands into the bright geometry of the drying bed

Copy: **Clarity begins with what we remove.**

## Scene 04 — Sun Drying

### Story beat

Time becomes visible. Rows of parchment coffee breathe under natural sun while
a wooden rake creates a slow, satisfying wave.

### Frame progression

- Wide overhead rhythm establishes the drying bed
- Scroll moves the rake and the wave of beans exactly forward or backward
- Shadows shorten subtly to communicate passing hours
- Macro texture reveals the dry parchment shell
- One diagonal row becomes the seam of a burlap bag

Copy: **Time does the quiet work.**

## Scene 05 — The Journey

### Story beat

This is a short bridge, not a logistics montage. Origin information is stamped
as accessible UI beside the material: altitude, region, process, and harvest.

### Frame progression

- Burlap texture and stitched origin mark
- A controlled lateral move through shadow
- Ambient light changes from natural gold to the roastery's copper warmth
- Circular darkness resolves into the roaster drum

Copy: **Origin, carried intact.**

## Scene 06 — Roasting

### Story beat

Heat translates agriculture into aroma. Color, expansion, and the first crack
are shown as craft rather than spectacle.

### Frame progression

- Green beans enter the drum
- Color changes through straw, cinnamon, and roasted brown as scroll advances
- Macro surface expands; the central crease opens
- A restrained burst of chaff crosses warm light at first crack
- One roasted bean rotates into the exact axis of the grinder burr

Copy: **Heat reveals what the land began.**

## Scene 07 — Grinding

### Story beat

The roasted bean becomes a precise texture. The scene prioritizes material
detail and rhythm, avoiding aggressive machinery.

### Frame progression

- Burr edge enters from darkness
- Bean fractures in a controlled macro view
- Particle size settles into an even grind
- Grounds fall in a narrow column
- The column match-cuts to the first stream of brewing water

Copy: **Precision, measured in moments.**

## Scene 08 — Brewing

### Story beat

This is the sensory climax: bloom, water, extraction, steam, and the first drop.

### Frame progression

- Water touches the bed and triggers the bloom
- Gas bubbles expand and collapse at macro scale
- Circular pour follows scroll progress without looping independently
- Coffee gathers beneath the filter
- The first dark stream enters the ceramic mug

Copy: **Water finds the story within.**

## Scene 09 — The Ritual

### Story beat

The mug is finally revealed. Motion decelerates. The coffee surface settles,
morning light crosses the ceramic, and a thin line of steam creates silence.

### Frame progression

- Mug rises from shadow while the stream continues
- Stream narrows and stops
- Concentric ripples settle according to scroll velocity
- Steam catches the same upper-left amber light from Scene 01
- The complete cup holds for enough scroll distance to breathe

Copy:

**From origin, to ritual.**

`NEVORA — Every cup carries the journey.`

## Scene 10 — Brand & Product Discovery

The camera pulls back from the mug into a calm editorial product composition.
Navigation, product discovery, and the first meaningful CTA appear here. This is
the boundary between the cinematic story and the commerce experience.

Primary CTA: `Discover the collection`  
Secondary action: `Replay the journey`

## Global scroll behavior

- Scene progress is deterministic and reversible.
- No scene advances without user scroll after its entrance settles.
- Small ambient motions may continue independently, but stop when the tab is hidden.
- Scene boundaries share at least one visual object, direction, or light source.
- Scroll snapping is prohibited; gentle chapter markers may be exposed to assistive UI.
- Keyboard, touch, wheel, and scrollbar dragging produce the same narrative state.

## Rendering strategy

Use the least expensive technique that preserves the shot:

1. Layered images and transforms for depth, masks, and simple focus changes
2. Short optimized image sequences for irreversible material transformations
3. Canvas for frame-accurate drawing and responsive cropping
4. WebGL only for effects that cannot be achieved within the performance budget

Do not render the entire journey as one huge video. Each scene owns its assets,
loading policy, fallback poster, and reduced-motion state.

