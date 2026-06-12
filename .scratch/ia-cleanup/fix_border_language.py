# -*- coding: utf-8 -*-
"""Reframe all 'border' language in LIVE pages -> nearshore / overland logistics.
Per-file, count-asserted, all-or-nothing. Backs up each touched file first. Read .htaccess rule: feedback_border_language."""
import os, sys, shutil

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
BK = os.path.join(ROOT, '.scratch/ia-cleanup/border-fix-backup-20260609')

# file -> list of (old, new, expected_count)
FIXES = {
 'blog/cnc-cost-mexico-vs-us-2026/index.html': [
   ('cross-border freight', 'overland freight', 1),
   ('Cross-border full truckload shipments', 'Overland full truckload shipments', 1),
   ('land crossing', 'land port', 1),
   ('Cross-border shipping adds', 'Overland shipping adds', 1),
   ('cross-border logistics become routine', 'overland logistics become routine', 1),
   ('cross-border lead times', 'overland lead times', 1),
 ],
 'industries/telecom/index.html': [
   ('preferential tariff treatment on cross-border shipments', 'preferential tariff treatment on shipments into the U.S.', 2),
 ],
 'industries/aerospace-defense/index.html': [
   ('preferential tariff treatment on cross-border shipments', 'preferential tariff treatment on shipments into the U.S.', 2),
 ],
 'industries/energy/index.html': [
   ('preferential tariff treatment on all cross-border shipments', 'preferential tariff treatment on all shipments into the U.S.', 2),
 ],
 'industries/automotive/index.html': [
   ('regional value content calculations required for cross-border shipments', 'regional value content calculations required for shipments into the U.S.', 2),
 ],
 'industries/appliances/index.html': [
   ('supports duty-free cross-border movement', 'supports duty-free movement into the U.S.', 1),
 ],
 'industries/ai-server-rack/index.html': [
   ('cross-border logistics coordination', 'overland logistics coordination', 2),
   ('a clear framework for cross-border manufacturing', 'a clear framework for nearshore manufacturing', 1),
 ],
 'ems/services/index.html': [
   ('150 miles from the U.S. border, 2 hours by road', '150 miles from the U.S., 2 hours by road', 1),
   ('duty-free cross-border shipping', 'duty-free shipping into the U.S.', 1),
 ],
 'ems/services/system-integration.html': [
   ('duty-free border crossing for qualifying products', 'duty-free entry into the U.S. for qualifying products', 1),
 ],
 'ems/services/box-build-assembly.html': [
   ('duty-free border crossing for qualifying products', 'duty-free entry into the U.S. for qualifying products', 1),
   ('duty-free cross-border shipping', 'duty-free shipping into the U.S.', 1),
 ],
 'contract-manufacturing/why-mexico/index.html': [
   ('Laredo and McAllen border crossings &mdash; the two busiest commercial land ports',
    'Laredo and McAllen &mdash; the two busiest commercial land ports', 1),
 ],
}

log, errors, written = [], [], 0
for rel, fixes in FIXES.items():
    full = os.path.join(ROOT, rel)
    txt = open(full, encoding='utf-8').read()
    file_errs = []
    new_txt = txt
    for old, new, exp in fixes:
        n = new_txt.count(old)
        if n != exp:
            file_errs.append(f'  {rel}: "{old[:45]}..." found {n}, expected {exp}')
        else:
            new_txt = new_txt.replace(old, new)
            log.append(f'  {rel}: "{old[:40]}..." -> "{new[:40]}..."  x{n} OK')
    if file_errs:
        errors += file_errs
        continue  # do not write this file
    if new_txt != txt:
        os.makedirs(os.path.dirname(os.path.join(BK, rel)), exist_ok=True)
        shutil.copy2(full, os.path.join(BK, rel))
        open(full, 'w', encoding='utf-8', newline='').write(new_txt)
        written += 1

print('\n'.join(log))
print(f'\nFiles written: {written}/{len(FIXES)}   (backups -> {os.path.relpath(BK, ROOT)})')
if errors:
    print('\n*** MISMATCHES (file NOT written) ***')
    print('\n'.join(errors))
    sys.exit(1)
print('All assertions passed.')
