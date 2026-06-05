# 0001 — Unified single-brand site architecture

Status: accepted

GPW's site is restructured from three independently-navigated sections (corporate umbrella, EMS, Contract Manufacturing) into ONE brand with a single global navigation. The two capabilities — CNC Machining (Contract Manufacturing) and Assembly & Integration (EMS) — are peer top-level tabs (Keller model); Industries is a shared concept with one page per vertical covering both capabilities; there is one unified RFQ. This matches how comparable two-capability manufacturers structure their sites and removes the "three half-built sites" read that undercut credibility with OEM buyers and spectating investors.

## Considered options

- **Keep three independent navs (status quo)** — rejected: no researched machining+assembly peer does this; it reads as stitched-together microsites and fragments SEO authority.
- **Single "What We Do" mega-menu** — rejected: gives less individual prominence to each capability; founder chose equal billing for both divisions.
- **Two capability tabs (Keller model)** — chosen: equal prominence per capability under one brand, reconciles the per-division sub-navs cleanly without microsites.

## Key decisions

- Global nav: `CNC Machining ▾ | Assembly & Integration ▾ | Industries ▾ | AI & Server Rack | Quality | About | Contact | [Request a Quote]`.
- Capability service pages keep their existing URLs (`/contract-manufacturing/*`, `/ems/*`) — deliberately NOT renaming `/ems/`→`/assembly/`, to avoid migration risk on a young site.
- Industries are shared: 10 verticals at `/industries/*`, with 301s from the existing `/ems/industries/*` pages. Industry pages are built additively (a CNC Machining section is added to the existing assembly pages rather than rewriting them).
- Industry taxonomy is granular (10): Aerospace & Defense, Automotive, Medical Devices, Industrial Equipment, Energy, Oil & Gas, Telecom, Electronics, AI & Server Rack, Appliances & White Goods. Telecom/Electronics/AI & Server Rack are disambiguated by the buyer's end market, not by component type (see CONTEXT.md).
- One unified RFQ at `/request-a-quote/` with a capability selector; 301 from `/ems/request-quote.html`.
- Engineering Support lives under the CNC Machining capability; Why Mexico is a shared `/why-mexico/` page linked contextually, not a nav item.
- `AI & Server Rack` keeps a featured top-level nav slot in addition to living in Industries (highest-growth angle / Celestica focus) — a deliberate exception to the otherwise-symmetric Industries treatment.

## Consequences

- A 301 redirect map is required for the moved industry pages and the RFQ; `sitemap.xml` and `robots.txt` must be updated; crawl before deprecating old paths. SEO risk is low now (young site, little accrued equity) — this is the cheap time to do it.
- The `noindex` "Coming Soon" Contract Manufacturing placeholder is replaced by a real, indexable CNC section. The dead `About` and `Contact` links (currently 404) must be built.
- This preserves the earlier intent to give "AI & Server Rack" standalone prominence (via the featured top-level slot), even though the page itself now lives under `/industries/`.
