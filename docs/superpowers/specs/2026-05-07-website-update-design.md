# Website Update — Design Spec
**Date:** 2026-05-07
**Scope:** Five pages — homepage, quiz landing, about, offers, community landing

---

## Overview

Update somaticwithclara.com to reflect new brand direction and business positioning. The core shift: from nervous system regulation as the hook to the identity gap ("who you've been surviving as vs. who you actually are") as the entry point. Regulation is demoted to methodology — the felt experience leads.

**Funnel:** YouTube → Quiz → Email sequence → Offers → Paid Skool (when app is live)

---

## Brand System

**Replaces:** Plus Jakarta Sans + soft sage palette (current `index.html`)
**New system:** Sage & Midnight Ink (from `brand-assets/clara-sage-midnight-brand-SKILL (1).md`)

### Fonts (Google Fonts)
```html
<link href="https://fonts.googleapis.com/css2?family=Anton&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,700;1,300;1,400&family=Permanent+Marker&display=swap" rel="stylesheet">
```
- **Anton** — all headlines, uppercase always, tight line-height
- **DM Sans** — body copy, subtitles, labels
- **Permanent Marker** — script accents with slight rotation, never italic

### CSS Variables
```css
:root {
  --bg: #EBF0E2;
  --white: #FFFFFF;
  --sage-light: #D4E8D8;
  --sage: #5B9A6E;
  --sage-dark: #3D7A55;
  --violet: #7B5EA7;
  --violet-dark: #5A4080;
  --dark: #1A2035;
  --text: #2A2A2A;
  --body: #3A3A3A;
  --muted: #888888;
  --faint: #BBBBBB;
  --line: rgba(0,0,0,.08);
}
```

### Color Rules
- **Navy (`--dark`):** Hero/header sections ONLY. Never as a body section background.
- **Sage (`--sage`):** Primary accent everywhere — buttons, dividers, badges, highlights
- **Violet (`--violet`):** Secondary accent — takeaway blocks, badge outlines
- Section backgrounds alternate: off-white → white → sage-light → bold sage (for CTA sections)
- 4px solid sage dividers between sections (no hairlines)
- No ticker bar on any page

### Buttons
- **Primary (sage):** `background: #5B9A6E; color: #fff; border-radius: 50px; font-family: Anton; text-transform: uppercase;`
- **Secondary (dark):** `background: #1A2035; color: #fff; border-radius: 50px;`
- Always full pill shape, never square or rounded-rectangle
- Hover: lift 3px + scale(1.02) on primary

### Decorative Circles
- Outline only (never filled), scattered at section edges, pointer-events: none
- Light sections: `border: 2–3px solid #5B9A6E; opacity: .06–.10`
- Dark/hero sections: sage + violet circles at low opacity
- Sage CTA sections: `border: 4px solid rgba(255,255,255,.07)`

---

## Page 1 — Homepage (`index.html`)

**Goal:** Discovery and orientation. One primary CTA: the quiz.

### Nav
- Logo left, links right: About | Work with Me | Quiz
- Transparent on load, navy background on scroll, sage underline on active link

### Hero (navy background)
- Permanent Marker script label: *"something feels off"* (rotate -2deg, sage)
- Anton headline: *"THERE'S WHO YOU'VE BEEN SURVIVING AS. AND WHO YOU ACTUALLY ARE."*
- DM Sans 300 italic subline: *"Most people never find out there's a difference."*
- Single sage pill CTA: "TAKE THE QUIZ"
- Decorative sage + violet circles

### Problem Section (off-white)
- Addresses legitimacy gap directly
- Anton headline: *"NOT IN CRISIS. NOT THRIVING."*
- DM Sans body: functioning on the outside, quietly disconnected inside. Nothing wrong enough to warrant support — and why that feeling is the barrier, not the truth.

### Process Arc (alternating sage-light / white cards)
Five steps, each as a card:
1. See the pattern — the quiz names what the body keeps returning to
2. Regulate in the moment — meet the body where it is
3. Return to ventral, choose — regulation creates a window for real choice
4. Name what's actually there — Human Design maps what was always underneath
5. Live from that place — Path B. Not a prescribed outcome.

### Offer Preview (sage CTA section)
- Brief intro to three entry points: quiz, visualisation tracks, HD report
- Dark pill CTA: "SEE ALL OFFERS" → `offers.html`

### Footer
- Links: About | Work with Me | Quiz | Instagram | YouTube

---

## Page 2 — Quiz Landing (prepended to `nervous_system_state_quiz_v2.html`)

**Goal:** One job — get her to take the quiz. No nav, no footer.

### Structure
Short intro screen rendered above the existing quiz content:
- Navy hero background
- Permanent Marker script: *"something feels off"*
- Anton headline: *"FIND OUT WHICH PATTERN YOUR BODY KEEPS RETURNING TO"*
- DM Sans body (1–2 lines): *"It's not a personality flaw. It's a survival pattern. The quiz names it."*
- Reassurance line (DM Sans muted): *"Takes 3 minutes."*
- Single sage pill CTA: "TAKE THE QUIZ" — smooth-scrolls to existing quiz start (implementation: wrap existing quiz content in `<div id="quiz-start">` and scroll to it)
- Decorative circles on navy background

No methodology language. No framework explanation. Hook only.

---

## Page 3 — About (`about.html`)

**Goal:** Build trust and connection. Opens with the legitimacy gap. Closes with quiz CTA.

### Nav
Same as homepage.

### Hero (navy)
- Permanent Marker script: *"about clara"* (rotate -1deg, violet)
- Anton headline: *"YOU DON'T NEED SOMETHING TO BE WRONG ENOUGH."*

### Legitimacy Gap Section (off-white)
- DM Sans body: functioning fine on the outside, quietly not yourself. The feeling that nothing is wrong enough to warrant support — and why that feeling is the barrier, not the truth.

### Her Story (white)
From old About page — childhood survival mode, doing what was expected, staying small. Moving to London, chasing dreams, body still frozen. The turning point: discovering the nervous system. Reframe: her body wasn't resisting her — it lacked safety to receive what she wanted.

### Path B Section (sage-light)
- Permanent Marker script accent
- What becomes available when regulation creates a window. Not a prescribed outcome — an open question about what becomes possible.

### Credentials (white)
Simple clean list — no table, no grid. Just names:
- The Core Rising® Method
- Somatic Coaching (Academia Coaching Somático)
- Somatic Yoga (300hr)
- Angelic Reiki Practitioner
- PSYCH-K® Basic & Advanced
- Human Design & Gene Keys

### CTA Section (sage background)
- Anton headline: *"THE QUIZ IS WHERE IT STARTS."*
- DM Sans italic: *"Five minutes. Your result is instant."*
- Sage dark pill CTA: "TAKE THE QUIZ" → quiz landing

### Footer
Same as homepage.

---

## Page 4 — Offers (`offers.html`)

**Goal:** Clear presentation of the offer stack. Discovery call is primary CTA for high-touch offers.

**All prices in USD.**

### Nav
Same as homepage.

### Hero (navy)
- Anton headline: *"WORK WITH CLARA"*
- DM Sans 300 italic subline: *"Each offer is a different entry point into the same work."*

### Offer Cards (off-white background, white cards)
Four cards, each with: price badge, title, description, CTA.

**Card 1 — $97 Personalised Visualisation Tracks**
A guided audio recording built around you: your name, your vision, your Human Design type. Sensory, grounded, specific to your central belief block. Available in English, French, or Spanish.
CTA: "ENQUIRE" → `mailto:hello@somaticwithclara.com`

**Card 2 — $135 HD Report & Clarity Call**
Your Human Design patterns named in plain language — what you're designed for, where you've been operating against your nature, and what becomes available when you stop. Includes an optional 30-minute call within 15 days.
CTA: "ENQUIRE" → `mailto:hello@somaticwithclara.com`

**Card 3 — $90 / $320 Somatic Sessions**
Individual sessions or a package. The body does the real reading. Discovery call required before booking.
CTA: "BOOK A DISCOVERY CALL" → Pensight link

**Card 4 — $400+ HD + Somatic** *(signature — visually distinct)*
Report first, then somatic sessions. The chart gives the map. The body does the real reading. Discovery call required.
CTA: "BOOK A DISCOVERY CALL" → Pensight link

### Discovery Call Section (sage CTA background)
For the two offers requiring a call (Somatic Sessions + HD + Somatic).
- Anton headline: *"NOT SURE WHERE TO START?"*
- DM Sans body: brief description of discovery call — 30 minutes, no pressure, find the right fit.
- Dark pill CTA: "BOOK A DISCOVERY CALL" → `https://pensight.com/x/tobehuman/meeting-08a5b21e-3b8b-4945-b1d7-2e3a9dc11d17`

### Footer
Same as homepage.

---

## Page 5 — Community Landing (`reclaim_landing.html`)

**Goal:** Convert visitors to Skool community members. Quiz is the entry point but Skool is the destination CTA.

**Targeted amendments only** — structure and most content preserved.

### Changes

1. **Hero CTA** — Keep Skool link. Update button text: "Take the quiz and join" → "JOIN THE COMMUNITY" (remove "free" implication from text)
2. **Hero summary** — "understand why" → "name what's been happening"
3. **Hero badge** — "Nervous System Community" → "something feels off" (experience-based, not methodology)
4. **Ticker** — Remove: "NERVOUS SYSTEM REGULATION", "WINDOW OF TOLERANCE". Keep: "RECLAIM YOUR LIFE", "YOUR BODY IS NOT THE ENEMY", "BIOLOGY NOT CHARACTER", "PATH B EXISTS", "REGULATE FIRST", "SOMATIC HEALING"
5. **App references** — Remove from: editorial cards section (remove app card entirely), stack section (remove app item), how-it-works steps (update step 3 away from app)
6. **Stack section** — Restructure to: Quiz → Regulation practices → Identity work arc. Remove app item.
7. **"Free" language** — Remove all instances: no "free community", no "free entry", no pricing that implies free
8. **Final CTA buttons** — Keep Skool link throughout

### Sections preserved unchanged
Pain section, before/after benefits, intro section, comparison (WVW), FAQ, final CTA, story section, footer.

---

## Files Summary

| File | Action | Notes |
|------|--------|-------|
| `index.html` | Full update | Same layout, new brand + copy |
| `nervous_system_state_quiz_v2.html` | Prepend landing | Short hero screen added before quiz |
| `about.html` | New file | |
| `offers.html` | New file | |
| `reclaim_landing.html` | Targeted amendments | 7 specific changes |

---

## Copy Guardrails (apply across all pages)

- Lead with the felt experience, not the framework
- Never use "nervous system regulation" as the hook
- Never use "healing journey" framing
- No specific outcome promises — offer the question, not the result
- No "free community" language until paid tier is ready
- Legitimacy gap addressed on every page that has body copy
- "Path B" language used on homepage, about, and community pages
- All prices in USD
