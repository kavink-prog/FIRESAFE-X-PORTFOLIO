import { readFileSync, writeFileSync } from 'node:fs';
import { deflateSync, inflateSync } from 'node:zlib';

const [, , inputPath, outputPath] = process.argv;

if (!inputPath || !outputPath) {
  console.error('Usage: node scripts/media/remove-light-background.mjs input.png output.png');
  process.exit(1);
}

const source = readFileSync(inputPath);
const signature = source.subarray(0, 8);

if (signature.toString('hex') !== '89504e470d0a1a0a') {
  throw new Error('Input must be a PNG file.');
}

const idat = [];
let width;
let height;
let colorType;
let bitDepth;

for (let offset = 8; offset < source.length; ) {
  const length = source.readUInt32BE(offset);
  const type = source.toString('ascii', offset + 4, offset + 8);
  const data = source.subarray(offset + 8, offset + 8 + length);
  offset += 12 + length;

  if (type === 'IHDR') {
    width = data.readUInt32BE(0);
    height = data.readUInt32BE(4);
    bitDepth = data[8];
    colorType = data[9];
    if (data[12] !== 0) throw new Error('Interlaced PNGs are not supported.');
  } else if (type === 'IDAT') {
    idat.push(data);
  }
}

if (bitDepth !== 8 || ![2, 6].includes(colorType)) {
  throw new Error(`Unsupported PNG format: bitDepth=${bitDepth}, colorType=${colorType}`);
}

const inputChannels = colorType === 6 ? 4 : 3;
const stride = width * inputChannels;
const inflated = inflateSync(Buffer.concat(idat));
const pixels = Buffer.alloc(width * height * inputChannels);
let sourceOffset = 0;

const paeth = (a, b, c) => {
  const p = a + b - c;
  const pa = Math.abs(p - a);
  const pb = Math.abs(p - b);
  const pc = Math.abs(p - c);
  if (pa <= pb && pa <= pc) return a;
  return pb <= pc ? b : c;
};

for (let y = 0; y < height; y += 1) {
  const filter = inflated[sourceOffset++];
  const rowStart = y * stride;
  for (let x = 0; x < stride; x += 1) {
    const raw = inflated[sourceOffset++];
    const left = x >= inputChannels ? pixels[rowStart + x - inputChannels] : 0;
    const up = y > 0 ? pixels[rowStart + x - stride] : 0;
    const upperLeft = y > 0 && x >= inputChannels ? pixels[rowStart + x - stride - inputChannels] : 0;
    let value = raw;
    if (filter === 1) value += left;
    else if (filter === 2) value += up;
    else if (filter === 3) value += Math.floor((left + up) / 2);
    else if (filter === 4) value += paeth(left, up, upperLeft);
    else if (filter !== 0) throw new Error(`Unsupported PNG filter: ${filter}`);
    pixels[rowStart + x] = value & 255;
  }
}

const rgba = Buffer.alloc(width * height * 4);
for (let i = 0, j = 0; i < pixels.length; i += inputChannels, j += 4) {
  rgba[j] = pixels[i];
  rgba[j + 1] = pixels[i + 1];
  rgba[j + 2] = pixels[i + 2];
  rgba[j + 3] = inputChannels === 4 ? pixels[i + 3] : 255;
}

const visited = new Uint8Array(width * height);
const queue = new Uint32Array(width * height);
let head = 0;
let tail = 0;

const isBackground = (index) => {
  const offset = index * 4;
  const r = rgba[offset];
  const g = rgba[offset + 1];
  const b = rgba[offset + 2];
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  return max - min <= 18 && (r + g + b) / 3 >= 185;
};

const enqueue = (index) => {
  if (!visited[index] && isBackground(index)) {
    visited[index] = 1;
    queue[tail++] = index;
  }
};

for (let x = 0; x < width; x += 1) {
  enqueue(x);
  enqueue((height - 1) * width + x);
}
for (let y = 1; y < height - 1; y += 1) {
  enqueue(y * width);
  enqueue(y * width + width - 1);
}

while (head < tail) {
  const index = queue[head++];
  const x = index % width;
  const y = Math.floor(index / width);
  if (x > 0) enqueue(index - 1);
  if (x + 1 < width) enqueue(index + 1);
  if (y > 0) enqueue(index - width);
  if (y + 1 < height) enqueue(index + width);
}

for (let index = 0; index < visited.length; index += 1) {
  if (visited[index]) rgba[index * 4 + 3] = 0;
}

const scanlines = Buffer.alloc((width * 4 + 1) * height);
for (let y = 0; y < height; y += 1) {
  const target = y * (width * 4 + 1);
  scanlines[target] = 0;
  rgba.copy(scanlines, target + 1, y * width * 4, (y + 1) * width * 4);
}

const crcTable = Array.from({ length: 256 }, (_, n) => {
  let c = n;
  for (let k = 0; k < 8; k += 1) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});

const crc32 = (buffer) => {
  let crc = 0xffffffff;
  for (const byte of buffer) crc = crcTable[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
};

const chunk = (type, data) => {
  const typeBuffer = Buffer.from(type);
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length);
  const checksum = Buffer.alloc(4);
  checksum.writeUInt32BE(crc32(Buffer.concat([typeBuffer, data])));
  return Buffer.concat([length, typeBuffer, data, checksum]);
};

const ihdr = Buffer.alloc(13);
ihdr.writeUInt32BE(width, 0);
ihdr.writeUInt32BE(height, 4);
ihdr[8] = 8;
ihdr[9] = 6;
ihdr[10] = 0;
ihdr[11] = 0;
ihdr[12] = 0;

writeFileSync(
  outputPath,
  Buffer.concat([
    signature,
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(scanlines, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]),
);

console.log(`Removed connected light background from ${tail.toLocaleString()} pixels.`);
