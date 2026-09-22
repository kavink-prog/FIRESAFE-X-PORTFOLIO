import sharp from 'sharp';
import fs from 'node:fs/promises';
import path from 'node:path';
// Regenerate phone-sized variants when replacing a reviewed source image.
const manifestPath = 'scripts/production-assets.json';
const allowed = new Set(JSON.parse(await fs.readFile(manifestPath, 'utf8')));
const variants = {};
for (const relative of [...allowed]) {
  if (!relative.startsWith('assets/images/') || !relative.endsWith('.webp') || relative.endsWith('-768.webp')) continue;
  const file = path.join('public', relative);
  const { width, height } = await sharp(file).metadata();
  if (width <= 768) continue;
  const target = relative.replace(/\.webp$/, '-768.webp');
  await sharp(file).resize({ width: 768, withoutEnlargement: true }).webp({ quality: 80, effort: 6 }).toFile(path.join('public', target));
  allowed.add(target);
  variants[`/${relative}`] = { srcSet: `/${target} 768w, /${relative} ${width}w`, width, height };
}
await fs.writeFile(manifestPath, JSON.stringify([...allowed].sort(), null, 2) + '\n');
await fs.writeFile('data/responsive-images.json', JSON.stringify(variants, null, 2) + '\n');
console.log(`Generated ${Object.keys(variants).length} responsive images.`);
