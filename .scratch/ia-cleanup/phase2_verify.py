# -*- coding: utf-8 -*-
"""Adversarial, deterministic verification of the 8 integrated industry pages.
Diffs each against its phase2 backup, scans ADDED content for honesty/integrity issues,
checks tag balance + zero spoke hrefs. Read-only."""
import os, re, difflib

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
BK = os.path.join(ROOT, '.scratch/ia-cleanup/phase2-backup-20260609')

PAGES = {
 'industries/aerospace-defense/index.html': ['contract-manufacturing/aerospace-defense'],
 'industries/automotive/index.html': ['contract-manufacturing/automotive'],
 'industries/medical-devices/index.html': ['contract-manufacturing/medical-devices'],
 'industries/industrial-equipment/index.html': ['contract-manufacturing/industrial-equipment'],
 'industries/electronics/index.html': ['contract-manufacturing/electronics-telecom'],
 'industries/telecom/index.html': ['contract-manufacturing/electronics-telecom'],
 'industries/oil-gas/index.html': ['contract-manufacturing/oil-gas-energy'],
 'industries/energy/index.html': ['contract-manufacturing/oil-gas-energy'],
}

# honesty red flags on ADDED text
OWNED = re.compile(r'\bour\s+(mill|mills|lathe|lathes|machine|machines|machining center|cnc|shop floor|shop|equipment|facilit)', re.I)
WE_MACHINE = re.compile(r'\bwe\s+(machine|mill|turn|cut|fabricate|run|operate)\b', re.I)
CERT = re.compile(r'\b(ISO\s?9001|AS9100|IATF\s?16949|ISO\s?13485|NADCAP|API)\b[^.<]{0,40}\b(certified|cert; certification|accredited)\b', re.I)
CERT2 = re.compile(r'\b(we are|gpw is)\s+(certified|accredited)\b', re.I)
BORDER = re.compile(r'cross[- ]border|across the border', re.I)
HYPE = re.compile(r'world-class|cutting-edge|best-in-class|state of the art|industry-leading', re.I)

def norm_lines(txt):
    # content lines, whitespace-normalized, for real-diff (ignore EOL/indent-only changes)
    return [re.sub(r'\s+', ' ', l).strip() for l in txt.splitlines()]

total_problems = 0
for page, spokes in PAGES.items():
    cur = open(os.path.join(ROOT, page), encoding='utf-8', errors='replace').read()
    bak = open(os.path.join(BK, page), encoding='utf-8', errors='replace').read()
    print(f'\n===== {page} =====')
    # 1) zero spoke hrefs
    spoke_hits = []
    for s in spokes:
        spoke_hits += re.findall(r'href="[^"]*' + re.escape(s) + r'[^"]*"', cur)
    print(f'  spoke hrefs remaining: {len(spoke_hits)}', '' if not spoke_hits else f'*** {spoke_hits}')
    # 2) tag balance
    for tag in ['details', 'section']:
        o = len(re.findall(r'<' + tag + r'\b', cur)); c = len(re.findall(r'</' + tag + r'>', cur))
        flag = '' if o == c else '  *** UNBALANCED'
        print(f'  <{tag}>={o} </{tag}>={c}{flag}')
        if o != c: total_problems += 1
    # section count vs backup (no new top-level section)
    sec_cur = len(re.findall(r'<section\b', cur)); sec_bak = len(re.findall(r'<section\b', bak))
    print(f'  <section> count: backup={sec_bak} now={sec_cur}', '' if sec_cur == sec_bak else '  *** SECTION COUNT CHANGED')
    if sec_cur != sec_bak: total_problems += 1
    # 3) real added content lines (ignore whitespace-only/EOL changes)
    nb, nc = norm_lines(bak), norm_lines(cur)
    sm = difflib.SequenceMatcher(a=nb, b=nc, autojunk=False)
    added = []
    for tag, i1, i2, j1, j2 in sm.get_opcodes():
        if tag in ('insert', 'replace'):
            for l in nc[j1:j2]:
                if l: added.append(l)
    added_text = '\n'.join(added)
    print(f'  added/changed content lines: {len(added)}  (~{len(added_text)} chars)')
    # 4) honesty scan on ADDED text only
    for name, rx in [('OWNED-MACHINE', OWNED), ('WE-MACHINE', WE_MACHINE), ('CERT-OVERCLAIM', CERT),
                     ('CERT-OVERCLAIM2', CERT2), ('BORDER', BORDER), ('HYPE', HYPE)]:
        hits = rx.findall(added_text)
        if hits:
            print(f'  *** {name} in ADDED text: {hits[:5]}')
            total_problems += 1
    # show first few added lines for eyeball
    for l in added[:4]:
        print('     + ' + (l[:140]))

print('\n' + '='*50)
print('TOTAL structural/honesty problems on ADDED content:', total_problems)
