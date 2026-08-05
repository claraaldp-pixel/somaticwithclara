import puppeteer from 'puppeteer';
import { mkdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { SOURCE_DIR, FRAMES_DIR, ROOT } from './config.mjs';

const CHROME = '/Users/clara/.cache/puppeteer/chrome/mac_arm-146.0.7680.153/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing';
const SCENES = join(ROOT, 'scripts', 'higgsfield', 'scenes');
const BRAND_ASSETS = join(ROOT, 'brand-assets');

/**
 * Each composition pairs a scene template with a captured screenshot.
 * `bg`, when set, is a brand photo filename resolved from `brand-assets/` and
 * threaded through to the scene as a second `?bg=` file:// URL.
 */
const COMPOSITIONS = [
  { name: 'phone-linen', scene: 'phone-linen.html', shot: 'app-home.png', width: 1080, height: 1920 },
  { name: 'report-desk', scene: 'report-desk.html', shot: 'report-content-1.png', width: 1920, height: 1080 },
  { name: 'phone-photo-courtyard', scene: 'phone-photo.html', shot: 'app-home.png', bg: 'courtyard-walk.jpg', width: 1080, height: 1920 },
];

mkdirSync(FRAMES_DIR, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
});

for (const { name, scene, shot, bg, width, height } of COMPOSITIONS) {
  const shotPath = join(SOURCE_DIR, shot);
  if (!existsSync(shotPath)) {
    console.error(`missing capture ${shot} — run "node --env-file=.env scripts/higgsfield/capture.mjs" first`);
    process.exitCode = 1;
    continue;
  }

  let bgPath = null;
  if (bg) {
    bgPath = join(BRAND_ASSETS, bg);
    if (!existsSync(bgPath)) {
      console.error(`missing brand photo ${bg} in ${BRAND_ASSETS}`);
      process.exitCode = 1;
      continue;
    }
  }

  let url = `file://${join(SCENES, scene)}?src=file://${shotPath}`;
  if (bgPath) url += `&bg=${pathToFileURL(bgPath).href}`;

  const page = await browser.newPage();
  await page.setViewport({ width, height, deviceScaleFactor: 1 });
  await page.goto(url, { waitUntil: 'networkidle2' });
  await new Promise((r) => setTimeout(r, 800));

  const out = join(FRAMES_DIR, `${name}.png`);
  await page.screenshot({ path: out });
  await page.close();
  console.log(`composed ${name}.png (${width}x${height})`);
}

await browser.close();
console.log(`\nFirst frames written to ${FRAMES_DIR}`);
