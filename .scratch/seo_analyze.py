import json, re, html, glob
from collections import Counter

rows = json.load(open(".scratch/seo_rows.json", encoding="utf-8"))

def L(s):
    return len(html.unescape(s)) if s else 0

print("===== DUPLICATE TITLES =====")
tc = Counter(html.unescape(r['title']) for r in rows if r['title'])
for t,n in tc.items():
    if n>1:
        print(f"  x{n}: {t}")

print("===== DUPLICATE DESCRIPTIONS =====")
dc = Counter(html.unescape(r['desc']) for r in rows if r['desc'])
for d,n in dc.items():
    if n>1:
        print(f"  x{n}: {d}")

print("===== DUPLICATE OG:IMAGE =====")
ic = Counter(r['ogi'] for r in rows if r['ogi'])
for i,n in ic.items():
    if n>1:
        print(f"  x{n}: {i}  -> files: {[r['file'] for r in rows if r['ogi']==i]}")

print("===== TITLE LENGTH ISSUES (>60 or <30 or missing) =====")
for r in rows:
    tl=L(r['title'])
    if tl==0 or tl>60 or tl<25:
        print(f"  {r['file']}: len={tl} : {r['title']}")

print("===== DESC LENGTH ISSUES (<120 or >160 or missing) =====")
for r in rows:
    dl=L(r['desc'])
    flag=""
    if dl==0: flag="MISSING"
    elif dl<120: flag="SHORT"
    elif dl>160: flag="LONG"
    if flag:
        print(f"  {r['file']}: {flag} len={dl}")

print("===== MISSING CANONICAL =====")
for r in rows:
    if not r['canon']:
        print(f"  {r['file']}")

print("===== CANONICAL ISSUES (www / http / index.html mismatch) =====")
for r in rows:
    c=r['canon']
    if not c: continue
    if 'www.' in c or c.startswith('http://'):
        print(f"  {r['file']}: {c}")

print("===== CANONICAL vs OG:URL MISMATCH =====")
for r in rows:
    if r['canon'] and r['ogu'] and r['canon']!=r['ogu']:
        print(f"  {r['file']}: canon={r['canon']} ogu={r['ogu']}")

print("===== OG:TITLE vs TITLE MISMATCH =====")
for r in rows:
    if r['ogt'] and r['title']:
        a=html.unescape(r['ogt']); b=html.unescape(r['title'])
        if a!=b:
            print(f"  {r['file']}:")
            print(f"     title: {b}")
            print(f"     og:t : {a}")

print("===== MISSING META (desc/og:img/tw/lang/vp) =====")
for r in rows:
    probs=[]
    if not r['desc']: probs.append('no-desc')
    if not r['ogi']: probs.append('no-og:image')
    if not r['ogt']: probs.append('no-og:title')
    if not r['ogd']: probs.append('no-og:desc')
    if not r['ogu']: probs.append('no-og:url')
    if not r['tw']: probs.append('no-twitter')
    if not r['lang']: probs.append('no-lang')
    if not r['vp']: probs.append('no-viewport')
    if probs:
        print(f"  {r['file']}: {probs}")

print("===== H1 COUNT != 1 =====")
for r in rows:
    if r['h1count']!=1:
        print(f"  {r['file']}: h1count={r['h1count']} : {r['h1s']}")

print("===== ROBOTS NOINDEX =====")
for r in rows:
    if r['robots'] and 'noindex' in r['robots'].lower():
        print(f"  {r['file']}: {r['robots']}")

print("===== JSON-LD COUNT 0 =====")
for r in rows:
    if r['ldcount']==0:
        print(f"  {r['file']}: ldcount=0")
