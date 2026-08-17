// Mirrors the JSON that scripts/transits/build_calendar.py --json emits.
// Absent material is null, never a placeholder — see window.py's docstring.

export interface Pole {
  gate: number
  name: string | null
  centre: string | null
  frame: string
  /** Read per pole — either gate may have this written. */
  essence: string | null
  somatic: string | null
}

export interface Axis {
  sentence: string
  lead: string | null
  sun: Pole
  earth: Pole
}

export interface Bridge {
  sign: string
  text: string
}

export interface Nervous {
  source: string
  level: string
  text: string
}

export interface Practice {
  type: string | null
  media: string | null
  duration: string | null
  text: string | null
}

export interface Lookback {
  date: string
  gap: string
  text: string | null
}

export interface Crossrefs {
  opposite: string
  channels: string[]
}

export interface Window {
  gate: number
  name: string | null
  sign: string
  start: string
  end: string
  days: number
  tagline: string | null
  axis: Axis
  bridge: Bridge | null
  risk: string | null
  /** The Sun gate's — the window is the Sun's transit. */
  question: string | null
  shows_up: string | null
  /**
   * The Transit `### Sun` / `### Earth` subsections, removed from the vault
   * on 2026-08-17 and 0/64 since. Kept because they may return; `essence` on
   * each pole carries what they used to.
   */
  sun_reading: string | null
  earth_reading: string | null
  earth_fallback: string
  nervous: Nervous | null
  practice: Practice | null
  lookback: Lookback | null
  crossrefs: Crossrefs
}

export interface Lunation {
  phase: 'new' | 'full'
  moment: string
  gate: number
  line: number
  sun_gate: number
}

export interface FieldData {
  anchor: string
  start: string
  end: string
  generated: string
  lunations: Lunation[]
  windows: Window[]
}
