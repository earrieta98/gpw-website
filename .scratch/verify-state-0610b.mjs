import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const SKIP = new Set(['.git', '.scratch', 'node_modules']);

function walk(dir, test, acc = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP.has(e.name)) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, test, acc);
    else if (test(e.name)) acc.push(p);
  }
  return acc;
}

const htmlFiles = walk(ROOT, (n) => n.endsWith('.html'));
const cssFiles = walk(path.join(ROOT, 'css'), (n) => n.endsWith('.css'));

// resolve a referenced path (from a given file's dir) to an on-disk absolute path
function resolveRef(ref, fromFile) {
  let r = ref.split('#')[0].split('?')[0];
  if (!r) return null;
  if (/^(https?:)?\/\//i.test(ref)) {
    // absolute URL: only resolve our own domain
    const m = ref.match(/^https?:\/\/gpw-solutions\.com(\/.*)$/i) || ref.match(/^https?:\/\/www\.gpw-solutions\.com(\/.*)$/i);
    if (!m) return null; // external
    r = m[1];
  }
  if (r.startsWith('mailto:') || r.startsWith('tel:') || r.startsWith('data:')) return null;
  let abs;
  if (r.startsWith('/')) abs = path.join(ROOT, r.slice(1));
  else abs = path.resolve(path.dirname(fromFile), r);
  if (abs.endsWith(path.sep) || r.endsWith('/')) abs = path.join(abs, 'index.html');
  return abs;
}

const assetExt = /\.(css|js|jpe?g|png|webp|svg|ico|woff2?)$/i;
const imgExt = /\.(jpe?g|png|webp|svg)$/i;

const broken = [];
const referencedImages = new Set();
const ogImages = [];

function record(ref, fromFile) {
  if (!ref || ref.startsWith('#') || /^(mailto|tel|data):/.test(ref)) return;
  if (!assetExt.test(ref.split('#')[0].split('?')[0])) return; // only assets
  const abs = resolveRef(ref, fromFile);
  if (!abs) return; // external / non-local
  if (!fs.existsSync(abs)) broken.push({ from: path.relative(ROOT, fromFile), ref });
  if (imgExt.test(abs)) referencedImages.add(path.relative(ROOT, abs).replace(/\\/g, '/'));
}

for (const f of htmlFiles) {
  const h = fs.readFileSync(f, 'utf8');
  // href/src
  for (const m of h.matchAll(/(?:href|src)\s*=\s*"([^"]+)"/gi)) record(m[1], f);
  // srcset
  for (const m of h.matchAll(/srcset\s*=\s*"([^"]+)"/gi)) {
    for (const part of m[1].split(',')) record(part.trim().split(/\s+/)[0], f);
  }
  // og:image / twitter:image
  for (const m of h.matchAll(/<meta[^>]+(?:property|name)\s*=\s*"(?:og:image|twitter:image)"[^>]+content\s*=\s*"([^"]+)"/gi)) {
    record(m[1], f); ogImages.push({ from: path.relative(ROOT, f), url: m[1] });
  }
}
for (const f of cssFiles) {
  const c = fs.readFileSync(f, 'utf8');
  for (const m of c.matchAll(/url\(\s*['"]?([^'")]+)['"]?\s*\)/gi)) {
    if (m[1].startsWith('data:')) continue;
    record(m[1], f);
  }
}

// orphan image files: on disk under img/ but never referenced
const diskImages = walk(path.join(ROOT, 'img'), (n) => imgExt.test(n))
  .map((p) => path.relative(ROOT, p).replace(/\\/g, '/'));
const orphans = diskImages.filter((d) => !referencedImages.has(d) && !/_placeholder/.test(d));

// og:image extension check (policy: og cards stay .jpg, NOT webp)
const ogWebp = ogImages.filter((o) => /\.webp/i.test(o.url));

console.log('=== ASSET INTEGRITY (current state, post-WebP) ===');
console.log('HTML pages:', htmlFiles.length, '| CSS:', cssFiles.length);
console.log('Broken references:', broken.length);
broken.forEach((b) => console.log('  BROKEN:', b.from, '->', b.ref));
console.log('\n=== OG:IMAGE POLICY (must be .jpg, never .webp — LinkedIn) ===');
console.log('og:image tags total:', ogImages.length, '| og pointing to .webp:', ogWebp.length);
ogWebp.forEach((o) => console.log('  OG-WEBP:', o.from, '->', o.url));
console.log('\n=== ORPHAN IMAGE FILES (on disk, unreferenced — cleanup candidates) ===');
console.log('orphans:', orphans.length);
orphans.forEach((o) => console.log('  ORPHAN:', o));
console.log('\n=== referenced image breakdown by ext ===');
const byExt = {};
[...referencedImages].forEach((r) => { const e = r.match(imgExt)[1].toLowerCase(); byExt[e] = (byExt[e] || 0) + 1; });
console.log(byExt);
