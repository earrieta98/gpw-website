# GPW Homepage Hero — Build Specification

## Overview

Build an animated hero section for the Global Precision Works (GPW) homepage. The hero tells the story of both GPW divisions through a single continuous animation: first a CNC part is machined from a raw billet (contract manufacturing), then additional components are assembled onto it (EMS/electromechanical assembly). This visually communicates GPW's full value proposition — we machine it AND we assemble it — in one seamless loop.

The hero has two animation layers that play sequentially on page load:

1. **Logo entrance animation** (plays once on page load)
2. **Machining → Assembly loop** (loops continuously after logo animation completes)

---

## Section 1: Layout structure

Split layout, full viewport height:

- **Left side (~40% width):** Text content — tagline, headline, subheadline, CTAs, division cards
- **Right side (~60% width):** Animated canvas showing the machining/assembly sequence
- **Background:** Full-width engineering grid (subtle, behind everything)
- **Bottom bar:** Phase indicator dots showing current stage of the animation

### Text content (left side):

```
[tagline]     ── GLOBAL PRECISION WORKS
[headline]    Precision assembly & contract manufacturing
[subheadline] Two divisions — CNC machining and electromechanical 
              assembly — built for U.S. OEMs. Same timezone. Same 
              standards. Two hours from the border.
[CTA primary] Request a quote
[CTA secondary] Explore divisions
```

Below the CTAs, two division cards separated by a vertical line:

```
DIVISION 01                    |  DIVISION 02
Contract manufacturing         |  EMS assembly
CNC precision machining        |  Electromechanical & box build
```

### Phase indicator (bottom center):

7 small dots in a pill-shaped container with a text label. Dots 1–4 use the teal/CNC accent color. Dots 5–7 use the coral/orange EMS accent color. The current phase label displays next to the dots.

### Division badge (top right):

A small badge that reads "CONTRACT MFG" during machining phases and "EMS ASSEMBLY" during assembly phases, with corresponding accent colors.

---

## Section 2: Background — Engineering grid

The entire hero has a subtle engineering/blueprint grid overlay at low opacity (~10-12%):

- Minor gridlines every 40px, very thin (0.3px), teal-tinted
- Major gridlines every 200px (5× minor), slightly thicker (0.5px), brighter teal
- This should be drawn on a separate canvas layer behind everything
- It evokes a CNC coordinate system / engineering drawing paper

---

## Section 3: Logo entrance animation (plays once on page load)

Before the main content appears, the GPW logo pieces animate in. Use the actual SVG paths from our logo files (g-letter.svg, p-letter.svg, w-letter.svg, isotipo.svg).

### Sequence:

| Step | Element | Direction | Delay | Duration | Easing |
|------|---------|-----------|-------|----------|--------|
| 1 | G letter | Enters from below | 0.3s | 0.7s | cubic-bezier(0.16, 1, 0.3, 1) |
| 2 | P letter | Enters from above | 0.6s | 0.7s | cubic-bezier(0.16, 1, 0.3, 1) |
| 3 | W letter | Enters from below | 0.9s | 0.7s | cubic-bezier(0.16, 1, 0.3, 1) |
| 4 | Isotipo (smiley G) | Enters from above | 1.3s | 0.7s | cubic-bezier(0.16, 1, 0.3, 1) |
| 5 | Isotipo right eye winks | scaleY: 1 → 0.05 → 1 | 2.4s | 0.25s | ease-in-out |
| 6 | "GLOBAL PRECISION WORKS" tagline | Fade in | 1.8s | 0.8s | ease |
| 7 | Logo shrinks and moves to nav position | Scale + translate | 3.0s | 0.8s | cubic-bezier(0.16, 1, 0.3, 1) |
| 8 | Hero content fades in (headline, sub, CTAs) | Fade + slide up | 3.2s | 0.8s | ease |
| 9 | Machining animation begins | — | 3.8s | — | — |

### Wink mechanism:

The isotipo SVG has a right eye element (circle or path). To make it wink:
- Give the right eye element an id: `id="eye-right"`
- Apply CSS animation: `transform: scaleY(0.05)` with `transform-origin: center center`
- The animation compresses the eye vertically to near-zero (looks like closing), then returns to scaleY(1)

### Implementation notes:

- Each logo piece starts with `opacity: 0` and `transform: translateY(±60px)`
- The animation uses CSS `@keyframes` with `animation-fill-mode: forwards`
- After the entrance, the logo transitions to the navbar (top-left corner) with a smooth scale-down
- All text content starts hidden and fades in after the logo settles

---

## Section 4: Machining → Assembly animation (continuous loop)

This is the core visual. An isometric 3D-style part rendered on a `<canvas>` element goes through 7 phases in a continuous loop.

### Visual style:

- **Isometric projection** with ~30° angle
- **Dark metallic color palette** — dark blues, teals for metal surfaces. No gradients, use flat faces with slightly different shades for top/left/right to create depth
- **Edge lines** at very low opacity between faces for definition
- Keep shapes simple — this is a schematic representation, not photorealistic

### Phase sequence:

Each phase has a duration of ~1.8 seconds with ~0.6 second pauses between phases.

---

**PHASE 1: RAW BILLET** (Contract Manufacturing)

- A solid rectangular block appears (isometric box)
- Represents raw aluminum/steel stock
- Top face slightly lighter, left face darker, right face medium — creates 3D illusion
- Static, establishing shot

**PHASE 2: FACE MILL** (Contract Manufacturing)

- The block's height reduces from top (material removal)
- A cutting tool (simple triangular/cylindrical shape) descends from above on a spindle line
- Tool enters at phase start, cuts during middle, retracts at end
- Small particle chips fly off in random directions during cutting, colored teal
- Chips have physics: initial velocity, gravity, fade out

**PHASE 3: POCKET CUT** (Contract Manufacturing)

- A rectangular pocket (cavity) opens in the top face of the block
- The pocket deepens and widens progressively
- The pocket interior is darker (shadow)
- Visible pocket walls (front and right side visible in isometric view)
- More chips fly during cutting, more aggressive than face mill
- Tool active during this phase

**PHASE 4: DRILL** (Contract Manufacturing)

- Three circular holes are drilled into the top face
- Holes appear as dark ellipses (isometric circles) with a subtle teal stroke
- Holes appear sequentially (one at a time or staggered)
- Small chips per hole
- These holes will later receive the fasteners in the assembly phase — this creates visual continuity between the two divisions

---

**PHASE 5: ASSEMBLY — COMPONENTS** (EMS Assembly)

- The machined part stays in place (it's now the chassis/enclosure)
- A PCB (printed circuit board) descends from above onto the part:
  - Green-tinted flat rectangle, thinner than the main block
  - Has visible traces (teal lines in circuit patterns)
  - Has small SMD components on top (small dark rectangles representing ICs, capacitors)
  - Lands inside or on top of the pocket area
- A side panel slides in from the right:
  - Thin vertical plate (representing an enclosure panel)
  - Darker purple/gray tint to differentiate from the metal chassis

**PHASE 6: FASTENING** (EMS Assembly)

- Screws/fasteners appear in the drill holes (one by one, sequentially)
- Each fastener: a small metallic circle with a cross/phillips pattern
- Brief spark/chip in coral/orange color when each fastener seats
- This ties back to the drill holes from Phase 4 — the manufacturing enabled the assembly

**PHASE 7: COMPLETE**

- The fully assembled unit sits complete
- PCB traces pulse with a subtle glow animation (the board is "alive")
- "ASSEMBLED" text fades in above the unit (small, monospace, low opacity)
- Hold for ~2 seconds
- Fade out, then loop back to Phase 1

---

### Animation rendering notes:

- Use HTML `<canvas>` for the machining/assembly animation (better performance for continuous rendering)
- The isometric projection function: `iso(x, y, z)` converts 3D coords to 2D screen coords
- Face drawing order matters for correct z-sorting (draw back faces first, then front)
- Chip particles: array of objects with position, velocity, gravity, lifetime. Spawn during active machining. Use `requestAnimationFrame` loop.
- Target 60fps, keep particle count manageable (~50 max on screen)
- Use `devicePixelRatio` for crisp rendering on retina displays

### Cutting tool:

- A vertical line from top of canvas to tool tip (the spindle)
- A small triangular/tapered shape at the bottom (the tool bit)
- Subtle glow circle around the tool tip when actively cutting
- The tool descends at phase start (first 12% of phase duration), stays at cutting position during middle (12-88%), retracts at end (88-100%)

---

## Section 5: Responsive behavior

- On screens < 768px: stack layout vertically (text on top, animation below)
- Animation canvas should maintain aspect ratio and center the isometric scene
- Phase indicator moves to below the canvas on mobile
- Logo entrance animation plays the same on all screens
- Touch devices: no hover states needed for the animation (it's autonomous)

---

## Section 6: Performance requirements

- No external animation libraries (no GSAP, no Three.js) — pure CSS animations + Canvas API
- Logo entrance: CSS `@keyframes` only
- Machining animation: `requestAnimationFrame` + Canvas 2D context
- Grid background: draw once on resize, don't redraw every frame
- Total JS for the hero should be under 5KB unminified
- The animation should not block page load — start after DOMContentLoaded

---

## Section 7: Interaction details

- The machining/assembly animation is autonomous — no user input required
- The animation loops infinitely: phases 1→2→3→4→5→6→7→pause→1→...
- On hover over the right side (canvas area), optionally show a crosshair cursor with live coordinates (like a CNC DRO readout) — this is a nice-to-have, not required
- CTAs are standard clickable buttons — "Request a quote" goes to /contact, "Explore divisions" goes to /divisions or scrolls to divisions section

---

## Reference

A working proof-of-concept of this animation exists (built as an inline widget). The core concepts are validated — isometric rendering, phase transitions with easing, chip particles, component assembly. This spec describes the production version which should be more polished:

- More detailed part geometry (fillets, chamfers, better proportions)
- More realistic PCB (more traces, realistic component shapes, connector outlines)
- Smoother transitions between phases
- Better lighting simulation on isometric faces
- The enclosure should look like a realistic server/rack component
