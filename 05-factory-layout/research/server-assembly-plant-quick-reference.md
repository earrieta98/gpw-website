# Server Rack Assembly Plant — Quick Reference Guide
## Global Precision Works (GPW) — Monterrey, Mexico

**For:** Facility Planning & Operations Leadership
**Date:** March 2026

---

## At-a-Glance Facility Requirements

### Total Facility Footprint: 15,000–25,000 sq ft

| Zone | Size (sq ft) | Purpose | Key Equipment |
|------|-------|---------|---|
| **Receiving & Inspection** | 1,200–1,800 | Component intake & QA | 2–3 dock bays, inspection workstations |
| **Storage & Kitting** | 2,000–3,500 | Material preparation & kits | Shelving, bins, kitting stations (2–4) |
| **Sub-Assembly** | 1,500–2,500 | Cable harness & pre-assembly | Crimpers, soldering stations, test equipment |
| **Main Assembly** | 2,500–4,500 | U-shaped rack assembly line | 8–15 workstations, tools, fixtures |
| **Burn-In / Test** | 2,000–3,500 | 48–72 hr stress testing | In-row coolers, PDUs, monitoring, Novec 1230 |
| **Final Inspection** | 1,000–1,500 | Post-burn-in QA | Inspection benches, test equipment |
| **Packaging & Shipping** | 2,200–2,300 | Crating & staging | Packing stations, dock (2–3 bays) |
| **Support / Admin / Circulation** | 2,000–3,500 | Offices, restrooms, aisles | Standard office + circulation space |

---

## Temperature & Humidity Control (Critical)

| Area | Temperature | Humidity | Priority |
|------|---|---|---|
| **Assembly / Sub-Assembly** | 18–27°C (64–81°F) | 40–60% RH | High |
| **Burn-In: Cold Aisle (inlet)** | 18–22°C (64–71°F) | 40–60% RH | **Critical** ±1°C |
| **Burn-In: Hot Aisle (outlet)** | 27–32°C (81–90°F) | 40–60% RH | **Critical** ±1°C |
| **Receiving / Packaging** | 15–27°C (59–81°F) | 30–70% RH | Low |

**Monterrey Humidity Note:** Implement dehumidification (especially May–October rainy season)

---

## Power Requirements (5–20 Racks/Day)

| Area | Load | Notes |
|------|------|-------|
| **Assembly** | 20–30 kW | Tools, lighting, equipment |
| **Burn-In (simultaneous 4–6 racks)** | 60–120 kW | Servers + cooling |
| **HVAC (cooling + ventilation)** | 50–100 kW | Largest consumer in burn-in mode |
| **Lighting & Office** | 20–35 kW | General facility |
| **TOTAL FACILITY** | 200–330 kW | Average continuous |
| **PEAK DEMAND** | 400–450 kW | During simultaneous burn-in |

**Infrastructure:**
- Main service: 480V three-phase, 500–600 amp
- Burn-in feeds: 3 × 480V dedicated (200 amp each minimum)
- UPS: 20–40 kW (15–30 min backup)
- Generator: 250–350 kW (optional, recommended for 24-hr ops)

---

## HVAC & Cooling Capacity

| System | Capacity | Notes |
|--------|----------|-------|
| **Chiller** | 150–250 TR | Glycol/water or DX refrigerant |
| **In-row Coolers** | 3–5 units × 15–30 kW each | Direct rack cooling |
| **Air Changes** | 6–12 ACH | Assembly 6–8; Burn-in 8–12 |
| **Filtration** | MERV-11 min | MERV-8 acceptable for support areas |

**Monterrey-specific:** Design for humid climate; include dehumidification; N+1 redundancy for 24-hour ops.

---

## ESD Compliance (ANSI/ESD S20.20)

### Flooring by Zone
| Zone | Requirement | Resistance |
|------|---|---|
| **Receiving** | Not required | N/A (sealed packaging) |
| **Kitting** | Recommended | 10⁶–10⁹ Ω (dissipative) |
| **Sub-Assembly** | Required | 10⁶–10⁹ Ω |
| **Main Assembly** | Required | 10⁶–10⁹ Ω |
| **Burn-In Chamber** | Not required | N/A (sealed servers) |
| **Final Inspection** | Recommended | 10⁶–10⁹ Ω (if opening racks) |

### Personnel Requirements
- **Training:** 100% of assembly staff must be ESD certified (annual refresh)
- **Workstations:** All must have grounding straps, anti-static mats, wrist strap verification
- **Compliance:** Quarterly flooring resistance testing per ANSI/ESD 7.1
- **Audit:** Semi-annual ESD program audit recommended

---

## Burn-In Testing Profile (48–72 Hours)

1. **Baseline (4 hrs):** Power on, firmware boot, self-tests
2. **Thermal Ramp-Up (2–4 hrs):** Load 50% → 75% → 100%
3. **Full-Load Stress (40–60 hrs):** 90–100% CPU/memory/I/O (Linpack, MemTest, fio, iperf)
4. **Idle Cycles (4–8 hrs):** Reduce load, test thermal response
5. **Shutdown (1–2 hrs):** Graceful shutdown, monitor for errors

**Fire Suppression:** Novec 1230 clean agent system (NFPA 2001, ISO 14520)
- Discharge: <10 seconds
- Concentration: 4–5%
- Room integrity: ≥95% for ≥10 min post-discharge

---

## Material Flow (Recommended: U-Shaped Assembly Line)

```
Receiving → Kitting → Sub-Assembly →
           ↓
       MAIN ASSEMBLY (U-LINE)
       Frame → Components → Power/Network → Cabling → Firmware → Test → Staging
           ↓
       BURN-IN TEST (48–72 hrs)
           ↓
       FINAL INSPECTION
           ↓
       PACKAGING
           ↓
       SHIPPING DOCK → Customer
```

**Key Advantages of U-Shape:**
- Minimizes walking distance
- Single supervisor can oversee entire line
- Easy flow without backtracking
- Flexible station count (8–15 workstations)
- Lean one-piece (one-rack) flow

---

## Staffing (Single 8-Hour Shift)

| Department | Qty | Role |
|---|---|---|
| **Receiving & Kitting** | 5–6 | Intake, inspection, material prep |
| **Assembly & Sub-Assembly** | 11–15 | Component assembly, integration |
| **Burn-In & Monitoring** | 2–3 | Test setup, data logging, monitoring |
| **Final QA & Inspection** | 2–3 | Post-burn-in verification, rework |
| **Packaging & Shipping** | 2–3 | Crating, labeling, staging |
| **Supervision & Leadership** | 2–3 | Line lead, quality oversight |
| **TOTAL** | 38–40 FTE | *Single shift* |

**24-Hour Operations:** Multiply by 2.5–3 (with overlap) = 90–120 FTE total

---

## Loading Dock Specifications

| Item | Specification |
|------|---|
| **Dock Height** | 48–52" (48" standard LTL) |
| **Door Width** | 14 ft per opening (accommodate 8–10 ft trucks) |
| **Door Height** | 10 ft minimum |
| **Door Spacing (centerline)** | 18–20 ft |
| **Number of Bays** | 2–3 for 5–20 racks/day |
| **Dock Levelers** | 2–3 (one per bay) |

---

## Server Rack Crate Specifications

| Item | Specification |
|------|---|
| **Rack Size (std 42U)** | 48"W × 42"D × 82"H |
| **Crate w/ Padding** | 54"W × 48"D × 88"H |
| **Plywood** | 3/4" exterior (3-sided or full enclosure) |
| **Foam** | 2–4" high-density polypropylene |
| **Pallet Base** | Reinforced, rated for 300–800 lbs |
| **Strapping** | Heavy-duty (2–3 straps minimum) |
| **Unloading Time** | Tool-free design: ~1 min per crate (vs 4 min standard) |

---

## Key Adjacencies (Must Be Close)

| Connection | Max Distance | Reason |
|---|---|---|
| **Receiving → Kitting** | <50 ft | Material flow |
| **Kitting → Assembly** | <100 ft | Frequent material handoff |
| **Assembly → Burn-In** | <150 ft | Rework feedback loop |
| **Burn-In → Final Inspection** | <50 ft | Tested unit transition |
| **Inspection → Packaging** | <100 ft | Approved units to packing |
| **Packaging → Dock** | <100 ft | Staged crates to loading |

---

## Power Density Summary

| Zone | W/sq ft | Notes |
|---|---|---|
| **Assembly Floor** | 50–75 | Tools, lighting, comfort |
| **Burn-In Area** | 100–150 | Very high (servers + cooling) |
| **Facility Average** | 13–18 | (200–330 kW ÷ 15,000–25,000 sq ft) |

---

## Pre-Opening Checklist (Critical Items)

- [ ] HVAC system commissioned and tested (temperature/humidity stability)
- [ ] Electrical service verified (480V feed, UPS, generator if applicable)
- [ ] ESD flooring installed and tested (resistance compliance, ANSI/ESD 7.1)
- [ ] Grounding system bonded and verified (<1 Ω to facility ground)
- [ ] Fire suppression system (Novec 1230) installed and pressure-tested
- [ ] Burn-in monitoring system operational (temperature sensors, data logging)
- [ ] All personnel ESD certified and trained
- [ ] Assembly fixtures and tooling in place and verified
- [ ] Receiving dock operational (levelers, scales, documentation system)
- [ ] Quality control test equipment calibrated
- [ ] Safety systems active (emergency stops, alarms, signage)

---

## Implementation Phases (Months 1–12)

| Phase | Timeline | Focus | Target Output |
|---|---|---|---|
| **Phase 1: Core Assembly** | Mo 1–3 | Receiving, kitting, assembly line | 2–5 racks/day |
| **Phase 2: Test & Validation** | Mo 3–6 | Burn-in facility, test protocols | 5–10 racks/day |
| **Phase 3: Packaging & Logistics** | Mo 6–9 | Shipping dock, crating, inventory | 10–15 racks/day |
| **Phase 4: Scaling & Optimization** | Mo 9–12 | Scale to full capacity, workflows | 20 racks/day sustainable |

---

## Regulatory & Standards Compliance

- **ANSI/ESD S20.20-2021:** ESD control program
- **ASHRAE TC9.9:** Temperature/humidity for data centers
- **NFPA 2001:** Clean agent fire suppression
- **ISO 14520:** Gaseous fire-extinguishing systems
- **NEC:** Electrical installation (US/North American equivalent)
- **OSHA:** Worker safety & occupational health
- **IPC-A-620:** Cable & wire harness workmanship
- **TIA-942:** Data center infrastructure

---

## Success Metrics (First Year)

| Metric | Target | Critical? |
|---|---|---|
| **Throughput** | 20 racks/day by month 12 | Yes |
| **First-Pass Yield (assembly)** | >98% | Yes |
| **Burn-In Pass Rate** | >99% | Yes |
| **ESD Incidents** | Zero | Yes |
| **Schedule Compliance** | >95% on-time delivery | Yes |
| **Safety Incidents** | Zero lost-time accidents | Yes |
| **Customer Satisfaction** | >4.5/5 stars | Yes |

---

## Contact & Resources

**For detailed specifications, see full research document:**
`/mnt/08_Pagina Web/04-research/server-rack-assembly-plant-layout-research.md`

**Additional References:**
- ASHRAE Equipment Thermal Guidelines (DataCom)
- ANSI/ESD S20.20-2021 Standard (Full Document)
- NFPA 2001 Standard (Clean Agent Systems)
- Monterrey Climate Data (for HVAC sizing)

---

**Document Version:** 1.0
**Prepared:** March 2026
**For:** Global Precision Works (GPW) Operations Planning

