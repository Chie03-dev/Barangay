/* ------------------------------------------------------------------ */
/*  One-off asset optimizer.                                           */
/*  Run with: node scripts/optimize-images.mjs                          */
/*                                                                     */
/*  The source files in assets/ are 1 MB+ because they were exported   */
/*  at print resolution. They are displayed at 32-112 px, so shipping   */
/*  them as-is wastes megabytes on every page load. This resizes each  */
/*  to ~2x its largest rendered size and re-encodes as WebP.           */
/* ------------------------------------------------------------------ */

import sharp from "sharp";
import { mkdir, stat, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

/** [source, output, maxEdgePx] - maxEdge is 2x the largest render size. */
const TARGETS = [
  ["assets/logo.png", "public/logo.png", 256],
  ["public/profile.png", "public/profile.webp", 320],
  ["assets/test1.png", "public/officials/test1.webp", 320],
  ["assets/test2.png", "public/officials/test2.webp", 320],
];

async function optimize([src, out, maxEdge]) {
  const srcPath = resolve(root, src);
  const outPath = resolve(root, out);

  const before = (await stat(srcPath)).size;

  const buffer = await sharp(srcPath)
    .resize(maxEdge, maxEdge, {
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({ quality: 82, effort: 6 })
    .toBuffer();

  await mkdir(dirname(outPath), { recursive: true });
  await writeFile(outPath, buffer);

  const meta = await sharp(outPath).metadata();
  const after = buffer.length;
  const saved = (100 - (after / before) * 100).toFixed(0);

  console.log(
    `${src.padEnd(28)} ${String(before).padStart(9)}B  ->  ${out.padEnd(30)} ${String(after).padStart(7)}B  (${meta.width}x${meta.height}, -${saved}%)`,
  );
}

for (const target of TARGETS) {
  await optimize(target);
}

console.log("\nDone.");
