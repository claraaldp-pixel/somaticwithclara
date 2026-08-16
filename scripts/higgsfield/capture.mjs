import puppeteer from 'puppeteer';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { SOURCE_DIR, ROOT } from './config.mjs';

const CHROME = '/Users/clara/.cache/puppeteer/chrome/mac_arm-146.0.7680.153/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing';

// The real £59 HD + Nervous System report product (not a public website page).
// The path contains spaces — must go through pathToFileURL, never hand-concatenated.
const REPORT_PATH = '/Users/clara/Desktop/Claude code training/Human Design + Nervous System/example-splenic-projector-v3.html';

// The report's hero-chart image points at a Supabase project whose hostname
// is now NXDOMAIN (project deleted) — it would render as a broken-image icon
// in the middle of a marketing asset. Substitute a local, internally-truthful
// bodygraph at capture time only; the source report file is never touched.
const BODYGRAPH_PATH = join(ROOT, 'brand-assets', 'bodygraph-clara.png');
const BODYGRAPH_URL = pathToFileURL(BODYGRAPH_PATH).href;

const appUrl = process.env.SOMATIC_PAUSE_URL;
const appEmail = process.env.SOMATIC_PAUSE_EMAIL;
const appPassword = process.env.SOMATIC_PAUSE_PASSWORD;

for (const [name, value] of [
  ['SOMATIC_PAUSE_URL', appUrl],
  ['SOMATIC_PAUSE_EMAIL', appEmail],
  ['SOMATIC_PAUSE_PASSWORD', appPassword],
]) {
  if (!value) {
    console.error(`${name} is not set. Add it to .env (see .env.example).`);
    process.exit(1);
  }
}

mkdirSync(SOURCE_DIR, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
});

/**
 * Signs in to the app and captures the authenticated check-in screen.
 * Credentials are read from env and never logged — on failure this reports the
 * page's visible heading, not the values that were submitted.
 */
async function shootAppLoggedIn(url, name) {
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 3 });
  await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
  await new Promise((r) => setTimeout(r, 2000));

  await page.waitForSelector('input[type="email"]', { timeout: 20000 });
  await page.type('input[type="email"]', appEmail, { delay: 20 });
  await page.type('input[type="password"]', appPassword, { delay: 20 });

  await Promise.all([
    page.evaluate(() => {
      const btn = [...document.querySelectorAll('button')]
        .find((b) => b.textContent.trim().toLowerCase() === 'sign in');
      if (!btn) throw new Error('Sign in button not found');
      btn.click();
    }),
    page.waitForNetworkIdle({ idleTime: 1500, timeout: 45000 }).catch(() => {}),
  ]);
  await new Promise((r) => setTimeout(r, 2500));

  // Confirm we actually left the login wall before spending a capture on it.
  const stillOnLogin = await page.evaluate(() =>
    Boolean(document.querySelector('input[type="password"]')));
  if (stillOnLogin) {
    const heading = await page.evaluate(() =>
      document.body.innerText.split('\n').filter(Boolean).slice(0, 6).join(' | '));
    await browser.close();
    console.error(`Login did not complete. Page still shows: ${heading}`);
    console.error('Check SOMATIC_PAUSE_EMAIL / SOMATIC_PAUSE_PASSWORD in .env.');
    process.exit(1);
  }

  const path = join(SOURCE_DIR, `${name}.png`);
  await page.screenshot({ path });
  await page.close();
  console.log(`captured ${name}.png (authenticated)`);
}

/**
 * Desktop viewport at 2x, for report pages rendered from local HTML.
 *
 * The report is NOT a plain long scroll: its own inline script hides every
 * section except `#intro` on load (`el.style.display = 'none'`) and swaps
 * which one is visible via a `goTo(id)` function wired to the nav buttons —
 * a page.evaluate()-driven scroll offset has nothing to land on but the intro
 * section (confirmed: `document.body.scrollHeight` was only ~1721px with
 * intro alone visible, so a 20%/45% fraction landed on the same intro copy
 * and then the closing CTA/footer, never on report body content). The fix is
 * to drive the report's own navigation directly: call `window.goTo(sectionId)`
 * to switch sections, and force-open any collapsed `.thread-pattern` panels
 * (used by the nervous-system state breakdowns) so their prose renders.
 */
async function shootReportSection(url, name, { sectionId, expandThreads = false }) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 1000, deviceScaleFactor: 2 });
  await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

  // Swap the dead-hosted hero-chart image for the local bodygraph, then
  // actually wait for the new image to finish decoding before screenshotting
  // — a blind timeout here would just reintroduce the broken-image bug with
  // extra steps.
  await page.evaluate((newSrc) => {
    const img = document.querySelector('img.hero-chart');
    if (!img) {
      throw new Error('img.hero-chart not found on report page — cannot substitute bodygraph image.');
    }
    img.src = newSrc;
  }, BODYGRAPH_URL);
  await page.waitForFunction(() => {
    const img = document.querySelector('img.hero-chart');
    return Boolean(img) && img.complete && img.naturalWidth > 0;
  }, { timeout: 15000 });

  await page.evaluate(async ({ sectionId, expandThreads }) => {
    if (typeof window.goTo !== 'function') throw new Error('report goTo() navigation not found');
    window.goTo(sectionId);
    document.querySelectorAll('.reveal').forEach((el) => el.classList.add('visible'));
    if (expandThreads) {
      document.querySelectorAll('.thread-pattern').forEach((el) => el.classList.add('open'));
    }
    await new Promise((r) => setTimeout(r, 700));
  }, { sectionId, expandThreads });
  const path = join(SOURCE_DIR, `${name}.png`);
  await page.screenshot({ path, fullPage: false });
  await page.close();
  console.log(`captured ${name}.png`);
}

await shootAppLoggedIn(appUrl, 'app-home');

// Real example HD + Nervous System report, targeted at named sections rather
// than a blind scroll fraction — see shootReportSection() doc comment above.
const reportUrl = pathToFileURL(REPORT_PATH).href;
// "Your Type" — dense prose + headings + cards, fully visible with no expand needed.
await shootReportSection(reportUrl, 'report-content-1', { sectionId: 'type' });
// "How Your Nervous System Works" — the report's namesake section; its four
// state breakdowns are collapsed by default, so open them for the shot.
await shootReportSection(reportUrl, 'report-content-2', { sectionId: 'nervous', expandThreads: true });

await browser.close();
console.log(`\nSource captures written to ${SOURCE_DIR}`);
