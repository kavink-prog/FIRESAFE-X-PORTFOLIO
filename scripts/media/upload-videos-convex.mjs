/**
 * One-off uploader: pushes the problem-comparison clips in
 * public/assets/videos/problem/{legacy,firesafex} to
 * Convex file storage so the heavy .mp4 files don't have to live in git or be
 * shipped in the Next.js bundle.
 *
 * Each upload returns a stable, public Convex URL:
 *   https://<deployment>.convex.cloud/api/storage/<id>
 *
 * Setup (one time):
 *   1. From the firesafex-web folder:  npx convex dev --once
 *      (logs you in via the browser the first time and creates the project;
 *       writes the deployment URL into .env.local)
 *   2. Then run the uploader:          node scripts/media/upload-videos-convex.mjs
 *
 * On success it writes data/video-urls.json (the local-path → Convex URL map),
 * which the home sections already read.
 */
import { ConvexHttpClient } from 'convex/browser';
import { makeFunctionReference } from 'convex/server';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

// The deployment URL is written to .env.local by `npx convex dev`.
let url = process.env.CONVEX_URL || process.env.NEXT_PUBLIC_CONVEX_URL;
if (!url) {
  try {
    const env = readFileSync(fileURLToPath(new URL('../../.env.local', import.meta.url)), 'utf8');
    const m = env.match(/^NEXT_PUBLIC_CONVEX_URL=(.+)$/m) || env.match(/^CONVEX_URL=(.+)$/m);
    if (m) url = m[1].trim().replace(/^["']|["']$/g, '');
  } catch {
    /* no .env.local yet */
  }
}
if (!url) {
  console.error('✗ No Convex URL found. Run `npx convex dev --once` first (it writes .env.local).');
  process.exit(1);
}

const client = new ConvexHttpClient(url);
const generateUploadUrl = makeFunctionReference('files:generateUploadUrl');
const getUrl = makeFunctionReference('files:getUrl');

const VIDEO_DIR = fileURLToPath(new URL('../../public/assets/videos/problem/', import.meta.url));
const FOLDERS = ['legacy', 'firesafex']; // subfolders under public/assets/videos/problem

console.log(`Uploading to ${url} ...\n`);
const manifest = {};

for (const folder of FOLDERS) {
  const dir = join(VIDEO_DIR, folder);
  let files;
  try {
    files = (await readdir(dir)).filter((f) => f.endsWith('.mp4'));
  } catch {
    console.warn(`(skipping ${folder}: no such folder)`);
    continue;
  }

  for (const file of files) {
    const bytes = await readFile(join(dir, file));
    const postUrl = await client.mutation(generateUploadUrl, {});
    const res = await fetch(postUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'video/mp4' },
      body: bytes,
    });
    if (!res.ok) throw new Error(`upload failed for ${file}: ${res.status} ${await res.text()}`);
    const { storageId } = await res.json();
    const publicUrl = await client.query(getUrl, { storageId });
    manifest[`/assets/videos/problem/${folder}/${file}`] = publicUrl;
    console.log(`✓ ${folder}/${file}  →  ${publicUrl}`);
  }
}

const out = fileURLToPath(new URL('../../data/video-urls.json', import.meta.url));
await writeFile(out, JSON.stringify(manifest, null, 2) + '\n');
console.log(`\nWrote ${Object.keys(manifest).length} URLs to ${out}`);
process.exit(0);
