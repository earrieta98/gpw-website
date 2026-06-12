import os, re, json, glob, html

files = []
for f in glob.glob("**/*.html", recursive=True):
    fn = f.replace("\\","/")
    if any(fn.startswith(p) for p in (".git/", "tests/", "assets/", "docs/", ".scratch/")):
        continue
    files.append(fn)
files = sorted(files)

def get(pat, text, flags=re.I|re.S):
    m = re.search(pat, text, flags)
    return m.group(1).strip() if m else None

def getall(pat, text, flags=re.I|re.S):
    return re.findall(pat, text, flags)

rows = []
for f in files:
    with open(f, encoding="utf-8") as fh:
        t = fh.read()
    title = get(r'<title[^>]*>(.*?)</title>', t)
    desc = get(r'<meta[^>]+name=["\']description["\'][^>]+content=["\'](.*?)["\']', t)
    if not desc:
        desc = get(r'<meta[^>]+content=["\'](.*?)["\'][^>]+name=["\']description["\']', t)
    canon = get(r'<link[^>]+rel=["\']canonical["\'][^>]+href=["\'](.*?)["\']', t)
    ogt = get(r'<meta[^>]+property=["\']og:title["\'][^>]+content=["\'](.*?)["\']', t)
    ogd = get(r'<meta[^>]+property=["\']og:description["\'][^>]+content=["\'](.*?)["\']', t)
    ogu = get(r'<meta[^>]+property=["\']og:url["\'][^>]+content=["\'](.*?)["\']', t)
    ogi = get(r'<meta[^>]+property=["\']og:image["\'][^>]+content=["\'](.*?)["\']', t)
    ogtype = get(r'<meta[^>]+property=["\']og:type["\'][^>]+content=["\'](.*?)["\']', t)
    tw = get(r'<meta[^>]+name=["\']twitter:card["\'][^>]+content=["\'](.*?)["\']', t)
    lang = get(r'<html[^>]+lang=["\'](.*?)["\']', t)
    vp = bool(re.search(r'<meta[^>]+name=["\']viewport["\']', t, re.I))
    robots = get(r'<meta[^>]+name=["\']robots["\'][^>]+content=["\'](.*?)["\']', t)
    h1s = getall(r'<h1[^>]*>(.*?)</h1>', t)
    ldjson = getall(r'<script[^>]+type=["\']application/ld\+json["\'][^>]*>(.*?)</script>', t)
    h1clean = [re.sub(r'<[^>]+>','',h).strip()[:60] for h in h1s]
    rows.append(dict(file=f, title=title, desc=desc, canon=canon, ogt=ogt, ogd=ogd,
                     ogu=ogu, ogi=ogi, ogtype=ogtype, tw=tw, lang=lang, vp=vp,
                     robots=robots, h1count=len(h1s), h1s=h1clean, ldcount=len(ldjson)))

for r in rows:
    tl = len(html.unescape(r['title'])) if r['title'] else 0
    dl = len(html.unescape(r['desc'])) if r['desc'] else 0
    print(f"{r['file']}")
    print(f"  title({tl}): {r['title']}")
    print(f"  desc({dl}): {r['desc']}")
    print(f"  canon: {r['canon']}")
    print(f"  og:url: {r['ogu']}  og:type:{r['ogtype']} tw:{r['tw']}")
    print(f"  og:img: {r['ogi']}")
    print(f"  ogt: {r['ogt']}")
    print(f"  lang:{r['lang']} vp:{r['vp']} robots:{r['robots']} h1count:{r['h1count']} ld:{r['ldcount']} h1s:{r['h1s']}")
    print()

with open(".scratch/seo_rows.json","w",encoding="utf-8") as o:
    json.dump(rows,o)
print("TOTAL FILES:", len(rows))
