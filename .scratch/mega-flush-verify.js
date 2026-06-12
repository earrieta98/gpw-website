const { chromium } = require('playwright');
const { pathToFileURL } = require('url');
const path = require('path');
const fs = require('fs');
const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(__dirname, 'mega-flush'); fs.mkdirSync(OUT, { recursive: true });

function openCnc() {
  const cap = document.querySelector('#navMenu .nav__item--capability .nav__dropdown--mega-full');
  if (cap) {
    cap.style.setProperty('opacity','1','important');
    cap.style.setProperty('visibility','visible','important');
    cap.style.setProperty('transform','translateX(-50%) translateY(0)','important');
  }
  const header = document.getElementById('header');
  const hb = header.getBoundingClientRect().bottom;
  const mt = cap.getBoundingClientRect().top;
  return { gap: Math.round(mt - hb), headerBottom: Math.round(hb), megaTop: Math.round(mt) };
}

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1366, height: 768 }, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  await page.goto(pathToFileURL(path.join(ROOT, 'index.html')).href, { waitUntil: 'networkidle' });
  await page.waitForTimeout(250);

  // over-hero state (scroll 0, transparent header)
  const top = await page.evaluate(openCnc);
  await page.waitForTimeout(150);
  await page.screenshot({ path: path.join(OUT, 'cnc-mega-overhero.png'), clip: { x: 0, y: 0, width: 1366, height: 360 } });

  // scrolled state (solid white header)
  await page.evaluate(() => window.scrollTo(0, 700));
  await page.waitForTimeout(300);
  const scrolled = await page.evaluate(openCnc);
  await page.waitForTimeout(150);
  await page.screenshot({ path: path.join(OUT, 'cnc-mega-scrolled.png'), clip: { x: 0, y: 0, width: 1366, height: 360 } });

  await browser.close();
  console.log('over-hero gap:', JSON.stringify(top));
  console.log('scrolled  gap:', JSON.stringify(scrolled));
})();
