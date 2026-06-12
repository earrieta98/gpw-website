import os, re
ROOT = os.path.abspath(".")
from urllib.parse import unquote

# Build set of referenced image disk paths from HTML (live) + inline styles
referenced = set()
def resolve(ref, base_dir):
    ref = ref.strip().split("#")[0].split("?")[0]
    if not ref: return None
    low = ref.lower()
    if low.startswith(("data:","mailto:","tel:","http://","https://","//","javascript:")):
        if "gpw-solutions.com" in low:
            path = ref.split("gpw-solutions.com",1)[1]
            return os.path.normpath(os.path.join(ROOT, unquote(path.lstrip("/"))))
        return None
    if ref.startswith("/"):
        return os.path.normpath(os.path.join(ROOT, unquote(ref.lstrip("/"))))
    return os.path.normpath(os.path.join(base_dir, unquote(ref)))

IMG_EXT = (".jpg",".jpeg",".png",".gif",".webp",".svg",".avif")
pat_src = re.compile(r'(?:src|href|poster)\s*=\s*["\']([^"\']+)["\']', re.I)
pat_srcset = re.compile(r'srcset\s*=\s*["\']([^"\']+)["\']', re.I)
pat_content = re.compile(r'content\s*=\s*["\']([^"\']+)["\']', re.I)
pat_url = re.compile(r'url\(\s*[\'"]?([^)\'"]+)[\'"]?\s*\)', re.I)

for dirpath, dirs, files in os.walk(ROOT):
    dirs[:] = [d for d in dirs if d not in (".scratch","docs","tests",".git")]
    for fn in files:
        if not fn.endswith(".html"): continue
        p = os.path.join(dirpath, fn)
        with open(p, encoding="utf-8", errors="replace") as fh:
            text = fh.read()
        bd = os.path.dirname(p)
        for m in pat_src.finditer(text):
            d = resolve(m.group(1), bd)
            if d and os.path.splitext(d)[1].lower() in IMG_EXT: referenced.add(d)
        for m in pat_srcset.finditer(text):
            for part in m.group(1).split(","):
                u = part.strip().split()[0] if part.strip() else ""
                d = resolve(u, bd)
                if d and os.path.splitext(d)[1].lower() in IMG_EXT: referenced.add(d)
        for m in pat_content.finditer(text):
            v = m.group(1)
            if os.path.splitext(v.split("?")[0])[1].lower() in IMG_EXT:
                d = resolve(v, bd)
                if d and os.path.splitext(d)[1].lower() in IMG_EXT: referenced.add(d)
        for m in pat_url.finditer(text):
            d = resolve(m.group(1), bd)
            if d and os.path.splitext(d)[1].lower() in IMG_EXT: referenced.add(d)

# Report referenced images over 300KB
print("=== Referenced images > 300 KB ===")
big = []
for d in referenced:
    if os.path.isfile(d):
        kb = os.path.getsize(d)/1024
        if kb > 300:
            big.append((round(kb,1), os.path.relpath(d, ROOT).replace("\\","/")))
big.sort(reverse=True)
for kb, rel in big:
    print(f"  {kb} KB  {rel}")
print("total big:", len(big))

# Also: list all img files NOT referenced (orphans) - informational
print("\n=== Image files on disk under /img not referenced by any live page (orphans) ===")
all_img = set()
for dirpath, dirs, files in os.walk(os.path.join(ROOT,"img")):
    for fn in files:
        if os.path.splitext(fn)[1].lower() in IMG_EXT:
            all_img.add(os.path.normpath(os.path.join(dirpath, fn)))
orphans = sorted(all_img - referenced)
for o in orphans:
    kb = round(os.path.getsize(o)/1024,1)
    print(f"  {kb} KB  {os.path.relpath(o, ROOT).replace(chr(92),'/')}")
print("total orphans:", len(orphans))
print("total img files:", len(all_img), "referenced img (existing under /img):", len([r for r in referenced if os.path.isfile(r) and os.path.relpath(r,ROOT).replace(chr(92),'/').startswith('img/')]))
