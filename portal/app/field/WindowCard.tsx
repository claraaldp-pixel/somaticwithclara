import type { Lunation, Window } from '@/lib/field/types'
import Markdown from './Markdown'

interface Props {
  window: Window
  day: number
  next: Window | null
  lunations: Lunation[]
}

const DATE = { day: 'numeric', month: 'short' } as const

function span(window: Window): string {
  const start = new Date(window.start).toLocaleDateString('en-GB', DATE)
  const end = new Date(window.end).toLocaleDateString('en-GB', {
    ...DATE,
    year: 'numeric',
  })
  return `${start} – ${end}`
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section className="space-y-2">
      <h2 className="text-xs uppercase tracking-widest text-stone-400">{label}</h2>
      {children}
    </section>
  )
}

export default function WindowCard({ window, day, next, lunations }: Props) {
  return (
    <main className="min-h-screen bg-stone-50">
      <div className="max-w-2xl mx-auto px-6 py-12 space-y-10">
        <header className="space-y-1">
          <div className="flex items-baseline justify-between gap-4">
            <h1 className="text-2xl font-light text-stone-800">
              Gate {window.gate}
              {window.name ? ` · ${window.name}` : ''}
            </h1>
            <p className="text-sm text-stone-500 whitespace-nowrap">{span(window)}</p>
          </div>
          <div className="flex items-baseline justify-between gap-4">
            {window.tagline ? (
              <p className="text-stone-500 italic">{window.tagline}</p>
            ) : (
              <span />
            )}
            <p className="text-xs text-stone-400 whitespace-nowrap">
              day {day} of {window.days}
            </p>
          </div>
        </header>

        {lunations.length > 0 && (
          <Section label="Today">
            {lunations.map((moon) => (
              <p key={moon.moment} className="text-stone-700">
                {moon.phase === 'new' ? 'New Moon' : 'Full Moon'} in Gate {moon.gate}.
                {moon.line ? ` Line ${moon.line}.` : ''}
              </p>
            ))}
          </Section>
        )}

        <Section label="The axis">
          <p className="text-stone-700 leading-relaxed">{window.axis.sentence}</p>
          {window.axis.lead && <Markdown>{window.axis.lead}</Markdown>}
        </Section>

        {window.bridge && (
          <Section label={`${window.bridge.sign} bridge`}>
            <Markdown>{window.bridge.text}</Markdown>
          </Section>
        )}

        <Section label={`The Sun in Gate ${window.axis.sun.gate}`}>
          <p className="text-xs text-stone-400">{window.axis.sun.frame}</p>
          {window.sun_reading ? (
            <Markdown>{window.sun_reading}</Markdown>
          ) : (
            <p className="text-stone-400 text-sm">Coming soon</p>
          )}
        </Section>

        <Section label={`The Earth in Gate ${window.axis.earth.gate}`}>
          <p className="text-xs text-stone-400">{window.axis.earth.frame}</p>
          {window.earth_reading ? (
            <Markdown>{window.earth_reading}</Markdown>
          ) : (
            <p className="text-stone-700 leading-relaxed">{window.earth_fallback}</p>
          )}
        </Section>

        {window.nervous && (
          <Section label={`Nervous system · ${window.nervous.source}`}>
            <Markdown>{window.nervous.text}</Markdown>
          </Section>
        )}

        {window.lookback && (
          <Section label="Looking back">
            <p className="text-xs text-stone-400">
              {window.lookback.date} · {window.lookback.gap}
            </p>
            {window.lookback.text && <Markdown>{window.lookback.text}</Markdown>}
          </Section>
        )}

        <Section
          label={`Practice · Sun ${window.axis.sun.gate} / Earth ${window.axis.earth.gate}`}
        >
          {window.practice ? (
            <>
              {window.practice.type && (
                <p className="text-xs uppercase tracking-widest text-stone-500">
                  {window.practice.type}
                  {window.practice.duration ? ` · ${window.practice.duration}` : ''}
                </p>
              )}
              {window.practice.text && <Markdown>{window.practice.text}</Markdown>}
              {window.practice.media && (
                <a
                  href={window.practice.media}
                  className="text-sm text-stone-600 underline underline-offset-4"
                >
                  Open the practice
                </a>
              )}
            </>
          ) : (
            <p className="text-stone-400 text-sm">Coming soon</p>
          )}
        </Section>

        <Section label="Elsewhere in the year">
          <p className="text-stone-700 leading-relaxed">{window.crossrefs.opposite}</p>
          {window.crossrefs.channels.map((channel) => (
            <p key={channel} className="text-stone-700 leading-relaxed">
              {channel}
            </p>
          ))}
        </Section>

        <footer className="pt-4 border-t border-stone-200">
          <p className="text-xs text-stone-400">
            {next
              ? `Gate ${next.gate}${next.name ? ` · ${next.name}` : ''} from ${new Date(
                  next.start
                ).toLocaleDateString('en-GB', DATE)}`
              : 'Last window of the year'}
          </p>
        </footer>
      </div>
    </main>
  )
}
