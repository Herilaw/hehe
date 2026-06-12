/**
 * 批量压缩游戏图片，并生成 WebP / AVIF 现代格式副本。
 * 用法：node scripts/optimize-images.js
 */
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const IMAGES_DIR = path.join(__dirname, "../assets/images");
const MAX_WIDTH = 1600; // 页面 max-width 800px 的 2x 视网膜
const WEBP_QUALITY = 82;
const AVIF_QUALITY = 55;
const SKIP_PATTERN = /[（(]\d+[）)]/; // 跳过备份副本，如 xxx（2）.png

function baseName(filename) {
  return filename
    .replace(/\.jpg\.png$/i, "")
    .replace(/\.png$/i, "")
    .replace(/\.jpe?g$/i, "");
}

function formatKB(bytes) {
  return Math.round(bytes / 1024);
}

async function optimizeOne(filename) {
  const inputPath = path.join(IMAGES_DIR, filename);
  const base = baseName(filename);
  const webpPath = path.join(IMAGES_DIR, `${base}.webp`);
  const avifPath = path.join(IMAGES_DIR, `${base}.avif`);

  const originalSize = fs.statSync(inputPath).size;
  const meta = await sharp(inputPath).metadata();

  let pipeline = sharp(inputPath);
  if (meta.width > MAX_WIDTH) {
    pipeline = pipeline.resize({
      width: MAX_WIDTH,
      withoutEnlargement: true,
      fit: "inside",
    });
  }

  const resizedBuf = await pipeline.toBuffer();
  const resizedMeta = await sharp(resizedBuf).metadata();

  const pngBuf = await sharp(resizedBuf)
    .png({ compressionLevel: 9, effort: 10 })
    .toBuffer();

  const webpBuf = await sharp(resizedBuf)
    .webp({ quality: WEBP_QUALITY, effort: 6 })
    .toBuffer();

  const avifBuf = await sharp(resizedBuf)
    .avif({ quality: AVIF_QUALITY, effort: 4 })
    .toBuffer();

  fs.writeFileSync(inputPath, pngBuf);
  fs.writeFileSync(webpPath, webpBuf);
  fs.writeFileSync(avifPath, avifBuf);

  return {
    file: filename,
    dimensions: `${resizedMeta.width}x${resizedMeta.height}`,
    originalKB: formatKB(originalSize),
    pngKB: formatKB(pngBuf.length),
    webpKB: formatKB(webpBuf.length),
    avifKB: formatKB(avifBuf.length),
  };
}

async function main() {
  const files = fs
    .readdirSync(IMAGES_DIR)
    .filter((f) => /\.(png|jpe?g)$/i.test(f) && !SKIP_PATTERN.test(f));

  console.log(`处理 ${files.length} 张图片（最长边 ≤ ${MAX_WIDTH}px）…\n`);

  let totalOrig = 0;
  let totalPng = 0;
  let totalWebp = 0;
  let totalAvif = 0;

  for (const file of files) {
    const result = await optimizeOne(file);
    totalOrig += result.originalKB;
    totalPng += result.pngKB;
    totalWebp += result.webpKB;
    totalAvif += result.avifKB;
    console.log(
      `${result.file}: ${result.dimensions} | ${result.originalKB}KB → PNG ${result.pngKB}KB | WebP ${result.webpKB}KB | AVIF ${result.avifKB}KB`
    );
  }

  console.log("\n── 汇总 ──");
  console.log(`原始合计: ${totalOrig} KB`);
  console.log(`优化 PNG:  ${totalPng} KB（-${Math.round((1 - totalPng / totalOrig) * 100)}%）`);
  console.log(`WebP 合计: ${totalWebp} KB（-${Math.round((1 - totalWebp / totalOrig) * 100)}%）`);
  console.log(`AVIF 合计: ${totalAvif} KB（-${Math.round((1 - totalAvif / totalOrig) * 100)}%）`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
