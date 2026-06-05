# 01 — Design system refresh (tokens + components, brand-locked)

Status: done
Closed: 2026-06-04
Parent: ../PRD.md

## What to build

Brand-locked refresh of the shared design system — design tokens and core components (typography scale, color usage, buttons, cards, navigation chrome, section layouts, spacing). Elevate layout, hierarchy, and polish to a premium B2B standard while strictly preserving the registered brand: Lato/Trirong fonts and the teal/coral/deep-blue/lime palette (no changes to anything in the brand book). Deliver the refreshed token/component layer plus one reference page (homepage hero or a representative template) rendered in the new system for visual sign-off, so the direction is approved before it cascades site-wide. Built with the frontend / UI-UX skills and current best practices.

## Acceptance criteria

- [x] Refreshed design tokens and core components defined in the shared stylesheet, consumed via stable class names.
- [x] No registered brand attribute changed (fonts, colors, identity per the brand book).
- [x] One reference page renders fully in the new system for approval.
- [x] Founder approves the visual direction before propagation (HITL).
- [x] Reduced-motion and responsive behavior preserved.

## Blocked by

None — can start immediately.

## Comments

### 2026-06-04 — Closed (done)

Implemented on branch `master` (`05-website/`); deploy (`gpw-main/`) untouched. Founder approved the visual direction (reference page) before propagation, then approved cascading site-wide.

**Delivered**
- Refreshed token layer in `css/styles.css` using `@layer` (primitive → semantic → component). Brand colors remapped to the **official web sRGB values** (`#095F5C` teal · `#F27257` coral · `#205364` deep-blue · `#A6D98E` lime · `#526255` military · `#C8C5C0` gray · `#FCF3EC` cream) — founder decision: the brand book prescribes sRGB for web; the AdobeRGB book hexes look dull off-Adobe. Old token names kept as aliases so all 22 pages recolor with zero HTML changes.
- New semantic layer: `surface↔on-color` pairs, text roles, `--accent-on-light`/`--accent-on-dark`, focus token, motion-duration tokens.
- Core component refresh: eyebrows in Trirong (brand rule enforced in CSS), buttons, focus states, sections.
- **WCAG AA fixes** (all were real failures): coral CTAs → ink text (white-on-coral = 2.87:1 → 6.07:1) on `.btn--primary`, `.btn--interactive`, `.cm-subnav__cta`; coral accent TEXT on light → teal (`.label--coral`, `.division-card__*`, `.service-row__*`, CM eyebrows, `project-card__number` ×8 industry pages); focus ring teal (coral failed 3:1); `--mid-gray` darkened to pass on cream; skip-link + reduced-motion (token-driven) + ink-tinted shadows.
- Reference page kept as living docs: `refresh-preview.html` + `css/refresh-preview.css`.

**Files touched:** `css/styles.css`, `css/cm-home.css`, `index.html`(via tokens), 8× `ems/industries/*.html` (inline `project-card__number`), `contract-manufacturing/index.html` (inline eyebrow), new `css/refresh-preview.css` + `refresh-preview.html`.

**Verified:** programmatic contrast audit + screenshots on 5 page-types (home, EMS hub, EMS service, EMS industry, CNC hub) → **0 contrast failures** each; responsive (390px) and reduced-motion preserved.

**Deferred to #16 (design-cascade-verification):** full contrast/visual sweep of the CNC service/industry/material pages (`cm-service.css`, `cm-industry.css` — build-in-progress, already on the new palette); add `<a class="skip-link">` + `<main>` markup per page; per-page adoption of the new `--fs-*` type scale. Also flagged: `main`/`master` `styles.css` divergence to reconcile at deploy time (deploy carries the March skip-link; now also in master's system).
