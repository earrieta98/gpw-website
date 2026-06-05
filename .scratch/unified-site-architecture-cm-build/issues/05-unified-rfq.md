# 05 — Unified RFQ (form + handler routing + 301)

Status: ready-for-agent
Parent: ../PRD.md

## What to build

One unified Request-a-Quote at `/request-a-quote/` replacing the assembly-only form (the deep, testable module). A capability selector (CNC Machining / Assembly & Integration / Both / Not sure) reveals the relevant fields — CNC: process type, material, tolerance, quantity, CAD upload, free-DFM checkbox; Assembly: services, volume, timeline — plus shared identity fields. Extend the existing RFQ handler to route each lead to the sales team tagged by capability, validate fields and file uploads (already CAD-capable), and gate on reCAPTCHA v3. 301 the old assembly RFQ URL to the new one.

## Acceptance criteria

- [ ] `/request-a-quote/` serves one form with a working capability selector that shows/hides the relevant fields.
- [ ] Submissions route to sales tagged by capability (CNC / Assembly / Both).
- [ ] CAD file uploads validated (allowed extensions + size); disallowed/oversized rejected.
- [ ] reCAPTCHA gating: missing/low-score rejected, valid accepted.
- [ ] 301 from the old assembly RFQ URL resolves.
- [ ] Logic tests cover capability routing, field/upload validation, and reCAPTCHA gating.

## Blocked by

- 01, 02
