#!/usr/bin/env node
/**
 * Generate thumbnails for augment icons
 * This creates optimized WebP versions of all augment icons
 */
import sharp from "sharp";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const AUGMENT_DIRS = [
  "General",
  "HeroAugmentIcons",
  "TraitAugmentIcons",
];

const THUMB_SIZE = 64;
const OUTPUT_DIR = path.resolve(__dirname, "../src/assets/AugmentIcons/thumbs");

async function processDirectory(dirPath, outputDir) {
  const files = await fs.readdir(dirPath);
  const imageFiles = files.filter(
    (f) => f.endsWith(".png") || f.endsWith(".jpg")
  );

  console.log(`Processing ${imageFiles.length} files in ${path.basename(dirPath)}...`);

  for (const file of imageFiles) {
    const inputPath = path.join(dirPath, file);
    const outputFileName = file.replace(/\.(png|jpg)$/i, ".webp");
    const outputPath = path.join(outputDir, outputFileName);

    try {
      await sharp(inputPath)
        .resize(THUMB_SIZE, THUMB_SIZE, { fit: "cover" })
        .webp({ quality: 85 })
        .toFile(outputPath);
    } catch (err) {
      console.error(`Error processing ${file}:`, err.message);
    }
  }
}

async function main() {
  console.log("🎨 Generating augment thumbnails...\n");

  // Create output directory
  await fs.mkdir(OUTPUT_DIR, { recursive: true });

  let totalProcessed = 0;
  const baseDir = path.resolve(__dirname, "../src/assets/AugmentIcons");

  for (const dir of AUGMENT_DIRS) {
    const fullPath = path.join(baseDir, dir);
    try {
      const files = await fs.readdir(fullPath);
      const imageFiles = files.filter(
        (f) => f.endsWith(".png") || f.endsWith(".jpg")
      );
      if (imageFiles.length > 0) {
        await processDirectory(fullPath, OUTPUT_DIR);
        totalProcessed += imageFiles.length;
      }
    } catch (err) {
      console.error(`Error reading directory ${dir}:`, err.message);
    }
  }

  console.log(`\n✅ Generated ${totalProcessed} augment thumbnails`);
}

main().catch((err) => {
  console.error("❌ Failed to generate thumbnails:", err);
  process.exit(1);
});
