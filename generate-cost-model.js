// Generates the GPW Cost Study 2026 XLSX cost model (hybrid LIVE model).
//
// Rebuilt 2026-06-12 (see .scratch/cost-model-rebuild-20260612/ for the prior version):
//   - Every coral input now drives a formula (no dead/decorative cells).
//   - Net landed savings is COMPUTED bottom-up from labor + overhead + material
//     composition, minus overland landed adders. No hardcoded savings constants.
//   - Tier shares are percent-formatted with data validation + a 100% sum check
//     (kills the "type 25 -> 25x blowup" trap).
//   - Labor comparison is like-for-like (US CNC operator vs MX semi-skilled operator;
//     US engineer vs MX manufacturing engineer) and conservative.
//   - "Cross-border" language removed -> "overland" (brand rule, matches the blog).
//   - Numbers refreshed: BLS OEWS May 2025, BLS ECEC Dec 2025, Tetakawi 2026,
//     post-IEEPA tariff reality (SCOTUS Feb 2026) with a volatility caveat.
//
// Output 1 (archive): 05_Operaciones/Investigacion Manufactura/Cost Study 2026 Q2/cost-model-2026.xlsx
// Output 2 (served / downloaded from the blog post):
//   08_Pagina Web/05-website/blog/cnc-cost-mexico-vs-us-2026/cost-model-2026.xlsx

const ExcelJS = require('exceljs');
const path = require('path');
const fs = require('fs');

const TEAL = 'FF23555A';
const CORAL = 'FFED835E';
const DEEP_BLUE = 'FF2A4E64';
const LIME = 'FFADCF91';
const OFF_WHITE = 'FFF7F9FA';
const NEAR_BLACK = 'FF1A1A1A';
const MID_GRAY = 'FF6E7479';
const LIGHT_GRAY = 'FFD9DEE0';
const WHITE = 'FFFFFFFF';
const INPUT_FILL = 'FFFEE2D6'; // light coral = editable
const REF_FILL = 'FFEFF1F2';   // light gray = reference / computed-helper

async function build() {
  const wb = new ExcelJS.Workbook();
  wb.creator = 'Global Precision Works';
  wb.lastModifiedBy = 'GPW Cost Study 2026';
  wb.created = new Date();
  wb.modified = new Date();
  wb.title = 'GPW CNC Cost Model 2026';
  wb.subject = 'Mexico vs U.S. CNC Manufacturing Total Landed Cost';
  wb.company = 'Global Precision Works';
  wb.calcProperties.fullCalcOnLoad = true; // force Excel to recompute every formula on open

  // ======================================================================
  // SHEET 1 — Cover
  // ======================================================================
  const cover = wb.addWorksheet('Cover', {
    pageSetup: { orientation: 'portrait', fitToPage: true },
    views: [{ showGridLines: false }],
  });
  cover.columns = [{ width: 12 }, { width: 30 }, { width: 30 }, { width: 30 }, { width: 12 }];

  cover.mergeCells('A1:E2');
  cover.getCell('A1').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: TEAL } };

  cover.mergeCells('B4:D4');
  const t = cover.getCell('B4');
  t.value = 'GPW CNC Cost Model 2026';
  t.font = { name: 'Lato', size: 26, bold: true, color: { argb: TEAL } };
  t.alignment = { horizontal: 'left', vertical: 'middle' };

  cover.mergeCells('B5:D5');
  const sub = cover.getCell('B5');
  sub.value = 'Mexico vs U.S. CNC Manufacturing — Total Landed Cost';
  sub.font = { name: 'Lato', size: 14, color: { argb: MID_GRAY } };

  cover.mergeCells('B7:D7');
  cover.getCell('B7').value = 'How to use this model';
  cover.getCell('B7').font = { name: 'Lato', size: 12, bold: true, color: { argb: CORAL } };

  cover.mergeCells('B8:D15');
  const instr = cover.getCell('B8');
  instr.value =
    '1. Open the "Inputs" sheet. Edit only the cells highlighted in coral — they all feed live formulas, so every output recalculates as you type. Gray cells are computed helpers; do not edit them.\n\n' +
    '2. Start with the three coral cells that matter most: your part-complexity mix (Tier A/B/C share) and your annual CNC spend. Then refine the wage, shop-rate, overhead, material and freight assumptions to your own situation if you want.\n\n' +
    '3. Open "Tier Analysis" to see your computed net landed savings by part complexity, and the labor-cost convergence that drives it.\n\n' +
    '4. Open "Sources" for a citation link and access date for every datapoint.\n\n' +
    'Tip: the Tier A/B/C shares must add to 100% — a check cell on the Inputs sheet flags it in red if they do not.';
  instr.alignment = { wrapText: true, vertical: 'top' };
  instr.font = { name: 'Lato', size: 11 };

  cover.mergeCells('B17:D18');
  cover.getCell('B17').value =
    'Headline: up to ~80% on labor and 25–45% on total landed cost vs U.S. domestic — about 27% on a typical OEM part mix (the model computes your exact figure).';
  cover.getCell('B17').font = { name: 'Lato', size: 12, bold: true, color: { argb: DEEP_BLUE } };
  cover.getCell('B17').alignment = { wrapText: true, vertical: 'top' };
  cover.getRow(17).height = 35;

  cover.mergeCells('B20:D20');
  cover.getCell('B20').value = 'Updated June 12, 2026 · Quarterly refresh planned · Tariff figures are volatile — see note on the Inputs sheet';
  cover.getCell('B20').font = { name: 'Lato', size: 10, italic: true, color: { argb: MID_GRAY } };
  cover.getCell('B20').alignment = { wrapText: true };

  cover.mergeCells('B22:D24');
  const contact = cover.getCell('B22');
  contact.value = 'Global Precision Works (GPW)\nMonterrey, Nuevo León, Mexico\nsales@gpw-solutions.com\nhttps://gpw-solutions.com';
  contact.font = { name: 'Lato', size: 10, color: { argb: TEAL } };
  contact.alignment = { wrapText: true, vertical: 'top' };

  // ======================================================================
  // SHEET 2 — Inputs
  // ======================================================================
  const inputs = wb.addWorksheet('Inputs', { views: [{ showGridLines: false }] });
  inputs.columns = [
    { header: '', width: 4 },
    { header: 'Input', width: 42 },
    { header: 'Value', width: 16 },
    { header: 'Unit', width: 12 },
    { header: 'Source / note', width: 62 },
  ];

  function header(row, text) {
    inputs.mergeCells(`B${row}:E${row}`);
    const c = inputs.getCell(`B${row}`);
    c.value = text;
    c.font = { name: 'Lato', size: 12, bold: true, color: { argb: WHITE } };
    c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: TEAL } };
    c.alignment = { vertical: 'middle' };
    inputs.getRow(row).height = 22;
  }
  // kind: 'input' (coral, editable) | 'ref' (gray, reference only — NOT used by a formula)
  function row(r, label, value, unit, source, kind = 'input', numFmt = null, validation = null) {
    inputs.getCell(`B${r}`).value = label;
    inputs.getCell(`B${r}`).font = { name: 'Lato', size: 11 };
    const v = inputs.getCell(`C${r}`);
    v.value = value;
    v.alignment = { horizontal: 'right' };
    v.font = { name: 'Lato', size: 11, bold: kind === 'input' };
    if (numFmt) v.numFmt = numFmt;
    if (kind === 'input') {
      v.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: INPUT_FILL } };
      v.border = {
        top: { style: 'thin', color: { argb: CORAL } }, bottom: { style: 'thin', color: { argb: CORAL } },
        left: { style: 'thin', color: { argb: CORAL } }, right: { style: 'thin', color: { argb: CORAL } },
      };
    } else if (kind === 'ref') {
      v.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: REF_FILL } };
      v.font = { name: 'Lato', size: 11, color: { argb: MID_GRAY } };
    }
    if (validation) v.dataValidation = validation;
    inputs.getCell(`D${r}`).value = unit;
    inputs.getCell(`D${r}`).font = { name: 'Lato', size: 10, color: { argb: MID_GRAY } };
    inputs.getCell(`E${r}`).value = source;
    inputs.getCell(`E${r}`).font = { name: 'Lato', size: 9, italic: true, color: { argb: MID_GRAY } };
    inputs.getCell(`E${r}`).alignment = { wrapText: true, vertical: 'top' };
  }

  const pct0to1 = { type: 'decimal', operator: 'between', formulae: [0, 1], allowBlank: false,
    showErrorMessage: true, errorTitle: 'Out of range', error: 'Enter a value between 0 and 1 (e.g. 0.25 = 25%).' };
  const ratio0to2 = { type: 'decimal', operator: 'between', formulae: [0, 2], allowBlank: false,
    showErrorMessage: true, errorTitle: 'Out of range', error: 'Enter a ratio (e.g. 1.00 = parity, 1.15 = +15%).' };

  inputs.mergeCells('B2:E2');
  inputs.getCell('B2').value = 'Edit only the coral cells — they all feed live formulas. Gray cells are reference only. Defaults reflect Q2 2026 published data.';
  inputs.getCell('B2').font = { name: 'Lato', size: 10, italic: true, color: { argb: MID_GRAY } };

  // --- U.S. LABOR ---  (rows 5-8)
  header(4, 'U.S. CNC LABOR (BLS OEWS May 2025 + ECEC Dec 2025)');
  row(5, 'CNC Tool Operator — median wage', 24.37, 'USD/hr', 'BLS OEWS May 2025, SOC 51-9161');
  row(6, 'Machinist — median wage', 28.24, 'USD/hr', 'BLS OEWS May 2025, SOC 51-4041 (reference)', 'ref');
  row(7, 'Industrial Engineer — median wage', 49.25, 'USD/hr', 'BLS OEWS May 2025, SOC 17-2112');
  row(8, 'Benefits load multiplier (×wages)', 1.426, 'multiplier',
    'BLS ECEC Dec 2025: benefits = 29.9% of total comp (all-private-industry; conservative proxy — manufacturing runs ~31–32%)');

  // --- MEXICO LABOR ---  (rows 11-13)
  header(10, 'MEXICO CNC LABOR (Tetakawi 2026 benchmark, fully fringed)');
  row(11, 'Semi-skilled CNC operator', 6.82, 'USD/hr', 'Tetakawi 2026 Wage Benchmark (accessed Jun 2026)');
  row(12, 'Manufacturing engineer', 23.42, 'USD/hr', 'Tetakawi 2026 Wage Benchmark (accessed Jun 2026)');
  row(13, 'Entry-level operator', 5.56, 'USD/hr', 'Tetakawi 2026 (reference only)', 'ref');

  // --- SAVINGS DRIVERS ---  (rows 16-19)
  header(15, 'SAVINGS DRIVERS (MX vs U.S.)');
  row(16, 'Overhead / indirect savings', 0.20, 'ratio',
    'GPW conservative estimate — facility, utilities, indirect & engineering labor cheaper in MX; machine capital & tooling at parity', 'input', '0%', pct0to1);
  row(17, 'Material cost (MX ÷ US)', 1.00, 'ratio',
    '±5% on common metals; +5–15% on specialty alloys (1.00 = parity)', 'input', '0.00', ratio0to2);
  row(18, 'U.S. CNC shop loaded rate (cross-check)', 90, 'USD/hr', 'NTMA/PMA member surveys, range $80–$140');
  row(19, 'Mexico CNC shop loaded rate (cross-check)', 60, 'USD/hr', 'GPW network benchmark, range $45–$80');

  // --- PART-COST COMPOSITION BY TIER ---  (header 21; table 22-25)
  header(21, 'PART-COST COMPOSITION BY TIER (each row must sum to 100%)');
  // sub-header
  inputs.getCell('B22').value = 'Tier';
  inputs.getCell('C22').value = 'Direct labor';
  inputs.getCell('D22').value = 'Overhead';
  inputs.getCell('E22').value = 'Material';
  ['B22', 'C22', 'D22', 'E22'].forEach((a) => {
    inputs.getCell(a).font = { name: 'Lato', size: 10, bold: true, color: { argb: DEEP_BLUE } };
    inputs.getCell(a).alignment = { horizontal: a === 'B22' ? 'left' : 'right' };
  });
  const comp = [
    [23, 'A — simple, material-heavy', 0.15, 0.25, 0.60],
    [24, 'B — medium, multi-setup', 0.28, 0.30, 0.42],
    [25, 'C — complex, 5-axis / tight tol.', 0.46, 0.32, 0.22],
  ];
  comp.forEach(([rr, label, l, o, m]) => {
    inputs.getCell(`B${rr}`).value = label;
    inputs.getCell(`B${rr}`).font = { name: 'Lato', size: 11 };
    [['C', l], ['D', o], ['E', m]].forEach(([col, val]) => {
      const c = inputs.getCell(`${col}${rr}`);
      c.value = val;
      c.numFmt = '0%';
      c.alignment = { horizontal: 'right' };
      c.font = { name: 'Lato', size: 11, bold: true };
      c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: INPUT_FILL } };
      c.border = {
        top: { style: 'thin', color: { argb: CORAL } }, bottom: { style: 'thin', color: { argb: CORAL } },
        left: { style: 'thin', color: { argb: CORAL } }, right: { style: 'thin', color: { argb: CORAL } },
      };
      c.dataValidation = pct0to1;
    });
    // row sum check in column F
    const chk = inputs.getCell(`F${rr}`);
    chk.value = { formula: `IF(ABS(C${rr}+D${rr}+E${rr}-1)<0.005,"✓ 100%","⚠ "&TEXT((C${rr}+D${rr}+E${rr}),"0%"))` };
    chk.font = { name: 'Lato', size: 9, italic: true, color: { argb: MID_GRAY } };
  });
  inputs.getCell('B26').value = 'Composition = how a typical part of that tier breaks down by cost element. Anchored to BLS/BCG machining cost structure; edit to your parts.';
  inputs.getCell('B26').font = { name: 'Lato', size: 9, italic: true, color: { argb: MID_GRAY } };
  inputs.mergeCells('B26:E26');

  // --- LANDED-COST ADDERS ---  (rows 28-33)
  header(28, 'LANDED-COST ADDERS (overland freight, USMCA in-house)');
  row(29, 'Overland freight per part (incremental)', 1.00, 'USD/part',
    'C.H. Robinson + USDA overland freight data 2025 — order-of-magnitude; varies by part size/density/load fill');
  row(30, 'Customs broker per shipment', 100, 'USD/shipment', 'CBP / industry standard $75–$150 (excludes govt MPF & duties)');
  row(31, 'Avg parts per shipment', 100, 'parts', 'Adjust to your typical order quantity');
  row(32, 'Inventory carry per part (incremental)', 0.50, 'USD/part', 'Negligible for most cases');
  row(33, 'Avg part unit price', 100, 'USD/part', 'Used to express the adders as a % of part cost — edit to your typical unit price');
  row(34, 'USMCA filing cost', 0, 'USD/shipment', 'Handled in-house (no incremental cost)');

  // --- TARIFF SCENARIO ---  (rows 37-39)
  header(36, 'TARIFF SCENARIO (optional — only when comparing vs an OFFSHORE origin)');
  row(37, 'USMCA preferential rate (MX-origin, qualifying)', 0, '%',
    'USTR / CBP — 0% requires meeting USMCA rules of origin (HTSUS Gen. Note 11)', 'input', '0%', pct0to1);
  row(38, 'China stack on machined metal parts', 0.35, '%',
    'Sec 301 25% + Sec 122 10% ≈ 35%; +Sec 232 50% on steel/alu content. Post-IEEPA (SCOTUS Feb 2026). VOLATILE — verify before quoting', 'input', '0%', pct0to1);
  row(39, 'U.S. domestic baseline', 0, '%', 'No tariff (domestic supply)', 'input', '0%', pct0to1);

  // --- YOUR PORTFOLIO ---  (rows 42-46)
  header(41, 'YOUR PORTFOLIO');
  row(42, 'Tier A (simple) share of spend', 0.25, '% of spend', 'Default: typical OEM mix', 'input', '0%', pct0to1);
  row(43, 'Tier B (medium) share of spend', 0.50, '% of spend', 'Default: typical OEM mix', 'input', '0%', pct0to1);
  row(44, 'Tier C (complex) share of spend', 0.25, '% of spend', 'Default: typical OEM mix', 'input', '0%', pct0to1);
  // sum check (computed helper, gray)
  inputs.getCell('B45').value = 'Shares total (must = 100%)';
  inputs.getCell('B45').font = { name: 'Lato', size: 11, bold: true };
  const sumCell = inputs.getCell('C45');
  sumCell.value = { formula: 'C42+C43+C44' };
  sumCell.numFmt = '0%';
  sumCell.alignment = { horizontal: 'right' };
  sumCell.font = { name: 'Lato', size: 11, bold: true };
  inputs.getCell('D45').value = '%';
  inputs.getCell('D45').font = { name: 'Lato', size: 10, color: { argb: MID_GRAY } };
  inputs.getCell('E45').value = { formula: 'IF(ABS(C45-1)<0.005,"✓ OK","⚠ Adjust shares to total 100%")' };
  inputs.getCell('E45').font = { name: 'Lato', size: 9, italic: true, color: { argb: MID_GRAY } };
  // conditional formatting: red if shares != 100%
  inputs.addConditionalFormatting({
    ref: 'C45',
    rules: [{
      type: 'expression', formulae: ['ABS($C$45-1)>=0.005'], priority: 1,
      style: { fill: { type: 'pattern', pattern: 'solid', bgColor: { argb: 'FFF8C9BC' } },
        font: { color: { argb: 'FFB03A1A' }, bold: true } },
    }],
  });

  row(46, 'Annual CNC machining spend', 500000, 'USD', 'Edit to your actual annual spend', 'input', '"$"#,##0');

  // ======================================================================
  // SHEET 3 — Tier Analysis  (everything here is COMPUTED from Inputs)
  // ======================================================================
  const tier = wb.addWorksheet('Tier Analysis', { views: [{ showGridLines: false }] });
  tier.columns = [
    { header: '', width: 4 },
    { header: 'Tier', width: 30 },
    { header: 'Part-cost savings', width: 16 },
    { header: 'Less landed adders', width: 16 },
    { header: 'Net landed savings', width: 16 },
    { header: 'Your spend', width: 15 },
    { header: 'Your savings', width: 16 },
  ];

  tier.mergeCells('B2:G2');
  tier.getCell('B2').value = 'Your Total Landed Cost Savings by Part Complexity';
  tier.getCell('B2').font = { name: 'Lato', size: 16, bold: true, color: { argb: TEAL } };

  tier.mergeCells('B3:G3');
  tier.getCell('B3').value = 'Every figure below is computed live from the Inputs sheet. Change your mix and spend (Inputs) and these update.';
  tier.getCell('B3').font = { name: 'Lato', size: 10, italic: true, color: { argb: MID_GRAY } };

  // header row 5
  const hdr = ['Tier', 'Part-cost savings', 'Less landed adders', 'Net landed savings', 'Your spend', 'Your savings'];
  hdr.forEach((h, i) => {
    const c = tier.getCell(5, i + 2);
    c.value = h;
    c.font = { name: 'Lato', size: 11, bold: true, color: { argb: WHITE } };
    c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: TEAL } };
    c.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
  });
  tier.getRow(5).height = 30;

  // Helper cells (defined first so the tier formulas can reference them):
  //   G18 = direct-labor savings (from convergence, CNC operator row)
  //   G21 = landed adders as % of avg part price
  // tier part-cost savings(tier) = labor%*G18 + overhead%*Inputs!C16 + material%*(1-Inputs!C17)
  const tierRows = [
    [6, 'A — simple, material-heavy', 'C23', 'D23', 'E23', 'C42'],
    [7, 'B — medium, multi-setup', 'C24', 'D24', 'E24', 'C43'],
    [8, 'C — complex, 5-axis / tight tol.', 'C25', 'D25', 'E25', 'C44'],
  ];
  tierRows.forEach(([rr, label, lc, oc, mc, share]) => {
    tier.getCell(`B${rr}`).value = label;
    tier.getCell(`B${rr}`).font = { name: 'Lato', size: 11, bold: true };
    // C = part-cost savings
    const c = tier.getCell(`C${rr}`);
    c.value = { formula: `Inputs!${lc}*$G$18 + Inputs!${oc}*Inputs!C16 + Inputs!${mc}*(1-Inputs!C17)` };
    c.numFmt = '0.0%'; c.alignment = { horizontal: 'right' };
    // D = landed adders %
    const d = tier.getCell(`D${rr}`);
    d.value = { formula: '$G$21' };
    d.numFmt = '0.0%'; d.alignment = { horizontal: 'right' }; d.font = { color: { argb: MID_GRAY } };
    // E = net landed savings
    const e = tier.getCell(`E${rr}`);
    e.value = { formula: `C${rr}-D${rr}` };
    e.numFmt = '0.0%'; e.alignment = { horizontal: 'right' }; e.font = { bold: true, color: { argb: DEEP_BLUE } };
    // F = your spend
    const f = tier.getCell(`F${rr}`);
    f.value = { formula: `Inputs!C46*Inputs!${share}` };
    f.numFmt = '"$"#,##0'; f.alignment = { horizontal: 'right' };
    // G = your savings
    const g = tier.getCell(`G${rr}`);
    g.value = { formula: `F${rr}*E${rr}` };
    g.numFmt = '"$"#,##0'; g.alignment = { horizontal: 'right' }; g.font = { bold: true, color: { argb: CORAL } };
  });

  // weighted total row 10
  tier.mergeCells('B10:E10');
  tier.getCell('B10').value = 'WEIGHTED TOTAL (your portfolio)';
  tier.getCell('B10').font = { bold: true, color: { argb: WHITE } };
  tier.getCell('B10').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: DEEP_BLUE } };
  tier.getCell('B10').alignment = { horizontal: 'right' };
  const fTot = tier.getCell('F10');
  fTot.value = { formula: 'SUM(F6:F8)' };
  fTot.numFmt = '"$"#,##0'; fTot.font = { bold: true, color: { argb: WHITE } };
  fTot.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: DEEP_BLUE } };
  fTot.alignment = { horizontal: 'right' };
  const gTot = tier.getCell('G10');
  gTot.value = { formula: 'SUM(G6:G8)' };
  gTot.numFmt = '"$"#,##0'; gTot.font = { bold: true, color: { argb: CORAL } };
  gTot.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: DEEP_BLUE } };
  gTot.alignment = { horizontal: 'right' };
  tier.getRow(10).height = 24;

  // weighted % of spend (row 11)
  tier.getCell('B11').value = 'Weighted net landed savings (% of spend)';
  tier.getCell('B11').font = { name: 'Lato', size: 11, bold: true };
  const wpct = tier.getCell('F11');
  wpct.value = { formula: 'G10/F10' };
  wpct.numFmt = '0.0%'; wpct.font = { bold: true, color: { argb: CORAL } }; wpct.alignment = { horizontal: 'right' };

  // methodology note
  tier.mergeCells('B13:G14');
  tier.getCell('B13').value =
    'Methodology: Part-cost savings = (direct-labor share × labor savings) + (overhead share × overhead savings) + (material share × material savings), per the composition on the Inputs sheet. Net landed savings then subtracts overland freight, brokerage and inventory carry expressed as a % of average part price. Conservative by design — it does not include any tariff advantage vs U.S. domestic (USMCA = 0% either way).';
  tier.getCell('B13').font = { name: 'Lato', size: 9, italic: true, color: { argb: MID_GRAY } };
  tier.getCell('B13').alignment = { wrapText: true, vertical: 'top' };

  // ---- Labor Cost Convergence (drives direct-labor savings G18) ----
  tier.mergeCells('B16:G16');
  tier.getCell('B16').value = 'Labor Cost Convergence (drives the direct-labor savings above)';
  tier.getCell('B16').font = { name: 'Lato', size: 14, bold: true, color: { argb: TEAL } };

  const lh = 17;
  ['Role', 'U.S. wage (BLS)', 'U.S. fully-loaded', 'MX fully-fringed', 'MX as % of US', 'Labor savings'].forEach((h, i) => {
    const c = tier.getCell(lh, i + 2);
    c.value = h;
    c.font = { name: 'Lato', size: 10, bold: true, color: { argb: WHITE } };
    c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: TEAL } };
    c.alignment = { horizontal: 'center', wrapText: true };
  });
  // row 18 — CNC Operator (this row's labor-savings G18 is the driver used above)
  // row 19 — Manufacturing Engineer (context: shows engineering labor saves less)
  const conv = [
    [18, 'CNC Operator (production)', 'Inputs!C5', 'Inputs!C11'],
    [19, 'Manufacturing Engineer (context)', 'Inputs!C7', 'Inputs!C12'],
  ];
  conv.forEach(([rr, role, usw, mxw]) => {
    tier.getCell(`B${rr}`).value = role;
    tier.getCell(`B${rr}`).font = { name: 'Lato', size: 11 };
    tier.getCell(`C${rr}`).value = { formula: usw };
    tier.getCell(`C${rr}`).numFmt = '"$"#,##0.00"/hr"';
    tier.getCell(`D${rr}`).value = { formula: `${usw}*Inputs!C8` };
    tier.getCell(`D${rr}`).numFmt = '"$"#,##0.00"/hr"';
    tier.getCell(`E${rr}`).value = { formula: mxw };
    tier.getCell(`E${rr}`).numFmt = '"$"#,##0.00"/hr"';
    tier.getCell(`F${rr}`).value = { formula: `E${rr}/D${rr}` };
    tier.getCell(`F${rr}`).numFmt = '0%';
    tier.getCell(`G${rr}`).value = { formula: `1-F${rr}` };
    tier.getCell(`G${rr}`).numFmt = '0%';
    tier.getCell(`G${rr}`).font = { bold: rr === 18, color: { argb: CORAL } };
  });
  tier.mergeCells('B20:G20');
  tier.getCell('B20').value =
    'The model uses the CNC-operator saving (the direct production labor in a machined part) as its direct-labor driver. Engineering/indirect labor (shown for context, ~67% cheaper) is captured in the lower "overhead savings" assumption, not the direct-labor line.';
  tier.getCell('B20').font = { name: 'Lato', size: 9, italic: true, color: { argb: MID_GRAY } };
  tier.getCell('B20').alignment = { wrapText: true, vertical: 'top' };

  // ---- helper cells G21 (landed adder %) + cross-checks ----
  tier.getCell('B22').value = 'Landed adders as % of avg part price';
  tier.getCell('B22').font = { name: 'Lato', size: 10, color: { argb: MID_GRAY } };
  const ladd = tier.getCell('G21'); // referenced by D6:D8
  ladd.value = { formula: '(Inputs!C29 + (Inputs!C30+Inputs!C34)/Inputs!C31 + Inputs!C32)/Inputs!C33' };
  ladd.numFmt = '0.0%';
  ladd.font = { name: 'Lato', size: 10, color: { argb: MID_GRAY } };
  // place a visible label next to G21
  tier.getCell('F21').value = 'Landed adder %:';
  tier.getCell('F21').font = { name: 'Lato', size: 9, italic: true, color: { argb: MID_GRAY } };
  tier.getCell('F21').alignment = { horizontal: 'right' };

  // blended shop-rate savings cross-check (uses the two shop-rate inputs so they're live)
  tier.getCell('F22').value = 'Shop-rate cross-check:';
  tier.getCell('F22').font = { name: 'Lato', size: 9, italic: true, color: { argb: MID_GRAY } };
  tier.getCell('F22').alignment = { horizontal: 'right' };
  const xchk = tier.getCell('G22');
  xchk.value = { formula: '1-Inputs!C19/Inputs!C18' };
  xchk.numFmt = '0%';
  xchk.font = { name: 'Lato', size: 10, color: { argb: MID_GRAY } };

  // ---- Tariff differential (optional; uses the tariff-scenario inputs) ----
  tier.mergeCells('B24:G24');
  tier.getCell('B24').value = 'Tariff Differential (optional — only when comparing vs an OFFSHORE origin)';
  tier.getCell('B24').font = { name: 'Lato', size: 12, bold: true, color: { argb: TEAL } };
  // vs offshore (China) — duty avoided
  tier.getCell('B25').value = 'Duty avoided vs China-origin (on the dutiable part value)';
  tier.getCell('B25').font = { name: 'Lato', size: 11 };
  const dvsChina = tier.getCell('G25');
  dvsChina.value = { formula: 'Inputs!C38-Inputs!C37' };
  dvsChina.numFmt = '0%'; dvsChina.alignment = { horizontal: 'right' };
  dvsChina.font = { bold: true, color: { argb: CORAL } };
  // vs US domestic — no tariff advantage (both 0%)
  tier.getCell('B26').value = 'Duty advantage vs U.S. domestic (none — both 0%)';
  tier.getCell('B26').font = { name: 'Lato', size: 11 };
  const dvsUS = tier.getCell('G26');
  dvsUS.value = { formula: 'Inputs!C37-Inputs!C39' };
  dvsUS.numFmt = '0%'; dvsUS.alignment = { horizontal: 'right' };
  dvsUS.font = { color: { argb: MID_GRAY } };
  tier.mergeCells('B27:G28');
  tier.getCell('B27').value =
    'Shown separately because a tariff advantage exists only against offshore (e.g., China) supply, not against U.S. domestic. The net landed savings above deliberately exclude it. Tariff figures are post-IEEPA (SCOTUS Feb 2026) and volatile — verify the China stack before quoting.';
  tier.getCell('B27').font = { name: 'Lato', size: 9, italic: true, color: { argb: MID_GRAY } };
  tier.getCell('B27').alignment = { wrapText: true, vertical: 'top' };

  // ======================================================================
  // SHEET 4 — Sources
  // ======================================================================
  const src = wb.addWorksheet('Sources', { views: [{ showGridLines: false }] });
  src.columns = [
    { header: '', width: 4 },
    { header: 'ID', width: 10 },
    { header: 'Source', width: 58 },
    { header: 'URL', width: 70 },
    { header: 'Used in', width: 24 },
  ];

  src.mergeCells('B2:E2');
  src.getCell('B2').value = 'Sources Used in This Model';
  src.getCell('B2').font = { name: 'Lato', size: 16, bold: true, color: { argb: TEAL } };

  src.mergeCells('B3:E3');
  src.getCell('B3').value = 'Accessed June 2026. Quarterly refresh planned. Tariff figures are volatile (post-IEEPA) — re-verify before quoting.';
  src.getCell('B3').font = { name: 'Lato', size: 10, italic: true, color: { argb: MID_GRAY } };

  const sources = [
    ['BLS-1', 'BLS OEWS May 2025 — National occupational wages', 'https://www.bls.gov/oes/current/oes_nat.htm', 'U.S. wages'],
    ['BLS-2', 'BLS Employer Costs for Employee Compensation (Dec 2025)', 'https://www.bls.gov/news.release/ecec.htm', 'Fully-loaded multiplier'],
    ['MX-1', 'Tetakawi Manufacturing Wages in Mexico 2026 benchmark', 'https://insights.tetakawi.com/manufacturing-wages-in-mexico-2025-2026-executive-benchmark-guide', 'Mexico wages'],
    ['Cost-1', 'BCG: Shifting Dynamics of Nearshoring in Mexico (2024)', 'https://www.bcg.com/publications/2024/shifting-dynamics-of-nearshoring-in-mexico', 'Cost composition'],
    ['Cost-2', 'Reshoring Initiative TCO Estimator framework', 'https://www.reshorenow.org/tco-estimator/', 'TCO methodology'],
    ['Resh-1', 'Reshoring Initiative 2024 Annual Report', 'https://reshorenow.org/june-9-2025/', 'Reshoring trends'],
    ['Resh-2', 'Kearney 2025 Reshoring Index', 'https://www.kearney.com/service/operations-performance/us-reshoring-index', 'Wage convergence'],
    ['Trade-1', 'USTR Section 301 enforcement actions', 'https://ustr.gov/issue-areas/enforcement/section-301-investigations', 'Tariff scenario'],
    ['Trade-2', 'CBP — USMCA (rules of origin, duty-free)', 'https://www.cbp.gov/trade/usmca', 'USMCA filing'],
    ['Trade-3', 'CBP — Section 232 steel/aluminum tariffs FAQ', 'https://www.cbp.gov/trade/programs-administration/entry-summary/232-tariffs-aluminum-and-steel-faqs', 'Tariff scenario'],
    ['Freight-1', 'C.H. Robinson North America Freight Market Update, April 2025', 'https://www.chrobinson.com/en-us/resources/insights-and-advisories/north-america-freight-insights/apr-2025-freight-market-update/addl-supply-chain-updates/cross-border/', 'Overland freight (qualitative)'],
    ['Freight-2', 'CBP — Customs broker user fees', 'https://www.cbp.gov/trade/programs-administration/customs-brokers/fees', 'Brokerage'],
  ];

  ['ID', 'Source', 'URL', 'Used in'].forEach((h, i) => {
    const c = src.getCell(5, i + 2);
    c.value = h;
    c.font = { name: 'Lato', size: 11, bold: true, color: { argb: WHITE } };
    c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: TEAL } };
  });

  sources.forEach((s, idx) => {
    const rr = 6 + idx;
    src.getCell(`B${rr}`).value = s[0];
    src.getCell(`B${rr}`).font = { bold: true, color: { argb: CORAL } };
    src.getCell(`C${rr}`).value = s[1];
    src.getCell(`C${rr}`).font = { name: 'Lato', size: 10 };
    src.getCell(`C${rr}`).alignment = { wrapText: true, vertical: 'top' };
    src.getCell(`D${rr}`).value = { text: s[2], hyperlink: s[2] };
    src.getCell(`D${rr}`).font = { color: { argb: TEAL }, underline: true, size: 9 };
    src.getCell(`D${rr}`).alignment = { wrapText: true, vertical: 'top' };
    src.getCell(`E${rr}`).value = s[3];
    src.getCell(`E${rr}`).font = { italic: true, color: { argb: MID_GRAY }, size: 10 };
  });

  // ======================================================================
  // Save
  // ======================================================================
  const outPath1 = path.join(
    __dirname, '..', '05_Operaciones', 'Investigacion Manufactura', 'Cost Study 2026 Q2', 'cost-model-2026.xlsx'
  );
  // Served copy: the blog post links to ./cost-model-2026.xlsx from
  // 05-website/blog/cnc-cost-mexico-vs-us-2026/  (post-restructure path).
  const outPath2 = path.join(
    __dirname, '05-website', 'blog', 'cnc-cost-mexico-vs-us-2026', 'cost-model-2026.xlsx'
  );

  fs.mkdirSync(path.dirname(outPath1), { recursive: true });
  fs.mkdirSync(path.dirname(outPath2), { recursive: true });

  await wb.xlsx.writeFile(outPath1);
  console.log('✓ Wrote archive:', outPath1);
  await wb.xlsx.writeFile(outPath2);
  console.log('✓ Wrote served :', outPath2);

  console.log('\nDone. Open in Excel to verify live recalculation (all formulas recompute on load).');
}

build().catch((err) => {
  console.error('Failed:', err);
  process.exit(1);
});
