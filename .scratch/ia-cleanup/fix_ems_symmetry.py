# -*- coding: utf-8 -*-
"""Phase 4 IA cleanup — make EMS symmetric to CNC (D-3 = A+, D-5 = leave URLs).
Retire the /ems/services/ hub (301 -> /ems/), simplify the 5 service breadcrumbs
(HTML + JSON-LD), rescue the hub's UNIQUE content (service-selection matrix + 2
unique FAQ Q/A) into /ems/, repoint every live link to the hub, drop it from the
sitemap. Per-file backup + count asserts, all-or-nothing. Pattern: fix_footer.py."""
import os, re, sys, shutil

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))  # 05-website
BK   = os.path.join(ROOT, '.scratch/ia-cleanup/phase4-backup-20260609')
os.makedirs(BK, exist_ok=True)

errors = []
def backup(rel):
    """copy ROOT/rel into BK/rel once (never clobber the true original)."""
    src = os.path.join(ROOT, rel); dst = os.path.join(BK, rel)
    if not os.path.exists(dst):
        os.makedirs(os.path.dirname(dst), exist_ok=True)
        shutil.copy2(src, dst)

def read(rel):  return open(os.path.join(ROOT, rel), encoding='utf-8', errors='strict').read()
def write(rel, txt):
    backup(rel); open(os.path.join(ROOT, rel), 'w', encoding='utf-8', newline='').write(txt)

def need(cond, msg):
    if not cond: errors.append(msg)
    return cond

SERVICES = ['box-build-assembly','cable-harness-assembly','enclosure-cabinet-assembly',
            'system-integration','testing-inspection']
SVC_FILES = [f'ems/services/{s}.html' for s in SERVICES]
HUB = 'ems/services/index.html'

# ================================================================= 0) extract the
# unique service-selection section from the hub BEFORE retiring it.
hub_txt = read(HUB)
m = re.search(r'<section class="section selection-guide" id="selection">.*?</section>', hub_txt, re.S)
need(m, 'hub: selection section not found')
SELECTION = m.group(0).replace(
    '<section class="section selection-guide" id="selection">',
    '<section class="section section--light selection-guide" id="selection">', 1) if m else ''
# the only link inside must already be root-absolute (no rewrite needed)
need(m and SELECTION.count('href="') == 1 and 'href="/request-a-quote/"' in SELECTION,
     'hub selection: unexpected links (expected exactly 1 root-absolute /request-a-quote/)')

# ================================================================= 1) ems-home.css
# add the selection-guide CSS rules (they lived in the hub's inline <style>).
CSS = 'css/ems-home.css'
css = read(CSS)
SELECTION_CSS = """
/* ============================================
   SERVICE SELECTION GUIDE
   (rescued from the retired /ems/services/ hub — Phase 4 IA cleanup)
   ============================================ */
.selection-guide { padding: var(--space-4xl) 0; }
.selection-guide__header { text-align: center; margin-bottom: var(--space-3xl); }
.selection-guide__header p { max-width: 700px; margin: 0 auto; color: var(--mid-gray); }
.guide-table { overflow-x: auto; margin-bottom: var(--space-xl); }
.guide-table table { width: 100%; border-collapse: collapse; background: var(--white); border-radius: var(--radius-lg); overflow: hidden; border: 1px solid var(--light-gray); min-width: 640px; }
.guide-table thead { background: var(--teal); color: var(--white); }
.guide-table th { padding: var(--space-md) var(--space-lg); font-size: var(--text-sm); font-weight: 700; text-align: center; }
.guide-table th:first-child { text-align: left; }
.guide-table td { padding: var(--space-md) var(--space-lg); font-size: var(--text-sm); color: var(--dark-gray); border-bottom: 1px solid var(--warm-gray); text-align: center; }
.guide-table td:first-child { font-weight: 700; color: var(--charcoal); text-align: left; }
.guide-table tr:last-child td { border-bottom: none; }
.guide-table tbody tr:hover { background: rgba(35, 85, 90, 0.03); }
.guide-table .check { color: var(--teal); font-weight: 700; }
.guide-table .dash { color: var(--light-gray); }
.guide-note { font-size: var(--text-sm); color: var(--mid-gray); line-height: 1.7; max-width: 700px; }
@media (max-width: 768px) {
  .guide-table th, .guide-table td { padding: var(--space-sm) var(--space-md); font-size: var(--text-xs); }
}
"""
if need('.selection-guide' not in css, f'{CSS}: .selection-guide already present'):
    write(CSS, css.rstrip() + '\n' + SELECTION_CSS)

# ================================================================= 2) ems/index.html
EMS = 'ems/index.html'
e = read(EMS)
# 2a) insert the selection section right after the "5 Core Services" section
sm = re.search(r'(<section class="section section--light" id="services">.*?</section>)', e, re.S)
if need(sm, f'{EMS}: services section not found'):
    e = e[:sm.end()] + '\n\n  ' + SELECTION + e[sm.end():]
# 2b) hero button: services/ (retired hub) -> on-page #services anchor
n = e.count('href="services/"')
if need(n == 1, f'{EMS}: href="services/" found {n}, expected 1'):
    e = e.replace('href="services/"', 'href="#services"', 1)
# 2c) rescue 2 unique FAQ Q/A (converted to /ems/ .faq-item markup), after item #2
FAQ_ANCHOR = 'into a complete, tested product.</p>\n          </div>\n        </details>'
NEW_FAQ_HTML = FAQ_ANCHOR + """

        <details class="faq-item reveal">
          <summary class="faq-item__question">Can GPW handle projects that require multiple services?</summary>
          <div class="faq-item__answer">
            <p>Yes. Most customer programs combine two or more services within a single production line. GPW manages the full assembly scope — mechanical, electrical, cabling, testing, and packaging — under one program manager and one quality system. This eliminates the coordination overhead of managing multiple subcontractors.</p>
          </div>
        </details>

        <details class="faq-item reveal">
          <summary class="faq-item__question">How does GPW quote an assembly project?</summary>
          <div class="faq-item__answer">
            <p>Every RFQ is reviewed by GPW's engineering team for technical feasibility, DFM considerations, and process requirements before generating a quote. Submit your BOM, specifications, and target volumes through the RFQ form. Engineering responds within 24 hours with a detailed technical review and proposal.</p>
          </div>
        </details>"""
n = e.count(FAQ_ANCHOR)
if need(n == 1, f'{EMS}: FAQ html anchor found {n}, expected 1'):
    e = e.replace(FAQ_ANCHOR, NEW_FAQ_HTML, 1)
# 2d) add the same 2 Q/A to the FAQPage JSON-LD (after the last question)
LD_ANCHOR = 'reaches Texas in 2 hours."\n        }\n      }'
NEW_FAQ_LD = LD_ANCHOR + """,
      {
        "@type": "Question",
        "name": "Can GPW handle projects that require multiple services?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. Most customer programs combine two or more services within a single production line. GPW manages the full assembly scope — mechanical, electrical, cabling, testing, and packaging — under one program manager and one quality system. This eliminates the coordination overhead of managing multiple subcontractors."
        }
      },
      {
        "@type": "Question",
        "name": "How does GPW quote an assembly project?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Every RFQ is reviewed by GPW's engineering team for technical feasibility, DFM considerations, and process requirements before generating a quote. Submit your BOM, specifications, and target volumes through the RFQ form. Engineering responds within 24 hours with a detailed technical review and proposal."
        }
      }"""
n = e.count(LD_ANCHOR)
if need(n == 1, f'{EMS}: FAQ JSON-LD anchor found {n}, expected 1'):
    e = e.replace(LD_ANCHOR, NEW_FAQ_LD, 1)
if not errors:
    write(EMS, e)

# ================================================================= 3) 5 service pages
BC_RE = re.compile(r'\n\s*<a href="\./" class="breadcrumb__link">Services</a>\s*\n\s*<span class="breadcrumb__sep" aria-hidden="true">/</span>')
LD_SVC = '{"@type": "ListItem", "position": 3, "name": "Services", "item": "https://gpw-solutions.com/ems/services/"}, '
for rel in SVC_FILES:
    t = read(rel)
    ok = True
    # 3a) remove the "Services" breadcrumb level (HTML)
    if not need(len(BC_RE.findall(t)) == 1, f'{rel}: breadcrumb Services level count != 1'): ok = False
    # 3b) JSON-LD: remove Services ListItem + renumber position 4 -> 3
    if not need(t.count(LD_SVC) == 1, f'{rel}: JSON-LD Services item count != 1'): ok = False
    if not need(t.count('"position": 4') == 1, f'{rel}: "position": 4 count != 1'): ok = False
    # 3c) "All Services" body link -> /ems/#services
    if not need(t.count('<a href="./">All Services</a>') == 1, f'{rel}: All Services link count != 1'): ok = False
    if ok:
        t = BC_RE.sub('', t, count=1)
        t = t.replace(LD_SVC, '', 1).replace('"position": 4', '"position": 3', 1)
        t = t.replace('<a href="./">All Services</a>', '<a href="../#services">All Services</a>', 1)
        write(rel, t)

# ================================================================= 4) 404.html
NF = '404.html'
nf = read(NF)
if need(nf.count('href="/ems/services/"') == 1, f'{NF}: bare /ems/services/ link count != 1'):
    write(NF, nf.replace('href="/ems/services/"', 'href="/ems/"', 1))

# ================================================================= 5) .htaccess 301
HT = '.htaccess'
ht = read(HT)
HT_ANCHOR = 'RewriteRule ^ems/about\\.html$ /about.html [L,R=301]'
HT_NEW = HT_ANCHOR + '\n\n# EMS services hub retired — intermediate /ems/services/ folded into /ems/ (Phase 4, symmetry with CNC)\nRewriteRule ^ems/services/?(index\\.html)?$ /ems/ [L,R=301]'
if need(ht.count(HT_ANCHOR) == 1, f'{HT}: about-redirect anchor count != 1'):
    write(HT, ht.replace(HT_ANCHOR, HT_NEW, 1))

# ================================================================= 6) sitemap.xml
SM = 'sitemap.xml'
sm_txt = read(SM)
SM_RE = re.compile(r'\n  <url>\s*\n\s*<loc>https://gpw-solutions\.com/ems/services/</loc>.*?</url>', re.S)
if need(len(SM_RE.findall(sm_txt)) == 1, f'{SM}: /ems/services/ <url> block count != 1'):
    write(SM, SM_RE.sub('', sm_txt, count=1))

# ================================================================= 7) soft-delete hub
if not errors:
    dst = os.path.join(BK, HUB)
    os.makedirs(os.path.dirname(dst), exist_ok=True)
    shutil.move(os.path.join(ROOT, HUB), dst)   # remove from served tree, keep in backup

# ================================================================= report
if errors:
    print('*** ABORTED — assertions failed (files written before the failure are backed up):')
    print('\n'.join('  '+e for e in errors)); sys.exit(1)
print('Phase 4 applied OK. Backups ->', os.path.relpath(BK, ROOT))
print('  - selection matrix rescued into /ems/ (+ CSS in ems-home.css)')
print('  - 2 unique FAQ Q/A rescued into /ems/ (HTML + FAQPage JSON-LD)')
print('  - 5 service breadcrumbs simplified (HTML + JSON-LD)')
print('  - hero button + 5 "All Services" + 404 link repointed off the hub')
print('  - .htaccess 301 added; sitemap entry removed; hub soft-deleted')
