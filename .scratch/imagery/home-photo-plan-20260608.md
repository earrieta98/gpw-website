# Homepage — Photographic Plan & Generation Prompts
**Created:** 2026-06-08 · **For:** GPW corporate home (`/index.html`)
**Who generates:** Enrique (manual, one image at a time — per workflow preference)
**Status:** slots + CSS hooks are built and ready; drop files in the listed paths.

---

## Hard rules (apply to EVERY prompt)
- **NO ESD wrist strap** — it renders as a watch and ruins the shot. If hands appear, bare wrist or gloves only.
- **NO readable text, labels, logos, or part numbers** anywhere in frame.
- **NO facility-wide / wide factory shots.** GPW has no plant yet — wide shots imply owned capacity we don't have. Stay on **tight close-ups of parts, materials, and hands-on detail.**
- Photoreal, not 3D render. Cool industrial lighting, shallow depth of field, dark/neutral backgrounds so the dark site UI blends.
- Honest by composition: show *craft and precision*, not scale we can't back.

---

## Slot 1 — HERO background plate  ⭐ (highest impact)
- **Path:** `img/hero/machining-closeup.jpg`
- **Size:** 2400 × 1350 px (16:9), JPG, < 400 KB after compression
- **Treatment:** sits UNDER the dark hero overlay (already darkened ~80–90% by CSS). Pick an image that reads even when dark.
- **Activate:** uncomment the `.gpw-hero { background: ... }` block at the bottom of `css/corporate-home.css`.
- **Prompt:**
  > Extreme close-up macro photograph of a freshly CNC-milled aluminum part, crisp machined surface with fine tool-path texture and clean chamfered edges, a few metal chips and faint cutting-fluid sheen, cool blue-grey industrial lighting, very shallow depth of field, dark out-of-focus background, photoreal, high detail, no text, no logos, no people. 16:9.

## Slot 2 — CNC Machining card photo (optional)
- **Path:** `img/hero/cnc-part.jpg`
- **Size:** 1200 × 800 px (3:2), JPG
- **Use:** can replace or sit above the icon in the "CNC Machining" spec card / capability card.
- **Prompt:**
  > Studio macro of a precision-machined stainless-steel component resting on a granite surface plate, a digital caliper beside it slightly out of focus, soft directional light raking across the machined flats, neutral grey background, photoreal, no text, no logos, no people. 3:2.

## Slot 3 — Assembly & Integration card photo (optional)
- **Path:** `img/hero/assembly-harness.jpg`
- **Size:** 1200 × 800 px (3:2), JPG
- **Prompt:**
  > Close-up of a neatly laced wire harness / cable assembly on a clean workbench, organized bundles with cable ties and connectors, shallow depth of field, cool neutral lighting. Bare hands may appear mid-task — NO wrist strap, NO watch. Photoreal, no readable labels, no logos, no faces. 3:2.

## Slot 4 — Specs section accent (optional)
- **Path:** `img/hero/parts-array.jpg`
- **Size:** 1600 × 900 px (16:9), JPG
- **Prompt:**
  > Overhead studio shot of an arranged group of varied precision-machined parts — anodized aluminum, brass, and stainless components of different geometries — on a dark matte surface, even soft lighting, subtle reflections, photoreal, no text, no logos. 16:9.

---

## After generating
1. Compress (TinyPNG / squoosh) to keep each file small.
2. Drop into the paths above.
3. For the hero: uncomment the background block in `css/corporate-home.css` (search "HERO PHOTOGRAPHIC PLATE").
4. For card photos (slots 2–4): tell Claude and it will wire the `<img>` into the cards.
5. Review on `localhost:8181` before any deploy.
