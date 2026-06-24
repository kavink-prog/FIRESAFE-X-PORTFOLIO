/**
 * Convert hero PNG sequence → WebP (900px wide, quality 82)
 * Run AFTER freeing disk space:
 *   node scripts/convert-to-webp.mjs
 *
 * Requires: npm install --save-dev sharp
 */
import sharp from 'sharp';
import { readdirSync, statSync } from 'fs';
import { join, extname, basename } from 'path';

const INPUT_DIR = 'public/assets/sequences/hero';
const TARGET_WIDTH = 900;
const WEBP_QUALITY = 82;

const files = readdirSync(INPUT_DIR)
  .filter((f) => extname(f).toLowerCase() === '.png')
  .sort();

console.log(`Converting ${files.length} PNG frames → WebP (${TARGET_WIDTH}px, q${WEBP_QUALITY})...`);

let done = 0;
let savedBytes = 0;

for (const file of files) {
  const inputPath = join(INPUT_DIR, file);
  const outputPath = join(INPUT_DIR, basename(file, '.png') + '.webp');

  const originalSize = statSync(inputPath).size;

  await sharp(inputPath)
    .resize({ width: TARGET_WIDTH, withoutEnlargement: true })
    .webp({ quality: WEBP_QUALITY })
    .toFile(outputPath);

  const newSize = statSync(outputPath).size;
  savedBytes += originalSize - newSize;
  done++;

  if (done % 20 === 0 || done === files.length) {
    const savedMB = (savedBytes / 1024 / 1024).toFixed(1);
    console.log(`  [${done}/${files.length}] saved ${savedMB} MB so far`);
  }
}

const totalSavedMB = (savedBytes / 1024 / 1024).toFixed(1);
console.log(`\nDone! Converted ${done} files, saved ${totalSavedMB} MB total.`);
console.log(`\nNext step: update hero-sequence.js FRAME_SRC to use .webp extension`);
