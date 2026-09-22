// One-time asset pipeline: converts the brand SVGs into PNG images used by
// the website, the Android app and the seeded product catalogue.
//
// Usage: npm run seed:images   (or: node scripts/makeSeedImages.js)
// Requires: devDependency "sharp".
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const root = path.join(__dirname, '..', '..');
const webProducts = path.join(root, 'web', 'public', 'images', 'products');
const webLogo = path.join(root, 'web', 'public', 'logo.svg');
const seedDir = path.join(root, 'backend', 'public', 'uploads', 'seed');
const mobileAssets = path.join(root, 'mobile', 'assets');
const mobileArt = path.join(mobileAssets, 'art');

const PRODUCT_NAMES = [
  'gold-necklace',
  'bridal-necklace',
  'gold-jhumka',
  'gold-bangles',
  'gold-ring',
  'gold-chain',
  'diamond-ring',
  'silver-payal',
];

async function run() {
  fs.mkdirSync(seedDir, { recursive: true });
  fs.mkdirSync(mobileArt, { recursive: true });

  // 1) Product art → seed PNGs (backend/public/uploads/seed) → website + app catalogue
  for (const name of PRODUCT_NAMES) {
    const svg = path.join(webProducts, `${name}.svg`);
    if (!fs.existsSync(svg)) {
      console.warn('  skip missing:', svg);
      continue;
    }
    await sharp(svg).resize(800, 800).png().toFile(path.join(seedDir, `${name}.png`));
    await sharp(svg).resize(560, 560).png().toFile(path.join(mobileArt, `${name}.png`));
    console.log('  ✓', name);
  }

  // 2) Logo emblem
  const logo = await sharp(webLogo).resize(1024, 1024).png().toBuffer();
  await sharp(logo).toFile(path.join(seedDir, 'logo.png'));
  await sharp(logo).toFile(path.join(mobileAssets, 'icon.png'));
  await sharp(logo).toFile(path.join(mobileAssets, 'adaptive-icon.png'));
  await sharp(logo).resize(48, 48).png().toFile(path.join(mobileAssets, 'favicon.png'));

  // 3) App splash: maroon background with centered logo
  const { width, height } = { width: 1242, height: 2436 };
  const splash = await sharp({
    create: {
      width,
      height,
      channels: 4,
      background: { r: 74, g: 14, b: 27, alpha: 1 },
    },
  })
    .composite([{ input: await sharp(logo).resize(320, 320).png().toBuffer(), gravity: 'center' }])
    .png()
    .toBuffer();
  await sharp(splash).toFile(path.join(mobileAssets, 'splash.png'));

  console.log('\n✔ Assets generated.');
  console.log('  backend/public/uploads/seed/*.png   → product catalogue + gallery');
  console.log('  mobile/assets/{icon,adaptive-icon,splash,favicon}.png → Android app branding');
  console.log('  mobile/assets/art/*.png             → Android offline art fallbacks');
}

run().catch((e) => {
  console.error('Asset generation failed:', e.message);
  process.exit(1);
});