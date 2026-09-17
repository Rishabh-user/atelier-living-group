/**
 * Re-encode everything in public/images in place.
 *
 * Banner and card images are never shown wider than the 1440px content column,
 * so anything larger than MAX_WIDTH is wasted bytes. JPEGs go through mozjpeg,
 * WebP through its own encoder.
 *
 * Originals are read into memory first, so a file is only overwritten when the
 * new encode is actually smaller.
 *
 * usage: node scripts/compress-images.mjs [--quality 80] [--max-width 1920]
 */
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, extname, basename } from "node:path";
import sharp from "sharp";

const DIR = "public/images";
const args = process.argv.slice(2);
const argVal = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i === -1 ? fallback : Number(args[i + 1]);
};

const QUALITY = argVal("quality", 80);
const MAX_WIDTH = argVal("max-width", 1920);

const files = readdirSync(DIR).filter((f) =>
  [".jpg", ".jpeg", ".png", ".webp"].includes(extname(f).toLowerCase()),
);

let before = 0;
let after = 0;
const rows = [];

for (const file of files) {
  const path = join(DIR, file);
  const input = readFileSync(path);
  const originalKb = Math.round(input.length / 1024);
  before += input.length;

  const meta = await sharp(input).metadata();
  const pipeline = sharp(input).rotate();

  if (meta.width && meta.width > MAX_WIDTH) {
    pipeline.resize({ width: MAX_WIDTH, withoutEnlargement: true });
  }

  const ext = extname(file).toLowerCase();
  const output =
    ext === ".webp"
      ? await pipeline.webp({ quality: QUALITY, effort: 5 }).toBuffer()
      : ext === ".png"
        ? await pipeline.png({ compressionLevel: 9, palette: true }).toBuffer()
        : await pipeline
            .jpeg({ quality: QUALITY, mozjpeg: true, progressive: true })
            .toBuffer();

  const newKb = Math.round(output.length / 1024);

  if (output.length < input.length) {
    writeFileSync(path, output);
    after += output.length;
    rows.push({
      file: basename(file),
      px: `${meta.width}x${meta.height}`,
      before: originalKb,
      after: newKb,
      saved: `${Math.round((1 - output.length / input.length) * 100)}%`,
    });
  } else {
    after += input.length;
    rows.push({
      file: basename(file),
      px: `${meta.width}x${meta.height}`,
      before: originalKb,
      after: originalKb,
      saved: "kept",
    });
  }
}

console.table(rows);
console.log(
  `\ntotal ${Math.round(before / 1024)} KB -> ${Math.round(after / 1024)} KB ` +
    `(${Math.round((1 - after / before) * 100)}% smaller), quality=${QUALITY}, maxWidth=${MAX_WIDTH}`,
);
