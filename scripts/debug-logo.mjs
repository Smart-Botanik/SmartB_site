// debug-logo.mjs
import sharp from '../node_modules/sharp/lib/index.js';

const { data, info } = await sharp('public/smart-botanik-logo-full.png')
  .ensureAlpha().raw().toBuffer({ resolveWithObject: true });

const { width, height, channels } = info;
const c0 = [data[0], data[1], data[2], data[3]];
const cx = Math.floor(width/2), cy = Math.floor(height/2);
const ci = (cy * width + cx) * channels;
const center = [data[ci], data[ci+1], data[ci+2], data[ci+3]];

// scan for first non-white (> 240 for all channels means white-ish)
let firstRow = -1;
outer: for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    const idx = (y * width + x) * channels;
    const r = data[idx], g = data[idx+1], b = data[idx+2];
    if (!(r > 240 && g > 240 && b > 240)) { firstRow = y; break outer; }
  }
}

console.log('dims:', width, 'x', height, 'channels:', channels);
console.log('corner px (0,0):', c0);
console.log('center px:', center);
console.log('first non-white row:', firstRow);

// sample row 0 first 5 pixels
for (let x = 0; x < 5; x++) {
  const idx = x * channels;
  console.log(`row0 px[${x}]:`, data[idx], data[idx+1], data[idx+2], data[idx+3]);
}
