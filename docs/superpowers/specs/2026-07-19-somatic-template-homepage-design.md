# Homepage Redesign — "Luminous" Template Recreation for Somatic with Clara

**Date:** 2026-07-19
**Branch:** homepage-real-photo-redesign
**File touched:** `index.html` (single self-contained static page, served by `serve.mjs`)

## Overview

Recreate the calm, editorial "Luminous Embodiment" reference site
(`nimble-luminous-body-flow.base44.app`) as the new Somatic with Clara homepage,
adapted to Clara's brand, philosophy, offerings, and GEO strategy. This replaces
the current bold-grotesque/saturated-ember homepage with a soft, serif,
warm-neutral aesthetic.

Keep the reskin already in place (Newsreader serif + Hanken Grotesk, lightened
clay accent, no hard divider rules) and rebuild the page structure to match the
reference.

## Goals

1. Match the reference's *feel*: full-bleed photographic hero, serif display with
   roman/italic, arch-topped images, muted palette, whitespace, quiet dividers.
2. Keep Human Design and somatic/nervous-system work as **co-equal pillars**
   (per Clara's decision), but write the somatic copy in Clara's real philosophy
   language, not the template's generic lines.
3. Ship a **real Human Design "big three" calculator** (Type · Authority ·
   Profile) as the interactive "first glimpse," computed client-side.
4. **Retain GEO assets** — definitional copy, FAQ, and schema — restyled into the
   new aesthetic, so AI-citation ranking is protected.
5. Photography theme: **wild meadow garden**, Clara in frame, cohesive set.

## Non-goals

- Full Human Design bodygraph graphic (defined centers/channels visual). MVP is
  the big three only; full chart is a later enhancement.
- Rebuilding interior pages (about, offers, quiz, resource articles). This spec is
  the homepage only. Interior pages get the new aesthetic in a later pass.
- Any backend service. The site stays static (`serve.mjs` serves files); all
  interactivity is client-side or links out (cal.com).

## Copy principles (from philosophy doc)

Voice comes from `philosophy and framework summary.pdf`. Use Clara's actual
framing:

- "The nervous system is not a problem to fix... its patterns are the accumulated
  logic of survival."
- "Regulation is the doorway, not the destination."
- "You cannot think your way to calm" / bottom-up, the body is the entry point.
- **Do NOT use the internal "Path A / Path B" vocabulary** on the public site.

## Page structure (top → bottom)

### 1. Nav (light, over hero)
Transparent over the hero photo, dark text; solidifies to a soft bone background
on scroll. Keep existing links and destinations (About → about.html, Work with Me
→ offers.html, Community → reclaim-your-life.html, Resources dropdown, Take the
Quiz → quiz.html). Logo left. Restyle from the current dark bar to the reference's
light treatment.

### 2. Hero (full-bleed)
- Background: full-bleed **meadow hero photo** (shot 1), soft overlay for text
  legibility.
- Eyebrow: `Somatic Coaching · Human Design`
- H1 (serif, roman + italic): *"Come home to your own rhythm."*
- Sub: *"Nervous-system work and Human Design, together — so the body can feel
  safe enough to live the way it was always meant to."*
- CTA: `Begin here` → anchors to the discovery-call section.

### 3. The integration (two arch images)
- Eyebrow: `The integration`
- H2: *"Your body knows. Your design illuminates."*
- **01 · The Body — "Feel what is true":** *"Your nervous system is not a problem
  to fix. Somatic work goes bottom-up, through sensation and breath, until the
  body feels safe enough to soften. You cannot think your way to calm — the body
  has to feel it."* (arch image, shot 2)
- **02 · The Design — "See how you're made":** *"Human Design maps your energy,
  your decisions, and your natural way of moving. Not a personality label — a
  language for how you're actually built."* (arch image, shot 3)
- Closing line: *"Together, they turn understanding into something you live — not
  another idea to hold, but a truth you can feel."*
- CTA: `Book a discovery call`

### 4. Philosophy band (replaces template gap; signature moment)
Quiet full-width band (soft dove or pale clay). Plain-language, no Path A/B:
> *"Your patterns are not flaws. They are the accumulated logic of survival —
> what your body learned to keep you safe. Regulation is the doorway, not the
> destination: when the system feels safe enough, it can move, connect, create,
> and live fully again."*

### 5. A first glimpse (Human Design big-three calculator)
- On a soft dove panel (like the reference's "Meet your energetic nature").
- Eyebrow: `A first glimpse`
- H2: *"Meet your energetic nature."*
- Sub: *"Share your birth details for a preliminary read on your Human Design — a
  gentle beginning, not a definition of who you are."*
- Interactive multi-step form → computes and displays the big three. See
  "Human Design module" below.

### 6. Offerings
Clara's four offerings, restyled into the calm editorial list (kept from current
site): Somatic Coaching, Somatic Yoga, Human Design, Nervous System Community.
Serif names, italic clay numerals, links to existing pages.

### 7. Reflections (testimonials)
The three existing testimonials (Myke P., Fontanna W., YouTube viewer), styled as
italic serif pull-quotes on soft cards. This is the reference's "Reflections" nav
item made real.

### 8. A space to be met (booking)
- Eyebrow: `The sacred session`
- H2: *"A space to be met."*
- Sub: *"A complimentary 30-minute call. We'll sense into where you are and
  whether this work is a fit — no pressure, no performance."*
- **cal.com inline embed** styled to match (clara-louis/discovery-call), with a
  styled fallback button if the embed fails to load.

### 9. Approach + FAQ (GEO retention)
Restyle and keep:
- The definitional lead paragraph ("Somatic work starts from one idea...").
- The 4 existing FAQ Q&As (What is somatic yoga? / How is somatic coaching
  different from therapy? / Can somatic work help with anxiety, burnout...? /
  Where does it take place?).
- All three existing JSON-LD schema blocks (Person, HealthAndBeautyBusiness,
  FAQPage) preserved verbatim.
- The "Last updated" freshness signal.

### 10. A final exhale (closing clay block)
- Full-bleed muted-clay block, cream serif.
- Eyebrow: `A final exhale`
- H2 (serif italic): *"You do not need to become more. You can become more you."*
- CTA: `Begin with a conversation` → cal.com.

### 11. Footer
Reference-style: quiet, `Somatic Coaching · Human Design`, existing footer links
and socials, copyright.

## Design system

- **Type:** Newsreader (serif display, roman + italic, weights 400–600) + Hanken
  Grotesk (body, labels).
- **Palette (Clara's clay, lightened toward the reference):**
  - Backgrounds: bone `#F6F1E7`, cream `#FBF5EA`
  - Panels: dove `#E4E9E6`, pale sand `#EFE7D8`
  - Accent: clay `#C89574`; hover/links deeper clay `#B0774F`
  - Text: espresso `#2A2117`; body warm brown `#4A3E2F`; muted `#6E6051`
  - Closing block: clay `#C08A66` with cream text
- **Motifs:** arch-topped images (`border-radius: 190px 190px 16px 16px`), 16px
  rounded images elsewhere, soft floating panels, tracked-caps eyebrows with
  `NN ·` numerals, quiet reveal-on-scroll (kept from current).
- **Dividers:** none (whitespace + tonal shifts).

## Human Design module (big-three calculator)

**Output:** Type (Manifestor / Generator / Manifesting Generator / Projector /
Reflector), Inner Authority, and Profile (e.g. 1/3).

**Inputs (3-step form):** birth date · birth time · birth place (city →
lat/long + timezone).

**Method (client-side):**
1. Resolve birth place to coordinates + historical timezone; convert local birth
   time to UTC.
2. Compute ecliptic longitudes of Sun, Moon, Mercury, Venus, Mars, Jupiter,
   Saturn, Uranus, Neptune, Pluto, North Node, South Node, Earth for:
   - **Personality:** the birth moment.
   - **Design:** the moment the Sun was 88° of solar arc earlier (≈ 88 days
     before birth) — solve by iteration.
3. Map each longitude to the Human Design gate wheel (64 gates, wheel starts at
   Gate 41 at 2°00'00" Aquarius) → gate + line.
4. Derive defined centers from activated gates and the channels they complete;
   derive Type and Authority from the standard center-definition rules; derive
   Profile from the Personality Sun/Earth line and Design Sun/Earth line.
5. Render the big three with gentle framing + CTA to a full reading / discovery
   call.

**Ephemeris choice:** use a **Moshier-based JavaScript ephemeris** (no license
fee, arc-second accuracy — more than enough for gate boundaries) rather than
Swiss Ephemeris (GPL, licensing friction for a commercial site). Bundle locally;
no external API call.

**Risks / accuracy:**
- Timezone/DST for historical dates is the main accuracy risk; wrong tz can shift
  the Design date and flip a Type. Use a robust tz database lookup and show the
  resolved UTC time back to the user for confidence.
- Gate-boundary edge cases near a line cusp: acceptable for a "preliminary"
  framing; the copy already sets it as a gentle beginning, not a definition.
- Keep the calculator a self-contained module (its own script section) so it can
  be tested independently and swapped without touching page layout.

## GEO / SEO retention

- Preserve all JSON-LD schema blocks unchanged.
- Keep definitional + FAQ text on the page (sections 9), restyled.
- Keep canonical, hreflang, OG/Twitter meta, `last-modified`.
- Net word count should not drop below the current homepage; the template's
  sparseness is applied to *layout*, not to removing indexed content.

## Photography — wild meadow shot list

Constants: Clara in frame; wild meadow / wildflowers (soft golds, whites, dusty
pinks, lavender); linen / cream / earthy natural-fibre wardrobe; soft diffused
golden-hour light; airy negative space; calm, unposed.

1. **Hero (landscape, full-bleed):** seated or standing in tall wildflowers, eyes
   closed, hand on chest, open sky, space around her.
2. **01 The Body (portrait, arch):** hands in tall grass / on belly,
   sensation-focused, face soft or turned down.
3. **02 The Design (portrait, arch):** looking up / across the meadow,
   contemplative, light on the face.
4. **First-glimpse detail (small):** a single wildflower in hand / botanical
   close-up (no face needed).
5. **A space to be met (portrait):** open welcoming posture, half-smile, among the
   flowers.
6. **Final exhale (wide, optional):** small in a wide meadow at dusk, or pure
   meadow texture for the closing block.

Clara generates these; filenames drop into `brand-assets/`. Build uses sensible
placeholders + documented filenames until the real set arrives.

## Open questions / decisions already made

- HD prominence: **co-equal pillars** (decided).
- Interactive taster: **real big-three calc** (decided).
- GEO: **keep, restyled** (decided).
- Photo theme: **wild meadow** (decided).
- Path A/B vocabulary: **excluded from public copy** (decided).

## Implementation notes

- Single `index.html`, inline `<style>` and `<script>`, matching the current file's
  structure. The HD ephemeris + calc may live in a separate local JS file loaded
  by `index.html` to keep the module isolated and testable.
- Reuse existing reveal-on-scroll, nav scroll, mobile-nav scripts.
- Verify against `localhost:3002` with the browse tool at each milestone.
