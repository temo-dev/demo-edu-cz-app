import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { course } from '../data/curriculum'

interface ProgressState {
  completedLessonIds: string[]
  lessonStars: Record<string, 1 | 2 | 3>
  lastLessonId: string | null

  completeLesson: (lessonId: string, stars: 1 | 2 | 3) => void
  isLessonComplete: (lessonId: string) => boolean
  isLessonUnlocked: (lessonId: string) => boolean
  getUnitProgress: (unitId: string) => { completed: number; total: number }
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      completedLessonIds: [],
      lessonStars: {},
      lastLessonId: null,

      completeLesson: (lessonId, stars) => {
        set((s) => ({
          completedLessonIds: s.completedLessonIds.includes(lessonId)
            ? s.completedLessonIds
            : [...s.completedLessonIds, lessonId],
          lessonStars: {
            ...s.lessonStars,
            [lessonId]: Math.max(s.lessonStars[lessonId] ?? 0, stars) as 1 | 2 | 3,
          },
          lastLessonId: lessonId,
        }))
      },

      isLessonComplete: (lessonId) => get().completedLessonIds.includes(lessonId),

      isLessonUnlocked: (lessonId) => {
        const { completedLessonIds } = get()
        for (const unit of course.units) {
          const idx = unit.lessons.findIndex((l) => l.id === lessonId)
          if (idx === -1) continue

          // First lesson of first unit is always unlocked
          if (idx === 0 && !unit.prerequisiteUnitId) return true

          // First lesson of subsequent unit: require previous unit complete
          if (idx === 0 && unit.prerequisiteUnitId) {
            const prevUnit = course.units.find((u) => u.id === unit.prerequisiteUnitId)
            if (!prevUnit) return false
            return prevUnit.lessons.every((l) => completedLessonIds.includes(l.id))
          }

          // Other lessons: require previous lesson complete
          return completedLessonIds.includes(unit.lessons[idx - 1].id)
        }
        return false
      },

      getUnitProgress: (unitId) => {
        const unit = course.units.find((u) => u.id === unitId)
        if (!unit) return { completed: 0, total: 0 }
        const { completedLessonIds } = get()
        return {
          completed: unit.lessons.filter((l) => completedLessonIds.includes(l.id)).length,
          total: unit.lessons.length,
        }
      },
    }),
    { name: 'progress-store' }
  )
)
