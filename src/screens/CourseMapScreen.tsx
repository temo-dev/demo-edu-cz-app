import { Lock, Check, ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { course } from '../data/curriculum'
import { useProgressStore } from '../store/progressStore'
import { useNav } from '../App'

export default function CourseMapScreen() {
  const { isLessonUnlocked, isLessonComplete, lessonStars, getUnitProgress } = useProgressStore()
  const { navigate } = useNav()

  return (
    <div className="bg-babbel-bg min-h-full">
      {/* Header */}
      <div className="bg-white px-5 pt-12 pb-5 border-b border-babbel-border">
        <h1 className="text-babbel-text text-2xl font-extrabold">Luyện tập</h1>
        <p className="text-babbel-muted text-sm mt-0.5">Tiếng Séc cho người Việt 🇨🇿</p>
      </div>

      <div className="px-5 py-5 flex flex-col gap-5">
        {course.units.map((unit, ui) => {
          const prog = getUnitProgress(unit.id)
          const pct = prog.total > 0 ? prog.completed / prog.total : 0

          return (
            <motion.div
              key={unit.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: ui * 0.08 }}
              className="bg-white rounded-3xl border border-babbel-border overflow-hidden"
            >
              {/* Unit header */}
              <div className="px-5 py-4 flex items-center gap-4 border-b border-babbel-border">
                <span className="text-4xl">{unit.icon}</span>
                <div className="flex-1 min-w-0">
                  <h2 className="text-babbel-text font-extrabold text-base leading-tight">{unit.title}</h2>
                  <p className="text-babbel-muted text-xs truncate">{unit.subtitle}</p>
                </div>
                <div className="text-right flex-none">
                  <p className="text-babbel-text font-extrabold text-sm">{prog.completed}/{prog.total}</p>
                  <p className="text-babbel-muted text-xs">bài học</p>
                </div>
              </div>

              {/* Progress bar */}
              <div className="h-1 bg-gray-100">
                <motion.div
                  className="h-full bg-babbel-orange"
                  initial={{ width: 0 }}
                  animate={{ width: `${pct * 100}%` }}
                  transition={{ duration: 0.6, delay: ui * 0.08 + 0.2 }}
                />
              </div>

              {/* Lessons */}
              <div className="divide-y divide-babbel-border">
                {unit.lessons.map((lesson, li) => {
                  const unlocked = isLessonUnlocked(lesson.id)
                  const done = isLessonComplete(lesson.id)
                  const stars = lessonStars[lesson.id] ?? 0

                  return (
                    <button
                      key={lesson.id}
                      disabled={!unlocked}
                      onClick={() => unlocked && navigate('lesson', lesson.id)}
                      className={`w-full flex items-center gap-4 px-5 py-4 transition-colors ${
                        unlocked ? 'active:bg-babbel-cream' : 'opacity-40 cursor-not-allowed'
                      }`}
                    >
                      {/* Status circle */}
                      <div
                        className={`w-10 h-10 rounded-full flex-none flex items-center justify-center font-extrabold text-sm ${
                          done
                            ? 'bg-babbel-orange text-white'
                            : unlocked
                            ? 'bg-babbel-cream border-2 border-babbel-border text-babbel-text'
                            : 'bg-gray-100 text-gray-400'
                        }`}
                      >
                        {done ? <Check size={18} strokeWidth={3} /> : unlocked ? li + 1 : <Lock size={14} />}
                      </div>

                      <div className="flex-1 text-left">
                        <p className={`font-bold text-sm ${unlocked ? 'text-babbel-text' : 'text-gray-400'}`}>
                          {lesson.title}
                        </p>
                        {lesson.subtitle && (
                          <p className="text-babbel-muted text-xs mt-0.5">{lesson.subtitle}</p>
                        )}
                        {done && stars > 0 && (
                          <p className="text-xs text-amber-500 mt-0.5">{'⭐'.repeat(stars)}</p>
                        )}
                      </div>

                      {unlocked && !done && (
                        <span className="text-xs font-bold text-babbel-orange bg-orange-50 px-2.5 py-1 rounded-full flex-none">
                          +{lesson.xpReward} XP
                        </span>
                      )}
                      {unlocked && (
                        <ChevronRight size={16} className="text-gray-300 flex-none" />
                      )}
                    </button>
                  )
                })}
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
