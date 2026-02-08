/**
 * Genera thumbnails 64x64 WebP de todas las imágenes de campeones JPG.
 * Uso: node scripts/generate-thumbnails.mjs
 * 
 * Requiere: sharp (disponible via dependencias de Astro)
 */
import sharp from "sharp";
import { readdirSync, mkdirSync, existsSync } from "node:fs";
import { join, basename, extname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const championsDir = join(__dirname, "..", "src", "assets", "Champions");
const thumbsDir = join(championsDir, "thumbs");

// Crear directorio de thumbnails si no existe
if (!existsSync(thumbsDir)) {
  mkdirSync(thumbsDir, { recursive: true });
}

const THUMB_SIZE = 64;

const jpgFiles = readdirSync(championsDir).filter(
  (f) => extname(f).toLowerCase() === ".jpg"
);

console.log(`Encontrados ${jpgFiles.length} archivos JPG en Champions/`);
console.log(`Generando thumbnails ${THUMB_SIZE}x${THUMB_SIZE} WebP en Champions/thumbs/\n`);

let success = 0;
let failed = 0;

for (const file of jpgFiles) {
  const inputPath = join(championsDir, file);
  const nameWithoutExt = basename(file, extname(file));
  const outputPath = join(thumbsDir, `${nameWithoutExt}.webp`);

  try {
    await sharp(inputPath)
      .resize(THUMB_SIZE, THUMB_SIZE, {
        fit: "cover",
        position: "top", // Centrar en la parte superior (cara del campeón)
      })
      .webp({ quality: 80 })
      .toFile(outputPath);

    const inputStats = await sharp(inputPath).metadata();
    const outputStats = await sharp(outputPath).metadata();
    console.log(
      `  ✓ ${file} (${(inputStats.size / 1024 / 1024).toFixed(1)}MB) → ${nameWithoutExt}.webp (${outputStats.size ? (outputStats.size / 1024).toFixed(1) + "KB" : "ok"})`
    );
    success++;
  } catch (err) {
    console.error(`  ✗ ${file}: ${err.message}`);
    failed++;
  }
}

console.log(`\nResultado: ${success} exitosos, ${failed} fallidos`);
console.log(`Thumbnails guardados en: ${thumbsDir}`);
