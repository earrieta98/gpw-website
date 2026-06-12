import re, os, glob

base = "https://gpw-solutions.com/"
sm = open("sitemap.xml", encoding="utf-8").read()
locs = re.findall(r'<loc>(.*?)</loc>', sm)
print("SITEMAP URL COUNT:", len(locs))

def url_to_file(u):
    path = u[len(base):] if u.startswith(base) else u
    if path == "" or path.endswith("/"):
        return (path + "index.html").lstrip("/") if path else "index.html"
    return path

print("\n===== SITEMAP loc -> file existence =====")
missing=[]
for u in locs:
    f = url_to_file(u)
    exists = os.path.exists(f)
    if not exists:
        missing.append((u,f))
    print(f"  {'OK ' if exists else 'MISSING'}  {u}  -> {f}")
if missing:
    print("\n  !!! MISSING FILES:", missing)

# Build set of live html files (indexable)
live=set()
for f in glob.glob("**/*.html", recursive=True):
    fn=f.replace("\\","/")
    if any(fn.startswith(p) for p in (".git/","tests/","assets/","docs/",".scratch/")):
        continue
    live.add(fn)

# Map sitemap files
sm_files = set(url_to_file(u) for u in locs)

print("\n===== LIVE PAGES NOT IN SITEMAP =====")
# pages that should be considered for sitemap (exclude 404, quality intentionally, legal already included)
for f in sorted(live):
    if f not in sm_files:
        print(f"  {f}")

print("\n===== SITEMAP ENTRIES WITH NO LIVE FILE =====")
for f in sm_files:
    if f not in live:
        print(f"  {f}")

# Check /quality/ NOT in sitemap
print("\n===== /quality/ in sitemap? =====")
print("  ", any('quality' in u for u in locs))

# Check robots references sitemap and not blocking site
rb = open("robots.txt", encoding="utf-8").read()
print("\n===== robots.txt sitemap ref =====", "Sitemap:" in rb)
print("===== robots.txt blanket Disallow: / for User-agent: * ? =====")
print(re.search(r'User-agent:\s*\*\s*\nAllow:\s*/', rb) is not None)

# Cross-check sitemap against .htaccess redirects/404
ht = open(".htaccess", encoding="utf-8").read()
print("\n===== sitemap URLs that match a 301 source or are 404'd =====")
# quality 404
for u in locs:
    p = u[len(base):]
    if 'quality' in p:
        print("  quality in sitemap (should be excluded):", u)
