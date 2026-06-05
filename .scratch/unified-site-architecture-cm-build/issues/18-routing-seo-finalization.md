# 18 — Routing / SEO finalization + verification pass

Status: ready-for-agent
Parent: ../PRD.md

## What to build

Final routing/SEO pass and verification. Audit the complete 301 map (industry moves, RFQ move), update `sitemap.xml`, `robots.txt`, and schema across new/changed pages, then run an automated link + redirect crawl (zero 404s, every 301 resolves) and an accessibility pass building on the prior UI/UX audit findings (aria attributes, form labels, landmarks, skip-nav).

## Acceptance criteria

- [ ] Complete 301 map verified; every old path resolves to its new home.
- [ ] `sitemap.xml`, `robots.txt`, and schema updated for new/changed pages.
- [ ] Automated crawl: zero 404s, all internal links return 200.
- [ ] Accessibility checks pass (aria, labels, landmarks, skip-nav).

## Blocked by

- 05, 13
