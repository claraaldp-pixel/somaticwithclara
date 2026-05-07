# Website Update Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Update five pages to the Sage & Midnight Ink brand and new Path B / identity-gap copy direction.

**Architecture:** All pages are standalone HTML files with inline styles. No build system. Brand CSS variables and component patterns are copy-pasted into each file. The quiz file already uses the new brand system — its landing prepend is additive only.

**Tech Stack:** HTML, CSS, vanilla JS. Local dev server: `node serve.mjs` at `http://localhost:3000`. No test framework — verification is visual in browser.

---

## Shared Brand CSS Block

Copy this exact block into every `<style>` tag. Referenced as **[BRAND CSS]** in tasks below.

```css
/* ── Brand: Sage & Midnight Ink ─────────────────── */
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
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; overflow-x: hidden; }
body { font-family: 'DM Sans', sans-serif; background: var(--bg); color: var(--body); -webkit-font-smoothing: antialiased; overflow-x: hidden; }

/* Divider */
.divider { height: 4px; background: var(--sage); border: none; }

/* Section containers */
.narrow { max-width: 680px; margin: 0 auto; padding: 0 24px; }
.wide { max-width: 960px; margin: 0 auto; padding: 0 24px; }

/* Typography */
.section-label { font-family: 'DM Sans', sans-serif; font-size: 9px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; color: var(--muted); display: block; margin-bottom: 12px; }
.section-title { font-family: 'Anton', sans-serif; font-weight: 400; font-size: clamp(28px,4vw,42px); color: var(--text); line-height: 1.1; text-transform: uppercase; margin-bottom: 40px; }
.section-title em { color: var(--sage); font-style: normal; }

/* Buttons */
.btn-sage {
  display: inline-block; font-family: 'Anton', sans-serif; font-size: 13px;
  letter-spacing: 1.5px; text-transform: uppercase; color: #fff;
  background: var(--sage); padding: 16px 40px; border-radius: 50px; border: none;
  text-decoration: none; cursor: pointer;
  box-shadow: 0 6px 24px rgba(91,154,110,.3);
  transition: background 0.25s ease, transform 0.25s ease, box-shadow 0.25s ease;
}
.btn-sage:hover { background: var(--sage-dark); transform: translateY(-3px) scale(1.02); box-shadow: 0 10px 36px rgba(91,154,110,.4); }

.btn-dark {
  display: inline-block; font-family: 'Anton', sans-serif; font-size: 13px;
  letter-spacing: 1.5px; text-transform: uppercase; color: #fff;
  background: var(--dark); padding: 16px 40px; border-radius: 50px; border: none;
  text-decoration: none; cursor: pointer;
  box-shadow: 0 6px 24px rgba(0,0,0,.2);
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}
.btn-dark:hover { transform: translateY(-3px); box-shadow: 0 10px 36px rgba(0,0,0,.3); }

/* Nav */
#nav {
  position: fixed; top: 0; left: 0; right: 0; z-index: 100;
  padding: 20px 0;
  transition: background 0.35s ease, box-shadow 0.35s ease, padding 0.35s ease;
}
#nav.scrolled {
  background: var(--dark);
  box-shadow: 0 1px 0 rgba(255,255,255,.06);
  padding: 12px 0;
}
.nav-inner { max-width: 960px; margin: 0 auto; padding: 0 24px; display: flex; align-items: center; justify-content: space-between; }
.nav-link {
  font-family: 'DM Sans', sans-serif; font-size: 11px; font-weight: 700;
  letter-spacing: 1.5px; text-transform: uppercase; text-decoration: none;
  color: var(--text); transition: color 0.2s ease;
}
#nav.scrolled .nav-link { color: rgba(255,255,255,.65); }
.nav-link:hover { color: var(--sage); }
#nav.scrolled .nav-link:hover { color: #fff; }
.nav-cta { /* inherits .btn-sage but smaller */
  padding: 10px 24px; font-size: 11px;
}

/* Hero (dark) */
.hero-dark {
  background: var(--dark); position: relative; overflow: hidden;
  padding: 120px 24px 80px; text-align: center;
}
.hero-script {
  font-family: 'Permanent Marker', cursive; font-size: clamp(18px,3vw,26px);
  color: var(--violet); display: inline-block;
  transform: rotate(-1.5deg); margin-bottom: 12px;
}
.hero-h1 {
  font-family: 'Anton', sans-serif; font-weight: 400;
  font-size: clamp(28px,5.5vw,52px); line-height: 1.05;
  text-transform: uppercase; letter-spacing: -0.3px; color: #fff; margin-bottom: 20px;
}
.hero-h1 em { color: var(--sage); font-style: normal; }
.hero-sub {
  font-family: 'DM Sans', sans-serif; font-size: 16px; font-weight: 300;
  font-style: italic; color: rgba(255,255,255,.55); line-height: 1.8;
  max-width: 520px; margin: 0 auto 36px;
}

/* Decorative circles */
.circ {
  position: absolute; border-radius: 50%; pointer-events: none;
}
/* Usage: <div class="circ" style="width:280px;height:280px;border:3px solid var(--sage);opacity:.08;top:-80px;right:-80px;"></div> */

/* Scroll reveal */
.reveal { opacity: 0; transform: translateY(20px); transition: opacity 0.8s cubic-bezier(0.16,1,0.3,1), transform 0.8s cubic-bezier(0.16,1,0.3,1); }
.reveal.visible { opacity: 1; transform: translateY(0); }
.d1 { transition-delay: 0.1s; } .d2 { transition-delay: 0.2s; }
.d3 { transition-delay: 0.3s; } .d4 { transition-delay: 0.4s; }

/* Footer */
.site-footer { background: var(--dark); padding: 36px 24px; }
.footer-inner { max-width: 960px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px; }
.footer-links { display: flex; gap: 24px; flex-wrap: wrap; }
.footer-link { font-family: 'DM Sans', sans-serif; font-size: 12px; color: rgba(255,255,255,.4); text-decoration: none; transition: color 0.2s; }
.footer-link:hover { color: rgba(255,255,255,.85); }
.footer-copy { font-family: 'DM Sans', sans-serif; font-size: 11px; color: rgba(255,255,255,.2); }

@media (max-width: 680px) {
  .narrow, .wide { padding: 0 16px; }
  .hero-dark { padding: 100px 16px 60px; }
}
```

---

## Task 1 — Homepage (`index.html`) Full Rewrite

**Files:**
- Modify: `index.html`

### Step 1.1 — Replace `<head>` up to `</style>`

- [ ] Replace everything from `<head>` through `</style>` (lines 1–465 in current file) with:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Somatic with Clara — There's who you've been surviving as. And who you actually are.</title>
  <meta name="description" content="For women who are functioning on the outside and quietly disconnected inside. The quiz names the pattern. The work begins there." />
  <meta name="author" content="Clara Louis" />
  <link rel="canonical" href="https://somaticwithclara.com/" />
  <link rel="alternate" hreflang="en" href="https://somaticwithclara.com/" />
  <link rel="alternate" hreflang="fr" href="https://somaticwithclara.com/fr/" />
  <link rel="alternate" hreflang="es-419" href="https://somaticwithclara.com/es/" />
  <link rel="alternate" hreflang="x-default" href="https://somaticwithclara.com/" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://somaticwithclara.com/" />
  <meta property="og:title" content="Somatic with Clara" />
  <meta property="og:description" content="There's who you've been surviving as. And who you actually are." />
  <meta property="og:image" content="https://somaticwithclara.com/og-image.jpg" />
  <meta name="twitter:card" content="summary_large_image" />
  <script type="application/ld+json">
  {"@context":"https://schema.org","@type":"Person","name":"Clara Louis","jobTitle":"Somatic Coach & Human Design Guide","url":"https://somaticwithclara.com","email":"hello@somaticwithclara.com","sameAs":["https://www.instagram.com/clara.holds.space/","https://www.youtube.com/channel/UC1Ew2V6Eg06v5syZQI9idyg"]}
  </script>
  <script>window.va=window.va||function(){(window.vaq=window.vaq||[]).push(arguments);};</script>
  <script defer src="/_vercel/insights/script.js"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Anton&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,700;1,300;1,400&family=Permanent+Marker&display=swap" rel="stylesheet">
  <style>
    /* [BRAND CSS — paste full block from top of this plan] */

    /* ── Process arc cards ── */
    .process-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 16px; }
    .process-card {
      background: var(--white); border-radius: 16px; border: 2px solid var(--line);
      padding: 28px 24px; transition: transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
    }
    .process-card:hover { transform: translateY(-4px); border-color: var(--sage); box-shadow: 0 8px 24px rgba(91,154,110,.12); }
    .process-num {
      width: 40px; height: 40px; border-radius: 50%; background: var(--sage); color: #fff;
      font-family: 'Anton', sans-serif; font-size: 14px; display: flex; align-items: center;
      justify-content: center; margin-bottom: 16px;
    }
    .process-card h3 { font-family: 'Anton', sans-serif; font-size: 17px; text-transform: uppercase; color: var(--text); margin-bottom: 8px; line-height: 1.2; }
    .process-card p { font-family: 'DM Sans', sans-serif; font-size: 13px; color: var(--body); line-height: 1.75; }

    /* ── Testimonials (vertical scroll) ── */
    .testimonials-viewport { overflow: hidden; height: 520px; -webkit-mask-image: linear-gradient(to bottom,transparent 0%,black 10%,black 90%,transparent 100%); mask-image: linear-gradient(to bottom,transparent 0%,black 10%,black 90%,transparent 100%); }
    .testimonial-track { display: flex; flex-direction: column; gap: 16px; animation: scrollUp linear infinite; }
    @keyframes scrollUp { 0% { transform: translateY(0); } 100% { transform: translateY(-50%); } }
    .quote-card { background: #fff; border-radius: 16px; border: 2px solid var(--line); padding: 24px; }
    .quote-card.sage { background: var(--sage); border-color: var(--sage); }
    .quote-mark { font-family: 'Anton', sans-serif; font-size: 36px; line-height: 0.6; color: var(--sage-light); display: block; margin-bottom: 12px; }
    .quote-card.sage .quote-mark { color: rgba(255,255,255,.3); }
    .quote-text { font-family: 'DM Sans', sans-serif; font-size: 14px; line-height: 1.75; color: var(--text); margin-bottom: 12px; }
    .quote-card.sage .quote-text { color: rgba(255,255,255,.9); }
    .quote-attr { font-family: 'DM Sans', sans-serif; font-size: 10px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: var(--muted); }
    .quote-card.sage .quote-attr { color: rgba(255,255,255,.5); }

    /* ── Mobile nav ── */
    #mobile-nav { display: none; background: var(--dark); padding: 20px 24px 28px; border-top: 1px solid rgba(255,255,255,.06); }
    #mobile-nav.open { display: block; }
    #mobile-nav .nav-link { font-size: 15px; letter-spacing: 0; text-transform: none; color: rgba(255,255,255,.7); display: block; padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,.06); }
  </style>
</head>
```

### Step 1.2 — Replace `<body>` through end of `</nav>` (lines 467–510)

- [ ] Replace the nav block with:

```html
<body>
<!-- NAV -->
<nav id="nav">
  <div class="nav-inner">
    <a href="/" aria-label="Somatic with Clara — home">
      <img src="brand-assets/Logo.png" alt="Somatic with Clara" style="height:34px;width:auto;display:block;" />
    </a>
    <div style="display:flex;align-items:center;gap:32px;" class="desktop-nav">
      <a href="about.html" class="nav-link">About</a>
      <a href="offers.html" class="nav-link">Work with Me</a>
      <a href="nervous_system_state_quiz_v2.html" class="btn-sage nav-cta">Take the Quiz</a>
    </div>
    <button id="ham" aria-label="Open menu" style="background:none;border:none;cursor:pointer;padding:8px;display:none;">
      <span style="display:block;width:22px;height:2px;background:rgba(255,255,255,.7);margin-bottom:5px;transition:all 0.3s;"></span>
      <span style="display:block;width:22px;height:2px;background:rgba(255,255,255,.7);margin-bottom:5px;transition:opacity 0.3s;"></span>
      <span style="display:block;width:22px;height:2px;background:rgba(255,255,255,.7);transition:all 0.3s;"></span>
    </button>
  </div>
  <div id="mobile-nav">
    <a href="about.html" class="nav-link">About</a>
    <a href="offers.html" class="nav-link">Work with Me</a>
    <a href="nervous_system_state_quiz_v2.html" class="btn-sage" style="display:block;margin-top:20px;text-align:center;">Take the Quiz</a>
  </div>
</nav>
<style>
@media (max-width:680px) { .desktop-nav { display:none !important; } #ham { display:flex !important; } }
</style>
```

### Step 1.3 — Replace hero section (lines 512–569)

- [ ] Replace the existing hero `<section>` block with:

```html
<!-- HERO -->
<section class="hero-dark" style="padding-top:140px;padding-bottom:100px;text-align:center;">
  <div class="circ" style="width:300px;height:300px;border:3px solid var(--sage);opacity:.08;top:-80px;right:-80px;"></div>
  <div class="circ" style="width:160px;height:160px;border:2px solid var(--violet);opacity:.09;bottom:-50px;left:-50px;"></div>
  <div class="circ" style="width:90px;height:90px;border:2px solid var(--sage);opacity:.06;top:40px;left:12%;"></div>
  <div style="max-width:760px;margin:0 auto;position:relative;z-index:1;">
    <div class="hero-script">something feels off</div>
    <h1 class="hero-h1">There's who you've been<br/>surviving as.<br/>And who you <em>actually</em> are.</h1>
    <p class="hero-sub">Most people never find out there's a difference.</p>
    <a href="nervous_system_state_quiz_v2.html" class="btn-sage">Take the Quiz</a>
    <p style="font-family:'DM Sans',sans-serif;font-size:11px;color:rgba(255,255,255,.3);margin-top:14px;">Takes 3 minutes. Your pattern is named instantly.</p>
  </div>
</section>
<hr class="divider" />
```

### Step 1.4 — Replace marquee + bridge quote + about sections (lines 572–655)

- [ ] Delete the marquee strip, bridge quote section, and about section entirely.
- [ ] Insert the Problem (legitimacy gap) section and Process Arc section in their place:

```html
<!-- PROBLEM SECTION -->
<section style="background:var(--bg);padding:80px 24px;">
  <div class="narrow" style="text-align:center;">
    <span class="section-label reveal">The real barrier</span>
    <h2 class="section-title reveal d1">Not in crisis.<br/>Not <em>thriving.</em></h2>
    <p class="reveal d2" style="font-family:'DM Sans',sans-serif;font-size:16px;font-weight:300;font-style:italic;color:var(--body);line-height:1.85;max-width:560px;margin:0 auto 24px;">
      Functioning on the outside. Quietly disconnected inside. Performing a life that doesn't quite feel like yours.
    </p>
    <p class="reveal d3" style="font-family:'DM Sans',sans-serif;font-size:15px;color:var(--body);line-height:1.8;max-width:560px;margin:0 auto;">
      The thing that keeps most women from getting support isn't the severity of what they're experiencing — it's the belief that nothing is wrong <em>enough</em>. That thought is the barrier. Not the truth.
    </p>
  </div>
</section>
<hr class="divider" />

<!-- PROCESS ARC -->
<section style="background:var(--white);padding:80px 24px;">
  <div class="wide">
    <div style="text-align:center;margin-bottom:48px;">
      <span class="section-label reveal">How the work moves</span>
      <h2 class="section-title reveal d1" style="text-align:center;">Five steps.<br/><em>One direction.</em></h2>
    </div>
    <div class="process-grid">
      <div class="process-card reveal">
        <div class="process-num">01</div>
        <h3>See the pattern</h3>
        <p>The quiz names the default pattern — the state your body keeps returning to when things get hard. Recognition is the beginning.</p>
      </div>
      <div class="process-card reveal d1">
        <div class="process-num">02</div>
        <h3>Regulate in the moment</h3>
        <p>Tools that meet your body where it actually is — not generic practices, but something matched to right now.</p>
      </div>
      <div class="process-card reveal d2">
        <div class="process-num">03</div>
        <h3>Return to ventral, choose</h3>
        <p>Regulation creates a window. In that window, real choice becomes available — not reaction, not performance. Choice.</p>
      </div>
      <div class="process-card reveal d3">
        <div class="process-num">04</div>
        <h3>Name what's actually there</h3>
        <p>Human Design maps what was always underneath the survival pattern — the design that predates the coping.</p>
      </div>
      <div class="process-card reveal d4">
        <div class="process-num">05</div>
        <h3>Live from that place</h3>
        <p>Path B. Not a prescribed outcome. An open question about what becomes possible when you stop surviving as someone else.</p>
      </div>
    </div>
  </div>
</section>
<hr class="divider" />
```

### Step 1.5 — Replace the services section (lines 660–758)

- [ ] Delete the existing services card grid section.
- [ ] Insert the Offer Preview section:

```html
<!-- OFFER PREVIEW -->
<section style="background:var(--sage);padding:80px 24px;text-align:center;position:relative;overflow:hidden;">
  <div class="circ" style="width:260px;height:260px;border:4px solid rgba(255,255,255,.07);top:-70px;right:-70px;"></div>
  <div class="circ" style="width:160px;height:160px;border:4px solid rgba(255,255,255,.06);bottom:-50px;left:-50px;"></div>
  <div style="max-width:640px;margin:0 auto;position:relative;z-index:1;">
    <span class="section-label reveal" style="color:rgba(255,255,255,.5);">Where to start</span>
    <h2 class="section-title reveal d1" style="color:#fff;text-align:center;">There's an entry point<br/>for where you are now.</h2>
    <p class="reveal d2" style="font-family:'DM Sans',sans-serif;font-size:15px;font-weight:300;font-style:italic;color:rgba(255,255,255,.7);line-height:1.85;margin-bottom:36px;">
      From the quiz that names your pattern, to personalised visualisation tracks, to a full Human Design + Somatic arc. Each offer is a different depth of the same work.
    </p>
    <a href="offers.html" class="btn-dark reveal d3">See All Offers</a>
  </div>
</section>
<hr class="divider" />
```

### Step 1.6 — Replace testimonials section (lines 763–886)

- [ ] Replace the testimonials section with a version using the new brand colors:

```html
<!-- TESTIMONIALS -->
<section style="background:var(--bg);padding:80px 24px;overflow:hidden;">
  <div style="text-align:center;margin-bottom:48px;">
    <span class="section-label reveal">What women say</span>
    <h2 class="section-title reveal d1" style="text-align:center;">Words from the women<br/><em>in this space.</em></h2>
  </div>
  <div style="max-width:860px;margin:0 auto;">
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px;" class="testimonials-grid">
      <div style="display:flex;flex-direction:column;gap:16px;">
        <div class="testimonials-viewport" style="height:480px;">
          <div class="testimonial-track" style="animation-duration:22s;">
            <div class="quote-card sage"><span class="quote-mark">"</span><p class="quote-text">I never experienced something like this. Clara's style amplified the effect — things become clear with Clara. It opened a portal to feelings in a very subtle way.</p><p class="quote-attr">— Myke P.</p></div>
            <div class="quote-card"><span class="quote-mark">"</span><p class="quote-text">Thank you Clara. It helped to lessen anxiety and stress. Now feeling so much calmer.</p><p class="quote-attr">— Guided practice review</p></div>
            <div class="quote-card"><p class="quote-text">I am through a hard time and this really helped me.</p><p class="quote-attr">— YouTube viewer</p></div>
            <div class="quote-card sage"><span class="quote-mark">"</span><p class="quote-text">I never experienced something like this. Clara's style amplified the effect — things become clear with Clara. It opened a portal to feelings in a very subtle way.</p><p class="quote-attr">— Myke P.</p></div>
            <div class="quote-card"><span class="quote-mark">"</span><p class="quote-text">Thank you Clara. It helped to lessen anxiety and stress. Now feeling so much calmer.</p><p class="quote-attr">— Guided practice review</p></div>
            <div class="quote-card"><p class="quote-text">I am through a hard time and this really helped me.</p><p class="quote-attr">— YouTube viewer</p></div>
          </div>
        </div>
      </div>
      <div style="display:flex;flex-direction:column;gap:16px;">
        <div class="testimonials-viewport" style="height:480px;">
          <div class="testimonial-track" style="animation-duration:28s;">
            <div class="quote-card"><span class="quote-mark">"</span><p class="quote-text">I would highly recommend Clara and somatic coaching as an easy way to stay grounded and build self trust when feeling emotions.</p><p class="quote-attr">— Fontanna W.</p></div>
            <div class="quote-card"><p class="quote-text">Very helpful guided body scan. Gentle.</p></div>
            <div class="quote-card"><p class="quote-text">Thank you, this helped me settle.</p></div>
            <div class="quote-card"><span class="quote-mark">"</span><p class="quote-text">I would highly recommend Clara and somatic coaching as an easy way to stay grounded and build self trust when feeling emotions.</p><p class="quote-attr">— Fontanna W.</p></div>
            <div class="quote-card"><p class="quote-text">Very helpful guided body scan. Gentle.</p></div>
            <div class="quote-card"><p class="quote-text">Thank you, this helped me settle.</p></div>
          </div>
        </div>
      </div>
      <div style="display:flex;flex-direction:column;gap:16px;">
        <div class="testimonials-viewport" style="height:480px;">
          <div class="testimonial-track" style="animation-duration:18s;">
            <div class="quote-card"><span class="quote-mark">"</span><p class="quote-text">Moving through some emotions this morning and this has come at a perfect time. Moving through these now. Thank you.</p><p class="quote-attr">— YouTube viewer</p></div>
            <div class="quote-card"><p class="quote-text">wow....it works</p></div>
            <div class="quote-card sage"><p class="quote-text">Things become clear with Clara.</p><p class="quote-attr">— Somatic coaching client</p></div>
            <div class="quote-card"><span class="quote-mark">"</span><p class="quote-text">Moving through some emotions this morning and this has come at a perfect time. Moving through these now. Thank you.</p><p class="quote-attr">— YouTube viewer</p></div>
            <div class="quote-card"><p class="quote-text">wow....it works</p></div>
            <div class="quote-card sage"><p class="quote-text">Things become clear with Clara.</p><p class="quote-attr">— Somatic coaching client</p></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
<style>@media(max-width:680px){.testimonials-grid{grid-template-columns:1fr!important}}</style>
<hr class="divider" />
```

### Step 1.7 — Replace CTA + footer (lines 892–965)

- [ ] Replace the existing CTA section and footer with:

```html
<!-- CTA -->
<section style="background:var(--dark);padding:80px 24px;text-align:center;position:relative;overflow:hidden;">
  <div class="circ" style="width:280px;height:280px;border:3px solid var(--sage);opacity:.07;top:-80px;right:-80px;"></div>
  <div class="circ" style="width:160px;height:160px;border:2px solid var(--violet);opacity:.09;bottom:-50px;left:-50px;"></div>
  <div style="max-width:620px;margin:0 auto;position:relative;z-index:1;">
    <div class="hero-script reveal" style="color:var(--sage);">where it begins</div>
    <h2 class="reveal d1" style="font-family:'Anton',sans-serif;font-weight:400;font-size:clamp(28px,5vw,48px);text-transform:uppercase;color:#fff;line-height:1.05;margin-bottom:20px;">
      The quiz is<br/>where you start.
    </h2>
    <p class="reveal d2" style="font-family:'DM Sans',sans-serif;font-size:15px;font-weight:300;font-style:italic;color:rgba(255,255,255,.55);line-height:1.8;margin-bottom:36px;">
      Three minutes. Your pattern is named instantly. Most people have a moment of recognition when they see their result.
    </p>
    <a href="nervous_system_state_quiz_v2.html" class="btn-sage reveal d3">Take the Quiz</a>
  </div>
</section>

<!-- FOOTER -->
<footer class="site-footer">
  <div class="footer-inner">
    <img src="brand-assets/Logo.png" alt="Somatic with Clara" style="height:28px;filter:brightness(0) invert(1);opacity:.4;" />
    <div class="footer-links">
      <a href="about.html" class="footer-link">About</a>
      <a href="offers.html" class="footer-link">Work with Me</a>
      <a href="nervous_system_state_quiz_v2.html" class="footer-link">Quiz</a>
      <a href="https://www.instagram.com/clara.holds.space/" class="footer-link" target="_blank">Instagram</a>
      <a href="https://www.youtube.com/channel/UC1Ew2V6Eg06v5syZQI9idyg" class="footer-link" target="_blank">YouTube</a>
    </div>
    <p class="footer-copy">© 2026 Clara Louis — somaticwithclara.com</p>
  </div>
</footer>
```

### Step 1.8 — Clean up JavaScript block (lines 968–1018)

- [ ] Replace existing JS block with the new nav scroll + reveal + mobile menu logic:

```html
<script>
// Nav scroll
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => { nav.classList.toggle('scrolled', window.scrollY > 40); }, { passive: true });

// Mobile menu
const ham = document.getElementById('ham');
const mobileNav = document.getElementById('mobile-nav');
if (ham) ham.addEventListener('click', () => mobileNav.classList.toggle('open'));

// Scroll reveal
const revealEls = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); } });
}, { threshold: 0.12 });
revealEls.forEach(el => observer.observe(el));
</script>
</body>
</html>
```

### Step 1.9 — Verify

- [ ] Start local server if not running: `cd "/Users/clara/Desktop/Website builder" && node serve.mjs &`
- [ ] Open `http://localhost:3000` in browser
- [ ] Check: navy hero loads with script text + Anton headline + sage CTA button, no ticker
- [ ] Scroll: nav turns navy on scroll with sage hover on links
- [ ] Check: problem section, process arc (5 cards), offer preview (sage section), testimonials, footer all present and on-brand
- [ ] Check mobile: hamburger menu appears below 680px

### Step 1.10 — Commit

- [ ] `git add index.html && git commit -m "Update homepage to Sage & Midnight Ink brand and Path B copy"`

---

## Task 2 — Quiz Landing Prepend (`nervous_system_state_quiz_v2.html`)

**Files:**
- Modify: `nervous_system_state_quiz_v2.html`

The quiz file already uses the Sage & Midnight Ink brand system. Add a landing screen before the existing first element.

### Step 2.1 — Wrap existing quiz content

- [ ] Find the first `<div class="ticker">` element near line 63. Directly before it, add:

```html
<div id="quiz-start"></div>
```

### Step 2.2 — Insert landing screen before the `<div id="quiz-start">` line

- [ ] Immediately after `<body>` (or before the ticker), insert the landing section:

```html
<!-- QUIZ LANDING -->
<section style="background:var(--dark);padding:120px 24px 80px;text-align:center;position:relative;overflow:hidden;min-height:100svh;display:flex;align-items:center;">
  <div style="position:absolute;width:300px;height:300px;border-radius:50%;border:3px solid var(--sage);opacity:.08;top:-80px;right:-80px;pointer-events:none;"></div>
  <div style="position:absolute;width:160px;height:160px;border-radius:50%;border:2px solid var(--violet);opacity:.09;bottom:-50px;left:-50px;pointer-events:none;"></div>
  <div style="position:absolute;width:90px;height:90px;border-radius:50%;border:2px solid var(--sage);opacity:.06;top:40px;left:12%;pointer-events:none;"></div>
  <div style="max-width:680px;margin:0 auto;position:relative;z-index:1;">
    <div style="font-family:'Permanent Marker',cursive;font-size:22px;color:var(--violet);display:inline-block;transform:rotate(-1.5deg);margin-bottom:14px;">something feels off</div>
    <h1 style="font-family:'Anton',sans-serif;font-weight:400;font-size:clamp(28px,6vw,52px);line-height:1.05;text-transform:uppercase;letter-spacing:-0.3px;color:#fff;margin-bottom:20px;">
      Find out which pattern<br/>your body keeps<br/><span style="color:var(--sage);">returning to</span>
    </h1>
    <p style="font-family:'DM Sans',sans-serif;font-size:16px;font-weight:300;font-style:italic;color:rgba(255,255,255,.55);line-height:1.8;max-width:480px;margin:0 auto 14px;">
      It's not a personality flaw. It's a survival pattern. The quiz names it.
    </p>
    <p style="font-family:'DM Sans',sans-serif;font-size:12px;color:rgba(255,255,255,.3);margin-bottom:36px;">Takes 3 minutes.</p>
    <a href="#quiz-start" style="display:inline-block;font-family:'Anton',sans-serif;font-size:13px;letter-spacing:1.5px;text-transform:uppercase;color:#fff;background:var(--sage);padding:16px 44px;border-radius:50px;text-decoration:none;box-shadow:0 6px 24px rgba(91,154,110,.3);transition:all 0.25s ease;" onmouseover="this.style.background='var(--sage-dark)';this.style.transform='translateY(-3px) scale(1.02)'" onmouseout="this.style.background='var(--sage)';this.style.transform='none'">Take the Quiz</a>
  </div>
</section>
```

### Step 2.3 — Verify

- [ ] Open `http://localhost:3000/nervous_system_state_quiz_v2.html`
- [ ] Check: full-height navy landing screen displays first with script text, headline, italic subline, "Takes 3 minutes.", sage CTA
- [ ] Click "Take the Quiz" — page scrolls smoothly down to the quiz ticker/header
- [ ] Scroll back up: landing screen looks correct on mobile width

### Step 2.4 — Commit

- [ ] `git add nervous_system_state_quiz_v2.html && git commit -m "Prepend quiz landing screen to quiz file"`

---

## Task 3 — About Page (`about.html`)

**Files:**
- Create: `about.html`

### Step 3.1 — Create `about.html`

- [ ] Create the file with this complete content:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>About Clara — Somatic with Clara</title>
  <meta name="description" content="You don't need something to be wrong enough. Clara's story, her training, and the work." />
  <link rel="canonical" href="https://somaticwithclara.com/about.html" />
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Anton&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,700;1,300;1,400&family=Permanent+Marker&display=swap" rel="stylesheet">
  <style>
    /* [BRAND CSS — paste full block from top of this plan] */

    /* Page-specific */
    .cred-list { list-style: none; display: flex; flex-direction: column; gap: 14px; }
    .cred-item { display: flex; align-items: flex-start; gap: 14px; padding: 16px 20px; background: #fff; border-radius: 12px; border: 2px solid var(--line); }
    .cred-dot { width: 10px; height: 10px; border-radius: 50%; background: var(--sage); flex-shrink: 0; margin-top: 5px; }
    .cred-name { font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 600; color: var(--text); line-height: 1.5; }

    /* Mobile nav */
    #mobile-nav { display: none; background: var(--dark); padding: 20px 24px 28px; border-top: 1px solid rgba(255,255,255,.06); }
    #mobile-nav.open { display: block; }
    #mobile-nav .nav-link { font-size: 15px; letter-spacing: 0; text-transform: none; color: rgba(255,255,255,.7); display: block; padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,.06); }
    @media (max-width:680px) { .desktop-nav { display:none !important; } #ham { display:flex !important; } }
  </style>
</head>
<body>

<!-- NAV -->
<nav id="nav">
  <div class="nav-inner">
    <a href="/" aria-label="Somatic with Clara — home">
      <img src="brand-assets/Logo.png" alt="Somatic with Clara" style="height:34px;width:auto;display:block;" />
    </a>
    <div style="display:flex;align-items:center;gap:32px;" class="desktop-nav">
      <a href="about.html" class="nav-link" style="color:var(--sage);">About</a>
      <a href="offers.html" class="nav-link">Work with Me</a>
      <a href="nervous_system_state_quiz_v2.html" class="btn-sage nav-cta" style="padding:10px 24px;font-size:11px;">Take the Quiz</a>
    </div>
    <button id="ham" aria-label="Open menu" style="background:none;border:none;cursor:pointer;padding:8px;display:none;">
      <span style="display:block;width:22px;height:2px;background:rgba(255,255,255,.7);margin-bottom:5px;"></span>
      <span style="display:block;width:22px;height:2px;background:rgba(255,255,255,.7);margin-bottom:5px;"></span>
      <span style="display:block;width:22px;height:2px;background:rgba(255,255,255,.7);"></span>
    </button>
  </div>
  <div id="mobile-nav">
    <a href="about.html" class="nav-link">About</a>
    <a href="offers.html" class="nav-link">Work with Me</a>
    <a href="nervous_system_state_quiz_v2.html" class="btn-sage" style="display:block;margin-top:20px;text-align:center;">Take the Quiz</a>
  </div>
</nav>

<!-- HERO -->
<section class="hero-dark">
  <div class="circ" style="width:280px;height:280px;border:3px solid var(--sage);opacity:.08;top:-80px;right:-80px;"></div>
  <div class="circ" style="width:150px;height:150px;border:2px solid var(--violet);opacity:.09;bottom:-50px;left:-50px;"></div>
  <div style="max-width:680px;margin:0 auto;position:relative;z-index:1;">
    <div class="hero-script" style="color:var(--violet);">about clara</div>
    <h1 class="hero-h1">There's who you've been<br/>surviving as.<br/><em>And there's you.</em></h1>
  </div>
</section>
<hr class="divider" />

<!-- LEGITIMACY GAP -->
<section style="background:var(--bg);padding:80px 24px;">
  <div class="narrow">
    <span class="section-label reveal">The thing nobody says</span>
    <h2 class="section-title reveal d1">You don't need something<br/>to be wrong <em>enough.</em></h2>
    <p class="reveal d2" style="font-family:'DM Sans',sans-serif;font-size:16px;font-weight:300;font-style:italic;color:var(--body);line-height:1.85;margin-bottom:20px;">
      Functioning fine on the outside. Quietly not yourself on the inside.
    </p>
    <p class="reveal d3" style="font-family:'DM Sans',sans-serif;font-size:15px;color:var(--body);line-height:1.8;">
      The feeling that nothing is wrong enough to warrant support — that thought is the barrier. Not the truth. Most women who do this work aren't in crisis. They're just performing a life that doesn't quite feel like theirs. And they've been doing it long enough that they've stopped noticing the distance.
    </p>
  </div>
</section>
<hr class="divider" />

<!-- STORY -->
<section style="background:var(--white);padding:80px 24px;">
  <div class="narrow">
    <span class="section-label reveal">The story</span>
    <h2 class="section-title reveal d1">How I got here.</h2>
    <div style="display:flex;align-items:flex-start;gap:28px;margin-bottom:32px;" class="reveal d2">
      <img src="profile-pic.png" alt="Clara Louis" style="width:100px;height:100px;border-radius:50%;object-fit:cover;object-position:center top;border:3px solid var(--sage);flex-shrink:0;" />
      <p style="font-family:'DM Sans',sans-serif;font-size:15px;font-weight:700;color:var(--text);line-height:1.6;padding-top:8px;">Clara Louis<br/><span style="font-weight:400;color:var(--muted);font-size:13px;">Somatic Coach & Human Design Guide — London</span></p>
    </div>
    <p class="reveal d3" style="font-family:'DM Sans',sans-serif;font-size:15px;color:var(--body);line-height:1.85;margin-bottom:20px;">
      From childhood, I did what was expected. Shrunk my desires. Stayed small. When I moved to London and started chasing the things I actually wanted, something still felt off — I was moving forward, but my body wasn't. I was still frozen in the same cycles of self-criticism and self-sabotage, just in a different postcode.
    </p>
    <p class="reveal d4" style="font-family:'DM Sans',sans-serif;font-size:15px;color:var(--body);line-height:1.85;margin-bottom:20px;">
      Everything changed when I discovered the nervous system. Not as a concept — as an experience. I realised my body wasn't resisting my dreams. It lacked the safety to receive them. The patterns I thought were personality were biology. The loops I couldn't break weren't character flaws — they were survival responses that had never been updated.
    </p>
    <p class="reveal" style="font-family:'DM Sans',sans-serif;font-size:15px;color:var(--body);line-height:1.85;">
      Through somatic work, I stopped fighting myself and started collaborating with my body. Building safety where fear existed. Cultivating something that felt like self-trust where shame had been. That shift opened everything — and it's what I now do with the women I work with.
    </p>
  </div>
</section>
<hr class="divider" />

<!-- PATH B -->
<section style="background:var(--sage-light);padding:80px 24px;">
  <div class="narrow" style="text-align:center;">
    <div style="font-family:'Permanent Marker',cursive;font-size:24px;color:var(--sage-dark);display:inline-block;transform:rotate(-1deg);margin-bottom:16px;">path b</div>
    <h2 class="section-title reveal" style="text-align:center;">What becomes possible<br/>when you stop surviving.</h2>
    <p class="reveal d1" style="font-family:'DM Sans',sans-serif;font-size:16px;font-weight:300;font-style:italic;color:var(--body);line-height:1.85;max-width:540px;margin:0 auto;">
      Regulation is the doorway — not the destination. Once the body has enough safety to actually feel, a different question becomes available: not "how do I cope better?" but "who am I when I'm not surviving?"
    </p>
    <p class="reveal d2" style="font-family:'DM Sans',sans-serif;font-size:15px;color:var(--body);line-height:1.8;max-width:540px;margin:20px auto 0;">
      That's Path B. Not a prescribed outcome. An open question about what becomes possible when you stop performing a life that was never quite yours.
    </p>
  </div>
</section>
<hr class="divider" />

<!-- CREDENTIALS -->
<section style="background:var(--white);padding:80px 24px;">
  <div class="narrow">
    <span class="section-label reveal">Training & credentials</span>
    <h2 class="section-title reveal d1">The work behind<br/><em>the work.</em></h2>
    <ul class="cred-list reveal d2">
      <li class="cred-item"><span class="cred-dot"></span><span class="cred-name">The Core Rising® Method</span></li>
      <li class="cred-item"><span class="cred-dot"></span><span class="cred-name">Somatic Coaching — Academia Coaching Somático</span></li>
      <li class="cred-item"><span class="cred-dot"></span><span class="cred-name">Somatic Yoga (300hr)</span></li>
      <li class="cred-item"><span class="cred-dot"></span><span class="cred-name">Angelic Reiki Practitioner</span></li>
      <li class="cred-item"><span class="cred-dot"></span><span class="cred-name">PSYCH-K® Basic & Advanced</span></li>
      <li class="cred-item"><span class="cred-dot"></span><span class="cred-name">Human Design & Gene Keys</span></li>
    </ul>
  </div>
</section>
<hr class="divider" />

<!-- CTA -->
<section style="background:var(--sage);padding:80px 24px;text-align:center;position:relative;overflow:hidden;">
  <div class="circ" style="width:260px;height:260px;border:4px solid rgba(255,255,255,.07);top:-70px;right:-70px;"></div>
  <div class="circ" style="width:160px;height:160px;border:4px solid rgba(255,255,255,.06);bottom:-50px;left:-50px;"></div>
  <div style="max-width:560px;margin:0 auto;position:relative;z-index:1;">
    <h2 class="reveal" style="font-family:'Anton',sans-serif;font-weight:400;font-size:clamp(26px,4.5vw,42px);text-transform:uppercase;color:#fff;line-height:1.1;margin-bottom:16px;">The quiz is where it starts.</h2>
    <p class="reveal d1" style="font-family:'DM Sans',sans-serif;font-size:15px;font-weight:300;font-style:italic;color:rgba(255,255,255,.75);line-height:1.8;margin-bottom:32px;">Five minutes. Your pattern is named instantly.</p>
    <a href="nervous_system_state_quiz_v2.html" class="btn-dark reveal d2">Take the Quiz</a>
  </div>
</section>

<!-- FOOTER -->
<footer class="site-footer">
  <div class="footer-inner">
    <img src="brand-assets/Logo.png" alt="Somatic with Clara" style="height:28px;filter:brightness(0) invert(1);opacity:.4;" />
    <div class="footer-links">
      <a href="/" class="footer-link">Home</a>
      <a href="offers.html" class="footer-link">Work with Me</a>
      <a href="nervous_system_state_quiz_v2.html" class="footer-link">Quiz</a>
      <a href="https://www.instagram.com/clara.holds.space/" class="footer-link" target="_blank">Instagram</a>
      <a href="https://www.youtube.com/channel/UC1Ew2V6Eg06v5syZQI9idyg" class="footer-link" target="_blank">YouTube</a>
    </div>
    <p class="footer-copy">© 2026 Clara Louis — somaticwithclara.com</p>
  </div>
</footer>

<script>
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => { nav.classList.toggle('scrolled', window.scrollY > 40); }, { passive: true });
const ham = document.getElementById('ham');
const mobileNav = document.getElementById('mobile-nav');
if (ham) ham.addEventListener('click', () => mobileNav.classList.toggle('open'));
const revealEls = document.querySelectorAll('.reveal');
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
}, { threshold: 0.12 });
revealEls.forEach(el => obs.observe(el));
</script>
</body>
</html>
```

### Step 3.2 — Verify

- [ ] Open `http://localhost:3000/about.html`
- [ ] Check: navy hero with "about clara" script + correct headline "THERE'S WHO YOU'VE BEEN SURVIVING AS. AND THERE'S YOU."
- [ ] Scroll through: legitimacy gap section → story → Path B (sage-light) → credentials (6 items, no Neurofit, no "current training") → sage CTA → footer
- [ ] Confirm no "free" language anywhere

### Step 3.3 — Commit

- [ ] `git add about.html && git commit -m "Add about page with Path B framing and updated credentials"`

---

## Task 4 — Offers Page (`offers.html`)

**Files:**
- Create: `offers.html`

### Step 4.1 — Create `offers.html`

- [ ] Create the file with this complete content:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Work with Clara — Somatic with Clara</title>
  <meta name="description" content="Each offer is a different entry point into the same work. Visualisation tracks, HD report, somatic sessions, and HD + Somatic signature offer." />
  <link rel="canonical" href="https://somaticwithclara.com/offers.html" />
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Anton&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,700;1,300;1,400&family=Permanent+Marker&display=swap" rel="stylesheet">
  <style>
    /* [BRAND CSS — paste full block from top of this plan] */

    /* Offer cards */
    .offers-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px,1fr)); gap: 20px; }
    .offer-card {
      background: var(--white); border-radius: 16px; border: 2px solid var(--line);
      padding: 32px 28px; display: flex; flex-direction: column;
      transition: transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
    }
    .offer-card:hover { transform: translateY(-4px); border-color: var(--sage); box-shadow: 0 10px 32px rgba(91,154,110,.12); }
    .offer-card.signature { border-color: var(--sage); background: linear-gradient(135deg,rgba(91,154,110,.04) 0%,#fff 100%); }
    .offer-price { font-family: 'Anton', sans-serif; font-size: 32px; color: var(--sage); text-transform: uppercase; margin-bottom: 4px; }
    .offer-title { font-family: 'Anton', sans-serif; font-size: 20px; color: var(--text); text-transform: uppercase; line-height: 1.2; margin-bottom: 14px; }
    .offer-desc { font-family: 'DM Sans', sans-serif; font-size: 14px; color: var(--body); line-height: 1.8; flex: 1; margin-bottom: 24px; }
    .offer-tag { font-family: 'DM Sans', sans-serif; font-size: 9px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: var(--violet); border: 2px solid var(--violet); padding: 5px 14px; border-radius: 50px; display: inline-block; margin-bottom: 16px; }
    .offer-tag.sig { color: var(--sage); border-color: var(--sage); }
    .offer-cta { display: inline-block; font-family: 'Anton', sans-serif; font-size: 11px; letter-spacing: 1.5px; text-transform: uppercase; color: #fff; background: var(--sage); padding: 12px 28px; border-radius: 50px; text-decoration: none; border: none; cursor: pointer; transition: background 0.2s, transform 0.2s; margin-top: auto; text-align: center; }
    .offer-cta:hover { background: var(--sage-dark); transform: translateY(-2px); }
    .offer-cta.dark { background: var(--dark); }
    .offer-cta.dark:hover { background: #0e1525; }

    /* Mobile nav */
    #mobile-nav { display: none; background: var(--dark); padding: 20px 24px 28px; border-top: 1px solid rgba(255,255,255,.06); }
    #mobile-nav.open { display: block; }
    #mobile-nav .nav-link { font-size: 15px; letter-spacing: 0; text-transform: none; color: rgba(255,255,255,.7); display: block; padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,.06); }
    @media (max-width:680px) { .desktop-nav { display:none !important; } #ham { display:flex !important; } }
  </style>
</head>
<body>

<!-- NAV -->
<nav id="nav">
  <div class="nav-inner">
    <a href="/" aria-label="Somatic with Clara — home">
      <img src="brand-assets/Logo.png" alt="Somatic with Clara" style="height:34px;width:auto;display:block;" />
    </a>
    <div style="display:flex;align-items:center;gap:32px;" class="desktop-nav">
      <a href="about.html" class="nav-link">About</a>
      <a href="offers.html" class="nav-link" style="color:var(--sage);">Work with Me</a>
      <a href="nervous_system_state_quiz_v2.html" class="btn-sage nav-cta" style="padding:10px 24px;font-size:11px;">Take the Quiz</a>
    </div>
    <button id="ham" aria-label="Open menu" style="background:none;border:none;cursor:pointer;padding:8px;display:none;">
      <span style="display:block;width:22px;height:2px;background:rgba(255,255,255,.7);margin-bottom:5px;"></span>
      <span style="display:block;width:22px;height:2px;background:rgba(255,255,255,.7);margin-bottom:5px;"></span>
      <span style="display:block;width:22px;height:2px;background:rgba(255,255,255,.7);"></span>
    </button>
  </div>
  <div id="mobile-nav">
    <a href="about.html" class="nav-link">About</a>
    <a href="offers.html" class="nav-link">Work with Me</a>
    <a href="nervous_system_state_quiz_v2.html" class="btn-sage" style="display:block;margin-top:20px;text-align:center;">Take the Quiz</a>
  </div>
</nav>

<!-- HERO -->
<section class="hero-dark">
  <div class="circ" style="width:280px;height:280px;border:3px solid var(--sage);opacity:.08;top:-80px;right:-80px;"></div>
  <div class="circ" style="width:150px;height:150px;border:2px solid var(--violet);opacity:.09;bottom:-50px;left:-50px;"></div>
  <div style="max-width:680px;margin:0 auto;position:relative;z-index:1;">
    <h1 class="hero-h1">Work with <em>Clara</em></h1>
    <p class="hero-sub">Each offer is a different entry point into the same work.</p>
  </div>
</section>
<hr class="divider" />

<!-- OFFER CARDS -->
<section style="background:var(--bg);padding:80px 24px;">
  <div class="wide">
    <div class="offers-grid">

      <!-- Card 1 -->
      <div class="offer-card reveal">
        <span class="offer-tag">Self-paced</span>
        <div class="offer-price">$97</div>
        <h3 class="offer-title">Personalised Visualisation Tracks</h3>
        <p class="offer-desc">A guided audio recording built specifically around you — your name, your vision, your Human Design type. Sensory and grounded, shaped by your central belief block or theme. Available in English, French, or Spanish.</p>
        <a href="mailto:hello@somaticwithclara.com?subject=Visualisation Tracks enquiry" class="offer-cta">Enquire</a>
      </div>

      <!-- Card 2 -->
      <div class="offer-card reveal d1">
        <span class="offer-tag">Report + call</span>
        <div class="offer-price">$135</div>
        <h3 class="offer-title">HD Report & Clarity Call</h3>
        <p class="offer-desc">Your Human Design patterns named in plain language — what you're designed for, where you've been operating against your nature, and what becomes available when you stop. Includes an optional 30-minute call within 15 days if you have questions.</p>
        <a href="mailto:hello@somaticwithclara.com?subject=HD Report enquiry" class="offer-cta">Enquire</a>
      </div>

      <!-- Card 3 -->
      <div class="offer-card reveal d2">
        <span class="offer-tag">1:1 sessions</span>
        <div class="offer-price">$90 / $320</div>
        <h3 class="offer-title">Somatic Sessions</h3>
        <p class="offer-desc">Individual sessions or a package of four. The body does the real reading. We work from where you actually are — not where you think you should be. Discovery call required before booking.</p>
        <a href="https://pensight.com/x/tobehuman/meeting-08a5b21e-3b8b-4945-b1d7-2e3a9dc11d17" class="offer-cta dark" target="_blank" rel="noopener">Book a Discovery Call</a>
      </div>

      <!-- Card 4 — Signature -->
      <div class="offer-card signature reveal d3">
        <span class="offer-tag sig">Signature offer</span>
        <div class="offer-price" style="color:var(--text);">$400+</div>
        <h3 class="offer-title">HD + Somatic</h3>
        <p class="offer-desc">The most complete arc of the work. Report first — your Human Design patterns named and mapped. Then somatic sessions — the chart gives the map, the body does the real reading. Discovery call required. This is where real unravelling happens.</p>
        <a href="https://pensight.com/x/tobehuman/meeting-08a5b21e-3b8b-4945-b1d7-2e3a9dc11d17" class="offer-cta dark" target="_blank" rel="noopener">Book a Discovery Call</a>
      </div>

    </div>
  </div>
</section>
<hr class="divider" />

<!-- DISCOVERY CALL SECTION -->
<section style="background:var(--sage);padding:80px 24px;text-align:center;position:relative;overflow:hidden;">
  <div class="circ" style="width:260px;height:260px;border:4px solid rgba(255,255,255,.07);top:-70px;right:-70px;"></div>
  <div class="circ" style="width:160px;height:160px;border:4px solid rgba(255,255,255,.06);bottom:-50px;left:-50px;"></div>
  <div style="max-width:560px;margin:0 auto;position:relative;z-index:1;">
    <span class="section-label reveal" style="color:rgba(255,255,255,.5);">For Somatic Sessions & HD + Somatic</span>
    <h2 class="reveal d1" style="font-family:'Anton',sans-serif;font-weight:400;font-size:clamp(26px,4.5vw,42px);text-transform:uppercase;color:#fff;line-height:1.1;margin-bottom:16px;">Not sure where to start?</h2>
    <p class="reveal d2" style="font-family:'DM Sans',sans-serif;font-size:15px;font-weight:300;font-style:italic;color:rgba(255,255,255,.75);line-height:1.8;margin-bottom:32px;">
      A 30-minute discovery call. No pressure — just a conversation to find out whether we're a good fit and what the right entry point is for where you are now.
    </p>
    <a href="https://pensight.com/x/tobehuman/meeting-08a5b21e-3b8b-4945-b1d7-2e3a9dc11d17" class="btn-dark reveal d3" target="_blank" rel="noopener">Book a Discovery Call</a>
  </div>
</section>

<!-- FOOTER -->
<footer class="site-footer">
  <div class="footer-inner">
    <img src="brand-assets/Logo.png" alt="Somatic with Clara" style="height:28px;filter:brightness(0) invert(1);opacity:.4;" />
    <div class="footer-links">
      <a href="/" class="footer-link">Home</a>
      <a href="about.html" class="footer-link">About</a>
      <a href="nervous_system_state_quiz_v2.html" class="footer-link">Quiz</a>
      <a href="https://www.instagram.com/clara.holds.space/" class="footer-link" target="_blank">Instagram</a>
      <a href="https://www.youtube.com/channel/UC1Ew2V6Eg06v5syZQI9idyg" class="footer-link" target="_blank">YouTube</a>
    </div>
    <p class="footer-copy">© 2026 Clara Louis — somaticwithclara.com</p>
  </div>
</footer>

<script>
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => { nav.classList.toggle('scrolled', window.scrollY > 40); }, { passive: true });
const ham = document.getElementById('ham');
const mobileNav = document.getElementById('mobile-nav');
if (ham) ham.addEventListener('click', () => mobileNav.classList.toggle('open'));
const revealEls = document.querySelectorAll('.reveal');
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
}, { threshold: 0.12 });
revealEls.forEach(el => obs.observe(el));
</script>
</body>
</html>
```

### Step 4.2 — Verify

- [ ] Open `http://localhost:3000/offers.html`
- [ ] Check: 4 cards present — $97 Tracks, $135 HD Report, $90/$320 Somatic Sessions, $400+ HD + Somatic (signature card visually distinct)
- [ ] Confirm Tracks + HD Report use `mailto:` links; Somatic Sessions + HD + Somatic use Pensight link
- [ ] Confirm no GBP (£) symbols anywhere — all prices in USD ($)
- [ ] Discovery call section at bottom links to Pensight
- [ ] Nav active state: "Work with Me" appears in sage

### Step 4.3 — Commit

- [ ] `git add offers.html && git commit -m "Add offers page with USD pricing and Pensight discovery call CTA"`

---

## Task 5 — Community Page Amendments (`reclaim_landing.html`)

**Files:**
- Modify: `reclaim_landing.html`

Seven targeted changes. Apply them one at a time.

### Step 5.1 — Hero CTA button text

- [ ] Find: `<a href="https://www.skool.com/the-nervous-system-library-7770/about" target="_blank" class="btn-sage">Take the quiz and join</a>`
- [ ] Replace with: `<a href="https://www.skool.com/the-nervous-system-library-7770/about" target="_blank" class="btn-sage">Join the Community</a>`
- [ ] *(There are two instances — hero button and final CTA. Replace both.)*

### Step 5.2 — Hero summary line

- [ ] Find: `understand why — and to start asking what comes next`
- [ ] Replace with: `name what's been happening — and to start asking what comes next`

### Step 5.3 — Hero badge

- [ ] Find: `<div class="hero-badge">Nervous System Community</div>`
- [ ] Replace with: `<div class="hero-badge">something feels off</div>`

### Step 5.4 — Ticker content

- [ ] Find the ticker `<div class="ticker-track">` block and remove these two items (both instances in the doubled track):
  - `<div class="ticker-item"><span class="ticker-text">NERVOUS SYSTEM REGULATION</span><span class="ticker-dot"></span></div>`
  - `<div class="ticker-item"><span class="ticker-text">WINDOW OF TOLERANCE</span><span class="ticker-dot"></span></div>`

### Step 5.5 — Remove app references from editorial cards section

- [ ] Find the three-card editorial section (`.editorial-section`). Delete the entire middle card — the one with `background:var(--violet)` header and title "State Identifier App". The section should now have two cards: Quiz card and Evolution card.

### Step 5.6 — Remove app from stack section

- [ ] In the `.stack-section`, find and delete the entire `<div class="stack-item">` block for "The State Identifier App" (the one with `<span class="stack-num">Two</span>`).
- [ ] Renumber the remaining items: "One" stays, "Three" → "Two", "Four" → "Three", "Five" → "Four".

### Step 5.7 — Remove app from "how it works" steps section

- [ ] In the `.steps-section`, find Step 03: `<div class="step-label">Regulate in real time</div>` / `<div class="step-sub">Use the state app whenever you need it. Practices matched to now.</div>`
- [ ] Replace the step-sub text with: `Work with your state using the practices in the community — matched to where you actually are.`
- [ ] Remove any reference to "state app" in the progress bar labels if present.

### Step 5.8 — Remove all "free" language

- [ ] Search for the word "free" (case-insensitive) throughout the file and remove or rewrite every instance:
  - `Book a free call` → `Book a call`
  - Any price display showing "Free" → remove the element entirely
  - `free community` → remove phrase or rewrite to just "the community"
  - `Join below` in top bar → keep if it doesn't reference free; if the top bar says "A nervous system community... Join below." that's fine as-is

### Step 5.9 — Verify

- [ ] Open `http://localhost:3000/reclaim_landing.html`
- [ ] Check hero badge reads "something feels off" (not "Nervous System Community")
- [ ] Check hero CTA button reads "Join the Community" (not "Take the quiz and join")
- [ ] Check ticker has no "NERVOUS SYSTEM REGULATION" or "WINDOW OF TOLERANCE"
- [ ] Check editorial cards: only Quiz card + Evolution card (no App card)
- [ ] Check stack section: 4 items, no app item
- [ ] Search page text for "free" — confirm none present except if it appears in non-pricing contexts
- [ ] Search page text for "£" — confirm none (should be fine as this page had no GBP)

### Step 5.10 — Commit

- [ ] `git add reclaim_landing.html && git commit -m "Amend community page: remove app refs, free language, and methodology-first copy"`

---

## Self-Review Checklist

- [x] **Spec coverage:**
  - Homepage brand + copy → Task 1 ✓
  - Quiz landing prepend → Task 2 ✓
  - About page with correct hero headline → Task 3 ✓
  - Credentials list (no Neurofit, no "current training") → Task 3 Step 3.1 ✓
  - Offers page, USD prices → Task 4 ✓
  - Pensight link on discovery call → Tasks 4 and 5 ✓
  - Community page 7 amendments → Task 5 ✓
  - No ticker on homepage → Step 1.3 removes marquee/ticker ✓
  - Navy only in hero → enforced via `.hero-dark` class and no dark sections outside hero ✓
  - No "free" language → Task 5.8 + about/offers pages never mention free ✓
  - All prices in USD → Task 4 ✓

- [x] **Placeholder scan:** No TBDs. All links explicit. All copy written out. Commands include expected outcomes.

- [x] **Type consistency:** `.btn-sage`, `.btn-dark`, `.divider`, `.hero-dark`, `.circ`, `.reveal`, `.site-footer` used consistently across all tasks. Nav scroll uses `scrolled` class in all three new pages.
