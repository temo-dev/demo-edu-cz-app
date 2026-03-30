import { Flame, Star, BookOpen, RotateCcw, Trophy } from 'lucide-react'
import { useUserStore } from '../store/userStore'
import { useProgressStore } from '../store/progressStore'
import { useReviewStore } from '../store/reviewStore'
import { course } from '../data/curriculum'

const BADGES = [
  { id: 'first_lesson', label: 'Bài học đầu tiên', emoji: '🌟', xpRequired: 0, lessonsRequired: 1 },
  { id: 'streak_3', label: '3 ngày liên tiếp', emoji: '🔥', streakRequired: 3 },
  { id: 'xp_50', label: '50 XP', emoji: '⚡', xpRequired: 50 },
  { id: 'unit_complete', label: 'Hoàn thành 1 đơn vị', emoji: '🏅', unitsRequired: 1 },
  { id: 'xp_200', label: '200 XP', emoji: '💎', xpRequired: 200 },
  { id: 'all_units', label: 'Master tiếng Séc', emoji: '👑', unitsRequired: 2 },
]

export default function ProfileScreen() {
  const { name, xp, streak, dailyGoalXP, todayXP } = useUserStore()
  const { completedLessonIds, lessonStars } = useProgressStore()
  const totalVocab = useReviewStore((s) => Object.keys(s.records).length)
  const level = Math.floor(xp / 500) + 1

  const completedUnits = course.units.filter((u) =>
    u.lessons.every((l) => completedLessonIds.includes(l.id))
  ).length
  const totalStars = Object.values(lessonStars).reduce((a, b) => a + b, 0)

  function hasBadge(b: typeof BADGES[0]) {
    if ('xpRequired' in b && b.xpRequired && xp < b.xpRequired) return false
    if ('streakRequired' in b && streak < b.streakRequired!) return false
    if ('lessonsRequired' in b && completedLessonIds.length < b.lessonsRequired!) return false
    if ('unitsRequired' in b && completedUnits < b.unitsRequired!) return false
    return true
  }

  return (
    <div className="bg-white min-h-full">
      {/* Header */}
      <div className="bg-gradient-to-br from-violet-500 to-violet-700 px-5 pt-12 pb-8 text-center">
        <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center text-4xl mx-auto mb-3 shadow-xl">
          🧑‍🎓
        </div>
        <h1 className="text-white text-2xl font-extrabold">{name}</h1>
        <p className="text-violet-200 text-sm">Cấp độ {level}</p>
        <div className="mt-3 h-2 bg-white/20 rounded-full mx-8 overflow-hidden">
          <div
            className="h-full bg-brand-yellow rounded-full"
            style={{ width: `${((xp % 500) / 500) * 100}%` }}
          />
        </div>
        <p className="text-violet-200 text-xs mt-1">{xp % 500}/500 XP đến cấp {level + 1}</p>
      </div>

      <div className="px-5 py-6 flex flex-col gap-5">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { Icon: Flame, label: 'Chuỗi ngày', value: streak, color: 'bg-orange-50 text-orange-500', num: 'text-orange-600' },
            { Icon: Star, label: 'Tổng XP', value: xp, color: 'bg-emerald-50 text-emerald-500', num: 'text-emerald-600' },
            { Icon: BookOpen, label: 'Bài đã học', value: completedLessonIds.length, color: 'bg-blue-50 text-blue-500', num: 'text-blue-600' },
            { Icon: RotateCcw, label: 'Từ đã học', value: totalVocab, color: 'bg-violet-50 text-violet-500', num: 'text-violet-600' },
          ].map(({ Icon, label, value, color, num }) => (
            <div key={label} className={`${color.split(' ')[0]} rounded-2xl p-4 flex items-center gap-3`}>
              <Icon size={24} className={color.split(' ')[1]} />
              <div>
                <p className={`text-xl font-extrabold ${num}`}>{value}</p>
                <p className="text-gray-500 text-xs">{label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Mục tiêu hôm nay */}
        <div className="bg-gray-50 rounded-2xl p-4">
          <div className="flex justify-between items-center mb-2">
            <p className="font-bold text-gray-700">🎯 Mục tiêu hôm nay</p>
            <p className="text-gray-500 text-sm font-medium">{todayXP}/{dailyGoalXP} XP</p>
          </div>
          <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-brand-green rounded-full transition-all"
              style={{ width: `${Math.min(1, todayXP / dailyGoalXP) * 100}%` }}
            />
          </div>
        </div>

        {/* Badges */}
        <div>
          <h2 className="font-extrabold text-gray-800 text-lg mb-3 flex items-center gap-2">
            <Trophy size={20} className="text-brand-yellow" />
            Thành tích
          </h2>
          <div className="grid grid-cols-3 gap-3">
            {BADGES.map((badge) => {
              const earned = hasBadge(badge)
              return (
                <div
                  key={badge.id}
                  className={`rounded-2xl p-3 text-center ${
                    earned ? 'bg-brand-yellow/10 border-2 border-brand-yellow/30' : 'bg-gray-100 opacity-40'
                  }`}
                >
                  <div className="text-3xl mb-1">{badge.emoji}</div>
                  <p className="text-xs font-bold text-gray-700 leading-tight">{badge.label}</p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Stars */}
        <div className="bg-gray-50 rounded-2xl p-4 text-center">
          <p className="text-gray-500 text-sm mb-1">Tổng sao đã kiếm</p>
          <p className="text-3xl font-extrabold text-brand-yellow">
            {'⭐'.repeat(Math.min(totalStars, 10))}{totalStars > 10 ? ` (${totalStars})` : ''}
          </p>
          {totalStars === 0 && <p className="text-gray-400 text-sm mt-1">Hoàn thành bài học để nhận sao!</p>}
        </div>
      </div>
    </div>
  )
}
