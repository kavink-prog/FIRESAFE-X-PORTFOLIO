import fs from 'node:fs';
import assert from 'node:assert/strict';
// Validate the active brochure homepage, rather than the retired seven-tab page.
const html = fs.readFileSync('out/index.html', 'utf8');
for (const id of ['main', 'home', 'experience', 'platform', 'multilingual', 'workplaces']) {
  assert.ok(html.includes(`id="${id}"`), `Missing homepage section: ${id}`);
}
for (const required of ['AI powered immersive smart fire safety training.', 'FireSafeX', 'English', 'हिन्दी', 'தமிழ்', 'తెలుగు', 'ಕನ್ನಡ', 'FireSafeX-Brochure-2026.pdf']) {
  assert.ok(html.toLowerCase().includes(required.toLowerCase()), `Missing homepage content: ${required}`);
}
assert.ok(!html.includes('100% certificate accuracy'), 'Unsupported accuracy claim');
const demo = html.match(/<iframe[^>]*src="https:\/\/www\.youtube\.com\/embed\/ZeR8jtiZg6I[^>]*>/)?.[0];
assert.ok(demo, 'Missing YouTube training demonstration');
assert.ok(demo.includes('loading="lazy"'), 'YouTube demo must load lazily');
assert.ok(fs.existsSync('out/downloads/FireSafeX-Brochure-2026.pdf'), 'Missing brochure');
console.log('Validated active homepage sections, languages, brochure, and video loading policy.');
