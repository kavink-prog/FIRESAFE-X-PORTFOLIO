import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const outputRoot = path.resolve('public/assets/sequences/hero');
const defaultSourceRoot = path.resolve('../source-assets/hero-original-20260814');
const sourceRoot = path.resolve(process.env.HERO_SEQUENCE_SOURCE || defaultSourceRoot);
const desktopDir = path.join(outputRoot, 'desktop');
const mobileDir = path.join(outputRoot, 'mobile');

const sourceFiles = (await fs.readdir(sourceRoot))
  .filter((name) => /^\d{4}\.webp$/.test(name))
  .sort();

if (sourceFiles.length !== 180) {
  throw new Error(`Expected 180 source WebP frames in ${sourceRoot}; found ${sourceFiles.length}.`);
}

await Promise.all([
  fs.rm(desktopDir, { recursive: true, force: true }),
  fs.rm(mobileDir, { recursive: true, force: true }),
]);
await Promise.all([
  fs.mkdir(desktopDir, { recursive: true }),
  fs.mkdir(mobileDir, { recursive: true }),
]);

const outputName = (index) => `${String(index + 1).padStart(4, '0')}.webp`;
const desktopSources = Array.from({ length: 90 }, (_, index) => sourceFiles[index * 2]);
const mobileSources = Array.from({ length: 60 }, (_, index) =>
  sourceFiles[Math.round((index * (sourceFiles.length - 1)) / 59)]
);

await Promise.all(
  desktopSources.map((source, index) =>
    sharp(path.join(sourceRoot, source))
      .webp({ quality: 72, effort: 6 })
      .toFile(path.join(desktopDir, outputName(index)))
  )
);

await Promise.all(
  mobileSources.map((source, index) =>
    sharp(path.join(sourceRoot, source))
      .resize(540, 540, { fit: 'cover' })
      .webp({ quality: 68, effort: 6 })
      .toFile(path.join(mobileDir, outputName(index)))
  )
);

console.log(`Generated ${desktopSources.length} desktop and ${mobileSources.length} mobile hero frames.`);
