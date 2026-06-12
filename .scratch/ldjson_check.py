import json, re, glob, html

files = []
for f in glob.glob("**/*.html", recursive=True):
    fn = f.replace("\\","/")
    if any(fn.startswith(p) for p in (".git/", "tests/", "assets/", "docs/", ".scratch/")):
        continue
    files.append(fn)
files = sorted(files)

bad_keys = ['certification','iso 9001','as9100','iatf','itar','iso 13485','aggregateRating',
            'award','hasCertification','accreditation','rating']

def walk_types(obj, types):
    if isinstance(obj, dict):
        if '@type' in obj:
            t=obj['@type']
            if isinstance(t,list): types.extend(t)
            else: types.append(t)
        for v in obj.values():
            walk_types(v, types)
    elif isinstance(obj, list):
        for v in obj:
            walk_types(v, types)

for f in files:
    t = open(f, encoding="utf-8").read()
    blocks = re.findall(r'<script[^>]+type=["\']application/ld\+json["\'][^>]*>(.*?)</script>', t, re.I|re.S)
    for i, b in enumerate(blocks):
        raw = b.strip()
        try:
            data = json.loads(raw)
            types=[]
            walk_types(data, types)
            print(f"OK  {f} [{i}] types={types}")
        except Exception as e:
            print(f"!! INVALID JSON  {f} [{i}]: {e}")
            print("    snippet:", raw[:200])
        # honesty scan on raw text
        low = raw.lower()
        for k in bad_keys:
            if k.lower() in low:
                # find context
                idx=low.find(k.lower())
                print(f"   HONESTY?? {f}[{i}] contains '{k}': ...{raw[max(0,idx-60):idx+60]}...")

# Also scan address/PostalAddress claims
print("\n===== address / streetAddress in schema =====")
for f in files:
    t = open(f, encoding="utf-8").read()
    blocks = re.findall(r'<script[^>]+type=["\']application/ld\+json["\'][^>]*>(.*?)</script>', t, re.I|re.S)
    for i,b in enumerate(blocks):
        low=b.lower()
        if 'streetaddress' in low or 'postaladdress' in low:
            m=re.search(r'"address"\s*:\s*\{[^}]*\}', b, re.S)
            print(f"  {f}[{i}]: {m.group(0) if m else 'address present'}")
