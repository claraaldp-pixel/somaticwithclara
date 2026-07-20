# Somatic with Clara — Template Homepage Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Recreate the "Luminous" reference aesthetic as the Somatic with Clara homepage — full-bleed meadow hero, serif editorial layout, co-equal somatic + Human Design pillars — while keeping GEO content and adding a real Human Design "big three" calculator.

**Architecture:** Single self-contained `index.html` (inline `<style>`, existing reveal/nav scripts) served statically by `serve.mjs` on :3002. The Human Design calculator is an isolated ESM module (`hd/` folder) with unit tests, loaded by `index.html` and wired into the "first glimpse" section. Milestone 1 = visual homepage (browser-verified). Milestone 2 = HD calculator (TDD, then integrated).

**Tech Stack:** HTML/CSS/vanilla JS, Newsreader + Hanken Grotesk (Google Fonts), Node ESM + `node --test` for the HD module, a Moshier-based JS ephemeris (bundled locally), cal.com embed for booking. Verification via the gstack `browse` tool.

## Global Constraints

- Single homepage file: `index.html` at worktree root. No backend; static only.
- Fonts: Newsreader (serif display) + Hanken Grotesk (body). No Bricolage/Fraunces/other.
- Palette (exact): bg bone `#F6F1E7`, cream `#FBF5EA`; panels dove `#E4E9E6`, pale sand `#EFE7D8`; accent clay `#C89574`, hover/link deep clay `#B0774F`; text espresso `#2A2117`, body `#4A3E2F`, muted `#6E6051`; closing block clay `#C08A66`.
- No hard divider rules; sections separate on whitespace/tone. Arch images: `border-radius: 190px 190px 16px 16px`; other images 16px.
- **Public copy must NOT use "Path A / Path B"** (internal vocabulary).
- Preserve all three JSON-LD schema blocks, canonical, hreflang, OG/Twitter meta, `last-modified` verbatim.
- Homepage indexed word count must not drop below the current version (GEO).
- Copy is authoritative in the spec: `docs/superpowers/specs/2026-07-19-somatic-template-homepage-design.md`. Use it verbatim for each section.
- Verify every visual task against `http://localhost:3002/` with `browse` before committing.

---

## Milestone 1 — Visual homepage

Work directly in `index.html`. Keep the existing `<head>` (schema, meta, fonts link already switched to Newsreader+Hanken). Build the body section by section, top to bottom, replacing current sections. After each task: reload :3002, screenshot, eyeball against the reference, commit.

### Task 1: Design tokens + base styles

**Files:**
- Modify: `index.html` (the `:root` block and base element styles inside `<style>`)

**Interfaces:**
- Produces: CSS custom properties consumed by every later task: `--bg,--cream,--dove,--sand,--clay,--clay-dark,--text,--body,--muted,--dark`; helper classes `.wide,.narrow,.eyebrow,.display,.arch`.

- [ ] **Step 1: Replace the `:root` token block** with the exact palette from Global Constraints, plus:

```css
:root{
  --bg:#F6F1E7; --cream:#FBF5EA; --white:#fff;
  --dove:#E4E9E6; --sand:#EFE7D8;
  --clay:#C89574; --clay-dark:#B0774F; --clay-deep:#C08A66;
  --text:#2A2117; --body:#4A3E2F; --muted:#6E6051;
  --dark:#2A2117; --line:rgba(42,33,23,.08);
}
```

- [ ] **Step 2: Add shared type + layout helpers** (serif display, tracked eyebrow, containers, arch):

```css
body{font-family:'Hanken Grotesk',sans-serif;background:var(--bg);color:var(--body);-webkit-font-smoothing:antialiased;overflow-x:clip;}
.wide{max-width:1080px;margin:0 auto;padding:0 32px;}
.narrow{max-width:720px;margin:0 auto;padding:0 32px;}
.eyebrow{font-size:11px;font-weight:600;letter-spacing:2.5px;text-transform:uppercase;color:var(--muted);display:block;margin-bottom:16px;}
.display{font-family:'Newsreader',serif;font-weight:500;line-height:1.08;letter-spacing:-0.015em;color:var(--text);}
.display em{font-style:italic;font-weight:400;}
.arch img{border-radius:190px 190px 16px 16px;}
```

- [ ] **Step 3: Verify** — `browse goto http://localhost:3002/`, `browse screenshot --viewport /tmp/t1.png`. Page still renders (unstyled sections OK); background is warm bone.
- [ ] **Step 4: Commit** — `git add index.html && git commit -m "feat(home): base design tokens + type helpers"`

### Task 2: Light nav over hero

**Files:** Modify `index.html` (`#nav` styles + nav markup)

**Interfaces:** Consumes tokens. Produces `#nav` that is transparent at top (dark text), solid bone on `.scrolled`. Reuses existing scroll script.

- [ ] **Step 1: Restyle `#nav`** — transparent at top, `color:var(--text)` links; `#nav.scrolled{background:var(--bg);box-shadow:0 1px 0 var(--line);}`. Nav links dark, hover clay. Keep existing links/destinations and the mobile menu.
- [ ] **Step 2: Swap logo** to a dark-on-light variant (`brand-assets/somatic-with-clara-logo-dark-transparent.svg` already dark — confirm it reads on bone; if not, note for Clara).
- [ ] **Step 3: Verify** — screenshot at scrollY 0 (transparent, dark legible text) and after scroll (bone bar). 
- [ ] **Step 4: Commit** — `git commit -am "feat(home): light nav over hero"`

### Task 3: Full-bleed hero

**Files:** Modify `index.html` (hero section + `.hero` styles)

- [ ] **Step 1: Build the hero** — full-viewport section, background `brand-assets/hero-meadow.jpg` (placeholder until Clara's shot 1), `object-fit:cover`, subtle dark-to-transparent gradient overlay for legibility. Content centered/left per reference:
  - `.eyebrow` "Somatic Coaching · Human Design"
  - `<h1 class="display">Come home<br><em>to your own rhythm.</em></h1>` (clamp 44–68px)
  - Sub paragraph (spec copy), max ~46ch
  - `Begin here` button (clay) → `#sessions`
- [ ] **Step 2: Placeholder image** — copy an existing brand photo to `brand-assets/hero-meadow.jpg` so layout is visible; document the real filename in a `brand-assets/PHOTOS.md` shot-list note.
- [ ] **Step 3: Verify** — screenshot; hero fills viewport, serif headline with italic second line, text legible over image.
- [ ] **Step 4: Commit** — `git commit -am "feat(home): full-bleed meadow hero"`

### Task 4: The integration (two arch images)

**Files:** Modify `index.html`

- [ ] **Step 1: Build section** on cream — eyebrow "The integration", `<h2 class="display">Your body knows.<br>Your design illuminates.</h2>`, then a two-item layout:
  - Item 01 · The Body: arch image (`brand-assets/integration-body.jpg`), label "01 · The Body", serif subhead "Feel what is true", spec paragraph.
  - Item 02 · The Design: arch image (`brand-assets/integration-design.jpg`), label "02 · The Design", serif subhead "See how you're made", spec paragraph.
  - Closing line + `Book a discovery call` button → `#sessions`.
- [ ] **Step 2: Placeholders** for the two arch images; add filenames to `PHOTOS.md`.
- [ ] **Step 3: Verify** — screenshot; arch tops render, staggered like the reference.
- [ ] **Step 4: Commit** — `git commit -am "feat(home): integration section"`

### Task 5: Philosophy band

**Files:** Modify `index.html`

- [ ] **Step 1: Build band** — full-width soft dove (`--dove`) section, centered `narrow`, serif display at ~30–34px, the exact philosophy-band copy from the spec (no Path A/B). No image.
- [ ] **Step 2: Verify** — screenshot; quiet tonal break, readable.
- [ ] **Step 3: Commit** — `git commit -am "feat(home): philosophy band"`

### Task 6: First-glimpse section (calculator placeholder)

**Files:** Modify `index.html`

- [ ] **Step 1: Build section** on `--dove` panel — eyebrow "A first glimpse", `<h2 class="display">Meet your <em>energetic nature.</em></h2>`, spec sub-copy, and an empty container `<div id="hd-widget" class="hd-card"></div>` with a styled static fallback (birth-detail teaser + "Calculate" button that currently links to the discovery call). Milestone 2 fills `#hd-widget`.
- [ ] **Step 2: Style `.hd-card`** — white/rounded floating card on the dove panel, matching the reference's form card.
- [ ] **Step 3: Verify** — screenshot; card sits on dove panel like the reference chart form.
- [ ] **Step 4: Commit** — `git commit -am "feat(home): first-glimpse section + widget mount"`

### Task 7: Offerings

**Files:** Modify `index.html`

- [ ] **Step 1: Rebuild the offerings list** in the calm style: serif italic clay numerals (01–04), serif names, body descriptions, clay uppercase links. Reuse the four existing offerings + destinations. Section on cream, eyebrow "Offerings", serif H2 "Ways to work together."
- [ ] **Step 2: Verify** — screenshot.
- [ ] **Step 3: Commit** — `git commit -am "feat(home): offerings"`

### Task 8: Reflections (testimonials)

**Files:** Modify `index.html`

- [ ] **Step 1: Build** on bone — eyebrow "Reflections", serif H2 "Words from the women in this space.", three italic-serif pull-quote cards (existing quotes + avatars).
- [ ] **Step 2: Verify** — screenshot.
- [ ] **Step 3: Commit** — `git commit -am "feat(home): reflections"`

### Task 9: A space to be met (booking)

**Files:** Modify `index.html`

- [ ] **Step 1: Build** `<section id="sessions">` — eyebrow "The sacred session", serif H2 "A space to be met.", spec sub-copy, and a cal.com inline embed for `clara-louis/discovery-call` using the official embed snippet, styled container. Provide a visible fallback link (`Book a discovery call` → `https://cal.com/clara-louis/discovery-call`) shown if the embed script is blocked.
- [ ] **Step 2: Verify** — screenshot + `browse console --errors` (no uncaught errors); embed or fallback visible.
- [ ] **Step 3: Commit** — `git commit -am "feat(home): discovery-call booking section"`

### Task 10: Approach + FAQ (GEO retention)

**Files:** Modify `index.html`

- [ ] **Step 1: Restyle and keep** the definitional lead paragraph, the "Last updated" line, and the four FAQ Q&As. Serif question headings, body answers, hairline separators (`--line`). Confirm the three JSON-LD blocks remain untouched in `<head>`.
- [ ] **Step 2: Verify word count** — `browse text` and confirm total copy ≥ the pre-redesign homepage (compare against `git show HEAD~10:index.html` text if needed).
- [ ] **Step 3: Verify** — screenshot.
- [ ] **Step 4: Commit** — `git commit -am "feat(home): approach + FAQ (GEO)"`

### Task 11: Final exhale + footer

**Files:** Modify `index.html`

- [ ] **Step 1: Build** full-bleed `--clay-deep` closing block, cream text — eyebrow "A final exhale", serif italic H2 "You do not need to become more. You can become more you.", `Begin with a conversation` button → cal.com. Then the quiet footer (existing links/socials/copyright) restyled.
- [ ] **Step 2: Verify** — screenshot full page top-to-bottom; check reveal animations fire.
- [ ] **Step 3: Commit** — `git commit -am "feat(home): final exhale + footer"`

### Task 12: Full-page review pass

- [ ] **Step 1:** Capture full-page screenshots at 1440px and 390px (mobile) via `browse`; fix spacing/responsive issues (stack `.arch` and two-column blocks on mobile).
- [ ] **Step 2:** Run `/impeccable audit`; resolve real findings, leave intentional ones (numbered markers, Clara's em-dashes) with a one-line note.
- [ ] **Step 3: Commit** — `git commit -am "fix(home): responsive + audit pass"`

---

## Milestone 2 — Human Design "big three" calculator — DROPPED (2026-07-19)

**Status: dropped by Clara** to avoid collecting/storing birth-detail PII. The
first-glimpse section instead links to the existing nervous-system quiz
(`quiz.html`) — no personal data collected. Human Design remains a co-equal
pillar in the integration and offerings sections; only the interactive chart
widget is cut. The tasks below are retained for reference only and are not to be
implemented.

Build as an isolated, unit-tested ESM module, then mount into `#hd-widget`. TDD with fixtures from known public charts.

**File structure:**
- Create `hd/ephemeris.mjs` — planetary ecliptic longitudes for a UTC instant (Moshier).
- Create `hd/gates.mjs` — longitude → {gate,line}; gate wheel + channel/center tables.
- Create `hd/chart.mjs` — birth data → {type, authority, profile} (orchestrates ephemeris + gates).
- Create `hd/widget.mjs` — 3-step form UI + render, mounts on `#hd-widget`.
- Create `hd/*.test.mjs` — unit tests (`node --test`).
- Modify `index.html` — `<script type="module" src="hd/widget.mjs">`.

### Task 13: Ephemeris longitudes

**Files:** Create `hd/ephemeris.mjs`, `hd/ephemeris.test.mjs`

**Interfaces:**
- Produces: `longitudes(dateUtc: Date): Record<Body, number>` where `Body` ∈ {sun,moon,mercury,venus,mars,jupiter,saturn,uranus,neptune,pluto,northNode,earth}; returns ecliptic longitude in degrees [0,360).

- [ ] **Step 1: Choose + vendor** a Moshier ephemeris JS implementation into `hd/vendor/` (public-domain algorithm; no GPL). Record source + license in `hd/vendor/README.md`.
- [ ] **Step 2: Write failing test** — for a known instant, assert Sun longitude within 0.02° of a reference value (e.g. 2000-01-01T12:00Z → Sun ≈ 280.36°). Earth = (sun+180)%360; South Node = (northNode+180)%360.

```js
import test from 'node:test'; import assert from 'node:assert';
import { longitudes } from './ephemeris.mjs';
test('sun longitude at J2000 noon', () => {
  const l = longitudes(new Date('2000-01-01T12:00:00Z'));
  assert.ok(Math.abs(l.sun - 280.36) < 0.05, `got ${l.sun}`);
  assert.ok(Math.abs(((l.earth - l.sun + 540)%360) - 180) < 1e-6);
});
```

- [ ] **Step 3: Run** `node --test hd/ephemeris.test.mjs` → FAIL.
- [ ] **Step 4: Implement** `longitudes` over the vendored ephemeris.
- [ ] **Step 5: Run** → PASS.
- [ ] **Step 6: Commit** — `git add hd/ && git commit -m "feat(hd): ephemeris longitudes"`

### Task 14: Gate + line mapping

**Files:** Create `hd/gates.mjs`, `hd/gates.test.mjs`

**Interfaces:**
- Produces: `toGate(longitude: number): {gate:number, line:number}`. Wheel starts at Gate 41 at 302°00'00" ecliptic (2° Aquarius); 64 gates × 6 lines over 360°, gate order = the HD "wheel of gates" sequence (constant table in the module).

- [ ] **Step 1: Write failing test** — boundary + midpoint cases: longitude at wheel start returns `{gate:41,line:1}`; +0.9375° (one line) → `{gate:41,line:2}`; +5.625° (one gate) → next gate in the wheel sequence.
- [ ] **Step 2: Run** → FAIL.
- [ ] **Step 3: Implement** the 64-gate wheel array and modular mapping (each gate 5.625°, each line 0.9375°).
- [ ] **Step 4: Run** → PASS.
- [ ] **Step 5: Commit** — `git commit -am "feat(hd): gate/line wheel mapping"`

### Task 15: Design-time solar arc

**Files:** Modify `hd/chart.mjs` (new), `hd/chart.test.mjs`

**Interfaces:**
- Produces: `designInstant(birthUtc: Date): Date` — the UTC moment when the Sun was exactly 88° of arc before its birth longitude (iterative solve, ≈ 88 days earlier).

- [ ] **Step 1: Write failing test** — assert `sun(designInstant) ≈ (sun(birth) - 88 + 360) % 360` within 0.01°.
- [ ] **Step 2: Run** → FAIL.
- [ ] **Step 3: Implement** Newton/bisection on the Sun longitude using `longitudes`.
- [ ] **Step 4: Run** → PASS.
- [ ] **Step 5: Commit** — `git commit -am "feat(hd): 88-degree design instant"`

### Task 16: Type / Authority / Profile derivation

**Files:** Modify `hd/chart.mjs`, `hd/chart.test.mjs`; create `hd/tables.mjs` (channels → centers, gates → centers)

**Interfaces:**
- Produces: `chart(birth: {utc: Date}): {type, authority, profile}` where type ∈ {Manifestor, Generator, Manifesting Generator, Projector, Reflector}; authority ∈ {Emotional, Sacral, Splenic, Ego, Self-Projected, Mental, Lunar}; profile like `"1/3"`.
- Consumes: `longitudes`, `toGate`, `designInstant`.

- [ ] **Step 1: Encode tables** in `hd/tables.mjs` — 36 channels (gate-pair → the two centers they connect), gate→center map, 9 centers, motor centers, throat. Source from a standard HD reference; cite in a comment.
- [ ] **Step 2: Write failing tests** with 2–3 fixtures from well-documented public charts (e.g. a known celebrity birth data → published Type/Authority/Profile). Assert all three fields.

```js
test('known chart A → type/authority/profile', () => {
  const c = chart({ utc: new Date('YYYY-MM-DDTHH:MM:00Z') });
  assert.equal(c.type, 'Generator');
  assert.equal(c.authority, 'Sacral');
  assert.equal(c.profile, '1/3');
});
```

- [ ] **Step 3: Run** → FAIL.
- [ ] **Step 4: Implement** derivation: activate 26 gates (13 personality + 13 design incl. Earth/Nodes), complete channels, mark defined centers; Type from throat/motor/sacral connectivity rules; Authority by center priority (Solar Plexus > Sacral > Spleen > Heart > G > none→Mental/Lunar); Profile from Personality Sun/Earth line + Design Sun/Earth line.
- [ ] **Step 5: Run** → PASS on all fixtures.
- [ ] **Step 6: Commit** — `git commit -am "feat(hd): type/authority/profile derivation"`

### Task 17: Timezone + place resolution

**Files:** Modify `hd/chart.mjs`; create `hd/places.mjs`, `hd/places.test.mjs`

**Interfaces:**
- Produces: `toUtc(date:string, time:string, place:{lat,lon,tz}): Date` — local civil time → UTC using an IANA tz (historical DST aware). Place lookup returns `{lat,lon,tz}` from a bundled city list (start with major UK/global cities; expandable).

- [ ] **Step 1: Write failing test** — London 1990-06-01 12:00 (BST) → 11:00Z; a winter date → no DST offset.
- [ ] **Step 2: Run** → FAIL.
- [ ] **Step 3: Implement** using a tz library that honours historical rules (vendored or a small dependency documented in package.json). Echo the resolved UTC back for the UI to display.
- [ ] **Step 4: Run** → PASS.
- [ ] **Step 5: Commit** — `git commit -am "feat(hd): timezone/place resolution"`

### Task 18: Widget UI + integration

**Files:** Create `hd/widget.mjs`; modify `index.html`

**Interfaces:** Consumes `chart`, `toUtc`, `places`. Renders 3 steps (date · time · place) into `#hd-widget`, then the result (Type, Authority, Profile) with gentle framing + `Book your full reading` CTA → cal.com.

- [ ] **Step 1: Build** the stepper UI matching the reference form card (progress "1 of 3", inputs, Continue). On submit, resolve place → UTC → `chart`; render results.
- [ ] **Step 2: Loading + error states** — invalid/unknown city shows a helpful message and a "book a call instead" fallback.
- [ ] **Step 3: Wire** `<script type="module" src="hd/widget.mjs">` into `index.html`; remove the static fallback from Task 6.
- [ ] **Step 4: Verify in browser** — `browse` through the 3 steps with a known birth data, confirm the rendered big three match the module's tested output; `browse console --errors` clean.
- [ ] **Step 5: Commit** — `git commit -am "feat(hd): birth-detail widget + homepage integration"`

### Task 19: End-to-end verification

- [ ] **Step 1:** `node --test hd/` all green.
- [ ] **Step 2:** Full-page browser pass desktop + mobile; the first-glimpse widget computes and displays correctly, degrades to the book-a-call fallback on bad input.
- [ ] **Step 3:** Confirm no schema/meta regressions; word count still ≥ baseline.
- [ ] **Step 4: Commit** — `git commit -am "test(hd): end-to-end verification pass"`

---

## Self-Review (completed)

- **Spec coverage:** hero (T3), integration + co-equal pillars (T4), philosophy band no-Path-A/B (T5), HD big-three calc (T13–18), offerings (T7), reflections (T8), cal.com booking (T9), GEO FAQ/schema retention (T10, Global Constraints), final exhale (T11), palette/type/arch (T1), photos (placeholders + PHOTOS.md, real set from Clara). All mapped.
- **Placeholder scan:** image files are intentional placeholders pending Clara's meadow set, documented in `PHOTOS.md`; not plan placeholders. Test fixtures in T16/T17 require filling exact birth data + published results at execution time (flagged inline).
- **Type consistency:** `longitudes`, `toGate`, `designInstant`, `chart`, `toUtc` names consistent across tasks 13–18.

## Known follow-ups (out of scope)

- Real meadow photography (Clara generates; drop into `brand-assets/` per `PHOTOS.md`).
- Full HD bodygraph graphic (defined centers/channels visual).
- Applying the new aesthetic to interior pages (about, offers, quiz, articles).
