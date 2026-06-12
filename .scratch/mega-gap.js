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
  const info = await page.evaluate(() => {
    const header = document.getElementById('header');
    const hb = header.getBoundingClientRect().bottom;
    // force CNC mega open
    const cap = document.querySelector('#navMenu .nav__item--capability .nav__dropdown--mega-full');
    if (cap) {
      cap.style.setProperty('opacity','1','important');
      cap.style.setProperty('visibility','visible','important');
      cap.style.setProperty('transform','translateX(-50%) translateY(0)','important');
    }
    const mr = cap.getBoundingClientRect();
    const cs = getComputedStyle(cap);
    return { headerBottom: Math.round(hb), megaTop: Math.round(mr.top), gapPx: Math.round(mr.top - hb), cssTop: cs.top, radius: cs.borderTopLeftRadius };
  });
  await browser.close();
  console.log(JSON.stringify(info, null, 2));
})();
