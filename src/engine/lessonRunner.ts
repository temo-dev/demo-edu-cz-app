import type { Lesson } from '../types/content'
import type { Exercise } from '../types/exercise'
import { vocabulary, vocabMap } from '../data/vocabulary'

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function getDistractors(correctId: string, count: number, fromIds?: string[]): string[] {
  const pool = (fromIds ?? vocabulary.map((v) => v.id)).filter((id) => id !== correctId)
  return shuffle(pool).slice(0, count)
}

export function buildExercises(lesson: Lesson): Exercise[] {
  const exercises: Exercise[] = []

  for (const def of lesson.exercises) {
    const ids = def.vocabIds

    if (def.type === 'flashcard') {
      for (const id of ids) {
        exercises.push({ type: 'flashcard', vocabId: id })
      }
    }

    if (def.type === 'multipleChoice') {
      for (const id of ids) {
        const item = vocabMap[id]
        if (!item) continue
        const distractorIds = getDistractors(id, 3, ids.length >= 4 ? ids : undefined)
        const options = shuffle([
          { id, text: item.vietnamese },
          ...distractorIds.map((did) => ({ id: did, text: vocabMap[did]?.vietnamese ?? did })),
        ])
        exercises.push({
          type: 'multipleChoice',
          question: item.czech,
          questionLang: 'czech',
          vocabId: id,
          options,
          correctId: id,
        })
      }
    }

    if (def.type === 'matching') {
      // Group up to 5 pairs per matching exercise
      const chunks: string[][] = []
      for (let i = 0; i < ids.length; i += 5) chunks.push(ids.slice(i, i + 5))
      for (const chunk of chunks) {
        const pairs = chunk
          .map((id) => {
            const v = vocabMap[id]
            return v ? { id, czech: v.czech, vietnamese: v.vietnamese } : null
          })
          .filter(Boolean) as { id: string; czech: string; vietnamese: string }[]
        if (pairs.length >= 2) exercises.push({ type: 'matching', pairs })
      }
    }

    if (def.type === 'listening') {
      for (const id of ids) {
        const item = vocabMap[id]
        if (!item) continue
        const distractorIds = getDistractors(id, 3, ids)
        const options = shuffle([
          { id, text: item.vietnamese },
          ...distractorIds.map((did) => ({ id: did, text: vocabMap[did]?.vietnamese ?? did })),
        ])
        exercises.push({
          type: 'listening',
          vocabId: id,
          options,
          correctId: id,
        })
      }
    }

    if (def.type === 'fillBlank') {
      // Simple fill-blank from vocab: "Tiếng Séc của '___ chào' là ___"
      const fillPairs: Array<{ czech: string; answer: string; wordBank: string[] }> = []
      for (const id of ids) {
        const item = vocabMap[id]
        if (!item) continue
        const distractorIds = getDistractors(id, 3, ids)
        const wordBank = shuffle([item.czech, ...distractorIds.map((d) => vocabMap[d]?.czech ?? d)])
        fillPairs.push({
          czech: item.vietnamese,
          answer: item.czech,
          wordBank,
        })
      }
      for (const pair of fillPairs) {
        exercises.push({
          type: 'fillBlank',
          sentenceVi: `"${pair.czech}" trong tiếng Séc là:`,
          sentenceCs: pair.answer,
          answer: pair.answer,
          wordBank: pair.wordBank,
        })
      }
    }
  }

  return exercises
}
