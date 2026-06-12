# -*- coding: utf-8 -*-
"""Phase 2 deterministic link fixes (NOT the industry pages — those are the workflow's).

A) 6 CNC service pages: industry pills -> direct /industries/* targets.
   - 4 one-to-one pills: just repoint href.
   - oil-gas-energy pill -> split into Oil & Gas + Energy pills.
   - electronics-telecom pill -> split into Electronics + Telecom pills.
B) 7 EMS files: footer "About EMS Division" -> /about.html, label "About GPW".

Every replacement is count-asserted. Exits non-zero on any mismatch. Prints a full change log.
"""
import os, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
log = []
errors = []

def edit(path, transforms):
    """transforms: list of (desc, fn(text)->(text, n), expected_n)"""
    full = os.path.join(ROOT, path)
    txt = open(full, encoding='utf-8').read()
    orig = txt
    for desc, fn, expected in transforms:
        txt, n = fn(txt)
        status = 'OK' if n == expected else f'MISMATCH (expected {expected})'
        log.append(f'{path}: {desc} -> {n} replacement(s) {status}')
        if n != expected:
            errors.append(f'{path}: {desc}: got {n}, expected {expected}')
    if txt != orig and not errors:
        open(full, 'w', encoding='utf-8', newline='') .write(txt)
    return txt != orig

def sub(pattern, repl, flags=0):
    def fn(text):
        new, n = re.subn(pattern, repl, text, flags=flags)
        return new, n
    return fn

CNC_PAGES = [
    'contract-manufacturing/cnc-milling/index.html',
    'contract-manufacturing/cnc-turning/index.html',
    'contract-manufacturing/wire-edm/index.html',
    'contract-manufacturing/sheet-metal/index.html',
    'contract-manufacturing/surface-finishing/index.html',
    'contract-manufacturing/engineering-support/index.html',
]

ONE_TO_ONE = ['aerospace-defense', 'medical-devices', 'automotive', 'industrial-equipment']

any_changed = False
for page in CNC_PAGES:
    transforms = []
    for slug in ONE_TO_ONE:
        transforms.append((
            f'pill ../{slug}/ -> /industries/{slug}/',
            sub(rf'href="\.\./{slug}/"', f'href="/industries/{slug}/"'),
            1,
        ))
    # split combined pills, preserving indentation and the class attr
    transforms.append((
        'pill ../oil-gas-energy/ -> Oil & Gas + Energy',
        sub(r'([ \t]*)<a href="\.\./oil-gas-energy/"([^>]*)>[^<]*</a>',
            r'\1<a href="/industries/oil-gas/"\2>Oil &amp; Gas</a>\n\1<a href="/industries/energy/"\2>Energy</a>'),
        1,
    ))
    transforms.append((
        'pill ../electronics-telecom/ -> Electronics + Telecom',
        sub(r'([ \t]*)<a href="\.\./electronics-telecom/"([^>]*)>[^<]*</a>',
            r'\1<a href="/industries/electronics/"\2>Electronics</a>\n\1<a href="/industries/telecom/"\2>Telecom</a>'),
        1,
    ))
    changed = edit(page, transforms)
    any_changed = any_changed or changed

# B) EMS footer About links
edit('ems/index.html', [(
    'footer About EMS Division -> /about.html (About GPW)',
    sub(r'<a href="about\.html">About EMS Division</a>',
        '<a href="/about.html">About GPW</a>'),
    1,
)])
for page in ['ems/services/index.html', 'ems/services/box-build-assembly.html',
             'ems/services/cable-harness-assembly.html', 'ems/services/system-integration.html',
             'ems/services/testing-inspection.html', 'ems/services/enclosure-cabinet-assembly.html']:
    edit(page, [(
        'footer About EMS Division -> /about.html (About GPW)',
        sub(r'<a href="\.\./about\.html">About EMS Division</a>',
            '<a href="/about.html">About GPW</a>'),
        1,
    )])

print('\n'.join(log))
if errors:
    print('\n*** ERRORS — NOTHING WRITTEN FOR FAILING FILES ***')
    print('\n'.join(errors))
    sys.exit(1)
print('\nAll assertions passed. Files written.')
