/* Header slim — audit 2026-06-08
   1) Remove the <div class="utility-bar"> ... </div> block (depth-aware) from each page.
   2) On Template-A pages (footer__contact-line present), append a LinkedIn link inside
      footer__contact-line so the social link survives the utility-bar removal.
      (Template-B "lean" footers already carry LinkedIn via .footer__contact-item — left untouched.)
   Idempotent: skips removal if no utility bar; skips LinkedIn if one already exists in the footer.
*/
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const list = fs.readFileSync(path.join(__dirname, 'header-slim-backup-20260608', '_targetlist.txt'), 'utf8')
  .split(/\r?\n/).map(s => s.trim()).filter(Boolean);

const LINKEDIN = '<a href="https://www.linkedin.com/company/gpw-solutions" target="_blank" rel="noopener">LinkedIn</a>';

/** Return [start, endExclusive] of the element opening at `openIdx` (index of its '<div'), depth-aware. */
function matchDivBlock(html, openIdx) {
  const re = /<div\b[^>]*>|<\/div>/gi;
  re.lastIndex = openIdx;
  let depth = 0, m;
  while ((m = re.exec(html)) !== null) {
    if (m[0][1] === '/') depth--; else depth++;
    if (depth === 0) return [openIdx, m.index + m[0].length];
  }
  return null;
}

let report = [];
for (const rel of list) {
  const file = path.join(ROOT, rel);
  let html = fs.readFileSync(file, 'utf8');
  const before = html;
  let removedBar = false, addedLinkedIn = false, note = '';

  // ---- 1) remove utility bar ----
  const ubIdx = html.search(/<div\s+class="utility-bar"/i);
  if (ubIdx !== -1) {
    const span = matchDivBlock(html, ubIdx);
    if (span) {
      // also swallow leading indentation on the opening line + the trailing blank line
      let s = ubIdx, e = span[1];
      while (s > 0 && (html[s - 1] === ' ' || html[s - 1] === '\t')) s--;
      html = html.slice(0, s) + html.slice(e);
      html = html.replace(/\n[ \t]*\n[ \t]*\n/g, '\n\n'); // collapse the blank gap left behind
      removedBar = true;
    } else note += 'UB-unmatched ';
  }

  // ---- 2) add LinkedIn to Template-A footer (footer__contact-line) ----
  const hasFooterLinkedIn = /class="footer__contact-item"[^>]*>[\s\S]*?linkedin|footer[\s\S]*?linkedin\.com\/company\/gpw/i.test(html);
  const clIdx = html.search(/<div\s+class="footer__contact-line"/i);
  if (clIdx !== -1 && !hasFooterLinkedIn) {
    const span = matchDivBlock(html, clIdx);
    if (span) {
      const closeStart = html.lastIndexOf('</div>', span[1]);
      // indentation of the closing tag for tidy insertion
      const lineStart = html.lastIndexOf('\n', closeStart) + 1;
      const indent = html.slice(lineStart, closeStart).match(/^[ \t]*/)[0];
      const insertion = '<br>\n' + indent + LINKEDIN + '\n' + indent;
      html = html.slice(0, closeStart) + insertion + html.slice(closeStart);
      addedLinkedIn = true;
    } else note += 'CL-unmatched ';
  } else if (clIdx !== -1 && hasFooterLinkedIn) {
    note += 'LI-already ';
  }

  if (html !== before) fs.writeFileSync(file, html, 'utf8');
  report.push(`${removedBar ? 'BAR' : '---'}  ${addedLinkedIn ? 'LI+' : '   '}  ${note.padEnd(14)} ${rel}`);
}

console.log(report.join('\n'));
console.log(`\nProcessed ${list.length} files.`);
console.log(`Removed utility bar: ${report.filter(r => r.startsWith('BAR')).length}`);
console.log(`Added footer LinkedIn: ${report.filter(r => r.includes('LI+')).length}`);
