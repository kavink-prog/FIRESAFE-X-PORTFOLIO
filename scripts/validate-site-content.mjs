import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { BROCHURE, CLIENT_VISITS, STORY_SECTIONS } from '../data/story-content.js';

const outputPath = new URL('../out/index.html', import.meta.url);
const sourcePath = new URL('../Documents/FireSafeX_Concise_Website_Content.docx', import.meta.url);
const addendumPath = new URL('../Documents/FireSafeX_Sales_Content_Addendum.md', import.meta.url);
const brochurePath = new URL(`../public${BROCHURE.href}`, import.meta.url);
const demoVideoPath = new URL('../public/assets/videos/global/firesafex-product-demo-wifi.m4v', import.meta.url);

if (!fs.existsSync(outputPath)) {
  console.error('Missing out/index.html. Run npm run build before validating content.');
  process.exit(1);
}

if (!fs.existsSync(sourcePath)) {
  console.error('Missing Documents/FireSafeX_Concise_Website_Content.docx.');
  process.exit(1);
}

if (!fs.existsSync(addendumPath)) {
  console.error('Missing Documents/FireSafeX_Sales_Content_Addendum.md.');
  process.exit(1);
}

const normalize = (value = '') => value.replace(/\s+/g, ' ').trim();
const decodeEntities = (value) => value
  .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCodePoint(Number.parseInt(code, 16)))
  .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
  .replace(/&amp;/g, '&')
  .replace(/&apos;|&#39;/g, "'")
  .replace(/&quot;/g, '"')
  .replace(/&gt;/g, '>')
  .replace(/&lt;/g, '<')
  .replace(/&nbsp;/g, ' ');

const html = fs.readFileSync(outputPath, 'utf8');
const addendumText = normalize(fs.readFileSync(addendumPath, 'utf8'));
const pageText = normalize(decodeEntities(
  html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' '),
));

const documentXml = execFileSync(
  'unzip',
  ['-p', fileURLToPath(sourcePath), 'word/document.xml'],
  { encoding: 'utf8' },
);
const sourceLines = decodeEntities(documentXml)
  .replace(/<\/w:p>/g, '\n')
  .replace(/<[^>]+>/g, '')
  .split('\n')
  .map(normalize)
  .filter(Boolean);

const navIndex = sourceLines.indexOf('RECOMMENDED NAVIGATION');
const sourceNav = sourceLines[navIndex + 1].split('|').map(normalize);
const sourceSections = Array.from({ length: 7 }, (_, index) => {
  const tabNumber = index + 1;
  const start = sourceLines.findIndex((line) => line.startsWith(`Tab ${tabNumber} —`));
  const end = tabNumber === 7
    ? sourceLines.length
    : sourceLines.findIndex((line, lineIndex) => lineIndex > start && line.startsWith(`Tab ${tabNumber + 1} —`));
  const lines = sourceLines.slice(start, end);
  const titleIndex = lines.indexOf('TITLE SECTION');
  const subtitleIndex = lines.indexOf('SUBTITLE SECTION');
  const bodyIndex = lines.indexOf('BODY SECTION');
  const ctaIndex = lines.findIndex((line) => line.startsWith('Primary CTA:'));
  const bodyEnd = ctaIndex >= 0 ? ctaIndex : lines.length;
  const section = {
    navLabel: sourceNav[index],
    title: lines[titleIndex + 1],
    subtitle: lines[subtitleIndex + 1],
  };

  if (tabNumber === 2) {
    section.cards = lines
      .map((line, lineIndex) => line.startsWith('Image:') ? lines[lineIndex + 1] : null)
      .filter(Boolean)
      .map((title) => ({ title }));
  } else {
    section.body = lines
      .slice(bodyIndex + 1, bodyEnd)
      .map((line) => line.replace(/^•/, '').replace(/^(\d)(?=[A-Z])/, '$1 '))
      .join(' ');
  }

  if (ctaIndex >= 0) {
    const ctas = lines[ctaIndex]
      .replace('Primary CTA:', '')
      .split('|')
      .map((cta) => normalize(cta.replace('Secondary CTA:', '')));
    [section.cta, section.secondaryCta] = ctas;
  }

  return section;
});

const drift = [];
if (sourceSections.length !== STORY_SECTIONS.length) {
  drift.push(`Document has ${sourceSections.length} sections; application has ${STORY_SECTIONS.length}.`);
}

sourceSections.forEach((source, index) => {
  const application = STORY_SECTIONS[index];
  for (const key of ['navLabel', 'title', 'subtitle']) {
    if ((source[key] ?? '') !== (application?.[key] ?? '')) {
      drift.push(`Tab ${index + 1} ${key} differs from FireSafeX_Concise_Website_Content.docx.`);
    }
  }

  const sourceCards = (source.cards ?? []).map(({ title }) => title);
  const applicationCards = (application?.cards ?? []).map(({ title }) => title);
  if (JSON.stringify(sourceCards) !== JSON.stringify(applicationCards)) {
    drift.push(`Tab ${index + 1} card titles differ from FireSafeX_Concise_Website_Content.docx.`);
  }
});

const salesStrings = STORY_SECTIONS.flatMap((section) => [
  section.body,
  section.cta,
  section.secondaryCta,
  ...(section.sellingPoints ?? []).flatMap(({ value, label, detail }) => [value, label, detail]),
].filter(Boolean));
const missingFromAddendum = [...new Set(salesStrings)]
  .filter((value) => !addendumText.includes(value));

const approvedStrings = [...new Set(STORY_SECTIONS.flatMap((section) => [
  section.navLabel,
  section.title,
  section.subtitle,
  section.body,
  section.cta,
  section.secondaryCta,
  ...(section.cards ?? []).map(({ title }) => title),
  ...(section.sellingPoints ?? []).flatMap(({ value, label, detail }) => [value, label, detail]),
].filter(Boolean)))];
const missing = approvedStrings.filter((value) => !pageText.includes(value));
const renderedSections = (html.match(/data-story-section="true"/g) ?? []).length;

if (renderedSections !== 7) {
  drift.push(`Static page renders ${renderedSections} story sections; expected 7.`);
}

if (!fs.existsSync(brochurePath)) {
  drift.push(`Missing brochure download at ${BROCHURE.href}.`);
}

if (!fs.existsSync(demoVideoPath)) {
  drift.push('Missing optimized FireSafeX demonstration video.');
}

for (const visit of CLIENT_VISITS) {
  if (!pageText.includes(visit.name)) drift.push(`Missing client visit entry: ${visit.name}.`);
  const imagePath = new URL(`../public${visit.image}`, import.meta.url);
  if (!fs.existsSync(imagePath)) drift.push(`Missing client visit image: ${visit.image}.`);
}

if (pageText.includes('100% certificate accuracy')) {
  drift.push('Unsupported numerical certificate accuracy claim is present.');
}

if (drift.length || missing.length || missingFromAddendum.length) {
  drift.forEach((value) => console.error(`Content drift: ${value}`));
  missing.forEach((value) => console.error(`Missing approved content: ${value}`));
  missingFromAddendum.forEach((value) => console.error(`Missing from sales addendum: ${value}`));
  process.exit(1);
}

console.log(`Validated 7 sections and ${approvedStrings.length} approved strings against the DOCX and sales addendum.`);
