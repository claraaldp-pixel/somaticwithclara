import puppeteer from 'puppeteer';

const CHROME_PATH = '/Users/clara/.cache/puppeteer/chrome/mac_arm-146.0.7680.153/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing';
const BASE_URL = 'http://localhost:3002';

const checks = [];
function check(name, fn) { checks.push({ name, fn }); }

check('photo-split component exists with real image (not a placeholder box)', async (page) => {
  const el = await page.evaluate(() => {
    const media = document.querySelector('.photo-split-media img');
    if (!media) return null;
    return { src: media.getAttribute('src'), naturalWidth: media.naturalWidth };
  });
  if (!el) return false;
  return el.src.includes('brand-assets/') && el.naturalWidth > 0;
});

check('no scroll-controlled hero video remains', async (page) => {
  const hasVideo = await page.evaluate(() => !!document.querySelector('#hero-video, .hero-video, #hero-outer, .hero-scroll-outer'));
  return !hasVideo;
});

check('Section 01 uses reversed photo-split with real definition-selfhug photo', async (page) => {
  const el = await page.evaluate(() => {
    const imgs = Array.from(document.querySelectorAll('.photo-split.reverse .photo-split-media img'));
    return imgs.map(i => i.getAttribute('src'));
  });
  return el.some(src => src && src.includes('definition-selfhug.jpg'));
});

check('services use bold visible numerals, no decorative icons', async (page) => {
  const result = await page.evaluate(() => {
    const numerals = Array.from(document.querySelectorAll('.service-numeral'));
    const icons = document.querySelectorAll('.service-icon');
    if (numerals.length !== 4 || icons.length !== 0) return null;
    const style = getComputedStyle(numerals[0]);
    return { opacity: parseFloat(style.opacity), fontSize: parseFloat(style.fontSize) };
  });
  if (!result) return false;
  // "Bold visible" means opacity close to 1 (not the ~0.1 ghosted look) and a large font size
  return result.opacity > 0.8 && result.fontSize >= 32;
});

async function run() {
  const browser = await puppeteer.launch({ executablePath: CHROME_PATH, headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
  await page.goto(`${BASE_URL}/index.html`, { waitUntil: 'networkidle2' });

  let failed = 0;
  for (const { name, fn } of checks) {
    let ok = false;
    try { ok = await fn(page); } catch (e) { ok = false; console.error(`  error in "${name}":`, e.message); }
    console.log(`${ok ? 'PASS' : 'FAIL'} — ${name}`);
    if (!ok) failed++;
  }
  await browser.close();
  if (failed > 0) { console.log(`\n${failed} check(s) failed.`); process.exit(1); }
  console.log('\nAll checks passed.');
}

run();
