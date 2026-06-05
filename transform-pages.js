const fs = require('fs');
const path = require('path');

const imgSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>';
const layersSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>';

const V2_CSS = `<style>
    /* ============================================
       INDUSTRY PAGE: __TITLE__ \u2014 Page-Specific Styles (v2)
       ============================================ */

    /* --- Industry Hero --- */
    .ind-hero {
      position: relative;
      padding: calc(var(--header-height) + var(--space-3xl)) 0 var(--space-4xl);
      background: linear-gradient(135deg, #1a3f43 0%, var(--deep-blue) 45%, var(--teal) 100%);
      color: var(--white);
      overflow: hidden;
    }

    .ind-hero::before {
      content: '';
      position: absolute;
      top: 0; left: 0;
      width: 100%; height: 100%;
      background:
        radial-gradient(ellipse 60% 50% at 20% 80%, rgba(173,207,145,0.08) 0%, transparent 70%),
        radial-gradient(ellipse 40% 40% at 80% 20%, rgba(237,131,94,0.06) 0%, transparent 60%);
      pointer-events: none;
    }

    .ind-hero::after {
      content: '';
      position: absolute;
      top: 0; left: 0;
      width: 100%; height: 100%;
      background-image:
        linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
      background-size: 60px 60px;
      pointer-events: none;
    }

    .ind-hero .container { position: relative; z-index: 1; max-width: 1200px; }

    .ind-hero h1 {
      color: var(--white);
      font-size: clamp(1.6rem, 1.2rem + 2vw, 2.6rem);
      margin-bottom: var(--space-lg);
      line-height: 1.25;
    }

    .ind-hero__subtitle {
      font-size: var(--text-lg);
      line-height: 1.7;
      color: rgba(255,255,255,0.85);
      margin-bottom: var(--space-xl);
    }

    /* CHANGE 1 & 2: Hero grid with image placeholder */
    .ind-hero__grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--space-3xl);
      align-items: center;
    }

    @media (max-width: 900px) {
      .ind-hero__grid {
        grid-template-columns: 1fr;
      }
    }

    .ind-hero__image-placeholder {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: var(--space-md);
      background: rgba(255,255,255,0.06);
      border: 2px dashed rgba(255,255,255,0.2);
      border-radius: var(--radius-lg);
      padding: var(--space-3xl) var(--space-xl);
      min-height: 360px;
      text-align: center;
    }

    .ind-hero__image-placeholder svg {
      width: 48px;
      height: 48px;
      color: rgba(255,255,255,0.4);
    }

    .ind-hero__image-placeholder span {
      font-size: var(--text-sm);
      font-style: italic;
      color: rgba(255,255,255,0.4);
      max-width: 280px;
      line-height: 1.5;
    }

    /* --- Hero Extended (moved paragraphs) --- */
    .hero-extended {
      padding: var(--space-4xl) 0;
      background: var(--white);
    }

    .hero-extended__grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--space-3xl);
      align-items: start;
    }

    @media (max-width: 900px) {
      .hero-extended__grid {
        grid-template-columns: 1fr;
      }
    }

    .hero-extended__text p {
      font-size: var(--text-base);
      color: var(--dark-gray);
      line-height: 1.7;
      margin-bottom: var(--space-lg);
    }

    .hero-extended__text p:last-child {
      margin-bottom: 0;
    }

    .hero-extended__callout {
      background: linear-gradient(135deg, var(--teal), var(--deep-blue));
      border-radius: var(--radius-lg);
      padding: var(--space-2xl) var(--space-xl);
      color: var(--white);
      position: sticky;
      top: calc(var(--header-height) + var(--space-xl));
    }

    .hero-extended__callout p {
      font-size: var(--text-lg);
      line-height: 1.7;
      color: rgba(255,255,255,0.92);
      margin-bottom: 0;
    }

    .hero-extended__callout::before {
      content: '';
      display: block;
      width: 48px;
      height: 4px;
      background: var(--coral);
      border-radius: 2px;
      margin-bottom: var(--space-lg);
    }

    /* --- Definition Block --- */
    .definition-section { padding: var(--space-4xl) 0; }

    .definition-block-ind {
      background: var(--off-white);
      border-left: 4px solid var(--teal);
      border-radius: 0 var(--radius-lg) var(--radius-lg) 0;
      padding: var(--space-2xl) var(--space-2xl);
      display: grid;
      grid-template-columns: auto 1fr;
      gap: var(--space-xl);
      align-items: start;
    }

    .definition-block-ind__icon {
      width: 56px;
      height: 56px;
      border-radius: var(--radius-md);
      background: linear-gradient(135deg, var(--teal), var(--deep-blue));
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .definition-block-ind__icon svg {
      width: 28px;
      height: 28px;
      color: var(--white);
    }

    @media (max-width: 600px) {
      .definition-block-ind { grid-template-columns: 1fr; }
    }

    .definition-block-ind p {
      font-size: var(--text-lg);
      line-height: 1.7;
      color: var(--dark-gray);
      margin-bottom: 0;
    }

    /* --- Stats Bar (CHANGE 4) --- */
    .stats-bar {
      padding: var(--space-3xl) 0;
      background: var(--off-white);
    }

    .stats-bar__grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: var(--space-xl);
    }

    @media (max-width: 900px) {
      .stats-bar__grid { grid-template-columns: repeat(2, 1fr); }
    }

    @media (max-width: 500px) {
      .stats-bar__grid { grid-template-columns: 1fr; }
    }

    .stat-card {
      background: var(--white);
      border: 1px solid var(--light-gray);
      border-radius: var(--radius-lg);
      padding: var(--space-xl) var(--space-lg);
      text-align: center;
      transition: border-color var(--transition-base);
    }

    .stat-card:hover {
      border-color: var(--teal);
    }

    .stat-card__number {
      font-size: clamp(1.8rem, 1.4rem + 1.5vw, 2.4rem);
      font-weight: 900;
      color: var(--teal);
      line-height: 1.1;
      margin-bottom: var(--space-xs);
    }

    .stat-card__label {
      font-size: var(--text-sm);
      color: var(--mid-gray);
      line-height: 1.4;
    }

    /* --- Industry Context (CHANGE 3: 2-column layout) --- */
    .context-section { padding: var(--space-4xl) 0; background: var(--off-white); }

    .context-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--space-3xl);
      align-items: start;
    }

    @media (max-width: 900px) {
      .context-grid { grid-template-columns: 1fr; }
    }

    .context-section .context-copy p { color: var(--dark-gray); line-height: 1.7; margin-bottom: var(--space-lg); }
    .context-section .context-copy h3 { margin-top: var(--space-2xl); margin-bottom: var(--space-md); font-size: var(--text-xl); }

    .context-image {
      position: sticky;
      top: calc(var(--header-height) + var(--space-xl));
    }

    .context-image__placeholder {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: var(--space-md);
      background: rgba(0,0,0,0.03);
      border: 2px dashed var(--light-gray);
      border-radius: var(--radius-lg);
      padding: var(--space-3xl) var(--space-xl);
      min-height: 400px;
      text-align: center;
    }

    .context-image__placeholder svg {
      width: 48px;
      height: 48px;
      color: var(--mid-gray);
    }

    .context-image__placeholder span {
      font-size: var(--text-sm);
      font-style: italic;
      color: var(--mid-gray);
      max-width: 280px;
      line-height: 1.5;
    }

    /* --- Capabilities --- */
    .cap-section { padding: var(--space-4xl) 0; }
    .cap-section__intro { max-width: 780px; margin-bottom: var(--space-3xl); }
    .cap-section__intro p { color: var(--dark-gray); line-height: 1.7; }

    .cap-accordion { background: var(--white); border: 1px solid var(--light-gray); border-radius: var(--radius-lg); margin-bottom: var(--space-md); transition: border-color var(--transition-base); overflow: hidden; }
    .cap-accordion[open] { border-color: var(--teal); }
    .cap-accordion summary { display: flex; align-items: center; gap: var(--space-md); padding: var(--space-lg) var(--space-xl); cursor: pointer; list-style: none; user-select: none; }
    .cap-accordion summary::-webkit-details-marker { display: none; }
    .cap-accordion summary::marker { display: none; content: ''; }
    .cap-accordion__icon { width: 44px; height: 44px; border-radius: var(--radius-md); background: linear-gradient(135deg, var(--teal), var(--deep-blue)); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
    .cap-accordion__icon svg { width: 22px; height: 22px; color: var(--white); }
    .cap-accordion__title { font-size: var(--text-lg); font-weight: 700; color: var(--charcoal); margin: 0; flex: 1; }
    .cap-accordion__arrow { width: 20px; height: 20px; color: var(--mid-gray); transition: transform 0.3s ease; flex-shrink: 0; }
    .cap-accordion[open] .cap-accordion__arrow { transform: rotate(180deg); color: var(--teal); }
    .cap-accordion__body { padding: 0 var(--space-xl) var(--space-xl); }
    .cap-accordion__body p { color: var(--dark-gray); line-height: 1.7; margin-bottom: var(--space-md); }
    .cap-accordion__body p:last-child { margin-bottom: 0; }
    .cap-accordion__body ul { list-style: none; margin: var(--space-md) 0; }
    .cap-accordion__body li { display: flex; align-items: flex-start; gap: var(--space-sm); font-size: var(--text-base); color: var(--dark-gray); padding: var(--space-xs) 0; line-height: 1.6; }
    .cap-accordion__body li::before { content: ''; width: 6px; height: 6px; border-radius: 50%; background: var(--coral); flex-shrink: 0; margin-top: 9px; }
    .cap-accordion__xref { margin-top: var(--space-lg); padding-top: var(--space-md); border-top: 1px solid var(--light-gray); font-size: var(--text-sm); color: var(--mid-gray); }
    .cap-accordion__xref a { color: var(--teal); font-weight: 600; }
    .cap-accordion__xref a:hover { color: var(--coral); }

    /* --- Image Band (CHANGE 5 & 8) --- */
    .image-band { padding: var(--space-3xl) 0; background: var(--white); }
    .image-band--alt { background: var(--off-white); }
    .image-band__placeholder { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: var(--space-md); background: rgba(0,0,0,0.03); border: 2px dashed var(--light-gray); border-radius: var(--radius-lg); aspect-ratio: 21 / 9; width: 100%; text-align: center; padding: var(--space-xl); }
    .image-band__placeholder svg { width: 48px; height: 48px; color: var(--mid-gray); }
    .image-band__placeholder span { font-size: var(--text-sm); font-style: italic; color: var(--mid-gray); max-width: 480px; line-height: 1.5; }

    /* --- Mid CTA --- */
    .mid-cta { padding: var(--space-4xl) 0; background: linear-gradient(135deg, var(--teal-dark), var(--deep-blue)); color: var(--white); text-align: center; position: relative; overflow: hidden; }
    .mid-cta::before { content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 100%; background-image: radial-gradient(circle at 20% 50%, rgba(173,207,145,0.06) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(237,131,94,0.05) 0%, transparent 50%); pointer-events: none; }
    .mid-cta .container { position: relative; z-index: 1; }
    .mid-cta__stats { display: flex; justify-content: center; gap: var(--space-3xl); margin-bottom: var(--space-2xl); }
    @media (max-width: 600px) { .mid-cta__stats { gap: var(--space-xl); flex-wrap: wrap; } }
    .mid-cta__stat-number { font-size: var(--text-4xl); font-weight: 900; color: var(--white); line-height: 1; }
    .mid-cta__stat-label { font-size: var(--text-xs); color: rgba(255,255,255,0.6); text-transform: uppercase; letter-spacing: 0.1em; margin-top: var(--space-xs); }
    .mid-cta p { color: rgba(255,255,255,0.8); max-width: 600px; margin: 0 auto var(--space-xl); }

    /* --- Projects (CHANGE 6: image placeholders in cards, 3-col grid) --- */
    .projects-section { padding: var(--space-4xl) 0; background: var(--off-white); }
    .projects-section__intro { max-width: 780px; margin-bottom: var(--space-3xl); }
    .projects-section__intro p { color: var(--dark-gray); line-height: 1.7; }
    .projects-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--space-xl); }
    @media (max-width: 900px) { .projects-grid { grid-template-columns: 1fr; } }
    .project-card { background: var(--white); border: 1px solid var(--light-gray); border-radius: var(--radius-lg); padding: var(--space-2xl); transition: border-color var(--transition-base); overflow: hidden; display: flex; flex-direction: column; }
    .project-card:hover { border-color: var(--teal); }
    .project-card__image { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: var(--space-sm); background: rgba(0,0,0,0.03); border: 2px dashed var(--light-gray); border-radius: var(--radius-md); aspect-ratio: 16 / 9; margin: calc(-1 * var(--space-2xl)) calc(-1 * var(--space-2xl)) var(--space-xl); text-align: center; padding: var(--space-lg); }
    .project-card__image svg { width: 36px; height: 36px; color: var(--mid-gray); }
    .project-card__image span { font-size: var(--text-sm); font-style: italic; color: var(--mid-gray); max-width: 360px; line-height: 1.4; }
    .project-card__number { font-family: var(--font-accent); font-size: var(--text-xs); font-weight: 600; text-transform: uppercase; letter-spacing: 0.18em; color: var(--coral); margin-bottom: var(--space-sm); }
    .project-card h3 { font-size: var(--text-xl); margin-bottom: var(--space-md); }
    .project-card p { color: var(--dark-gray); line-height: 1.7; margin-bottom: var(--space-md); }
    .project-card__services { display: flex; flex-wrap: wrap; gap: var(--space-sm); margin-top: var(--space-lg); padding-top: var(--space-md); border-top: 1px solid var(--light-gray); }
    .project-card__services a { font-size: var(--text-xs); font-weight: 600; color: var(--teal); background: rgba(35,85,90,0.08); padding: 4px 12px; border-radius: 100px; transition: all var(--transition-fast); }
    .project-card__services a:hover { background: var(--teal); color: var(--white); }

    /* --- Monterrey Advantage --- */
    .advantage-section { padding: var(--space-4xl) 0; }
    .advantage-section__intro { max-width: 780px; margin-bottom: var(--space-3xl); }
    .advantage-section__intro p { color: var(--dark-gray); line-height: 1.7; }
    .advantage-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--space-xl); }
    @media (max-width: 900px) { .advantage-grid { grid-template-columns: 1fr 1fr; } }
    @media (max-width: 600px) { .advantage-grid { grid-template-columns: 1fr; } }
    .advantage-card { background: var(--white); border: 1px solid var(--light-gray); border-radius: var(--radius-lg); padding: var(--space-2xl); transition: all var(--transition-base); }
    .advantage-card:hover { border-color: var(--teal); transform: translateY(-4px); box-shadow: var(--shadow-lg); }
    .advantage-card__icon { width: 44px; height: 44px; border-radius: var(--radius-sm); background: rgba(35,85,90,0.08); display: flex; align-items: center; justify-content: center; margin-bottom: var(--space-md); }
    .advantage-card__icon svg { width: 22px; height: 22px; color: var(--teal); }
    .advantage-card h3 { font-size: var(--text-lg); margin-bottom: var(--space-sm); }
    .advantage-card p { font-size: var(--text-sm); color: var(--dark-gray); line-height: 1.7; margin-bottom: 0; }

    /* CHANGE 7: Pull quote for advantage-closing */
    .advantage-closing { max-width: 780px; margin-top: var(--space-3xl); border-left: 4px solid var(--coral); padding-left: var(--space-xl); }
    .advantage-closing p { font-family: var(--font-accent); font-size: var(--text-xl); color: var(--dark-gray); line-height: 1.7; font-weight: 600; font-style: italic; margin-bottom: 0; }

    /* --- Quality --- */
    .quality-section { padding: var(--space-4xl) 0; background: var(--off-white); }
    .quality-section__intro { max-width: 780px; margin-bottom: var(--space-3xl); }
    .quality-section__intro p { color: var(--dark-gray); line-height: 1.7; }
    .ind-quality-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--space-xl); justify-items: center; }
    .ind-quality-grid .ind-quality-card:nth-child(4), .ind-quality-grid .ind-quality-card:nth-child(5) { grid-column: span 1; }
    .ind-quality-grid::after { content: ''; display: none; }
    @supports (grid-template-columns: repeat(3, 1fr)) {
      .ind-quality-grid { grid-template-columns: repeat(6, 1fr); }
      .ind-quality-grid .ind-quality-card:nth-child(1), .ind-quality-grid .ind-quality-card:nth-child(2), .ind-quality-grid .ind-quality-card:nth-child(3) { grid-column: span 2; }
      .ind-quality-grid .ind-quality-card:nth-child(4) { grid-column: 2 / span 2; }
      .ind-quality-grid .ind-quality-card:nth-child(5) { grid-column: 4 / span 2; }
    }
    @media (max-width: 900px) { .ind-quality-grid, .ind-quality-grid { grid-template-columns: 1fr 1fr; } .ind-quality-grid .ind-quality-card:nth-child(1), .ind-quality-grid .ind-quality-card:nth-child(2), .ind-quality-grid .ind-quality-card:nth-child(3), .ind-quality-grid .ind-quality-card:nth-child(4), .ind-quality-grid .ind-quality-card:nth-child(5) { grid-column: span 1; } }
    @media (max-width: 600px) { .ind-quality-grid { grid-template-columns: 1fr; } .ind-quality-grid .ind-quality-card:nth-child(1), .ind-quality-grid .ind-quality-card:nth-child(2), .ind-quality-grid .ind-quality-card:nth-child(3), .ind-quality-grid .ind-quality-card:nth-child(4), .ind-quality-grid .ind-quality-card:nth-child(5) { grid-column: span 1; } }
    .ind-quality-card { background: var(--white); border: 1px solid var(--light-gray); border-radius: var(--radius-lg); padding: var(--space-2xl); }
    .ind-quality-card__icon { width: 44px; height: 44px; border-radius: var(--radius-sm); background: rgba(237,131,94,0.1); display: flex; align-items: center; justify-content: center; margin-bottom: var(--space-md); }
    .ind-quality-card__icon svg { width: 22px; height: 22px; color: var(--coral); }
    .ind-quality-card h3 { font-size: var(--text-lg); margin-bottom: var(--space-sm); }
    .ind-quality-card p { font-size: var(--text-sm); color: var(--dark-gray); line-height: 1.7; margin-bottom: 0; }
    .ind-quality-card ul { list-style: none; margin-top: var(--space-sm); }
    .ind-quality-card li { font-size: var(--text-sm); color: var(--dark-gray); padding: 3px 0; display: flex; align-items: flex-start; gap: var(--space-xs); line-height: 1.5; }
    .ind-quality-card li::before { content: ''; width: 5px; height: 5px; border-radius: 50%; background: var(--teal); flex-shrink: 0; margin-top: 7px; }

    /* --- FAQ --- */
    .ind-faq { padding: var(--space-4xl) 0; }
    .ind-faq .faq__header { text-align: center; margin-bottom: var(--space-3xl); }
    .ind-faq .faq-list { max-width: 780px; margin: 0 auto; }

    /* --- Final CTA --- */
    .final-cta { padding: var(--space-4xl) 0; background: linear-gradient(135deg, var(--teal-dark) 0%, var(--deep-blue) 100%); color: var(--white); text-align: center; }
    .final-cta h2 { color: var(--white); margin-bottom: var(--space-md); }
    .final-cta p { color: rgba(255,255,255,0.8); max-width: 700px; margin: 0 auto var(--space-lg); line-height: 1.7; }
    .final-cta__buttons { display: flex; justify-content: center; gap: var(--space-md); flex-wrap: wrap; margin-bottom: var(--space-lg); }
    .final-cta__context { font-size: var(--text-sm); color: rgba(255,255,255,0.6); margin-top: var(--space-sm); }
    .final-cta__tertiary { margin-top: var(--space-xl); font-size: var(--text-sm); }
    .final-cta__tertiary a { color: rgba(255,255,255,0.7); font-weight: 600; transition: color var(--transition-fast); }
    .final-cta__tertiary a:hover { color: var(--white); }
    .final-cta__contact { margin-top: var(--space-xl); font-size: var(--text-sm); color: rgba(255,255,255,0.5); }
    .final-cta__contact a { color: rgba(255,255,255,0.7); }
    .final-cta__contact a:hover { color: var(--white); }
  </style>`;

function replaceAll(str, find, replace) {
  return str.split(find).join(replace);
}

function transform(filePath, cfg) {
  let h = fs.readFileSync(filePath, 'utf8');

  // 1. Replace CSS
  h = h.replace(/<style>[\s\S]*?<\/style>/, V2_CSS.replace('__TITLE__', cfg.cssTitle));

  // 2. Hero: wrap in grid, move paragraphs to hero-extended
  // Find the hero copy paragraphs
  const heroCopyMatch = h.match(/<div class="ind-hero__copy hero-reveal hero-reveal-delay-3">\s*([\s\S]*?)\s*<\/div>\s*<div class="btn-group/);
  if (heroCopyMatch) {
    const allParas = heroCopyMatch[1].trim();
    // Split paragraphs
    const paraMatches = [...allParas.matchAll(/<p>[\s\S]*?<\/p>/g)].map(m => m[0]);
    const extendedParas = paraMatches.slice(0, -1).join('\n          ');
    const calloutPara = paraMatches[paraMatches.length - 1];

    // Remove the ind-hero__copy div and its contents, restructure hero
    // Find: from h1 through end of btn-group closing div
    const heroStartRe = /(<h1 class="hero-reveal hero-reveal-delay-2">[\s\S]*?<\/h1>\s*<p class="ind-hero__subtitle[\s\S]*?<\/p>)\s*<div class="ind-hero__copy hero-reveal hero-reveal-delay-3">[\s\S]*?<\/div>\s*(<div class="btn-group[\s\S]*?<\/div>)\s*<\/div>\s*<\/section>/;
    const heroMatch = h.match(heroStartRe);
    if (heroMatch) {
      const h1AndSubtitle = heroMatch[1];
      const btnGroup = heroMatch[2];

      const newHero = `<div class="ind-hero__grid">
        <div class="ind-hero__text">
          ${h1AndSubtitle}
          ${btnGroup}
        </div>

        <!-- CHANGE 2: Hero image placeholder -->
        <div class="ind-hero__image-placeholder hero-reveal hero-reveal-delay-3">
          ${imgSvg}
          <span>${cfg.heroImage}</span>
        </div>
      </div>
    </div>
  </section>

  <!-- ============ HERO EXTENDED (CHANGE 1 \u2014 moved paragraphs) ============ -->
  <section class="hero-extended">
    <div class="container">
      <div class="hero-extended__grid">
        <div class="hero-extended__text reveal">
          ${extendedParas}
        </div>
        <div class="hero-extended__callout reveal">
          ${calloutPara}
        </div>
      </div>
    </div>
  </section>`;

      h = h.replace(heroStartRe, newHero);
    } else {
      console.log('WARNING: Hero regex did not match for ' + filePath);
    }
  } else {
    console.log('WARNING: Hero copy not found for ' + filePath);
  }

  // 3. Definition block: add icon
  h = h.replace(
    '<div class="definition-block-ind reveal">\n        <p>',
    `<div class="definition-block-ind reveal">
        <div class="definition-block-ind__icon">
          ${layersSvg}
        </div>
        <p>`
  );

  // 4. Stats bar after definition
  h = h.replace(
    '  <!-- ============ SECTION 3: INDUSTRY CONTEXT ============ -->',
    `  <!-- ============ CHANGE 4: STATS BAR ============ -->
  <section class="stats-bar">
    <div class="container">
      <div class="stats-bar__grid">
        <div class="stat-card reveal">
          <div class="stat-card__number">${cfg.stats[0].num}</div>
          <div class="stat-card__label">${cfg.stats[0].label}</div>
        </div>
        <div class="stat-card reveal reveal-delay-1">
          <div class="stat-card__number">${cfg.stats[1].num}</div>
          <div class="stat-card__label">${cfg.stats[1].label}</div>
        </div>
        <div class="stat-card reveal reveal-delay-2">
          <div class="stat-card__number">${cfg.stats[2].num}</div>
          <div class="stat-card__label">${cfg.stats[2].label}</div>
        </div>
        <div class="stat-card reveal reveal-delay-3">
          <div class="stat-card__number">${cfg.stats[3].num}</div>
          <div class="stat-card__label">${cfg.stats[3].label}</div>
        </div>
      </div>
    </div>
  </section>

  <!-- ============ SECTION 3: INDUSTRY CONTEXT ============ -->`
  );

  // 5. Context section: wrap in grid with sticky image
  // Find the context-copy div and wrap it
  const ctxCopyStart = '<div class="context-copy reveal">';
  const ctxSectionEnd = '</div>\n    </div>\n  </section>';
  // We need to find the context section's closing
  const ctxIdx = h.indexOf(ctxCopyStart);
  if (ctxIdx > -1) {
    // Find the section close after context-copy
    // The pattern is: context-copy div closes, then container div closes, then section closes
    // Find the end of context-copy content - look for the closing pattern after context
    const afterCtx = h.substring(ctxIdx);
    // Find the closing </div> for context-copy, then </div> for container, then </section>
    // Match: all paragraphs until </div>\n    </div>\n  </section>
    const ctxEndPattern = /(<div class="context-copy reveal">[\s\S]*?)(\s*<\/div>\s*<\/div>\s*<\/section>\s*\n\s*<!-- ============ SECTION 4)/;
    const ctxMatch = h.match(ctxEndPattern);
    if (ctxMatch) {
      const ctxContent = ctxMatch[1];
      const ctxAfter = ctxMatch[2];
      // Wrap in grid
      const newCtx = ctxContent.replace(
        '<div class="context-copy reveal">',
        '<div class="context-grid">\n        <div class="context-copy reveal">'
      ) + `

        <!-- CHANGE 3: Sticky image placeholder -->
        <div class="context-image">
          <div class="context-image__placeholder">
            ${imgSvg}
            <span>${cfg.contextImage}</span>
          </div>
        </div>
      </div>` + ctxAfter;
      h = h.replace(ctxMatch[0], newCtx);
    }
  }

  // 6. Image band after capabilities
  h = h.replace(
    '  <!-- ============ MID-PAGE CTA ============ -->',
    `  <!-- ============ CHANGE 5: IMAGE BAND after capabilities ============ -->
  <section class="image-band">
    <div class="container">
      <div class="image-band__placeholder">
        ${imgSvg}
        <span>${cfg.imageBand1}</span>
      </div>
    </div>
  </section>

  <!-- ============ MID-PAGE CTA ============ -->`
  );

  // 7. Mid-CTA: Add stats row
  h = h.replace(
    '<div class="container reveal">\n      <p>GPW responds to every RFQ',
    `<div class="container reveal">
      <div class="mid-cta__stats">
        <div>
          <div class="mid-cta__stat-number">48h</div>
          <div class="mid-cta__stat-label">RFQ Response</div>
        </div>
        <div>
          <div class="mid-cta__stat-number">1 team</div>
          <div class="mid-cta__stat-label">One Program Manager</div>
        </div>
        <div>
          <div class="mid-cta__stat-number">1 timezone</div>
          <div class="mid-cta__stat-label">Same Hours as You</div>
        </div>
      </div>
      <p>GPW responds to every RFQ`
  );

  // 8. Projects: Wrap in grid, add image placeholders to each card
  // Wrap all project-card divs in projects-grid
  // Add project-card__image to each card
  const projectCards = h.match(/<!-- Project \d+ -->\s*<div class="project-card reveal[^"]*">/g);
  if (projectCards) {
    // Add projects-grid wrapper before first project card
    h = h.replace(
      /(\s*)(<!-- Project 1 -->)/,
      '$1<div class="projects-grid">\n$1  $2'
    );

    // Add image placeholders to each project card
    cfg.projectImages.forEach((img, i) => {
      const num = i + 1;
      const cardPattern = new RegExp(`(<!-- Project ${num} -->\\s*<div class="project-card reveal[^"]*">)\\s*(<div class="project-card__number">)`);
      h = h.replace(cardPattern, `$1\n          <div class="project-card__image">\n            ${imgSvg}\n            <span>${img}</span>\n          </div>\n          $2`);
    });

    // Close projects-grid before </div></section> of projects-section
    // Find the last project card's closing services div and add grid close
    const projSectionEnd = h.match(/(        <\/div>\s*<\/div>\s*)\s*(<\/div>\s*<\/section>\s*\n\s*<!-- ============ SECTION 6)/);
    if (projSectionEnd) {
      h = h.replace(projSectionEnd[0], projSectionEnd[1] + '\n      </div>\n    ' + projSectionEnd[2]);
    }
  }

  // Remove margin-bottom from project-card if old style had it
  // (Already handled by CSS replacement)

  // 9. Image band before FAQ
  h = h.replace(
    '  <!-- ============ SECTION 8: FAQ ============ -->',
    `  <!-- ============ CHANGE 8: IMAGE BAND between Quality and FAQ ============ -->
  <section class="image-band image-band--alt">
    <div class="container">
      <div class="image-band__placeholder">
        ${imgSvg}
        <span>${cfg.imageBand2}</span>
      </div>
    </div>
  </section>

  <!-- ============ SECTION 8: FAQ ============ -->`
  );

  // Remove any grid-column style on quality cards (aerospace has one)
  h = h.replace(/ style="grid-column: 1 \/ -1;"/g, '');

  fs.writeFileSync(filePath, h, 'utf8');
  console.log('OK: ' + path.basename(filePath) + ' (' + h.split('\n').length + ' lines)');
}

const base = '05-website/ems/industries/';

// ENERGY
transform(base + 'energy.html', {
  cssTitle: 'Energy Sector',
  heroImage: 'Photo: Energy equipment cabinet assembly with power distribution and control wiring',
  stats: [
    { num: '48 hrs', label: 'RFQ Response' },
    { num: '40&ndash;60%', label: 'Lower labor costs vs. U.S.' },
    { num: '1&ndash;2 Days', label: 'Monterrey to U.S.' },
    { num: '1 Timezone', label: 'Same hours as your team' }
  ],
  contextImage: 'Photo: Power distribution cabinet with bus bar installation and cable management',
  imageBand1: 'Photo: GPW technician wiring energy equipment cabinet with torque-verified connections',
  imageBand2: 'Photo: GPW Monterrey facility \u2014 energy sector assembly area with cabinet testing stations',
  projectImages: [
    'Photo: Utility-scale power distribution cabinet with bus bar assembly',
    'Photo: BESS cabinet assembly with thermal management system',
    'Photo: Solar combiner box with DC bus and monitoring board'
  ]
});

// AEROSPACE
transform(base + 'aerospace.html', {
  cssTitle: 'Aerospace Sub-Assemblies',
  heroImage: 'Photo: Aerospace sub-assembly with full traceability documentation and precision fixtures',
  stats: [
    { num: '48 hrs', label: 'RFQ Response' },
    { num: '100%', label: 'Full Traceability' },
    { num: '1&ndash;2 Days', label: 'Monterrey to U.S.' },
    { num: '1 Timezone', label: 'Same hours as your team' }
  ],
  contextImage: 'Photo: Traceable aerospace wire harness assembly with serialized components',
  imageBand1: 'Photo: GPW technician performing aerospace cable harness continuity testing',
  imageBand2: 'Photo: GPW Monterrey facility \u2014 controlled assembly environment for aerospace programs',
  projectImages: [
    'Photo: Aircraft wire harness family assembled on dedicated harness boards',
    'Photo: Avionics junction box with mil-spec connectors and EMI shielding',
    'Photo: UAV power distribution harness with sealed connectors'
  ]
});

// APPLIANCES
transform(base + 'appliances-white-goods.html', {
  cssTitle: 'Appliances & White Goods',
  heroImage: 'Photo: High-volume appliance assembly line with rapid changeover stations',
  stats: [
    { num: '48 hrs', label: 'RFQ Response' },
    { num: '40&ndash;60%', label: 'Lower labor costs vs. U.S.' },
    { num: '1&ndash;2 Days', label: 'Monterrey to U.S.' },
    { num: '1 Timezone', label: 'Same hours as your team' }
  ],
  contextImage: 'Photo: Appliance control panel assembly with automated test station',
  imageBand1: 'Photo: GPW assembly cell performing rapid changeover between appliance models',
  imageBand2: 'Photo: GPW Monterrey facility \u2014 high-volume assembly floor with multiple production cells',
  projectImages: [
    'Photo: Refrigerator control board assembly with automated test fixture',
    'Photo: HVAC system wire harness on dedicated assembly board',
    'Photo: Smart washer user interface module with touchscreen display'
  ]
});

console.log('\nAll 3 pages transformed successfully!');
