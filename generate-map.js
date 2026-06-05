// Generate dotted map SVG for North America only
const DottedMap = require("dotted-map").default;

const map = new DottedMap({ height: 100, grid: "diagonal" });

const svgStr = map.getSVG({
  radius: 0.35,
  color: "#23555A50",
  shape: "circle",
  backgroundColor: "transparent",
});

// Extract circles
const circleRegex = /<circle.*?\/>/g;
const circles = svgStr.match(circleRegex) || [];

// Filter to North America region (dotted-map coords: ~198 wide x ~99 tall)
// Cities range: x 27-55, y 28-44. Padding generously.
const naCircles = circles.filter(c => {
  const cxMatch = c.match(/cx="([^"]+)"/);
  const cyMatch = c.match(/cy="([^"]+)"/);
  if (!cxMatch || !cyMatch) return false;
  const cx = parseFloat(cxMatch[1]);
  const cy = parseFloat(cyMatch[1]);
  return cx >= 20 && cx <= 64 && cy >= 18 && cy <= 54;
});

console.log(`Total circles: ${circles.length}`);
console.log(`North America circles: ${naCircles.length}`);

// ViewBox matches overlay SVG
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="20 18 44 36" class="map-dots">
${naCircles.join('\n')}
</svg>`;

require('fs').writeFileSync('05-website/img/north-america-dots.svg', svg);
console.log("SVG saved to 05-website/img/north-america-dots.svg");
