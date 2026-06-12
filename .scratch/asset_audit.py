import os, re, sys
from urllib.parse import urlparse, unquote

ROOT = os.path.abspath(".")
SITE_HOST = "gpw-solutions.com"

# Collect live HTML pages (exclude .scratch, docs, tests, assets backup dirs)
def is_live(path):
    rel = os.path.relpath(path, ROOT).replace("\\", "/")
    if rel.startswith(".scratch/"): return False
    if rel.startswith("docs/"): return False
    if rel.startswith("tests/"): return False
    return True

html_files = []
for dirpath, dirs, files in os.walk(ROOT):
    # prune
    dirs[:] = [d for d in dirs if d not in (".scratch", "docs", "tests", ".git")]
    for f in files:
        if f.endswith(".html"):
            p = os.path.join(dirpath, f)
            if is_live(p):
                html_files.append(p)

html_files.sort()

def resolve(ref, base_dir):
    """Resolve a reference to an absolute disk path. Returns (disk_path, kind) or None if external/skip."""
    ref = ref.strip()
    if not ref: return None
    # strip query/hash
    ref = ref.split("#")[0].split("?")[0]
    if not ref: return None
    low = ref.lower()
    if low.startswith("data:") or low.startswith("mailto:") or low.startswith("tel:") or low.startswith("javascript:"):
        return None
    if low.startswith("//"):
        # protocol-relative external
        if SITE_HOST in low:
            path = ref.split(SITE_HOST,1)[1]
            return os.path.normpath(os.path.join(ROOT, path.lstrip("/")))
        return None
    if low.startswith("http://") or low.startswith("https://"):
        if SITE_HOST in ref:
            path = ref.split(SITE_HOST,1)[1]
            return os.path.normpath(os.path.join(ROOT, unquote(path.lstrip("/"))))
        return None  # external
    if ref.startswith("/"):
        return os.path.normpath(os.path.join(ROOT, unquote(ref.lstrip("/"))))
    # relative
    return os.path.normpath(os.path.join(base_dir, unquote(ref)))

# Asset reference extraction patterns
broken = []
placeholder_refs = []
all_refs = []  # (page, line, kind, ref, disk)
og_refs = []
empty_alt = []

def lineno(text, pos):
    return text.count("\n", 0, pos) + 1

# Regex for attributes
attr_patterns = [
    ("stylesheet/href", re.compile(r'<link\b[^>]*\bhref\s*=\s*["\']([^"\']+)["\']', re.I)),
    ("script/src", re.compile(r'<script\b[^>]*\bsrc\s*=\s*["\']([^"\']+)["\']', re.I)),
    ("img/src", re.compile(r'<img\b[^>]*?\bsrc\s*=\s*["\']([^"\']+)["\']', re.I)),
    ("source/srcset", re.compile(r'<source\b[^>]*\bsrcset\s*=\s*["\']([^"\']+)["\']', re.I)),
    ("video/poster", re.compile(r'<video\b[^>]*\bposter\s*=\s*["\']([^"\']+)["\']', re.I)),
]

# og:image / twitter:image
meta_pat = re.compile(r'<meta\b[^>]*\b(?:property|name)\s*=\s*["\'](og:image|twitter:image|og:image:url)["\'][^>]*\bcontent\s*=\s*["\']([^"\']+)["\']', re.I)
meta_pat2 = re.compile(r'<meta\b[^>]*\bcontent\s*=\s*["\']([^"\']+)["\'][^>]*\b(?:property|name)\s*=\s*["\'](og:image|twitter:image|og:image:url)["\']', re.I)

# preload/prefetch href
preload_pat = re.compile(r'<link\b[^>]*\brel\s*=\s*["\'](?:preload|prefetch|preconnect|dns-prefetch)["\'][^>]*\bhref\s*=\s*["\']([^"\']+)["\']', re.I)

# img alt analysis
img_tag_pat = re.compile(r'<img\b[^>]*>', re.I)

CHECKABLE_EXT = (".css",".js",".jpg",".jpeg",".png",".svg",".gif",".webp",".ico",".woff",".woff2",".ttf",".mp4",".webm",".avif",".json")

def check(page, line, kind, ref):
    disk = resolve(ref, os.path.dirname(page))
    if disk is None:
        return
    rel_disk = os.path.relpath(disk, ROOT).replace("\\","/")
    all_refs.append((page, line, kind, ref, disk))
    # only check assets with extensions we care about
    ext = os.path.splitext(disk)[1].lower()
    if ext in CHECKABLE_EXT:
        if not os.path.isfile(disk):
            broken.append((page, line, kind, ref, rel_disk))
    if "_placeholder-" in ref and ref.lower().endswith(".svg"):
        placeholder_refs.append((page, line, kind, ref, rel_disk))

for hf in html_files:
    with open(hf, encoding="utf-8", errors="replace") as fh:
        text = fh.read()
    relpage = os.path.relpath(hf, ROOT).replace("\\","/")
    for kind, pat in attr_patterns:
        for m in pat.finditer(text):
            val = m.group(1)
            ln = lineno(text, m.start())
            if kind == "source/srcset":
                # srcset can have multiple comma-separated url size
                for part in val.split(","):
                    url = part.strip().split()[0] if part.strip() else ""
                    if url: check(relpage, ln, kind, url)
            else:
                check(relpage, ln, kind, val)
    # img srcset separately
    for m in re.finditer(r'<img\b[^>]*\bsrcset\s*=\s*["\']([^"\']+)["\']', text, re.I):
        ln = lineno(text, m.start())
        for part in m.group(1).split(","):
            url = part.strip().split()[0] if part.strip() else ""
            if url: check(relpage, ln, "img/srcset", url)
    # meta og/twitter
    for m in meta_pat.finditer(text):
        ln = lineno(text, m.start())
        ref = m.group(2)
        disk = resolve(ref, os.path.dirname(hf))
        if disk:
            rel_disk = os.path.relpath(disk, ROOT).replace("\\","/")
            og_refs.append((relpage, ln, m.group(1), ref, rel_disk, os.path.isfile(disk)))
            check(relpage, ln, "meta:"+m.group(1), ref)
    for m in meta_pat2.finditer(text):
        ln = lineno(text, m.start())
        ref = m.group(1)
        disk = resolve(ref, os.path.dirname(hf))
        if disk:
            rel_disk = os.path.relpath(disk, ROOT).replace("\\","/")
            og_refs.append((relpage, ln, m.group(2), ref, rel_disk, os.path.isfile(disk)))
            check(relpage, ln, "meta:"+m.group(2), ref)
    # preload
    for m in preload_pat.finditer(text):
        ln = lineno(text, m.start())
        check(relpage, ln, "preload", m.group(1))
    # empty/missing alt
    for m in img_tag_pat.finditer(text):
        tag = m.group(0)
        ln = lineno(text, m.start())
        altm = re.search(r'\balt\s*=\s*["\']([^"\']*)["\']', tag, re.I)
        srcm = re.search(r'\bsrc\s*=\s*["\']([^"\']*)["\']', tag, re.I)
        src = srcm.group(1) if srcm else "?"
        if altm is None:
            empty_alt.append((relpage, ln, "MISSING-alt", src))
        elif altm.group(1).strip() == "":
            empty_alt.append((relpage, ln, "EMPTY-alt", src))

print("=== HTML PAGES SCANNED:", len(html_files))
print("\n=== BROKEN ASSET REFERENCES (file does not exist on disk):", len(broken))
for b in broken:
    print(f"  {b[0]}:{b[1]} [{b[2]}] ref='{b[3]}' -> MISSING {b[4]}")

print("\n=== PLACEHOLDER SVG REFERENCES:", len(placeholder_refs))
for p in placeholder_refs:
    print(f"  {p[0]}:{p[1]} [{p[2]}] {p[3]}")

print("\n=== OG/TWITTER IMAGE REFS:", len(og_refs))
missing_og = [o for o in og_refs if not o[5]]
print("    missing og:", len(missing_og))
for o in missing_og:
    print(f"  {o[0]}:{o[1]} [{o[2]}] {o[3]} -> MISSING {o[4]}")
# unique og targets
og_targets = set(o[4] for o in og_refs)
print("    unique og target files referenced:", len(og_targets))

print("\n=== IMG MISSING/EMPTY ALT:", len(empty_alt))
for e in empty_alt:
    print(f"  {e[0]}:{e[1]} {e[2]} src={e[3]}")
