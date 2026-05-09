---
name: clara-sage-midnight-brand
description: Clara's brand system. Sage & Midnight Ink palette — navy dark header/hero only, warm sage green as the primary accent, soft violet as the secondary accent, amber as a warm highlight, and cream/sage-light for light sections. Plus Jakarta Sans for all headings (soft weight, no uppercase), DM Sans body text, Permanent Marker handwritten script accents with slight rotation, pill-shaped CTA buttons, 16px rounded cards, decorative circle outlines. Grounded editorial warmth — somatic confidence meets softness. Use for landing pages, offers pages, community pages, lead magnets, and any web content for Clara's brand at the intersection of somatic work, Human Design, and identity — regulation as the doorway, not the destination. Trigger when user says "Clara's brand", "sage midnight brand", "sage and midnight ink", "Clara's brand system", "nervous system brand", "somatic brand", or references "that sage green and navy brand".
---

# Clara — Sage & Midnight Ink Brand System

**Vibe:** Grounded editorial warmth. Somatic confidence meets softness. Navy dark sections anchor the layout; sage green carries the energy; amber adds warmth; violet adds emotional resonance. Hand-drawn script keeps it human. Plus Jakarta Sans headings are light and open — intentionally not aggressive — balanced by the boldness of DM Sans labels and the playfulness of Permanent Marker.

**Use for:** Landing pages, offers pages, community pages, course pages, Skool pages, lead magnets, Substack headers, any web content for Clara's brand at the intersection of somatic work, Human Design, and identity — regulation as the doorway, not the destination.

**Community link:** https://www.skool.com/the-nervous-system-library-7770/about
**Community name:** Reclaim Your Life
**Community page:** reclaim-your-life.html

**Social:**
- Instagram: https://www.instagram.com/clara.holds.space/
- YouTube: https://www.youtube.com/channel/UC1Ew2V6Eg06v5syZQI9idyg
- TikTok: https://www.tiktok.com/@tobehuman.life

---

## Colors

| Purpose | Variable | Hex | Usage |
|---------|----------|-----|-------|
| Background | `--bg` | #EBF0E2 | Page background, light sections |
| White | `--white` | #FFFFFF | Card surfaces, text on dark/sage |
| Sage Light | `--sage-light` | #D8EDD0 | Warm alternating section backgrounds, tint fills, about hero gradient start |
| Sage | `--sage` | #7AAB6A | **Primary accent everywhere**: CTA buttons, card hover borders, bullet dots, active nav, section dividers, badges |
| Sage Dark | `--sage-dark` | #5A8A4A | Sage hover state, em emphasis in headings, deeper accents |
| Amber | `--amber` | #D4904A | Script accents on dark sections, nav hover, homepage divider, warm highlights |
| Cream | `--cream` | #F5F0E8 | Hero text on dark/video backgrounds, about hero gradient end, favicon background |
| Violet | `--violet` | #A87BAA | Secondary accent: badge pill borders, script on hero, offer tags |
| Violet Dark | `--violet-dark` | #7A5A80 | Violet hover state |
| Dark | `--dark` | #1A2035 | Hero/nav/CTA sections only — never full body section backgrounds |
| Text | `--text` | #2A2A2A | Headline text on light backgrounds |
| Body | `--body` | #3A3A3A | Body copy, descriptions, paragraphs |
| Muted | `--muted` | #888888 | Secondary text, labels, sub-labels |
| Faint | `--faint` | #BBBBBB | Tertiary text, connector lines |
| Line | `--line` | rgba(0,0,0,.08) | Card borders at rest on light backgrounds |

### Color Rules
- **Sage is the hero color.** Primary CTA buttons, dividers, card hovers, active nav links, section badges — sage appears everywhere.
- **Amber is the warmth color.** Used for script accents on dark backgrounds, homepage dividers, nav link hover. Pairs with cream to create the video hero palette.
- **Navy (`--dark`) is reserved for:** hero sections, fixed nav (scrolled state), sage CTA section backgrounds, and the footer. Never as a full body section background.
- **Section backgrounds alternate:** Off-white (#EBF0E2) → white (#FFFFFF) → sage-light (#D8EDD0) → cream (#F5F0E8) → bold sage (#7AAB6A for CTA sections).
- **About page hero:** `linear-gradient(160deg, #D8EDD0 0%, #F5F0E8 100%)` — sage-light to cream gradient (not navy).
- **Offers page hero / Reclaim page hero:** Same sage-to-cream gradient (light background = dark nav links before scroll).
- **Homepage hero:** Navy + video background with warm overlay: `linear-gradient(160deg, rgba(26,32,53,0.78) 0%, rgba(40,25,8,0.72) 100%)` + amber radial glow. Hero text uses `--cream`.
- **Sage CTA sections:** White circle outlines at 0.06–0.08 opacity, dark pill button for contrast.
- **Dividers:** 4px solid. Homepage uses `var(--amber)`; inner pages use `var(--sage)`.
- **Em tags in headings:** `color: var(--sage-dark); font-style: italic` — never font-style:normal.
- **Borders on cards:** 2px solid `var(--line)` at rest; `var(--sage)` on hover.
- **Box shadows on hover:** `rgba(122,171,106,.12)` on cards, `rgba(122,171,106,.3–.4)` on buttons.

---

## Typography

### Font Stack
```
Google Fonts import:
Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400
DM+Sans:ital,wght@0,300;0,400;0,500;0,700;1,300;1,400
Permanent+Marker
```

```html
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,700;1,300;1,400&family=Permanent+Marker&display=swap" rel="stylesheet">
```

| Role | Font | Weight | Size | Notes |
|------|------|--------|------|-------|
| **Hero H1** | Plus Jakarta Sans | 300 | clamp(28px, 5.5vw, 52px) | Light weight, no uppercase, letter-spacing -0.5px. Color: `--text` on light heroes, `--cream` on dark/video heroes. `em` tag: sage-dark italic. |
| **Section Titles** | Plus Jakarta Sans | 400–500 | clamp(26px, 4vw, 42px) | No uppercase. Line-height 1.15. Key word or phrase in sage-dark italic via `<em>`. |
| **Sub-headings / Card Titles** | Plus Jakarta Sans | 600 | 16–19px | Bold enough to lead a card without uppercase. |
| **Display Numbers** | Plus Jakarta Sans | 700 | clamp(28px, 4vw, 44px) | Proof numbers, prices, large stat displays. |
| **Script Accents** | Permanent Marker | 400 | clamp(18px, 3vw, 26px) | Hand-drawn marker style. `transform: rotate(-1.5deg)` standard. Color: `--amber` on dark sections, `--amber` on light heroes, sage-dark on sage-light sections. `font-style: normal` always. |
| **Body Copy** | DM Sans | 400 | 14–16px | Clean geometric sans. Line-height 1.75–1.85. |
| **Body Italic / Subtitles** | DM Sans | 300 italic | 14–17px | Hero subtitles, CTA body, card subtitles. Softness that balances the headings. |
| **Labels / Overlines** | DM Sans | 700 | 9–11px | Letter-spacing 2–3px, uppercase. Section labels, offer tags, card overlines. Color: `--muted` on light. |
| **Buttons** | Plus Jakarta Sans | 600 | 11–13px | Letter-spacing 1.5px, uppercase. Keeps visual weight without condensed font. |
| **Nav Links** | DM Sans | 700 | 11px | Letter-spacing 1.5px, uppercase. Dark on light heroes; rgba(255,255,255,.65) on dark/scrolled. |

### Typography Rules
- **No uppercase on headings.** Plus Jakarta Sans reads well in sentence case. Uppercase is reserved for buttons, labels, nav links, and tags only.
- **Em tags mean italic sage.** In all headings: `<em>` = `color: var(--sage-dark); font-style: italic`. Never `font-style: normal`.
- **Script accents replace bold moments.** Permanent Marker at -1.5deg rotation for the "something feels off" type moments. Always `font-style: normal`.
- **Body copy is DM Sans 400.** Never Plus Jakarta Sans for paragraphs.
- **Subtitles are DM Sans 300 italic.** This is a key brand distinction — creates breathing room.
- **DM Sans 700** for all overline labels, not 500.
- **Hero on dark background:** h1 `color: var(--cream)`, em `color: var(--sage)`.
- **Hero on light background:** h1 `color: var(--text)`, em `color: var(--sage-dark)`.

---

## Navigation

Fixed nav, transparent → navy on scroll. Logo swaps on scroll.

```css
#nav { position: fixed; top: 0; left: 0; right: 0; z-index: 100; padding: 20px 0;
       transition: background 0.35s ease, padding 0.35s ease; }
#nav.scrolled { background: var(--dark); padding: 12px 0; }
.nav-inner { max-width: 960px; margin: 0 auto; padding: 0 24px;
             display: flex; align-items: center; justify-content: space-between; }
```

**Before scroll on light hero (about, offers, reclaim pages):**
- Nav links: `color: rgba(42,42,42,.65)` — dark, readable on light
- Logo: `somatic-with-clara-logo.svg` (dark text version)
- Hamburger lines: `rgba(42,42,42,.6)`
- Hover: `color: var(--amber)`
- Active link: `color: var(--sage-dark)`

**Before scroll on dark/video hero (homepage):**
- Nav links: `color: rgba(255,255,255,.65)` — light, readable on dark
- Logo: `somatic-with-clara-logo-dark-transparent.svg` (cream text version)
- Hover: `color: var(--sage)`

**After scroll (all pages):**
- Background: `var(--dark)` navy
- Nav links: `rgba(255,255,255,.65)`
- Logo swaps to: `somatic-with-clara-logo-dark-transparent.svg`
- Active link: `color: var(--sage)`

**Logo swap JS (pages with light hero):**
```js
const nav = document.getElementById('nav');
const logo = document.getElementById('nav-logo');
window.addEventListener('scroll', () => {
  const scrolled = window.scrollY > 40;
  nav.classList.toggle('scrolled', scrolled);
  logo.src = scrolled
    ? 'brand-assets/somatic-with-clara-logo-dark-transparent.svg'
    : 'brand-assets/somatic-with-clara-logo.svg';
}, { passive: true });
```

**Nav order:** About · Work with Me · Community · [Take the Quiz — sage pill button]

---

## Layout Patterns

### Section Backgrounds (alternating)
1. **Off-white** (#EBF0E2) — page background, light content sections
2. **White** (#FFFFFF) — card surfaces, story sections, credentials
3. **Cream** (#F5F0E8) — warm alternating fill (used on homepage below hero)
4. **Sage light** (#D8EDD0) — Path B section, stack section, community cards
5. **Bold sage** (#7AAB6A) — CTA sections, discovery call sections
6. **Navy** (#1A2035) — hero only, nav scrolled, footer

### Decorative Circle Outlines
Always `border-radius: 50%`, `pointer-events: none`, partially off-edge. Never filled — outline only.

**On light sections:**
```css
border: 2–3px solid var(--sage); opacity: .06–.10; width/height: 140–300px;
```

**On dark/navy sections:**
```css
border: 3px solid var(--sage);   opacity: .06–.08;
border: 2px solid var(--violet); opacity: .08–.09;
```

**On sage CTA sections:**
```css
border: 4px solid rgba(255,255,255,.06–.08); width/height: 160–260px;
```

### Containers
- **Narrow:** `max-width: 680px` for text-heavy single-column content
- **Wide:** `max-width: 960px` for standard grids
- **Extra wide:** `max-width: 1100px` for 2-column offer layouts

### Section Padding
- Desktop: `padding: 80px 24px`
- Hero: `padding: 140px 24px 80px` (accounts for fixed nav)
- Mobile: `padding: 100px 16px 60px` for heroes

---

## Site Pages

| Page | File | Hero type | Notes |
|------|------|-----------|-------|
| Homepage | `index.html` | Dark + video | hero-video.mp4, amber divider |
| About | `about.html` | Sage-to-cream gradient | Logo swap JS, dark nav links before scroll |
| Work with Me | `offers.html` | Sage-to-cream gradient | 2-col layout: cards left, bodygraph right |
| Quiz | `quiz.html` | Dark navy | Canonical quiz with landing screen |
| Community | `reclaim-your-life.html` | Off-white | Full landing page |

---

## Component Patterns

### Buttons

**Sage CTA (primary):**
```css
font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 600;
font-size: 12–13px; letter-spacing: 1.5px; text-transform: uppercase;
color: #fff; background: var(--sage); padding: 16–18px 40–44px; border-radius: 50px;
box-shadow: 0 6px 24px rgba(122,171,106,.3);
hover: background var(--sage-dark); transform: translateY(-3px) scale(1.02);
```

**Dark CTA (on sage sections):**
```css
font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 600;
color: #fff; background: var(--dark); padding: 16–18px 40–44px; border-radius: 50px;
box-shadow: 0 6px 24px rgba(0,0,0,.2);
hover: transform: translateY(-3px);
```

**Small nav CTA (quiz button in nav):**
```css
padding: 10px 24px; font-size: 11px; /* inherits .btn-sage */
```

**Button shape is always full pill** (`border-radius: 50px`). Primary hover includes `scale(1.02)`.

### Offer Cards
```css
background: #fff; border-radius: 16px; border: 2px solid var(--line);
padding: 26–32px 22–28px; display: flex; flex-direction: column;
hover: border-color var(--sage); transform: translateY(-4px);
box-shadow: 0 10px 32px rgba(122,171,106,.12);
```
- **Signature card:** `border-color: var(--sage)` at rest, subtle sage gradient background
- **Price:** Plus Jakarta Sans 700, sage color
- **Title:** Plus Jakarta Sans 600
- **Tag:** DM Sans 700, 9px, uppercase, violet border (or sage-dark for signature)
- **CTA:** Small sage pill button, `padding: 11–12px 22–28px`

### Badge / Pill Tag
```css
font-family: 'DM Sans'; font-size: 9px; font-weight: 700;
letter-spacing: 2px; text-transform: uppercase;
color: var(--violet); border: 2px solid var(--violet);
padding: 4–5px 12–14px; border-radius: 50px;
```

### Content Cards (process arc, stack)
```css
background: #fff; border-radius: 16px; border: 2px solid var(--line);
padding: 28px 24px;
hover: border-color var(--sage); transform: translateY(-4px);
box-shadow: 0 8px 24px rgba(122,171,106,.12);
```
- **Number badge:** 40px circle, sage background, Plus Jakarta Sans 600 13px white

### Credential / Milestone List
```css
.cred-item { display: flex; align-items: flex-start; gap: 14px;
  padding: 16px 20px; background: #fff; border-radius: 12px;
  border: 2px solid var(--line); }
.cred-dot { width: 10px; height: 10px; border-radius: 50%; background: var(--sage); }
```

### Dividers
```css
height: 4px; background: var(--sage); border: none; /* inner pages */
height: 4px; background: var(--amber); border: none; /* homepage only */
```

### Scroll Reveal
```css
.reveal { opacity: 0; transform: translateY(20px);
  transition: opacity 0.8s cubic-bezier(0.16,1,0.3,1),
              transform 0.8s cubic-bezier(0.16,1,0.3,1); }
.reveal.visible { opacity: 1; transform: translateY(0); }
.d1 { transition-delay: 0.1s; } .d2 { transition-delay: 0.2s; }
.d3 { transition-delay: 0.3s; } .d4 { transition-delay: 0.4s; }
```
Triggered by IntersectionObserver at `threshold: 0.12`.

---

## Logos & Favicon

All logos in `brand-assets/`:

| File | Use |
|------|-----|
| `somatic-with-clara-logo.svg` | Dark text — nav before scroll on light-hero pages, footer on light pages |
| `somatic-with-clara-logo-dark-transparent.svg` | Cream/light text — nav on dark-hero pages, nav after scroll all pages, footer |
| `somatic-with-clara-logo-dark.svg` | Dark variant (secondary) |
| `somatic-with-clara-symbol.svg` | Symbol/mark only — amber spiral, source file |
| `favicon.png` | 80×80 favicon — amber spiral on cream rounded square |
| `favicon-32.png` | 32×32 favicon — same design |

**Favicon link (all pages):**
```html
<link rel="icon" type="image/png" sizes="32x32" href="brand-assets/favicon-32.png">
<link rel="icon" type="image/png" sizes="80x80" href="brand-assets/favicon.png">
<link rel="apple-touch-icon" href="brand-assets/favicon.png">
```

**Nav logo height:** 40px in nav, 28px in footer (opacity .4)

---

## CSS Variables (Copy-Paste Ready)

```css
:root {
  --bg:           #EBF0E2;
  --white:        #FFFFFF;
  --sage-light:   #D8EDD0;
  --sage:         #7AAB6A;
  --sage-dark:    #5A8A4A;
  --amber:        #D4904A;
  --cream:        #F5F0E8;
  --violet:       #A87BAA;
  --violet-dark:  #7A5A80;
  --dark:         #1A2035;
  --text:         #2A2A2A;
  --body:         #3A3A3A;
  --muted:        #888888;
  --faint:        #BBBBBB;
  --line:         rgba(0,0,0,.08);
}
```

---

## Google Fonts Import (Copy-Paste Ready)

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,700;1,300;1,400&family=Permanent+Marker&display=swap" rel="stylesheet">
```

---

## React / JSX Color Object (Copy-Paste Ready)

```js
const C = {
  bg:         "#EBF0E2",        // page background, light sections
  white:      "#FFFFFF",        // card surfaces
  sageLight:  "#D8EDD0",        // warm alt section backgrounds, hero gradient start
  sage:       "#7AAB6A",        // primary accent — buttons, highlights, dividers
  sageDark:   "#5A8A4A",        // sage hover, em emphasis
  amber:      "#D4904A",        // script accents on dark, nav hover, homepage divider
  cream:      "#F5F0E8",        // hero text on dark, hero gradient end
  violet:     "#A87BAA",        // secondary accent — badges, tags
  violetDk:   "#7A5A80",        // violet hover
  dark:       "#1A2035",        // hero, nav, footer
  text:       "#2A2A2A",        // headline text on light
  body:       "#3A3A3A",        // body copy
  muted:      "#888888",        // secondary / label text
  faint:      "#BBBBBB",        // tertiary / connector lines
  line:       "rgba(0,0,0,.08)", // card borders at rest
};
```

---

## Brand Voice

- **Warm, direct, non-preachy.** Written like a DM, not a textbook.
- **No clinical jargon without explanation.** Always define terms in plain language first.
- **Short paragraphs.** Never more than 3 sentences per bullet.
- **Validates before educates.** The reframe always comes before the teaching.
- **Lead with the felt experience, not the framework.** "Something feels off" before "nervous system regulation".
- **No "free" language** until a paid tier is confirmed and launched.
- **Key terminology:** window of tolerance, survival states, dysregulation, somatic practices, co-regulation, Path B, identity gap, regulation as a doorway.
- **Avoid:** "calm down", "just breathe", "healing journey", "nervous system regulation" as the primary hook.
- **Human Design language:** Clara is a 3/5 Splenic Projector on the Cross of the Maya. Channels 57-10 (instinctual intuition, improvements to form) and 18-58 (logical pattern recognition). Gate 39 (provocation, initiating). Designed to see others' patterns and name what's been hidden.

---

## What This Brand Is NOT

- No uppercase on headings — Plus Jakarta Sans in sentence case only. Uppercase reserved for buttons, labels, nav, tags.
- No Anton or condensed display fonts — replaced entirely by Plus Jakarta Sans.
- No `font-style: normal` on em tags — all em in headings use italic.
- No rounded-rectangle buttons — always full 50px pill radius.
- No hairline dividers — section dividers are 4px solid.
- No 1px borders on cards — always 2px minimum.
- No card shadows at rest — shadow only on hover.
- No dark navy (#1A2035) as a body section background — hero, nav, footer only.
- No "free community" language until paid tier is ready.
- No leading with "nervous system regulation" as the primary hook — felt experience first.
- No generic wellness pastels — sage and violet are intentionally present and saturated.
- No gradients for section backgrounds (except the about/offers/reclaim hero which uses sage-to-cream).
- No centered body text — always left-aligned.
- No app references (Somatic Pause App) on public-facing pages until the app is live.

---

## Image Prompt Keywords

```
warm sage green and navy aesthetic, soft editorial typography,
cream and sage-light backgrounds, amber accent highlights,
Plus Jakarta Sans light weight headings, hand-drawn marker script,
pill buttons, sage circle outline decorations,
grounded somatic wellness brand, editorial confident warmth,
nervous system regulation visual language, body-based healing,
soft off-white and cream backgrounds, solid flat color blocks,
bold yet nurturing brand energy, somatic practitioner brand
```
