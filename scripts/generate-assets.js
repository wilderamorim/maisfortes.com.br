#!/usr/bin/env node
/**
 * Generates all brand assets: favicon, PWA icons, OG image, apple-touch-icon.
 * Uses sharp (already in project deps).
 *
 * Brand: +Fortes
 * Primary: #2D6A4F (Forest Green)
 * Symbol: "+" (plus sign)
 */
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const PUBLIC = path.join(__dirname, "..", "public");
const ICONS = path.join(PUBLIC, "icons");

const FOREST = "#2D6A4F";
const FOREST_LIGHT = "#40916C";
const WHITE = "#FFFFFF";
const BG_LIGHT = "#FAFAF8";

// Ensure directories
if (!fs.existsSync(ICONS)) fs.mkdirSync(ICONS, { recursive: true });

// ─── SVG Generators ───

function iconSvg(size, padding = 0.2) {
  const p = Math.round(size * padding);
  const inner = size - p * 2;
  const r = Math.round(size * 0.22); // border radius
  const strokeW = Math.round(inner * 0.18);
  const cx = size / 2;
  const cy = size / 2;
  const armLen = Math.round(inner * 0.28);

  return `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
    <rect width="${size}" height="${size}" rx="${r}" fill="${FOREST}"/>
    <line x1="${cx}" y1="${cy - armLen}" x2="${cx}" y2="${cy + armLen}" stroke="${WHITE}" stroke-width="${strokeW}" stroke-linecap="round"/>
    <line x1="${cx - armLen}" y1="${cy}" x2="${cx + armLen}" y2="${cy}" stroke="${WHITE}" stroke-width="${strokeW}" stroke-linecap="round"/>
  </svg>`;
}

function ogSvg() {
  const w = 1200;
  const h = 630;
  return `<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="${FOREST}"/>
        <stop offset="100%" stop-color="${FOREST_LIGHT}"/>
      </linearGradient>
      <radialGradient id="glow" cx="0.3" cy="0.4" r="0.8">
        <stop offset="0%" stop-color="${FOREST_LIGHT}" stop-opacity="0.3"/>
        <stop offset="100%" stop-color="${FOREST}" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <rect width="${w}" height="${h}" fill="url(#bg)"/>
    <rect width="${w}" height="${h}" fill="url(#glow)"/>

    <!-- + symbol -->
    <line x1="160" y1="250" x2="160" y2="380" stroke="${WHITE}" stroke-width="28" stroke-linecap="round" opacity="0.9"/>
    <line x1="95" y1="315" x2="225" y2="315" stroke="${WHITE}" stroke-width="28" stroke-linecap="round" opacity="0.9"/>

    <!-- Brand name -->
    <text x="260" y="335" font-family="system-ui,-apple-system,sans-serif" font-size="72" font-weight="800" fill="${WHITE}" letter-spacing="-1">Fortes</text>

    <!-- Tagline -->
    <text x="98" y="450" font-family="system-ui,-apple-system,sans-serif" font-size="32" fill="${WHITE}" opacity="0.8" font-weight="500">+Forte a cada dia.</text>

    <!-- URL -->
    <text x="98" y="560" font-family="monospace" font-size="18" fill="${WHITE}" opacity="0.5">maisfortes.com.br</text>

    <!-- Decorative dots -->
    <circle cx="1050" cy="120" r="80" fill="${WHITE}" opacity="0.04"/>
    <circle cx="1100" cy="500" r="120" fill="${WHITE}" opacity="0.03"/>
    <circle cx="900" cy="80" r="40" fill="${WHITE}" opacity="0.05"/>
  </svg>`;
}

async function generate() {
  console.log("[generate-assets] Starting...\n");

  // PWA Icons
  for (const size of [192, 512]) {
    const svg = iconSvg(size);
    await sharp(Buffer.from(svg)).png().toFile(path.join(ICONS, `icon-${size}.png`));
    console.log(`  ✓ icons/icon-${size}.png`);
  }

  // Apple Touch Icon (180x180)
  const apple = iconSvg(180);
  await sharp(Buffer.from(apple)).png().toFile(path.join(ICONS, "apple-touch-icon.png"));
  console.log("  ✓ icons/apple-touch-icon.png");

  // Favicon 32x32
  const fav32 = iconSvg(32, 0.1);
  await sharp(Buffer.from(fav32)).png().toFile(path.join(PUBLIC, "favicon-32.png"));
  console.log("  ✓ favicon-32.png");

  // Favicon 16x16
  const fav16 = iconSvg(16, 0.06);
  await sharp(Buffer.from(fav16)).png().toFile(path.join(PUBLIC, "favicon-16.png"));
  console.log("  ✓ favicon-16.png");

  // Favicon ICO (use 32px png as base)
  // Sharp can't output .ico natively — we create a PNG favicon and reference it
  await sharp(Buffer.from(fav32)).png().toFile(path.join(PUBLIC, "favicon.png"));
  console.log("  ✓ favicon.png");

  // SVG favicon (scalable, best quality)
  const svgFav = iconSvg(32, 0.1);
  fs.writeFileSync(path.join(PUBLIC, "favicon.svg"), svgFav);
  console.log("  ✓ favicon.svg");

  // OG Image (1200x630)
  const og = ogSvg();
  await sharp(Buffer.from(og)).png({ quality: 90 }).toFile(path.join(PUBLIC, "og-image.png"));
  console.log("  ✓ og-image.png");

  // OG Image for Twitter (2:1 ratio, 1200x600)
  await sharp(Buffer.from(og))
    .resize(1200, 600, { fit: "cover", position: "center" })
    .png({ quality: 90 })
    .toFile(path.join(PUBLIC, "og-twitter.png"));
  console.log("  ✓ og-twitter.png");

  console.log("\n[generate-assets] Done! All assets generated.");
}

generate().catch(console.error);
