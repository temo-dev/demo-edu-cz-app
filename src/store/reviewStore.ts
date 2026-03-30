import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { createRecord, updateSM2, isDue, type SM2Record } from '../engine/sm2'

interface ReviewState {
  records: Record<string, SM2Record>

  addVocabToReview: (vocabId: string) => void
  updateRecord: (vocabId: string, quality: number) => void
  getDueItems: () => SM2Record[]
  getDueCount: () => number
}

export const useReviewStore = create<ReviewState>()(
  persist(
    (set, get) => ({
      records: {},

      addVocabToReview: (vocabId) => {
        if (get().records[vocabId]) return
        set((s) => ({
          records: { ...s.records, [vocabId]: createRecord(vocabId) },
        }))
      },

      updateRecord: (vocabId, quality) => {
        const rec = get().records[vocabId]
        if (!rec) return
        set((s) => ({
          records: { ...s.records, [vocabId]: updateSM2(rec, quality) },
        }))
      },

      getDueItems: () => Object.values(get().records).filter(isDue),

      getDueCount: () => Object.values(get().records).filter(isDue).length,
    }),
    { name: 'review-store' }
  )
)
