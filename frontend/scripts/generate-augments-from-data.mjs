#!/usr/bin/env node
/**
 * Generate thumbnails for augment icons based on the actual augment data
 */
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

// Import the actual augment data
import { tier1Augments, tier2Augments, tier3Augments } from "../src/utils/augments.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const THUMB_SIZE = 64;
const OUTPUT_DIR = path.resolve(__dirname, "../src/assets/AugmentIcons/thumbs");

async function generateThumbnails() {
  console.log("🎨 Generating augment thumbnails from actual augment data...\n");
  
  // Create output directory
  await fs.mkdir(OUTPUT_DIR, { recursive: true });
  
  const allAugments = [...tier1Augments, ...tier2Augments, ...tier3Augments];
  console.log(`Processing ${allAugments.length} augments...\n`);
  
  let processed = 0;
  let skipped = 0;
  
  for (const augment of allAugments) {
    try {
      // Get the original image path from the ImageMetadata object
      const imgSrc = augment.image?.src;
      if (!imgSrc) {
        console.warn(`⚠️ Skipping ${augment.name}: no image source`);
        skipped++;
        continue;
      }
      
      // Extract filename from the src path
      const filename = path.basename(imgSrc);
      const nameWithoutExt = path.parse(filename).name;
      
      // Create WebP thumbnail filename
      const webpFilename = `${nameWithoutExt}.webp`;
      const outputPath = path.join(OUTPUT_DIR, webpFilename);
      
      // Skip if already exists
      try {
        await fs.access(outputPath);
        // console.log(`✅ Already exists: ${webpFilename}`);
        processed++;
        continue;
      } catch {
        // File doesn't exist, proceed to create it
      }
      
      // Read the original image and convert to WebP
      const inputPath = path.resolve(__dirname, "..", "src", "assets", "AugmentIcons", filename);
      try {
        await fs.access(inputPath);
        
        // Use sharp to convert
        const sharp = (await import("sharp")).default;
        await sharp(inputPath)
          .resize(THUMB_SIZE, THUMB_SIZE, { fit: "cover" })
          .webp({ quality: 85 })
          .toFile(outputPath);
          
        // console.log(`✅ Generated: ${webpFilename}`);
        processed++;
      } catch (err) {
        console.warn(`⚠️ Error processing ${filename}: ${err.message}`);
        skipped++;
      }
    } catch (err) {
      console.error(`❌ Error with augment ${augment.name}:`, err.message);
      skipped++;
    }
  }
  
  console.log(`\n✅ Done! Processed: ${processed}, Skipped: ${skipped}`);
}

generateThumbnails().catch((err) => {
  console.error("❌ Failed to generate thumbnails:", err);
  process.exit(1);
});