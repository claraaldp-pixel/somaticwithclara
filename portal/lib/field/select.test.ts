import { describe, expect, it } from 'vitest'
import { dayIndex, nextWindow, selectWindow } from './select'
import type { Window } from './types'

function makeWindow(gate: number, start: string, end: string): Window {
  return {
    gate,
    name: `Gate ${gate}`,
    sign: 'Leo',
    start,
    end,
    days: 6,
    tagline: null,
    axis: {
      sentence: 'An axis sentence.',
      lead: null,
      sun: { gate, name: null, centre: null, frame: 'what the psyche will do' },
      earth: { gate: 99, name: null, centre: null, frame: 'what to ground yourself in' },
    },
    bridge: null,
    risk: null,
    sun_reading: null,
    earth_reading: null,
    earth_fallback: 'A fallback.',
    nervous: null,
    practice: null,
    lookback: null,
    crossrefs: { opposite: 'An opposite.', channels: [] },
  }
}

const WINDOWS: Window[] = [
  makeWindow(7, '2026-08-05T16:52:34+01:00', '2026-08-11T13:40:03+01:00'),
  makeWindow(4, '2026-08-11T13:40:03+01:00', '2026-08-17T10:12:00+01:00'),
]

describe('selectWindow', () => {
  it('finds the window containing the moment', () => {
    const now = new Date('2026-08-08T12:00:00+01:00')
    expect(selectWindow(WINDOWS, now)?.gate).toBe(7)
  })

  it('treats the start boundary as inside the window', () => {
    const now = new Date('2026-08-05T16:52:34+01:00')
    expect(selectWindow(WINDOWS, now)?.gate).toBe(7)
  })

  it('treats the end boundary as the next window, not this one', () => {
    const now = new Date('2026-08-11T13:40:03+01:00')
    expect(selectWindow(WINDOWS, now)?.gate).toBe(4)
  })

  it('returns null before the first window', () => {
    expect(selectWindow(WINDOWS, new Date('2026-01-01T00:00:00Z'))).toBeNull()
  })

  it('returns null after the last window', () => {
    expect(selectWindow(WINDOWS, new Date('2027-12-01T00:00:00Z'))).toBeNull()
  })

  it('returns null for an empty list', () => {
    expect(selectWindow([], new Date('2026-08-08T12:00:00+01:00'))).toBeNull()
  })
})

describe('dayIndex', () => {
  it('is 1 on the opening day', () => {
    const now = new Date('2026-08-05T18:00:00+01:00')
    expect(dayIndex(WINDOWS[0], now)).toBe(1)
  })

  it('counts elapsed days from the start, not calendar dates', () => {
    const now = new Date('2026-08-08T12:00:00+01:00')
    expect(dayIndex(WINDOWS[0], now)).toBe(3)
  })

  it('never exceeds the window length', () => {
    const now = new Date('2026-08-11T13:00:00+01:00')
    expect(dayIndex(WINDOWS[0], now)).toBeLessThanOrEqual(WINDOWS[0].days)
  })

  it('never returns less than 1', () => {
    const now = new Date('2026-08-05T16:52:35+01:00')
    expect(dayIndex(WINDOWS[0], now)).toBe(1)
  })
})

describe('nextWindow', () => {
  it('is the following window in the list', () => {
    expect(nextWindow(WINDOWS, WINDOWS[0])?.gate).toBe(4)
  })

  it('is null for the last window', () => {
    expect(nextWindow(WINDOWS, WINDOWS[1])).toBeNull()
  })
})
