# -*- coding: utf-8 -*-
"""Convert served JPGs (excluding /img/og/) to WebP, move originals to backup."""
import os, json, shutil
from PIL import Image, ImageOps

ROOT   = r"c:\Users\earri\OneDrive\Desktop\GLOBAL PRECISION WORKS\08_Pagina Web\05-website"
BACKUP = os.path.join(ROOT, ".scratch", "imagery", "jpg-originals-pre-webp-20260611")
MDIR   = os.path.join(ROOT, ".scratch", "imagery", "webp-convert")
QUALITY, METHOD = 82, 6

def skip(path):
    p = path.replace("\\", "/").lower()
    return ("/.scratch/" in p) or ("/img/og/" in p) or ("/node_modules/" in p)

# Collect first (don't mutate the tree mid-walk)
targets = []
for dp, _dirs, files in os.walk(ROOT):
    for f in files:
        if f.lower().endswith((".jpg", ".jpeg")):
            full = os.path.join(dp, f)
            if not skip(full):
                targets.append(full)

manifest, errors = [], []
total_old = total_new = 0
for full in targets:
    try:
        old = os.path.getsize(full)
        im = Image.open(full)
        im = ImageOps.exif_transpose(im)
        if im.mode != "RGB":
            im = im.convert("RGB")
        webp = os.path.splitext(full)[0] + ".webp"
        im.save(webp, "WEBP", quality=QUALITY, method=METHOD)
        im.close()
        new = os.path.getsize(webp)
        rel = os.path.relpath(full, ROOT)
        dest = os.path.join(BACKUP, rel)
        os.makedirs(os.path.dirname(dest), exist_ok=True)
        shutil.move(full, dest)
        relweb = rel.replace("\\", "/")
        manifest.append({"jpg": relweb,
                         "webp": os.path.splitext(relweb)[0] + ".webp",
                         "old": old, "new": new,
                         "pct": round(100 * (old - new) / old) if old else 0})
        total_old += old; total_new += new
    except Exception as e:
        errors.append((full, str(e)))

os.makedirs(MDIR, exist_ok=True)
with open(os.path.join(MDIR, "manifest.json"), "w", encoding="utf-8") as fh:
    json.dump(manifest, fh, indent=2)

print("Converted %d files (%d errors)" % (len(manifest), len(errors)))
print("Old: %.2f MB   New: %.2f MB   Saved: %.2f MB  (%d%%)" % (
    total_old/1048576, total_new/1048576,
    (total_old-total_new)/1048576,
    round(100*(total_old-total_new)/total_old) if total_old else 0))
# Biggest savers + any that GREW (webp larger than jpg)
grew = [m for m in manifest if m["new"] >= m["old"]]
print("Files where WebP >= JPG (kept anyway): %d" % len(grew))
for m in grew:
    print("   GREW  %5d -> %5d KB  %s" % (m["old"]//1024, m["new"]//1024, m["jpg"]))
if errors:
    print("ERRORS:")
    for path, msg in errors:
        print("  ", path, "->", msg)
