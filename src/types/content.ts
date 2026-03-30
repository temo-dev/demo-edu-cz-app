export interface VocabItem {
  id: string
  czech: string
  vietnamese: string
  pronunciation: string // phonetic guide for Vietnamese speakers
  audioFile?: string
  partOfSpeech: 'noun' | 'verb' | 'adjective' | 'phrase' | 'number' | 'adverb'
  tags: string[]
  gender?: 'masculine' | 'feminine' | 'neuter'
  example?: { czech: string; vietnamese: string }
}

export type ExerciseType =
  | 'flashcard'
  | 'multipleChoice'
  | 'fillBlank'
  | 'matching'
  | 'listening'
  | 'speaking'

export interface ExerciseDef {
  type: ExerciseType
  vocabIds: string[]
  extra?: Record<string, unknown>
}

export interface Lesson {
  id: string
  title: string
  subtitle?: string
  xpReward: number
  exercises: ExerciseDef[]
}

export interface Unit {
  id: string
  title: string
  subtitle: string
  color: string      // tailwind bg color
  darkColor: string  // tailwind border/text color
  icon: string       // emoji
  lessons: Lesson[]
  prerequisiteUnitId?: string
}

export interface Course {
  id: string
  title: string
  level: 'beginner' | 'intermediate' | 'advanced'
  units: Unit[]
}
