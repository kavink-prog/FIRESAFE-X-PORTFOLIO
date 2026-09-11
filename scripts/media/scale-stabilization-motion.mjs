import { createReadStream, createWriteStream } from 'node:fs';
import { createInterface } from 'node:readline';
import { once } from 'node:events';
import { finished } from 'node:stream/promises';

// Scale proxy-space vid.stab displacements and measurement fields to the
// full-resolution frame. Contrast and matching scores are dimensionless.
const [input, output, scaleArg = '2'] = process.argv.slice(2);
const scale = Number(scaleArg);
if (!input || !output || input === output || !Number.isInteger(scale) || scale < 1) {
  throw new Error('Usage: node scale-stabilization-motion.mjs input.trf output.trf integer-scale');
}

const reader = createInterface({ input: createReadStream(input), crlfDelay: Infinity });
const writer = createWriteStream(output, { flags: 'wx' });
let frames = 0;
let motions = 0;
let first = true;
for await (const line of reader) {
  if (first && line !== 'VID.STAB 1') throw new Error('Expected vid.stab ASCII format version 1');
  first = false;
  if (line.startsWith('Frame ')) frames += 1;
  let lineMotions = 0;
  const scaled = line.replace(/\(LM (-?\d+) (-?\d+) (\d+) (\d+) (\d+) /g,
    (_, dx, dy, x, y, size) => {
      motions += 1;
      lineMotions += 1;
      return `(LM ${[dx, dy, x, y, size].map(value => Number(value) * scale).join(' ')} `;
    });
  const expected = line.match(/\(List (\d+) \[/);
  if (expected && Number(expected[1]) !== lineMotions) {
    throw new Error(`Unrecognized motion record in frame ${frames}`);
  }
  if (!writer.write(`${scaled}\n`)) await once(writer, 'drain');
}
writer.end();
await finished(writer);
if (!frames || !motions) throw new Error('No motion measurements found');
console.log(JSON.stringify({ frames, motions, scale, output }));
