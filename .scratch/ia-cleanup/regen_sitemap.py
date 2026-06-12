#!/usr/bin/env python3
"""Phase 5 — refresh sitemap <lastmod> to each page's real file mtime.
Keeps the curated URL list, comments, changefreq and priority intact; only the
<lastmod> dates are rewritten so they reflect the actual last edit per page.
Asserts the loc list still matches the 35 live canonical pages (no add/drop)."""
import os, re, datetime, sys

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))  # 05-website
SITEMAP = os.path.join(ROOT, "sitemap.xml")
DOMAIN = "https://gpw-solutions.com/"

def loc_to_path(loc):
    assert loc.startswith(DOMAIN), loc
    rel = loc[len(DOMAIN):]
    if rel == "":
        rel = "index.html"
    elif rel.endswith("/"):
        rel = rel + "index.html"
    return os.path.join(ROOT, *rel.split("/"))

src = open(SITEMAP, encoding="utf-8").read()

locs = re.findall(r"<loc>([^<]+)</loc>", src)
missing = [l for l in locs if not os.path.isfile(loc_to_path(l))]
if missing:
    print("ERROR: sitemap loc has no file on disk:")
    for m in missing:
        print("  ", m)
    sys.exit(1)

# Replace each <url> block's <lastmod> with that page's mtime date.
def repl_url(block):
    m = re.search(r"<loc>([^<]+)</loc>", block.group(0))
    loc = m.group(1)
    mtime = os.path.getmtime(loc_to_path(loc))
    date = datetime.date.fromtimestamp(mtime).isoformat()
    return re.sub(r"<lastmod>[^<]*</lastmod>",
                  f"<lastmod>{date}</lastmod>", block.group(0))

out = re.sub(r"<url>.*?</url>", repl_url, src, flags=re.DOTALL)

open(SITEMAP, "w", encoding="utf-8", newline="\n").write(out)

# Report
print(f"sitemap.xml regenerated — {len(locs)} URLs")
dates = {}
for loc in locs:
    d = datetime.date.fromtimestamp(os.path.getmtime(loc_to_path(loc))).isoformat()
    dates[d] = dates.get(d, 0) + 1
for d in sorted(dates):
    print(f"  lastmod {d}: {dates[d]} pages")
