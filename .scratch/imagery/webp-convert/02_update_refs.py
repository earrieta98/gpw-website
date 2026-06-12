# -*- coding: utf-8 -*-
"""Rewrite references to converted JPGs -> WebP across code files. OG untouched."""
import os, json

ROOT = r"c:\Users\earri\OneDrive\Desktop\GLOBAL PRECISION WORKS\08_Pagina Web\05-website"
MDIR = os.path.join(ROOT, ".scratch", "imagery", "webp-convert")
EXTS = (".html", ".htm", ".css", ".php", ".js", ".xml", ".json", ".webmanifest")

with open(os.path.join(MDIR, "manifest.json"), encoding="utf-8") as fh:
    manifest = json.load(fh)
# (jpg_suffix, webp_suffix) -- forward slash, full path relative to ROOT
pairs = [(m["jpg"], m["webp"]) for m in manifest]

def skip(path):
    p = path.replace("\\", "/").lower()
    return ("/.scratch/" in p) or ("/node_modules/" in p)

code_files = []
for dp, _dirs, files in os.walk(ROOT):
    for f in files:
        if f.lower().endswith(EXTS):
            full = os.path.join(dp, f)
            if not skip(full):
                code_files.append(full)

total_repl = 0
per_pair = {jpg: 0 for jpg, _ in pairs}
changed_files = []
for full in code_files:
    with open(full, encoding="utf-8", newline="") as fh:
        txt = fh.read()
    orig = txt
    cnt = 0
    for jpg, webp in pairs:
        if jpg in txt:
            n = txt.count(jpg)
            txt = txt.replace(jpg, webp)
            cnt += n
            per_pair[jpg] += n
    if txt != orig:
        with open(full, "w", encoding="utf-8", newline="") as fh:
            fh.write(txt)
        changed_files.append((os.path.relpath(full, ROOT).replace("\\", "/"), cnt))
        total_repl += cnt

print("Total references rewritten: %d  across %d files" % (total_repl, len(changed_files)))
print("\nChanged files:")
for rel, cnt in sorted(changed_files, key=lambda x: -x[1]):
    print("  %3d  %s" % (cnt, rel))

orphans = [jpg for jpg, n in per_pair.items() if n == 0]
print("\nConverted images with ZERO code references (orphans, harmless): %d" % len(orphans))
for o in orphans:
    print("   orphan:", o)
