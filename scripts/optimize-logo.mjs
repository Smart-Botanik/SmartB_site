// optimize-logo.mjs  v3
// Trim transparent margins, then output WebP (q=85) + compressed PNG
import sharp from '../node_modules/sharp/lib/index.js';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const src  = path.join(root, 'public', 'smart-botanik-logo-full.png');

async function trimBox(inputPath) {
  const { data, info } = await sharp(inputPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;

  // A pixel is "background" if alpha < 10 (transparent) OR (alpha > 240 && r,g,b > 240 = near-white)
  const isBg = (idx) => {
    const a = data[idx + 3];
    if (a < 10) return true;
    const r = data[idx], g = data[idx+1], b = data[idx+2];
    return a > 200 && r > 240 && g > 240 && b > 240;
  };

  let top = 0, bottom = height - 1, left = 0, right = width - 1;

  outer: for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (!isBg((y * width + x) * channels)) { top = y; break outer; }
    }
  }
  outer: for (let y = height - 1; y >= 0; y--) {
    for (let x = 0; x < width; x++) {
      if (!isBg((y * width + x) * channels)) { bottom = y; break outer; }
    }
  }
  outer: for (let x = 0; x < width; x++) {
    for (let y = top; y <= bottom; y++) {
      if (!isBg((y * width + x) * channels)) { left = x; break outer; }
    }
  }
  outer: for (let x = width - 1; x >= 0; x--) {
    for (let y = top; y <= bottom; y++) {
      if (!isBg((y * width + x) * channels)) { right = x; break outer; }
    }
  }

  const pad = 24;
  return {
    left:   Math.max(0, left - pad),
    top:    Math.max(0, top - pad),
    width:  Math.min(width  - Math.max(0, left - pad), right - left + 1 + pad * 2),
    height: Math.min(height - Math.max(0, top  - pad), bottom - top + 1 + pad * 2),
  };
}

async function run() {
  const meta = await sharp(src).metadata();
  const srcSize = fs.statSync(src).size;
  console.log(`Source: ${meta.width}x${meta.height} – ${Math.round(srcSize / 1024)} KB`);

  const box = await trimBox(src);
  console.log(`Trim box: left=${box.left} top=${box.top} w=${box.width} h=${box.height}`);

  // 1. WebP – quality 85, lossy
  const webpOut = path.join(root, 'public', 'smart-botanik-logo.webp');
  await sharp(src)
    .extract(box)
    .webp({ quality: 85, effort: 6 })
    .toFile(webpOut);
  const wSize = fs.statSync(webpOut).size;
  const wMeta = await sharp(webpOut).metadata();
  console.log(`WebP: ${wMeta.width}x${wMeta.height} – ${Math.round(wSize / 1024)} KB  → ${webpOut}`);

  // 2. PNG fallback – lossless compress
  const pngOut = path.join(root, 'public', 'smart-botanik-logo.png');
  await sharp(src)
    .extract(box)
    .png({ compressionLevel: 9, palette: false })
    .toFile(pngOut);
  const pSize = fs.statSync(pngOut).size;
  const pMeta = await sharp(pngOut).metadata();
  console.log(`PNG:  ${pMeta.width}x${pMeta.height} – ${Math.round(pSize / 1024)} KB  → ${pngOut}`);

  console.log('Done ✓');
}

run().catch(e => { console.error(e); process.exit(1); });
