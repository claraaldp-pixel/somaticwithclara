import type { Window, Lunation } from './types'

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
