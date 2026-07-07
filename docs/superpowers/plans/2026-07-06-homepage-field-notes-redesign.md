# Homepage Field-Notes Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild `index.html` (somaticwithclara.com homepage) using the field-notes design system (paper texture, margin annotations, detail-photo placeholders, editorial testimonials/FAQ, restyled buttons, no decorative icons), replacing the current card-and-gradient template look.

**Architecture:** A new shared stylesheet, `field-notes.css`, holds every new component so later plans (about.html, offers.html, etc.) can link it without duplicating CSS. `index.html` keeps its existing inline `<style>` block (established pattern in this codebase — no build step, no bundler) but links the new stylesheet after it, and its markup is edited section-by-section. No JavaScript changes: the scroll-scrubbed hero video mechanic is preserved exactly, only its CSS framing changes.

**Tech Stack:** Static HTML/CSS/vanilla JS, no build step. Verification via `node serve.mjs` (existing local server, port 3002) plus grep-based structural checks and one Puppeteer script for visual/behavioral checks (`puppeteer` is already a project dependency).

## Global Constraints

- Keep existing design tokens: `--ember: #DC5A22`, `--dark: #2A2117`, `--cream/--bg: #FBF5EA`. Do not introduce `--honey`/`--sage` backgrounds — ember is the only accent color, used sparingly (rules, underlines, margin marks), never as a background wash.
- Fonts already loaded via the existing Google Fonts `<link>` in `index.html` — Bricolage Grotesque, Hanken Grotesk, Newsreader italic. Do not add new font imports.
- No full-bleed photo backgrounds anywhere. Photos are small, asymmetric, detail-cropped placeholders until Clara supplies real images.
- The scroll-scrubbed hero video mechanic (`updateHero()` in `index.html`'s closing `<script>`) must not be modified — only the CSS around the elements it targets (`#hero-outer`, `#hero-video`, `.hero-state`) changes.
- Branding stays "Somatic with Clara" — no renaming, no logo change.
- Spec reference: `docs/superpowers/specs/2026-07-06-homepage-redesign-design.md`.

---

## File Structure

- **Create:** `field-notes.css` — shared component library (paper texture, margin-note, detail-photo placeholder, buttons, pull-quote testimonials, editorial FAQ). Linked from `index.html` now; linked from other pages in follow-on plans.
- **Create:** `scripts/checks/homepage-field-notes.mjs` — Puppeteer script used for the final behavioral/visual verification task (hero frame sizing, scroll-scrub still functions, mobile margin-note collapse, screenshot capture).
- **Modify:** `index.html` — link the new stylesheet; rebuild hero, Section 01 (Definition), Section 02 (Services), About interlude, Section 03 (Testimonials), FAQ, Section 04 (CTA).

---

### Task 1: `field-notes.css` — base tokens, paper texture, margin-note component

**Files:**
- Create: `field-notes.css`

**Interfaces:**
- Produces: `body.field-notes` (applies paper texture), `.field-copy` / `.field-main` / `.margin-note` (two-column copy-plus-annotation layout, collapses on mobile)

- [ ] **Step 1: Write the check**

Create `scripts/checks/homepage-field-notes.mjs`:

```javascript
import puppeteer from 'puppeteer';

const CHROME_PATH = '/Users/clara/.cache/puppeteer/chrome/mac_arm-146.0.7680.153/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing';
const BASE_URL = 'http://localhost:3002';

const checks = [];
function check(name, fn) { checks.push({ name, fn }); }

check('body has field-notes paper texture', async (page) => {
  const bgImage = await page.evaluate(() => getComputedStyle(document.body).backgroundImage);
  return bgImage.includes('data:image/svg+xml');
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
```

- [ ] **Step 2: Run it, confirm it fails**

Run: `cd "/Users/clara/Desktop/Website builder" && node serve.mjs &` (leave running), then in another shell: `node scripts/checks/homepage-field-notes.mjs`
Expected: `FAIL — body has field-notes paper texture` (no `field-notes.css` exists yet, `index.html` doesn't reference it)

- [ ] **Step 3: Create `field-notes.css`**

```css
/* ── field-notes.css — shared design system for the somaticwithclara.com redesign ── */

/* Paper texture: baked directly into body's own background, not an overlay,
   so it never fights section stacking. Low-opacity dark-ink noise on cream. */
body.field-notes {
  background-color: var(--cream);
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix type='matrix' values='0 0 0 0 0.16  0 0 0 0 0.13  0 0 0 0 0.09  0 0 0 0.05 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  background-repeat: repeat;
}

/* Margin annotation: a narrower second column carrying a quieter,
   italic "second voice" beside the main copy. */
.field-copy {
  display: grid;
  grid-template-columns: 1fr 220px;
  gap: 48px;
  align-items: start;
}
.field-copy .field-main { min-width: 0; }
.margin-note {
  font-family: 'Newsreader', serif;
  font-style: italic;
  font-size: 15px;
  line-height: 1.55;
  color: var(--muted);
  padding-top: 6px;
}
.margin-note::before { content: '— '; color: var(--ember); font-style: normal; }

@media (max-width: 780px) {
  .field-copy { grid-template-columns: 1fr; gap: 12px; }
  .margin-note {
    padding: 10px 0 0 16px;
    border-left: 2px solid rgba(220,90,34,.3);
    transform: rotate(-0.4deg);
    font-size: 14px;
  }
}
```

- [ ] **Step 4: Link the stylesheet and apply the body class**

In `index.html`, find the closing `</style>` tag (line 316, right before `<script defer src="https://cloud.umami.is/script.js"`) and add immediately after it:

```html
  <link rel="stylesheet" href="field-notes.css">
```

Find `<body>` (line 319) and change it to:

```html
<body class="field-notes">
```

- [ ] **Step 5: Run the check again, confirm it passes**

Run: `node scripts/checks/homepage-field-notes.mjs`
Expected: `PASS — body has field-notes paper texture` / `All checks passed.`

- [ ] **Step 6: Commit**

```bash
cd "/Users/clara/Desktop/Website builder"
git add field-notes.css index.html scripts/checks/homepage-field-notes.mjs
git commit -m "Add field-notes.css: paper texture + margin-note component"
```

---

### Task 2: `field-notes.css` — detail-photo placeholder + buttons

**Files:**
- Modify: `field-notes.css`

**Interfaces:**
- Produces: `.detail-photo` (small, deckled-edge asymmetric photo placeholder), `.btn-underline` / `.btn-ghost-rect` (new button styles, additive — existing `.btn-sage`/`.btn-dark` are untouched for pages not yet migrated)

- [ ] **Step 1: Add to `scripts/checks/homepage-field-notes.mjs`**

Add this check before the `run()` function:

```javascript
check('detail-photo has deckled clip-path', async (page) => {
  const exists = await page.evaluate(() => !!document.querySelector('.detail-photo'));
  if (!exists) return false;
  const clip = await page.evaluate(() => getComputedStyle(document.querySelector('.detail-photo')).clipPath);
  return clip !== 'none';
});
```

- [ ] **Step 2: Run it, confirm it fails**

Run: `node scripts/checks/homepage-field-notes.mjs`
Expected: `FAIL — detail-photo has deckled clip-path` (no `.detail-photo` element exists in `index.html` yet)

- [ ] **Step 3: Add the components to `field-notes.css`**

Append:

```css
/* Detail photo placeholder: small, asymmetric, torn/deckled edge.
   Replace the placeholder text with a real <img> once Clara supplies photos —
   keep the clip-path and sizing, just swap the inner content. */
.detail-photo {
  background: var(--sand);
  clip-path: polygon(2% 0%, 98% 1%, 100% 15%, 97% 30%, 100% 45%, 98% 60%, 100% 75%, 96% 90%, 100% 100%, 3% 99%, 0% 85%, 4% 70%, 0% 55%, 3% 40%, 0% 22%, 3% 8%);
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 16px;
  font-family: 'Hanken Grotesk', sans-serif;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: var(--muted);
}

/* Buttons: underline link (primary) and ghost rectangle (secondary).
   Additive — .btn-sage / .btn-dark stay for pages not yet migrated. */
.btn-underline {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: 'Hanken Grotesk', sans-serif;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: var(--ember);
  text-decoration: none;
  border-bottom: 1px solid var(--ember);
  padding-bottom: 2px;
  background: none;
}
.btn-ghost-rect {
  display: inline-block;
  font-family: 'Hanken Grotesk', sans-serif;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 1px;
  color: var(--dark);
  background: transparent;
  border: 1px solid var(--dark);
  border-radius: 0;
  padding: 12px 28px;
  text-decoration: none;
}
```

- [ ] **Step 4: Add a placeholder element to `index.html` so the check has something to find**

This element gets replaced by the real Section 01 detail photo in Task 6 — for now, add a temporary one right after the opening `<body class="field-notes">` tag so the check can verify the CSS works:

```html
<body class="field-notes">
<div class="detail-photo" style="width:1px;height:1px;position:absolute;left:-9999px;" aria-hidden="true"></div>
```

- [ ] **Step 5: Run the check again, confirm it passes**

Run: `node scripts/checks/homepage-field-notes.mjs`
Expected: `PASS — detail-photo has deckled clip-path`

- [ ] **Step 6: Commit**

```bash
cd "/Users/clara/Desktop/Website builder"
git add field-notes.css index.html
git commit -m "Add detail-photo placeholder and underline/ghost-rect button components"
```

---

### Task 3: `field-notes.css` — pull-quote testimonials + editorial FAQ

**Files:**
- Modify: `field-notes.css`

**Interfaces:**
- Produces: `.pull-quote-stack` / `.pull-quote` (testimonial component), `.faq-editorial` / `.faq-editorial-item` (FAQ component)

- [ ] **Step 1: Add to `scripts/checks/homepage-field-notes.mjs`**

```javascript
check('pull-quote has ember left border', async (page) => {
  const exists = await page.evaluate(() => !!document.querySelector('.pull-quote'));
  if (!exists) return false;
  const borderColor = await page.evaluate(() => getComputedStyle(document.querySelector('.pull-quote')).borderLeftColor);
  return borderColor === 'rgb(220, 90, 34)' || borderColor.includes('220, 90, 34');
});
```

- [ ] **Step 2: Run it, confirm it fails**

Run: `node scripts/checks/homepage-field-notes.mjs`
Expected: `FAIL — pull-quote has ember left border`

- [ ] **Step 3: Add the components to `field-notes.css`**

Append:

```css
/* Testimonials: editorial pull-quote stack, replaces auto-scroll cards. */
.pull-quote-stack {
  display: grid;
  gap: 32px;
  max-width: 680px;
  margin: 0 auto;
}
.pull-quote {
  padding-left: 20px;
  border-left: 2px solid var(--ember);
}
.pull-quote q {
  display: block;
  font-family: 'Newsreader', serif;
  font-style: italic;
  font-size: clamp(17px, 2vw, 21px);
  line-height: 1.6;
  color: var(--text);
  quotes: none;
  margin-bottom: 10px;
}
.pull-quote cite {
  font-family: 'Hanken Grotesk', sans-serif;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: var(--muted);
  font-style: normal;
}

/* FAQ: editorial typography, no accordion icons, always expanded. */
.faq-editorial-item {
  padding: 26px 0;
  border-top: 1.5px solid var(--line);
}
.faq-editorial-item:last-child { border-bottom: 1.5px solid var(--line); }
.faq-editorial-q {
  font-family: 'Bricolage Grotesque', sans-serif;
  font-weight: 700;
  font-size: 18px;
  color: var(--text);
  margin-bottom: 8px;
  line-height: 1.3;
}
.faq-editorial-a {
  font-family: 'Hanken Grotesk', sans-serif;
  font-size: 15px;
  color: var(--body);
  line-height: 1.85;
  font-weight: 300;
}
```

- [ ] **Step 4: Add a placeholder element to `index.html`**

Right after the temporary `.detail-photo` div added in Task 2, add:

```html
<blockquote class="pull-quote" style="position:absolute;left:-9999px;" aria-hidden="true"><q>placeholder</q><cite>placeholder</cite></blockquote>
```

- [ ] **Step 5: Run the check again, confirm it passes**

Run: `node scripts/checks/homepage-field-notes.mjs`
Expected: `PASS — pull-quote has ember left border`

- [ ] **Step 6: Commit**

```bash
cd "/Users/clara/Desktop/Website builder"
git add field-notes.css index.html
git commit -m "Add pull-quote testimonial and editorial FAQ components"
```

---

### Task 4: Rebuild the hero — inset frame instead of full-bleed

**Files:**
- Modify: `index.html:82-211` (hero-related CSS in the inline `<style>` block), `index.html:282-306` (`.hero-scroll-outer` / `.hero-state` CSS), `index.html:358-388` (hero markup)

**Interfaces:**
- Consumes: nothing new
- Produces: `.hero-field` / `.hero-frame` / `.hero-text-col` (new hero layout classes). `#hero-outer`, `#hero-video`, `.hero-state[data-phase]`, `#scroll-hint` IDs/selectors are preserved exactly — the existing `updateHero()` script at the bottom of `index.html` (lines 587-622) depends on them and is not modified.

- [ ] **Step 1: Add to `scripts/checks/homepage-field-notes.mjs`**

```javascript
check('hero frame does not cover the full viewport', async (page) => {
  const frame = await page.evaluate(() => {
    const el = document.querySelector('.hero-frame');
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return { width: r.width, viewportWidth: window.innerWidth };
  });
  if (!frame) return false;
  return frame.width < frame.viewportWidth * 0.6;
});

check('hero scroll-scrub still updates video currentTime', async (page) => {
  await page.evaluate(() => window.scrollTo(0, 0));
  await new Promise(r => setTimeout(r, 200));
  const before = await page.evaluate(() => document.getElementById('hero-video')?.currentTime ?? -1);
  await page.evaluate(() => window.scrollTo(0, document.getElementById('hero-outer').offsetHeight * 0.4));
  await new Promise(r => setTimeout(r, 300));
  const after = await page.evaluate(() => document.getElementById('hero-video')?.currentTime ?? -1);
  return after > before;
});
```

- [ ] **Step 2: Run it, confirm it fails**

Run: `node scripts/checks/homepage-field-notes.mjs`
Expected: `FAIL — hero frame does not cover the full viewport` (`.hero-frame` doesn't exist yet)

- [ ] **Step 3: Replace the hero CSS**

In `index.html`, find this block (lines 168–211):

```css
    /* Hero (dark) */
    .hero-dark {
      background: var(--dark) url('brand-assets/hero-poster.jpg') center/cover no-repeat;
      position: relative; overflow: hidden;
      padding: 120px 24px 80px; text-align: center;
    }
    .hero-video {
      position: absolute; inset: 0; width: 100%; height: 100%;
      object-fit: cover; z-index: 0;
      opacity: 0; transition: opacity 0.6s ease;
    }
    .hero-overlay {
      position: absolute; inset: 0; z-index: 1;
      background:
        linear-gradient(to right, rgba(30,18,8,0.72) 0%, rgba(30,18,8,0.3) 55%, transparent 100%),
        linear-gradient(to bottom, rgba(30,18,8,0.2) 0%, transparent 40%, transparent 65%, rgba(30,18,8,0.45) 100%);
    }
    @media (max-width: 768px) {
      .hero-video { display: none; }
      .hero-dark {
        background-image:
          linear-gradient(160deg, rgba(42,33,23,0.85) 0%, rgba(42,33,23,0.7) 100%),
          radial-gradient(ellipse 80% 60% at 5% 95%, rgba(220,90,34,0.3) 0%, transparent 60%),
          url('brand-assets/hero-poster.jpg');
        background-size: cover;
        background-position: center;
        background-color: var(--dark);
      }
    }
    .hero-eyebrow {
      font-family: 'Hanken Grotesk', sans-serif; font-size: 10px; font-weight: 700;
      letter-spacing: 3px; text-transform: uppercase;
      color: var(--gold); display: block; margin-bottom: 24px;
    }
    .hero-h1 {
      font-family: 'Bricolage Grotesque', sans-serif; font-weight: 700;
      font-size: clamp(42px,8vw,96px); line-height: 0.92;
      letter-spacing: -0.02em; color: var(--honey); margin-bottom: 0;
    }
    .hero-literary {
      font-family: 'Newsreader', serif; font-weight: 300;
      font-size: clamp(28px,4.5vw,56px); line-height: 1.25;
      letter-spacing: -0.01em; color: var(--honey-pale); max-width: 680px;
    }
```

Replace it with:

```css
    /* Hero (field-notes): inset frame, not full-bleed */
    .hero-field {
      background: var(--cream);
      height: 100vh;
      display: flex; align-items: center;
      padding: 0 60px; position: relative;
    }
    .hero-field-inner {
      display: flex; align-items: center; gap: 56px;
      max-width: 1080px; margin: 0 auto; width: 100%;
    }
    .hero-text-col { flex: 1 1 auto; position: relative; min-height: 240px; }
    .hero-frame {
      flex: 0 0 380px; aspect-ratio: 4 / 5; overflow: hidden;
      box-shadow: 0 1px 0 rgba(42,33,23,.1);
      clip-path: polygon(1% 0%, 99% 1%, 100% 98%, 2% 100%);
    }
    .hero-frame video { width: 100%; height: 100%; object-fit: cover; display: block; }
    /* Breakpoint matches the JS isMobile check (window.innerWidth <= 768) below,
       so the scroll-scrub behavior and the stacked layout always agree. */
    @media (max-width: 768px) {
      .hero-field { padding: 0 24px; height: auto; min-height: 100vh; }
      .hero-field-inner { flex-direction: column-reverse; gap: 32px; padding: 120px 0 60px; }
      .hero-frame { flex: 0 0 auto; width: 100%; max-width: 320px; aspect-ratio: 4 / 5; }
      .hero-text-col { width: 100%; min-height: 160px; }
    }
    .hero-eyebrow-field {
      font-family: 'Hanken Grotesk', sans-serif; font-size: 11px; font-weight: 700;
      letter-spacing: 3px; text-transform: uppercase;
      color: var(--ember); display: block; margin-bottom: 20px;
    }
    .hero-h1-field {
      font-family: 'Bricolage Grotesque', sans-serif; font-weight: 700;
      font-size: clamp(38px,5.5vw,64px); line-height: 1.02;
      letter-spacing: -0.02em; color: var(--dark);
    }
    .hero-literary-field {
      font-family: 'Newsreader', serif; font-weight: 300; font-style: italic;
      font-size: clamp(24px,3.2vw,38px); line-height: 1.3; color: var(--dark);
    }
```

- [ ] **Step 4: Replace the `.hero-scroll-outer` / `.hero-state` CSS**

Find this block (lines 282–306):

```css
    /* ── Scroll-controlled hero ────────────────────── */
    .hero-scroll-outer { height: 320vh; position: relative; }
    .hero-sticky-wrap { position: sticky; top: 0; height: 100vh; overflow: hidden; }
    .hero-scroll-outer .hero-dark { padding: 0; height: 100vh; }
    .hero-state {
      position: absolute; inset: 0;
      display: flex; flex-direction: column; align-items: flex-start; justify-content: flex-end;
      text-align: left; padding: 0 60px 80px;
      z-index: 3; opacity: 0;
      transition: opacity 0.9s cubic-bezier(0.16,1,0.3,1);
      pointer-events: none;
    }
    .hero-state.active { opacity: 1; pointer-events: auto; }
    .hero-state.center-state { align-items: center; justify-content: center; text-align: center; padding: 0 40px; }
    @media (max-width: 680px) {
      .hero-state { padding: 0 24px 60px; }
    }
    @keyframes scrollHint { 0%,100%{opacity:.4;transform:translateX(-50%) translateY(0)} 50%{opacity:.7;transform:translateX(-50%) translateY(6px)} }
    @media (max-width: 768px) {
      .hero-scroll-outer { height: 100vh; }
      .hero-sticky-wrap { position: relative; }
      .hero-state { opacity: 0 !important; }
      .hero-state[data-phase="0"] { opacity: 1 !important; pointer-events: auto !important; }
    }
    @media (prefers-reduced-motion: reduce) { .hero-state { transition: none; } }
```

Replace it with:

```css
    /* ── Scroll-controlled hero ────────────────────── */
    .hero-scroll-outer { height: 320vh; position: relative; }
    .hero-sticky-wrap { position: sticky; top: 0; height: 100vh; overflow: hidden; }
    .hero-scroll-outer .hero-field { padding: 0; height: 100vh; }
    .hero-text-col .hero-state {
      position: absolute; inset: 0;
      display: flex; flex-direction: column; align-items: flex-start; justify-content: center;
      text-align: left;
      z-index: 3; opacity: 0;
      transition: opacity 0.9s cubic-bezier(0.16,1,0.3,1);
      pointer-events: none;
    }
    .hero-text-col .hero-state.active { opacity: 1; pointer-events: auto; }
    @keyframes scrollHint { 0%,100%{opacity:.4;transform:translateX(-50%) translateY(0)} 50%{opacity:.7;transform:translateX(-50%) translateY(6px)} }
    @media (max-width: 768px) {
      .hero-scroll-outer { height: 100vh; }
      .hero-sticky-wrap { position: relative; }
      .hero-text-col .hero-state { opacity: 0 !important; }
      .hero-text-col .hero-state[data-phase="0"] { opacity: 1 !important; pointer-events: auto !important; }
    }
    @media (prefers-reduced-motion: reduce) { .hero-text-col .hero-state { transition: none; } }
```

- [ ] **Step 5: Replace the hero markup**

Find (lines 358–388):

```html
<!-- HERO -->
<div class="hero-scroll-outer" id="hero-outer">
  <div class="hero-sticky-wrap">
    <section class="hero-dark">
      <video class="hero-video" id="hero-video" muted playsinline preload="auto" poster="brand-assets/hero-poster.jpg">
        <source src="hero-video.mp4" type="video/mp4">
      </video>
      <div class="hero-overlay"></div>
      <div class="circ" style="width:300px;height:300px;border:3px solid var(--sage);opacity:.06;top:-80px;right:-80px;position:absolute;z-index:2;border-radius:50%;pointer-events:none;"></div>
      <div class="circ" style="width:160px;height:160px;border:2px solid var(--amber);opacity:.08;bottom:-50px;left:-50px;position:absolute;z-index:2;border-radius:50%;pointer-events:none;"></div>

      <!-- State 0 — Opening (0–50% scroll) · left-aligned -->
      <div class="hero-state active" data-phase="0">
        <div style="max-width:640px;">
          <span class="hero-eyebrow">Somatic &amp; Nervous-System Coaching</span>
          <h1 class="hero-h1">slow is a skill.<br/>let's practice it.</h1>
        </div>
      </div>

      <!-- State 1 — Invitation (50–100% scroll) · centred -->
      <div class="hero-state center-state" data-phase="1">
        <p class="hero-literary">There's who you've been<br/>surviving as.<br/>And who you <em>actually</em> are.</p>
      </div>

      <!-- Scroll hint -->
      <div id="scroll-hint" style="position:absolute;bottom:32px;left:50%;transform:translateX(-50%);z-index:4;display:flex;flex-direction:column;align-items:center;gap:8px;color:rgba(255,255,255,.3);font-family:'Hanken Grotesk',sans-serif;font-size:10px;letter-spacing:2px;text-transform:uppercase;animation:scrollHint 2s ease-in-out infinite;transition:opacity 0.5s ease;">
        Scroll
        <span style="width:1px;height:36px;background:rgba(255,255,255,.2);display:block;"></span>
      </div>
    </section>
  </div>
</div>
```

Replace it with:

```html
<!-- HERO -->
<div class="hero-scroll-outer" id="hero-outer">
  <div class="hero-sticky-wrap">
    <section class="hero-field">
      <div class="hero-field-inner">
        <div class="hero-text-col">
          <!-- State 0 — Opening (0–50% scroll) -->
          <div class="hero-state active" data-phase="0">
            <span class="hero-eyebrow-field">Somatic &amp; Nervous-System Coaching</span>
            <h1 class="hero-h1-field">slow is a skill.<br/>let's practice it.</h1>
          </div>

          <!-- State 1 — Invitation (50–100% scroll) -->
          <div class="hero-state" data-phase="1">
            <p class="hero-literary-field">There's who you've been<br/>surviving as.<br/>And who you <em>actually</em> are.</p>
          </div>
        </div>

        <div class="hero-frame">
          <video class="hero-video" id="hero-video" muted playsinline preload="auto" poster="brand-assets/hero-poster.jpg">
            <source src="hero-video.mp4" type="video/mp4">
          </video>
        </div>
      </div>

      <!-- Scroll hint -->
      <div id="scroll-hint" style="position:absolute;bottom:32px;left:50%;transform:translateX(-50%);z-index:4;display:flex;flex-direction:column;align-items:center;gap:8px;color:var(--muted);font-family:'Hanken Grotesk',sans-serif;font-size:10px;letter-spacing:2px;text-transform:uppercase;animation:scrollHint 2s ease-in-out infinite;transition:opacity 0.5s ease;">
        Scroll
        <span style="width:1px;height:36px;background:var(--line);display:block;"></span>
      </div>
    </section>
  </div>
</div>
```

Note: the video no longer needs the fade-in-on-`canplaythrough` opacity trick or the mobile `display:none` — it's a small framed element now, not a full-bleed background, so it can render immediately. This markup change makes lines 599-602 and 595-597's `heroVideoEl.style.opacity` references in the closing `<script>` no-ops (harmless — `opacity` isn't set in the new CSS, so setting it via JS to `'1'` has no visible effect). Leave the script untouched per the Global Constraints.

- [ ] **Step 6: Run both checks again, confirm they pass**

Run: `node scripts/checks/homepage-field-notes.mjs`
Expected: `PASS — hero frame does not cover the full viewport` and `PASS — hero scroll-scrub still updates video currentTime`

- [ ] **Step 7: Commit**

```bash
cd "/Users/clara/Desktop/Website builder"
git add index.html
git commit -m "Reframe hero as inset video window, preserve scroll-scrub mechanic"
```

---

### Task 5: Rebuild Section 01 — Definition

**Files:**
- Modify: `index.html:391-403` (Definition section)

**Interfaces:**
- Consumes: `.field-copy`, `.field-main`, `.margin-note`, `.detail-photo` from `field-notes.css` (Tasks 1–2)

- [ ] **Step 1: Add to `scripts/checks/homepage-field-notes.mjs`**

```javascript
check('Section 01 names attention and Human Design directly', async (page) => {
  const text = await page.evaluate(() => document.body.innerText);
  return text.includes('Attention') && text.includes('Human Design');
});
```

- [ ] **Step 2: Run it, confirm it fails**

Run: `node scripts/checks/homepage-field-notes.mjs`
Expected: `FAIL — Section 01 names attention and Human Design directly`

- [ ] **Step 3: Replace the Definition section**

Find (lines 391–403):

```html
<!-- GEO: Definition + Credential Block -->
<section style="background:var(--cream);padding:56px 24px 48px;">
  <div class="narrow" style="text-align:center;">
    <p style="font-family:'Hanken Grotesk',sans-serif;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:var(--muted);margin-bottom:24px;">Clara Louis — Somatic Coach &amp; Human Design Guide &middot; London &amp; Online</p>
    <p class="reveal" style="font-family:'Hanken Grotesk',sans-serif;font-size:16px;font-weight:300;line-height:1.9;color:var(--body);margin-bottom:16px;max-width:600px;margin-left:auto;margin-right:auto;">
      <strong style="font-weight:500;color:var(--text);">Somatic work</strong> is a body-led approach to nervous system regulation that works with survival patterns (fight, flight, freeze, and shutdown) at a physiological level. Drawing on polyvagal theory and trauma-informed practice, it helps the body release stored stress responses that keep people stuck despite their best efforts to change.
    </p>
    <p class="reveal d1" style="font-family:'Hanken Grotesk',sans-serif;font-size:15px;font-weight:300;line-height:1.85;color:var(--muted);max-width:560px;margin:0 auto 24px;">
      This work takes many forms: somatic yoga, somatic coaching, Human Design, each using the body rather than the thinking mind as the primary guide. Educational in nature, not clinical therapy, it is designed for people who are functioning but feel disconnected, exhausted, or unable to create lasting change through mindset work alone.
    </p>
    <p class="reveal d2" style="font-family:'Hanken Grotesk',sans-serif;font-size:11px;color:var(--faint);letter-spacing:1px;">Last updated: June 2026 &nbsp;·&nbsp; <a href="somatic-yoga.html" style="color:var(--ember);font-weight:500;text-decoration:none;font-size:11px;">What is somatic yoga? Read the full guide →</a></p>
  </div>
</section>
```

Replace it with:

```html
<!-- GEO: Definition + Credential Block -->
<section style="background:var(--cream);padding:80px 24px;position:relative;">
  <div class="wide">
    <p style="font-family:'Hanken Grotesk',sans-serif;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:var(--muted);margin-bottom:32px;">Clara Louis — Somatic Coach &amp; Human Design Guide &middot; London &amp; Online</p>
    <div class="field-copy">
      <div class="field-main">
        <p class="reveal" style="font-family:'Hanken Grotesk',sans-serif;font-size:17px;font-weight:300;line-height:1.9;color:var(--body);margin-bottom:20px;max-width:600px;">
          <strong style="font-weight:500;color:var(--text);">Somatic work</strong> starts from one idea: experience needs the body and the mind together. The body feels — a held breath, a locked jaw, a stomach that won't settle. The mind interprets, and without it, none of that becomes a decision. Most people are cut off in one of two directions: thinking straight past what the body is saying, or a body so loud it stopped being trustworthy.
        </p>
        <p class="reveal d1" style="font-family:'Hanken Grotesk',sans-serif;font-size:16px;font-weight:300;line-height:1.9;color:var(--muted);max-width:600px;margin-bottom:20px;">
          Attention is the skill in between — the thing that lets you actually hear what the body's saying instead of drowning it out. Most of us live with the light off, chasing whatever's lit up nearby instead of following our own direction. Somatic yoga, somatic coaching, Human Design: they're all tools for turning the light back on.
        </p>
        <p class="reveal d2" style="font-family:'Hanken Grotesk',sans-serif;font-size:11px;color:var(--faint);letter-spacing:1px;">Last updated: July 2026 &nbsp;·&nbsp; <a href="somatic-yoga.html" style="color:var(--ember);font-weight:500;text-decoration:none;font-size:11px;">What is somatic yoga? Read the full guide →</a></p>
      </div>
      <div>
        <div class="detail-photo" style="width:100%;aspect-ratio:3/4;margin-bottom:14px;">[ detail photo — hands ]</div>
        <p class="margin-note">I used to think this meant staying still.</p>
      </div>
    </div>
  </div>
</section>
```

- [ ] **Step 4: Run the check again, confirm it passes**

Run: `node scripts/checks/homepage-field-notes.mjs`
Expected: `PASS — Section 01 names attention and Human Design directly`

- [ ] **Step 5: Commit**

```bash
cd "/Users/clara/Desktop/Website builder"
git add index.html
git commit -m "Rebuild Section 01 Definition: spine language, margin note, detail photo"
```

---

### Task 6: Rebuild Section 02 — Services (remove icons)

**Files:**
- Modify: `index.html:254-256` (`.service-icon` and `.service-card:hover` CSS rules), `index.html:406-439` (Services section)

**Interfaces:**
- Consumes: `.detail-photo` from `field-notes.css`

- [ ] **Step 1: Add to `scripts/checks/homepage-field-notes.mjs`**

```javascript
check('no decorative service icons remain', async (page) => {
  const count = await page.evaluate(() => document.querySelectorAll('.service-icon').length);
  return count === 0;
});
```

- [ ] **Step 2: Run it, confirm it fails**

Run: `node scripts/checks/homepage-field-notes.mjs`
Expected: `FAIL — no decorative service icons remain` (4 `.service-icon` divs currently exist)

- [ ] **Step 3: Remove the `.service-icon` CSS rule**

Find in the `<style>` block (line 256):

```css
    .service-icon { font-size: 20px; color: var(--ember); line-height: 1; }
```

Delete this line entirely.

- [ ] **Step 4: Replace the Services section**

Find (lines 406–439):

```html
<!-- SERVICES -->
<section style="background:var(--bg);padding:100px 24px;">
  <div class="wide">
    <div style="text-align:center;margin-bottom:56px;">
      <h2 class="section-title reveal" style="text-align:center;">Ways to work together.</h2>
    </div>
    <div class="services-grid">
      <a href="offers.html" class="service-card reveal" style="text-decoration:none;">
        <div class="service-icon">◎</div>
        <p class="service-name">Somatic Coaching</p>
        <p class="service-desc">One-to-one work with the body as guide. For women who are functioning but feel stuck, disconnected, or exhausted by coping. 3 or 6-month arc.</p>
        <span class="service-link">See details →</span>
      </a>
      <a href="somatic-yoga.html" class="service-card reveal d1" style="text-decoration:none;">
        <div class="service-icon">〜</div>
        <p class="service-name">Somatic Yoga</p>
        <p class="service-desc">Movement, breath, and nervous system awareness, together. Classes designed to help the body release survival patterns through sensation rather than effort.</p>
        <span class="service-link">Learn more →</span>
      </a>
      <a href="offers.html" class="service-card reveal d2" style="text-decoration:none;">
        <div class="service-icon">◇</div>
        <p class="service-name">Human Design</p>
        <p class="service-desc">A reading that maps the design underneath your coping patterns. Understand your energy type, authority, and what alignment actually looks like for you.</p>
        <span class="service-link">See details →</span>
      </a>
      <a href="reclaim-your-life.html" class="service-card reveal d3" style="text-decoration:none;">
        <div class="service-icon">○</div>
        <p class="service-name">Nervous System Community</p>
        <p class="service-desc">A Skool community for women learning to regulate. Somatic practices, nervous system tools, and a space to show up as you actually are.</p>
        <span class="service-link">Join the community →</span>
      </a>
    </div>
  </div>
</section>
```

Replace it with:

```html
<!-- SERVICES -->
<section style="background:var(--cream);padding:100px 24px;">
  <div class="wide">
    <div style="margin-bottom:48px;">
      <h2 class="section-title reveal">Ways to work together.</h2>
    </div>
    <div style="display:flex;gap:56px;align-items:flex-start;flex-wrap:wrap;">
      <div class="services-grid" style="flex:1 1 480px;">
        <a href="offers.html" class="service-card reveal" style="text-decoration:none;border-top:1.5px solid var(--line);border-radius:0;border-left:none;border-right:none;border-bottom:none;padding:20px 0;">
          <p class="service-name">Somatic Coaching</p>
          <p class="service-desc">One-to-one work with the body as guide. For women who are functioning but feel stuck, disconnected, or exhausted by coping. 3 or 6-month arc.</p>
          <span class="service-link">See details →</span>
        </a>
        <a href="somatic-yoga.html" class="service-card reveal d1" style="text-decoration:none;border-top:1.5px solid var(--line);border-radius:0;border-left:none;border-right:none;border-bottom:none;padding:20px 0;">
          <p class="service-name">Somatic Yoga</p>
          <p class="service-desc">Movement, breath, and nervous system awareness, together. Classes designed to help the body release survival patterns through sensation rather than effort.</p>
          <span class="service-link">Learn more →</span>
        </a>
        <a href="offers.html" class="service-card reveal d2" style="text-decoration:none;border-top:1.5px solid var(--line);border-radius:0;border-left:none;border-right:none;border-bottom:none;padding:20px 0;">
          <p class="service-name">Human Design</p>
          <p class="service-desc">One of the tools I actually use to find the somatic block underneath a pattern — a map of your energetic architecture, not a personality quiz.</p>
          <span class="service-link">See details →</span>
        </a>
        <a href="reclaim-your-life.html" class="service-card reveal d3" style="text-decoration:none;border-top:1.5px solid var(--line);border-radius:0;border-left:none;border-right:none;border-bottom:none;padding:20px 0;">
          <p class="service-name">Nervous System Community</p>
          <p class="service-desc">A Skool community for women learning to regulate. Somatic practices, nervous system tools, and a space to show up as you actually are.</p>
          <span class="service-link">Join the community →</span>
        </a>
      </div>
      <div class="detail-photo" style="flex:0 0 240px;aspect-ratio:3/4;">[ detail photo — fabric/texture ]</div>
    </div>
  </div>
</section>
```

Note: `.services-grid` still applies `display:grid;grid-template-columns:repeat(2,1fr)` from the existing CSS (line 253) — the inline border/padding overrides on each `.service-card` link replace the old card-box look (white bg, rounded border, hover shadow) with the flat top-rule list treatment.

The `.service-card:hover` rule would still fire against the new flat layout (transform/shadow with no visible box to show it against — a floating shadow with nothing under it). Since this task is already editing `.service-card` markup, delete the now-incorrect hover rule rather than leave it live. Find in the `<style>` block:

```css
    .service-card:hover { transform: translateY(-4px); border-color: var(--ember); box-shadow: 0 8px 28px rgba(220,90,34,.12); }
```

Delete this line entirely (it sits right after the `.service-card` rule, near line 254).

- [ ] **Step 5: Run the check again, confirm it passes**

Run: `node scripts/checks/homepage-field-notes.mjs`
Expected: `PASS — no decorative service icons remain`

- [ ] **Step 6: Commit**

```bash
cd "/Users/clara/Desktop/Website builder"
git add index.html
git commit -m "Rebuild Section 02 Services: remove icons, name Human Design as a tool"
```

---

### Task 7: Rebuild the About interlude

**Files:**
- Modify: `index.html:441-455` (About section)

**Interfaces:**
- Consumes: `.detail-photo`, `.margin-note` from `field-notes.css`

- [ ] **Step 1: Add to `scripts/checks/homepage-field-notes.mjs`**

```javascript
check('About interlude has a personal margin note', async (page) => {
  const text = await page.evaluate(() => {
    const notes = document.querySelectorAll('.margin-note');
    return Array.from(notes).map(n => n.textContent).join(' | ');
  });
  return text.includes('scattering') || text.includes('boring');
});
```

- [ ] **Step 2: Run it, confirm it fails**

Run: `node scripts/checks/homepage-field-notes.mjs`
Expected: `FAIL — About interlude has a personal margin note`

- [ ] **Step 3: Replace the About section**

Find (lines 441–455):

```html
<!-- ABOUT -->
<section style="background:var(--bone);padding:100px 24px;">
  <div class="about-grid" style="max-width:860px;margin:0 auto;display:grid;grid-template-columns:260px 1fr;gap:64px;align-items:center;">
    <img src="profile-tbh.png" alt="Clara Louis, somatic coach and human design guide" class="reveal" style="width:100%;border-radius:20px;object-fit:cover;display:block;" />
    <div>
      <span class="section-label reveal">About Clara</span>
      <h2 class="section-title reveal d1" style="margin-bottom:24px;">I came to this<br/><em>through my own body.</em></h2>
      <p class="reveal d2" style="font-family:'Hanken Grotesk',sans-serif;font-size:16px;font-weight:300;line-height:1.9;color:var(--body);margin-bottom:20px;">I spent years moving forward on the outside while something stayed frozen underneath. Doing the work. Knowing what I needed. Still returning to the same patterns. I thought that was just who I was.</p>
      <p class="reveal d3" style="font-family:'Hanken Grotesk',sans-serif;font-size:16px;font-weight:300;line-height:1.9;color:var(--body);margin-bottom:20px;">It wasn't. Those patterns were survival responses. The body had learned them for good reason, and nothing I thought or understood was going to change what it had stored.</p>
      <p class="reveal d3" style="font-family:'Hanken Grotesk',sans-serif;font-size:16px;font-weight:300;line-height:1.9;color:var(--body);margin-bottom:28px;">The moment I could feel that rather than just know it, things shifted. That's what this work is: not more understanding, but a different kind of contact.</p>
      <p class="reveal d4" style="font-family:'Hanken Grotesk',sans-serif;font-size:14px;font-weight:300;line-height:1.8;color:var(--muted);margin-bottom:32px;">Somatic coach and Human Design guide. Based in London, working with women online and in person.</p>
      <a href="about.html" class="reveal d4" style="font-family:'Hanken Grotesk',sans-serif;font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:var(--ember);text-decoration:none;">Full story →</a>
    </div>
  </div>
</section>
```

Replace it with:

```html
<!-- ABOUT -->
<section style="background:var(--cream);padding:100px 24px;">
  <div style="max-width:960px;margin:0 auto;display:grid;grid-template-columns:220px 1fr 220px;gap:48px;align-items:start;">
    <div class="detail-photo reveal" style="aspect-ratio:3/4;">[ cropped portrait ]</div>
    <div>
      <span class="section-label reveal">About Clara</span>
      <h2 class="section-title reveal d1" style="margin-bottom:24px;">I came to this<br/><em>through my own body.</em></h2>
      <p class="reveal d2" style="font-family:'Hanken Grotesk',sans-serif;font-size:16px;font-weight:300;line-height:1.9;color:var(--body);margin-bottom:20px;">I spent years moving forward on the outside while something stayed frozen underneath. Doing the work. Knowing what I needed. Still returning to the same patterns. I thought that was just who I was.</p>
      <p class="reveal d3" style="font-family:'Hanken Grotesk',sans-serif;font-size:16px;font-weight:300;line-height:1.9;color:var(--body);margin-bottom:20px;">It wasn't. Those patterns were survival responses. The body had learned them for good reason, and nothing I thought or understood was going to change what it had stored.</p>
      <p class="reveal d3" style="font-family:'Hanken Grotesk',sans-serif;font-size:16px;font-weight:300;line-height:1.9;color:var(--body);margin-bottom:28px;">The moment I could feel that rather than just know it, things shifted. That's what this work is: not more understanding, but a different kind of contact.</p>
      <p class="reveal d4" style="font-family:'Hanken Grotesk',sans-serif;font-size:14px;font-weight:300;line-height:1.8;color:var(--muted);margin-bottom:32px;">Somatic coach and Human Design guide. Based in London, working with women online and in person.</p>
      <a href="about.html" class="btn-underline reveal d4">Full story →</a>
    </div>
    <p class="margin-note reveal d3">I still catch a plan getting boring and feel the pull to start something new instead of staying. That's part of why this isn't theory to me.</p>
  </div>
</section>
```

Note: this drops the `profile-tbh.png` image reference in favor of the `.detail-photo` placeholder, per the spec's photo-sourcing section — Clara will supply a real cropped portrait later; swap the placeholder `div` for an `<img class="detail-photo" src="...">` at that point (the `clip-path` on `.detail-photo` applies equally to an `<img>`).

- [ ] **Step 4: Run the check again, confirm it passes**

Run: `node scripts/checks/homepage-field-notes.mjs`
Expected: `PASS — About interlude has a personal margin note`

- [ ] **Step 5: Commit**

```bash
cd "/Users/clara/Desktop/Website builder"
git add index.html
git commit -m "Rebuild About interlude with personal margin note"
```

---

### Task 8: Replace Testimonials with the pull-quote stack

**Files:**
- Modify: `index.html:233` (`.testimonials-grid` rule inside the mobile media query), `index.html:262-280` (testimonials CSS block and its `prefers-reduced-motion` rule), `index.html:458-503` (Testimonials section)

**Interfaces:**
- Consumes: `.pull-quote-stack`, `.pull-quote` from `field-notes.css`

- [ ] **Step 1: Add to `scripts/checks/homepage-field-notes.mjs`**

```javascript
check('testimonials use pull-quote stack, not auto-scroll cards', async (page) => {
  const hasTrack = await page.evaluate(() => !!document.querySelector('.testimonial-track'));
  const hasStack = await page.evaluate(() => document.querySelectorAll('.pull-quote-stack .pull-quote').length >= 2);
  return !hasTrack && hasStack;
});
```

- [ ] **Step 2: Run it, confirm it fails**

Run: `node scripts/checks/homepage-field-notes.mjs`
Expected: `FAIL — testimonials use pull-quote stack, not auto-scroll cards`

- [ ] **Step 3: Replace the Testimonials section**

Find (lines 458–503) — the full `<!-- TESTIMONIALS -->` section with its three `.testimonials-viewport` columns — and replace the entire block with:

```html
<!-- TESTIMONIALS -->
<section style="background:var(--cream);padding:100px 24px;">
  <div style="text-align:center;margin-bottom:48px;">
    <h2 class="section-title reveal" style="text-align:center;">Words from the women<br/><em>in this space.</em></h2>
  </div>
  <div class="pull-quote-stack">
    <blockquote class="pull-quote reveal">
      <q>I never experienced something like this. I actually never credited the power of feelings or somatic work — things become clear with Clara. It opened a portal to feelings in a very subtle way, which I didn't know was there.</q>
      <cite>— Myke P., somatic coaching client</cite>
    </blockquote>
    <blockquote class="pull-quote reveal d1">
      <q>I would highly recommend Clara and somatic coaching as an easy way to stay grounded and build self trust when feeling emotions.</q>
      <cite>— Fontanna W.</cite>
    </blockquote>
    <blockquote class="pull-quote reveal d2">
      <q>This video was recommended to me and I was surprised it had so few views. I clicked and I'm so glad I did — I'm going through a hard time and this really helped me.</q>
      <cite>— YouTube viewer</cite>
    </blockquote>
  </div>
</section>
```

Note: this drops the auto-scrolling `.testimonial-track` animation, the `.testimonials-viewport` mask, and the shorter one-line reviews from the original three-column layout — the pull-quote stack is deliberately a smaller, curated set (per the spec's "two quotes visible at once" editorial direction), not a like-for-like port of every existing quote.

The `.testimonials-viewport`, `.testimonial-track`, `.quote-card`, `.quote-mark`, `.quote-text`, `.quote-attr` CSS rules and the `@keyframes scrollUp` rule (lines 262–273) become fully unused once this markup is replaced. Since this task is already replacing the only markup that used them, delete this whole block from the `<style>` tag rather than leave dead CSS behind:

```css
    /* ── Testimonials (vertical scroll) ── */
    .testimonials-viewport { overflow: hidden; height: 520px; -webkit-mask-image: linear-gradient(to bottom,transparent 0%,black 10%,black 90%,transparent 100%); mask-image: linear-gradient(to bottom,transparent 0%,black 10%,black 90%,transparent 100%); }
    .testimonial-track { display: flex; flex-direction: column; gap: 16px; animation: scrollUp linear infinite; }
    @keyframes scrollUp { 0% { transform: translateY(0); } 100% { transform: translateY(-50%); } }
    .quote-card { background: var(--bone); border-radius: 16px; border: 1.5px solid var(--line); padding: 24px; }
    .quote-card.sage { background: var(--dark); border-color: var(--dark); }
    .quote-mark { font-family: 'Bricolage Grotesque', sans-serif; font-weight: 700; font-size: 56px; line-height: 0.6; color: var(--gold); display: block; margin-bottom: 12px; }
    .quote-card.sage .quote-mark { color: rgba(242,182,92,.35); }
    .quote-text { font-family: 'Spectral', serif; font-size: 14px; line-height: 1.85; font-weight: 300; color: var(--text); margin-bottom: 12px; }
    .quote-card.sage .quote-text { color: var(--honey); }
    .quote-attr { font-family: 'Hanken Grotesk', sans-serif; font-size: 10px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: var(--muted); }
    .quote-card.sage .quote-attr { color: rgba(248,220,166,.5); }
```

Also delete the now-orphaned `@media (prefers-reduced-motion: reduce) { .testimonial-track { animation: none; } }` rule (originally near line 280) and the `.testimonials-grid { grid-template-columns: 1fr !important; }` line inside the `@media (max-width: 680px)` block (originally near line 233) — both reference the deleted testimonial markup.

- [ ] **Step 4: Run the check again, confirm it passes**

Run: `node scripts/checks/homepage-field-notes.mjs`
Expected: `PASS — testimonials use pull-quote stack, not auto-scroll cards`

- [ ] **Step 5: Commit**

```bash
cd "/Users/clara/Desktop/Website builder"
git add index.html
git commit -m "Replace auto-scroll testimonial cards with editorial pull-quote stack"
```

---

### Task 9: Replace FAQ with the editorial component

**Files:**
- Modify: `index.html:506-532` (FAQ section)

**Interfaces:**
- Consumes: `.faq-editorial-item`, `.faq-editorial-q`, `.faq-editorial-a` from `field-notes.css`

- [ ] **Step 1: Add to `scripts/checks/homepage-field-notes.mjs`**

```javascript
check('FAQ uses editorial component with 4 items', async (page) => {
  const count = await page.evaluate(() => document.querySelectorAll('.faq-editorial-item').length);
  return count === 4;
});
```

- [ ] **Step 2: Run it, confirm it fails**

Run: `node scripts/checks/homepage-field-notes.mjs`
Expected: `FAIL — FAQ uses editorial component with 4 items`

- [ ] **Step 3: Replace the FAQ section**

Find (lines 506–532):

```html
<!-- GEO: FAQ Section -->
<section style="background:var(--white);padding:100px 24px;">
  <div class="narrow">
    <div style="text-align:center;margin-bottom:56px;">
      <span class="section-label reveal">Common questions</span>
      <h2 class="section-title reveal d1" style="text-align:center;">What somatic work<br/><em>actually is.</em></h2>
    </div>
    <div>
      <div style="border-top:1.5px solid var(--line);padding:28px 0;" class="reveal">
        <h3 style="font-family:'Bricolage Grotesque',sans-serif;font-weight:600;font-size:17px;color:var(--text);margin-bottom:10px;line-height:1.35;">What is somatic yoga?</h3>
        <p style="font-family:'Hanken Grotesk',sans-serif;font-size:15px;color:var(--body);line-height:1.85;font-weight:300;">Somatic yoga is a body-led practice that combines yoga movement with nervous system awareness. Unlike conventional yoga, which focuses on physical form and flexibility, somatic yoga works with sensation, breath, and body awareness to help the nervous system release stored stress patterns. It is grounded in polyvagal theory: the science of how the nervous system regulates states of safety, threat, and connection.</p>
      </div>
      <div style="border-top:1.5px solid var(--line);padding:28px 0;" class="reveal d1">
        <h3 style="font-family:'Bricolage Grotesque',sans-serif;font-weight:600;font-size:17px;color:var(--text);margin-bottom:10px;line-height:1.35;">How is somatic coaching different from therapy?</h3>
        <p style="font-family:'Hanken Grotesk',sans-serif;font-size:15px;color:var(--body);line-height:1.85;font-weight:300;">Somatic coaching is an educational and experiential practice, not clinical therapy. It works with body sensations and survival patterns to support nervous system regulation and self-awareness. Clara Louis is a somatic practitioner and yoga teacher, not a licensed therapist. For clinical mental health support, a qualified therapist is recommended.</p>
      </div>
      <div style="border-top:1.5px solid var(--line);padding:28px 0;" class="reveal d2">
        <h3 style="font-family:'Bricolage Grotesque',sans-serif;font-weight:600;font-size:17px;color:var(--text);margin-bottom:10px;line-height:1.35;">Can somatic work help with anxiety, burnout, or feeling disconnected?</h3>
        <p style="font-family:'Hanken Grotesk',sans-serif;font-size:15px;color:var(--body);line-height:1.85;font-weight:300;">Many people who come to somatic work are not in crisis. They are functioning, but feel disconnected, exhausted, or stuck in the same patterns despite knowing better. Somatic practice addresses the body's survival states at a physiological level, offering tools for regulation that work when mindset approaches haven't landed.</p>
      </div>
      <div style="border-top:1.5px solid var(--line);border-bottom:1.5px solid var(--line);padding:28px 0;" class="reveal d3">
        <h3 style="font-family:'Bricolage Grotesque',sans-serif;font-weight:600;font-size:17px;color:var(--text);margin-bottom:10px;line-height:1.35;">Where does somatic work with Clara Louis take place?</h3>
        <p style="font-family:'Hanken Grotesk',sans-serif;font-size:15px;color:var(--body);line-height:1.85;font-weight:300;">Clara works with clients online and in London, UK. Options range from free somatic audio practices to one-to-one somatic coaching.</p>
      </div>
    </div>
  </div>
</section>
```

Replace it with:

```html
<!-- GEO: FAQ Section -->
<section style="background:var(--cream);padding:100px 24px;">
  <div class="narrow">
    <div style="margin-bottom:48px;">
      <span class="section-label reveal">Common questions</span>
      <h2 class="section-title reveal d1">What somatic work<br/><em>actually is.</em></h2>
    </div>
    <div>
      <div class="faq-editorial-item reveal">
        <p class="faq-editorial-q">What is somatic yoga?</p>
        <p class="faq-editorial-a">Somatic yoga is a body-led practice that combines yoga movement with nervous system awareness. Unlike conventional yoga, which focuses on physical form and flexibility, somatic yoga works with sensation, breath, and body awareness to help the nervous system release stored stress patterns. It is grounded in polyvagal theory: the science of how the nervous system regulates states of safety, threat, and connection.</p>
      </div>
      <div class="faq-editorial-item reveal d1">
        <p class="faq-editorial-q">How is somatic coaching different from therapy?</p>
        <p class="faq-editorial-a">Somatic coaching is an educational and experiential practice, not clinical therapy. It works with body sensations and survival patterns to support nervous system regulation and self-awareness. Clara Louis is a somatic practitioner and yoga teacher, not a licensed therapist. For clinical mental health support, a qualified therapist is recommended.</p>
      </div>
      <div class="faq-editorial-item reveal d2">
        <p class="faq-editorial-q">Can somatic work help with anxiety, burnout, or feeling disconnected?</p>
        <p class="faq-editorial-a">Many people who come to somatic work are not in crisis. They are functioning, but feel disconnected, exhausted, or stuck in the same patterns despite knowing better. Somatic practice addresses the body's survival states at a physiological level, offering tools for regulation that work when mindset approaches haven't landed.</p>
      </div>
      <div class="faq-editorial-item reveal d3">
        <p class="faq-editorial-q">Where does somatic work with Clara Louis take place?</p>
        <p class="faq-editorial-a">Clara works with clients online and in London, UK. Options range from free somatic audio practices to one-to-one somatic coaching.</p>
      </div>
    </div>
  </div>
</section>
```

- [ ] **Step 4: Run the check again, confirm it passes**

Run: `node scripts/checks/homepage-field-notes.mjs`
Expected: `PASS — FAQ uses editorial component with 4 items`

- [ ] **Step 5: Commit**

```bash
cd "/Users/clara/Desktop/Website builder"
git add index.html
git commit -m "Rebuild FAQ with editorial typography component"
```

---

### Task 10: Rebuild the CTA section

**Files:**
- Modify: `index.html:535-552` (CTA/Contact section)

**Interfaces:**
- Consumes: `.margin-note`, `.btn-underline`, `.btn-ghost-rect` from `field-notes.css`

- [ ] **Step 1: Add to `scripts/checks/homepage-field-notes.mjs`**

```javascript
check('CTA section is cream, not solid dark/ember', async (page) => {
  const bg = await page.evaluate(() => {
    const headings = Array.from(document.querySelectorAll('h2'));
    const cta = headings.find(h => h.textContent.includes('Not sure where'));
    return cta ? getComputedStyle(cta.closest('section')).backgroundColor : null;
  });
  return bg === 'rgb(251, 245, 234)';
});
```

- [ ] **Step 2: Run it, confirm it fails**

Run: `node scripts/checks/homepage-field-notes.mjs`
Expected: `FAIL — CTA section is cream, not solid dark/ember` (current background is `var(--dark)`)

- [ ] **Step 3: Replace the CTA section**

Find (lines 535–552):

```html
<!-- CONTACT -->
<section style="background:var(--dark);padding:100px 24px;text-align:center;position:relative;overflow:hidden;">
  <div class="circ" style="width:280px;height:280px;border:3px solid var(--sage);opacity:.07;top:-80px;right:-80px;"></div>
  <div class="circ" style="width:160px;height:160px;border:2px solid var(--violet);opacity:.09;bottom:-50px;left:-50px;"></div>
  <div style="max-width:620px;margin:0 auto;position:relative;z-index:1;">
    <span class="section-label reveal" style="color:rgba(255,255,255,.3);">Start here</span>
    <h2 class="reveal d1" style="font-family:'Bricolage Grotesque',sans-serif;font-weight:600;font-size:clamp(28px,5vw,48px);color:var(--cream);line-height:1.1;margin-bottom:20px;">
      Not sure where<br/>to begin?
    </h2>
    <p class="reveal d2" style="font-family:'Hanken Grotesk',sans-serif;font-size:15px;font-weight:300;color:rgba(255,255,255,.55);line-height:1.85;margin-bottom:40px;">
      The discovery call is free, 30 minutes, and there is no pressure. We talk about where you are, what you're looking for, and whether this work is a fit.
    </p>
    <div class="reveal d3" style="display:flex;flex-wrap:wrap;gap:16px;justify-content:center;">
      <a href="https://cal.com/clara-louis/discovery-call" class="btn-sage" target="_blank" rel="noopener">Book a discovery call</a>
      <a href="offers.html" class="btn-dark">See all offers</a>
    </div>
  </div>
</section>
```

Replace it with:

```html
<!-- CONTACT -->
<section style="background:var(--cream);padding:100px 24px;position:relative;">
  <div style="max-width:620px;margin:0 auto;">
    <span class="section-label reveal">Start here</span>
    <h2 class="reveal d1" style="font-family:'Bricolage Grotesque',sans-serif;font-weight:700;font-size:clamp(28px,5vw,48px);color:var(--dark);line-height:1.1;margin-bottom:8px;border-bottom:2px solid var(--ember);display:inline-block;padding-bottom:12px;">
      Not sure where<br/>to begin?
    </h2>
    <p class="margin-note reveal d2" style="margin:24px 0 32px;max-width:420px;">Free, 30 minutes, no pitch — just where you are and whether this fits.</p>
    <div class="reveal d3" style="display:flex;flex-wrap:wrap;gap:20px;align-items:center;">
      <a href="https://cal.com/clara-louis/discovery-call" class="btn-underline" target="_blank" rel="noopener">Book a discovery call →</a>
      <a href="offers.html" class="btn-ghost-rect">See all offers</a>
    </div>
  </div>
</section>
```

- [ ] **Step 4: Run the check again, confirm it passes**

Run: `node scripts/checks/homepage-field-notes.mjs`
Expected: `PASS — CTA section is cream, not solid dark/ember`

- [ ] **Step 5: Commit**

```bash
cd "/Users/clara/Desktop/Website builder"
git add index.html
git commit -m "Rebuild CTA section: cream background, underline/ghost-rect buttons"
```

---

### Task 11: Clean up temporary placeholder elements and remove remaining decorative icons

**Files:**
- Modify: `index.html` (remove the two temporary hidden elements added in Tasks 2–3; sweep for any remaining ◎ ◇ ○ 〜 marks)

**Interfaces:**
- None new

- [ ] **Step 1: Add to `scripts/checks/homepage-field-notes.mjs`**

```javascript
check('no hidden placeholder elements or stray decorative glyphs remain', async (page) => {
  const hasHiddenPlaceholders = await page.evaluate(() => {
    return !!document.querySelector('[aria-hidden="true"][style*="-9999px"]');
  });
  const text = await page.evaluate(() => document.body.innerText);
  const strayGlyphs = ['◎', '◇', '○', '〜'].some(g => text.includes(g));
  return !hasHiddenPlaceholders && !strayGlyphs;
});
```

- [ ] **Step 2: Run it, confirm it fails**

Run: `node scripts/checks/homepage-field-notes.mjs`
Expected: `FAIL — no hidden placeholder elements or stray decorative glyphs remain` (the two `aria-hidden` divs from Tasks 2–3 are still in the markup)

- [ ] **Step 3: Remove the temporary placeholder elements**

In `index.html`, find and delete these two lines (added in Tasks 2 and 3, right after `<body class="field-notes">`):

```html
<div class="detail-photo" style="width:1px;height:1px;position:absolute;left:-9999px;" aria-hidden="true"></div>
<blockquote class="pull-quote" style="position:absolute;left:-9999px;" aria-hidden="true"><q>placeholder</q><cite>placeholder</cite></blockquote>
```

`<body class="field-notes">` should now be immediately followed by `<!-- NAV -->`.

- [ ] **Step 4: Run the check again, confirm it passes**

Run: `node scripts/checks/homepage-field-notes.mjs`
Expected: `PASS — no hidden placeholder elements or stray decorative glyphs remain`

- [ ] **Step 5: Commit**

```bash
cd "/Users/clara/Desktop/Website builder"
git add index.html
git commit -m "Remove temporary placeholder elements used for component verification"
```

---

### Task 12: Full-page and mobile verification

**Files:**
- Modify: `scripts/checks/homepage-field-notes.mjs` (add final screenshot + mobile check)

**Interfaces:**
- None new — this is the final acceptance pass for the whole plan

- [ ] **Step 1: Add the final checks**

Add before `run()`:

```javascript
check('margin-note collapses to left-border style on mobile', async (page) => {
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 1 });
  await page.goto(`${BASE_URL}/index.html`, { waitUntil: 'networkidle2' });
  const style = await page.evaluate(() => {
    const note = document.querySelector('.margin-note');
    if (!note) return null;
    const s = getComputedStyle(note);
    return { borderLeftWidth: s.borderLeftWidth, gridColumns: getComputedStyle(document.querySelector('.field-copy')).gridTemplateColumns };
  });
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
  if (!style) return false;
  return style.borderLeftWidth === '2px';
});

check('no console errors on load', async (page) => {
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto(`${BASE_URL}/index.html`, { waitUntil: 'networkidle2' });
  return errors.length === 0;
});
```

Add at the end of `run()`, right before `await browser.close();`:

```javascript
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
  await page.goto(`${BASE_URL}/index.html`, { waitUntil: 'networkidle2' });
  await page.screenshot({ path: 'temporary screenshots/homepage-field-notes-desktop.png', fullPage: true });
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 1 });
  await page.goto(`${BASE_URL}/index.html`, { waitUntil: 'networkidle2' });
  await page.screenshot({ path: 'temporary screenshots/homepage-field-notes-mobile.png', fullPage: true });
  console.log('\nScreenshots saved to "temporary screenshots/".');
```

- [ ] **Step 2: Run the full suite**

Run: `node scripts/checks/homepage-field-notes.mjs`
Expected: `All checks passed.` — every check added across Tasks 1–12 passes, and two screenshots are saved to `temporary screenshots/`.

- [ ] **Step 3: Visually review the screenshots**

Open `temporary screenshots/homepage-field-notes-desktop.png` and `temporary screenshots/homepage-field-notes-mobile.png` and confirm against `docs/superpowers/specs/2026-07-06-homepage-redesign-design.md`: no full-bleed photo washes, hero video is framed not full-bleed, margin notes are visible beside (desktop) or beneath (mobile) their sections, no decorative icons, testimonials/FAQ read as editorial text.

- [ ] **Step 4: Commit**

```bash
cd "/Users/clara/Desktop/Website builder"
git add scripts/checks/homepage-field-notes.mjs
git commit -m "Add final full-page and mobile verification pass for field-notes homepage"
```

---

## Follow-on Plans (not in this plan)

Per the spec's Inner Pages tiers, these reuse `field-notes.css` and are separate plans once this one ships and is reviewed on the live homepage:

- `about.html`, `offers.html` — Full tier
- `somatic-yoga.html`, quiz pages ×3 — Medium tier
- Article pages ×5 — Light tier
