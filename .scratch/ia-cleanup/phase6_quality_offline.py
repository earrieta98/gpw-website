#!/usr/bin/env python3
"""Phase 6 — take /quality/ offline for launch + swap nav Quality -> Insights (blog).
Per founder: remove Quality from the primary nav and footer, promote Blog ("Insights")
into the top nav in Quality's slot. The /quality/ file stays in the repo (work kept);
it is unlinked + dropped from sitemap + 404'd in .htaccess so it can ship dark and be
re-enabled later. NO body links to /quality/ exist (only nav + footer), verified.

Idempotent-ish, per-file backup, asserts totals, scans for leftover quality hrefs."""
import os, re, shutil, sys

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))  # 05-website
BACKUP = os.path.join(ROOT, ".scratch", "ia-cleanup", "phase6-backup-20260609")
SKIP_DIRS = {".scratch", "node_modules", "uploads"}
SELF = os.path.join(ROOT, "quality", "index.html")  # the page going offline — leave as-is

# nav: <a href="(PREFIX)quality/" class="nav__link nav__link--row">Quality</a>
NAV_RE = re.compile(r'(<a href=")([^"]*?)quality/(" class="nav__link nav__link--row">)Quality(</a>)')
# footer line: <a href="/quality/">Quality</a>  (remove the whole line)
FOOT_RE = re.compile(r'[ \t]*<a href="/quality/">Quality</a>\r?\n')
# any quality href (leftover detector)
ANY_Q = re.compile(r'href="[^"]*quality/(index\.html)?(#[^"]*)?"', re.I)

def live_html():
    out = []
    for d, dirs, files in os.walk(ROOT):
        dirs[:] = [x for x in dirs if x not in SKIP_DIRS]
        for f in files:
            if f.endswith(".html"):
                out.append(os.path.join(d, f))
    return out

nav_total = foot_total = files_changed = 0
leftovers = []

for fp in live_html():
    if os.path.abspath(fp) == os.path.abspath(SELF):
        continue
    src = open(fp, encoding="utf-8").read()
    new, n_nav = NAV_RE.subn(r'\g<1>\g<2>blog/\g<3>Insights\g<4>', src)
    new, n_foot = FOOT_RE.subn('', new)
    if new != src:
        rel = os.path.relpath(fp, ROOT)
        bdest = os.path.join(BACKUP, rel)
        os.makedirs(os.path.dirname(bdest), exist_ok=True)
        shutil.copy2(fp, bdest)
        open(fp, "w", encoding="utf-8", newline="").write(new)
        files_changed += 1
        nav_total += n_nav
        foot_total += n_foot
    # leftover scan (on the post-edit content)
    for m in ANY_Q.finditer(new):
        leftovers.append(f"{os.path.relpath(fp, ROOT)}: {m.group(0)}")

print(f"files changed:        {files_changed}")
print(f"nav Quality->Insights: {nav_total}")
print(f"footer Quality removed: {foot_total}")
print(f"\nleftover quality hrefs in live pages (excl. /quality/ self): {len(leftovers)}")
for l in leftovers:
    print("  ", l)

# sanity: nav swaps should land on every page that has the nav (35 content + 404)
if nav_total < 35:
    print(f"\nWARNING: expected >=35 nav swaps, got {nav_total}")
if leftovers:
    print("\nFAIL: unexpected leftover quality links — handle before verifying.")
    sys.exit(1)
print("\nOK: nav swapped, footer Quality removed, no stray /quality/ links remain.")
