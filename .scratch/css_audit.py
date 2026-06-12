import os, re
ROOT = os.path.abspath(".")
css_dir = os.path.join(ROOT, "css")
broken = []
all_url = []
url_pat = re.compile(r'url\(\s*([^)]+?)\s*\)', re.I)
for f in sorted(os.listdir(css_dir)):
    if not f.endswith(".css"): continue
    p = os.path.join(css_dir, f)
    with open(p, encoding="utf-8", errors="replace") as fh:
        text = fh.read()
    for m in url_pat.finditer(text):
        raw = m.group(1).strip().strip('"').strip("'")
        ln = text.count("\n",0,m.start())+1
        low = raw.lower()
        if low.startswith("data:") or low.startswith("http://") or low.startswith("https://"):
            continue
        ref = raw.split("#")[0].split("?")[0]
        if not ref: continue
        disk = os.path.normpath(os.path.join(css_dir, ref))
        rel = os.path.relpath(disk, ROOT).replace("\\","/")
        exists = os.path.isfile(disk)
        all_url.append((f, ln, raw, rel, exists))
        if not exists:
            broken.append((f, ln, raw, rel))
print("=== CSS url() refs:", len(all_url))
for u in all_url:
    print(f"  css/{u[0]}:{u[1]} url({u[2]}) -> {u[3]} {'OK' if u[4] else 'MISSING'}")
print("\n=== BROKEN CSS url():", len(broken))
for b in broken:
    print(f"  css/{b[0]}:{b[1]} url({b[2]}) -> MISSING {b[3]}")

# Also scan inline <style> background url in HTML
print("\n=== Inline style url() in HTML pages referencing local assets ===")
for dirpath, dirs, files in os.walk(ROOT):
    dirs[:] = [d for d in dirs if d not in (".scratch","docs","tests",".git")]
    for fn in files:
        if not fn.endswith(".html"): continue
        p = os.path.join(dirpath, fn)
        rel = os.path.relpath(p, ROOT).replace("\\","/")
        with open(p, encoding="utf-8", errors="replace") as fh:
            text = fh.read()
        for m in url_pat.finditer(text):
            raw = m.group(1).strip().strip('"').strip("'")
            low = raw.lower()
            if low.startswith("data:") or low.startswith("http"): continue
            ref = raw.split("#")[0].split("?")[0]
            if not ref: continue
            ln = text.count("\n",0,m.start())+1
            disk = os.path.normpath(os.path.join(os.path.dirname(p), ref))
            ok = os.path.isfile(disk)
            reld = os.path.relpath(disk, ROOT).replace("\\","/")
            print(f"  {rel}:{ln} url({raw}) -> {reld} {'OK' if ok else 'MISSING'}")
