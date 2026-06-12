/* ============================================================
   GPW — EMS Services Hero rollout (Archetype B, .svc-hero)
   Applies the approved hero pattern to the 5 EMS service pages.
   Deterministic, identical edits => zero drift. Build/local only.
   ============================================================ */
const fs = require('fs');
const path = require('path');
const BASE = path.resolve(__dirname, '..', '..', 'ems', 'services');

// 2 custom stats per service (descriptive, claim-safe) + 2 fixed shared GPW.
const STATS = {
  'box-build-assembly':         [['Scope', 'BOM to Finished'],     ['Validation', 'Functional Test']],
  'cable-harness-assembly':     [['Testing', '100% Continuity'],   ['Wire Range', 'AWG 30-4']],
  'enclosure-cabinet-assembly': [['Assembly', 'Cabinet + Enclosure'], ['Wiring', 'Routed + Labeled']],
  'system-integration':         [['Scope', 'System-Level'],        ['Integration', 'Mech + Firmware']],
  'testing-inspection':         [['Testing', 'Functional + Burn-In'], ['Inspection', 'In-Process + FAI']],
};
const SHARED = [['To U.S. Border', '2 hrs'], ['Trade Status', 'USMCA']];

const EYE_STAT_CSS = [
  "    /* Bracketed mono eyebrow - shared hero DNA */",
  "    .svc-hero__eyebrow { display:inline-block; font-family:var(--font-mono); font-weight:900; font-size:var(--text-xs); letter-spacing:0.18em; text-transform:uppercase; color:var(--lime); margin-bottom:var(--space-md); }",
  "    .svc-hero__eyebrow::before { content:'[ '; color:var(--coral); opacity:0.6; }",
  "    .svc-hero__eyebrow::after { content:' ]'; color:var(--coral); opacity:0.6; }",
  "    /* Hero stat strip - shared hero DNA */",
  "    .svc-hero__stats { display:grid; grid-template-columns:repeat(auto-fit, minmax(160px,1fr)); gap:0; margin-top:var(--space-2xl); padding:var(--space-lg) 0; border-top:1px solid rgba(255,255,255,0.15); border-bottom:1px solid rgba(255,255,255,0.15); }",
  "    .svc-hero__stat { padding:0 var(--space-lg); border-right:1px solid rgba(255,255,255,0.1); }",
  "    .svc-hero__stat:first-child { padding-left:0; }",
  "    .svc-hero__stat:last-child { border-right:0; }",
  "    .svc-hero__stat-label { display:block; font-family:var(--font-mono); font-size:var(--text-xs); font-weight:700; letter-spacing:0.08em; text-transform:uppercase; color:var(--lime); margin-bottom:var(--space-xs,0.25rem); }",
  "    .svc-hero__stat-value { display:block; font-size:var(--text-xl); font-weight:900; color:var(--white); line-height:1.1; }",
  "    @media (max-width:720px) { .svc-hero__stats { grid-template-columns:1fr 1fr; } .svc-hero__stat { border-right:0; border-bottom:1px solid rgba(255,255,255,0.1); padding:var(--space-md); } .svc-hero__stat:first-child { padding-left:var(--space-md); } }",
];
const IMG_MEDIA = [
  "    @media (min-width: 901px) { .svc-hero__image { height: 100%; } }",
  "    @media (max-width: 900px) { .svc-hero__image { aspect-ratio: 4 / 3; } }",
];

const results = [];
for (const slug of Object.keys(STATS)) {
  const file = path.join(BASE, slug + '.html');
  const log = { slug, edits: {}, ok: true };
  let html = fs.readFileSync(file, 'utf8');
  const nl = html.includes('\r\n') ? '\r\n' : '\n';
  if (html.includes('svc-hero__stats')) { log.skipped = 'already converted'; results.push(log); continue; }
  const before = html;
  const did = (k, prev) => { log.edits[k] = (html !== prev); if (html === prev) log.ok = false; };
  let p;

  // E1 — denser blueprint grid on .svc-hero::after
  p = html;
  html = html.replace(/rgba\(255,255,255,0\.02\) 1px/g, 'rgba(255,255,255,0.05) 1px');
  html = html.replace('background-size: 60px 60px;', 'background-size: 32px 32px;');
  did('E1_grid', p);

  // E2a — bigger H1 (replace the whole main rule)
  p = html;
  html = html.replace(/\.svc-hero h1 \{[\s\S]*?\}/,
    '.svc-hero h1 { color: var(--white); font-size: clamp(2.2rem, 1.6rem + 2.4vw, 3.6rem); font-weight: 900; line-height: 1.05; letter-spacing: -0.025em; margin-bottom: var(--space-lg); }');
  did('E2a_h1', p);

  // E2b — eyebrow + stat CSS after the subtitle rule
  p = html;
  html = html.replace(/(\.svc-hero__subtitle \{[\s\S]*?\})/, (m) => m + nl + EYE_STAT_CSS.join(nl));
  did('E2b_eyebrow_stat_css', p);

  // E3a — photo column stretches to the text height
  p = html;
  html = html.replace(/(\.svc-hero__inner \{[^}]*?)align-items: center;/, '$1align-items: stretch;');
  did('E3a_inner_stretch', p);

  // E3b — image fills the stretched cell (desktop) / defined shape (stacked)
  p = html;
  html = html.replace(/(\.svc-hero__image \{[^}]*\})/, (m) => m + nl + IMG_MEDIA.join(nl));
  did('E3b_image_media', p);

  // E4 — eyebrow markup -> bracketed mono class
  p = html;
  html = html.replace('<span class="label label--lime hero-reveal hero-reveal-delay-1">',
    '<span class="svc-hero__eyebrow hero-reveal hero-reveal-delay-1">');
  did('E4_eyebrow_markup', p);

  // E5 — hero photo: drop the fixed 340px min-height, add object-position
  p = html;
  html = html.replace('width:100%;height:100%;min-height:340px;object-fit:cover;border-radius:var(--radius-lg);',
    'width:100%;height:100%;object-fit:cover;object-position:center;border-radius:var(--radius-lg);');
  did('E5_photo_img', p);

  // E6 — secondary outline CTA in the hero button group
  p = html;
  html = html.replace(
    /(<div class="btn-group hero-reveal hero-reveal-delay-4">[\s\S]*?<\/a>)(\s*)(<\/div>)/,
    (m, a, ws, close) => a + nl + '            <a href="/contact.html" class="btn btn--outline btn--lg">Talk to an Engineer</a>' + ws + close
  );
  did('E6_secondary_cta', p);

  // E7 — stat-strip markup: sibling of .svc-hero__inner, before the container close
  const cells = [STATS[slug][0], STATS[slug][1], SHARED[0], SHARED[1]];
  const STATSTRIP = [
    '      <div class="svc-hero__stats hero-reveal hero-reveal-delay-4">',
    ...cells.map(([l, v]) => `        <div class="svc-hero__stat"><span class="svc-hero__stat-label">${l}</span><span class="svc-hero__stat-value">${v}</span></div>`),
    '      </div>',
  ].join(nl);
  p = html;
  html = html.replace(/(<\/div>)(\s*)(<\/div>)(\s*)(<\/section>)/,
    (m, gridClose, ws1, contClose, ws2, secClose) => gridClose + nl + STATSTRIP + nl + '    ' + contClose + ws2 + secClose);
  did('E7_stat_strip', p);

  // E8 — bump the <=480px mobile H1 override
  p = html;
  html = html.replace('clamp(1.3rem, 1rem + 2vw, 1.8rem)', 'clamp(1.9rem, 1.3rem + 3vw, 2.4rem)');
  did('E8_mobile_h1', p);

  if (html !== before) fs.writeFileSync(file, html, 'utf8');
  log.stats = cells;
  results.push(log);
}

let allOk = true;
for (const r of results) {
  if (r.skipped) { console.log(`SKIP  ${r.slug.padEnd(28)} (${r.skipped})`); continue; }
  const fails = Object.entries(r.edits).filter(([, v]) => !v).map(([k]) => k);
  if (fails.length) { allOk = false; console.log(`FAIL  ${r.slug.padEnd(28)} missed: ${fails.join(', ')}`); }
  else console.log(`OK    ${r.slug.padEnd(28)} stats: ${r.stats.map(c => c[1]).join(' | ')}`);
}
console.log(allOk ? '\nAll 5 EMS service pages converted cleanly.' : '\nSOME EDITS MISSED — review above.');
