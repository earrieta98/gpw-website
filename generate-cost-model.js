// Generates the GPW Cost Study 2026 XLSX cost model.
// Output: 05_Operaciones/Investigacion Manufactura/Cost Study 2026 Q2/cost-model-2026.xlsx
// Also copies to 08_Pagina Web/05-website/contract-manufacturing/blog/cnc-cost-mexico-vs-us-2026/cost-model-2026.xlsx
// for download from the blog post.

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

async function build() {
  const wb = new ExcelJS.Workbook();
  wb.creator = 'Global Precision Works';
  wb.lastModifiedBy = 'GPW Cost Study 2026';
  wb.created = new Date();
  wb.modified = new Date();
  wb.title = 'GPW CNC Cost Model 2026';
  wb.subject = 'Mexico vs U.S. CNC Manufacturing Total Landed Cost';
  wb.company = 'Global Precision Works';

  // ======================================================================
  // SHEET 1 — Cover
  // ======================================================================
  const cover = wb.addWorksheet('Cover', {
    pageSetup: { orientation: 'portrait', fitToPage: true },
    views: [{ showGridLines: false }],
  });
  cover.columns = [{ width: 12 }, { width: 30 }, { width: 30 }, { width: 30 }, { width: 12 }];

  cover.mergeCells('A1:E2');
  cover.getCell('A1').value = '';
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

  cover.mergeCells('B8:D14');
  const instr = cover.getCell('B8');
  instr.value =
    '1. Open the "Inputs" sheet. Edit only the cells highlighted in coral. Everything else recalculates automatically.\n\n' +
    '2. Open the "Tier Analysis" sheet to see how landed cost compares by part complexity (Tier A simple → Tier C complex).\n\n' +
    '3. Open the "Sources" sheet for citation links to every datapoint used in this model.\n\n' +
    'Do NOT edit cells outside the Inputs sheet — formulas reference them.';
  instr.alignment = { wrapText: true, vertical: 'top' };
  instr.font = { name: 'Lato', size: 11 };

  cover.mergeCells('B16:D16');
  cover.getCell('B16').value = 'Headline: Save up to 80% on labor and 25–45% on total landed cost vs U.S. domestic';
  cover.getCell('B16').font = { name: 'Lato', size: 12, bold: true, color: { argb: DEEP_BLUE } };
  cover.getCell('B16').alignment = { wrapText: true };
  cover.getRow(16).height = 35;

  cover.mergeCells('B18:D18');
  cover.getCell('B18').value = 'Published April 25, 2026 · Quarterly refresh planned';
  cover.getCell('B18').font = { name: 'Lato', size: 10, italic: true, color: { argb: MID_GRAY } };

  cover.mergeCells('B20:D22');
  const contact = cover.getCell('B20');
  contact.value = 'Global Precision Works (GPW)\nMonterrey, Nuevo León, Mexico\nsales@gpw-solutions.com\nhttps://gpw-solutions.com';
  contact.font = { name: 'Lato', size: 10, color: { argb: TEAL } };
  contact.alignment = { wrapText: true, vertical: 'top' };

  // ======================================================================
  // SHEET 2 — Inputs
  // ======================================================================
  const inputs = wb.addWorksheet('Inputs', { views: [{ showGridLines: false }] });
  inputs.columns = [
    { header: '', width: 4 },
    { header: 'Input', width: 40 },
    { header: 'Value', width: 18 },
    { header: 'Unit', width: 12 },
    { header: 'Source', width: 50 },
  ];

  function header(row, text) {
    inputs.mergeCells(`B${row}:E${row}`);
    const c = inputs.getCell(`B${row}`);
    c.value = text;
    c.font = { name: 'Lato', size: 13, bold: true, color: { argb: WHITE } };
    c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: TEAL } };
    c.alignment = { vertical: 'middle' };
    inputs.getRow(row).height = 22;
  }
  function inputRow(row, label, value, unit, source, isInput = true) {
    inputs.getCell(`B${row}`).value = label;
    inputs.getCell(`B${row}`).font = { name: 'Lato', size: 11 };
    const v = inputs.getCell(`C${row}`);
    v.value = value;
    v.alignment = { horizontal: 'right' };
    v.font = { name: 'Lato', size: 11, bold: isInput };
    if (isInput) {
      v.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFEE2D6' } }; // light coral
      v.border = { top: { style: 'thin', color: { argb: CORAL } }, bottom: { style: 'thin', color: { argb: CORAL } }, left: { style: 'thin', color: { argb: CORAL } }, right: { style: 'thin', color: { argb: CORAL } } };
    }
    inputs.getCell(`D${row}`).value = unit;
    inputs.getCell(`D${row}`).font = { name: 'Lato', size: 10, color: { argb: MID_GRAY } };
    inputs.getCell(`E${row}`).value = source;
    inputs.getCell(`E${row}`).font = { name: 'Lato', size: 9, italic: true, color: { argb: MID_GRAY } };
  }

  let r = 2;
  inputs.mergeCells(`B${r}:E${r}`);
  inputs.getCell(`B${r}`).value = 'Edit only the coral-highlighted cells. Defaults reflect Q1–Q2 2026 published data.';
  inputs.getCell(`B${r}`).font = { name: 'Lato', size: 10, italic: true, color: { argb: MID_GRAY } };

  r = 4; header(r, 'U.S. CNC LABOR (BLS OEWS May 2024 + ECEC Q4 2025)');
  r = 5; inputRow(r, 'CNC Operator median wage', 24.02, 'USD/hr', 'BLS OEWS May 2024, SOC 51-9161');
  r = 6; inputRow(r, 'Machinist median wage', 27.00, 'USD/hr', 'BLS OEWS May 2024, SOC 51-4041');
  r = 7; inputRow(r, 'Industrial Engineer median wage', 48.62, 'USD/hr', 'BLS OEWS May 2024, SOC 17-2112');
  r = 8; inputRow(r, 'Benefits load multiplier (×wages)', 1.426, 'multiplier', 'BLS ECEC Q4 2025: benefits = 29.9% of total comp');

  r = 10; header(r, 'MEXICO CNC LABOR (Tetakawi 2026, Monterrey)');
  r = 11; inputRow(r, 'Entry-level operator (fully fringed)', 5.44, 'USD/hr', 'Tetakawi 2026 Wage Benchmark, national avg');
  r = 12; inputRow(r, 'Semi-skilled operator (fully fringed)', 7.27, 'USD/hr', 'Tetakawi 2026, national avg');
  r = 13; inputRow(r, 'Manufacturing engineer (fully fringed)', 13.26, 'USD/hr', 'Tetakawi 2026');
  r = 14; inputRow(r, 'Monterrey unskilled premium', 6.63, 'USD/hr', 'Tetakawi 2026 regional');

  r = 16; header(r, 'SHOP RATES & PART COST STRUCTURE');
  r = 17; inputRow(r, 'U.S. CNC shop loaded rate (typical)', 90, 'USD/hr', 'NTMA/PMA member surveys, range $80–$140');
  r = 18; inputRow(r, 'Mexico CNC shop loaded rate (typical)', 60, 'USD/hr', 'GPW internal benchmark, range $45–$80');
  r = 19; inputRow(r, 'Material cost parity (MX vs US)', 1.00, 'ratio', '±5% on common metals; +5–15% on specialty alloys');

  r = 21; header(r, 'LANDED COST ADJUSTMENTS');
  r = 22; inputRow(r, 'Cross-border freight per part (incremental)', 1.00, 'USD/part', 'C.H. Robinson + USDA cross-border data 2025');
  r = 23; inputRow(r, 'Customs broker per shipment', 100, 'USD/shipment', 'Industry standard, $75–$150 range');
  r = 24; inputRow(r, 'USMCA filing cost', 0, 'USD/shipment', 'Handled in-house (no incremental cost)');
  r = 25; inputRow(r, 'Avg parts per shipment', 100, 'parts', 'Adjust to your typical order quantity');
  r = 26; inputRow(r, 'Inventory carry per part (incremental days)', 0.50, 'USD/part', 'Negligible for most cases');

  r = 28; header(r, 'TARIFF SCENARIO (vs alternative origin)');
  r = 29; inputRow(r, 'USMCA preferential rate (Mexico)', 0, '%', 'USTR / USMCA — qualifying machined parts');
  r = 30; inputRow(r, 'China Section 301 + IEEPA stack', 30, '%', 'USTR Section 301 + 2025 IEEPA additions');
  r = 31; inputRow(r, 'U.S. domestic baseline', 0, '%', 'No tariff (domestic supply)');

  r = 33; header(r, 'PART COMPLEXITY MIX (your sourcing portfolio)');
  r = 34; inputRow(r, 'Tier A (simple) share of spend', 0.25, '%', 'Default: 25% of typical OEM mix');
  r = 35; inputRow(r, 'Tier B (medium) share of spend', 0.50, '%', 'Default: 50%');
  r = 36; inputRow(r, 'Tier C (complex) share of spend', 0.25, '%', 'Default: 25%');

  r = 38; header(r, 'YOUR ANNUAL SPEND');
  r = 39; inputRow(r, 'Annual CNC machining spend', 500000, 'USD', 'Edit to your actual annual spend');

  // ======================================================================
  // SHEET 3 — Tier Analysis
  // ======================================================================
  const tier = wb.addWorksheet('Tier Analysis', { views: [{ showGridLines: false }] });
  tier.columns = [
    { header: '', width: 4 },
    { header: 'Tier', width: 12 },
    { header: 'Description', width: 32 },
    { header: 'Labor share', width: 14 },
    { header: 'Part savings', width: 14 },
    { header: 'Landed adj', width: 12 },
    { header: 'Net landed savings', width: 18 },
    { header: 'Your spend', width: 14 },
    { header: 'Your savings', width: 16 },
  ];

  tier.mergeCells('B2:I2');
  tier.getCell('B2').value = 'Total Landed Cost Savings by Part Complexity';
  tier.getCell('B2').font = { name: 'Lato', size: 16, bold: true, color: { argb: TEAL } };
  tier.getCell('B2').alignment = { horizontal: 'left' };

  // Header row
  const hdrRow = 4;
  ['Tier', 'Description', 'Labor share', 'Part-cost savings', 'Less freight/brokerage', 'Net landed savings', 'Your spend', 'Your savings'].forEach((h, i) => {
    const cell = tier.getCell(hdrRow, i + 2);
    cell.value = h;
    cell.font = { name: 'Lato', size: 11, bold: true, color: { argb: WHITE } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: TEAL } };
    cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
  });
  tier.getRow(hdrRow).height = 30;

  // Tier A row 5
  tier.getCell('B5').value = 'A';
  tier.getCell('B5').font = { name: 'Lato', size: 12, bold: true, color: { argb: CORAL } };
  tier.getCell('C5').value = 'Simple, material-heavy (5–15 min cycle)';
  tier.getCell('D5').value = '15–20%';
  tier.getCell('E5').value = '15–20%';
  tier.getCell('F5').value = '−3%';
  tier.getCell('G5').value = '12–17%';
  tier.getCell('G5').font = { bold: true };
  tier.getCell('H5').value = { formula: 'Inputs!C39*Inputs!C34' };
  tier.getCell('H5').numFmt = '"$"#,##0';
  tier.getCell('I5').value = { formula: 'H5*0.145' };
  tier.getCell('I5').numFmt = '"$"#,##0';
  tier.getCell('I5').font = { bold: true, color: { argb: CORAL } };

  // Tier B row 6
  tier.getCell('B6').value = 'B';
  tier.getCell('B6').font = { name: 'Lato', size: 12, bold: true, color: { argb: CORAL } };
  tier.getCell('C6').value = 'Medium, multi-setup (30–90 min cycle)';
  tier.getCell('D6').value = '25–35%';
  tier.getCell('E6').value = '25–32%';
  tier.getCell('F6').value = '−3%';
  tier.getCell('G6').value = '22–29%';
  tier.getCell('G6').font = { bold: true };
  tier.getCell('H6').value = { formula: 'Inputs!C39*Inputs!C35' };
  tier.getCell('H6').numFmt = '"$"#,##0';
  tier.getCell('I6').value = { formula: 'H6*0.255' };
  tier.getCell('I6').numFmt = '"$"#,##0';
  tier.getCell('I6').font = { bold: true, color: { argb: CORAL } };

  // Tier C row 7
  tier.getCell('B7').value = 'C';
  tier.getCell('B7').font = { name: 'Lato', size: 12, bold: true, color: { argb: CORAL } };
  tier.getCell('C7').value = 'Complex, 5-axis or tight tolerance (2–8 hr)';
  tier.getCell('D7').value = '40–55%';
  tier.getCell('E7').value = '37–50%';
  tier.getCell('F7').value = '−3%';
  tier.getCell('G7').value = '34–47%';
  tier.getCell('G7').font = { bold: true };
  tier.getCell('H7').value = { formula: 'Inputs!C39*Inputs!C36' };
  tier.getCell('H7').numFmt = '"$"#,##0';
  tier.getCell('I7').value = { formula: 'H7*0.405' };
  tier.getCell('I7').numFmt = '"$"#,##0';
  tier.getCell('I7').font = { bold: true, color: { argb: CORAL } };

  // Total row 9
  tier.mergeCells('B9:G9');
  tier.getCell('B9').value = 'WEIGHTED TOTAL';
  tier.getCell('B9').font = { bold: true, color: { argb: WHITE } };
  tier.getCell('B9').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: DEEP_BLUE } };
  tier.getCell('B9').alignment = { horizontal: 'right' };
  tier.getCell('H9').value = { formula: 'SUM(H5:H7)' };
  tier.getCell('H9').numFmt = '"$"#,##0';
  tier.getCell('H9').font = { bold: true, color: { argb: WHITE } };
  tier.getCell('H9').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: DEEP_BLUE } };
  tier.getCell('H9').alignment = { horizontal: 'right' };
  tier.getCell('I9').value = { formula: 'SUM(I5:I7)' };
  tier.getCell('I9').numFmt = '"$"#,##0';
  tier.getCell('I9').font = { bold: true, color: { argb: CORAL } };
  tier.getCell('I9').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: DEEP_BLUE } };
  tier.getCell('I9').alignment = { horizontal: 'right' };
  tier.getRow(9).height = 24;

  // Annotation
  tier.mergeCells('B11:I12');
  tier.getCell('B11').value =
    'Methodology: Net landed savings midpoint applied to your spend by tier share. Edit Inputs!C34–C36 to change your part complexity mix. Edit Inputs!C39 to change your annual spend. The weighted total reflects your portfolio.';
  tier.getCell('B11').font = { name: 'Lato', size: 10, italic: true, color: { argb: MID_GRAY } };
  tier.getCell('B11').alignment = { wrapText: true, vertical: 'top' };

  // Labor convergence section
  tier.mergeCells('B14:I14');
  tier.getCell('B14').value = 'Labor Cost Convergence (3 sources)';
  tier.getCell('B14').font = { name: 'Lato', size: 14, bold: true, color: { argb: TEAL } };

  const hr = 16;
  ['Role', 'U.S. wage (BLS)', 'U.S. fully-loaded', 'MX fully-fringed', 'MX as % of US', 'Labor savings'].forEach((h, i) => {
    const cell = tier.getCell(hr, i + 2);
    cell.value = h;
    cell.font = { name: 'Lato', size: 10, bold: true, color: { argb: WHITE } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: TEAL } };
    cell.alignment = { horizontal: 'center' };
  });

  const roles = [
    ['CNC Operator', 'Inputs!C5', 'Inputs!C5*Inputs!C8', 'Inputs!C14'],
    ['Machinist', 'Inputs!C6', 'Inputs!C6*Inputs!C8', 'Inputs!C12'],
    ['Industrial Engineer', 'Inputs!C7', 'Inputs!C7*Inputs!C8', 'Inputs!C13'],
  ];

  roles.forEach((role, idx) => {
    const rr = hr + 1 + idx;
    tier.getCell(`B${rr}`).value = role[0];
    tier.getCell(`C${rr}`).value = { formula: role[1] };
    tier.getCell(`C${rr}`).numFmt = '"$"#,##0.00"/hr"';
    tier.getCell(`D${rr}`).value = { formula: role[2] };
    tier.getCell(`D${rr}`).numFmt = '"$"#,##0.00"/hr"';
    tier.getCell(`E${rr}`).value = { formula: role[3] };
    tier.getCell(`E${rr}`).numFmt = '"$"#,##0.00"/hr"';
    tier.getCell(`F${rr}`).value = { formula: `E${rr}/D${rr}` };
    tier.getCell(`F${rr}`).numFmt = '0%';
    tier.getCell(`G${rr}`).value = { formula: `1-F${rr}` };
    tier.getCell(`G${rr}`).numFmt = '0%';
    tier.getCell(`G${rr}`).font = { bold: true, color: { argb: CORAL } };
  });

  // ======================================================================
  // SHEET 4 — Sources
  // ======================================================================
  const src = wb.addWorksheet('Sources', { views: [{ showGridLines: false }] });
  src.columns = [
    { header: '', width: 4 },
    { header: 'ID', width: 10 },
    { header: 'Source', width: 60 },
    { header: 'URL', width: 80 },
    { header: 'Used in', width: 25 },
  ];

  src.mergeCells('B2:E2');
  src.getCell('B2').value = 'Tier 1 + Tier 2 Sources Used in This Model';
  src.getCell('B2').font = { name: 'Lato', size: 16, bold: true, color: { argb: TEAL } };

  src.mergeCells('B3:E3');
  src.getCell('B3').value = 'Date of access: April 25, 2026. Quarterly refresh planned.';
  src.getCell('B3').font = { name: 'Lato', size: 10, italic: true, color: { argb: MID_GRAY } };

  const sources = [
    ['BLS-1', 'BLS OEWS May 2024 — Table 1 National wages', 'https://www.bls.gov/news.release/ocwage.t01.htm', 'U.S. wages'],
    ['BLS-2', 'BLS Employer Costs for Employee Compensation Q4 2025', 'https://www.bls.gov/news.release/ecec.htm', 'Fully-loaded multiplier'],
    ['MX-1', 'Tetakawi Manufacturing Wages in Mexico 2025–2026', 'https://insights.tetakawi.com/manufacturing-wages-in-mexico-2025-2026-executive-benchmark-guide', 'Mexico wages'],
    ['T2-1', 'Kearney 2025 Reshoring Index', 'https://www.kearney.com/service/operations-performance/us-reshoring-index', 'Risk register'],
    ['T2-2', 'BCG: Shifting Dynamics of Nearshoring in Mexico (2024)', 'https://www.bcg.com/publications/2024/shifting-dynamics-of-nearshoring-in-mexico', 'Cost framework'],
    ['T2-3', 'McKinsey Global Institute Trade 2025 Update', 'https://www.mckinsey.com/mgi/our-research/geopolitics-and-the-geometry-of-global-trade-2025-update', 'Market sizing'],
    ['T2-4', 'Reshoring Initiative 2024 Annual Report', 'https://reshorenow.org/content/pdf/2024-1Q2025_RI_DATA_Report.pdf', 'Reshoring trends'],
    ['T2-5', 'NAM: Cost of Federal Regulations (Crain & Crain 2023)', 'https://nam.org/wp-content/uploads/2023/11/NAM-3731-Crains-Study-R3-V2-FIN.pdf', 'Regulatory burden'],
    ['T2-6', 'Reshoring Initiative TCO Estimator framework', 'https://www.reshorenow.org/tco-estimator/', 'TCO methodology'],
    ['Trade-1', 'USTR Section 301 enforcement actions', 'https://ustr.gov/issue-areas/enforcement/section-301-investigations', 'Tariff scenario'],
    ['Trade-2', 'CBP USMCA reference', 'https://www.cbp.gov/trade/usmca', 'USMCA filing'],
    ['Freight-1', 'C.H. Robinson Cross-Border April 2025 Update', 'https://www.chrobinson.com/en-us/resources/insights-and-advisories/north-america-freight-insights/apr-2025-freight-market-update/addl-supply-chain-updates/cross-border/', 'Freight rates'],
  ];

  ['ID', 'Source', 'URL', 'Used in'].forEach((h, i) => {
    const cell = src.getCell(5, i + 2);
    cell.value = h;
    cell.font = { name: 'Lato', size: 11, bold: true, color: { argb: WHITE } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: TEAL } };
  });

  sources.forEach((s, idx) => {
    const rr = 6 + idx;
    src.getCell(`B${rr}`).value = s[0];
    src.getCell(`B${rr}`).font = { bold: true, color: { argb: CORAL } };
    src.getCell(`C${rr}`).value = s[1];
    src.getCell(`D${rr}`).value = { text: s[3] === 'URL' ? s[2] : s[2], hyperlink: s[2] };
    src.getCell(`D${rr}`).font = { color: { argb: TEAL }, underline: true };
    src.getCell(`E${rr}`).value = s[3];
    src.getCell(`E${rr}`).font = { italic: true, color: { argb: MID_GRAY } };
  });

  // ======================================================================
  // Save
  // ======================================================================
  const outPath1 = path.join(
    __dirname,
    '..',
    '05_Operaciones',
    'Investigacion Manufactura',
    'Cost Study 2026 Q2',
    'cost-model-2026.xlsx'
  );
  const outPath2 = path.join(
    __dirname,
    '05-website',
    'contract-manufacturing',
    'blog',
    'cnc-cost-mexico-vs-us-2026',
    'cost-model-2026.xlsx'
  );

  fs.mkdirSync(path.dirname(outPath1), { recursive: true });
  fs.mkdirSync(path.dirname(outPath2), { recursive: true });

  await wb.xlsx.writeFile(outPath1);
  console.log('✓ Wrote:', outPath1);

  await wb.xlsx.writeFile(outPath2);
  console.log('✓ Wrote:', outPath2);

  console.log('\nDone. The XLSX is downloadable from the blog post and archived in the Cost Study folder.');
}

build().catch((err) => {
  console.error('Failed:', err);
  process.exit(1);
});
