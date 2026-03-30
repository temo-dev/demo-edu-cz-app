/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from "react";
import { useUserStore } from "./store/userStore";
import OnboardingScreen from "./screens/OnboardingScreen";
import HomeScreen from "./screens/HomeScreen";
import CourseMapScreen from "./screens/CourseMapScreen";
import LessonScreen from "./screens/LessonScreen";
import ReviewScreen from "./screens/ReviewScreen";
import ProfileScreen from "./screens/ProfileScreen";
import PlacementTestScreen from "./screens/PlacementTestScreen";
import MediaFeedScreen from "./screens/MediaFeedScreen";
import CommunityScreen from "./screens/CommunityScreen";
import ClassroomScreen from "./screens/ClassroomScreen";
import AppShell from "./components/layout/AppShell";

export type Screen =
  | "home"
  | "course"
  | "profile"
  | "lesson"
  | "review"
  | "media"
  | "community"
  | "classroom";

interface NavCtx {
  screen: Screen;
  lessonId: string | null;
  navigate: (screen: Screen, lessonId?: string) => void;
}

export const NavContext = createContext<NavCtx>({
  screen: "home",
  lessonId: null,
  navigate: () => {},
});

export function useNav() {
  return useContext(NavContext);
}

export default function App() {
  const onboardingDone = useUserStore((s) => s.onboardingDone);
  const placementDone = useUserStore((s) => s.placementDone);
  const checkStreak = useUserStore((s) => s.checkStreak);
  const [screen, setScreen] = useState<Screen>("home");
  const [lessonId, setLessonId] = useState<string | null>(null);
  const [showPlacement, setShowPlacement] = useState(false);

  useEffect(() => {
    checkStreak();
  }, []);

  // After onboarding done, check if placement is needed
  useEffect(() => {
    if (onboardingDone && !placementDone) {
      setShowPlacement(true);
    }
  }, [onboardingDone, placementDone]);

  function navigate(s: Screen, lid?: string) {
    setLessonId(lid ?? null);
    setScreen(s);
    window.scrollTo(0, 0);
  }

  if (!onboardingDone) {
    return <OnboardingScreen />;
  }

  if (showPlacement) {
    return (
      <div className="min-h-screen bg-babbel-bg flex flex-col max-w-md mx-auto shadow-2xl relative">
        <PlacementTestScreen onDone={() => setShowPlacement(false)} />
      </div>
    );
  }

  const isActivity = screen === "lesson" || screen === "review";

  const shellScreens: Screen[] = [
    "home",
    "course",
    "media",
    "community",
    "profile",
  ];

  return (
    <NavContext.Provider value={{ screen, lessonId, navigate }}>
      <div className="min-h-screen bg-babbel-bg flex flex-col max-w-md mx-auto shadow-2xl relative">
        {isActivity ? (
          screen === "lesson" && lessonId ? (
            <LessonScreen lessonId={lessonId} />
          ) : (
            <ReviewScreen />
          )
        ) : (
          <>
            <div className="flex-1 pb-20">
              {screen === "home" && <HomeScreen />}
              {screen === "course" && <CourseMapScreen />}
              {screen === "media" && <MediaFeedScreen />}
              {screen === "community" && <CommunityScreen />}
              {screen === "classroom" && <ClassroomScreen />}
              {screen === "profile" && <ProfileScreen />}
            </div>
            {shellScreens.includes(screen) && <AppShell />}
          </>
        )}
      </div>
    </NavContext.Provider>
  );
}
