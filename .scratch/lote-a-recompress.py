#!/usr/bin/env python3
# Lote A image recompression helper. Writes to working-tree img/ files.
# - TASK 1: PNG hero -> JPG (new file)
# - TASK 2: recompress referenced JPGs in place, only if meaningfully smaller.
import os, sys
from PIL import Image

ROOT = r"c:/Users/earri/OneDrive/Desktop/GLOBAL PRECISION WORKS/08_Pagina Web/05-website"
QUALITY = 82

def kb(n):
    return f"{n/1024:.1f} KB"

def save_jpg(im, dst):
    im = im.convert("RGB")
    # progressive + optimized, no chroma upscaling, keep dimensions
    im.save(dst, "JPEG", quality=QUALITY, optimize=True, progressive=True)

results = []

# ---------- TASK 1: PNG -> JPG ----------
src_png = os.path.join(ROOT, "img/tech/cnc-milling-5axis.png")
dst_jpg = os.path.join(ROOT, "img/tech/cnc-milling-5axis.jpg")
before = os.path.getsize(src_png)
with Image.open(src_png) as im:
    dims = im.size
    save_jpg(im, dst_jpg)
after = os.path.getsize(dst_jpg)
results.append(("cnc-milling-5axis.png -> .jpg", before, after, dims, True, "task1"))
print(f"TASK1 {dims} {kb(before)} (png) -> {kb(after)} (jpg) :: {dst_jpg}")

# ---------- TASK 2: recompress JPGs in place ----------
jpgs = [
    "img/tech/hero-about.jpg",
    "img/tech/cnc-sheet-metal-laser.jpg",
    "img/tech/cnc-engineering-dfm.jpg",
    "img/hero/assembly-closeup.jpg",
    "img/tech/cnc-plastics.jpg",
    "img/tech/cnc-hub-inspection.jpg",
    "img/tech/cnc-turning-parts.jpg",
]
SHRINK_THRESHOLD = 0.97  # require result <= 97% of original to count as "meaningfully smaller"
for rel in jpgs:
    path = os.path.join(ROOT, rel)
    before = os.path.getsize(path)
    with Image.open(path) as im:
        dims = im.size
        tmp = path + ".tmp.jpg"
        save_jpg(im, tmp)
    cand = os.path.getsize(tmp)
    if cand < before * SHRINK_THRESHOLD:
        os.replace(tmp, path)
        after = os.path.getsize(path)
        changed = True
    else:
        os.remove(tmp)
        after = before
        changed = False
    results.append((rel, before, after, dims, changed, "task2"))
    print(f"TASK2 {rel} {dims} {kb(before)} -> {kb(after)} {'CHANGED' if changed else 'KEPT-ORIGINAL'}")

# sanity: confirm none grew
grew = [r for r in results if r[2] > r[1]]
print("GREW:", grew if grew else "none")
print("DONE")
