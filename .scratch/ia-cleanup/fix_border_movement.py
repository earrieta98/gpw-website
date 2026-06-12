# -*- coding: utf-8 -*-
"""Fix the 5 'charged' border-MOVEMENT phrases (user kept proximity 'from the border' anchors).
'crossing/cross the border' -> 'entering/enter the U.S.'  Count-asserted, backed up."""
import os, sys, shutil
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
BK = os.path.join(ROOT, '.scratch/ia-cleanup/border-fix2-backup-20260609')

FIXES = {
 'industries/telecom/index.html': [
   ('preferential tariff treatment for assemblies crossing the border.',
    'preferential tariff treatment for assemblies entering the U.S.', 1)],
 'industries/aerospace-defense/index.html': [
   ('preferential tariff treatment when crossing the border.',
    'preferential tariff treatment when entering the U.S.', 1)],
 'industries/energy/index.html': [
   ('preferential tariff treatment for equipment crossing the border.',
    'preferential tariff treatment for equipment entering the U.S.', 1)],
 'industries/ai-server-rack/index.html': [
   ('finished assemblies cross the border with preferential tariff treatment',
    'finished assemblies enter the U.S. with preferential tariff treatment', 1)],
 'ems/services/enclosure-cabinet-assembly.html': [
   ('qualifying products cross the border duty-free.',
    'qualifying products enter the U.S. duty-free.', 1)],
}

log, errors, written = [], [], 0
for rel, fixes in FIXES.items():
    full = os.path.join(ROOT, rel)
    txt = open(full, encoding='utf-8').read()
    new_txt, ferr = txt, []
    for old, new, exp in fixes:
        n = new_txt.count(old)
        if n != exp: ferr.append(f'  {rel}: "{old[:40]}..." found {n}, expected {exp}')
        else:
            new_txt = new_txt.replace(old, new)
            log.append(f'  {rel}: "...{old[-35:]}" -> "...{new[-30:]}"  OK')
    if ferr: errors += ferr; continue
    if new_txt != txt:
        os.makedirs(os.path.dirname(os.path.join(BK, rel)), exist_ok=True)
        shutil.copy2(full, os.path.join(BK, rel))
        open(full, 'w', encoding='utf-8', newline='').write(new_txt)
        written += 1
print('\n'.join(log))
print(f'\nFiles written: {written}/{len(FIXES)}')
if errors:
    print('\n*** MISMATCHES (not written) ***'); print('\n'.join(errors)); sys.exit(1)
print('All assertions passed.')
