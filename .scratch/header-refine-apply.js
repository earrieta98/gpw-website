/* Header refine — audit 2026-06-08 (founder decisions)
   1) De-dup AI: remove the top-level .nav__feature slot (AI now lives only inside Industries).
   2) Promote AI inside Industries: add a "High demand" badge after the AI mega-card title.
   3) Current-page state: add aria-current="page" to the matching top-level nav link per section.
   Idempotent-ish; safe to skip items already done.
*/
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const list = fs.readFileSync(path.join(__dirname, 'header-slim-backup-20260608', '_targetlist.txt'), 'utf8')
  .split(/\r?\n/).map(s => s.trim()).filter(Boolean);

const BADGE = '<span class="nav__mega-card__badge">High demand</span>';
const AI_TITLE = '<span class="nav__mega-card__title">AI &amp; Server Rack</span>';

// section -> { sig: class signature of the nav link, text: its exact inner text }
function sectionFor(rel) {
  const p = rel.replace(/^\.\//, '');
  if (p.startsWith('contract-manufacturing/')) return { sig: 'nav__link nav__link--has-mega', text: 'CNC Machining' };
  if (p.startsWith('ems/')) return { sig: 'nav__link nav__link--has-mega', text: 'Assembly &amp; Integration' };
  if (p.startsWith('quality/')) return { sig: 'nav__link nav__link--row', text: 'Quality' };
  if (p === 'about.html') return { sig: 'nav__link nav__link--row', text: 'About' };
  if (p === 'contact.html') return { sig: 'nav__link nav__link--row', text: 'Contact' };
  return null;
}
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

let report = [];
for (const rel of list) {
  const file = path.join(ROOT, rel);
  let html = fs.readFileSync(file, 'utf8');
  const before = html;
  let did = [];

  // ---- 1) remove top-level featured AI slot (+ its preceding comment) ----
  if (/class="nav__link nav__feature"/.test(html)) {
    html = html.replace(/\n[ \t]*<!--[^\n]*Featured top-level slot[^\n]*-->/i, '');
    html = html.replace(/\n[ \t]*<a\b[^>]*class="nav__link nav__feature"[^>]*>[\s\S]*?<\/a>/i, '');
    did.push('AI-slot-removed');
  }

  // ---- 2) add "High demand" badge to the AI card (once) ----
  if (html.includes(AI_TITLE) && !html.includes('nav__mega-card__badge')) {
    html = html.replace(AI_TITLE, AI_TITLE + BADGE);
    did.push('badge+');
  }

  // ---- 3) aria-current on the section's nav link ----
  const sec = sectionFor(rel);
  if (sec && !/aria-current="page"/.test(html)) {
    const re = new RegExp(`(<a\\b[^>]*class="${esc(sec.sig)}"[^>]*?)>(${esc(sec.text)})<`, '');
    if (re.test(html)) {
      html = html.replace(re, `$1 aria-current="page">$2<`);
      did.push('aria:' + sec.text.replace('&amp;', '&'));
    } else did.push('aria-NOMATCH:' + sec.text);
  }

  if (html !== before) fs.writeFileSync(file, html, 'utf8');
  report.push(`${(did.join(' ') || '(no change)').padEnd(40)} ${rel}`);
}

console.log(report.join('\n'));
console.log(`\nProcessed ${list.length} files.`);
console.log('AI slot removed:', report.filter(r => r.includes('AI-slot-removed')).length);
console.log('Badge added:    ', report.filter(r => r.includes('badge+')).length);
console.log('aria-current set:', report.filter(r => /aria:[^N]/.test(r)).length);
console.log('aria NOMATCH:   ', report.filter(r => r.includes('NOMATCH')).length);
