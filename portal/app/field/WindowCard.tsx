import type { Lunation, MoonPhaseState, Pole as PoleData, Window } from '@/lib/field/types'
import { TIME_ZONE } from '@/lib/field/constants'
import Markdown from './Markdown'

interface Props {
  window: Window
  day: number
  next: Window | null
  lunations: Lunation[]
  daysRemaining: number | null
  moonPhase: MoonPhaseState | null
}

// Dates must render in the same reference zone page.tsx uses to select the
// window and match lunations. The server process's default zone (UTC on
// Vercel) can otherwise show a date a day early or late.
const DAY = { day: 'numeric', timeZone: TIME_ZONE } as const
const MONTH = { month: 'short', timeZone: TIME_ZONE } as const
const MONTH_YEAR = { month: 'short', year: 'numeric', timeZone: TIME_ZONE } as const

const fmt = (iso: string, opts: Intl.DateTimeFormatOptions) =>
  new Date(iso).toLocaleDateString('en-GB', opts)

/** Mirrors window.py's `_date_range`, including its same-month collapsing.
 *  The crossref sentences are built by that function, so a window whose own
 *  header read "11 Aug – 17 Aug" beside a crossref reading "7–13 Feb" would
 *  show two date styles on one card. */
function span(field: Window): string {
  const sameMonth = fmt(field.start, MONTH_YEAR) === fmt(field.end, MONTH_YEAR)
  if (sameMonth) {
    return `${fmt(field.start, DAY)}–${fmt(field.end, DAY)} ${fmt(field.end, MONTH_YEAR)}`
  }
  return `${fmt(field.start, DAY)} ${fmt(field.start, MONTH)} – ${fmt(field.end, DAY)} ${fmt(field.end, MONTH_YEAR)}`
}

const LABEL = 'font-body text-[11px] font-medium uppercase tracking-[0.18em]'

function Label({ children }: { children: React.ReactNode }) {
  return <h2 className={`${LABEL} text-rbd-muted`}>{children}</h2>
}

function Section({ label, children }: { label: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="field-panel rounded-2xl p-6 sm:p-8 space-y-3">
      <Label>{label}</Label>
      {children}
    </section>
  )
}

/** The card's one warning voice. `risk` uses it, and so should anything else
 *  that tells the reader a way this window goes wrong — learning to recognise
 *  it is the point, so it must not be used for merely-important content. */
function Caution({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section className="field-panel rounded-2xl border-s-2 border-s-rbd-terracotta bg-rbd-wash py-5 pe-5 ps-6">
      <h2 className={`${LABEL} text-rbd-ember`}>{label}</h2>
      <div className="mt-2">{children}</div>
    </section>
  )
}

/** Whatever the reader came for. Exactly one of these per card: the practice
 *  when it is written, the nervous-system note when it is not. */
function Hero({
  label,
  sub,
  children,
}: {
  label: string
  sub?: string | null
  children: React.ReactNode
}) {
  return (
    <section className="field-panel field-panel-gold rounded-2xl border-s-[3px] border-s-rbd-terracotta px-6 py-7 sm:px-8 sm:py-9">
      <h2 className={`${LABEL} text-rbd-ink`}>{label}</h2>
      {sub && <p className="mt-1.5 font-serif text-[15px] italic text-rbd-muted">{sub}</p>}
      <div className="mt-5">{children}</div>
    </section>
  )
}

function Pole({
  side,
  pole,
  reading,
  fallback,
}: {
  side: string
  pole: PoleData
  reading: string | null
  fallback?: string
}) {
  const { gate, name, centre, frame, essence, somatic } = pole
  return (
    <div className="px-5 py-6 sm:px-7">
      <h3 className={`${LABEL} text-rbd-muted`}>
        {side} · Gate {gate}
      </h3>
      <p className="mt-2 font-display text-lg leading-tight text-rbd-ink">{name ?? `Gate ${gate}`}</p>
      <p className="mt-0.5 font-serif text-sm italic text-rbd-sage-deep">
        {frame}
        {centre ? ` · ${centre}` : ''}
      </p>

      {/* One body line, best available. `essence` beats `earth_fallback`
          because the fallback is generated from theme labels — showing both
          repeats the gate name and its themes twice in one cell. */}
      {reading ? (
        <div className="mt-3">
          <Markdown>{reading}</Markdown>
        </div>
      ) : essence ? (
        <p className="mt-3 text-sm leading-relaxed text-rbd-text">{essence}</p>
      ) : (
        fallback && <p className="mt-3 text-sm leading-relaxed text-rbd-text">{fallback}</p>
      )}

      {somatic && (
        <div className="mt-4 border-t border-rbd-line pt-3">
          <h4 className={`${LABEL} text-rbd-muted`}>In the body</h4>
          <div className="mt-1.5">
            <Markdown>{somatic}</Markdown>
          </div>
        </div>
      )}
    </div>
  )
}

export default function WindowCard({ window: field, day, next, lunations, daysRemaining, moonPhase }: Props) {
  const nervousSource =
    field.nervous &&
    (field.nervous.level === 'centre' && !field.nervous.source.endsWith('Centre')
      ? `${field.nervous.source} Centre`
      : field.nervous.source)

  // Practice is Earth-keyed — it is what to ground yourself in, so it belongs
  // to the gate the Earth is sitting in. See window.py's docstring.
  const earth = field.axis.earth
  const practiceLead = Boolean(field.practice?.text)

  const nervousBlock = field.nervous && <Markdown lead={!practiceLead}>{field.nervous.text}</Markdown>

  return (
    <div className="field-shell field-artwork field-theme-serpens-veil">
    <article className="mx-auto max-w-6xl space-y-6 px-4 pb-14 pt-5 sm:px-7 sm:pb-20 sm:pt-7 lg:px-10">
      <nav className="flex items-center justify-between border-b border-rbd-line pb-5">
        <div>
          <p className="font-serif text-2xl leading-none text-rbd-terracotta sm:text-3xl">The Field</p>
          <p className={`${LABEL} mt-1.5 text-rbd-muted`}>Regulation by Design</p>
        </div>
        <div className="hidden items-center gap-3 sm:flex">
          <span className={`${LABEL} text-rbd-muted`}>Current transit</span>
          <span className="rounded-full border border-rbd-line bg-white/5 px-4 py-2 text-xs text-rbd-text">Now</span>
        </div>
      </nav>

      {moonPhase && (
        <section className="moon-status field-panel" aria-label={`Current moon phase: ${moonPhase.name}`}>
          <div className={`moon-orb moon-${moonPhase.key}`} aria-hidden="true">
            <span />
          </div>
          <div className="moon-status-main">
            <p className={`${LABEL} text-rbd-muted`}>Lunar weather · now</p>
            <p className="mt-1 font-serif text-2xl text-rbd-ink sm:text-3xl">{moonPhase.name}</p>
          </div>
          <div className="moon-stat">
            <span className={`${LABEL} text-rbd-muted`}>Illumination</span>
            <strong>{moonPhase.illumination}%</strong>
          </div>
          <div className="moon-stat hidden sm:flex">
            <span className={`${LABEL} text-rbd-muted`}>Next threshold</span>
            <strong>{moonPhase.next.phase === 'new' ? 'New Moon' : 'Full Moon'} · {fmt(moonPhase.next.moment, DAY)} {fmt(moonPhase.next.moment, MONTH)}</strong>
          </div>
        </section>
      )}

      <header className="field-panel field-panel-gold grid overflow-hidden rounded-2xl lg:grid-cols-[minmax(0,1.45fr)_minmax(18rem,.55fr)]">
        <div className="space-y-5 p-6 sm:p-9 lg:p-11">
          <p className={`${LABEL} text-rbd-muted`}>
            {span(field)}
            <span className="mx-2 text-rbd-terracotta">·</span>
            day {day} of {field.days}
          </p>
          <h1 className="font-display">
            <span className="block text-4xl leading-none font-semibold tracking-tight text-rbd-ink uppercase sm:text-6xl">
              Gate {field.gate}
            </span>
            {field.name && (
              <span className="mt-2 block font-serif text-3xl leading-tight font-normal text-rbd-terracotta sm:text-4xl">
                {field.name}
              </span>
            )}
          </h1>
          {field.tagline && (
            <p className="max-w-2xl font-serif text-xl leading-snug text-rbd-sage-deep italic">
              {field.tagline}
            </p>
          )}
        </div>
        <div className="flex flex-col justify-between border-t border-rbd-line bg-black/8 p-6 sm:p-8 lg:border-s lg:border-t-0">
          <div>
            <p className={`${LABEL} text-rbd-muted`}>The axis</p>
            <p className="mt-4 font-serif text-xl leading-relaxed text-rbd-ink">{field.axis.sentence}</p>
          </div>
          <p className={`${LABEL} mt-8 text-rbd-terracotta`}>
            Sun · Gate {field.axis.sun.gate} &nbsp; / &nbsp; Earth · Gate {earth.gate}
          </p>
        </div>
      </header>

      {lunations.length > 0 && (
        <section className="field-panel rounded-2xl border-s-2 border-s-rbd-sage bg-rbd-sage-light/60 py-4 pe-5 ps-6">
          <h2 className={`${LABEL} text-rbd-sage-deep`}>Today</h2>
          {lunations.map((moon) => (
            <p key={moon.moment} className="mt-1.5 text-rbd-text">
              {moon.phase === 'new' ? 'New Moon' : 'Full Moon'} in Gate {moon.gate}
              {moon.line ? `, line ${moon.line}` : ''}.
            </p>
          ))}
        </section>
      )}

      {field.axis.lead && (
        <section className="field-panel rounded-2xl space-y-4 p-6 sm:p-8">
          <p className={`${LABEL} text-rbd-terracotta`}>This window</p>
          <Markdown>{field.axis.lead}</Markdown>
        </section>
      )}

      {/* Set apart rather than boxed: it is the one thing on the card meant to
          be carried rather than read, and the sage-tinted blocks are already
          spoken for by the lunation and the bridge. */}
      {field.question && (
        <section className="field-panel rounded-2xl px-6 py-9 text-center sm:px-12">
          <h2 className={`${LABEL} text-rbd-muted`}>The question</h2>
          <p className="mt-3 font-serif text-2xl leading-snug text-rbd-ink italic">
            {field.question}
          </p>
        </section>
      )}

      {field.risk && (
        <Caution label="The risk in this window">
          <p className="leading-relaxed text-rbd-text">{field.risk}</p>
        </Caution>
      )}

      {/* Divider by `divide-*` rather than a `gap-px` over a tinted background:
          the two poles are almost never the same length — the Sun often has a
          reading and no fallback while the Earth always has a fallback — and a
          background-drawn gap paints that difference as a filled block at the
          foot of the shorter column. A border on the cell leaves the surplus
          as plain surface, so uneven columns read as uneven text. */}
      <div className="field-panel grid overflow-hidden rounded-2xl divide-y divide-rbd-line sm:grid-cols-2 sm:divide-x sm:divide-y-0">
        <Pole side="Sun" pole={field.axis.sun} reading={field.sun_reading} />
        <Pole
          side="Earth"
          pole={earth}
          reading={field.earth_reading}
          fallback={field.earth_fallback}
        />
      </div>

      {field.shows_up && (
        <Section label="How it shows up">
          <Markdown>{field.shows_up}</Markdown>
        </Section>
      )}

      {field.bridge && (
        <section className="field-panel rounded-2xl border-s-2 border-s-rbd-sage bg-rbd-sage-light/60 py-5 pe-5 ps-6">
          <h2 className={`${LABEL} text-rbd-sage-deep`}>{field.bridge.sign} bridge</h2>
          <div className="mt-2">
            <Markdown>{field.bridge.text}</Markdown>
          </div>
        </section>
      )}

      {practiceLead ? (
        <>
          <Hero
            label="Practice"
            sub={`grounding in Gate ${earth.gate}${earth.name ? ` · ${earth.name}` : ''}`}
          >
            {field.practice?.type && (
              <p className={`${LABEL} mb-4 text-rbd-ember`}>
                {field.practice.type}
                {field.practice.duration ? ` · ${field.practice.duration}` : ''}
              </p>
            )}
            <Markdown lead>{field.practice!.text!}</Markdown>
            {field.practice?.media && (
              <a
                href={field.practice.media}
                className="mt-5 inline-block font-display text-[11px] font-medium tracking-[0.18em] text-rbd-ember uppercase underline underline-offset-4"
              >
                Open the practice
              </a>
            )}
          </Hero>
          {field.nervous && (
            <Section label={`Nervous system · ${nervousSource}`}>{nervousBlock}</Section>
          )}
        </>
      ) : (
        field.nervous && (
          <Hero label="Nervous system" sub={nervousSource}>
            {nervousBlock}
          </Hero>
        )
      )}

      {field.lookback && (
        <Section
          label={
            <>
              Looking back
              <span className="ms-2 font-normal tracking-normal normal-case">
                {field.lookback.date} · {field.lookback.gap}
              </span>
            </>
          }
        >
          {field.lookback.text && <Markdown>{field.lookback.text}</Markdown>}
        </Section>
      )}

      <footer className="space-y-6 border-t border-rbd-line px-1 pt-8">
        <section className="space-y-2">
          <Label>Elsewhere in the year</Label>
          <p className="text-sm leading-relaxed text-rbd-muted">{field.crossrefs.opposite}</p>
          {field.crossrefs.channels.map((channel) => (
            <p key={channel} className="text-sm leading-relaxed text-rbd-muted">
              {channel}
            </p>
          ))}
        </section>

        <p className="text-sm text-rbd-muted">
          {next ? (
            <>
              Next · Gate {next.gate}
              {next.name ? ` ${next.name}` : ''} from {fmt(next.start, DAY)}{' '}
              {fmt(next.start, MONTH)}
            </>
          ) : (
            'Last window of the year'
          )}
        </p>

        {daysRemaining !== null && (
          <p className="text-xs leading-relaxed text-rbd-muted">
            The generated calendar ends in {daysRemaining}{' '}
            {daysRemaining === 1 ? 'day' : 'days'} — due for regeneration from the vault.
          </p>
        )}
      </footer>
    </article>
    </div>
  )
}
