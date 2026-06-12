/* ============================================================
   GPW — Industries Hero rollout
   Applies the approved AI-Server-Rack hero pattern to the other
   9 industry pages. Deterministic, identical edits => zero drift.
   Build/local only. Does NOT touch ai-server-rack (the pilot).
   ============================================================ */
const fs = require('fs');
const path = require('path');

const BASE = path.resolve(__dirname, '..', '..', 'industries');

// 2 custom stats per vertical (descriptive, claim-safe: no certs, no
// numeric tolerances implying owned machines). Positions 3 & 4 are the
// fixed shared GPW stats (To U.S. Border / 2 hrs, Trade Status / USMCA).
const STATS = {
  'aerospace-defense':    [['Traceability', 'Full Lot'],        ['Builds', 'To Drawing']],
  'appliances':           [['Assembly', 'Build-to-Print'],      ['Volume', 'Production-Scale']],
  'automotive':           [['Assembly', 'Sub-System'],          ['Builds', 'Build-to-Print']],
  'electronics':          [['Integration', 'Box-Build'],        ['Cabling', 'Harness']],
  'energy':               [['Assembly', 'Cabinet + Enclosure'], ['Integration', 'System']],
  'industrial-equipment': [['Assembly', 'Electromechanical'],   ['Integration', 'System']],
  'medical-devices':      [['Process', 'Documented'],           ['Assembly', 'To Spec']],
  'oil-gas':              [['Assembly', 'Enclosure + Cabinet'], ['Builds', 'To Drawing']],
  'telecom':              [['Integration', 'Cabinet + Module'], ['Cabling', 'Harness']],
};
const SHARED = [['To U.S. Border', '2 hrs'], ['Trade Status', 'USMCA']];

const results = [];

for (const slug of Object.keys(STATS)) {
  const file = path.join(BASE, slug, 'index.html');
  const log = { slug, edits: {}, ok: true };
  let html = fs.readFileSync(file, 'utf8');
  const nl = html.includes('\r\n') ? '\r\n' : '\n';
  const J = (lines) => lines.join(nl);

  if (html.includes('ind-hero__stats')) { log.skipped = 'already converted'; results.push(log); continue; }

  const before = html;
  const did = (key, prev) => { log.edits[key] = (html !== prev); if (html === prev) log.ok = false; };

  // E1 — denser blueprint grid on .ind-hero::after (0.02->0.05, 60px->32px)
  let p = html;
  html = html.replace(/rgba\(255,255,255,0\.02\) 1px/g, 'rgba(255,255,255,0.05) 1px');
  html = html.replace('background-size: 60px 60px;', 'background-size: 32px 32px;');
  did('E1_grid_density', p);

  // E2a — bigger H1 (replace the whole main rule, format-agnostic: works on
  // both the expanded and compact one-line-per-rule page variants)
  p = html;
  html = html.replace(
    /\.ind-hero h1 \{[\s\S]*?\}/,
    '.ind-hero h1 { color: var(--white); font-size: clamp(2.2rem, 1.6rem + 2.4vw, 3.6rem); font-weight: 900; line-height: 1.05; letter-spacing: -0.025em; margin-bottom: var(--space-lg); }'
  );
  did('E2a_h1', p);

  // E2b — eyebrow CSS + stat-strip CSS injected right after the main subtitle rule
  const EYE_STAT_CSS = J([
    '    /* Bracketed mono eyebrow - shared hero DNA (matches cm-service.css .service-hero__eyebrow) */',
    '    .ind-hero__eyebrow {',
    '      display: inline-block;',
    '      font-family: var(--font-mono);',
    '      font-weight: 900;',
    '      font-size: var(--text-xs);',
    '      letter-spacing: 0.18em;',
    '      text-transform: uppercase;',
    '      color: var(--lime);',
    '      margin-bottom: var(--space-md);',
    '    }',
    "    .ind-hero__eyebrow::before { content: '[ '; color: var(--coral); opacity: 0.6; }",
    "    .ind-hero__eyebrow::after  { content: ' ]'; color: var(--coral); opacity: 0.6; }",
    '',
    '    /* Hero stat strip - shared hero DNA (4 data cells above the fold) */',
    '    .ind-hero__stats {',
    '      display: grid;',
    '      grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));',
    '      gap: 0;',
    '      margin-top: var(--space-2xl);',
    '      padding: var(--space-lg) 0;',
    '      border-top: 1px solid rgba(255,255,255,0.15);',
    '      border-bottom: 1px solid rgba(255,255,255,0.15);',
    '    }',
    '    .ind-hero__stat {',
    '      padding: 0 var(--space-lg);',
    '      border-right: 1px solid rgba(255,255,255,0.1);',
    '    }',
    '    .ind-hero__stat:first-child { padding-left: 0; }',
    '    .ind-hero__stat:last-child { border-right: 0; }',
    '    .ind-hero__stat-label {',
    '      display: block;',
    '      font-family: var(--font-mono);',
    '      font-size: var(--text-xs);',
    '      font-weight: 700;',
    '      letter-spacing: 0.08em;',
    '      text-transform: uppercase;',
    '      color: var(--lime);',
    '      margin-bottom: var(--space-xs, 0.25rem);',
    '    }',
    '    .ind-hero__stat-value {',
    '      display: block;',
    '      font-size: var(--text-xl);',
    '      font-weight: 900;',
    '      color: var(--white);',
    '      line-height: 1.1;',
    '    }',
    '    @media (max-width: 720px) {',
    '      .ind-hero__stats { grid-template-columns: 1fr 1fr; }',
    '      .ind-hero__stat {',
    '        border-right: 0;',
    '        border-bottom: 1px solid rgba(255,255,255,0.1);',
    '        padding: var(--space-md);',
    '      }',
    '      .ind-hero__stat:first-child { padding-left: var(--space-md); }',
    '    }',
  ]);
  p = html;
  html = html.replace(/(\.ind-hero__subtitle \{[\s\S]*?\})/, (m) => m + nl + nl + EYE_STAT_CSS);
  did('E2b_eyebrow_stat_css', p);

  // E3 — photo stretch (fills text-column height) after the placeholder span rule
  const E3_MEDIA = J([
    '',
    '    /* Hero photo fills the text-column height (no fixed over-crop) on desktop */',
    '    @media (min-width: 901px) {',
    '      .ind-hero__grid { align-items: stretch; }',
    '      .ind-hero__image-placeholder { height: 100%; min-height: 0; }',
    '    }',
    '    /* Stacked (tablet/mobile): give the image a defined shape so it has height */',
    '    @media (max-width: 900px) {',
    '      .ind-hero__image-placeholder { aspect-ratio: 4 / 3; min-height: 0; }',
    '    }',
  ]);
  p = html;
  html = html.replace(/(\.ind-hero__image-placeholder span \{[\s\S]*?\})/, (m) => m + nl + E3_MEDIA);
  did('E3_photo_stretch_css', p);

  // E4 — eyebrow markup -> bracketed mono class (preserves the inner text)
  p = html;
  html = html.replace(
    '<span class="label label--lime hero-reveal hero-reveal-delay-1" style="font-family: var(--font-accent);">',
    '<span class="ind-hero__eyebrow hero-reveal hero-reveal-delay-1">'
  );
  did('E4_eyebrow_markup', p);

  // E5 — photo img: drop the 3:4 crop, add object-position
  p = html;
  html = html.replace(
    ';object-fit:cover;display:block;border-radius:inherit;aspect-ratio:3/4">',
    ';object-fit:cover;object-position:center;display:block;border-radius:inherit">'
  );
  did('E5_photo_img', p);

  // E6 — secondary outline CTA inside the hero button group
  p = html;
  html = html.replace(
    /(<div class="btn-group hero-reveal hero-reveal-delay-4">[\s\S]*?<\/a>)(\s*)(<\/div>)/,
    (m, a, ws, close) =>
      a + nl + '            <a href="../../contact.html" class="btn btn--outline btn--lg">Talk to an Engineer</a>' + ws + close
  );
  did('E6_secondary_cta', p);

  // E7 — stat-strip markup: sibling of .ind-hero__grid, before the container close
  const s = STATS[slug];
  const cells = [s[0], s[1], SHARED[0], SHARED[1]];
  const STATSTRIP = J([
    '      <div class="ind-hero__stats hero-reveal hero-reveal-delay-4">',
    ...cells.map(([label, value]) =>
      `        <div class="ind-hero__stat"><span class="ind-hero__stat-label">${label}</span><span class="ind-hero__stat-value">${value}</span></div>`),
    '      </div>',
  ]);
  p = html;
  html = html.replace(
    /(<\/div>)(\s*)(<\/div>)(\s*)(<\/section>)/,
    (m, gridClose, ws1, contClose, ws2, secClose) =>
      gridClose + nl + STATSTRIP + nl + '    ' + contClose + ws2 + secClose
  );
  did('E7_stat_strip_markup', p);

  // E8 — bump the <=480px mobile H1 override
  p = html;
  html = html.replace('clamp(1.3rem, 1rem + 2vw, 1.8rem)', 'clamp(1.9rem, 1.3rem + 3vw, 2.4rem)');
  did('E8_mobile_h1', p);

  if (html !== before) fs.writeFileSync(file, html, 'utf8');
  log.stats = cells;
  results.push(log);
}

// Report
let allOk = true;
for (const r of results) {
  if (r.skipped) { console.log(`SKIP  ${r.slug.padEnd(22)} (${r.skipped})`); continue; }
  const fails = Object.entries(r.edits).filter(([, v]) => !v).map(([k]) => k);
  if (fails.length) { allOk = false; console.log(`FAIL  ${r.slug.padEnd(22)} missed: ${fails.join(', ')}`); }
  else console.log(`OK    ${r.slug.padEnd(22)} stats: ${r.stats.map(c => c[1]).join(' | ')}`);
}
console.log(allOk ? '\nAll 9 pages converted cleanly.' : '\nSOME EDITS MISSED — review above.');
