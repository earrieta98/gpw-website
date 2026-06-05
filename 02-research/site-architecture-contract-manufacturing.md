# Site Architecture — Contract Manufacturing Division

**Fecha:** 2026-04-05
**Status:** APROBADO por Enrique

## Page Hierarchy

```
/contract-manufacturing/                          ← Hub page
├── /contract-manufacturing/cnc-milling/           ← Service
├── /contract-manufacturing/cnc-turning/           ← Service
├── /contract-manufacturing/wire-edm/              ← Service
├── /contract-manufacturing/sheet-metal/           ← Service
├── /contract-manufacturing/surface-finishing/     ← Service
├── /contract-manufacturing/engineering-support/   ← Standalone (same level as Services)
├── /contract-manufacturing/metals/                ← Materials
├── /contract-manufacturing/plastics/              ← Materials
├── /contract-manufacturing/aerospace-defense/     ← Industry
├── /contract-manufacturing/automotive/            ← Industry
├── /contract-manufacturing/medical-devices/       ← Industry
├── /contract-manufacturing/industrial-equipment/  ← Industry
├── /contract-manufacturing/oil-gas-energy/        ← Industry
├── /contract-manufacturing/electronics-telecom/   ← Industry
├── /contract-manufacturing/why-mexico/            ← Resource
└── /contract-manufacturing/request-quote/         ← Conversion
```

Total: 18 pages (1 hub + 5 services + 1 engineering + 2 materials + 6 industries + 1 why mexico + 1 RFQ + 1 services hub implied in nav)

## Navigation

**CM Division Header (Level 2):**
```
[Logo]  Home CM  |  Services ▼  |  Engineering Support  |  Materials ▼  |  Industries ▼  |  Why Mexico?  |  [Request a Quote]
```

**File pattern:** folder/index.html for clean URLs

## Internal Linking Rules

- Every page links to: CM Hub, RFQ, Engineering Support
- Service pages link to: related materials, relevant industries
- Industry pages link to: relevant services, relevant materials
- Cross-division links between CM and EMS where same industry exists
