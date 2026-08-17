import { describe, expect, it } from 'vitest'
import { dayIndex, daysUntilEnd, nextWindow, selectWindow, lunationsOn } from './select'
import type { Window, Lunation } from './types'

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
      sun: {
        gate,
        name: null,
        centre: null,
        frame: 'what the psyche will do',
        essence: null,
        somatic: null,
      },
      earth: {
        gate: 99,
        name: null,
        centre: null,
        frame: 'what to ground yourself in',
        essence: null,
        somatic: null,
      },
    },
    bridge: null,
    risk: null,
    question: null,
    shows_up: null,
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

describe('daysUntilEnd', () => {
  const MS_PER_DAY = 86_400_000
  const END = '2027-07-25T04:21:13+01:00'
  const YEAR_WINDOWS: Window[] = [makeWindow(56, '2027-07-19T04:21:13+01:00', END)]
  const end = new Date(END).getTime()

  it('is a large count well inside the year', () => {
    const now = new Date(end - 90 * MS_PER_DAY)
    expect(daysUntilEnd(YEAR_WINDOWS, now)).toBe(90)
  })

  it('is exactly 30 at the 30-day threshold', () => {
    const now = new Date(end - 30 * MS_PER_DAY)
    expect(daysUntilEnd(YEAR_WINDOWS, now)).toBe(30)
  })

  it('is null once the end has passed', () => {
    const now = new Date(end + MS_PER_DAY)
    expect(daysUntilEnd(YEAR_WINDOWS, now)).toBeNull()
  })

  it('is null at the exact end instant', () => {
    expect(daysUntilEnd(YEAR_WINDOWS, new Date(end))).toBeNull()
  })

  it('rounds up to 1 day in the final moments before the end', () => {
    const now = new Date(end - 1)
    expect(daysUntilEnd(YEAR_WINDOWS, now)).toBe(1)
  })

  it('is null for an empty list', () => {
    expect(daysUntilEnd([], new Date())).toBeNull()
  })
})

function makeLunation(phase: 'new' | 'full', moment: string): Lunation {
  return { phase, moment, gate: 7, line: 3, sun_gate: 13 }
}

const LUNATIONS: Lunation[] = [
  makeLunation('full', '2026-08-08T14:30:00+01:00'),
  makeLunation('new', '2026-08-23T09:15:00+01:00'),
]

describe('lunationsOn', () => {
  const TZ = 'Europe/London'

  it('finds a lunation falling on the same local day', () => {
    const found = lunationsOn(LUNATIONS, new Date('2026-08-08T20:00:00+01:00'), TZ)
    expect(found.map((l) => l.phase)).toEqual(['full'])
  })

  it('is empty on a day with no lunation', () => {
    expect(lunationsOn(LUNATIONS, new Date('2026-08-09T12:00:00+01:00'), TZ)).toEqual([])
  })

  it('matches on the local calendar day, not the UTC one', () => {
    // 00:40 on 9 Aug in London is 23:40 on 8 Aug UTC — the London day wins.
    const lateNight = [makeLunation('full', '2026-08-09T00:40:00+01:00')]
    expect(lunationsOn(lateNight, new Date('2026-08-09T10:00:00+01:00'), TZ)).toHaveLength(1)
    expect(lunationsOn(lateNight, new Date('2026-08-08T10:00:00+01:00'), TZ)).toHaveLength(0)
  })

  it('returns every lunation on the day, not just the first', () => {
    const twice = [
      makeLunation('new', '2026-08-08T02:00:00+01:00'),
      makeLunation('full', '2026-08-08T22:00:00+01:00'),
    ]
    expect(lunationsOn(twice, new Date('2026-08-08T12:00:00+01:00'), TZ)).toHaveLength(2)
  })

  it('is empty for an empty list', () => {
    expect(lunationsOn([], new Date('2026-08-08T12:00:00+01:00'), TZ)).toEqual([])
  })
})
