import { Flame, Star, BookOpen, RotateCcw, Trophy, ChevronRight, Bell, BellOff } from 'lucide-react'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { useUserStore } from '../store/userStore'
import { useProgressStore } from '../store/progressStore'
import { useReviewStore } from '../store/reviewStore'
import { course } from '../data/curriculum'
import { useNav } from '../App'

const BADGES = [
  { id: 'first_lesson', label: 'Bài đầu tiên', emoji: '🌟', lessonsRequired: 1 },
  { id: 'streak_3',     label: '3 ngày liên tiếp', emoji: '🔥', streakRequired: 3 },
  { id: 'xp_50',        label: '50 XP',         emoji: '⚡', xpRequired: 50 },
  { id: 'unit_1',       label: 'Xong 1 đơn vị',  emoji: '🏅', unitsRequired: 1 },
  { id: 'xp_200',       label: '200 XP',         emoji: '💎', xpRequired: 200 },
  { id: 'master',       label: 'Master Séc',     emoji: '👑', unitsRequired: 2 },
]

export default function ProfileScreen() {
  const { name, xp, streak, dailyGoalXP, todayXP, cefrLevel, notificationsEnabled, notificationHour, setNotifications } = useUserStore()
  const { navigate } = useNav()
  const [notifHour, setNotifHour] = useState(notificationHour)

  async function handleToggleNotif() {
    if (!notificationsEnabled) {
      const perm = await Notification.requestPermission()
      if (perm === 'granted') {
        setNotifications(true, notifHour)
      }
    } else {
      setNotifications(false)
    }
  }
  const { completedLessonIds, lessonStars } = useProgressStore()
  const totalVocab = useReviewStore((s) => Object.keys(s.records).length)
  const level = Math.floor(xp / 500) + 1
  const xpToNext = 500 - (xp % 500)

  const completedUnits = course.units.filter((u) =>
    u.lessons.every((l) => completedLessonIds.includes(l.id))
  ).length
  const totalStars = Object.values(lessonStars).reduce((a, b) => a + b, 0)

  function hasBadge(b: typeof BADGES[0]) {
    const xpReq = (b as { xpRequired?: number }).xpRequired
    const streakReq = (b as { streakRequired?: number }).streakRequired
    const lessonsReq = (b as { lessonsRequired?: number }).lessonsRequired
    const unitsReq = (b as { unitsRequired?: number }).unitsRequired
    if (xpReq && xp < xpReq) return false
    if (streakReq && streak < streakReq) return false
    if (lessonsReq && completedLessonIds.length < lessonsReq) return false
    if (unitsReq && completedUnits < unitsReq) return false
    return true
  }

  const STATS = [
    { Icon: Flame,    label: 'Chuỗi ngày', value: streak,                    color: 'text-babbel-orange', bg: 'bg-orange-50' },
    { Icon: Star,     label: 'Tổng XP',    value: xp,                        color: 'text-amber-500',     bg: 'bg-amber-50'  },
    { Icon: BookOpen, label: 'Bài đã học', value: completedLessonIds.length, color: 'text-sky-500',       bg: 'bg-sky-50'    },
    { Icon: RotateCcw,label: 'Từ đã học',  value: totalVocab,                color: 'text-violet-500',    bg: 'bg-violet-50' },
  ]

  return (
    <div className="bg-babbel-bg min-h-full">
      {/* Header */}
      <div className="bg-white px-5 pt-12 pb-6 border-b border-babbel-border">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-babbel-cream border-2 border-babbel-border flex items-center justify-center text-3xl shadow-sm">
            🧑‍🎓
          </div>
          <div className="flex-1">
            <h1 className="text-babbel-text text-xl font-extrabold">{name}</h1>
            <p className="text-babbel-muted text-sm">Cấp độ {level} · {xpToNext} XP đến cấp tiếp</p>
            <span className="inline-block mt-1 text-xs font-bold px-2 py-0.5 rounded-full bg-orange-100 text-babbel-orange">
              Trình độ {cefrLevel}
            </span>
          </div>
        </div>

        {/* XP bar */}
        <div className="mt-4 h-2.5 bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-babbel-orange rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${((xp % 500) / 500) * 100}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </div>
        <div className="flex justify-between text-xs text-babbel-muted mt-1">
          <span>{xp % 500} XP</span>
          <span>500 XP</span>
        </div>
      </div>

      <div className="px-5 py-5 flex flex-col gap-5">
        {/* Stats */}
        <div className="bg-white rounded-3xl border border-babbel-border p-5">
          <h2 className="text-babbel-text font-extrabold text-base mb-4">Thống kê</h2>
          <div className="grid grid-cols-2 gap-3">
            {STATS.map(({ Icon, label, value, color, bg }) => (
              <div key={label} className={`${bg} rounded-2xl p-4 flex items-center gap-3`}>
                <Icon size={22} className={color} />
                <div>
                  <p className={`text-xl font-extrabold ${color}`}>{value}</p>
                  <p className="text-babbel-muted text-xs">{label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Daily goal */}
        <div className="bg-white rounded-3xl border border-babbel-border p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-babbel-text font-extrabold text-base">Mục tiêu hôm nay</h2>
            <span className="text-babbel-orange font-bold text-sm">{todayXP}/{dailyGoalXP} XP</span>
          </div>
          <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-babbel-orange rounded-full transition-all duration-700"
              style={{ width: `${Math.min(1, todayXP / dailyGoalXP) * 100}%` }}
            />
          </div>
          {todayXP >= dailyGoalXP && (
            <p className="text-babbel-orange text-xs font-bold mt-2 text-center">✅ Hoàn thành mục tiêu hôm nay!</p>
          )}
        </div>

        {/* Badges */}
        <div className="bg-white rounded-3xl border border-babbel-border p-5">
          <div className="flex items-center gap-2 mb-4">
            <Trophy size={18} className="text-amber-500" />
            <h2 className="text-babbel-text font-extrabold text-base">Thành tích</h2>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {BADGES.map((badge) => {
              const earned = hasBadge(badge)
              return (
                <div
                  key={badge.id}
                  className={`rounded-2xl p-3 text-center border ${
                    earned
                      ? 'bg-amber-50 border-amber-200'
                      : 'bg-gray-50 border-babbel-border opacity-40'
                  }`}
                >
                  <div className="text-3xl mb-1">{badge.emoji}</div>
                  <p className="text-xs font-bold text-babbel-text leading-tight">{badge.label}</p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Stars */}
        {totalStars > 0 && (
          <div className="bg-white rounded-3xl border border-babbel-border p-5 text-center">
            <p className="text-babbel-muted text-sm mb-2">Tổng sao đã kiếm</p>
            <p className="text-2xl font-extrabold text-amber-500">
              {'⭐'.repeat(Math.min(totalStars, 9))}{totalStars > 9 ? ` +${totalStars - 9}` : ''}
            </p>
          </div>
        )}

        {/* Notifications */}
        <div className="bg-white rounded-3xl border border-babbel-border p-5">
          <div className="flex items-center gap-2 mb-4">
            <Bell size={18} className="text-babbel-orange" />
            <h2 className="text-babbel-text font-extrabold text-base">Nhắc nhở học tập</h2>
          </div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-gray-600">Thông báo hằng ngày</p>
            <button
              onClick={handleToggleNotif}
              className={`w-12 h-6 rounded-full relative transition-colors ${notificationsEnabled ? 'bg-babbel-orange' : 'bg-gray-200'}`}
            >
              <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${notificationsEnabled ? 'left-7' : 'left-1'}`} />
            </button>
          </div>
          {notificationsEnabled && (
            <div className="flex items-center gap-3">
              <BellOff size={14} className="text-gray-400" />
              <p className="text-xs text-gray-500 flex-1">Giờ nhắc nhở</p>
              <select
                value={notifHour}
                onChange={(e) => {
                  const h = Number(e.target.value)
                  setNotifHour(h)
                  setNotifications(true, h)
                }}
                className="text-sm font-semibold border border-gray-200 rounded-xl px-3 py-1.5 focus:outline-none focus:border-babbel-orange"
              >
                {Array.from({ length: 24 }, (_, i) => (
                  <option key={i} value={i}>{String(i).padStart(2, '0')}:00</option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Lớp học */}
        <button
          onClick={() => navigate('classroom')}
          className="bg-white rounded-3xl border border-babbel-border p-5 flex items-center gap-3 w-full text-left"
        >
          <span className="text-2xl">🏫</span>
          <div className="flex-1">
            <p className="font-bold text-gray-800 text-sm">Lớp học nhỏ với giáo viên</p>
            <p className="text-xs text-gray-400 mt-0.5">Học trực tuyến 1-6 người</p>
          </div>
          <ChevronRight size={18} className="text-gray-300" />
        </button>

        {/* Course progress */}
        <div className="bg-white rounded-3xl border border-babbel-border overflow-hidden">
          <div className="px-5 py-4 border-b border-babbel-border flex items-center justify-between">
            <h2 className="text-babbel-text font-extrabold text-base">Tiến trình khóa học</h2>
          </div>
          {course.units.map((unit) => {
            const lessons = unit.lessons
            const done = lessons.filter((l) => completedLessonIds.includes(l.id)).length
            const pct = lessons.length > 0 ? done / lessons.length : 0
            return (
              <div key={unit.id} className="px-5 py-4 border-b border-babbel-border last:border-0">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">{unit.icon}</span>
                  <p className="text-babbel-text font-bold text-sm flex-1">{unit.title}</p>
                  <span className="text-babbel-muted text-xs">{done}/{lessons.length}</span>
                  <ChevronRight size={14} className="text-gray-300" />
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-babbel-orange rounded-full transition-all duration-700"
                    style={{ width: `${pct * 100}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
