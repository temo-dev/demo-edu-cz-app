import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CEFRLevel } from '../types/content'

interface UserState {
  name: string
  xp: number
  streak: number
  lastActivityDate: string
  dailyGoalXP: number
  todayXP: number
  onboardingDone: boolean
  cefrLevel: CEFRLevel
  placementDone: boolean
  notificationsEnabled: boolean
  notificationHour: number
  bookmarkedMediaIds: string[]

  setName: (name: string) => void
  setDailyGoal: (xp: number) => void
  completeOnboarding: (name: string, goalXP: number) => void
  completePlacement: (level: CEFRLevel) => void
  skipPlacement: () => void
  addXP: (amount: number) => void
  checkStreak: () => void
  setNotifications: (enabled: boolean, hour?: number) => void
  toggleBookmark: (mediaId: string) => void
}

function todayISO() {
  return new Date().toISOString().split('T')[0]
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      name: '',
      xp: 0,
      streak: 0,
      lastActivityDate: '',
      dailyGoalXP: 20,
      todayXP: 0,
      onboardingDone: false,
      cefrLevel: 'A1',
      placementDone: false,
      notificationsEnabled: false,
      notificationHour: 20,
      bookmarkedMediaIds: [],

      setName: (name) => set({ name }),
      setDailyGoal: (xp) => set({ dailyGoalXP: xp }),

      completeOnboarding: (name, goalXP) =>
        set({ name, dailyGoalXP: goalXP, onboardingDone: true }),

      completePlacement: (level) =>
        set({ cefrLevel: level, placementDone: true }),

      skipPlacement: () =>
        set({ cefrLevel: 'A1', placementDone: true }),

      addXP: (amount) => {
        const today = todayISO()
        const { lastActivityDate, todayXP, streak } = get()
        const isNewDay = lastActivityDate !== today
        const wasYesterday =
          lastActivityDate ===
          new Date(Date.now() - 86400000).toISOString().split('T')[0]
        set({
          xp: get().xp + amount,
          todayXP: isNewDay ? amount : todayXP + amount,
          lastActivityDate: today,
          streak: isNewDay ? (wasYesterday ? streak + 1 : 1) : streak,
        })
      },

      checkStreak: () => {
        const { lastActivityDate, streak } = get()
        const today = todayISO()
        if (lastActivityDate === today) return
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]
        if (lastActivityDate < yesterday && streak > 0) {
          set({ streak: 0, todayXP: 0 })
        } else if (lastActivityDate !== today) {
          set({ todayXP: 0 })
        }
      },

      setNotifications: (enabled, hour) =>
        set({ notificationsEnabled: enabled, ...(hour !== undefined ? { notificationHour: hour } : {}) }),

      toggleBookmark: (mediaId) => {
        const { bookmarkedMediaIds } = get()
        set({
          bookmarkedMediaIds: bookmarkedMediaIds.includes(mediaId)
            ? bookmarkedMediaIds.filter((id) => id !== mediaId)
            : [...bookmarkedMediaIds, mediaId],
        })
      },
    }),
    { name: 'user-store' }
  )
)
