const { chromium } = require('playwright');
const { pathToFileURL } = require('url');
const path = require('path');
const fs = require('fs');

const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(__dirname, 'header-slim-verify');
fs.mkdirSync(OUT, { recursive: true });

const PAGES = [
  ['home', 'index.html'],
  ['ai-server-rack', 'industries/ai-server-rack/index.html'],
  ['ems-service', 'ems/services/box-build-assembly.html'],
  ['cm-industry', 'contract-manufacturing/medical-devices/index.html'],
  ['cm-home', 'contract-manufacturing/index.html'],
];

const VIEWPORTS = [
  ['desktop', { width: 1366, height: 768 }],
  ['mobile', { width: 390, height: 844 }],
];

async function measure(page) {
  return await page.evaluate(() => {
    const ub = document.querySelector('.utility-bar');
    const h = document.getElementById('header');
    const hr = h ? h.getBoundingClientRect() : null;
    const logo = document.querySelector('.header__logo img');
    const lr = logo ? logo.getBoundingClientRect() : null;
    // first visible heading in the hero / main
    const heading = document.querySelector('main h1, .hero h1, [class*="hero"] h1, h1');
    const hdr = heading ? heading.getBoundingClientRect() : null;
    const cs = h ? getComputedStyle(h) : null;
    return {
      utilityBarPresent: !!ub,
      headerHeight: hr ? Math.round(hr.height) : null,
      headerTop: hr ? Math.round(hr.top) : null,
      headerPosition: cs ? cs.position : null,
      logoHeight: lr ? Math.round(lr.height) : null,
      headerBottom: hr ? Math.round(hr.bottom) : null,
      firstHeadingTop: hdr ? Math.round(hdr.top) : null,
      headingClipped: (hr && hdr) ? (hdr.top < hr.bottom - 1) : null,
    };
  });
}

(async () => {
  const browser = await chromium.launch();
  const results = [];
  for (const [vpName, vp] of VIEWPORTS) {
    const ctx = await browser.newContext({ viewport: vp, deviceScaleFactor: 1, isMobile: vpName === 'mobile' });
    for (const [name, rel] of PAGES) {
      const page = await ctx.newPage();
      const url = pathToFileURL(path.join(ROOT, rel)).href;
      await page.goto(url, { waitUntil: 'networkidle' }).catch(() => {});
      await page.waitForTimeout(250);
      const top = await measure(page);
      await page.screenshot({ path: path.join(OUT, `${name}-${vpName}-top.png`) });
      // scrolled state (solid header)
      await page.evaluate(() => window.scrollTo(0, 600));
      await page.waitForTimeout(300);
      const scrolled = await measure(page);
      await page.screenshot({ path: path.join(OUT, `${name}-${vpName}-scrolled.png`) });
      results.push({ page: name, vp: vpName, top, scrolled });
      await page.close();
    }
    await ctx.close();
  }
  await browser.close();

  for (const r of results) {
    const t = r.top, s = r.scrolled;
    console.log(
      `${r.page.padEnd(16)} ${r.vp.padEnd(8)} ` +
      `UB:${t.utilityBarPresent ? 'PRESENT!!' : 'gone'} ` +
      `hdr:${t.headerHeight}px@top${t.headerTop} pos:${t.headerPosition} logo:${t.logoHeight}px ` +
      `| scrolled hdr:${s.headerHeight}px@top${s.headerTop} ` +
      `| h1Top(top):${t.firstHeadingTop} clipped:${t.headingClipped}`
    );
  }
  fs.writeFileSync(path.join(OUT, 'results.json'), JSON.stringify(results, null, 2));
  console.log('\nScreenshots + results.json in', OUT);
})();
