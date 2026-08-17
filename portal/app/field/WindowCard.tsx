import type { Lunation, Window } from '@/lib/field/types'
import { TIME_ZONE } from '@/lib/field/constants'
import Markdown from './Markdown'

interface Props {
  window: Window
  day: number
  next: Window | null
  lunations: Lunation[]
  daysRemaining: number | null
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

const LABEL = 'font-display text-[11px] font-medium uppercase tracking-[0.18em]'

function Label({ children }: { children: React.ReactNode }) {
  return <h2 className={`${LABEL} text-rbd-muted`}>{children}</h2>
}

function Section({ label, children }: { label: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
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
    <section className="border-s-2 border-rbd-terracotta bg-rbd-wash py-4 pe-4 ps-5">
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
    <section className="border border-rbd-line border-s-[3px] border-s-rbd-terracotta bg-rbd-surface px-6 py-7 sm:px-8 sm:py-9">
      <h2 className={`${LABEL} text-rbd-ink`}>{label}</h2>
      {sub && <p className="mt-1.5 font-serif text-[15px] italic text-rbd-muted">{sub}</p>}
      <div className="mt-5">{children}</div>
    </section>
  )
}

function Pole({
  side,
  gate,
  name,
  centre,
  frame,
  reading,
  fallback,
}: {
  side: string
  gate: number
  name: string | null
  centre: string | null
  frame: string
  reading: string | null
  fallback?: string
}) {
  return (
    <div className="bg-rbd-surface px-5 py-5">
      <h3 className={`${LABEL} text-rbd-muted`}>
        {side} · Gate {gate}
      </h3>
      <p className="mt-2 font-display text-lg leading-tight text-rbd-ink">{name ?? `Gate ${gate}`}</p>
      <p className="mt-0.5 font-serif text-sm italic text-rbd-sage-deep">
        {frame}
        {centre ? ` · ${centre}` : ''}
      </p>
      {reading ? (
        <div className="mt-3">
          <Markdown>{reading}</Markdown>
        </div>
      ) : (
        fallback && <p className="mt-3 text-sm leading-relaxed text-rbd-text">{fallback}</p>
      )}
    </div>
  )
}

export default function WindowCard({ window: field, day, next, lunations, daysRemaining }: Props) {
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
    <article className="mx-auto max-w-2xl space-y-12 px-6 py-14 sm:py-20">
      <header className="space-y-4">
        <p className={`${LABEL} text-rbd-muted`}>
          {span(field)}
          <span className="mx-2 text-rbd-line">|</span>
          day {day} of {field.days}
        </p>
        <h1 className="font-display">
          <span className="block text-4xl leading-none font-semibold tracking-tight text-rbd-ink uppercase sm:text-5xl">
            Gate {field.gate}
          </span>
          {field.name && (
            <span className="mt-1 block text-2xl leading-tight font-normal text-rbd-terracotta sm:text-3xl">
              {field.name}
            </span>
          )}
        </h1>
        {field.tagline && (
          <p className="font-serif text-lg leading-snug text-rbd-sage-deep italic">
            {field.tagline}
          </p>
        )}
      </header>

      {lunations.length > 0 && (
        <section className="border-s-2 border-rbd-sage bg-rbd-sage-light/60 py-3 pe-4 ps-5">
          <h2 className={`${LABEL} text-rbd-sage-deep`}>Today</h2>
          {lunations.map((moon) => (
            <p key={moon.moment} className="mt-1.5 text-rbd-text">
              {moon.phase === 'new' ? 'New Moon' : 'Full Moon'} in Gate {moon.gate}
              {moon.line ? `, line ${moon.line}` : ''}.
            </p>
          ))}
        </section>
      )}

      <section className="space-y-4">
        <p className="font-serif text-xl leading-relaxed text-rbd-ink">{field.axis.sentence}</p>
        {field.axis.lead && <Markdown>{field.axis.lead}</Markdown>}
      </section>

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
      <div className="grid divide-y divide-rbd-line border border-rbd-line bg-rbd-surface sm:grid-cols-2 sm:divide-x sm:divide-y-0">
        <Pole
          side="Sun"
          gate={field.axis.sun.gate}
          name={field.axis.sun.name}
          centre={field.axis.sun.centre}
          frame={field.axis.sun.frame}
          reading={field.sun_reading}
        />
        <Pole
          side="Earth"
          gate={earth.gate}
          name={earth.name}
          centre={earth.centre}
          frame={earth.frame}
          reading={field.earth_reading}
          fallback={field.earth_fallback}
        />
      </div>

      {field.bridge && (
        <section className="border-s-2 border-rbd-sage bg-rbd-sage-light/60 py-4 pe-4 ps-5">
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

      <footer className="space-y-6 border-t border-rbd-line pt-8">
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
  )
}
