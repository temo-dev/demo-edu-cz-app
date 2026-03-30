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
      prompt: string
      answer: string
      pronunciation: string
    }
  | {
      type: 'grammar'
      ruleTitle: string
      ruleVi: string
      example: { cs: string; vi: string }
      question: string
      options: Array<{ id: string; text: string }>
      correctId: string
      explanation: string
    }
  | {
      type: 'reading'
      passageCs: string
      passageVi: string
      questions: Array<{
        id: string
        question: string
        options: Array<{ id: string; text: string }>
        correctId: string
      }>
    }
  | {
      type: 'writing'
      promptVi: string
      answer: string
      hint?: string
    }
  | {
      type: 'video'
      youtubeId: string
      title: string
      level: string
      question: string
      options: Array<{ id: string; text: string }>
      correctId: string
    }

export interface ExerciseResult {
  exerciseIndex: number
  correct: boolean
  timeMs: number
}
