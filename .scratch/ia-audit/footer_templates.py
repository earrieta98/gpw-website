import os, re
from collections import defaultdict
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
A_RE = re.compile(r'<a\b[^>]*?\shref\s*=\s*"([^"]*)"', re.I)
FOOT = re.compile(r'<footer\b.*?</footer>', re.I | re.S)
HEAD = re.compile(r'<header\b.*?</header>', re.I | re.S)

def relpages():
    out = []
    for dp, dn, fn in os.walk(ROOT):
        if '.scratch' in dp or '.git' in dp: continue
        for f in fn:
            if f.endswith('.html'):
                out.append(os.path.relpath(os.path.join(dp, f), ROOT).replace('\\','/'))
    return sorted(out)

def basename_sig(hrefs):
    s = set()
    for h in hrefs:
        if h.startswith('mailto') or h.startswith('http') or h.startswith('#'): continue
        # collapse ../ depth so templates compare equal
        core = re.sub(r'^(\.\./)+', '', h)
        core = re.sub(r'^\./', '', core)
        s.add(core if core else '(home)')
    return tuple(sorted(s))

sig = defaultdict(list)
for p in relpages():
    txt = open(os.path.join(ROOT,p), encoding='utf-8', errors='replace').read()
    m = FOOT.search(txt)
    links = basename_sig(A_RE.findall(m.group(0))) if m else ('NO-FOOTER',)
    sig[links].append(p)

print("Distinct footer templates:", len(sig))
for i,(k,v) in enumerate(sorted(sig.items(), key=lambda kv:-len(kv[1])),1):
    print(f"\n--- Footer template #{i}  ({len(v)} pages) ---")
    print("  link count:", len(k))
    print("  links:", list(k))
    print("  pages:", v)
PY = None
