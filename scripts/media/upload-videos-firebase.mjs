/**
 * One-off uploader: pushes the problem-comparison clips in
 * public/assets/videos/problem/{legacy,firesafex} to
 * Firebase Storage so the heavy .mp4 files don't have to live in git.
 *
 * Each file keeps its path (assets/videos/problem/legacy/old-1-dust.mp4) and is made public, so
 * the resulting URLs are stable and predictable:
 *
 *   https://storage.googleapis.com/<bucket>/assets/videos/problem/legacy/old-1-dust.mp4
 *
 * Setup (one time):
 *   1. Create a project at https://console.firebase.google.com
 *   2. Build → Storage → "Get started" (enable Storage)
 *   3. Project settings (gear) → Service accounts → "Generate new private key"
 *      → saves a .json file. Move it somewhere safe (NOT inside the repo).
 *   4. On the Storage page, copy the bucket name shown after gs:// e.g.
 *        your-project.firebasestorage.app   (or your-project.appspot.com)
 *   5. From the firesafex-web folder:
 *        npm install firebase-admin
 *        GOOGLE_APPLICATION_CREDENTIALS="/full/path/to/serviceAccount.json" \
 *        FIREBASE_STORAGE_BUCKET="your-project.firebasestorage.app" \
 *        node scripts/media/upload-videos-firebase.mjs
 *
 * On success it writes scripts/firebase-videos.json (the local-path → URL map).
 */
import admin from 'firebase-admin';
import { readdir, writeFile } from 'node:fs/promises';
import { join, parse } from 'node:path';
import { fileURLToPath } from 'node:url';

const VIDEO_DIR = fileURLToPath(new URL('../../public/assets/videos/problem/', import.meta.url));
const FOLDERS = ['legacy', 'firesafex']; // subfolders under public/assets/videos/problem

const bucketName = process.env.FIREBASE_STORAGE_BUCKET;
if (!process.env.GOOGLE_APPLICATION_CREDENTIALS || !bucketName) {
  console.error('✗ Set GOOGLE_APPLICATION_CREDENTIALS and FIREBASE_STORAGE_BUCKET. See the comment at the top of this file.');
  process.exit(1);
}

admin.initializeApp({ storageBucket: bucketName });
const bucket = admin.storage().bucket();
console.log(`Uploading to bucket "${bucketName}" ...\n`);

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
    const dest = `assets/videos/problem/${folder}/${file}`; // path inside the bucket
    await bucket.upload(join(dir, file), {
      destination: dest,
      metadata: { contentType: 'video/mp4', cacheControl: 'public, max-age=31536000' },
    });
    await bucket.file(dest).makePublic(); // anyone can read → stable public URL
    const url = `https://storage.googleapis.com/${bucketName}/${dest}`;
    manifest[`/assets/videos/problem/${folder}/${file}`] = url;
    console.log(`✓ ${dest}  →  ${url}`);
  }
}

const out = fileURLToPath(new URL('./firebase-videos.json', import.meta.url));
await writeFile(out, JSON.stringify(manifest, null, 2) + '\n');
console.log(`\nWrote ${Object.keys(manifest).length} URLs to ${out}`);
console.log('Next: share this file (or your bucket name) and the code will be wired to these URLs.');
process.exit(0);
