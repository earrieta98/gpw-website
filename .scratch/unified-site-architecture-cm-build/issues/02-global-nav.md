# 02 — Unified global navigation (Keller) across all pages

Status: done
Closed: 2026-06-04
Parent: ../PRD.md

## What to build

Replace the three independent navigations (corporate, EMS, Contract Manufacturing) with ONE global navigation present on every page: `CNC Machining ▾ | Assembly & Integration ▾ | Industries ▾ | AI & Server Rack | Quality | About | Contact | [Request a Quote]` (Keller two-capability-tab model). Each capability tab links to its hub and opens a dropdown of its services. `AI & Server Rack` is a featured top-level shortcut in addition to being an industry. Includes the mobile collapse with large touch targets. Per ADR-0001.

## Acceptance criteria

- [x] Identical global nav renders on every page (corporate, CNC, assembly, industries, etc.).
- [x] Capability dropdowns list the correct services; Industries lists the 10 verticals.
- [x] RFQ is a persistent, visually distinct nav button.
- [x] Mobile nav collapses cleanly with large touch targets.
- [x] The three previous navs are fully removed; no orphaned nav markup.

## Blocked by

- 01

## Comments

### 2026-06-04 — Implemented (done)

Implemented on branch `master` (`05-website/`); deploy (`gpw-main/`) untouched. Founder approved the functional reference (`nav-preview.html`) before propagation, then approved cascading site-wide (HITL).

**Delivered**
- ONE unified global nav (Keller two-capability model) on all **42 pages**, replacing the three independent navs (corporate, EMS, Contract Manufacturing) **and** the utility-bar division-switcher — no orphaned nav markup.
- Capability tabs (CNC Machining, Assembly & Integration) = label **links to the hub** + a caret `<button>` that **opens a services mega-menu** (hover on desktop, accordion on mobile). Works with the existing `js/main.js` with **zero JS changes**.
- `Industries ▾` mega lists the **10 verticals**; `AI & Server Rack` is a featured top-level shortcut (`.nav__feature`, lime dot); `Request a Quote` is a persistent coral CTA (**ink on coral**, never white). Mobile drawer with ≥44px touch targets.
- Built on the #01 production system (`styles.css` + `utility-bar.css` + `main.js`). New deltas isolated in **`css/global-nav.css`**, loaded last so it wins the cascade — **`styles.css` and `utility-bar.css` were left untouched.**
- Honesty (ADR-0002): CNC mega copy framed as a managed Monterrey network ("GPW owns DFM, quality governance, on-time delivery"), never owned machines.

**Adjustments made during build**
- **WCAG**: the mega CTA `.nav__mega-cta--primary` shipped white-on-coral (~2.87:1) in `utility-bar.css` (a pre-existing failure on the EMS/CM megas) → overridden to ink (6.07:1) in `global-nav.css`.
- **Drawer breakpoint 768 → 1024** (the 8-item Keller nav can't fit horizontally below ~1024; 1024 already matched the `main.js` accordion breakpoint).
- **Light content pages** (`privacy-policy`, `terms`, `blog/index`, `blog/.../index`) set to a solid header (`header--scrolled header--fixed-scrolled`): the transparent `header--top` left white nav on a white hero (pre-existing #01 issue). The 38 dark-hero pages keep the approved transparent treatment.

**Method**: deterministic cascade — `.scratch/cascade-nav.py` extracts the approved block from `nav-preview.html` and re-prefixes paths per page depth (`./` / `../` / `../../`, and root-relative `/` for `404.html`), so the nav is byte-identical bar the path prefix. Backup of all 42 originals at `.scratch/nav-cascade-backup/`.

**Files touched:** 42 HTML pages (utility-bar + header block replaced; `utility-bar.css` / `global-nav.css` links added where missing — incl. the `ems/services/index.html` legacy outlier and `blog/*` which had no utility-bar); new `css/global-nav.css`, `nav-preview.html`, `css/nav-preview.css` (living reference), `.scratch/cascade-nav.py`. `styles.css` and `utility-bar.css` unchanged.

**Verified:** adversarial review workflow **42/42 PASS** (one `<header>` each, nav in order, no division-switcher, depth-correct paths, CSS links present, no old-nav remnants, well-formed); content greps (0 old-nav class remnants, 1 header/page, all 42 carry `nav__feature` + `global-nav.css`); browser checks across page types — corporate (home/about/contact), EMS service + the legacy outlier, RFQ form, CM hub mega, 404 (root-relative), blog, and mobile drawer + accordion.

**Notes / deferred:** the canonical nav destinations `/industries/<slug>/` (issue 13), `/quality/` (issue 08) and `/request-a-quote/` (issue 05) point to their final URLs but those pages **don't exist yet** → they 404 in-project until built. Footers still reference "divisions" (separate from the global nav). 301 map + sitemap/robots = issue 18.
