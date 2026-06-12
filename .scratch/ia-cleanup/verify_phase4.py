# -*- coding: utf-8 -*-
import re, json, os, glob
ok = True
SERVICES = ['box-build-assembly','cable-harness-assembly','enclosure-cabinet-assembly','system-integration','testing-inspection']

print('=== hub file removed from served tree? ===')
print('  ems/services/index.html exists:', os.path.exists('ems/services/index.html'), '(expect False)')
ok = ok and not os.path.exists('ems/services/index.html')

print('=== breadcrumb HTML + JSON-LD on the 5 service pages ===')
for s in SERVICES:
    t = open(f'ems/services/{s}.html', encoding='utf-8').read()
    nav = re.search(r'<nav[^>]*breadcrumb.*?</nav>', t, re.I | re.S).group(0)
    links = [re.sub(r'<[^>]+>', '', x).strip() for x in re.findall(r'class="breadcrumb__link">(.*?)</a>', nav, re.S)]
    cur = re.findall(r'class="breadcrumb__current"[^>]*>(.*?)</span>', nav, re.S)
    ld = [m for m in re.findall(r'<script[^>]*ld\+json[^>]*>(.*?)</script>', t, re.S) if 'BreadcrumbList' in m][0]
    j = json.loads(ld)
    items = [(it['position'], it['name']) for it in j['itemListElement']]
    urls = [it['item'] for it in j['itemListElement']]
    has_hub = any(u.endswith('/ems/services/') for u in urls)
    good = (links == ['GPW Corporate', 'EMS Assembly'] and len(items) == 3
            and items[0] == (1, 'GPW Corporate') and items[1] == (2, 'EMS Assembly')
            and items[2][0] == 3 and not has_hub and 'Services' not in [n for _, n in items])
    ok = ok and good
    print(f'  {s:30s} html={links}+{cur} ld={items} {"OK" if good else "FAIL"}')

print('=== /ems/ FAQPage JSON-LD valid + 8 questions ===')
t = open('ems/index.html', encoding='utf-8').read()
faq = [m for m in re.findall(r'<script[^>]*ld\+json[^>]*>(.*?)</script>', t, re.S) if 'FAQPage' in m][0]
j = json.loads(faq)            # raises if invalid JSON
qs = [q['name'] for q in j['mainEntity']]
print('  parses OK, questions:', len(qs))
for q in qs: print('    -', q)
new = {'Can GPW handle projects that require multiple services?', 'How does GPW quote an assembly project?'}
ok = ok and len(qs) == 8 and new <= set(qs)

# also: visible FAQ <details> count should be 8
vis = t.count('class="faq-item__question"')
print('  visible faq-item count:', vis, '(expect 8)')
ok = ok and vis == 8

print('=== selection matrix rescued into /ems/ ===')
sel = ('id="selection"' in t) and ('guide-table' in t) and ('Which Services Does Your Project' in t)
css = open('css/ems-home.css', encoding='utf-8').read()
css_ok = '.selection-guide' in css and '.guide-table table' in css
print('  section+table in /ems/:', sel, ' | CSS in ems-home.css:', css_ok)
ok = ok and sel and css_ok

print('=== .htaccess 301 ===')
ht = open('.htaccess', encoding='utf-8').read()
ht_line = [l for l in ht.splitlines() if 'ems/services' in l]
ht_ok = any('/ems/' in l and '301' in l for l in ht_line)
print('  rule:', ht_line, '->', 'OK' if ht_ok else 'FAIL')
ok = ok and ht_ok

print('=== sitemap ===')
sm = open('sitemap.xml', encoding='utf-8').read()
sm_ok = '<loc>https://gpw-solutions.com/ems/services/</loc>' not in sm and all(f'/ems/services/{s}.html' in sm for s in SERVICES)
print('  bare hub removed + 5 service pages kept:', sm_ok)
ok = ok and sm_ok

print('=== 0 live <a> links to /ems/services/ (bare hub) anywhere ===')
hits = []
for p in glob.glob('**/*.html', recursive=True):
    if '.scratch' in p or '/img/' in p: continue
    txt = open(p, encoding='utf-8', errors='replace').read()
    for href in re.findall(r'<a\b[^>]*href="([^"]*)"', txt):
        h = href.split('#')[0].split('?')[0]
        # resolve relative + absolute forms to the hub
        if h in ('/ems/services/', '/ems/services') or h == './' and p.startswith('ems/services/'):
            hits.append((p, href))
print('  live links to bare hub:', len(hits), hits[:6])
ok = ok and len(hits) == 0

print()
print('RESULT:', 'PASS' if ok else 'FAIL')
