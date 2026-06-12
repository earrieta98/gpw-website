const { chromium } = require('playwright');
const { pathToFileURL } = require('url');
const path = require('path');
const fs = require('fs');

const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(__dirname, 'header-refine-verify');
fs.mkdirSync(OUT, { recursive: true });

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1366, height: 768 }, deviceScaleFactor: 2 });
  const page = await ctx.newPage();

  // ---------- 1) Homepage header row (top + scrolled) ----------
  await page.goto(pathToFileURL(path.join(ROOT, 'index.html')).href, { waitUntil: 'networkidle' });
  await page.waitForTimeout(250);

  const rowItems = await page.$$eval('#navMenu > *', els => els.map(el => {
    const lab = el.querySelector('.nav__link, .nav__trigger') || el;
    return (lab.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 22);
  }).filter(Boolean));
  const featureGone = (await page.$('.nav__feature')) === null;

  const header = await page.$('#header');
  await header.screenshot({ path: path.join(OUT, 'home-top.png') });
  await page.evaluate(() => window.scrollTo(0, 700));
  await page.waitForTimeout(300);
  await header.screenshot({ path: path.join(OUT, 'home-scrolled.png') });
  await page.evaluate(() => window.scrollTo(0, 0));

  // ---------- 2) Open Industries mega → AI first + badge ----------
  let megaInfo = {};
  try {
    await page.evaluate(() => {
      const items = [...document.querySelectorAll('#navMenu .nav__item:not(.nav__item--capability)')];
      const ind = items.find(i => /Industries/.test(i.textContent));
      const dd = ind && ind.querySelector('.nav__dropdown');
      if (dd) {
        dd.style.setProperty('opacity', '1', 'important');
        dd.style.setProperty('visibility', 'visible', 'important');
        dd.style.setProperty('transform', 'translateX(-50%) translateY(0)', 'important');
      }
    });
    await page.waitForTimeout(250);
    megaInfo = await page.evaluate(() => {
      const cards = [...document.querySelectorAll('.nav__mega-grid--industries .nav__mega-card')];
      const visualOrder = cards
        .map(c => ({ t: (c.querySelector('.nav__mega-card__title')||{}).textContent || '', order: getComputedStyle(c).order, x: c.getBoundingClientRect().left, y: c.getBoundingClientRect().top }))
        .sort((a,b) => (a.y - b.y) || (a.x - b.x));
      const badge = document.querySelector('.nav__mega-card__badge');
      const br = badge ? badge.getBoundingClientRect() : null;
      return { firstCard: visualOrder[0] ? visualOrder[0].t : null, badgeText: badge ? badge.textContent : null, badgeVisible: !!(br && br.width > 0) };
    });
    await page.screenshot({ path: path.join(OUT, 'industries-mega.png'), clip: { x: 0, y: 0, width: 1366, height: 520 } });
  } catch (e) { megaInfo = { error: String(e).slice(0, 120) }; }

  // ---------- 3) aria-current visual on a CM page (scrolled) ----------
  await page.goto(pathToFileURL(path.join(ROOT, 'contract-manufacturing/index.html')).href, { waitUntil: 'networkidle' });
  await page.waitForTimeout(250);
  await page.evaluate(() => window.scrollTo(0, 700));
  await page.waitForTimeout(300);
  const current = await page.evaluate(() => {
    const a = document.querySelector('#navMenu .nav__link[aria-current="page"]');
    if (!a) return null;
    const cs = getComputedStyle(a);
    const after = getComputedStyle(a, '::after');
    return { text: a.textContent.trim(), color: cs.color, underlineWidth: after.width };
  });
  const h2 = await page.$('#header');
  await h2.screenshot({ path: path.join(OUT, 'cm-aria-current-scrolled.png') });

  await browser.close();

  console.log('NAV ROW (home):', rowItems.join('  |  '));
  console.log('AI top-level slot gone:', featureGone);
  console.log('Industries mega -> first card:', megaInfo.firstCard, '| badge:', JSON.stringify(megaInfo.badgeText), 'visible:', megaInfo.badgeVisible);
  console.log('CM page aria-current:', JSON.stringify(current));
  console.log('\nScreenshots in', OUT);
})();
