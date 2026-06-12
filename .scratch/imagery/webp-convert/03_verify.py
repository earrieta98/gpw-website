# -*- coding: utf-8 -*-
"""Verify: no stray non-og .jpg refs, every image ref resolves to a real file."""
import os, re

ROOT = r"c:\Users\earri\OneDrive\Desktop\GLOBAL PRECISION WORKS\08_Pagina Web\05-website"
EXTS = (".html", ".htm", ".css", ".php", ".js", ".xml", ".json", ".webmanifest")
tok = re.compile(r'[\w./\-]+\.(?:jpe?g|webp)', re.I)

def skip(p):
    p = p.replace("\\", "/").lower()
    return "/.scratch/" in p or "/node_modules/" in p

stats = {"webp": 0, "jpg_og": 0, "jpg_nonog": 0}
missing, nonog, unresolved = [], [], []
for dp, _d, files in os.walk(ROOT):
    for f in files:
        if not f.lower().endswith(EXTS):
            continue
        full = os.path.join(dp, f)
        if skip(full):
            continue
        rel = os.path.relpath(full, ROOT).replace("\\", "/")
        txt = open(full, encoding="utf-8", newline="").read()
        for m in set(tok.findall(txt)):
            low = m.lower()
            is_webp = low.endswith(".webp")
            is_og = "img/og/" in low
            stats["webp" if is_webp else ("jpg_og" if is_og else "jpg_nonog")] += 1
            idx = low.find("img/")
            if idx == -1:
                unresolved.append((rel, m)); continue
            disk = os.path.join(ROOT, m[idx:].replace("/", os.sep))
            if not os.path.exists(disk):
                missing.append((rel, m))
            if (not is_webp) and (not is_og):
                nonog.append((rel, m))

print("Distinct refs -> webp: %(webp)d   og-jpg: %(jpg_og)d   nonog-jpg: %(jpg_nonog)d" % stats)
print("\n[A] Stray non-og .jpg refs (should be 0): %d" % len(nonog))
for rel, m in nonog: print("    ", rel, "->", m)
print("\n[B] References pointing to MISSING files (should be 0): %d" % len(missing))
for rel, m in missing: print("    ", rel, "->", m)
print("\n[C] Image refs that couldn't be resolved to img/ (review): %d" % len(unresolved))
for rel, m in unresolved: print("    ", rel, "->", m)

# Disk sanity: any served .jpg left outside /img/og/ ?
left = []
for dp, _d, files in os.walk(ROOT):
    for f in files:
        if f.lower().endswith((".jpg", ".jpeg")):
            full = os.path.join(dp, f)
            p = full.replace("\\", "/").lower()
            if "/.scratch/" in p or "/img/og/" in p or "/node_modules/" in p:
                continue
            left.append(os.path.relpath(full, ROOT).replace("\\", "/"))
print("\n[D] Served .jpg files still outside /img/og/ (should be 0): %d" % len(left))
for x in left: print("    ", x)
