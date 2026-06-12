# -*- coding: utf-8 -*-
"""Phase 3 IA cleanup: replace EVERY content page's <footer> with ONE canonical
root-absolute footer (Layout A - sitemap, 5-col). Per-file backup + count
assertions, all-or-nothing. Also bumps .footer__grid 4->5 columns in styles.css.
404.html carries no footer (untouched). Pattern: fix_border_language.py."""
import os, re, sys, shutil, json, hashlib

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))  # 05-website
BK   = os.path.join(ROOT, '.scratch/ia-cleanup/footer-fix-backup-20260609')

# ---- the 36 content pages (site-page class) come straight from the crawler -------
data = json.load(open(os.path.join(ROOT, '.scratch/ia-audit/data.json'), encoding='utf-8'))
SITE_PAGES = data['files_by_class']['site-page']
assert len(SITE_PAGES) == 36, f'expected 36 site-pages, got {len(SITE_PAGES)}'

FOOTER_RE = re.compile(r'<footer\b.*?</footer>', re.I | re.S)

# ---- canonical footer (root-absolute hrefs; footer__links/__heading system) ------
# NOTE: replacement starts at "<footer" (the 2 leading spaces already live in each
# file, outside the regex match) and ends at "  </footer>".
CANONICAL_FOOTER = '''<footer class="footer">
    <div class="container">
      <div class="footer__grid">
        <div class="footer__brand">
          <a href="/" class="footer__logo">
            <img loading="lazy" src="/img/logo-white.png" alt="Global Precision Works" width="300" height="189">
          </a>
          <p class="footer__desc">Global Precision Works &mdash; precision manufacturing and electromechanical assembly from Monterrey, Mexico. Two divisions, one standard of quality.</p>
          <div class="footer__contact">
            <span class="footer__contact-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s-7-5.5-7-11a7 7 0 0 1 14 0c0 5.5-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/></svg>
              Monterrey, Nuevo Le&oacute;n, Mexico
            </span>
            <a href="mailto:sales@gpw-solutions.com" class="footer__contact-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>
              sales@gpw-solutions.com
            </a>
            <a href="https://www.linkedin.com/company/gpw-solutions" target="_blank" rel="noopener" class="footer__contact-item">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.95v5.66H9.35V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43c-1.14 0-2.06-.93-2.06-2.07 0-1.14.93-2.06 2.06-2.06 1.14 0 2.06.93 2.06 2.06 0 1.14-.92 2.07-2.06 2.07zm1.78 13.02H3.55V9h3.57v11.45z"/></svg>
              LinkedIn
            </a>
          </div>
        </div>
        <div>
          <div class="footer__heading">CNC Machining</div>
          <div class="footer__links">
            <a href="/contract-manufacturing/cnc-milling/">CNC Milling</a>
            <a href="/contract-manufacturing/cnc-turning/">CNC Turning</a>
            <a href="/contract-manufacturing/wire-edm/">Wire EDM</a>
            <a href="/contract-manufacturing/sheet-metal/">Sheet Metal</a>
            <a href="/contract-manufacturing/surface-finishing/">Surface Finishing</a>
            <a href="/contract-manufacturing/engineering-support/">Engineering Support</a>
            <a href="/contract-manufacturing/metals/">Metals</a>
            <a href="/contract-manufacturing/plastics/">Plastics</a>
          </div>
        </div>
        <div>
          <div class="footer__heading">Assembly &amp; Integration</div>
          <div class="footer__links">
            <a href="/ems/services/box-build-assembly.html">Box Build</a>
            <a href="/ems/services/cable-harness-assembly.html">Cable &amp; Harness</a>
            <a href="/ems/services/system-integration.html">System Integration</a>
            <a href="/ems/services/testing-inspection.html">Testing &amp; Inspection</a>
            <a href="/ems/services/enclosure-cabinet-assembly.html">Enclosure &amp; Cabinet</a>
          </div>
        </div>
        <div>
          <div class="footer__heading">Industries</div>
          <div class="footer__links">
            <a href="/industries/ai-server-rack/">AI &amp; Server Rack</a>
            <a href="/industries/industrial-equipment/">Industrial Equipment</a>
            <a href="/industries/telecom/">Telecom</a>
            <a href="/industries/medical-devices/">Medical Devices</a>
            <a href="/industries/automotive/">Automotive</a>
            <a href="/industries/aerospace-defense/">Aerospace &amp; Defense</a>
            <a href="/industries/electronics/">Electronics</a>
            <a href="/industries/oil-gas/">Oil &amp; Gas</a>
            <a href="/industries/energy/">Energy</a>
            <a href="/industries/appliances/">Appliances &amp; White Goods</a>
          </div>
        </div>
        <div>
          <div class="footer__heading">Company</div>
          <div class="footer__links">
            <a href="/about.html">About</a>
            <a href="/contact.html">Contact</a>
            <a href="/quality/">Quality</a>
            <a href="/blog/">Insights</a>
            <a href="/contract-manufacturing/why-mexico/">Why Mexico</a>
            <a href="/request-a-quote/">Request a Quote</a>
          </div>
        </div>
      </div>
      <div class="footer__bottom">
        <span>&copy; 2026 Global Precision Works. All rights reserved.</span>
        <div class="footer__legal">
          <a href="/privacy-policy.html">Privacy Policy</a>
          <a href="/terms.html">Terms of Service</a>
        </div>
      </div>
    </div>
  </footer>'''

# ---- the 4 pages that must end up in the footer (Phase 3 objective) --------------
MUST_APPEAR = [
    '/contract-manufacturing/metals/', '/contract-manufacturing/plastics/',
    '/industries/electronics/', '/industries/oil-gas/',
]
for u in MUST_APPEAR:
    assert f'href="{u}"' in CANONICAL_FOOTER, f'canonical footer missing {u}'

# =================================================================================
# 1) replace each page footer
written, errors, skipped = 0, [], []
for rel in SITE_PAGES:
    full = os.path.join(ROOT, rel)
    txt = open(full, encoding='utf-8', errors='strict').read()
    n = len(FOOTER_RE.findall(txt))
    if n != 1:
        errors.append(f'  {rel}: found {n} <footer> blocks, expected exactly 1')
        continue
    new_txt = FOOTER_RE.sub(lambda m: CANONICAL_FOOTER, txt, count=1)
    # verify the substituted footer is byte-identical to canonical
    chk = FOOTER_RE.search(new_txt).group(0)
    if chk != CANONICAL_FOOTER:
        errors.append(f'  {rel}: post-sub footer != canonical')
        continue
    if new_txt == txt:
        skipped.append(rel)          # already canonical (idempotent re-run)
        continue
    os.makedirs(os.path.dirname(os.path.join(BK, rel)), exist_ok=True)
    shutil.copy2(full, os.path.join(BK, rel))
    open(full, 'w', encoding='utf-8', newline='').write(new_txt)
    written += 1

# =================================================================================
# 2) bump .footer__grid 4 -> 5 columns in styles.css (one exact occurrence)
CSS = 'css/styles.css'
css_full = os.path.join(ROOT, CSS)
css = open(css_full, encoding='utf-8').read()
OLD_GRID = 'grid-template-columns: 1.5fr 1fr 1fr 1fr;'
NEW_GRID = 'grid-template-columns: 1.4fr 1fr 1fr 1fr 1fr;'   # brand + 4 link cols
css_n = css.count(OLD_GRID)
css_written = False
if css_n != 1:
    if NEW_GRID in css and css_n == 0:
        skipped.append(CSS + ' (grid already 5-col)')
    else:
        errors.append(f'  {CSS}: "{OLD_GRID}" found {css_n}, expected 1')
else:
    new_css = css.replace(OLD_GRID, NEW_GRID)
    os.makedirs(os.path.dirname(os.path.join(BK, CSS)), exist_ok=True)
    shutil.copy2(css_full, os.path.join(BK, CSS))
    open(css_full, 'w', encoding='utf-8', newline='').write(new_css)
    css_written = True

# =================================================================================
# report
print(f'Footers replaced : {written}/{len(SITE_PAGES)}')
print(f'CSS grid 4->5    : {"OK" if css_written else "skipped/err"}')
if skipped:
    print('Skipped (already canonical):')
    for s in skipped: print('  ', s)
print(f'Backups -> {os.path.relpath(BK, ROOT)}')
if errors:
    print('\n*** MISMATCHES (nothing written for those) ***')
    print('\n'.join(errors))
    sys.exit(1)

# final cross-file identity check: every page footer hashes the same
hashes = {}
for rel in SITE_PAGES:
    txt = open(os.path.join(ROOT, rel), encoding='utf-8').read()
    f = FOOTER_RE.search(txt).group(0)
    hashes.setdefault(hashlib.md5(f.encode()).hexdigest(), []).append(rel)
print(f'\nDistinct footers across {len(SITE_PAGES)} pages: {len(hashes)} (expect 1)')
if len(hashes) != 1:
    for h, ps in hashes.items():
        print(f'  {h[:8]}: {len(ps)} pages e.g. {ps[0]}')
    sys.exit(1)
print('All assertions passed. Footer is byte-identical across all 36 content pages.')
