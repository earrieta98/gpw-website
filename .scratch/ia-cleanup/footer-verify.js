// Visual + structural verify of the canonical footer over http.server (root-absolute paths).
const PW = 'C:\\Users\\earri\\OneDrive\\Desktop\\GLOBAL PRECISION WORKS\\08_Pagina Web\\node_modules\\playwright';
const { chromium } = require(PW);
const fs = require('fs');
const path = require('path');

const BASE = 'http://localhost:8181';
const OUT = path.join(__dirname, 'footer-shots');
fs.mkdirSync(OUT, { recursive: true });

const PAGES = [
  ['/', 'home'],
  ['/contract-manufacturing/cnc-milling/', 'cnc-milling'],
  ['/industries/electronics/', 'electronics'],     // one of the 4 rescued pages
  ['/ems/services/box-build-assembly.html', 'box-build'],
  ['/about.html', 'about'],
];
const MUST = ['/contract-manufacturing/metals/', '/contract-manufacturing/plastics/',
              '/industries/electronics/', '/industries/oil-gas/'];

(async () => {
  const browser = await chromium.launch();
  let fail = 0;
  for (const [vw, vh, tag] of [[1280, 900, 'desktop'], [390, 844, 'mobile']]) {
    const ctx = await browser.newContext({ viewport: { width: vw, height: vh } });
    const page = await ctx.newPage();
    for (const [url, name] of PAGES) {
      await page.goto(BASE + url, { waitUntil: 'networkidle' });
      // scroll footer into view so the lazy-loaded logo actually fetches, then WAIT for it
      await page.evaluate(() => document.querySelector('footer.footer .footer__logo img').scrollIntoView());
      let logoLoaded = true;
      try {
        await page.waitForFunction(() => {
          const i = document.querySelector('footer.footer .footer__logo img');
          return i && i.complete && i.naturalWidth > 0;
        }, { timeout: 4000 });
      } catch (e) { logoLoaded = false; }
      const r = await page.evaluate((must) => {
        const f = document.querySelector('footer.footer');
        if (!f) return { ok: false, why: 'no footer' };
        const grid = f.querySelector('.footer__grid');
        const cols = grid ? grid.children.length : 0;
        const img = f.querySelector('.footer__logo img');
        const logoOk = img ? (img.complete && img.naturalWidth > 0) : false;
        const hrefs = [...f.querySelectorAll('a[href]')].map(a => a.getAttribute('href'));
        const missing = must.filter(m => !hrefs.includes(m));
        // any link that is NOT root-absolute / mailto / http (i.e. relative drift)?
        const rel = hrefs.filter(h => !/^(\/|mailto:|https?:|tel:)/.test(h));
        // grid actually laid out in N visual columns (distinct offsetLeft of children)?
        const xs = grid ? [...grid.children].map(c => c.offsetLeft) : [];
        const distinctCols = new Set(xs).size;
        const fb = f.getBoundingClientRect();
        const overflow = fb.right > window.innerWidth + 1 || fb.left < -1;
        return { ok: missing.length === 0 && logoOk && rel.length === 0 && !overflow,
                 cols, distinctCols, logoOk, missing, rel, overflow };
      }, MUST);
      const status = r.ok ? 'PASS' : 'FAIL';
      if (!r.ok) fail++;
      console.log(`[${tag}] ${name.padEnd(12)} ${status}  grid-children=${r.cols} visual-cols=${r.distinctCols} logo=${r.logoOk} missing=${JSON.stringify(r.missing)} relDrift=${JSON.stringify(r.rel)} overflow=${r.overflow}`);
      const foot = await page.$('footer.footer');
      if (foot) await foot.screenshot({ path: path.join(OUT, `${name}-${tag}.png`) });
    }
    await ctx.close();
  }
  await browser.close();
  console.log(fail === 0 ? '\nALL VISUAL CHECKS PASS' : `\n${fail} CHECK(S) FAILED`);
  process.exit(fail === 0 ? 0 : 1);
})();
