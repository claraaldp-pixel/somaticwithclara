import type { MoonCycleContent } from './types'

/**
 * Add a record when the written questions and meditation links for a New Moon
 * are ready. The moment must exactly match the corresponding `lunations`
 * entry in windows.json.
 */
export const moonCycleContent: MoonCycleContent[] = [
  {
    newMoonMoment: '2026-08-12T18:36:43.560461+01:00',
    reflectionQuestions: [
      'What question or situation am I trying to have all figured out?',
      "What am I afraid I’d have to feel if I can’t have a working plan?",
    ],
    emotionsQuestion: null,
    newMoonMeditationUrl: null,
    fullMoonQuestions: [
      'What emotion am I trying to shift out of by bringing logic into it?',
      'Whose fault do I attribute it to?',
      'What did the low of this wave show me that the high couldn’t?',
    ],
    fullMoonMeditationUrl: null,
  },
]

export function contentForMoonCycle(newMoonMoment: string): MoonCycleContent | null {
  return moonCycleContent.find((cycle) => cycle.newMoonMoment === newMoonMoment) ?? null
}
