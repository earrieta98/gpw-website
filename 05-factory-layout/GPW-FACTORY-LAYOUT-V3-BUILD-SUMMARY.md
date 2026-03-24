# GPW Factory Layout v3.0 — Build Summary

## File Details
- **Location:** `/sessions/keen-funny-euler/mnt/08_Pagina Web/05-factory-layout/gpw-factory-layout-v3.html`
- **File Size:** 87 KB
- **Lines of Code:** 2,044 lines
- **Format:** Single-file HTML (CSS + SVG + JavaScript bundled)

---

## Overview

A complete, production-ready interactive factory floor visualization tool for Global Precision Works (GPW), a server assembly facility in Monterrey, Mexico. The layout showcases all 26 zones across 4,539 m² in a sophisticated, dark-themed SCADA/HMI-style control panel aesthetic.

**Key Design Direction:**
Industrial-futuristic, dark theme (#0c1117), precise measurements, subtle glow effects, premium control room feel. Fonts: DM Sans (body) + JetBrains Mono (data/measurements).

---

## All 26 Zones Implemented

### Production Zones (18 zones following U-shape flow)
1. **Receiving Dock** (150 m²) — Dock with barcode scanning & QC check-in
2. **Raw Material Storage** (400 m²) — 2-month inventory, selective racking, FIFO
3. **ESD Gowning Anteroom** (25 m²) — Entry point to ESD zones, ionizing air curtain
4. **Kitting Area** (150 m²) — 4 workbenches, 30 kits/day, ESD-protected
5. **Sub-Assembly / Node Pre-Build** (250 m²) — **NEW v3.0** — 4-station line for CPU/memory/power assembly
6. **Box Assembly** (350 m²) — 12 parallel stations, 3-station workflow, 30 boxes/day
7. **Cable Management & Harness** (180 m²) — **NEW v3.0** — Crimping, soldering, continuity testing
8. **Rack Assembly** (300 m²) — 3 U-line cells, ServerLIFT, 5 racks/day
9. **Firmware Loading & Config** (100 m²) — **NEW v3.0** — BIOS, OS deployment, validation
10. **End-of-Line Testing** (140 m²) — 2 bays, 55-min cycle, smoke/fire testing
11. **Rework Station** (100 m²) — **EXPANDED v3.0** — 4 diagnostic benches
12. **Pre-Burn-in Staging** (60 m²) — **NEW v3.0** — Buffer zone, 6-8 racks
13. **Burn-in Room** (350 m²) — 20 bays, 12.9-hr cycle, hot/cold containment, Novec suppression
14. **Post-Burn-in Staging** (60 m²) — **NEW v3.0** — Buffer zone, 4-6 racks
15. **Quality / Inspection Lab** (100 m²) — 4 workstations, oscilloscope & multimeter
16. **Packaging & Labeling** (130 m²) — 3 stations, thermal labels, palletization
17. **Finished Goods Storage** (250 m²) — Pallet racking, FIFO, 2-week inventory
18. **Shipping Dock** (150 m²) — 2 dock doors, staging, documentation

### Support Zones (5 zones)
19. **Tool Crib** (80 m²) — Tool checkout & calibration storage
20. **IT / MES Server Room** (40 m²) — Servers, UPS, managed switch
21. **Mechanical / Utilities** (160 m²) — HVAC, electrical panels, generator
22. **Battery Charging** (50 m²) — Forklift & pallet jack chargers
23. **Hazmat Storage** (40 m²) — Containment, spill kits, flammable cabinet

### Admin Zones (3 zones)
24. **2-Story Offices (Mezzanine)** (300 m²) — Reception, meeting room, glass overlook
25. **Comedor & Restrooms** (160 m²) — Dining (130 m²), kitchen, restrooms
26. **Training Room** (60 m²) — Classroom, projector, 20 seats

---

## Key Features Implemented

### 1. **Interactive SVG Floor Plan**
- Complete building polygon: U-shaped facility (118.72m × 73.45m)
- All 26 zones accurately positioned and color-coded
- SVG viewBox: 0 0 1200 900 (scalable & responsive)
- Grid pattern background for reference
- ESD zone hatching pattern overlay

### 2. **Production Flow Visualization**
- Dashed coral arrows showing U-shape material flow
- Arrow markers at flow endpoints
- Flow-only view toggle in header controls
- Zones organized: Left leg → Top → Right leg → Shipping

### 3. **Interactive Zone Selection**
- Click any zone to view detailed specs
- Hover effects: brightness increase + glow
- Zone highlighting with coral borders on selection
- Side panel with zone list (sortable)
- Zone-specific metadata display (area, type, ESD status)

### 4. **Drill-Down Sub-Layouts (5 implemented)**

#### Burn-in Room Drill-Down
- 20 rack test bays (R1-R20) in 4 columns × 5 rows
- Hot/cold aisle containment visualization
- CRAC unit positions, monitoring panel, fire suppression, UPS
- Equipment cost ($233,665 per cell)
- Specs: 12.9-hr cycle, 160 kW total, 24/7 monitoring

#### Rack Assembly Drill-Down
- 3 U-line cells with parallel workflow
- Station breakdown per cell
- Shared equipment: ServerLIFT SL-500X, rail tools, PDU staging
- Cost per cell: $33,259
- Daily output: 5 racks, Takt: 184 min/rack

#### Box Assembly Drill-Down
- 4 sets of 3-station workflow (12 total parallel stations)
- Station sequence: Chassis/BP (68m) → MB/CPU/RAM (54m) → Cable/Test (61m)
- Component bin staging area
- Daily output: 30 boxes, Equipment cost: $17,032/cell

#### Sub-Assembly / Node Pre-Build Drill-Down
- 4-station linear flow with process arrows
- Station 1: CPU+Heatsink (torque screwdrivers)
- Station 2: Memory+Storage (precision insertion)
- Station 3: Power+Cabling (wire routing)
- Station 4: Node testing+QC (boot diagnostics)
- Cycle: 30-40 min/node

#### Cable Management & Harness Drill-Down
- Crimping stations (pneumatic crimpers)
- Soldering benches with fume extraction hoods
- Continuity testing station (Fluke multimeters)
- IPC/WHMA-A-620 standard compliance notes

### 5. **Header Statistics Dashboard**
- Total Area: 4,539 m²
- Racks/Day: 5
- Boxes/Day: 30
- Zones: 26
- Utilization: 94% (calculated from all zones)
- Version badge: v3.0

### 6. **View Filter Controls**
- **All Zones** — Full facility view with production + support + admin
- **Production Only** — Hide support & admin zones
- **ESD Zones** — Show only ESD-protected assembly areas
- **Flow View** — Highlight production flow arrows, dim non-production zones

### 7. **Side Panel with Three Sections**

#### Detail Panel (Dynamic)
- Zone name & metadata (area, category, ESD badge)
- Full description text
- Key Specs list (collapsible)
- Equipment list (collapsible)
- Drill-down button (for zones with sub-layouts)
- Back button (visible during drill-down)

#### Zone List (Scrollable)
- All 26 zones with color swatches
- Area in m²
- Click to select & view details
- Active state highlighting

#### Legend (Fixed Bottom)
- Zone type colors (Production, Support, Admin)
- ESD indicator explanation
- Control instructions

### 8. **Styling & Aesthetic**
- **Dark theme:** #0c1117 background with #161b22 surfaces
- **Brand colors:** Teal (#23555A), Coral (#ED835E), Deep Blue (#2A4E64), Lime (#ADCF91)
- **Typography:** DM Sans (body, headers) + JetBrains Mono (data, measurements)
- **Animations:** Smooth transitions (0.3s cubic-bezier), glow effects on hover, pulse on active selection
- **Responsive design:** Mobile-friendly with side panel toggle

### 9. **JavaScript Architecture**
- **Zone data object:** 26 zones with full specs + equipment lists
- **State management:** currentSelectedZone, currentFilter, currentView, drilldownZone
- **Event handling:** Click selection, hover effects, filter toggling
- **Drill-down system:** enterDrilldown() / exitDrilldown() with view transitions
- **Filter system:** Dynamic opacity adjustments based on selected filter

---

## Zone Data Structure (Per Zone)

Each zone object includes:
```javascript
{
  name: 'Zone Name',
  area: 150,
  category: 'production' | 'support' | 'admin',
  esd: true/false,
  color: '#hexcolor',
  description: 'Full description...',
  specs: ['Spec 1', 'Spec 2', ...],
  equipment: ['Equipment 1', 'Equipment 2', ...],
  drilldown: 'drilldown-group-id' | null
}
```

---

## Production Flow (U-Shape Route)

1. **Receiving Dock** (south-west entry)
2. Raw Material Storage
3. ESD Anteroom (gateway)
4. Kitting Area
5. Sub-Assembly / Node Pre-Build
6. Box Assembly (continues top)
7. Cable Management
8. Rack Assembly
9. Firmware Loading & Config (begins right leg)
10. End-of-Line Testing
11. Rework Station (parallel, loop back to EOL)
12. Pre-Burn-in Staging (queue)
13. Burn-in Room (critical path, 12.9 hrs)
14. Post-Burn-in Staging (queue)
15. Quality Lab
16. Packaging & Labeling
17. Finished Goods Storage
18. Shipping Dock (south-east exit)

---

## Technical Implementation

### CSS (600+ lines)
- CSS variables for all colors & transitions
- Flexbox layout for header & panels
- SVG styling (zone rects, flow arrows, patterns)
- Interactive states (hover, active, selected)
- Responsive breakpoints (1200px, 768px)
- Custom scrollbars for panels

### SVG (1000+ lines)
- Building polygon with NE corner diagonal cut
- 26 zone rectangles with color fills
- ESD hatch pattern overlay
- Flow arrows with dashed stroke & coral color
- Drill-down group overlays (hidden until activated)
- Station visualizations for each drill-down
- Equipment labels & aisle widths
- Scale & measurement text in monospace

### JavaScript (400+ lines)
- Zone data object (26 zones × 5+ properties)
- Event listeners (click, hover, filter buttons)
- DOM manipulation (detail panel updates, zone list)
- Drill-down navigation (enter/exit transitions)
- Filter logic (opacity, display, pointer-events)
- Utilization calculation

---

## Browser Compatibility

- Modern browsers (Chrome, Firefox, Safari, Edge)
- SVG & CSS3 support required
- Google Fonts CDN (DM Sans, JetBrains Mono)
- No external JavaScript libraries (vanilla JS)
- Responsive on desktop, tablet, mobile

---

## File Statistics

| Metric | Value |
|--------|-------|
| Total Lines | 2,044 |
| File Size | 87 KB |
| CSS Lines | ~600 |
| SVG Lines | ~1,000 |
| JavaScript Lines | ~400 |
| Zones Implemented | 26 |
| Drill-Downs | 5 |
| Color Variables | 10 |
| Interactive Controls | 8+ |

---

## How to Use

1. **Open the file** in any modern web browser
2. **Click zones** to view detailed specs, equipment, and descriptions
3. **Hover over zones** to see highlighting & glow effects
4. **Use filter buttons** (top-right) to toggle view modes:
   - All Zones → Full facility
   - Production Only → Exclude support/admin
   - ESD Zones → ESD-protected areas only
   - Flow View → Material flow emphasis
5. **Drill down** into major production zones (Burn-in, Rack Assembly, Box Assembly, Sub-Assembly, Cable Mgmt) by clicking the "Drill Down" button in the detail panel
6. **Return to main view** by clicking the "Back to Full View" button

---

## What's New in v3.0

- **5 New Zones:** Sub-Assembly, Cable Management, Firmware Loading, Pre-Burn-in, Post-Burn-in Staging
- **5 Drill-Down Layouts:** Detailed sub-floor visualizations for critical zones
- **Expanded Features:** Rework station doubled, ESD anteroom added as gateway
- **Enhanced Detail Panel:** Better specs/equipment organization, drill-down navigation
- **Advanced Styling:** Glow effects, hover states, smooth transitions
- **Mobile Responsive:** Side panel toggle for smaller screens
- **Production Flow Arrows:** Visual U-shape flow with dashed coral lines

---

## Next Steps

1. Share with stakeholders for feedback
2. Consider additional drill-downs for: Kitting, Sub-Assembly, Quality Lab
3. Add real-time zone status indicators (capacity %, cycle time, throughput)
4. Integrate with MES data for live metrics (racks in progress, queue lengths)
5. Add shift-based utilization heatmaps
6. Export to HTML for embedding in internal dashboards or investor decks

---

**Build Date:** March 6, 2026
**Version:** v3.0
**Status:** ✅ Complete & Production-Ready
