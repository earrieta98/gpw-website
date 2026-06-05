const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  WidthType, AlignmentType, BorderStyle, HeadingLevel, PageBreak,
  ShadingType, VerticalAlign, TableLayoutType, Header, Footer, PageNumber
} = require("docx");
const fs = require("fs");

// Brand colors
const TEAL = "23555A";
const CORAL = "ED835E";
const DEEP_BLUE = "2A4E64";
const LIME = "ADCF91";
const WHITE = "FFFFFF";
const LIGHT_GRAY = "F5F5F5";
const MED_GRAY = "E0E0E0";

// Helper: heading paragraph
function heading(text, level = HeadingLevel.HEADING_1, color = TEAL) {
  return new Paragraph({
    heading: level,
    spacing: { before: 300, after: 150 },
    children: [new TextRun({ text, bold: true, color, font: "Lato", size: level === HeadingLevel.HEADING_1 ? 32 : level === HeadingLevel.HEADING_2 ? 26 : 22 })],
  });
}

function subheading(text) {
  return heading(text, HeadingLevel.HEADING_2, DEEP_BLUE);
}

function h3(text) {
  return heading(text, HeadingLevel.HEADING_3, TEAL);
}

function para(text, opts = {}) {
  return new Paragraph({
    spacing: { after: 120 },
    children: [new TextRun({ text, font: "Lato", size: 20, color: "333333", ...opts })],
  });
}

function bullet(text, level = 0) {
  return new Paragraph({
    bullet: { level },
    spacing: { after: 80 },
    children: [new TextRun({ text, font: "Lato", size: 20, color: "333333" })],
  });
}

function boldBullet(label, text) {
  return new Paragraph({
    bullet: { level: 0 },
    spacing: { after: 80 },
    children: [
      new TextRun({ text: label, bold: true, font: "Lato", size: 20, color: TEAL }),
      new TextRun({ text: " " + text, font: "Lato", size: 20, color: "333333" }),
    ],
  });
}

// Helper: table cell
function cell(text, opts = {}) {
  const { bold, color, shade, width, alignment, font_size } = {
    bold: false, color: "333333", shade: null, width: null, alignment: AlignmentType.LEFT, font_size: 18, ...opts
  };
  const cellOpts = {
    verticalAlign: VerticalAlign.CENTER,
    children: [new Paragraph({
      alignment,
      spacing: { before: 40, after: 40 },
      children: [new TextRun({ text: String(text), bold, color, font: "Lato", size: font_size })],
    })],
  };
  if (shade) cellOpts.shading = { type: ShadingType.SOLID, color: shade };
  if (width) cellOpts.width = { size: width, type: WidthType.PERCENTAGE };
  return new TableCell(cellOpts);
}

function headerCell(text, width) {
  return cell(text, { bold: true, color: WHITE, shade: TEAL, width, font_size: 18 });
}

// Image table for a page section
function imageTable(rows) {
  const header = new TableRow({
    tableHeader: true,
    children: [
      headerCell("#", 5),
      headerCell("Section", 15),
      headerCell("Orientation", 10),
      headerCell("Dimensions", 10),
      headerCell("Description", 38),
      headerCell("Reusable?", 22),
    ],
  });

  const dataRows = rows.map((r, i) => {
    const shade = i % 2 === 0 ? null : LIGHT_GRAY;
    return new TableRow({
      children: [
        cell(r[0], { width: 5, alignment: AlignmentType.CENTER, shade }),
        cell(r[1], { width: 15, shade }),
        cell(r[2], { width: 10, shade }),
        cell(r[3], { width: 10, shade }),
        cell(r[4], { width: 38, shade }),
        cell(r[5], { width: 22, shade }),
      ],
    });
  });

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    layout: TableLayoutType.FIXED,
    rows: [header, ...dataRows],
  });
}

// Summary table
function summaryTable(rows) {
  const header = new TableRow({
    tableHeader: true,
    children: [
      headerCell("Category", 40),
      headerCell("Unique Images", 30),
      headerCell("Slots Covered", 30),
    ],
  });
  const dataRows = rows.map((r, i) => {
    const shade = i % 2 === 0 ? null : LIGHT_GRAY;
    const isBold = r[0].startsWith("TOTAL");
    return new TableRow({
      children: [
        cell(r[0], { width: 40, bold: isBold, shade: isBold ? CORAL : shade, color: isBold ? WHITE : "333333" }),
        cell(r[1], { width: 30, bold: isBold, alignment: AlignmentType.CENTER, shade: isBold ? CORAL : shade, color: isBold ? WHITE : "333333" }),
        cell(r[2], { width: 30, bold: isBold, alignment: AlignmentType.CENTER, shade: isBold ? CORAL : shade, color: isBold ? WHITE : "333333" }),
      ],
    });
  });
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    layout: TableLayoutType.FIXED,
    rows: [header, ...dataRows],
  });
}

// ========== BUILD DOCUMENT ==========
const children = [];

// --- COVER ---
children.push(new Paragraph({ spacing: { before: 2400 } }));
children.push(new Paragraph({
  alignment: AlignmentType.CENTER,
  spacing: { after: 200 },
  children: [new TextRun({ text: "GPW Website", font: "Lato", size: 56, bold: true, color: TEAL })],
}));
children.push(new Paragraph({
  alignment: AlignmentType.CENTER,
  spacing: { after: 100 },
  children: [new TextRun({ text: "Stock Image Guide", font: "Lato", size: 48, bold: true, color: CORAL })],
}));
children.push(new Paragraph({
  alignment: AlignmentType.CENTER,
  spacing: { after: 400 },
  children: [new TextRun({ text: "Comprehensive list of all images needed for gpw-solutions.com", font: "Lato", size: 24, color: DEEP_BLUE, italics: true })],
}));

// Divider line
children.push(new Paragraph({
  alignment: AlignmentType.CENTER,
  spacing: { after: 200 },
  border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: CORAL } },
  children: [],
}));

children.push(new Paragraph({
  alignment: AlignmentType.CENTER,
  spacing: { after: 200 },
  children: [new TextRun({ text: "March 27, 2026", font: "Lato", size: 24, color: TEAL })],
}));
children.push(new Paragraph({
  alignment: AlignmentType.CENTER,
  spacing: { after: 100 },
  children: [new TextRun({ text: "Global Precision Works", font: "Lato", size: 22, color: DEEP_BLUE })],
}));
children.push(new Paragraph({
  alignment: AlignmentType.CENTER,
  children: [new TextRun({ text: "Prepared for stock image procurement", font: "Trirong", size: 20, color: TEAL, italics: true })],
}));

// PAGE BREAK
children.push(new Paragraph({ children: [new PageBreak()] }));

// --- SUMMARY ---
children.push(heading("Summary"));
children.push(para("This document catalogs every image slot across the GPW website and provides a reuse-optimized shopping list for stock image procurement."));
children.push(new Paragraph({ spacing: { after: 60 } }));

children.push(boldBullet("Total unique images needed:", "~55-60 (after reuse optimization)"));
children.push(boldBullet("Total image slots on the site:", "114"));
children.push(boldBullet("Images reused across pages:", "~55 slots covered by shared images"));
children.push(new Paragraph({ spacing: { after: 100 } }));
children.push(para("By strategically reusing images across similar page sections, the actual number of stock images to purchase drops from 114 to approximately 55-60 unique images."));

// --- REUSE STRATEGY ---
children.push(new Paragraph({ children: [new PageBreak()] }));
children.push(heading("Reuse Strategy"));
children.push(para("The following categories of images can be shared across multiple pages, significantly reducing the number of unique stock purchases:"));

children.push(boldBullet("1. Facility / Trust Image Bands:", "All 8 industry pages and service pages need full-width facility photos. Only 3-4 unique facility shots are needed, rotated across pages to maintain variety without multiplying costs."));
children.push(boldBullet("2. Process Step Images:", "The 5 service pages each have 4-5 process steps. Many steps overlap across services (Design Review, Testing, Packaging). A shared pool of 8 process images covers all 26 step slots."));
children.push(boldBullet("3. OG / Social Media Images:", "Open Graph images can be cropped or overlaid versions of the page hero images. No separate stock purchases needed."));
children.push(boldBullet("4. Service Accordion (EMS Home):", "The 5 service accordion images on the EMS Home page are identical to the 5 Services Hub cards. One purchase covers both slots."));

// --- PAGE-BY-PAGE IMAGE LIST ---
children.push(new Paragraph({ children: [new PageBreak()] }));
children.push(heading("Page-by-Page Image List"));
children.push(para("Every image needed, organized by page group, with reuse annotations."));

// A. Corporate Home
children.push(subheading("A. Corporate Home (2 images)"));
children.push(imageTable([
  ["1", "Division Card — Contract Mfg", "Landscape", "1200x400px", "CNC machining center close-up, metal parts being precision machined, industrial metalworking", "No — unique to this card"],
  ["2", "Division Card — EMS", "Landscape", "1200x400px", "Electromechanical assembly line, technicians assembling electronics into enclosures", "Reusable as OG image for corporate home"],
]));

// B. EMS Home
children.push(new Paragraph({ spacing: { before: 300 } }));
children.push(subheading("B. EMS Home — Service Accordion (5 images)"));
children.push(para("These same 5 images are reused for the Services Hub page cards."));
children.push(imageTable([
  ["3", "Box Build", "Landscape", "800x600px", "Technician integrating circuit boards, cables and components into a metal chassis/enclosure", "Reuse for Services Hub card #1"],
  ["4", "Cable & Harness", "Landscape", "800x600px", "Technician crimping connectors or routing colored wires on a harness assembly board", "Reuse for Services Hub card #2"],
  ["5", "System Integration", "Landscape", "800x600px", "Multi-subsystem rack assembly — boards, cables, mechanical frame being integrated", "Reuse for Services Hub card #3"],
  ["6", "Testing & Inspection", "Landscape", "800x600px", "Quality test station with oscilloscope/multimeter, unit under test, technician reviewing screen", "Reuse for Services Hub card #4"],
  ["7", "Enclosure & Cabinet", "Landscape", "800x600px", "Open industrial cabinet showing DIN rail components, power distribution, organized cable routing", "Reuse for Services Hub card #5"],
]));

// C. Service Page Heroes
children.push(new Paragraph({ spacing: { before: 300 } }));
children.push(subheading("C. Service Page Heroes (5 images)"));
children.push(para("Each service page has a hero image distinct from the accordion thumbnails. These can also double as process step images where appropriate."));
children.push(imageTable([
  ["8", "Box Build Hero", "Landscape", "800x600px", "Wide shot of box build assembly station — chassis open, components staged, technician working", "Can reuse as process step"],
  ["9", "Cable & Harness Hero", "Landscape", "800x600px", "Close-up of cable harness being assembled — crimp tool, wire bundles, connector pins visible", "Can reuse as process step"],
  ["10", "System Integration Hero", "Landscape", "800x600px", "Full system being integrated — rack with multiple boards, interconnect cables, firmware station nearby", "Can reuse as process step"],
  ["11", "Testing Hero", "Landscape", "800x600px", "Automated test equipment connected to product, pass/fail display on screen, clean test bench", "Can reuse as process step"],
  ["12", "Enclosure Hero", "Landscape", "800x600px", "Large industrial cabinet with doors open, fully wired interior, labels and documentation visible", "Can reuse as process step"],
]));

// D. Process Step Pool
children.push(new Paragraph({ children: [new PageBreak()] }));
children.push(subheading("D. Process Step Images — Shared Pool (8 unique images for 26 slots)"));
children.push(para("These images illustrate the process steps shown on each service page. Because many steps repeat across services (Design Review, Testing, Packaging), a pool of 8 images covers all 26 step slots."));
children.push(imageTable([
  ["13", "Design Review", "Landscape", "800x530px", "Engineering team at workstation reviewing technical drawings on monitors, BOM printouts on desk", "Reuse across ALL 5 service pages (Step 1)"],
  ["14", "First Article / Incoming Inspection", "Landscape", "800x530px", "First article unit on inspection table with calipers, documentation, magnification equipment", "Reuse across 4 service pages"],
  ["15", "Production Assembly — Electronics", "Landscape", "800x530px", "Assembly line with multiple workstations, technicians working on electronic/mechanical assemblies", "Reuse across 3 service pages"],
  ["16", "Production Assembly — Cables", "Landscape", "800x530px", "Cable assembly production — harness boards, wire cutting station, organized wire spools", "Reuse across 2 service pages"],
  ["17", "Functional Testing", "Landscape", "800x530px", "Functional test station — automated test equipment, cables connected to unit, screen showing test results", "Reuse across ALL 5 service pages"],
  ["18", "Burn-in / Environmental Test", "Landscape", "800x530px", "Burn-in rack with multiple units running, temperature displays, monitoring screens", "Testing page specific"],
  ["19", "Packaging & Shipping", "Landscape", "800x530px", "Finished products in custom foam packaging, shipping labels, palletization area", "Reuse across 3 service pages"],
  ["20", "Component Staging", "Landscape", "800x530px", "Organized component staging area — bins with labeled parts, ESD-safe workstation prep", "Reuse across 2 service pages"],
]));

// E. Industry Page Heroes
children.push(new Paragraph({ spacing: { before: 300 } }));
children.push(subheading("E. Industry Page Heroes (8 images)"));
children.push(para("Each industry page has a unique hero image. These are portrait/square format for the hero layout used on industry pages."));
children.push(imageTable([
  ["21", "AI & Server Rack", "Portrait/Square", "700x700px", "Technician assembling high-density GPU server rack, cable management visible, data center environment", "No"],
  ["22", "Industrial Equipment", "Portrait/Square", "700x700px", "Industrial control panel assembly — DIN rail mounting, PLC wiring, panel building", "No"],
  ["23", "Telecom Hardware", "Portrait/Square", "700x700px", "Telecom cabinet assembly — fiber management, power distribution, outdoor-rated enclosure", "No"],
  ["24", "Medical Devices", "Portrait/Square", "700x700px", "Medical device assembly in clean/controlled environment — gloves, ESD protection, serialized parts", "No"],
  ["25", "Automotive", "Portrait/Square", "700x700px", "Automotive wire harness or sub-assembly on fixture — connectors, clips, routing channels visible", "No"],
  ["26", "Energy", "Portrait/Square", "700x700px", "Power distribution cabinet assembly — bus bars, heavy gauge wiring, circuit breakers", "No"],
  ["27", "Aerospace", "Portrait/Square", "700x700px", "Aerospace cable harness assembly — mil-spec connectors, controlled environment, documentation", "No"],
  ["28", "Appliances", "Portrait/Square", "700x700px", "Appliance assembly line — control boards, wire harnesses, rapid changeover stations", "No"],
]));

// F. Industry Bands
children.push(new Paragraph({ children: [new PageBreak()] }));
children.push(subheading("F. Industry \"What We Build\" Bands (8 images for 16 slots)"));
children.push(para("Each industry page has two full-width image bands: a \"What We Build\" section and a facility/trust band. These CAN be the same image used in two spots on the same page, so 8 unique images cover 16 slots."));
children.push(imageTable([
  ["29", "AI & Server Rack Band", "Ultra-wide", "1400x600px", "Data center floor with rows of server racks being assembled, organized cabling, overhead cable trays", "Reuse for both band slots on AI page"],
  ["30", "Industrial Equipment Band", "Ultra-wide", "1400x600px", "Industrial manufacturing floor with control panels and equipment sub-assemblies in progress", "Reuse for both band slots on Industrial page"],
  ["31", "Telecom Hardware Band", "Ultra-wide", "1400x600px", "Telecom equipment staging area with cabinets, fiber routing, and testing stations", "Reuse for both band slots on Telecom page"],
  ["32", "Medical Devices Band", "Ultra-wide", "1400x600px", "Controlled cleanroom-style assembly environment with medical equipment on workstations", "Reuse for both band slots on Medical page"],
  ["33", "Automotive Band", "Ultra-wide", "1400x600px", "Automotive sub-assembly production line with fixtures, harnesses, and quality stations", "Reuse for both band slots on Automotive page"],
  ["34", "Energy Band", "Ultra-wide", "1400x600px", "Energy equipment assembly area with large cabinets, power distribution, and heavy-gauge wiring", "Reuse for both band slots on Energy page"],
  ["35", "Aerospace Band", "Ultra-wide", "1400x600px", "Aerospace-grade assembly environment with traceability documentation, mil-spec components", "Reuse for both band slots on Aerospace page"],
  ["36", "Appliances Band", "Ultra-wide", "1400x600px", "High-volume appliance assembly line with multiple stations, conveyor systems, changeover-ready", "Reuse for both band slots on Appliances page"],
]));

// G. Industry Project Cards
children.push(new Paragraph({ spacing: { before: 300 } }));
children.push(subheading("G. Industry Project Cards (~15 unique images for 21 slots)"));
children.push(para("Three project/application cards per industry page (7 industries x 3 cards = 21; Telecom has no project cards). Many product types overlap across industries, allowing reuse. Only ~15 unique images are needed."));
children.push(imageTable([
  ["37", "AI Card — Server Rack Build", "Landscape", "600x340px", "Completed server rack with organized cable management, front/rear view", "AI page"],
  ["38", "AI Card — GPU Tray Assembly", "Landscape", "600x340px", "GPU tray or high-density compute sled being assembled with thermal solutions", "AI page"],
  ["39", "AI Card — Power Distribution", "Landscape", "600x340px", "Power distribution unit or busbar assembly for data center rack", "Reuse for Energy cards"],
  ["40", "Industrial Card — Control Panel", "Landscape", "600x340px", "Assembled industrial control panel with DIN rail, PLCs, terminal blocks", "Industrial page"],
  ["41", "Industrial Card — Motor Assembly", "Landscape", "600x340px", "Motor drive or pump assembly integration with wiring and mounting", "Industrial page"],
  ["42", "Industrial Card — Sub-assembly", "Landscape", "600x340px", "Mechanical-electrical sub-assembly on fixture with cables and sensors", "Reuse for Automotive cards"],
  ["43", "Medical Card — Patient Monitor", "Landscape", "600x340px", "Medical monitoring equipment assembly with serialized components", "Medical page"],
  ["44", "Medical Card — Diagnostic Device", "Landscape", "600x340px", "Diagnostic or imaging equipment sub-assembly in controlled environment", "Medical page"],
  ["45", "Medical Card — Surgical Tool", "Landscape", "600x340px", "Electromechanical surgical instrument or tool assembly with documentation", "Medical page"],
  ["46", "Automotive Card — Wire Harness", "Landscape", "600x340px", "Automotive wire harness on assembly board with connectors and routing clips", "Reuse for Aerospace, Appliances"],
  ["47", "Automotive Card — Dashboard Sub-assy", "Landscape", "600x340px", "Dashboard or instrument cluster sub-assembly with wiring integration", "Automotive page"],
  ["48", "Automotive Card — Fixture Assembly", "Landscape", "600x340px", "Automotive fixture or jig with partially assembled components", "Automotive page"],
  ["49", "Energy Card — Switchgear Cabinet", "Landscape", "600x340px", "Medium-voltage switchgear or distribution cabinet with bus bars", "Energy page"],
  ["50", "Energy Card — Inverter Assembly", "Landscape", "600x340px", "Solar inverter or power conversion equipment assembly", "Energy page"],
  ["51", "Aerospace Card — Avionics Harness", "Landscape", "600x340px", "Mil-spec avionics cable harness with braided shielding and tagged connectors", "Aerospace page"],
  ["52", "Aerospace Card — Structural Sub-assy", "Landscape", "600x340px", "Aerospace structural bracket or mounting assembly with traceability markings", "Aerospace page"],
  ["53", "Aerospace Card — Flight System", "Landscape", "600x340px", "Flight control or navigation sub-system assembly on test fixture", "Aerospace page"],
  ["54", "Appliances Card — Control Board", "Landscape", "600x340px", "Appliance control board integration into housing with wire harness connections", "Reuse across Appliances"],
  ["55", "Appliances Card — Motor Integration", "Landscape", "600x340px", "Appliance motor or pump assembly integration into chassis", "Appliances page"],
  ["56", "Appliances Card — Final Assembly", "Landscape", "600x340px", "Appliance final assembly station with quality checkpoint", "Appliances page"],
  ["57", "Telecom — no project cards", "—", "—", "Telecom page uses a different layout without project cards", "N/A"],
]));

// H. Facility Photos
children.push(new Paragraph({ children: [new PageBreak()] }));
children.push(subheading("H. Facility Photos — Shared Pool (4 unique images for 8+ slots)"));
children.push(para("General facility images rotated across industry and service pages for the trust/credibility image bands."));
children.push(imageTable([
  ["58", "Facility — Wide Interior", "Ultra-wide", "1400x600px", "Modern manufacturing facility interior — clean, organized, well-lit assembly floor with multiple workstations", "Reuse across 4 industry pages"],
  ["59", "Quality Inspection Station", "Ultra-wide", "1400x600px", "Quality control station with test equipment, inspection documentation, technician examining product", "Reuse across 4 industry pages"],
  ["60", "Clean Assembly Environment", "Ultra-wide", "1400x600px", "ESD-controlled assembly workstations, organized production cells, cleanroom-adjacent setup", "Reuse for Medical, Aerospace pages"],
  ["61", "High-Volume Production Floor", "Ultra-wide", "1400x600px", "High-volume production floor with multiple assembly cells, lean manufacturing layout, kanban boards", "Reuse for Automotive, Appliances pages"],
]));

// --- FINAL COUNT ---
children.push(new Paragraph({ children: [new PageBreak()] }));
children.push(heading("Final Count — Summary Table"));
children.push(para("Optimized image count after reuse strategy:"));
children.push(new Paragraph({ spacing: { after: 100 } }));
children.push(summaryTable([
  ["Corporate Home", "2", "2"],
  ["EMS Home Accordion", "5", "5 (+ reuse for 5 Services Hub cards)"],
  ["Service Page Heroes", "5", "5"],
  ["Process Step Pool", "8", "26"],
  ["Industry Heroes", "8", "8"],
  ["Industry Bands (What We Build + Image Band)", "8", "16"],
  ["Industry Project Cards", "15", "21"],
  ["Facility Photos Pool", "4", "8"],
  ["TOTAL UNIQUE", "~55", "~96 slots"],
  ["OG Images (derived from above)", "0 extra", "18 (cropped from heroes)"],
]));

// --- SEARCH TIPS ---
children.push(new Paragraph({ spacing: { before: 400 } }));
children.push(heading("Search Tips for Stock Image Procurement"));

children.push(h3("Recommended Stock Sites"));
children.push(bullet("Shutterstock — Largest library, best for industrial/manufacturing images"));
children.push(bullet("iStock (Getty) — Good quality, competitive pricing for editorial-style shots"));
children.push(bullet("Adobe Stock — Integrates with Creative Cloud, strong manufacturing category"));
children.push(bullet("Unsplash (free) — Limited manufacturing content but worth checking for facility/environment shots"));

children.push(h3("Effective Search Terms"));
children.push(bullet("\"electronics manufacturing\" / \"electronic assembly\""));
children.push(bullet("\"cable harness assembly\" / \"wire harness production\""));
children.push(bullet("\"box build assembly\" / \"system integration manufacturing\""));
children.push(bullet("\"industrial control panel assembly\" / \"panel building\""));
children.push(bullet("\"server rack assembly\" / \"data center hardware\""));
children.push(bullet("\"quality inspection electronics\" / \"functional testing manufacturing\""));
children.push(bullet("\"industrial cabinet wiring\" / \"enclosure assembly\""));
children.push(bullet("\"manufacturing facility interior\" / \"clean assembly environment\""));

children.push(h3("Images to AVOID"));
children.push(boldBullet("Visible company logos:", "Any image with another company's branding. Check backgrounds carefully."));
children.push(boldBullet("Asian factory settings:", "GPW is located in Monterrey, Mexico. Avoid images that clearly depict Asian manufacturing environments. Prefer neutral or Western-looking facilities."));
children.push(boldBullet("PCBA / circuit board close-ups:", "GPW does electromechanical assembly, NOT PCB assembly (PCBA). Avoid SMT machines, reflow ovens, wave soldering, or chip-level soldering images."));
children.push(boldBullet("Dirty or cluttered environments:", "GPW positions itself as a modern, organized facility. Only use clean, well-lit images."));
children.push(boldBullet("Heavy industry:", "Avoid welding, foundry, steel mill, or heavy machining images for EMS pages (those belong to Contract Manufacturing only)."));

children.push(h3("Images to PREFER"));
children.push(boldBullet("Diverse workforce:", "Images showing a mix of genders and ethnicities. Avoid all-male or homogeneous teams."));
children.push(boldBullet("Clean, organized facilities:", "Well-lit assembly floors, ESD mats, organized workstations, labeled storage."));
children.push(boldBullet("Professional lighting:", "Bright, even lighting. Avoid dark, moody industrial shots."));
children.push(boldBullet("Mechanical + electrical integration:", "The core of GPW's work. Look for images showing cables being routed into enclosures, components mounted in chassis, system-level integration."));
children.push(boldBullet("People at work:", "Technicians actively working (not posed) add authenticity. Gloves, ESD straps, safety glasses are plus."));

children.push(new Paragraph({ spacing: { before: 200 } }));
children.push(new Paragraph({
  spacing: { after: 100 },
  border: { top: { style: BorderStyle.SINGLE, size: 6, color: CORAL } },
  children: [],
}));
children.push(new Paragraph({
  alignment: AlignmentType.CENTER,
  spacing: { before: 100 },
  children: [new TextRun({ text: "IMPORTANT: GPW is NOT a PCB assembly company.", bold: true, font: "Lato", size: 22, color: CORAL })],
}));
children.push(new Paragraph({
  alignment: AlignmentType.CENTER,
  spacing: { after: 200 },
  children: [new TextRun({ text: "Look for mechanical + electrical integration, cable routing, enclosure building — not chip soldering or SMT machines.", font: "Lato", size: 20, color: DEEP_BLUE })],
}));

// ========== DOCUMENT CREATION ==========
const doc = new Document({
  styles: {
    default: {
      document: {
        run: { font: "Lato", size: 20 },
      },
    },
  },
  sections: [{
    properties: {
      page: {
        margin: { top: 1000, bottom: 1000, left: 1200, right: 1200 },
      },
    },
    headers: {
      default: new Header({
        children: [new Paragraph({
          alignment: AlignmentType.RIGHT,
          children: [
            new TextRun({ text: "GPW Stock Image Guide", font: "Lato", size: 16, color: TEAL, italics: true }),
            new TextRun({ text: "  |  March 2026", font: "Lato", size: 16, color: MED_GRAY }),
          ],
        })],
      }),
    },
    footers: {
      default: new Footer({
        children: [new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({ text: "Global Precision Works  —  ", font: "Lato", size: 16, color: TEAL }),
            new TextRun({ text: "Page ", font: "Lato", size: 16, color: MED_GRAY }),
            new TextRun({ children: [PageNumber.CURRENT], font: "Lato", size: 16, color: MED_GRAY }),
          ],
        })],
      }),
    },
    children,
  }],
});

// ========== SAVE ==========
const outputPath = "c:/Users/earri/OneDrive/Desktop/GLOBAL PRECISION WORKS/08_Pagina Web/05-website/stock-image-guide.docx";
Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync(outputPath, buffer);
  console.log("Created: " + outputPath);
  console.log("Size: " + (buffer.length / 1024).toFixed(1) + " KB");
}).catch(err => {
  console.error("Error:", err);
  process.exit(1);
});
