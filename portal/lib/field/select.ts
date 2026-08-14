import type { Window } from './types'

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
