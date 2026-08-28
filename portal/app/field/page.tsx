import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'
import { dayIndex, daysUntilEnd, lunationsOn, moonPhaseAt, nextWindow, selectWindow } from '@/lib/field/select'
import { TIME_ZONE } from '@/lib/field/constants'
import type { FieldData } from '@/lib/field/types'
import data from '@/lib/field/windows.json'
import WindowCard from './WindowCard'

// Selection depends on the current moment, so this route must not be
// prerendered — a statically rendered page would serve whichever window was
// live at build time and silently keep serving it after the window rolls over.
export const dynamic = 'force-dynamic'

// How far ahead of the last window's end to start showing the operational
// warning that the generated year is running out.
const WARNING_WINDOW_DAYS = 30

const THEMES = ['serpens', 'serpens-veil', 'solar-tide', 'solar-horizon', 'mystic-oracle'] as const
type FieldTheme = (typeof THEMES)[number]

export default async function FieldPage({
  searchParams,
}: {
  searchParams: Promise<{ theme?: string | string[] }>
}) {
  const session = await getSession()
  if (!session) redirect('/login')

  const field = data as FieldData
  const now = new Date()
  const current = selectWindow(field.windows, now)
  const daysRemaining = daysUntilEnd(field.windows, now)

  if (!current) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6">
        <div className="max-w-md space-y-4 text-center">
          <h1 className="font-display text-3xl font-semibold tracking-tight text-rbd-ink uppercase">
            Outside the current year
          </h1>
          <p className="text-sm leading-relaxed text-rbd-muted">
            Today falls outside the calendar that has been built. The generated
            year has ended and needs to be regenerated from the vault, then
            copied into the portal and deployed, before this page can show a
            window again.
          </p>
        </div>
      </div>
    )
  }

  const approachingEnd = daysRemaining !== null && daysRemaining <= WARNING_WINDOW_DAYS
  const requestedTheme = (await searchParams).theme
  const theme: FieldTheme =
    typeof requestedTheme === 'string' && THEMES.includes(requestedTheme as FieldTheme)
      ? (requestedTheme as FieldTheme)
      : 'mystic-oracle'

  return (
    <WindowCard
      window={current}
      day={dayIndex(current, now)}
      next={nextWindow(field.windows, current)}
      lunations={lunationsOn(field.lunations, now, TIME_ZONE)}
      daysRemaining={approachingEnd ? daysRemaining : null}
      theme={theme}
      moonPhase={moonPhaseAt(field.lunations, now)}
    />
  )
}
