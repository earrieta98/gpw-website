#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Issue #02 — Unified Global Nav (Keller) cascade.
Deterministically replaces the old utility-bar + header on every production
page with the approved Keller block extracted verbatim from nav-preview.html,
adjusting only the relative-path prefix per page depth. Also ensures each page
loads utility-bar.css + global-nav.css. Backs up every file first.
"""
import os, re, glob, shutil, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))  # 08_Pagina Web
SITE = os.path.join(ROOT, "05-website")
BACKUP = os.path.join(ROOT, ".scratch", "nav-cascade-backup")
REF = os.path.join(SITE, "nav-preview.html")
EXCLUDE = {"nav-preview.html", "refresh-preview.html", "screenshot-review.html"}

def read(p):
    with open(p, "r", encoding="utf-8", newline="") as f:
        return f.read()

def write(p, s):
    with open(p, "w", encoding="utf-8", newline="") as f:
        f.write(s)

# --- 1. Extract the approved block (depth-0) from nav-preview.html ----------
ref = read(REF)
m = re.search(r"<!-- =+ UTILITY BAR.*?</header>", ref, re.S)
if not m:
    print("FATAL: could not extract block from nav-preview.html"); sys.exit(1)
BLOCK0 = m.group(0)
# nav-preview.html newline style for the block
BLOCK_NL = "\r\n" if "\r\n" in BLOCK0 else "\n"

def reprefix(block, prefix):
    def repl(mm):
        attr, val = mm.group(1), mm.group(3)
        if val == "./":
            newv = prefix if prefix else "./"
        elif re.match(r"^(https?:|mailto:|tel:|#|/|data:)", val):
            newv = val
        else:
            newv = prefix + val
        return f'{attr}="{newv}"'
    return re.sub(r'(href|src)=(")([^"]*)"', repl, block)

# --- 2. Gather target files -------------------------------------------------
targets = []
for p in glob.glob(os.path.join(SITE, "**", "*.html"), recursive=True):
    if os.path.basename(p) in EXCLUDE:
        continue
    targets.append(p)
targets.sort()

print(f"Targets: {len(targets)} html files\n")

report = []
warnings = []

for p in targets:
    rel = os.path.relpath(p, SITE)
    s = read(p)
    file_nl = "\r\n" if "\r\n" in s else "\n"

    # backup
    bpath = os.path.join(BACKUP, rel)
    os.makedirs(os.path.dirname(bpath), exist_ok=True)
    shutil.copy2(p, bpath)

    # derive prefix from the styles.css link
    sm = re.search(r'(?:href|src)="([^"]*)css/styles\.css"', s)
    prefix = sm.group(1) if sm else ""

    # build the block for this depth, matching the file's newline style
    block = reprefix(BLOCK0, prefix)
    if file_nl != BLOCK_NL:
        block = block.replace(BLOCK_NL, file_nl)

    # --- locate the old span: utility-bar (or header) .. first </header> ----
    had_ub = '<div class="utility-bar"' in s
    if had_ub:
        start = s.index('<div class="utility-bar"')
    else:
        hm = re.search(r"<header[ >]", s)
        if not hm:
            warnings.append(f"{rel}: NO <header> found — SKIPPED")
            report.append((rel, prefix, "SKIP-no-header"))
            continue
        start = hm.start()
    # extend start back over an immediately-preceding HTML comment + whitespace
    pre = s[:start]
    cm = re.search(r"<!--(?:(?!-->).)*-->\s*$", pre, re.S)
    if cm:
        start = cm.start()

    hend = s.find("</header>", start)
    if hend == -1:
        warnings.append(f"{rel}: <header> start found but NO </header> — SKIPPED")
        report.append((rel, prefix, "SKIP-no-/header"))
        continue
    end = hend + len("</header>")

    # sanity: exactly one </header> in the file?
    n_headers = s.count("</header>")
    if n_headers != 1:
        warnings.append(f"{rel}: found {n_headers} </header> tags (expected 1) — using FIRST")

    new = s[:start] + block + s[end:]

    # --- ensure CSS links: utility-bar.css then global-nav.css -------------
    added = []
    if "css/global-nav.css" not in new:
        if "css/utility-bar.css" not in new:
            new, n = re.subn(
                r'(<link[^>]*?(?:href|src)="[^"]*css/styles\.css"[^>]*>)',
                r'\1' + file_nl + '  <link rel="stylesheet" href="' + prefix + 'css/utility-bar.css">',
                new, count=1)
            if n: added.append("utility-bar.css")
        new, n = re.subn(
            r'(<link[^>]*?(?:href|src)="[^"]*css/utility-bar\.css"[^>]*>)',
            r'\1' + file_nl + '  <link rel="stylesheet" href="' + prefix + 'css/global-nav.css">',
            new, count=1)
        if n:
            added.append("global-nav.css")
        else:
            warnings.append(f"{rel}: could NOT insert global-nav.css link (no utility-bar.css link anchor)")

    write(p, new)
    report.append((rel, repr(prefix), ("ub" if had_ub else "NO-ub") + (" +" + ",".join(added) if added else "")))

# --- 3. Report --------------------------------------------------------------
print("rel".ljust(56), "prefix".ljust(10), "notes")
print("-" * 90)
for rel, prefix, notes in report:
    print(rel.ljust(56), str(prefix).ljust(10), notes)

print(f"\nProcessed: {len([r for r in report if not r[2].startswith('SKIP')])}/{len(targets)}")
print(f"Backup at: {BACKUP}")
if warnings:
    print("\n=== WARNINGS ===")
    for w in warnings:
        print(" -", w)
else:
    print("\nNo warnings.")
