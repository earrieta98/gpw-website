# GPW Factory Layout Project — Context Document
## For session continuity — Read this file first when resuming work

**Project:** Server Assembly Factory Layout Design
**Company:** Global Precision Works (GPW)
**Location:** Nave San Javier G1, Monterrey, Mexico
**Building Dimensions:** 118.72m × 73.45m = 4,539 m² (with diagonal cut on NE corner)
**Last Updated:** March 2026

---

## 1. PROJECT HISTORY

### What exists:
- **Layout v1.0** (`gpw-factory-layout.html`) — Initial factory layout
- **Layout v2.0** (`gpw-factory-layout-v2.html`) — Optimized layout with U-shape flow, 20 zones, interactive SVG with side panel
- **Layout v2.0 PDF Report** (`GPW-Factory-Layout-Report-v2.pdf`)
- **Best Practices Research** (`04-research/server-assembly-best-practices-guide.md` — 2,474 lines, 100KB) — Exhaustive research on server rack assembly plant design

### What we need to build:
- **Layout v3.0** — Complete redesign incorporating best practices research findings, with interactive drill-down sub-layouts for each zone

---

## 2. LAYOUT v2.0 — CURRENT ZONES (21 zones, 4,211 m² allocated + 328 m² expansion)

| # | Zone | Area (m²) | Category | ESD |
|---|------|-----------|----------|-----|
| 1 | Receiving Dock | 150 | Production | No |
| 2 | Raw Material Storage | 450 | Production | No |
| 3 | Kitting Area | 120 | Production | Yes |
| 4 | Box Assembly | 350 | Production | Yes |
| 5 | Rack Assembly | 300 | Production | Yes |
| 6 | Smoke Test | 140 | Production | Yes |
| 7 | Rework Station | 50 | Support | Yes |
| 8 | Burn-in Room | 350 | Production | No |
| 9 | Quality / Inspection Lab | 100 | Support | No |
| 10 | Packaging & Labeling | 130 | Support | No |
| 11 | Finished Goods Storage | 350 | Production | No |
| 12 | Shipping Dock | 150 | Production | No |
| 13 | Mezzanine Offices | 300 | Admin | No |
| 14 | Comedor & Restrooms | 160 | Admin | No |
| 15 | Training Room | 60 | Admin | No |
| 16 | Tool Crib | 80 | Support | No |
| 17 | IT / MES Server Room | 40 | Support | No |
| 18 | Mechanical / Utilities | 160 | Support | No |
| 19 | Battery Charging | 50 | Support | No |
| 20 | Hazmat Storage | 40 | Support | No |
| 21 | Future Expansion | 328 | Admin | No |

**Production flow:** U-shape (Receiving south-west → up left leg → across top → down right leg → Shipping south-east)
**Daily capacity:** 5 racks/day, 30 boxes/day
**SVG viewBox:** 0 0 1200 900
**Building polygon:** points="30,30 1050,30 1170,150 1170,770 30,770"

---

## 3. ANALYSIS: v2.0 vs BEST PRACTICES — CHANGES FOR v3.0

### 3.1 ZONES TO ADD (5 new zones)

**A. Sub-Assembly / Node Pre-Build**
- Research recommends: 2,500–4,000 sq ft (232–372 m²)
- Purpose: Assemble individual server nodes (CPU, RAM, SSD, heatsink) BEFORE rack mounting
- Currently mixed into "Box Assembly" — should be separate
- Equipment: Assembly benches, torque screwdrivers, thermal paste dispensers, power testers
- ESD: Full EPA required
- 4-station line: CPU/Heatsink → Memory/Storage → Power/Cabling → Testing/QC

**B. Cable Management & Harness Assembly**
- Research recommends: 1,500–2,500 sq ft (139–232 m²)
- Purpose: Custom power/network harness assembly, crimping, soldering, cable testing
- Needs fume extraction for soldering
- ESD: Full EPA required
- Should be adjacent to rack assembly

**C. Firmware Loading & Configuration**
- Research recommends: 800–1,500 sq ft (74–139 m²)
- Purpose: BIOS config, OS/firmware deployment, validation testing
- Goes between rack assembly and burn-in
- Equipment: Workstations, 48-port managed switch, IPMI testers

**D. ESD Gowning / Entry Anteroom**
- Small area (~20–30 m²) at entrance to ESD production zones
- Adhesive mats, ionizers, wrist-strap checkers
- Best practice per ANSI/ESD S20.20

**E. Staging Areas (pre-burn-in and post-burn-in)**
- Buffer zones to prevent bottlenecks
- Pre-burn-in: Racks waiting for burn-in slot
- Post-burn-in: Racks waiting for QC final

### 3.2 ZONES TO RESIZE

| Zone | Current | Recommended | Change |
|------|---------|-------------|--------|
| Rework Station | 50 m² | 100 m² | +50 m² (needs diagnostic tools, spare parts, re-test area) |
| Kitting Area | 120 m² | 150 m² | +30 m² (tight at current size for growth) |
| Finished Goods | 350 m² | 250 m² | -100 m² (racks should ship fast, free space for production) |

### 3.3 ZONES TO RENAME
- "Smoke Test" → "End-of-Line Testing" (more accurate per industry terminology)

### 3.4 ZONES THAT ARE FINE AS-IS
- Receiving Dock (150 m²) ✅
- Raw Material Storage (450 m²) ✅
- Burn-in Room (350 m²) ✅ — adequate for Phase 1 (20-30 racks)
- Shipping Dock (150 m²) ✅
- Mechanical/Utilities (160 m²) ✅
- IT/MES Server Room (40 m²) ✅
- Tool Crib (80 m²) ✅
- Battery Charging (50 m²) ✅
- Hazmat Storage (40 m²) ✅

### 3.5 OFFICE DESIGN CHANGE
- User requested: **2-story offices (mezzanine)** to maximize floor space
- Ground floor (~150 m²): Reception, meeting room, bathrooms
- Upper floor (~150 m²): Administrative offices, engineering, IT
- Glass overlook to production floor (Gemba view)

---

## 4. v3.0 INTERACTIVE DRILL-DOWN FEATURE

### Concept:
**Level 1 — Full plant view:** All zones visible, clickable. Side panel shows zone info on hover/click.
**Level 2 — Zone detail view:** Click a zone → zooms into detailed internal layout showing:
- Equipment placement (benches, racks, tools)
- Internal workflow arrows
- Station numbering
- Aisle widths
- Key specs (temperature, ESD, lighting)

### Zones that need detailed sub-layouts:

**Production zones:**
1. Receiving Dock — dock doors, staging area, QC check-in station
2. Raw Material Storage — pallet rack layout, aisle widths, bin organization
3. Kitting Area — kitting stations, BOM carts, Kanban bins
4. Sub-Assembly (NEW) — 4-station line, component bins, test station
5. Box Assembly — 12 parallel stations, 3-station workflow
6. Cable Management (NEW) — crimping stations, soldering with fume extraction, cable testing
7. Rack Assembly — U-line stations, rail tools, PDU staging
8. Firmware Loading (NEW) — workstations, network switch, IPMI setup
9. End-of-Line Testing (renamed) — test cells, power supply, monitoring
10. Rework Station — diagnostic bench, spare parts, re-test
11. Burn-in Room — hot/cold aisles, CRAC units, PDUs, monitoring panel, fire suppression
12. Staging Areas (NEW) — pre-burn-in queue, post-burn-in queue
13. Quality Lab — inspection bench, microscope, test equipment
14. Packaging & Labeling — packing stations, labeling, palletization
15. Finished Goods Storage — pallet racks, FIFO lanes
16. Shipping Dock — dock doors, staging, documentation station

**Support zones:**
17. ESD Anteroom (NEW) — gowning, wrist-strap check, adhesive mats
18. Tool Crib — tool checkout, calibration storage
19. IT/MES Server Room — server racks, UPS, network
20. Mechanical/Utilities — UPS, HVAC, generator, electrical panels

**Admin zones:**
21. Offices (2-story) — Ground: reception, meeting room, bathrooms. Upper: offices, engineering
22. Comedor & Restrooms — dining tables, kitchen, restrooms
23. Training Room — classroom setup, projector
24. Battery Charging — forklift chargers
25. Hazmat Storage — containment, ventilation, spill kits

---

## 5. TECHNICAL APPROACH FOR v3.0 BUILD

### Problem: File too large for single generation
The HTML file with 25+ zones, drill-down sub-layouts, CSS, SVG, and JavaScript exceeds Claude's 32,000 token output limit.

### Solution: Build incrementally in 7 steps

**Step 1** — Base file: HTML structure, CSS styles, header (no zones)
**Step 2** — SVG: Production zones left leg (Receiving → Kitting → Sub-Assembly → Box Assembly)
**Step 3** — SVG: Production zones top & right (Rack Assembly → Cable Mgmt → Firmware → EOL Testing → Rework → Burn-in → Staging)
**Step 4** — SVG: Support & Admin zones (Quality Lab → Packaging → Finished Goods → Shipping → Offices → Comedor → Mechanical → etc)
**Step 5** — JavaScript: Zone data objects, interactivity, side panel, click handlers
**Step 6** — JavaScript: Drill-down sub-layouts (detailed internal views per zone)
**Step 7** — Verification: Open in browser, visual check, fix issues

Each step uses `Edit` to append/modify the existing file, never regenerating the whole thing.

---

## 6. RESEARCH FILES REFERENCE

All research is in `04-research/`:

| File | Size | Content |
|------|------|---------|
| `server-assembly-best-practices-guide.md` | 100KB, 2,474 lines | **MASTER DOCUMENT** — 13 sections + 5 appendices |
| `server-assembly-best-practices-guide.docx` | 66KB | Branded DOCX version |
| `server-rack-assembly-plant-layout-research.md` | 73KB | Plant zones, layout principles, material flow |
| `server-odm-manufacturing-facilities-research.md` | 29KB | ODM benchmarks (Supermicro, Wistron, QCT, Foxconn, Celestica, Inventec, Flex, ZT Systems) |
| `server-assembly-zone-implementation-checklist.md` | 69KB | Implementation checklist per zone |
| `server-assembly-plant-quick-reference.md` | 10KB | Quick reference card |
| `README-server-assembly-research.md` | 13KB | Research overview and index |

### Key specs from research:

**Burn-in Room (most critical zone):**
- ASHRAE TC 9.9: 18-27°C standard, 18-22°C for AI servers
- Hot/Cold Aisle Containment (CAC recommended for Phase 1)
- Novec 1230 fire suppression (GWP=1)
- 250 kVA UPS + generator backup
- 6 temperature sensors per rack (top/mid/bottom × front/back)
- 48-72 hour burn-in cycles
- Phase 1: 20-30 rack positions, 2,500-3,500 sq ft

**Sub-Assembly (new zone):**
- 4-station line: CPU/Heatsink → Memory/Storage → Power/Cabling → Testing
- 30-40 min per node total
- Overhead torque screwdriver rails
- Full ESD EPA

**Cable Management (new zone):**
- Crimping + soldering + testing stations
- Fume extraction mandatory
- IPC/WHMA-A-620 standard
- Adjacent to rack assembly

**Production capacity targets:**
- Phase 1 (Year 1): 50-100 racks/month, 25-45 technicians
- Phase 2 (Years 2-3): 200-300 racks/month, 250-350 personnel
- Phase 3 (Years 4-5): 400-600 racks/month, 500-700 personnel

---

## 7. BUILDING & BRAND SPECS

**Building:** Nave San Javier G1
- Total area: 4,539 m² (118.72m × 73.45m)
- Diagonal cut on NE corner
- Same-wall docks (south wall) — enables U-shape flow
- Column grid visible in layout

**Brand colors (for HTML styling):**
- Teal: #23555A (primary)
- Coral: #ED835E (CTA/accent)
- Deep Blue: #2A4E64 (secondary)
- Lime: #ADCF91 (highlights)

**Fonts:**
- Trirong (serif) — headlines
- Lato (sans-serif) — body
- For layout HTML, v2.0 used: DM Sans + JetBrains Mono (acceptable alternative)

---

## 8. NEXT STEPS (when resuming)

1. Read this file first
2. Read `04-research/server-assembly-best-practices-guide.md` for detailed specs
3. Review `gpw-factory-layout-v2.html` for current SVG coordinates and structure
4. Build v3.0 following the 7-step incremental approach in Section 5
5. Save final file as `05-factory-layout/gpw-factory-layout-v3.html`

---

*This document was created to maintain project continuity across sessions. Update it after significant progress.*
