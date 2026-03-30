import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface UserState {
  name: string
  xp: number
  streak: number
  lastActivityDate: string
  dailyGoalXP: number
  todayXP: number
  onboardingDone: boolean

  setName: (name: string) => void
  setDailyGoal: (xp: number) => void
  completeOnboarding: (name: string, goalXP: number) => void
  addXP: (amount: number) => void
  checkStreak: () => void
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

      setName: (name) => set({ name }),
      setDailyGoal: (xp) => set({ dailyGoalXP: xp }),

      completeOnboarding: (name, goalXP) =>
        set({ name, dailyGoalXP: goalXP, onboardingDone: true }),

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
    }),
    { name: 'user-store' }
  )
)
