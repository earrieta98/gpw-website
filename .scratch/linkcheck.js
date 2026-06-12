const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();

// The 36 live pages (exclude .scratch)
function walk(dir, acc) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name === '.scratch' || e.name === 'node_modules' || e.name === '.git') continue;
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walk(full, acc);
    else if (e.name.endsWith('.html')) acc.push(full);
  }
  return acc;
}

const pages = walk(ROOT, []).sort();
// Build a set of existing files on disk (relative, forward-slash)
function rel(p) { return path.relative(ROOT, p).split(path.sep).join('/'); }
const existing = new Set();
(function walkAll(dir){
  for (const e of fs.readdirSync(dir,{withFileTypes:true})){
    if (e.name==='.scratch'||e.name==='node_modules'||e.name==='.git') continue;
    const full=path.join(dir,e.name);
    if (e.isDirectory()) walkAll(full); else existing.add(rel(full).toLowerCase());
  }
})(ROOT);

// .htaccess 301 source patterns (regex source -> dest) — for links-to-redirect detection
const redirects = [
  { re: /^ems\/request-quote\.html$/, dest: '/request-a-quote/' },
  { re: /^ems\/industries\/aerospace\.html$/, dest: '/industries/aerospace-defense/' },
  { re: /^ems\/industries\/ai-server-rack\.html$/, dest: '/industries/ai-server-rack/' },
  { re: /^ems\/industries\/appliances-white-goods\.html$/, dest: '/industries/appliances/' },
  { re: /^ems\/industries\/automotive\.html$/, dest: '/industries/automotive/' },
  { re: /^ems\/industries\/energy\.html$/, dest: '/industries/energy/' },
  { re: /^ems\/industries\/industrial-equipment\.html$/, dest: '/industries/industrial-equipment/' },
  { re: /^ems\/industries\/medical-devices\.html$/, dest: '/industries/medical-devices/' },
  { re: /^ems\/industries\/telecom-hardware\.html$/, dest: '/industries/telecom/' },
  { re: /^ems\/about\.html$/, dest: '/about.html' },
  { re: /^ems\/services\/?(index\.html)?$/, dest: '/ems/' },
];
// 404 RedirectMatch
const force404 = [ /^tests\//, /^quality\// ];

function lineOf(content, idx){ return content.slice(0,idx).split('\n').length; }

const broken=[], toRedirect=[], dangling=[], quality=[];
const reachable = new Set(); // pages reachable via links from home or any page
const allLinks = [];

for (const file of pages) {
  const content = fs.readFileSync(file, 'utf8');
  const pageRel = rel(file);
  const pageDir = path.dirname(file);
  // gather ids on this page for fragment check
  const ids = new Set();
  let m; const idRe = /\bid\s*=\s*["']([^"']+)["']/g;
  while ((m = idRe.exec(content))) ids.add(m[1]);

  const aRe = /<a\b[^>]*?\bhref\s*=\s*["']([^"']*)["']/gi;
  while ((m = aRe.exec(content))) {
    const href = m[1];
    const line = lineOf(content, m.index);
    if (!href) continue;
    if (/^(https?:)?\/\//i.test(href)) continue; // external
    if (/^(mailto:|tel:|javascript:|data:)/i.test(href)) continue;
    allLinks.push({pageRel, line, href});

    // Fragment-only
    if (href.startsWith('#')) {
      const frag = href.slice(1);
      if (frag && !ids.has(frag)) dangling.push({pageRel, line, href, frag});
      continue;
    }
    // Split off fragment / query
    let [pathPart, frag] = href.split('#');
    pathPart = pathPart.split('?')[0];
    if (pathPart === '') { // pure #frag handled above, but href like "?x#y" -> same page
      if (frag && !ids.has(frag)) dangling.push({pageRel, line, href, frag});
      continue;
    }

    // Resolve to disk path
    let targetUrlPath; // url-style path relative to ROOT
    if (pathPart.startsWith('/')) {
      targetUrlPath = pathPart.slice(1);
    } else {
      // relative to page dir
      const abs = path.resolve(pageDir, pathPart);
      targetUrlPath = rel(abs);
    }
    // Normalize: trailing slash or dir -> index.html
    let diskRel = targetUrlPath;
    if (diskRel === '' || diskRel.endsWith('/')) {
      diskRel = (diskRel + 'index.html');
    } else {
      // if it maps to a directory on disk (no extension and dir exists)
      const onDisk = path.join(ROOT, diskRel);
      if (!path.extname(diskRel)) {
        if (existing.has((diskRel+'/index.html').toLowerCase())) diskRel = diskRel + '/index.html';
      }
    }
    diskRel = diskRel.replace(/\/+/g,'/');

    // Check .htaccess forced 404 (quality, tests)
    const urlForHtaccess = targetUrlPath.replace(/^\//,'');
    if (force404.some(r=>r.test(urlForHtaccess))) {
      quality.push({pageRel, line, href, target: diskRel});
      continue;
    }
    // Check redirect
    const redir = redirects.find(r=>r.re.test(urlForHtaccess));
    if (redir) {
      toRedirect.push({pageRel, line, href, dest: redir.dest, target: diskRel});
      // still resolves so not broken
      reachable.add(diskRel.toLowerCase());
      continue;
    }

    // Existence check
    if (existing.has(diskRel.toLowerCase())) {
      reachable.add(diskRel.toLowerCase());
      // fragment cross-page check (best effort, only if same target loaded) - skip cross-page frag
    } else {
      broken.push({pageRel, line, href, target: diskRel});
    }
  }
}

// Orphans: live pages not in reachable set (and not index.html home)
const livePagesRel = pages.map(p=>rel(p).toLowerCase());
const orphans = livePagesRel.filter(p => p!=='index.html' && !reachable.has(p));

console.log('=== LIVE PAGES:', pages.length, '===');
console.log('=== TOTAL INTERNAL LINKS:', allLinks.length, '===\n');

console.log('### BROKEN ('+broken.length+') ###');
broken.forEach(b=>console.log(`${b.pageRel}:${b.line}  href="${b.href}"  -> MISSING ${b.target}`));

console.log('\n### LINKS TO /quality/ (404 in prod) ('+quality.length+') ###');
quality.forEach(b=>console.log(`${b.pageRel}:${b.line}  href="${b.href}"`));

console.log('\n### LINKS TO REDIRECT ('+toRedirect.length+') ###');
toRedirect.forEach(b=>console.log(`${b.pageRel}:${b.line}  href="${b.href}"  -> 301 ${b.dest}`));

console.log('\n### DANGLING #FRAGMENTS ('+dangling.length+') ###');
dangling.forEach(b=>console.log(`${b.pageRel}:${b.line}  href="${b.href}" (no id="${b.frag}")`));

console.log('\n### ORPHANS (not reached by any internal link) ('+orphans.length+') ###');
orphans.forEach(o=>console.log(o));

console.log('\n### 404.html exists:', existing.has('404.html'));
