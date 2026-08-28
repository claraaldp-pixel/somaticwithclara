import type { Window, Lunation, MoonPhaseState } from './types'

const MS_PER_DAY = 86_400_000

/**
 * The window containing `now`, or null when `now` falls outside the built year.
 *
 * `now` is always passed in rather than read here — that is what lets the page
 * decide freshness per request and lets these functions be tested.
 */
export function selectWindow(windows: Window[], now: Date): Window | null {
  const at = now.getTime()
  return (
    windows.find(
      (w) => Date.parse(w.start) <= at && at < Date.parse(w.end)
    ) ?? null
  )
}

/** 1-based day within the window, clamped to its length. */
export function dayIndex(window: Window, now: Date): number {
  const elapsed = now.getTime() - Date.parse(window.start)
  const day = Math.floor(elapsed / MS_PER_DAY) + 1
  return Math.min(Math.max(day, 1), window.days)
}

/** The window the Sun moves into next, or null at the end of the year. */
export function nextWindow(windows: Window[], current: Window): Window | null {
  const index = windows.findIndex((w) => w.gate === current.gate && w.start === current.start)
  if (index === -1 || index === windows.length - 1) return null
  return windows[index + 1]
}

/**
 * Days remaining between `now` and the end of the last window, or null once
 * that instant has passed (or the list is empty). Used to warn ahead of the
 * year-end cliff, where `selectWindow` starts returning null.
 */
export function daysUntilEnd(windows: Window[], now: Date): number | null {
  if (windows.length === 0) return null
  const end = Date.parse(windows[windows.length - 1].end)
  const remaining = end - now.getTime()
  if (remaining <= 0) return null
  return Math.ceil(remaining / MS_PER_DAY)
}

/** The calendar date in a given IANA zone, as YYYY-MM-DD. */
function localDay(moment: Date, timeZone: string): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(moment)
}

/**
 * Lunations landing on the same local day as `now`.
 *
 * The Moon crosses a gate every 9.2 hours, so a standing Moon reading goes
 * stale the same day it is written. A New or Full Moon is an event with a
 * date, and shows only on that date.
 */
export function lunationsOn(
  lunations: Lunation[],
  now: Date,
  timeZone: string
): Lunation[] {
  const today = localDay(now, timeZone)
  return lunations.filter((l) => localDay(new Date(l.moment), timeZone) === today)
}

/** Approximate the familiar eight-phase Moon cycle between the exact New and
 * Full Moon moments already calculated in the transit calendar. */
export function moonPhaseAt(lunations: Lunation[], now: Date): MoonPhaseState | null {
  const at = now.getTime()
  const previous = [...lunations].reverse().find((moon) => Date.parse(moon.moment) <= at)
  const next = lunations.find((moon) => Date.parse(moon.moment) > at)
  if (!previous || !next) return null

  const start = Date.parse(previous.moment)
  const end = Date.parse(next.moment)
  const progress = Math.min(1, Math.max(0, (at - start) / (end - start)))
  const nearAnchor = progress < 0.06

  if (previous.phase === 'new') {
    if (nearAnchor) return { name: 'New Moon', key: 'new', illumination: 0, next }
    const illumination = Math.round((.5 - .5 * Math.cos(Math.PI * progress)) * 100)
    if (progress < .43) return { name: 'Waxing Crescent', key: 'waxing-crescent', illumination, next }
    if (progress < .57) return { name: 'First Quarter', key: 'first-quarter', illumination, next }
    return { name: 'Waxing Gibbous', key: 'waxing-gibbous', illumination, next }
  }

  if (nearAnchor) return { name: 'Full Moon', key: 'full', illumination: 100, next }
  const illumination = Math.round((.5 + .5 * Math.cos(Math.PI * progress)) * 100)
  if (progress < .43) return { name: 'Waning Gibbous', key: 'waning-gibbous', illumination, next }
  if (progress < .57) return { name: 'Last Quarter', key: 'last-quarter', illumination, next }
  return { name: 'Waning Crescent', key: 'waning-crescent', illumination, next }
}
