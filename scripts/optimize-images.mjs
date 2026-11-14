/**
 * Gera as versões WebP responsivas a partir das fotos originais.
 *
 *   images/<id>.jpg|png  →  src/assets/img/<id>-<largura>.webp
 *
 * - Larguras: 160, 480 e 960px, só as menores que a original (nunca amplia),
 *   além da largura original quando ela for menor que 960px.
 * - Cada arquivo fica abaixo de MAX_BYTES: a qualidade desce de 5 em 5 até caber.
 *
 * Uso: npm run images  (rode depois de adicionar ou trocar uma foto em images/)
 */
import { mkdir, readdir, rm, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const SRC_DIR = "images";
const OUT_DIR = "src/assets/img";
const WIDTHS = [160, 480, 960];
const MAX_BYTES = 200 * 1024;
const QUALITY_START = 80;
const QUALITY_MIN = 45;

const widthsFor = (sourceWidth) => {
  const widths = WIDTHS.filter((w) => w < sourceWidth);
  const top = Math.min(sourceWidth, WIDTHS.at(-1));
  return [...new Set([...widths, top])].sort((a, b) => a - b);
};

async function encode(file, width) {
  for (let quality = QUALITY_START; quality >= QUALITY_MIN; quality -= 5) {
    const buffer = await sharp(file)
      .rotate() // respeita a orientação EXIF
      .resize({ width, withoutEnlargement: true })
      .webp({ quality, effort: 6 })
      .toBuffer();
    if (buffer.length <= MAX_BYTES) return { buffer, quality };
  }
  throw new Error(`${file} @${width}px não coube em ${MAX_BYTES / 1024} KB`);
}

async function main() {
  await rm(OUT_DIR, { recursive: true, force: true });
  await mkdir(OUT_DIR, { recursive: true });

  const sources = (await readdir(SRC_DIR)).filter((f) => /\.(jpe?g|png)$/i.test(f));
  let total = 0;
  let largest = 0;

  for (const name of sources) {
    const file = path.join(SRC_DIR, name);
    const id = path.parse(name).name;
    const { width } = await sharp(file).metadata();

    for (const w of widthsFor(width)) {
      const { buffer, quality } = await encode(file, w);
      const out = path.join(OUT_DIR, `${id}-${w}.webp`);
      await writeFile(out, buffer);
      total += buffer.length;
      largest = Math.max(largest, buffer.length);
      if (quality < QUALITY_START) console.log(`  ${id}-${w}.webp: qualidade ${quality}`);
    }
  }

  const srcBytes = (
    await Promise.all(sources.map((n) => stat(path.join(SRC_DIR, n)).then((s) => s.size)))
  ).reduce((a, b) => a + b, 0);
  const kb = (n) => `${(n / 1024).toFixed(0)} KB`;
  console.log(
    `${sources.length} fotos → ${OUT_DIR}: ${kb(total)} no total (originais: ${kb(srcBytes)}), maior arquivo ${kb(largest)}`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
