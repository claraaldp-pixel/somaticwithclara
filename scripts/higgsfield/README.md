# Promo asset pipeline

Produces promotional imagery for the Somatic Pause app and the HD + Nervous System
Report, for use on somaticwithclara.com and in email.

Four stages, each runnable on its own:

```
capture → compose → generate → (composite)
```

`capture` and `compose` need no API and cost nothing. `generate` is the only stage that
spends money, and it is currently unused.

---

## Commands

There are **no npm scripts** — `package.json` is gitignored in this repo on purpose, so
everything runs through `node` directly.

```bash
# 1. Screenshot the real product surfaces (needs .env — see below)
node --env-file=.env scripts/higgsfield/capture.mjs

# 2. Compose those screenshots into branded scene stills (no credentials needed)
node scripts/higgsfield/compose.mjs

# 3. Generate via the Higgsfield API — PARKED, see below
node --env-file=.env scripts/higgsfield/generate.mjs <manifest.json>            # dry run
node --env-file=.env scripts/higgsfield/generate.mjs <manifest.json> --confirm  # spends money

# tests
node --test "scripts/higgsfield/tests/*.test.mjs"
```

The quoted glob in the test command matters. Bare `node --test <dir>` fails with
`MODULE_NOT_FOUND` on Node 25.

## `.env`

Lives in this folder, gitignored. Never commit it, never paste its values anywhere.

```
HIGGSFIELD_API_KEY=
HIGGSFIELD_API_SECRET=
SOMATIC_PAUSE_URL=https://somatic-pause-app.vercel.app/
SOMATIC_PAUSE_EMAIL=
SOMATIC_PAUSE_PASSWORD=
```

`compose.mjs` needs none of these. `capture.mjs` needs the three `SOMATIC_PAUSE_*` ones.
Only `generate.mjs` needs the Higgsfield pair.

## Where things go

| Path | What | Committed? |
|---|---|---|
| `scripts/higgsfield/out/source/` | raw screenshots | no — gitignored scratch |
| `scripts/higgsfield/out/frames/` | composed scene stills | no — gitignored scratch |
| `brand-assets/generated/` | **finished assets** | yes |

Compose writes to `out/frames/`. Copy the ones worth keeping into
`brand-assets/generated/` — that folder is the deliverable, and the site can serve from it.

---

## Gotchas that cost real time

**The brand file lies.** `brand-assets/clara-ember-brand-CURRENT.md` claims to be the
current live brand. It is not. It describes an orange "ember" palette (`#DC5A22`) with
Bricolage Grotesque headings that the live site does not use. **Read `brand.css`** — the
live brand is clay: `--clay:#C89574`, `--bg:#F6F1E7`, `--panel:#E7DAC9`, `--text:#2A2117`,
with Newsreader + Hanken Grotesk. The HD report, separately, really is ember-branded, so
the product and the site currently sit on different palettes.

**The app is behind a login wall.** A logged-out visitor sees only a sign-in form, so
`capture.mjs` authenticates before screenshotting. It guards against this: if the page
still shows a password field after signing in, it exits rather than quietly capturing the
login screen. If that guard trips, the credentials are wrong — don't retry in a loop
against a live auth endpoint.

**The app greeting uses your account's display name.** It renders "Welcome back, <name>",
so whatever that name is ends up in the asset, in bold, dead centre.

**The HD report is not a scroll page.** `example-splenic-projector-v3.html` is a tab-style
SPA that hides every section except `#intro` via JS. Scrolling to a percentage of page
height cannot reach the content. `capture.mjs` drives the report's own `window.goTo()`
navigation instead.

**The report's bodygraph image is broken.** It points at
`xherhlqktpmzibsigoir.supabase.co`, which is **NXDOMAIN** — that project is gone. The
current templates point at `hd-report-flame-mu.vercel.app`, which resolves but 404s on
`/images/*-bodygraph.png`. `capture.mjs` substitutes `brand-assets/bodygraph-clara.png` at
capture time and waits for it to load; the source report file is never modified. **This
workaround only fixes the screenshot — the underlying hosting is still broken for real
delivered reports.**

**Match the chart to the report's stated type.** The example report is headed "SPLENIC
PROJECTOR / AUTHORITY: SPLENIC", which requires a defined Spleen and an undefined Solar
Plexus. Dropping in a chart that contradicts that puts a visible error in front of an
HD-literate audience. `bodygraph-clara.png` matches.

**Blurred photos can still show a person.** Backdrops use real brand photography behind a
blur and a warm scrim. At blur 22px, `hero-meadow.jpg` still left a readable
head-and-shoulders silhouette. Always look at the output — if a figure is discernible, the
backdrop has failed its only job. `courtyard-walk.jpg` works.

**Verify by looking.** Every real problem here — the wrong report subject, the broken
bodygraph, the person-shaped blur — was found by opening the PNG, not by an exit code.
Exit codes were green throughout.

---

## The `generate` stage (parked)

`client.mjs` wraps the Higgsfield API: `POST /{model_id}` to submit,
`GET /requests/{id}/status` to poll, `Authorization: Key {key}:{secret}`.

**Parked as of 2026-08-04 — the Higgsfield credits expired.** Nothing was ever generated
and nothing was ever billed.

`generate.mjs` will not submit anything without `--confirm`. Without it, it prints the
shots it *would* submit and exits. `--only <id>` scopes a run to a single shot, and errors
out if given a missing or flag-shaped value rather than silently running the whole
manifest.

Swapping to a different provider is a base URL, a model id and a request-body shape — the
submit/poll/download machinery is generic. Free options worth checking if you return to
this: Google AI Studio (Gemini) for images, Hugging Face Inference for FLUX.1-schnell, and
Hailuo for watermark-free image-to-video on a small daily allowance.

The original design and task plan are in `docs/superpowers/specs/` and
`docs/superpowers/plans/`, both dated 2026-08-03.
