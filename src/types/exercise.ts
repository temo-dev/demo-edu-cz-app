export type Exercise =
  | {
      type: 'flashcard'
      vocabId: string
    }
  | {
      type: 'multipleChoice'
      question: string
      questionLang: 'czech' | 'vietnamese'
      vocabId: string
      options: Array<{ id: string; text: string }>
      correctId: string
    }
  | {
      type: 'fillBlank'
      sentenceVi: string   // Vietnamese sentence with ___ for blank
      sentenceCs: string   // Czech sentence for context
      answer: string
      wordBank: string[]
    }
  | {
      type: 'matching'
      pairs: Array<{ id: string; czech: string; vietnamese: string }>
    }
  | {
      type: 'listening'
      vocabId: string
      options: Array<{ id: string; text: string }>
      correctId: string
    }
  | {
      type: 'speaking'
      vocabId: string
      prompt: string      // Vietnamese — what to say
      answer: string      // Czech — expected speech
      pronunciation: string
    }

export interface ExerciseResult {
  exerciseIndex: number
  correct: boolean
  timeMs: number
}
