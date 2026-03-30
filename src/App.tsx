import { createContext, useContext, useState, useEffect } from 'react'
import { useUserStore } from './store/userStore'
import OnboardingScreen from './screens/OnboardingScreen'
import HomeScreen from './screens/HomeScreen'
import CourseMapScreen from './screens/CourseMapScreen'
import LessonScreen from './screens/LessonScreen'
import ReviewScreen from './screens/ReviewScreen'
import ProfileScreen from './screens/ProfileScreen'
import AppShell from './components/layout/AppShell'

export type Screen = 'home' | 'course' | 'profile' | 'lesson' | 'review'

interface NavCtx {
  screen: Screen
  lessonId: string | null
  navigate: (screen: Screen, lessonId?: string) => void
}

export const NavContext = createContext<NavCtx>({
  screen: 'home',
  lessonId: null,
  navigate: () => {},
})

export function useNav() {
  return useContext(NavContext)
}

export default function App() {
  const onboardingDone = useUserStore((s) => s.onboardingDone)
  const checkStreak = useUserStore((s) => s.checkStreak)
  const [screen, setScreen] = useState<Screen>('home')
  const [lessonId, setLessonId] = useState<string | null>(null)

  useEffect(() => {
    checkStreak()
  }, [])

  function navigate(s: Screen, lid?: string) {
    setLessonId(lid ?? null)
    setScreen(s)
    window.scrollTo(0, 0)
  }

  if (!onboardingDone) {
    return <OnboardingScreen />
  }

  const isActivity = screen === 'lesson' || screen === 'review'

  return (
    <NavContext.Provider value={{ screen, lessonId, navigate }}>
      <div className="min-h-screen bg-babbel-bg flex flex-col max-w-md mx-auto shadow-2xl relative">
        {isActivity ? (
          screen === 'lesson' && lessonId ? (
            <LessonScreen lessonId={lessonId} />
          ) : (
            <ReviewScreen />
          )
        ) : (
          <>
            <div className="flex-1 pb-20">
              {screen === 'home' && <HomeScreen />}
              {screen === 'course' && <CourseMapScreen />}
              {screen === 'profile' && <ProfileScreen />}
            </div>
            <AppShell />
          </>
        )}
      </div>
    </NavContext.Provider>
  )
}
