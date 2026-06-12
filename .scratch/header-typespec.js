const { chromium } = require('playwright');
const { pathToFileURL } = require('url');
const path = require('path');
const fs = require('fs');

const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(__dirname, 'header-typespec');
fs.mkdirSync(OUT, { recursive: true });

function specOf(page) {
  return page.evaluate(() => {
    const nav = document.getElementById('navMenu');
    const out = [];
    // direct top-level nav children (links, capability wrappers, trigger items, cta)
    nav.querySelectorAll(':scope > *').forEach((el) => {
      // find the primary label element
      let label = el;
      if (el.classList.contains('nav__item') || el.classList.contains('nav__item--capability')) {
        label = el.querySelector('.nav__link, .nav__trigger') || el;
      }
      const cs = getComputedStyle(label);
      const txt = (label.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 24);
      if (!txt) return;
      const r = label.getBoundingClientRect();
      out.push({
        text: txt,
        cls: label.className.replace(/\s+/g, '.'),
        fontSize: cs.fontSize,
        fontWeight: cs.fontWeight,
        letterSpacing: cs.letterSpacing,
        textTransform: cs.textTransform,
        color: cs.color,
        h: Math.round(r.height),
      });
    });
    // logo + tagline legibility
    const logoImg = document.querySelector('.header__logo img');
    const lr = logoImg ? logoImg.getBoundingClientRect() : null;
    return { items: out, logo: lr ? { w: Math.round(lr.width), h: Math.round(lr.height) } : null };
  });
}

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1366, height: 768 }, deviceScaleFactor: 2 });
  const page = await ctx.newPage();

  for (const [name, rel] of [['home', 'index.html'], ['ai', 'industries/ai-server-rack/index.html']]) {
    await page.goto(pathToFileURL(path.join(ROOT, rel)).href, { waitUntil: 'networkidle' }).catch(() => {});
    await page.waitForTimeout(250);

    // header--top (transparent over hero)
    const topSpec = await specOf(page);
    const header = await page.$('#header');
    await header.screenshot({ path: path.join(OUT, `${name}-top.png`) });

    // scrolled (solid white)
    await page.evaluate(() => window.scrollTo(0, 700));
    await page.waitForTimeout(300);
    const scrolledSpec = await specOf(page);
    await header.screenshot({ path: path.join(OUT, `${name}-scrolled.png`) });
    await page.evaluate(() => window.scrollTo(0, 0));

    console.log(`\n===== ${name} (${rel}) =====`);
    console.log('logo px:', JSON.stringify(topSpec.logo));
    console.log('\n  ITEM                      size     weight  l-spacing   transform   height');
    for (const it of topSpec.items) {
      console.log(
        '  ' + it.text.padEnd(24) + ' ' +
        it.fontSize.padEnd(8) + ' ' +
        it.fontWeight.padEnd(7) + ' ' +
        it.letterSpacing.padEnd(11) + ' ' +
        it.textTransform.padEnd(11) + ' ' +
        it.h + 'px   ' + it.color
      );
    }
  }
  await browser.close();
  console.log('\nHeader crops in', OUT);
})();
