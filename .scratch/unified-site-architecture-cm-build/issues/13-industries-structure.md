# 13 — Shared /industries/ structure (move 8 + 301)

Status: ready-for-agent
Parent: ../PRD.md

## What to build

Establish the shared `/industries/` structure per ADR-0001. Move the 8 existing assembly industry pages to `/industries/*` with 301 redirects, update the global-nav Industries dropdown to the 10-vertical taxonomy, and update internal links and sitemap. Structural only — no content rewrite in this slice (machining sections are issue 14; new verticals are issue 15). Apply label renames per the taxonomy (Aerospace → Aerospace & Defense; Telecom Hardware → Telecom; Energy stays Energy) without changing slugs unnecessarily.

## Acceptance criteria

- [ ] The 8 industry pages are served from `/industries/*` with working 301s from the old `/ems/industries/*` paths.
- [ ] The Industries dropdown lists all 10 verticals.
- [ ] Internal links and sitemap updated; no 404s introduced.
- [ ] Label renames applied (Aerospace & Defense, Telecom).

## Blocked by

- 02
