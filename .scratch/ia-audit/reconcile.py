# Reconcile the two agent/crawler discrepancies against ground truth.
import os, re, json
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
d = json.load(open(os.path.join(ROOT, ".scratch/ia-audit/data.json"), encoding="utf-8"))
A_RE = re.compile(r'<a\b[^>]*?\shref\s*=\s*"([^"]*)"', re.I)
FOOT = re.compile(r'<footer\b.*?</footer>', re.I | re.S)

site_pages = d["files_by_class"]["site-page"]
redirect_source_files = set(r["src_file_exists"] for r in d["redirect_source_files"] if r["src_file_exists"])

# ---- (1) DEFINITIVE footer presence + content ----
print("="*70)
print("(1) FOOTER PRESENCE (definitive)")
print("="*70)
no_footer = []
foot_has = {}  # file -> set of internal targets (normalized basename-ish)
for p in d["files_by_class"]["site-page"] + d["files_by_class"]["error-page"]:
    txt = open(os.path.join(ROOT,p), encoding="utf-8", errors="replace").read()
    m = FOOT.search(txt)
    if not m:
        no_footer.append(p); continue
    hrefs = [h for h in A_RE.findall(m.group(0)) if not h.startswith(('mailto','http','#'))]
    foot_has[p] = hrefs
print("Pages with NO <footer> element:", no_footer if no_footer else "NONE (every site page has a footer)")
print("Pages WITH footer:", len(foot_has))

# which industries / CM-capabilities / EMS-services each footer lists (any depth)
INDUSTRIES = ['aerospace-defense','ai-server-rack','appliances','automotive','electronics','energy','industrial-equipment','medical-devices','oil-gas','telecom']
CM = ['cnc-milling','cnc-turning','wire-edm','sheet-metal','surface-finishing','engineering-support','metals','plastics','why-mexico']
EMS = ['box-build-assembly','cable-harness-assembly','system-integration','testing-inspection','enclosure-cabinet-assembly']
def coverage(hrefs, keys, prefix):
    found=set()
    for h in hrefs:
        for k in keys:
            if (prefix+'/'+k+'/') in h or h.endswith(k+'/') or (k+'.html') in h or h.endswith(k+'.html'):
                found.add(k)
    return found
# aggregate: for each industry/cm/ems, in how many footers does it appear
from collections import Counter
ind_count=Counter(); cm_count=Counter(); ems_count=Counter()
for p,hrefs in foot_has.items():
    for k in coverage(hrefs, INDUSTRIES, 'industries'): ind_count[k]+=1
    for k in coverage(hrefs, CM, 'contract-manufacturing'): cm_count[k]+=1
    for k in coverage(hrefs, EMS, 'services'): ems_count[k]+=1
print("\nIndustries: # of footers (of %d) that link each:" % len(foot_has))
for k in INDUSTRIES: print(f"   {k:22s} {ind_count[k]:2d}", "  <-- NEVER in any footer" if ind_count[k]==0 else "")
print("CM capabilities:")
for k in CM: print(f"   {k:22s} {cm_count[k]:2d}", "  <-- NEVER in any footer" if cm_count[k]==0 else "")
print("EMS services:")
for k in EMS: print(f"   {k:22s} {ems_count[k]:2d}", "  <-- NEVER in any footer" if ems_count[k]==0 else "")

# distinct footer link-signatures (depth-normalized)
def sig(hrefs):
    s=set()
    for h in hrefs:
        c=re.sub(r'^(\.\./)+','',h); c=re.sub(r'^\./','',c); c=c.lstrip('/')
        s.add(c)
    return tuple(sorted(s))
sigs={}
for p,hrefs in foot_has.items():
    sigs.setdefault(sig(hrefs),[]).append(p)
print(f"\nDistinct footer LINK-signatures among {len(foot_has)} footers: {len(sigs)}")

# ---- (2) DEFINITIVE actionable redirected links (exclude self-redirecting sources) ----
print("\n"+"="*70)
print("(2) ACTIONABLE redirected internal links (source is a LIVE, non-redirected page)")
print("="*70)
actionable=[]
for rl in d["redirected_links"]:
    src=rl["source"]
    if src in redirect_source_files:   # users never land here -> not actionable
        continue
    actionable.append(rl)
# group by source-group and by final target
from collections import defaultdict
by_src=defaultdict(list)
for rl in actionable:
    by_src[rl["source"]].append(rl)
print("Total actionable redirected links:", len(actionable), "across", len(by_src), "live source pages")
# group by target
by_to=Counter(rl["redirect_to"] for rl in actionable)
print("\nBy final destination:")
for t,c in by_to.most_common():
    print(f"   -> {t:42s} {c} links")
print("\nPer live source page (count):")
for s in sorted(by_src):
    tos=Counter(x["redirect_to"] for x in by_src[s])
    print(f"   {s:54s} {len(by_src[s]):2d}  -> {dict(tos)}")

# classify self-loop vs wrong-dest for industries
print("\nIndustries -> CM-spoke link classification:")
for rl in actionable:
    if rl["source"].startswith("industries/"):
        src_url='/'+rl["source"].replace('index.html','')
        kind='SELF-LOOP' if rl["redirect_to"]==src_url else 'WRONG-DEST (lands elsewhere)'
        print(f"   {rl['source']:46s} {rl['raw']:40s} ->301-> {rl['redirect_to']:32s} [{kind}]")

out={"no_footer":no_footer,"footer_count":len(foot_has),"footer_sigs":len(sigs),
     "ind_count":dict(ind_count),"cm_count":dict(cm_count),"ems_count":dict(ems_count),
     "actionable_redirected":actionable,"actionable_total":len(actionable)}
json.dump(out, open(os.path.join(ROOT,".scratch/ia-audit/reconcile.json"),"w",encoding="utf-8"), indent=2, ensure_ascii=False)
print("\nWrote reconcile.json")
