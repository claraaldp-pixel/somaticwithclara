import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'
import { dayIndex, lunationsOn, nextWindow, selectWindow } from '@/lib/field/select'
import { TIME_ZONE } from '@/lib/field/constants'
import type { FieldData } from '@/lib/field/types'
import data from '@/lib/field/windows.json'
import WindowCard from './WindowCard'

// Selection depends on the current moment, so this route must not be
// prerendered — a statically rendered page would serve whichever window was
// live at build time and silently keep serving it after the window rolls over.
export const dynamic = 'force-dynamic'

export default async function FieldPage() {
  const session = await getSession()
  if (!session) redirect('/login')

  const field = data as FieldData
  const now = new Date()
  const current = selectWindow(field.windows, now)

  if (!current) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50 px-4">
        <div className="max-w-md text-center space-y-3">
          <h1 className="text-2xl font-light text-stone-800">Outside the current year</h1>
          <p className="text-stone-500 text-sm leading-relaxed">
            Today falls outside the calendar that has been built. The next year
            is generated from the vault when the season turns.
          </p>
        </div>
      </div>
    )
  }

  return (
    <WindowCard
      window={current}
      day={dayIndex(current, now)}
      next={nextWindow(field.windows, current)}
      lunations={lunationsOn(field.lunations, now, TIME_ZONE)}
    />
  )
}
