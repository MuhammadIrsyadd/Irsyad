// Regenerates every favicon from the monogram in public/icon-badge.svg.
// All icons are full-bleed and fully opaque: Google and browsers crop them
// into circles or rounded squares on their own, and transparent corners would
// let the white background behind them show through.
//   node scripts/generate-favicons.mjs
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const root = path.join(path.dirname(new URL(import.meta.url).pathname.replace(/^\/(\w:)/, "$1")), "..");
const pub = (f) => path.join(root, "public", f);
const app = (f) => path.join(root, "src", "app", f);

const BACKGROUND = "#0b0c10";
const badge = fs.readFileSync(pub("icon-badge.svg"), "utf8");
const d = badge.match(/<path[^>]*\sd="([^"]+)"/)?.[1];
if (!d) throw new Error("Monogram path not found in icon-badge.svg");

// The monogram stays inside the middle of the square, safe from circular crops.
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000">
  <rect width="1000" height="1000" fill="${BACKGROUND}"/>
  <path transform="translate(140 140) scale(0.72)" fill="#ffffff" fill-rule="evenodd" d="${d}"/>
</svg>
`;

const png = (size) =>
  sharp(Buffer.from(svg), { density: 300 })
    .resize(size, size)
    .flatten({ background: BACKGROUND })
    // keep a fully opaque alpha channel: PNGs inside an .ico must be RGBA
    .ensureAlpha(1)
    .png({ compressionLevel: 9 })
    .toBuffer();

/** A .ico that simply wraps PNG images (supported by all current browsers). */
function ico(images) {
  const header = Buffer.alloc(6 + images.length * 16);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(images.length, 4);
  let offset = header.length;
  images.forEach(({ size, data }, i) => {
    const entry = 6 + i * 16;
    header.writeUInt8(size === 256 ? 0 : size, entry);
    header.writeUInt8(size === 256 ? 0 : size, entry + 1);
    header.writeUInt16LE(1, entry + 4);
    header.writeUInt16LE(32, entry + 6);
    header.writeUInt32LE(data.length, entry + 8);
    header.writeUInt32LE(offset, entry + 12);
    offset += data.length;
  });
  return Buffer.concat([header, ...images.map((image) => image.data)]);
}

fs.writeFileSync(pub("favicon.svg"), svg);
fs.writeFileSync(app("icon.svg"), svg);

for (const [file, size] of [
  ["favicon-16x16.png", 16],
  ["favicon-32x32.png", 32],
  ["favicon-48x48.png", 48],
  ["apple-touch-icon.png", 180],
  ["icon-192.png", 192],
  ["icon-512.png", 512],
]) {
  fs.writeFileSync(pub(file), await png(size));
}
fs.writeFileSync(app("apple-icon.png"), await png(180));

const icoFile = ico(
  await Promise.all([16, 32, 48].map(async (size) => ({ size, data: await png(size) })))
);
fs.writeFileSync(pub("favicon.ico"), icoFile);
fs.writeFileSync(app("favicon.ico"), icoFile);

console.log("favicons written");
