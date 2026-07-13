# Homepage Real-Photo Redesign — Design Spec

Date: 2026-07-13
Author: Clara Louis (Somatic with Clara)

**Supersedes** the field-notes direction (`docs/superpowers/specs/2026-07-06-homepage-redesign-design.md`, implemented on the `homepage-field-notes-redesign` branch). That branch was fully built, reviewed, and passing all checks — but when Clara viewed it live, it read as "heavily AI-made," the opposite of what was intended. This spec starts over with a different visual system.

## What went wrong with field-notes (for the record)

The field-notes direction was built to avoid a *different* failure mode — the generic full-bleed-photo-parallax "trendy agency template" look — by going minimal: pale cream backgrounds, small placeholder photo boxes, a quiet italic "margin note" device, thin ghosted numerals, lots of whitespace. In practice this combination (desaturated minimalism + labeled placeholder rectangles instead of real photos + one repeating two-column component pattern down the whole page) is itself a very recognizable "unfinished AI-generated landing page" signature — arguably more so than the thing it was trying to avoid.

The two reference sites Clara originally shared — **Studio Airi** and **Sammy's "Sacred Rebirth"** — were never the problem. They were always meant as *positive* references for what "not AI-made" looks like: real, specific, richly-photographed, confidently typeset. The earlier pivot away from them was a misread.

## Purpose

Rebuild the somaticwithclara.com homepage using **real photography Clara has on hand**, bold confident typography, and section-to-section visual variety — closer to the register of Airi/Sammy, but built around Clara's own images (indoor self-practice photos + personal travel photos) rather than imitating those sites directly.

## Design System

**Photography — real, not placeholder.** Every section that needs an image uses one of Clara's actual photos, in a large asymmetric split (~55–60% of the section width), alternating sides section to section. No labeled placeholder boxes anywhere.

Two photo sets, both used throughout (per Clara's direction — mixed, not siloed):
- **Practice photos** (indoor, soft natural light, sage/neutral tones): seated self-hug, hands clasped, forward fold, reclined stretch. Used where the content is about the work itself.
- **Travel/personality photos** (outdoor, varied, adventurous): Mexico City street art, a decorated cow statue, a checkered marble courtyard, walking toward Mayan ruins. Used where the content is about Clara as a person.

**Typography — existing brand fonts, used bigger and bolder.** Bricolage Grotesque (headlines, 700–800 weight, large scale) + Hanken Grotesk (body). This was tested head-to-head against introducing a new serif (Playfair Display) using a live mockup with real photos — Clara chose to keep Bricolage Grotesque. No Newsreader, no margin-note device.

**Color — tinted from the photo, not a flat cream wash.** Each section's background carries a subtle gradient tint pulled from that section's own photo (sage-green for practice-photo sections, warm terracotta/tan for travel-photo sections), rather than one repeating cream tone everywhere. Ember (`#DC5A22`) stays the single true accent color (links, eyebrow labels, small marks) — same token as the existing brand.

**Numerals and labels — bold and visible, not ghosted.** Where sections are numbered (e.g. the services list), the numeral is solid, confidently sized (~48px, Bricolage Grotesque 800 weight), not a low-opacity watermark.

**Buttons — solid, not thin underline links.** Primary: filled ember button. Secondary: solid dark outline/ghost button. Bolder and more physical than a text-underline link, matching the rest of the page's confidence.

## Section-by-Section Spec (index.html)

Validated via a live browser mockup (real photos, real copy, actual layout) before writing this spec — Clara confirmed the direction on sight.

### Hero
- **Static photo**, not the previous scroll-scrubbed video mechanic. Photo: reclined/leaning stretch shot (dynamic, at-ease energy).
- Asymmetric split: photo ~56%, text ~44%, eyebrow + large Bricolage Grotesque headline ("slow is a skill. let's practice it.") + supporting line, on cream.

### Section 01 — Definition
- Reversed side (text left, photo right this time, for alternating rhythm).
- Photo: seated self-hug shot.
- Background: subtle ember-tinted gradient over bone (`#F3EADB`).
- Copy carries forward from the field-notes voice work: mind+body integration, attention named as the trainable skill (see Voice & Content below).

### Section 02 — Services
- Full-width section (no photo split here — this section is about the 4-item list itself).
- Background: sage-tinted gradient over `--sage-light` (`#E6EAD7`).
- Each service gets a bold, solid (not ghosted) numeral (01.–04.) beside its name/description. Same four services as before: Somatic Coaching, Somatic Yoga, Human Design (named directly as a tool Clara uses), Nervous System Community.

### About interlude
- Reversed side (photo left, text right).
- Photo: candid genuine-smile shot (the pink-bench travel photo) — chosen specifically because it's an unposed, caught-off-guard moment, which reads as more real than a composed portrait.
- Copy carries forward: the personal margin-note content from field-notes (catching herself scattering when things get boring) moves into the main About copy here as a direct sentence, not a separate quiet-aside device (since the margin-note device itself is dropped).

### Testimonials
- Bold pull-quote treatment (kept from field-notes — this wasn't part of the problem), but each quote is now paired with a small real photo rather than floating alone on plain cream, giving the section visual presence.

### FAQ
- Unchanged from field-notes: editorial typography, bold question + plain answer, no accordion icons. Not part of what read as AI-made.

### CTA
- Dark background (`--dark`), photo split: the Mayan-ruins walking shot (adventurous, "start of a journey" energy) paired with "Not sure where to begin?" copy.
- Solid ember primary button ("Book a discovery call"), solid outline secondary button ("See all offers").

## Generic Elements — Sitewide

- **Testimonials:** bold pull-quote + small real photo pairing (see above).
- **FAQ:** editorial typography, no icons (carried forward).
- **Buttons:** solid ember primary / solid dark-outline secondary (replaces field-notes' underline-link style).
- **Icons:** still none — decorative icon removal was an independent simplification, not part of the AI-made complaint. No reason to reintroduce ◎ ◇ ○.

## Voice & Content (carried forward from field-notes — not part of what needed fixing)

- Definition copy names attention as the trainable listening skill and reframes mind+body integration, per the content-map/embodiment-skills-habits brainstorm notes.
- Human Design is named directly as "one of the tools I actually use," not vague energetic-architecture language.
- The About section's personal note (catching herself scattering when a plan gets boring) stays, now written directly into the main copy rather than as a separate margin device.

## Inner Pages — Treatment Tiers (carried forward)

| Page | Tier | What it gets |
|---|---|---|
| `index.html` | **Full** | All sections above |
| `about.html`, `offers.html` | **Full** | Same real-photo asymmetric-split treatment, Human Design named directly on `offers.html` |
| `somatic-yoga.html`, quiz pages ×3 | **Medium** | Photo hero (real photo, not placeholder) + a couple of photo/text breaks |
| Article pages ×5 | **Light** | Stay text-first for GEO/AI-citation readability; a styled real-photo header, minimal else |

## Photo Inventory

Available now, in `/Users/clara/Downloads/Photos/` (JPG/HEIC) — need to be copied into `brand-assets/` before implementation:

| File | Content | Assigned to |
|---|---|---|
| `IMG_0911.jpg` | Reclined/leaning stretch, dynamic ease | Hero |
| `IMG_0825.jpg` | Seated self-hug, crossed arms, calm | Section 01 Definition |
| `IMG_0949.HEIC` | Candid genuine smile, pink bench (Mexico City) | About interlude |
| `IMG_1380.HEIC` | Walking toward Mayan ruins, adventurous | CTA |
| `IMG_0884.jpg` | Hands clasped, contemplative | Available for testimonial pairing or inner pages |
| `IMG_0910.jpg` | Forward fold, hands on ankles | Available for Services section or inner pages |
| `IMG_0935.HEIC` | Decorated cow statue (Mexico City) | Available for About/personality moments on inner pages |
| `IMG_0986.HEIC` | Checkered marble courtyard, walking away | Available for inner pages / future sections |

More photos will likely be needed for full sitewide coverage (About/offers pages, inner pages) — this inventory covers the homepage only for now.

## File Checklist

- [ ] Copy the 8 photos (converting HEIC → JPG) from `/Users/clara/Downloads/Photos/` into `brand-assets/`
- [ ] Update `index.html` `:root` — no new tokens needed, reuse existing ember/dark/cream/sage tokens
- [ ] Rebuild hero as static-photo asymmetric split (remove scroll-scrub video markup/JS/CSS entirely — this is a real removal, not a preserve-and-reframe like the previous attempt)
- [ ] Rebuild Section 01 Definition with self-hug photo, reversed split
- [ ] Rebuild Section 02 Services with bold visible numerals, sage-tinted background
- [ ] Rebuild About interlude with candid-smile photo, direct personal copy (no margin-note device)
- [ ] Rebuild Testimonials as pull-quote + small photo pairing
- [ ] FAQ: this build starts from current `main` (the field-notes branch was never merged) — `main`'s existing FAQ markup is already accordion-free with plain question/answer pairs, so it only needs typography/scale polish to match the new bold system, not a structural rebuild
- [ ] Rebuild CTA with pyramid-walk photo on dark background, solid buttons sitewide
- [ ] Remove old `.testimonial-track`/`.quote-card` carousel CSS if not already removed
- [ ] Verify no decorative icons anywhere
- [ ] Mobile responsive check for every asymmetric split (lesson from the field-notes build: fixed-width columns need explicit breakpoints — use `fr`-based or percentage columns that degrade gracefully by default, avoid the two-fixed-column-widths mistake from before)
- [ ] Visual check against real photos rendering correctly (not just placeholder-shaped checks)
