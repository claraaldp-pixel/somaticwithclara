# Homepage Real-Photo Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild `index.html` (somaticwithclara.com homepage) using real photography (already committed to `brand-assets/`), bold existing brand typography (Bricolage Grotesque + Hanken Grotesk), and section-to-section asymmetric photo/text splits — replacing the previous field-notes attempt, which read as generic/AI-made when reviewed live.

**Architecture:** All new CSS goes directly into `index.html`'s existing inline `<style>` block, following this codebase's established per-page convention (confirmed: every page in this site — about.html, offers.html, etc. — keeps its own full inline stylesheet; there is no shared CSS file anywhere in the codebase today). A single new layout primitive, `.photo-split`, handles every asymmetric photo/text section; each section supplies its own copy and inline color overrides the way the rest of this file already does. The previous plan's mistake of leaving a component's old background/border-radius half-overridden (rather than fully replaced) caused two separate review-round fixes — every task in this plan explicitly deletes the old CSS rule bodies it replaces rather than layering inline overrides on top.

**Tech Stack:** Static HTML/CSS/vanilla JS, no build step. Verification via `node serve.mjs` (port 3002) plus a Puppeteer check script (`puppeteer` is an existing project dependency).

## Global Constraints

- Design tokens are unchanged: `--ember: #DC5A22`, `--dark: #2A2117`, `--cream/--bg: #FBF5EA`, `--sage: #7C8456`, `--muted: #6E6051`, `--body: #4A3E2F`. No new tokens.
- Fonts: Bricolage Grotesque (headlines, 700–800 weight) + Hanken Grotesk (body) only. No Newsreader, no Playfair Display — both were considered and explicitly rejected (Playfair via a live font-comparison mockup; Clara chose to keep Bricolage Grotesque).
- Every photo/text section uses real photography from `brand-assets/` (already committed) — no placeholder boxes, no labeled "[ detail photo ]" divs anywhere.
- Buttons reuse the existing `.btn-sage` (solid ember, primary) and `.btn-dark` (solid dark, secondary) classes — both already match the new spec's "solid, not thin underline links" requirement, so no new button CSS is needed.
- No decorative icon glyphs (◎ ○ ◇ 〜) anywhere on this page.
- The hero's previous scroll-scrubbed video mechanic is being **removed entirely** in this plan (not preserved/reframed like the previous attempt) — Clara chose a static photo hero instead, confirmed directly.
- **Every new responsive layout must use flexible units (flex-basis percentages, not fixed pixel column widths) with a single mobile breakpoint that stacks to one column.** The previous plan's Task 6/7 mistakes were both fixed-pixel-column grids that didn't degrade gracefully — this plan's `.photo-split` primitive uses `flex: 1 1 <percent>` specifically to avoid repeating that.
- Spec reference: `docs/superpowers/specs/2026-07-13-homepage-real-photo-redesign.md`.

---

## File Structure

- **Modify only:** `index.html` — every task in this plan edits this single file (inline `<style>` block + body markup + closing `<script>` block for the hero-video removal). No new CSS or JS files are created — this plan is small enough that a shared component file would be premature (the field-notes plan's shared `field-notes.css` was flagged in its own final review for depending on tokens defined only in `index.html`, an issue that only matters once a second page consumes it — that's a decision for the `about.html`/`offers.html` follow-on plan, not this one).
- **Create:** `scripts/checks/homepage-real-photo.mjs` — Puppeteer verification script, built incrementally across all tasks, persisting every lesson learned from the field-notes plan's review rounds from the start (horizontal-overflow sweep, real `<img>` resolution checks, scroll-behavior-safe screenshot capture) rather than retrofitting them at the end.
- **Photos already committed** (commit `adfaaef`): `brand-assets/hero-stretch.jpg`, `brand-assets/definition-selfhug.jpg`, `brand-assets/about-smile.jpg`, `brand-assets/cta-pyramid.jpg`, plus four spares (`hands-clasped.jpg`, `forward-fold.jpg`, `cow-statue.jpg`, `courtyard-walk.jpg`) for the testimonials pairing and future inner pages.

---

### Task 1: Hero — static photo split, remove scroll-scrub video entirely

**Files:**
- Modify: `index.html:167-211` (`.hero-dark`/`.hero-video`/`.hero-overlay`/`.hero-eyebrow`/`.hero-h1`/`.hero-literary` CSS block — full deletion and replacement)
- Modify: `index.html:282-306` (`.hero-scroll-outer`/`.hero-sticky-wrap`/`.hero-state` CSS block — full deletion)
- Modify: `index.html:358-388` (hero markup — full replacement)
- Modify: `index.html:587-622` (scroll-controlled hero video `<script>` block — full deletion)

**Interfaces:**
- Produces: `.photo-split` / `.photo-split-media` / `.photo-split-text` / `.photo-split.reverse` (the shared layout primitive every later task in this plan consumes), `.hero-eyebrow` / `.hero-headline` (hero-specific text classes)

- [ ] **Step 1: Write the check script**

Create `scripts/checks/homepage-real-photo.mjs`:

```javascript
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

Run: `cd "/Users/clara/Desktop/Website builder" && node serve.mjs &` (leave running), then: `node scripts/checks/homepage-real-photo.mjs`
Expected: both checks `FAIL` (no `.photo-split` exists yet; the old hero video/scroll markup is still present)

- [ ] **Step 3: Replace the hero CSS block**

Find in `index.html`'s `<style>` block (lines 167–211):

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
    /* ── Photo split: shared asymmetric real-photo layout ── */
    .photo-split { display: flex; gap: 48px; align-items: center; }
    .photo-split.reverse { flex-direction: row-reverse; }
    .photo-split-media { flex: 1 1 56%; min-width: 0; }
    .photo-split-media img { width: 100%; height: 100%; min-height: 320px; max-height: 480px; object-fit: cover; display: block; border-radius: 4px; }
    .photo-split-text { flex: 1 1 44%; min-width: 0; }
    @media (max-width: 780px) {
      .photo-split, .photo-split.reverse { flex-direction: column; gap: 24px; }
      .photo-split-media img { max-height: 340px; }
    }

    /* Hero */
    .hero-eyebrow {
      font-family: 'Hanken Grotesk', sans-serif; font-size: 11px; font-weight: 700;
      letter-spacing: 2px; text-transform: uppercase;
      color: var(--ember); display: block; margin-bottom: 16px;
    }
    .hero-headline {
      font-family: 'Bricolage Grotesque', sans-serif; font-weight: 800;
      font-size: clamp(34px,5vw,52px); line-height: 1.06;
      color: var(--dark); margin: 0 0 16px;
    }
```

- [ ] **Step 4: Replace the `.hero-scroll-outer` / `.hero-state` CSS block**

Find (lines 282–306):

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

Delete this entire block (nothing replaces it — the scroll-scrubbed hero mechanic is being removed, not reframed).

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
<section style="background:var(--cream);padding:140px 24px 80px;">
  <div class="wide">
    <div class="photo-split">
      <div class="photo-split-media"><img src="brand-assets/hero-stretch.jpg" alt="Clara in a seated stretch, grounded and at ease" loading="eager"></div>
      <div class="photo-split-text">
        <span class="hero-eyebrow">Somatic &amp; Nervous-System Coaching</span>
        <h1 class="hero-headline">slow is a skill.<br>let's practice it.</h1>
        <p style="font-family:'Hanken Grotesk',sans-serif;font-size:16px;line-height:1.7;color:var(--body);max-width:38ch;margin:0;">There's who you've been surviving as. And who you actually are.</p>
      </div>
    </div>
  </div>
</section>
```

- [ ] **Step 6: Delete the scroll-controlled hero video `<script>` block**

Find, at the end of the closing `<script>` tag (lines 587–622):

```javascript
// ── Scroll-controlled hero video ─────────────────────
const heroOuter   = document.getElementById('hero-outer');
const heroVideoEl = document.getElementById('hero-video');
const heroStates  = document.querySelectorAll('.hero-state');
const scrollHint  = document.getElementById('scroll-hint');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isMobile      = window.innerWidth <= 768 || 'ontouchstart' in window;

if (reducedMotion || isMobile) {
  if (heroVideoEl) { heroVideoEl.setAttribute('autoplay', ''); heroVideoEl.setAttribute('loop', ''); heroVideoEl.style.opacity = '1'; }
  if (scrollHint) scrollHint.style.display = 'none';
} else {
  // Fade video in once enough is buffered to seek smoothly
  if (heroVideoEl) {
    heroVideoEl.addEventListener('canplaythrough', () => { heroVideoEl.style.opacity = '1'; }, { once: true });
  }

  function updateHero() {
    const rect = heroOuter.getBoundingClientRect();
    const totalH = heroOuter.offsetHeight - window.innerHeight;
    if (totalH <= 0) return;
    // Reserve ~40vh at the end as a pause zone — progress stays at 1.0 while
    // the user scrolls through it, holding the last video frame before moving on
    const pauseH = window.innerHeight * 0.4;
    const activeH = totalH - pauseH;
    const progress = Math.max(0, Math.min(1, -rect.top / activeH));
    if (heroVideoEl && heroVideoEl.duration) {
      heroVideoEl.currentTime = progress * heroVideoEl.duration * 0.5;
    }
    const phase = progress < 0.5 ? 0 : 1;
    heroStates.forEach(s => s.classList.toggle('active', +s.dataset.phase === phase));
    if (scrollHint) scrollHint.style.opacity = progress > 0.04 ? '0' : '1';
  }
  window.addEventListener('scroll', updateHero, { passive: true });
  if (heroVideoEl) heroVideoEl.addEventListener('loadedmetadata', updateHero);
}
```

Delete this entire block. The `<script>` tag should now end right after the scroll-reveal `IntersectionObserver` code (`revealEls.forEach(el => observer.observe(el));`) and close with `</script>`.

- [ ] **Step 7: Run the checks again, confirm they pass**

Run: `node scripts/checks/homepage-real-photo.mjs`
Expected: both checks `PASS`

- [ ] **Step 8: Commit**

```bash
cd "/Users/clara/Desktop/Website builder"
git add index.html scripts/checks/homepage-real-photo.mjs
git commit -m "Rebuild hero as static photo split, remove scroll-scrub video mechanic"
```

---

### Task 2: Section 01 — Definition, reversed split with self-hug photo

**Files:**
- Modify: `index.html:11` (meta `last-modified`, kept in sync with the visible date text this task also updates — a real bug from the previous plan's final review)
- Modify: `index.html:391-403` (Definition section)

**Interfaces:**
- Consumes: `.photo-split.reverse`, `.photo-split-media`, `.photo-split-text` from Task 1

- [ ] **Step 1: Add to `scripts/checks/homepage-real-photo.mjs`**

Add before `run()`:

```javascript
check('Section 01 uses reversed photo-split with real definition-selfhug photo', async (page) => {
  const el = await page.evaluate(() => {
    const imgs = Array.from(document.querySelectorAll('.photo-split.reverse .photo-split-media img'));
    return imgs.map(i => i.getAttribute('src'));
  });
  return el.some(src => src && src.includes('definition-selfhug.jpg'));
});
```

- [ ] **Step 2: Run it, confirm it fails**

Run: `node scripts/checks/homepage-real-photo.mjs`
Expected: `FAIL — Section 01 uses reversed photo-split with real definition-selfhug photo`

- [ ] **Step 3: Update the meta last-modified tag**

Find (line 11):

```html
  <meta name="last-modified" content="2026-06-04" />
```

Replace with:

```html
  <meta name="last-modified" content="2026-07-14" />
```

- [ ] **Step 4: Replace the Definition section**

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

Replace it with (background is a subtle ember-tinted gradient over `--bone`, per the spec's Section 01 requirement — not flat cream, and not so strong it competes with the photo):

```html
<!-- GEO: Definition + Credential Block -->
<section style="background:linear-gradient(155deg, rgba(220,90,34,.08) 0%, rgba(220,90,34,.02) 100%), var(--bone);padding:80px 24px;">
  <div class="wide">
    <p style="font-family:'Hanken Grotesk',sans-serif;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:var(--muted);margin-bottom:32px;">Clara Louis — Somatic Coach &amp; Human Design Guide &middot; London &amp; Online</p>
    <div class="photo-split reverse">
      <div class="photo-split-media"><img src="brand-assets/definition-selfhug.jpg" alt="Clara seated, arms crossed in a self-hug, eyes closed" loading="lazy"></div>
      <div class="photo-split-text">
        <p class="reveal" style="font-family:'Hanken Grotesk',sans-serif;font-size:17px;font-weight:300;line-height:1.9;color:var(--body);margin-bottom:20px;">
          <strong style="font-weight:500;color:var(--text);">Somatic work</strong> starts from one idea: experience needs the body and the mind together. The body feels — a held breath, a locked jaw, a stomach that won't settle. The mind interprets, and without it, none of that becomes a decision. Most people are cut off in one of two directions: thinking straight past what the body is saying, or a body so loud it stopped being trustworthy.
        </p>
        <p class="reveal d1" style="font-family:'Hanken Grotesk',sans-serif;font-size:16px;font-weight:300;line-height:1.9;color:var(--muted);margin-bottom:20px;">
          Attention is the skill in between — the thing that lets you actually hear what the body's saying instead of drowning it out. Somatic yoga, somatic coaching, Human Design: they're all tools for turning the light back on.
        </p>
        <p class="reveal d2" style="font-family:'Hanken Grotesk',sans-serif;font-size:11px;color:var(--faint);letter-spacing:1px;">Last updated: July 2026 &nbsp;·&nbsp; <a href="somatic-yoga.html" style="color:var(--ember);font-weight:500;text-decoration:none;font-size:11px;">What is somatic yoga? Read the full guide →</a></p>
      </div>
    </div>
  </div>
</section>
```

- [ ] **Step 5: Run the check again, confirm it passes**

Run: `node scripts/checks/homepage-real-photo.mjs`
Expected: `PASS — Section 01 uses reversed photo-split with real definition-selfhug photo`

- [ ] **Step 6: Commit**

```bash
cd "/Users/clara/Desktop/Website builder"
git add index.html
git commit -m "Rebuild Section 01 Definition with reversed photo-split, spine-language copy"
```

---

### Task 3: Section 02 — Services, bold visible numerals

**Files:**
- Modify: `index.html:252-260` (`.services-grid`/`.service-card`/`.service-icon` CSS rules)
- Modify: `index.html:406-439` (Services section)

**Interfaces:**
- Produces: `.service-numeral` (bold, visible numeral — not the ghosted-opacity style from the rejected field-notes attempt)

- [ ] **Step 1: Add to `scripts/checks/homepage-real-photo.mjs`**

```javascript
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
```

- [ ] **Step 2: Run it, confirm it fails**

Run: `node scripts/checks/homepage-real-photo.mjs`
Expected: `FAIL — services use bold visible numerals, no decorative icons`

- [ ] **Step 3: Replace the services CSS**

Find (lines 252–260):

```css
    /* ── Services grid ── */
    .services-grid { display: grid; grid-template-columns: repeat(2,1fr); gap: 20px; max-width: 860px; margin: 0 auto; }
    .service-card { background: var(--white); border-radius: 20px; border: 1.5px solid var(--line); padding: 36px 32px; transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease; display: flex; flex-direction: column; gap: 12px; }
    .service-card:hover { transform: translateY(-4px); border-color: var(--ember); box-shadow: 0 8px 28px rgba(220,90,34,.12); }
    .service-icon { font-size: 20px; color: var(--ember); line-height: 1; }
    .service-name { font-family: 'Bricolage Grotesque', sans-serif; font-weight: 600; font-size: 18px; color: var(--text); line-height: 1.2; margin: 0; }
    .service-desc { font-family: 'Hanken Grotesk', sans-serif; font-size: 14px; color: var(--body); line-height: 1.8; font-weight: 300; margin: 0; flex: 1; }
    .service-link { font-family: 'Hanken Grotesk', sans-serif; font-size: 11px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: var(--ember); }
    @media (max-width: 680px) { .services-grid { grid-template-columns: 1fr; } }
```

Replace it with (note: `background`, `border-radius`, and `border` are deliberately absent from `.service-card` this time — the field-notes plan left these on the base rule and had to fix it in a review round; this version never sets them in the first place):

```css
    /* ── Services grid ── */
    .services-grid { display: grid; grid-template-columns: 1fr; gap: 0; max-width: 780px; margin: 0 auto; }
    .service-card { padding: 24px 0; border-top: 1.5px solid var(--line); display: flex; align-items: flex-start; gap: 20px; text-decoration: none; }
    .services-grid a.service-card:last-child { border-bottom: 1.5px solid var(--line); }
    .service-numeral { font-family: 'Bricolage Grotesque', sans-serif; font-weight: 800; font-size: 40px; line-height: 1; color: var(--sage); flex-shrink: 0; min-width: 64px; }
    .service-name { font-family: 'Bricolage Grotesque', sans-serif; font-weight: 600; font-size: 18px; color: var(--text); line-height: 1.2; margin: 0 0 6px; }
    .service-desc { font-family: 'Hanken Grotesk', sans-serif; font-size: 14px; color: var(--body); line-height: 1.8; font-weight: 300; margin: 0 0 8px; }
    .service-link { font-family: 'Hanken Grotesk', sans-serif; font-size: 11px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: var(--ember); }
```

Note: since `.services-grid` is now a single-column list by default (not a 2-column grid needing a mobile override), no media query is needed for this component — a second lesson from the field-notes plan's Task 6 review, where a 2-column grid had to be collapsed to 1 column mid-review because it was too cramped next to a photo. This version starts single-column.

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
<section style="background:linear-gradient(160deg, rgba(124,132,86,.16) 0%, rgba(124,132,86,.05) 100%), var(--sage-light);padding:100px 24px;">
  <div class="wide">
    <div style="margin-bottom:48px;">
      <h2 class="section-title reveal">Ways to work together.</h2>
    </div>
    <div class="services-grid">
      <a href="offers.html" class="service-card reveal">
        <span class="service-numeral">01.</span>
        <div>
          <p class="service-name">Somatic Coaching</p>
          <p class="service-desc">One-to-one work with the body as guide. For women who are functioning but feel stuck, disconnected, or exhausted by coping. 3 or 6-month arc.</p>
          <span class="service-link">See details →</span>
        </div>
      </a>
      <a href="somatic-yoga.html" class="service-card reveal d1">
        <span class="service-numeral">02.</span>
        <div>
          <p class="service-name">Somatic Yoga</p>
          <p class="service-desc">Movement, breath, and nervous system awareness, together. Classes designed to help the body release survival patterns through sensation rather than effort.</p>
          <span class="service-link">Learn more →</span>
        </div>
      </a>
      <a href="offers.html" class="service-card reveal d2">
        <span class="service-numeral">03.</span>
        <div>
          <p class="service-name">Human Design</p>
          <p class="service-desc">One of the tools I actually use to find the somatic block underneath a pattern — a map of your energetic architecture, not a personality quiz.</p>
          <span class="service-link">See details →</span>
        </div>
      </a>
      <a href="reclaim-your-life.html" class="service-card reveal d3">
        <span class="service-numeral">04.</span>
        <div>
          <p class="service-name">Nervous System Community</p>
          <p class="service-desc">A Skool community for women learning to regulate. Somatic practices, nervous system tools, and a space to show up as you actually are.</p>
          <span class="service-link">Join the community →</span>
        </div>
      </a>
    </div>
  </div>
</section>
```

- [ ] **Step 5: Run the check again, confirm it passes**

Run: `node scripts/checks/homepage-real-photo.mjs`
Expected: `PASS — services use bold visible numerals, no decorative icons`

- [ ] **Step 6: Commit**

```bash
cd "/Users/clara/Desktop/Website builder"
git add index.html
git commit -m "Rebuild Section 02 Services with bold numerals, name Human Design as a tool"
```

---

### Task 4: About interlude — photo split with candid smile photo

**Files:**
- Modify: `index.html:441-455` (About section)

**Interfaces:**
- Consumes: `.photo-split`, `.photo-split-media`, `.photo-split-text` from Task 1

- [ ] **Step 1: Add to `scripts/checks/homepage-real-photo.mjs`**

```javascript
check('About uses photo-split with real about-smile photo and personal copy', async (page) => {
  const text = await page.evaluate(() => document.body.innerText);
  const hasPhoto = await page.evaluate(() => {
    const imgs = Array.from(document.querySelectorAll('.photo-split-media img'));
    return imgs.some(i => (i.getAttribute('src') || '').includes('about-smile.jpg'));
  });
  return hasPhoto && (text.includes('scattering') || text.includes('boring'));
});
```

- [ ] **Step 2: Run it, confirm it fails**

Run: `node scripts/checks/homepage-real-photo.mjs`
Expected: `FAIL — About uses photo-split with real about-smile photo and personal copy`

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
  <div class="wide">
    <div class="photo-split">
      <div class="photo-split-media"><img src="brand-assets/about-smile.jpg" alt="Clara laughing, caught mid-moment" loading="lazy"></div>
      <div class="photo-split-text">
        <span class="section-label reveal">About Clara</span>
        <h2 class="section-title reveal d1" style="margin-bottom:24px;">I came to this<br/><em>through my own body.</em></h2>
        <p class="reveal d2" style="font-family:'Hanken Grotesk',sans-serif;font-size:16px;font-weight:300;line-height:1.9;color:var(--body);margin-bottom:20px;">I spent years moving forward on the outside while something stayed frozen underneath. Doing the work. Knowing what I needed. Still returning to the same patterns. I thought that was just who I was.</p>
        <p class="reveal d3" style="font-family:'Hanken Grotesk',sans-serif;font-size:16px;font-weight:300;line-height:1.9;color:var(--body);margin-bottom:20px;">It wasn't. Those patterns were survival responses. The body had learned them for good reason, and nothing I thought or understood was going to change what it had stored. I still catch a plan getting boring and feel the pull to start something new instead of staying — that's part of why this work isn't theory to me.</p>
        <p class="reveal d4" style="font-family:'Hanken Grotesk',sans-serif;font-size:14px;font-weight:300;line-height:1.8;color:var(--muted);margin-bottom:32px;">Somatic coach and Human Design guide. Based in London, working with women online and in person.</p>
        <a href="about.html" class="reveal d4 btn-dark" style="display:inline-block;">Full story →</a>
      </div>
    </div>
  </div>
</section>
```

Note: the "Full story →" link now uses the existing `.btn-dark` class (solid dark pill button) rather than a bare text link, matching the spec's "solid, not thin underline links" button requirement.

- [ ] **Step 4: Run the check again, confirm it passes**

Run: `node scripts/checks/homepage-real-photo.mjs`
Expected: `PASS — About uses photo-split with real about-smile photo and personal copy`

- [ ] **Step 5: Commit**

```bash
cd "/Users/clara/Desktop/Website builder"
git add index.html
git commit -m "Rebuild About interlude with candid photo, direct personal copy"
```

---

### Task 5: Testimonials — pull-quote + small photo pairing

**Files:**
- Modify: `index.html:262-280` (testimonial carousel CSS block and its `prefers-reduced-motion` rule)
- Modify: `index.html:233` (`.testimonials-grid` rule inside the mobile media query)
- Modify: `index.html:458-503` (Testimonials section)

**Interfaces:**
- Produces: `.pull-quote-stack`, `.pull-quote-pair`, `.pull-quote-text` (testimonial component)

- [ ] **Step 1: Add to `scripts/checks/homepage-real-photo.mjs`**

```javascript
check('testimonials use pull-quote + photo pairing, not auto-scroll carousel', async (page) => {
  const hasTrack = await page.evaluate(() => !!document.querySelector('.testimonial-track'));
  const pairs = await page.evaluate(() => {
    const els = Array.from(document.querySelectorAll('.pull-quote-pair'));
    return els.map(el => !!el.querySelector('img') && !!el.querySelector('.pull-quote-text'));
  });
  return !hasTrack && pairs.length === 3 && pairs.every(Boolean);
});
```

- [ ] **Step 2: Run it, confirm it fails**

Run: `node scripts/checks/homepage-real-photo.mjs`
Expected: `FAIL — testimonials use pull-quote + photo pairing, not auto-scroll carousel`

- [ ] **Step 3: Remove the `.testimonials-grid` mobile rule**

Find (line 233, inside the `@media (max-width: 680px)` block):

```css
      .testimonials-grid { grid-template-columns: 1fr !important; }
```

Delete this line (the `.testimonials-grid` class is removed entirely in Step 5 below, so this override becomes dead).

- [ ] **Step 4: Delete the testimonial carousel CSS block**

Find (lines 262–280, including the `prefers-reduced-motion` rule that references it):

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

    /* ── Mobile nav ── */
```

Replace with (keeping the "Mobile nav" comment that follows, adding the new pull-quote component in place of the deleted carousel CSS):

```css
    /* ── Pull-quote + photo pairing ── */
    .pull-quote-stack { display: grid; gap: 24px; max-width: 760px; margin: 0 auto; }
    .pull-quote-pair { display: flex; gap: 20px; align-items: center; background: var(--white); border-radius: 8px; padding: 24px; }
    .pull-quote-pair img { width: 88px; height: 88px; border-radius: 50%; object-fit: cover; flex-shrink: 0; }
    .pull-quote-text q { font-family: 'Hanken Grotesk', sans-serif; font-style: italic; font-size: 15px; line-height: 1.65; color: var(--text); display: block; margin-bottom: 8px; quotes: none; }
    .pull-quote-text cite { font-family: 'Hanken Grotesk', sans-serif; font-size: 11px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; color: var(--muted); font-style: normal; }
    @media (max-width: 560px) {
      .pull-quote-pair { flex-direction: column; align-items: flex-start; gap: 12px; }
    }

    /* ── Mobile nav ── */
```

Also delete the now-orphaned `@media (prefers-reduced-motion: reduce) { .testimonial-track { animation: none; } }` rule (originally near line 280, right after the mobile-nav block) — it references the deleted `.testimonial-track` class.

- [ ] **Step 5: Replace the Testimonials section**

Find (lines 458–503) — the full `<!-- TESTIMONIALS -->` section — and replace the entire block with:

```html
<!-- TESTIMONIALS -->
<section style="background:var(--bg);padding:100px 24px;">
  <div style="text-align:center;margin-bottom:48px;">
    <h2 class="section-title reveal" style="text-align:center;">Words from the women<br/><em>in this space.</em></h2>
  </div>
  <div class="pull-quote-stack">
    <div class="pull-quote-pair reveal">
      <img src="brand-assets/hands-clasped.jpg" alt="" aria-hidden="true">
      <div class="pull-quote-text">
        <q>I never experienced something like this. I actually never credited the power of feelings or somatic work — things become clear with Clara. It opened a portal to feelings in a very subtle way, which I didn't know was there.</q>
        <cite>— Myke P., somatic coaching client</cite>
      </div>
    </div>
    <div class="pull-quote-pair reveal d1">
      <img src="brand-assets/forward-fold.jpg" alt="" aria-hidden="true">
      <div class="pull-quote-text">
        <q>I would highly recommend Clara and somatic coaching as an easy way to stay grounded and build self trust when feeling emotions.</q>
        <cite>— Fontanna W.</cite>
      </div>
    </div>
    <div class="pull-quote-pair reveal d2">
      <img src="brand-assets/courtyard-walk.jpg" alt="" aria-hidden="true">
      <div class="pull-quote-text">
        <q>This video was recommended to me and I was surprised it had so few views. I clicked and I'm so glad I did — I'm going through a hard time and this really helped me.</q>
        <cite>— YouTube viewer</cite>
      </div>
    </div>
  </div>
</section>
```

Note: the small pairing photos here (`hands-clasped.jpg`, `forward-fold.jpg`, `courtyard-walk.jpg`) are decorative pairings, not literal photos of the quoted clients — `alt=""` with `aria-hidden="true"` marks them as decorative for screen readers, which is correct here since the images don't depict the person being quoted.

- [ ] **Step 6: Run the check again, confirm it passes**

Run: `node scripts/checks/homepage-real-photo.mjs`
Expected: `PASS — testimonials use pull-quote + photo pairing, not auto-scroll carousel`

- [ ] **Step 7: Commit**

```bash
cd "/Users/clara/Desktop/Website builder"
git add index.html
git commit -m "Replace auto-scroll testimonial carousel with pull-quote + photo pairing"
```

---

### Task 6: FAQ — typography polish

**Files:**
- Modify: `index.html:506-532` (FAQ section)

**Interfaces:**
- None new — this is a light polish pass, not a structural change (`main`'s FAQ markup is already accordion-free with plain question/answer pairs)

- [ ] **Step 1: Add to `scripts/checks/homepage-real-photo.mjs`**

```javascript
check('FAQ headings use bold 800-weight Bricolage Grotesque', async (page) => {
  const style = await page.evaluate(() => {
    const h3 = document.querySelector('section h3');
    if (!h3) return null;
    return { fontWeight: getComputedStyle(h3).fontWeight, fontSize: parseFloat(getComputedStyle(h3).fontSize) };
  });
  if (!style) return false;
  return parseInt(style.fontWeight, 10) >= 700 && style.fontSize >= 18;
});
```

- [ ] **Step 2: Run it, confirm it fails**

Run: `node scripts/checks/homepage-real-photo.mjs`
Expected: `FAIL — FAQ headings use bold 800-weight Bricolage Grotesque` (current heading weight is 600, size 17px)

- [ ] **Step 3: Update the FAQ heading styles**

Find, four times in the FAQ section (lines 515, 519, 523, 527), the repeated inline style pattern:

```html
<h3 style="font-family:'Bricolage Grotesque',sans-serif;font-weight:600;font-size:17px;color:var(--text);margin-bottom:10px;line-height:1.35;">
```

Replace each occurrence with:

```html
<h3 style="font-family:'Bricolage Grotesque',sans-serif;font-weight:800;font-size:19px;color:var(--text);margin-bottom:10px;line-height:1.3;">
```

(This is the same opening tag repeated before each of the four questions — "What is somatic yoga?", "How is somatic coaching different from therapy?", "Can somatic work help with anxiety, burnout, or feeling disconnected?", "Where does somatic work with Clara Louis take place?". Update all four; leave the question text and the following `<p>` answer tags exactly as they are.)

- [ ] **Step 4: Run the check again, confirm it passes**

Run: `node scripts/checks/homepage-real-photo.mjs`
Expected: `PASS — FAQ headings use bold 800-weight Bricolage Grotesque`

- [ ] **Step 5: Commit**

```bash
cd "/Users/clara/Desktop/Website builder"
git add index.html
git commit -m "Bump FAQ heading weight/size to match bolder homepage typography"
```

---

### Task 7: CTA — photo split on dark background

**Files:**
- Modify: `index.html:535-552` (CTA/Contact section)

**Interfaces:**
- Consumes: `.photo-split`, `.photo-split-media`, `.photo-split-text` from Task 1, `.btn-sage`/`.btn-dark` (existing, unmodified)

- [ ] **Step 1: Add to `scripts/checks/homepage-real-photo.mjs`**

```javascript
check('CTA uses photo-split with real cta-pyramid photo on dark background', async (page) => {
  const result = await page.evaluate(() => {
    const heading = Array.from(document.querySelectorAll('h2')).find(h => h.textContent.includes('Not sure where'));
    if (!heading) return null;
    const section = heading.closest('section');
    const img = section.querySelector('.photo-split-media img');
    return {
      bg: getComputedStyle(section).backgroundColor,
      src: img ? img.getAttribute('src') : null,
    };
  });
  if (!result) return false;
  return result.bg === 'rgb(42, 33, 23)' && result.src && result.src.includes('cta-pyramid.jpg');
});
```

- [ ] **Step 2: Run it, confirm it fails**

Run: `node scripts/checks/homepage-real-photo.mjs`
Expected: `FAIL — CTA uses photo-split with real cta-pyramid photo on dark background`

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
<section style="background:var(--dark);padding:100px 24px;">
  <div class="wide">
    <div class="photo-split">
      <div class="photo-split-media"><img src="brand-assets/cta-pyramid.jpg" alt="Clara walking toward Mayan ruins, water bottles in hand" loading="lazy"></div>
      <div class="photo-split-text">
        <span class="section-label reveal" style="color:rgba(255,255,255,.4);">Start here</span>
        <h2 class="reveal d1" style="font-family:'Bricolage Grotesque',sans-serif;font-weight:800;font-size:clamp(28px,4vw,40px);color:var(--cream);line-height:1.1;margin-bottom:20px;">
          Not sure where to begin?
        </h2>
        <p class="reveal d2" style="font-family:'Hanken Grotesk',sans-serif;font-size:15px;font-weight:300;color:rgba(255,255,255,.65);line-height:1.85;margin-bottom:32px;">
          The discovery call is free, 30 minutes, and there is no pressure. We talk about where you are, what you're looking for, and whether this work is a fit.
        </p>
        <div class="reveal d3" style="display:flex;flex-wrap:wrap;gap:16px;">
          <a href="https://cal.com/clara-louis/discovery-call" class="btn-sage" target="_blank" rel="noopener">Book a discovery call</a>
          <a href="offers.html" class="btn-dark">See all offers</a>
        </div>
      </div>
    </div>
  </div>
</section>
```

Note: the two `.circ` decorative-circle divs are dropped here (this was the only remaining place `.circ` was used on this page after the hero rebuild in Task 1 also removed its two `.circ` usages) — Step 4 below removes the now fully-unused `.circ` CSS rule.

- [ ] **Step 4: Remove the now-unused `.circ` CSS rule**

Find (line 214):

```css
    /* Decorative circles */
    .circ { position: absolute; border-radius: 50%; pointer-events: none; }
```

Delete these two lines — confirm first via `grep -c 'class="circ"' index.html` that it returns `0` (both usages were removed: two in the old hero markup in Task 1, two in the old CTA markup in this step).

- [ ] **Step 5: Run the check again, confirm it passes**

Run: `node scripts/checks/homepage-real-photo.mjs`
Expected: `PASS — CTA uses photo-split with real cta-pyramid photo on dark background`

- [ ] **Step 6: Commit**

```bash
cd "/Users/clara/Desktop/Website builder"
git add index.html
git commit -m "Rebuild CTA with photo split on dark background, remove unused .circ rule"
```

---

### Task 8: Final verification — full-page, mobile, and overflow sweep

**Files:**
- Modify: `scripts/checks/homepage-real-photo.mjs` (add final checks + screenshot capture)

**Interfaces:**
- None new — this is the acceptance pass for the whole plan

- [ ] **Step 1: Add the final checks**

Add before `run()` (these persist every lesson learned from the field-notes plan's review rounds from the start, rather than needing a fix round to add them):

```javascript
check('no horizontal overflow at any viewport width', async (page) => {
  const widths = [390, 560, 680, 780, 900, 1440];
  for (const width of widths) {
    await page.setViewport({ width, height: 900, deviceScaleFactor: 1 });
    await page.goto(`${BASE_URL}/index.html`, { waitUntil: 'networkidle2' });
    const { scrollWidth, innerWidth } = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      innerWidth: window.innerWidth,
    }));
    if (scrollWidth > innerWidth) {
      console.error(`  overflow at ${width}px: scrollWidth=${scrollWidth} > innerWidth=${innerWidth}`);
      return false;
    }
  }
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
  return true;
});

check('every photo-split image loads (no broken images)', async (page) => {
  await page.goto(`${BASE_URL}/index.html`, { waitUntil: 'networkidle2' });
  const broken = await page.evaluate(() => {
    const imgs = Array.from(document.querySelectorAll('img'));
    return imgs.filter(img => img.complete && img.naturalWidth === 0).map(img => img.src);
  });
  if (broken.length > 0) console.error('  broken images:', broken);
  return broken.length === 0;
});

check('no console errors on load', async (page) => {
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto(`${BASE_URL}/index.html`, { waitUntil: 'networkidle2' });
  return errors.length === 0;
});
```

Add at the end of `run()`, right before `await browser.close();` (this includes the scroll-through-before-screenshot fix and `behavior: 'instant'` correction the field-notes plan only discovered after a blank-screenshot fix round — building it correctly from the start here):

```javascript
  async function scrollThroughForReveal(page) {
    await page.evaluate(async () => {
      const distance = 400;
      const delay = 120;
      while (document.scrollingElement.scrollTop + window.innerHeight < document.body.scrollHeight) {
        document.scrollingElement.scrollBy({ top: distance, behavior: 'instant' });
        await new Promise(r => setTimeout(r, delay));
      }
      document.scrollingElement.scrollTo({ top: 0, behavior: 'instant' });
      await new Promise(r => setTimeout(r, 300));
    });
  }

  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
  await page.goto(`${BASE_URL}/index.html`, { waitUntil: 'networkidle2' });
  await scrollThroughForReveal(page);
  await page.screenshot({ path: 'temporary screenshots/homepage-real-photo-desktop.png', fullPage: true });

  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 1 });
  await page.goto(`${BASE_URL}/index.html`, { waitUntil: 'networkidle2' });
  await scrollThroughForReveal(page);
  await page.screenshot({ path: 'temporary screenshots/homepage-real-photo-mobile.png', fullPage: true });

  console.log('\nScreenshots saved to "temporary screenshots/".');
```

- [ ] **Step 2: Run the full suite**

Run: `node scripts/checks/homepage-real-photo.mjs`
Expected: `All checks passed.` — every check added across Tasks 1–8 passes, and two screenshots are saved to `temporary screenshots/`.

- [ ] **Step 3: Visually review the screenshots**

Open `temporary screenshots/homepage-real-photo-desktop.png` and `-mobile.png` and confirm against `docs/superpowers/specs/2026-07-13-homepage-real-photo-redesign.md`: real photography (no placeholder boxes) in every section, bold visible numerals on Services, alternating photo/text sides down the page, no decorative icons, testimonials paired with small photos, CTA on dark background with the pyramid photo.

- [ ] **Step 4: Commit**

```bash
cd "/Users/clara/Desktop/Website builder"
git add scripts/checks/homepage-real-photo.mjs
git commit -m "Add final verification pass: overflow sweep, broken-image check, screenshots"
```

---

## Follow-on Plans (not in this plan)

Per the spec's Inner Pages tiers, these reuse the `.photo-split` pattern (and may warrant extracting it to a shared file once a second page needs it) and are separate plans once this one ships:

- `about.html`, `offers.html` — Full tier
- `somatic-yoga.html`, quiz pages ×3 — Medium tier
- Article pages ×5 — Light tier

More photos than the 8 already committed will likely be needed for full sitewide coverage.
