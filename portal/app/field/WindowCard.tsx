import type { Lunation, Window } from '@/lib/field/types'

interface Props {
  window: Window
  day: number
  next: Window | null
  lunations: Lunation[]
}

export default function WindowCard({ window, day, next, lunations }: Props) {
  return (
    <main className="min-h-screen bg-stone-50 px-6 py-12">
      <p className="text-stone-800">
        Gate {window.gate} · {window.name} — day {day} of {window.days}
      </p>
      <p className="text-stone-500 text-sm">Next: {next ? `Gate ${next.gate}` : 'end of year'}</p>
      <p className="text-stone-500 text-sm">Lunations today: {lunations.length}</p>
    </main>
  )
}
