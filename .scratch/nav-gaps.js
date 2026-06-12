const { chromium } = require('playwright');
const { pathToFileURL } = require('url');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1366, height: 768 }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  await page.goto(pathToFileURL(path.join(ROOT, 'index.html')).href, { waitUntil: 'networkidle' });
  await page.waitForTimeout(250);
  const gaps = await page.evaluate(() => {
    const kids = [...document.querySelectorAll('#navMenu > *')];
    const rows = kids.map(el => {
      const lab = el.querySelector('.nav__link, .nav__trigger') || el;
      const r = el.getBoundingClientRect();
      return { t: (lab.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 20), left: r.left, right: r.right };
    }).filter(x => x.t);
    const out = [];
    for (let i = 0; i < rows.length - 1; i++) {
      out.push({ between: rows[i].t + '  →  ' + rows[i + 1].t, gapPx: Math.round(rows[i + 1].left - rows[i].right) });
    }
    return out;
  });
  await browser.close();
  console.log('GAP BETWEEN CONSECUTIVE NAV ITEMS (px):');
  gaps.forEach(g => console.log('  ' + String(g.gapPx).padStart(4) + 'px   ' + g.between));
})();
