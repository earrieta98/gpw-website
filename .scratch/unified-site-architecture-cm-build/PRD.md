# PRD — Unified Site Architecture + Contract Manufacturing Build

Status: ready-for-agent
Feature: unified-site-architecture-cm-build
Repo: gpw-website (branch `master` = project/source; `main` = cPanel deploy)
Source of truth: `CONTEXT.md`, `docs/adr/0001-unified-site-architecture.md`, `docs/adr/0002-delivery-model.md`

## Problem Statement

GPW's site reads as three separate, half-built websites stitched together: a corporate umbrella, a complete Assembly & Integration (EMS) section, and a Contract Manufacturing section that is only a `noindex` "Coming Soon" placeholder. The placeholder is the worst page on the site even though CNC Machining is GPW's immediate revenue priority. The corporate `About` and `Contact` links are dead (404). Every "Request a Quote" routes to an assembly-branded form, so a machining buyer has no on-brand quote path. The CNC copy that exists (16 drafts) describes in-house machining GPW does not actually do — GPW coordinates a Monterrey machining network, it does not own the machines. The visual design has pervasive gray "Photo: …" placeholders. For a pre-revenue company whose site must convince risk-averse U.S. OEM procurement buyers (and spectating investors) that GPW is a serious, established supplier, the current structure, the dishonest in-house framing, and the placeholders are all active disqualifiers.

## Solution

Restructure the site into ONE Global Precision Works brand with a single global navigation (two capability tabs, Keller model), build out the Contract Manufacturing (CNC Machining) section to credible parity with Assembly & Integration, and run an ambitious brand-locked visual refresh. Present the two capabilities honestly per their real delivery model: **Assembly & Integration is in-house**; **CNC Machining is delivered through a vetted, managed Monterrey machining network**, positioned explicitly as a strength (the Xometry/Fictiv posture), never as a broker. Industries become one shared concept (10 verticals) with a single page per vertical covering both capabilities. There is one unified RFQ with a capability selector. Fix every credibility disqualifier (dead links, the placeholder, the imagery). The result is a coherent, honest, professional site where a buyer sees competence in the first 10–20 seconds and the #1 conversion (RFQ) works for both capabilities.

## User Stories

1. As a U.S. OEM procurement buyer, I want one consistent navigation across the whole site, so that GPW reads as a single established company rather than three half-built sites.
2. As a buyer, I want to see both of GPW's capabilities (CNC Machining and Assembly & Integration) as peer top-level options, so that I can immediately find the one I need without guessing.
3. As a buyer who needs a machined part, I want a real, indexable CNC Machining section (not a "Coming Soon" page), so that I can evaluate GPW as a machining supplier.
4. As a buyer, I want to understand within seconds that GPW is one accountable nearshore supplier that can both machine parts and assemble them in-house, so that I grasp the vertical-integration value.
5. As a buyer, I want an honest explanation of how GPW delivers machining (a managed Monterrey network with GPW owning DFM, quality, and accountability), so that I trust the supplier and am not misled into thinking they own machines they don't.
6. As a sophisticated buyer, I want the managed-network model framed as scalable capacity with a single point of accountability, so that I see it as a strength rather than a broker risk.
7. As an aerospace buyer, I want a single "Aerospace & Defense" industry page that shows both machining and assembly for my sector, so that I don't have to hunt across duplicate pages.
8. As a buyer in any of the 10 served industries, I want a dedicated page for my end market, so that I see GPW understands my sector's requirements.
9. As a buyer searching for "CNC heat sink" or "electronics enclosure machining," I want a clear Electronics page that owns generic electronics-machining queries without competing with Telecom or AI & Server Rack, so that I land on the right page.
10. As a buyer, I want one unified Request-a-Quote form with a capability selector (CNC Machining / Assembly & Integration / Both / Not sure), so that I can request a quote for either or both capabilities in one place.
11. As a buyer who needs a part machined AND assembled, I want the RFQ to capture a "Both" request, so that GPW gets my full vertical-integration opportunity.
12. As a machining buyer, I want to upload my CAD file (STEP/IGES/DWG, etc.) with the RFQ, so that GPW can quote accurately and offer a DFM review.
13. As a buyer, I want a free DFM review (Engineering Support) offered before I commit, so that I get value before buying and see GPW as an engineering partner.
14. As a buyer evaluating risk, I want a Quality page describing GPW's QMS, inspection, traceability, and a dated ISO 9001 roadmap, so that I can assess GPW's quality maturity honestly.
15. As a buyer comparing nearshore options, I want a "Why Mexico" page with real cost/proximity/USMCA data, so that I can justify nearshoring to my team.
16. As a buyer, I want a real Contact page with a Monterrey address, phone, and email, so that I can verify GPW is a real company and reach them.
17. As a buyer, I want a real About page with the team, story, and legal entity (S.A.P.I. de C.V.), so that I can assess GPW's legitimacy.
18. As a buyer, I never want to hit a dead link or a 404, so that the site reads as finished and trustworthy.
19. As a buyer on mobile, I want the unified navigation to collapse cleanly with large touch targets, so that I can navigate on a phone or shop-floor tablet.
20. As a buyer, I want real or credible imagery (not gray placeholders), so that the site looks like a real supplier's site.
21. As a returning buyer, I want my old bookmarked EMS industry/RFQ URLs to still work (via 301), so that I don't lose access after the restructure.
22. As a spectating investor, I want the site to look like a coherent, market-ready company, so that I'm convinced GPW knows how to reach its market.
23. As a CNC Machining buyer, I want service pages (milling, turning, wire EDM, sheet metal, surface finishing) with real capability specs and honest network framing, so that I can match GPW to my part.
24. As a buyer, I want Materials pages (metals, plastics) describing what the network can machine, so that I can confirm my material is covered.
25. As GPW's sales team, I want each RFQ lead labeled by capability (CNC / Assembly / Both), so that the right person follows up with the right context.
26. As GPW's sales team, I want spam-filtered RFQ submissions (reCAPTCHA), so that I only handle real leads.
27. As GPW marketing, I want the visual design refreshed but strictly within the brand book (Lato/Trirong fonts, teal/coral/deep-blue/lime colors), so that the site looks premium without violating brand identity.
28. As GPW marketing, I want the refresh applied at the design-system level so it cascades to the existing 22 EMS pages, so that the whole site stays visually consistent.
29. As GPW, I want the CNC copy validated against the copywriting guide as each page is built, so that nothing off-brand or dishonest ships.
30. As GPW, I want AI-generated imagery used first where quality allows, falling back to licensed stock or abstract/technical visuals, so that we get custom on-brand imagery efficiently without faking a facility.
31. As a search engine / AI answer engine, I want clean shared `/industries/` URLs, correct 301s, updated sitemap and schema, so that GPW's pages are indexed and cited correctly after the move.
32. As a buyer, I want "AI & Server Rack" reachable as a featured top-level nav item (in addition to living in Industries), so that the highest-growth angle is easy to find.
33. As GPW, I never want the site to claim owned machining equipment, machine counts, certifications, or clients that do not exist, so that one false claim doesn't poison buyer trust.

## Implementation Decisions

**Architecture (ADR-0001):**
- One brand, one global navigation replacing the three independent navs. Top nav: `CNC Machining ▾ | Assembly & Integration ▾ | Industries ▾ | AI & Server Rack | Quality | About | Contact | [Request a Quote]` (Keller two-capability-tab model). Each capability tab links to its hub and exposes a dropdown of its services.
- Capability service pages keep existing URLs (`/contract-manufacturing/*`, `/ems/*`) — no `/ems/`→`/assembly/` rename.
- Industries are a shared concept: 10 verticals at `/industries/*`, one page per vertical covering both capabilities, built additively (add a CNC Machining section to the existing assembly industry pages rather than rewriting them). Move the 8 existing industry pages to `/industries/` with 301s; add 2 new (`oil-gas`, `electronics`).
- Industry taxonomy (10): Aerospace & Defense, Automotive, Medical Devices, Industrial Equipment, Energy, Oil & Gas, Telecom, Electronics, AI & Server Rack, Appliances & White Goods. Telecom / Electronics / AI & Server Rack are disambiguated by the buyer's end market, not component type; Electronics is the broad default that owns generic electronics-machining queries.
- One unified RFQ at `/request-a-quote/` with a capability selector that reveals relevant fields; 301 from the existing assembly RFQ URL.
- Engineering Support lives under the CNC Machining capability; Why Mexico is a shared page linked contextually (not a nav item).
- `AI & Server Rack` keeps a featured top-level nav slot in addition to being industry #9.

**Delivery-model framing (ADR-0002):**
- Assembly & Integration copy = in-house (direct capability claims allowed).
- CNC Machining copy = coordinated managed network; GPW owns DFM, QA, logistics, accountability — never claims owned machines/machine-counts/shop-floor. Network presented explicitly as a strength (managed manufacturing partner / single point of accountability), never as broker/marketplace/middleman.
- The 16 CNC draft copy files must be rewritten to this angle AND re-split to the 10-vertical taxonomy before building.

**Modules:**
- **A. Design System** — brand-locked refresh of the shared stylesheet's design tokens and components (typography scale, color usage, buttons, cards, nav, sections, spacing). Stable class-name interface consumed by all pages; refresh cascades site-wide; existing EMS pages verified/adjusted. Built with the frontend / UI-UX skills, respecting the brand book (no changes to registered fonts/colors/identity).
- **B. Global Navigation** — single shared header markup + nav interaction logic (dropdowns/mega-menu, mobile collapse, large touch targets). Replaces corporate, EMS, and CM navs. Consistent on every page.
- **C. Unified RFQ** — form with a capability selector revealing capability-specific fields (CNC: process type, material, tolerance, quantity, CAD upload, free-DFM checkbox; Assembly: services, volume, timeline), plus shared identity fields. The existing RFQ handler is extended to: route each lead by selected capability (CNC / Assembly / Both) to the sales team with that context, validate fields and file uploads (existing allowed-extensions + size limits, already CAD-capable), and gate on reCAPTCHA v3. Single endpoint, single email-to-sales flow with capability tagging.
- **D. Routing & redirects** — 301 map (industry moves to `/industries/*`, RFQ move to `/request-a-quote/`), remove the CM `noindex`/"Coming Soon" placeholder, update sitemap and robots, crawl to confirm no 404s before deprecating old paths.
- **E. CNC Machining section** — hub + 5 service pages + Engineering Support + 2 materials pages, with coordinator-honest copy, capability specs, schema (Service/FAQ/Breadcrumb), and the free-DFM Engineering Support CTA.
- **F. Industries (10, shared)** — shared page template; additive machining section on the 8 existing pages; 2 new pages; cross-links between machining and assembly per industry.
- **G. Corporate & trust pages** — homepage restructured (integrated value-prop hero → legitimacy strip → two equal capability cards → vertical-integration band → 10-industry router → nearshoring/USMCA → RFQ), new Quality page (QMS, inspection, network quality governance, in-house assembly QA, dated ISO 9001 roadmap, cert-to-industry mapping), new Why Mexico page (re-scoped company-wide from the CNC draft), new About and Contact pages.
- **H. Imagery pipeline** — AI-first generation (existing image-prompt tooling) with fallback to licensed stock then abstract/technical visuals; replace all gray placeholders; never caption any image as GPW's own facility.

**Honesty guardrails (apply to all copy):** no owned-machine claims for machining; no fabricated certs/numbers/clients; present-tense scale claims only where true; dated roadmaps for what is not yet in place.

## Testing Decisions

- **What makes a good test here:** assert externally observable behavior, not implementation details. For this static-site-plus-PHP project, that means: given an RFQ submission, the correct lead routing/output and validation results occur; given the redirect map, old URLs resolve to new ones; given a page, no dead links and no accessibility regressions.
- **Logic tests (module C, Unified RFQ handler):** capability routing (CNC / Assembly / Both each produce the correctly-tagged lead to the right recipients), field sanitization, file-upload validation (allowed extensions accepted, disallowed/oversized rejected), reCAPTCHA gating (missing/low-score token rejected, valid token accepted). This is the one module with real branching logic and it guards the #1 conversion. Prior art: the existing RFQ handler already implements reCAPTCHA verification, field sanitization, and upload validation — extend its behavior and test the new capability-routing branch.
- **Verification pass (not unit tests):** automated link + redirect crawl (every internal link 200s, every 301 in the map resolves, no orphaned old paths), accessibility checks (building on the prior UI/UX audit's findings — aria attributes, form labels, landmarks, skip-nav), and a visual review of the design refresh across each page-type template (home, hub, service, industry, quality, RFQ, about/contact). Run via the project's browser-driven tooling.
- **Out of testing scope:** unit-testing presentational HTML/CSS pages; visual-regression snapshots for every page; full E2E browser suites (the founder chose "RFQ + verification," not "maximum testing").

## Out of Scope

- The full `/ems/`→`/assembly/` URL rename (capability service URLs are deliberately kept; only Industries and the RFQ move).
- Rewriting existing Assembly & Integration (EMS) page copy — EMS pages get additive machining sections on their industry pages and design-refresh verification only, not a content rewrite.
- Building the actual partner machining network, achieving ISO 9001 certification, standing up a physical plant, or any non-website business operation.
- A CRM, marketing automation, or analytics re-platform.
- Any migration off the current static HTML/CSS/JS + PHP stack (Next.js/Supabase is a separate future roadmap item).
- Real photography of a GPW facility (none exists; imagery is AI/stock/abstract).
- Changing anything registered in the brand book (fonts, colors, identity are fixed inputs).

## Further Notes

- Work happens on branch `master`; the live site deploys from `main`. Nothing in this PRD changes the live site until explicitly deployed. Per project rules, public/strategy changes get the founder's approval before going live.
- Suggested build sequence (mirrors what made EMS credible, so prospecting can start ASAP):
  - **Phase 0 — Unblock:** real About + Contact (kill the 404s), unified RFQ live (kill the assembly-only quote path), remove the CM `noindex` placeholder.
  - **Phase 1 — CNC credible flagship (the gate to start prospecting):** CNC Machining hub + Engineering Support + Quality + Why Mexico + downloadable capability statement; coordinator-honest copy. At the end of Phase 1, CNC Machining is indexable, quote-enabled, and reads as a real (managed) supplier.
  - **Phase 2 — Depth & consistency (while prospecting):** remaining CNC service/material pages, the 10 shared industry pages with additive machining sections + 2 new verticals, the design-system refresh cascaded and verified across all 22 EMS pages, imagery pipeline, full 301 map + sitemap/schema.
- Replace the known phone-number placeholder (`+52 (81) XXXX-XXXX`) site-wide when the real number is available.
- Domain glossary in `CONTEXT.md` is authoritative for all copy vocabulary (Capability, Manufacturing network, Single point of accountability, Industry, OEM, RFQ, etc.).
