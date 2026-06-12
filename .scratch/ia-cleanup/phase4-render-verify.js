const PW = 'C:\\Users\\earri\\OneDrive\\Desktop\\GLOBAL PRECISION WORKS\\08_Pagina Web\\node_modules\\playwright';
const { chromium } = require(PW);
const fs = require('fs'); const path = require('path');
const BASE = 'http://localhost:8181';
const OUT = path.join(__dirname, 'phase4-shots'); fs.mkdirSync(OUT, { recursive: true });

(async () => {
  const browser = await chromium.launch();
  let fail = 0;
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();

  // --- /ems/ : selection matrix + FAQ rendered correctly ---
  await page.goto(BASE + '/ems/', { waitUntil: 'networkidle' });
  const ems = await page.evaluate(() => {
    const sel = document.querySelector('#selection');
    const table = sel && sel.querySelector('.guide-table table');
    const thead = table && table.querySelector('thead');
    const theadBg = thead ? getComputedStyle(thead).backgroundColor : null;
    // teal-ish? not transparent / not white
    const styled = theadBg && theadBg !== 'rgba(0, 0, 0, 0)' && theadBg !== 'rgb(255, 255, 255)';
    const rows = table ? table.querySelectorAll('tbody tr').length : 0;
    const faqItems = document.querySelectorAll('.faq-item').length;
    const sb = sel ? sel.getBoundingClientRect() : null;
    const overflow = sb ? (sb.right > window.innerWidth + 1) : true;
    return { hasSel: !!sel, hasTable: !!table, theadBg, styled, rows, faqItems, overflow };
  });
  const emsOK = ems.hasSel && ems.hasTable && ems.styled && ems.rows === 5 && ems.faqItems === 8 && !ems.overflow;
  if (!emsOK) fail++;
  console.log(`[/ems/] selection=${ems.hasSel} table=${ems.hasTable} theadBg=${ems.theadBg} styled=${ems.styled} rows=${ems.rows} faqItems=${ems.faqItems} overflow=${ems.overflow}  ${emsOK ? 'PASS' : 'FAIL'}`);
  const selEl = await page.$('#selection');
  if (selEl) { await selEl.scrollIntoViewIfNeeded(); await selEl.screenshot({ path: path.join(OUT, 'ems-selection.png') }); }

  // --- service page : 3-level breadcrumb ---
  await page.goto(BASE + '/ems/services/box-build-assembly.html', { waitUntil: 'networkidle' });
  const bc = await page.evaluate(() => {
    const nav = document.querySelector('nav.breadcrumb');
    const links = [...nav.querySelectorAll('.breadcrumb__link')].map(a => a.textContent.trim());
    const cur = nav.querySelector('.breadcrumb__current')?.textContent.trim();
    const seps = nav.querySelectorAll('.breadcrumb__sep').length;
    return { links, cur, seps };
  });
  const bcOK = bc.links.length === 2 && bc.links[0] === 'GPW Corporate' && bc.links[1] === 'EMS Assembly' && bc.cur === 'Box Build' && bc.seps === 2;
  if (!bcOK) fail++;
  console.log(`[service] breadcrumb links=${JSON.stringify(bc.links)} current=${bc.cur} seps=${bc.seps}  ${bcOK ? 'PASS' : 'FAIL'}`);
  const bcEl = await page.$('nav.breadcrumb');
  if (bcEl) await bcEl.screenshot({ path: path.join(OUT, 'service-breadcrumb.png') });

  await ctx.close(); await browser.close();
  console.log(fail === 0 ? '\nALL PHASE-4 RENDER CHECKS PASS' : `\n${fail} CHECK(S) FAILED`);
  process.exit(fail === 0 ? 0 : 1);
})();
