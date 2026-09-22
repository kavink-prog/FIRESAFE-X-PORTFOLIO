import fs from 'node:fs';
import path from 'node:path';
const root = process.cwd();
function files(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const file = path.join(dir, entry.name);
    return entry.isDirectory() ? files(file) : [{ path: file, bytes: fs.statSync(file).size }];
  });
}
const allowed = new Set(JSON.parse(fs.readFileSync('scripts/production-assets.json', 'utf8')));
const publicFiles = files('public');
const errors = [];
for (const file of publicFiles) {
  if (!allowed.has(path.relative('public', file.path))) errors.push(`Unreviewed public file: ${file.path}`);
  if (file.bytes > 5_000_000) errors.push(`Asset exceeds 5 MB: ${file.path}`);
}
for (const name of allowed) if (!fs.existsSync(path.join('public', name))) errors.push(`Missing public asset: ${name}`);
if (!fs.existsSync('out/index.html')) throw new Error('Run npm run build first.');
const output = files('out');
for (const file of output.filter(f => f.path.endsWith('.html'))) {
  const html = fs.readFileSync(file.path, 'utf8');
  for (const match of html.matchAll(/(?:src|href|poster)="(\/[^"<>]*)"/g)) {
    if (match[1].startsWith('//')) continue;
    const relative = decodeURIComponent(match[1].split(/[?#]/)[0]).replace(/^\//, '');
    const dest = path.resolve('out', relative);
    if (!dest.startsWith(path.resolve('out') + path.sep) && dest !== path.resolve('out')) throw new Error('Invalid path');
    if (!fs.existsSync(dest)) errors.push(`Broken export reference in ${file.path}: ${match[1]}`);
  }
}
const publicBytes = publicFiles.reduce((sum, f) => sum + f.bytes, 0);
const exportBytes = output.reduce((sum, f) => sum + f.bytes, 0);
if (publicBytes > 15_000_000) errors.push('Public payload exceeds 15 MB budget.');
if (exportBytes > 20_000_000) errors.push('Static export exceeds 20 MB budget.');
for (const expected of ['out/robots.txt', 'out/sitemap.xml', 'out/404.html']) {
  if (!fs.existsSync(expected)) errors.push(`Missing ${expected}`);
}
const report = { publicBytes, publicFiles: publicFiles.length, exportBytes, exportFiles: output.length, largestAssets: [...publicFiles].sort((a,b) => b.bytes-a.bytes).slice(0,10), errors };
fs.mkdirSync('output/production-audit', { recursive: true });
fs.writeFileSync('output/production-audit/after-assets.json', JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
if (errors.length) process.exitCode = 1;
