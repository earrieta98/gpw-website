// Read-only asset/link integrity check for GPW static site.
// Scans all 36 live HTML pages (excluding .scratch) + all CSS in /css.
// Extracts local refs (link href, script src, img src/srcset, favicon, og:image, CSS url())
// and resolves each to disk. Reports broken refs.

import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const SCRATCH = path.join(ROOT, '.scratch');

function walk(dir, filterExt) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      // Skip .scratch entirely (backups)
      if (full === SCRATCH) continue;
      out.push(...walk(full, filterExt));
    } else if (entry.isFile() && full.toLowerCase().endsWith(filterExt)) {
      out.push(full);
    }
  }
  return out;
}

const htmlFiles = walk(ROOT, '.html').sort();
const cssFiles = walk(path.join(ROOT, 'css'), '.css').sort();

// ---- ref extraction helpers ----
function isExternalOrIgnorable(url) {
  if (!url) return true;
  const u = url.trim();
  if (u === '') return true;
  if (/^(https?:)?\/\//i.test(u)) return true;     // absolute external
  if (/^(mailto:|tel:|javascript:|data:|#)/i.test(u)) return true;
  return false;
}

// strip query/hash for filesystem resolution
function cleanRefPath(url) {
  let u = url.trim();
  u = u.split('#')[0].split('?')[0];
  return u;
}

// Resolve a local ref relative to the file that contains it. Root-absolute (/foo) => site root.
function resolveRef(containingFile, ref) {
  const clean = cleanRefPath(ref);
  if (clean === '') return null;
  let target;
  if (clean.startsWith('/')) {
    target = path.join(ROOT, clean.slice(1));
  } else {
    target = path.resolve(path.dirname(containingFile), clean);
  }
  return target;
}

const broken = [];     // {file, ref, resolved}
const allRefs = [];    // {file, ref, type}

function recordRef(file, ref, type) {
  if (isExternalOrIgnorable(ref)) return;
  const clean = cleanRefPath(ref);
  if (clean === '') return;
  allRefs.push({ file, ref, type });
  const resolved = resolveRef(file, ref);
  if (resolved === null) return;
  // A directory ref (ends with /) -> check for index.html
  let ok = false;
  if (fs.existsSync(resolved)) {
    const st = fs.statSync(resolved);
    if (st.isDirectory()) {
      ok = fs.existsSync(path.join(resolved, 'index.html'));
    } else {
      ok = true;
    }
  }
  if (!ok) {
    broken.push({ file: path.relative(ROOT, file), ref, resolved: path.relative(ROOT, resolved), type });
  }
}

// ---- HTML parsing ----
const attrPatterns = [
  // <link ... href="...">
  { re: /<link\b[^>]*?\shref\s*=\s*["']([^"']+)["'][^>]*>/gi, type: 'link-href' },
  // <script ... src="...">
  { re: /<script\b[^>]*?\ssrc\s*=\s*["']([^"']+)["'][^>]*>/gi, type: 'script-src' },
  // <img ... src="...">
  { re: /<img\b[^>]*?\ssrc\s*=\s*["']([^"']+)["'][^>]*>/gi, type: 'img-src' },
  // <source ... src="..."> (audio/video)
  { re: /<source\b[^>]*?\ssrc\s*=\s*["']([^"']+)["'][^>]*>/gi, type: 'source-src' },
  // og:image / twitter:image  <meta property="og:image" content="...">
  { re: /<meta\b[^>]*?(?:property|name)\s*=\s*["'](?:og:image|twitter:image)["'][^>]*?\scontent\s*=\s*["']([^"']+)["'][^>]*>/gi, type: 'og:image' },
  // also handle content-first ordering for og:image
  { re: /<meta\b[^>]*?\scontent\s*=\s*["']([^"']+)["'][^>]*?(?:property|name)\s*=\s*["'](?:og:image|twitter:image)["'][^>]*>/gi, type: 'og:image' },
];

// srcset can hold multiple "url 1x, url 2x" entries; appears on <img> and <source>
const srcsetRe = /<(?:img|source)\b[^>]*?\ssrcset\s*=\s*["']([^"']+)["'][^>]*>/gi;
// preload/imagesrcset
const imagesrcsetRe = /<link\b[^>]*?\simagesrcset\s*=\s*["']([^"']+)["'][^>]*>/gi;

function parseHtml(file) {
  const html = fs.readFileSync(file, 'utf8');
  for (const { re, type } of attrPatterns) {
    re.lastIndex = 0;
    let m;
    while ((m = re.exec(html)) !== null) {
      recordRef(file, m[1], type);
    }
  }
  // srcset
  for (const re of [srcsetRe, imagesrcsetRe]) {
    re.lastIndex = 0;
    let m;
    while ((m = re.exec(html)) !== null) {
      const set = m[1];
      for (const part of set.split(',')) {
        const url = part.trim().split(/\s+/)[0];
        recordRef(file, url, 'srcset');
      }
    }
  }
}

// ---- CSS parsing ----
const cssUrlRe = /url\(\s*(['"]?)([^'")]+)\1\s*\)/gi;
function parseCss(file) {
  const css = fs.readFileSync(file, 'utf8');
  let m;
  cssUrlRe.lastIndex = 0;
  while ((m = cssUrlRe.exec(css)) !== null) {
    recordRef(file, m[2], 'css-url');
  }
}

for (const f of htmlFiles) parseHtml(f);
for (const f of cssFiles) parseCss(f);

// ---- Specific deleted/renamed reference checks ----
function grepAllRefs(needle) {
  return allRefs.filter(r => cleanRefPath(r.ref).includes(needle));
}
const deletedChecks = [
  'css/cm-industry.css',
  'img/hero/_placeholder-',
  'img/og/services-hub.jpg',
  'img/tech/cnc-milling-5axis.png',
];
const deletedHits = {};
for (const needle of deletedChecks) {
  deletedHits[needle] = grepAllRefs(needle).map(r => ({ file: path.relative(ROOT, r.file), ref: r.ref }));
}

// ---- cnc-milling-5axis.jpg check ----
const cncMillingPage = path.join(ROOT, 'contract-manufacturing', 'cnc-milling', 'index.html');
let cncJpgReferenced = false;
let cncJpgRefs = [];
if (fs.existsSync(cncMillingPage)) {
  const refsOnPage = allRefs.filter(r => r.file === cncMillingPage && cleanRefPath(r.ref).includes('cnc-milling-5axis.jpg'));
  cncJpgRefs = refsOnPage.map(r => r.ref);
  cncJpgReferenced = refsOnPage.length > 0;
}
const cncJpgFile = path.join(ROOT, 'img', 'tech', 'cnc-milling-5axis.jpg');
const cncJpgExists = fs.existsSync(cncJpgFile);

// ---- mega-menu CSS check in utility-bar.css ----
const utilBar = path.join(ROOT, 'css', 'utility-bar.css');
let megaFull = false, megaBase = false;
if (fs.existsSync(utilBar)) {
  const c = fs.readFileSync(utilBar, 'utf8');
  megaFull = c.includes('.nav__dropdown--mega-full');
  megaBase = c.includes('.nav__mega');
}

// ---- Report ----
console.log('HTML pages scanned:', htmlFiles.length);
console.log('CSS files scanned:', cssFiles.length, '->', cssFiles.map(f=>path.basename(f)).join(', '));
console.log('Total local refs checked:', allRefs.length);
console.log('');
console.log('=== BROKEN REFS ===');
if (broken.length === 0) {
  console.log('NONE');
} else {
  for (const b of broken) {
    console.log(`[${b.type}] ${b.file}  ->  ${b.ref}  (missing: ${b.resolved})`);
  }
}
console.log('');
console.log('=== DELETED/RENAMED REF CHECKS (expect 0 each) ===');
for (const needle of deletedChecks) {
  const hits = deletedHits[needle];
  console.log(`${needle}: ${hits.length} hits` + (hits.length ? ' -> ' + JSON.stringify(hits) : ''));
}
console.log('');
console.log('=== cnc-milling page renamed asset ===');
console.log('References cnc-milling-5axis.jpg:', cncJpgReferenced, cncJpgRefs.length ? JSON.stringify(cncJpgRefs) : '');
console.log('img/tech/cnc-milling-5axis.jpg exists on disk:', cncJpgExists);
console.log('');
console.log('=== mega-menu CSS in css/utility-bar.css ===');
console.log('.nav__dropdown--mega-full present:', megaFull);
console.log('.nav__mega present:', megaBase);
console.log('');

// ---- final verdict object ----
const issues = [];
for (const b of broken) issues.push(`Broken ${b.type}: ${b.file} -> ${b.ref}`);
for (const needle of deletedChecks) {
  for (const h of deletedHits[needle]) issues.push(`Stale ref to deleted ${needle} in ${h.file} (${h.ref})`);
}
if (!cncJpgReferenced) issues.push('cnc-milling/index.html does NOT reference cnc-milling-5axis.jpg');
if (!cncJpgExists) issues.push('img/tech/cnc-milling-5axis.jpg missing on disk');
if (!megaFull) issues.push('css/utility-bar.css missing .nav__dropdown--mega-full (mega-menu broken)');
if (!megaBase) issues.push('css/utility-bar.css missing .nav__mega (mega-menu broken)');

const assetsClean = (broken.length === 0) && megaFull && megaBase &&
  deletedChecks.every(n => deletedHits[n].length === 0);

console.log('=== VERDICT ===');
console.log('assetsClean:', assetsClean);
console.log('ISSUES_JSON:' + JSON.stringify(issues));
