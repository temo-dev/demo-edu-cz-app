import { Flame, Star, BookOpen, RotateCcw } from 'lucide-react'
import { useUserStore } from '../store/userStore'
import { useProgressStore } from '../store/progressStore'
import { useReviewStore } from '../store/reviewStore'
import { useNav } from '../App'
import { course } from '../data/curriculum'

export default function HomeScreen() {
  const { name, xp, streak, todayXP, dailyGoalXP } = useUserStore()
  const { lastLessonId, isLessonUnlocked } = useProgressStore()
  const dueCount = useReviewStore((s) => s.getDueCount())
  const { navigate } = useNav()

  const goalPct = Math.min(1, todayXP / dailyGoalXP)
  const level = Math.floor(xp / 500) + 1

  // Find next lesson to do
  const allLessons = course.units.flatMap((u) => u.lessons)
  const nextLesson = allLessons.find((l) => isLessonUnlocked(l.id) && l.id !== lastLessonId)
    ?? allLessons.find((l) => isLessonUnlocked(l.id))

  return (
    <div className="bg-white min-h-full">
      {/* Header */}
      <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 px-5 pt-12 pb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-emerald-100 text-sm font-medium">Xin chào,</p>
            <h1 className="text-white text-2xl font-extrabold">{name} 👋</h1>
          </div>
          <div className="flex items-center gap-2 bg-white/20 px-3 py-2 rounded-xl">
            <Flame size={20} className="text-orange-300" />
            <span className="text-white font-bold">{streak}</span>
          </div>
        </div>

        {/* XP Level badge */}
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-brand-yellow w-10 h-10 rounded-full flex items-center justify-center font-extrabold text-gray-800 text-sm shadow">
            {level}
          </div>
          <div className="flex-1">
            <div className="flex justify-between text-xs text-emerald-100 mb-1">
              <span>Cấp độ {level}</span>
              <span>{xp} XP</span>
            </div>
            <div className="h-2 bg-white/30 rounded-full overflow-hidden">
              <div
                className="h-full bg-brand-yellow rounded-full transition-all duration-500"
                style={{ width: `${((xp % 500) / 500) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Daily Goal */}
        <div className="bg-white/20 rounded-2xl p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-white font-semibold text-sm">🎯 Mục tiêu hôm nay</span>
            <span className="text-white text-sm font-bold">{todayXP}/{dailyGoalXP} XP</span>
          </div>
          <div className="h-3 bg-white/30 rounded-full overflow-hidden">
            <div
              className="h-full bg-brand-yellow rounded-full transition-all duration-700"
              style={{ width: `${goalPct * 100}%` }}
            />
          </div>
          {goalPct >= 1 && (
            <p className="text-brand-yellow text-xs font-bold mt-1 text-center">✅ Đạt mục tiêu hôm nay!</p>
          )}
        </div>
      </div>

      {/* Action Cards */}
      <div className="px-5 py-6 flex flex-col gap-4">
        {/* Continue Learning */}
        {nextLesson && (
          <button
            onClick={() => navigate('lesson', nextLesson.id)}
            className="w-full bg-brand-green text-white rounded-2xl p-5 flex items-center gap-4 shadow-lg shadow-green-200 active:scale-98 transition-transform"
          >
            <div className="bg-white/20 rounded-xl p-3">
              <BookOpen size={28} className="text-white" />
            </div>
            <div className="text-left flex-1">
              <p className="text-sm text-green-100 font-medium">Tiếp tục học</p>
              <p className="text-lg font-extrabold">{nextLesson.title}</p>
              <p className="text-green-100 text-sm">{nextLesson.subtitle}</p>
            </div>
            <div className="text-white/80 text-2xl">→</div>
          </button>
        )}

        {/* Review */}
        {dueCount > 0 && (
          <button
            onClick={() => navigate('review')}
            className="w-full bg-brand-blue text-white rounded-2xl p-5 flex items-center gap-4 shadow-lg shadow-blue-200 active:scale-98 transition-transform"
          >
            <div className="bg-white/20 rounded-xl p-3">
              <RotateCcw size={28} className="text-white" />
            </div>
            <div className="text-left flex-1">
              <p className="text-sm text-blue-100 font-medium">Ôn tập</p>
              <p className="text-lg font-extrabold">Ôn tập hôm nay</p>
              <p className="text-blue-100 text-sm">{dueCount} từ cần ôn</p>
            </div>
            <div className="bg-red-500 text-white text-sm font-bold w-7 h-7 rounded-full flex items-center justify-center">
              {dueCount}
            </div>
          </button>
        )}

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-orange-50 rounded-2xl p-4 text-center">
            <Flame size={24} className="text-orange-500 mx-auto mb-1" />
            <p className="text-2xl font-extrabold text-orange-600">{streak}</p>
            <p className="text-xs text-orange-400 font-medium">Ngày liên tiếp</p>
          </div>
          <div className="bg-emerald-50 rounded-2xl p-4 text-center">
            <Star size={24} className="text-emerald-500 mx-auto mb-1" />
            <p className="text-2xl font-extrabold text-emerald-600">{xp}</p>
            <p className="text-xs text-emerald-400 font-medium">Tổng XP</p>
          </div>
          <div className="bg-violet-50 rounded-2xl p-4 text-center">
            <BookOpen size={24} className="text-violet-500 mx-auto mb-1" />
            <p className="text-2xl font-extrabold text-violet-600">{level}</p>
            <p className="text-xs text-violet-400 font-medium">Cấp độ</p>
          </div>
        </div>
      </div>
    </div>
  )
}
