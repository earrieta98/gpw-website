# 06 — CNC Machining hub + remove placeholder

Status: ready-for-agent
Parent: ../PRD.md

## What to build

Replace the `noindex` "Coming Soon" Contract Manufacturing placeholder with a real, indexable CNC Machining hub at `/contract-manufacturing/`. Coordinator-honest copy per ADR-0002 (managed Monterrey network; GPW owns DFM/QA/accountability; never claims owned machines or shop floor; network presented explicitly as a strength). Cover: what GPW manufactures, the 5 CNC services (cards), Engineering Support (free DFM), a Materials preview, the industries served, the nearshoring/USMCA value, and an RFQ CTA. Add Service/OfferCatalog/Breadcrumb schema.

## Acceptance criteria

- [ ] The placeholder is gone; `/contract-manufacturing/` serves a real, indexable hub (no `noindex`).
- [ ] Copy uses the managed-network framing; no owned-machine/shop-floor claims.
- [ ] Links to all 5 services, Engineering Support, Materials, industries, and the RFQ.
- [ ] Schema present; copy validated against the copywriting guide.

## Blocked by

- 01, 02, 05
