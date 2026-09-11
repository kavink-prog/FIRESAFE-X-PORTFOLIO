import { createReadStream, createWriteStream } from 'node:fs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { createInterface } from 'node:readline';
import { once } from 'node:events';
import { finished } from 'node:stream/promises';
import { spawn } from 'node:child_process';
import path from 'node:path';

const [sourceArg, motionArg, workArg, outputArg] = process.argv.slice(2);
if (!outputArg) throw new Error('Usage: render-stabilized-demo.mjs source.mp4 motions.trf work-directory output.mp4');
const [source, motion, work, output] = [sourceArg, motionArg, workArg, outputArg].map(p => path.resolve(p));
const ffmpeg = process.env.FFMPEG_BIN || 'ffmpeg';
const fps = 60;
const readLines = file => createInterface({ input: createReadStream(file), crlfDelay: Infinity });
await mkdir(work, { recursive: true });
let count = 0;
for await (const line of readLines(motion)) if (line.startsWith('Frame ')) {
  if (Number(line.match(/^Frame (\d+)/)?.[1]) !== ++count) throw new Error('Nonconsecutive motion frames');
}
if (!count) throw new Error('Empty motion file');
const parts = Array.from({ length: Math.ceil(count / 1800) }, (_, i) => {
  const start = i * 1800, end = Math.min(start + 1800, count);
  return { i, start, end, from: Math.max(0, start - 72), to: Math.min(count, end + 72),
    motion: path.join(work, `part-${i}.trf`), video: path.join(work, `part-${i}.mp4`),
    progress: path.join(work, `part-${i}-progress.log`) };
});
const writers = parts.map(p => createWriteStream(p.motion));
writers.forEach(w => w.write('VID.STAB 1\n'));
for await (const line of readLines(motion)) {
  if (!line.startsWith('Frame ')) continue;
  const frame = Number(line.match(/^Frame (\d+)/)[1]) - 1;
  // Keep strong measurements spread across the image, rather than thousands
  // of redundant heap allocations concentrated in one textured area.
  const cells = new Map();
  for (const m of line.matchAll(/\(LM (-?\d+) (-?\d+) (\d+) (\d+) (\d+) ([\d.]+) ([\d.]+)\)/g)) {
    const cell = `${Math.min(7, Math.floor(Number(m[3]) / 240))}:${Math.min(3, Math.floor(Number(m[4]) / 270))}`;
    const entries = cells.get(cell) || [];
    entries.push({ record: m[0], score: Number(m[6]) / (1 + Number(m[7])) });
    cells.set(cell, entries.sort((a, b) => b.score - a.score).slice(0, 2));
  }
  const records = [...cells.values()].flat().map(p => p.record);
  for (const p of parts) if (frame >= p.from && frame < p.to) {
    const row = `Frame ${frame - p.from + 1} (List ${records.length} [${records.join(',')}])\n`;
    if (!writers[p.i].write(row)) await once(writers[p.i], 'drain');
  }
}
writers.forEach(w => w.end());
await Promise.all(writers.map(w => finished(w)));
await writeFile(path.join(work, 'parts.json'), JSON.stringify({ fps, count, parts }, null, 2));

const run = args => new Promise((resolve, reject) => {
  const child = spawn(ffmpeg, args, { stdio: ['ignore', 'ignore', 'pipe'] });
  let errors = '';
  child.stderr.on('data', data => { errors = (errors + data).slice(-12000); });
  child.once('error', reject);
  child.once('exit', code => code === 0 ? resolve() : reject(new Error(`ffmpeg exited ${code}: ${errors}`)));
});
let next = 0;
let completed = 0;
async function worker() {
  while (next < parts.length) {
    const p = parts[next++];
    if (process.env.RESUME_RENDER === '1') {
      try {
        const done = JSON.parse(await readFile(path.join(work, `part-${p.i}-complete.json`), 'utf8'));
        if (done.index === p.i && done.frames === p.end - p.start) {
          completed++;
          console.log(`Reusing completed section ${p.i + 1}/${parts.length}`);
          continue;
        }
      } catch (error) {
        if (error.code !== 'ENOENT') throw error;
      }
    }
    const filter = [
      'fps=60:start_time=0', `trim=start_frame=${p.from}:end_frame=${p.to}`, 'setpts=PTS-STARTPTS',
      'colorspace=all=bt709', 'hqdn3d=0.6:0.4:1.0:0.6',
      `vidstabtransform=input=${p.motion}:smoothing=24:optalgo=gauss:maxshift=10:maxangle=0.006:crop=black:zoom=4:optzoom=0:interpol=bicubic`,
      `trim=start_frame=${p.start-p.from}:end_frame=${p.end-p.from}`, 'setpts=PTS-STARTPTS',
      'eq=contrast=1.035:brightness=0.006:gamma=1.12:saturation=1.06', 'cas=strength=0.25:planes=1',
    ].join(',');
    console.log(`Rendering section ${p.i + 1}/${parts.length}`);
    await run(['-hide_banner', '-nostats', '-loglevel', 'warning', '-ss', String(Math.max(0, p.from/fps - 2)),
      '-copyts', '-i', source, '-an', '-vf', filter, '-c:v', 'h264_videotoolbox', '-b:v', '24M',
      '-maxrate', '32M', '-bufsize', '48M', '-profile:v', 'high', '-pix_fmt', 'yuv420p',
      '-video_track_timescale', '60000', '-progress', p.progress, '-y', p.video]);
    completed++;
    await writeFile(path.join(work, `part-${p.i}-complete.json`), JSON.stringify({ index: p.i, frames: p.end-p.start }));
    console.log(`Completed ${completed}/${parts.length} sections`);
  }
}
await Promise.all(Array.from({ length: 6 }, () => worker()));
// Only generated paths go into the concat manifest. Escape the demuxer's
// quoted-filename syntax, independently of shell quoting.
const quote = p => `'${p.replaceAll("'", "'\\''")}'`;
const manifest = path.join(work, 'concat.txt');
await writeFile(manifest, parts.map(p => `file ${quote(p.video)}`).join('\n') + '\n');
await run(['-hide_banner', '-nostats', '-loglevel', 'warning', '-f', 'concat', '-safe', '0', '-i', manifest,
  '-i', source, '-map', '0:v:0', '-map', '1:a:0?', '-map_metadata', '1', '-c', 'copy',
  '-movflags', '+faststart', '-y', output]);
console.log(JSON.stringify({ output, frames: count, sections: parts.length }));
