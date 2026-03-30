import { useRef } from 'react'
import { Flame, User, CheckCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import { useUserStore } from '../store/userStore'
import { useProgressStore } from '../store/progressStore'
import { useReviewStore } from '../store/reviewStore'
import { useNav } from '../App'
import { course } from '../data/curriculum'

// Card background colors per unit (warm, Babbel-style)
const CARD_COLORS = [
  { bg: 'bg-babbel-cream', text: 'text-babbel-text', sub: 'text-babbel-muted' },
  { bg: 'bg-violet-100',   text: 'text-violet-900',  sub: 'text-violet-500'  },
  { bg: 'bg-amber-100',    text: 'text-amber-900',   sub: 'text-amber-600'   },
  { bg: 'bg-sky-100',      text: 'text-sky-900',     sub: 'text-sky-500'     },
]

export default function HomeScreen() {
  const { name, streak, xp, todayXP, dailyGoalXP } = useUserStore()
  const { isLessonUnlocked, isLessonComplete } = useProgressStore()
  const dueCount = useReviewStore((s) => s.getDueCount())
  const { navigate } = useNav()
  const scrollRef = useRef<HTMLDivElement>(null)

  const allLessons = course.units.flatMap((u, ui) =>
    u.lessons.map((l, li) => ({ ...l, unit: u, unitIndex: ui, lessonIndex: li }))
  )
  const goalPct = Math.min(1, todayXP / dailyGoalXP)

  return (
    <div className="bg-babbel-bg min-h-full">
      {/* ── Top bar ── */}
      <div className="bg-white px-5 pt-12 pb-4 flex items-center justify-between">
        <div>
          <p className="text-babbel-muted text-xs font-medium">Chào mừng trở lại,</p>
          <h1 className="text-babbel-text text-xl font-extrabold leading-tight">
            {name} 👋
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-orange-50 px-3 py-1.5 rounded-full">
            <Flame size={16} className="text-babbel-orange" />
            <span className="text-babbel-orange font-bold text-sm">{streak}</span>
          </div>
          <button
            onClick={() => navigate('profile')}
            className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center"
          >
            <User size={18} className="text-gray-500" />
          </button>
        </div>
      </div>

      {/* ── Daily goal bar ── */}
      <div className="bg-white px-5 pb-4 border-b border-babbel-border">
        <div className="flex justify-between items-center mb-1.5">
          <p className="text-xs font-semibold text-babbel-muted">Mục tiêu hôm nay</p>
          <p className="text-xs font-bold text-babbel-text">{todayXP}/{dailyGoalXP} XP</p>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-babbel-orange rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${goalPct * 100}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* ── Lesson card carousel ── */}
      <div className="pt-5 pb-2">
        <p className="px-5 text-xs font-bold text-babbel-muted uppercase tracking-widest mb-3">
          Bài học của bạn
        </p>
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth px-5 pb-2 no-scrollbar"
        >
          {allLessons.map((lesson, i) => {
            const unlocked = isLessonUnlocked(lesson.id)
            const done = isLessonComplete(lesson.id)
            const color = CARD_COLORS[lesson.unitIndex % CARD_COLORS.length]

            return (
              <motion.div
                key={lesson.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                className={`flex-none w-72 snap-start rounded-3xl overflow-hidden ${
                  color.bg
                } ${!unlocked ? 'opacity-50' : ''}`}
              >
                <button
                  disabled={!unlocked}
                  onClick={() => unlocked && navigate('lesson', lesson.id)}
                  className="w-full text-left p-5 flex flex-col"
                  style={{ minHeight: 180 }}
                >
                  {/* Lesson label */}
                  <p className={`text-xs font-bold uppercase tracking-widest ${color.sub} mb-2`}>
                    Bài {i + 1} · {lesson.unit.title}
                  </p>

                  {/* Title */}
                  <h2 className={`text-xl font-extrabold leading-tight ${color.text} flex-1`}>
                    {lesson.title}
                  </h2>
                  {lesson.subtitle && (
                    <p className={`text-sm mt-1 ${color.sub}`}>{lesson.subtitle}</p>
                  )}

                  {/* Footer row */}
                  <div className="flex items-end justify-between mt-4">
                    <div className="flex items-center gap-1.5">
                      <span className="text-3xl">{lesson.unit.icon}</span>
                      {!done && unlocked && (
                        <span className={`text-xs font-bold ${color.sub} bg-white/60 px-2 py-0.5 rounded-full`}>
                          +{lesson.xpReward} XP
                        </span>
                      )}
                    </div>

                    {/* Checkmark button */}
                    <div
                      className={`w-11 h-11 rounded-full flex items-center justify-center shadow-md ${
                        done
                          ? 'bg-babbel-orange'
                          : unlocked
                          ? 'bg-babbel-text'
                          : 'bg-gray-400'
                      }`}
                    >
                      {done ? (
                        <CheckCircle size={22} className="text-white" strokeWidth={2.5} />
                      ) : (
                        <span className="text-white text-lg font-extrabold">→</span>
                      )}
                    </div>
                  </div>
                </button>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* ── More for you ── */}
      <div className="px-5 pt-4 pb-2">
        <p className="text-xs font-bold text-babbel-muted uppercase tracking-widest mb-3">
          Dành cho bạn
        </p>
        <div className="flex flex-col gap-3">
          {/* Review card */}
          {dueCount > 0 && (
            <button
              onClick={() => navigate('review')}
              className="w-full bg-white rounded-2xl border border-babbel-border flex items-center gap-4 p-4 active:bg-gray-50 transition-colors"
            >
              <div className="flex-1 text-left">
                <p className="text-babbel-muted text-xs font-medium">Ôn tập từ vựng</p>
                <p className="text-babbel-text font-extrabold text-base">Ôn tập ngay</p>
              </div>
              <div className="w-16 h-16 rounded-2xl bg-amber-100 flex items-center justify-center text-3xl flex-none">
                🗂️
              </div>
              <div className="absolute right-10 -top-1 bg-babbel-orange text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {dueCount}
              </div>
            </button>
          )}

          {/* XP stats card */}
          <button
            onClick={() => navigate('profile')}
            className="w-full bg-white rounded-2xl border border-babbel-border flex items-center gap-4 p-4 active:bg-gray-50 transition-colors"
          >
            <div className="flex-1 text-left">
              <p className="text-babbel-muted text-xs font-medium">Khám phá tiến trình</p>
              <p className="text-babbel-text font-extrabold text-base">Xem thống kê</p>
            </div>
            <div className="w-16 h-16 rounded-2xl bg-sky-100 flex items-center justify-center text-3xl flex-none">
              🎈
            </div>
          </button>
        </div>
      </div>

      {/* ── Topics section ── */}
      <div className="px-5 pt-4 pb-6">
        <p className="text-babbel-text font-extrabold text-lg text-center mb-4">
          Khám phá bài học theo chủ đề
        </p>
        <div className="grid grid-cols-2 gap-3">
          {course.units.map((unit) => (
            <button
              key={unit.id}
              onClick={() => navigate('course')}
              className="bg-white rounded-2xl border border-babbel-border p-4 text-left active:bg-gray-50"
            >
              <span className="text-3xl block mb-2">{unit.icon}</span>
              <p className="text-babbel-text font-bold text-sm leading-tight">{unit.title}</p>
              <p className="text-babbel-muted text-xs mt-0.5">{unit.subtitle}</p>
            </button>
          ))}
        </div>
      </div>

      {/* ── Bottom CTA ── */}
      <div className="px-5 pb-8">
        <button className="w-full bg-babbel-orange text-white font-extrabold py-4 rounded-2xl text-base flex items-center justify-between px-6 shadow-lg shadow-orange-200">
          <span>Mở khóa tất cả bài học 🇨🇿</span>
          <span className="bg-white text-babbel-orange text-xs font-extrabold px-3 py-1 rounded-full">
            {xp} XP
          </span>
        </button>
      </div>
    </div>
  )
}
