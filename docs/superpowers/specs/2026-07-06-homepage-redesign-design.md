# Homepage Redesign — Design Spec

Date: 2026-07-06
Author: Clara Louis (Somatic with Clara)

**Supersedes** the photo-parallax/numbered-section direction reviewed earlier the same day (design review artifact: https://claude.ai/code/artifact/c71e29cc-f95c-4411-95c4-33b6987c97c5). That direction was rejected as feeling like a generic "trendy agency template" — this spec keeps the section-by-section content structure and inner-page treatment tiers from that review, but replaces the visual system entirely.

## Purpose

Rebuild somaticwithclara.com so it feels unique, light, and unmistakably made by a specific person — not an AI-generated template. The site should state Clara's actual point of view on somatic work, drawn directly from her own thinking (see source notes below), rather than smoothed-over wellness marketing copy.

Source material this spec draws its philosophy and voice from:
- `/Users/clara/Claras-OS/AIS-OS/brainstorms/2026-07-06-content-map-somatic-center.md` — the spine (mind+body integration, attention as the listening faculty, "trust the body over the screen"), and the decision that Human Design is a named tool within the somatic practice, not a separate silo.
- `/Users/clara/Claras-OS/AIS-OS/brainstorms/2026-07-06-embodiment-skills-habits.md` — the personal, specific insight that somatic work isn't about achieving stillness/calm, but about building the reflex to notice a state (e.g. boredom-as-threat, stress-seeking) before acting it out.

**Branding stays as-is**: "Somatic with Clara" name, logo, and positioning are unchanged. This is not the personal "Clara" umbrella site referenced in the content-map brand pivot — it's the somatic offer, written in a much more specific and opinionated voice.

---

## Design System

**Palette & type — unchanged tokens:**
- `--ember: #DC5A22`, `--dark: #2A2117`, `--cream/--bg: #FBF5EA`
- Bricolage Grotesque (headings), Hanken Grotesk (body), Newsreader italic (margin notes and pull-quotes only)
- Honey and sage are dropped from this direction — ember is the single accent color, used sparingly (a rule, a link underline, a margin mark), never as a background wash.

**Base canvas:** Cream throughout, on every section, homepage and inner pages alike. No dark sections, no tinted photo backgrounds, no gradients.

**Texture, not gradient:** A very low-opacity paper-grain/fiber texture sits behind the whole page — barely perceptible, not a conscious design flourish. Section or content breaks that need a visual edge use a torn/deckled photo crop rather than a hard rectangle.

**Photos as detail, not hero:** No full-bleed backgrounds anywhere on the site. Photos are small-to-medium, cropped tight to one specific detail (a hand, fabric, light through a window), placed asymmetrically rather than filling a section — they read as artifact/evidence, not decoration.

**The margin annotation — signature device:** A narrower margin column runs alongside the main copy column, carrying a second, quieter voice in Newsreader italic — short, specific asides such as *"I used to think this meant staying still."* These are drawn directly from Clara's real reasoning (the content-map and embodiment notes above), not generic supporting copy. On mobile, margin notes collapse to sit directly beneath the line they annotate, styled distinctly (slightly muted, slight rotation) so they still read as "margin" rather than body text.

**Typography scale:** Bricolage Grotesque headings run larger and looser-tracked than the current site — masthead weight, not marketing-headline weight.

**Marks and rules:** Any arrow or divider mark (link suffixes, section breaks) uses plain characters (`—`, `/`, `→` at most) rather than geometric icon glyphs, so every mark on the page feels hand-placed rather than pulled from a component library.

---

## Section-by-Section Spec (index.html)

Current file: `/Users/clara/Desktop/Website builder/index.html`.

### Hero
- The existing scroll-scrubbed video mechanic (320vh scroll zone, JS-driven `currentTime`) is **kept** — it's a validated interactive moment, not part of what's being rejected.
- It stops being a full-bleed background. It becomes a small framed window — like a photograph held up to the page — inset beside or beneath a large Bricolage headline set directly on cream.
- No dark or tinted overlay on the frame; the video plays at natural color inside its frame.

### Section 01 — Definition
- Main copy column carries the reframed definition: experience needs mind and body together (body feels, mind interprets); most people are broken in one of two directions — overthinking past the feeling, or a body too loud to trust. Attention is named explicitly as the trainable skill that lets someone hear the signal at all.
- Margin annotation beside the copy: a short, specific "I used to think X" aside, sourced from the content-map/embodiment notes, not written fresh as marketing copy.
- One small, tightly-cropped detail photo (deckled edge), placed asymmetrically — not centered, not full-width.

### Section 02 — Services
- Same four offers as the current site: Somatic Coaching, Somatic Yoga, Human Design, Nervous System Community.
- Human Design is named and described directly as a tool Clara uses within the practice (not vague "energetic architecture" language) — per her explicit confirmation that HD can be named since it's a real tool she works with.
- Thin top-rule dividers between items, no card boxes, no background photo. One small detail photo threaded asymmetrically into the section (not per-item).

### About interlude
- Small cropped portrait (deckled edge, not a full-width split panel) + text.
- This is the site's heaviest use of the margin-note device: a genuinely personal aside naming that Clara still catches herself scattering into something new when a plan starts to feel boring — and that this is part of why the work is real to her, not theory she's relaying.
- Retains link to `about.html`.

### Section 03 — Testimonials
- Editorial pull-quote stack (large italic quote, thin ember left-border, small-caps citation), unchanged in concept from the earlier review.
- Sits on plain cream/paper texture — no tinted photo background.

### FAQ
- Editorial typography: bold question, muted answer directly beneath, thin top-rule divider between items, always expanded (no +/− toggle chrome). Unchanged from the earlier review — this treatment already fit the new direction.

### Section 04 — CTA
- Cream background (not a solid ember block). Bold heading, one ember rule as the only color accent.
- Margin note carries the supporting line about the discovery call, rather than standard body copy.

---

## Generic Elements — Redesigned Sitewide

Applies everywhere these appear, homepage and inner pages:

- **Testimonials** — editorial pull-quote stack. No cards, no auto-scroll carousels.
- **FAQ** — editorial typography, no accordion icons, always expanded.
- **CTA buttons** — primary: underline text-link (ember, small uppercase, arrow suffix, e.g. "Book a discovery call →"). Secondary: ghost rectangle (thin ink border, sharp corners, transparent background) — reads like a stamped ticket, not a SaaS pill button.
- **Icons** (◎ ◇ ○ hollow decorative icons currently used as dividers) — **removed sitewide, no replacement.** Whitespace and rules carry structural breaks. Any remaining mark uses plain characters per the Marks and rules note above.

---

## Voice & Content

The core change from the previous direction: the homepage states Clara's actual point of view rather than generic wellness language.

- **What somatic work is** is reframed around the spine: mind+body integration, attention as the specific listening skill, and the idea that most people are disconnected in one of two directions (overthinking, or a body too loud to trust).
- **What somatic work is *for*** is sharper than "calm and regulation" — it's building the reflex to notice a state before it's already been acted out (scattered into something new, gone numb, checked out), not achieving stillness. This claim comes directly from the embodiment-skills-habits notes.
- **"Trust the body over the screen"** appears once or twice sitewide (hero or CTA) as a plain, undecorated statement — not a slogan repeated everywhere.
- **Human Design** is named directly wherever it's discussed (Section 02, `offers.html`) as one of the tools Clara uses, not folded into vague language.
- This voice stays scoped to the somatic offer — it does not need to name AI or present the full personal-brand/three-pillar structure from the content-map notes; that belongs to the broader "Clara" umbrella pivot, which is a separate future project.

---

## Inner Pages — Treatment Tiers

| Page | Tier | What it gets |
|---|---|---|
| `index.html` | **Full** | All sections above |
| `about.html` | **Full** | Detail photos + margin annotations throughout — the most personal page, heaviest use of the margin-note device |
| `offers.html` | **Full** | Each offer (including Human Design, named directly) gets a text-led block with one small detail photo — not a photo/text split panel |
| `somatic-yoga.html` | **Medium** | Existing 9-section structure (from [somatic-yoga spec](2026-06-05-somatic-yoga-page-design.md)) stays intact; add margin annotations at 2 points, one small detail photo near the top |
| Quiz pages ×3 (`ns-works-quiz.html` + 2 others) | **Medium** | Plain cream header, no photo hero required, one margin note near the end-of-quiz CTA. Quiz logic/JS unchanged. |
| Article pages ×5 (`nervous-system-states.html`, `fawn-response.html`, `how-your-nervous-system-works.html`, + 2 more) | **Light** | Stay text-first for GEO/AI-citation readability. Add margin annotations sparingly. No photo hero, no other change — these stay clean for crawlers. |

---

## Photo Sourcing

- Photos needed are small detail shots (hands, fabric, light, texture, a tightly-cropped portrait for About) — not full-bleed lifestyle photography. This is a smaller, more specific photo list than the earlier photo-parallax direction required.
- Photos are not yet placed in the repo. Clara to select and add detail shots to `brand-assets/` (or a new `brand-assets/photos/` subfolder) before build begins.
- Until real photos are supplied, implementation should use labeled placeholder blocks at the correct small/asymmetric size and position, so sections are complete and easily swappable.

---

## File Checklist

- [ ] Detail photos selected and added to `brand-assets/` (Clara)
- [ ] Paper-grain texture asset created/sourced, applied sitewide at low opacity
- [ ] `index.html` hero reframed as inset video window (scroll-scrub JS unchanged)
- [ ] `index.html` sections 01–04 rebuilt: margin-annotation column, detail photos, no tint/no numerals
- [ ] About interlude rebuilt with heaviest margin-note use
- [ ] Testimonials redesigned as editorial pull-quote stack (sitewide component)
- [ ] FAQ redesigned as editorial typography, no icons (sitewide component)
- [ ] CTA buttons restyled: underline-link primary, ghost-rect secondary (sitewide component)
- [ ] All ◎ ◇ ○ decorative icons removed sitewide
- [ ] Homepage copy rewritten per Voice & Content section (spine language, HD named as tool)
- [ ] `about.html` — full margin-annotation + detail-photo treatment
- [ ] `offers.html` — full treatment, HD named directly, text-led offer blocks
- [ ] `somatic-yoga.html` — medium: 2 margin annotations + 1 detail photo added to existing structure
- [ ] Quiz pages ×3 — medium: plain header + 1 margin note near CTA, logic unchanged
- [ ] Article pages ×5 — light: margin annotations only, no other change
- [ ] Mobile margin-note collapse behavior tested
