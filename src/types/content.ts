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
  | 'grammar'
  | 'reading'
  | 'writing'
  | 'video'

export type CEFRLevel = 'A1' | 'A2' | 'B1'

export interface ExerciseDef {
  type: ExerciseType
  vocabIds: string[]
  // For grammar/reading/writing/video: pass full exercise data here
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any
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
