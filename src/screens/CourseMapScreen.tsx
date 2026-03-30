import { Lock, CheckCircle, Star } from 'lucide-react'
import { motion } from 'framer-motion'
import { course } from '../data/curriculum'
import { useProgressStore } from '../store/progressStore'
import { useNav } from '../App'

export default function CourseMapScreen() {
  const { isLessonUnlocked, isLessonComplete, lessonStars, getUnitProgress } = useProgressStore()
  const { navigate } = useNav()

  return (
    <div className="bg-white min-h-full">
      <div className="bg-gradient-to-br from-indigo-500 to-indigo-700 px-5 pt-12 pb-6">
        <h1 className="text-white text-2xl font-extrabold mb-1">🗺️ Bản Đồ Học</h1>
        <p className="text-indigo-200 text-sm">Tiếng Séc cho người Việt</p>
      </div>

      <div className="px-5 py-6 flex flex-col gap-6">
        {course.units.map((unit, ui) => {
          const prog = getUnitProgress(unit.id)
          const unitDone = prog.completed === prog.total && prog.total > 0

          return (
            <motion.div
              key={unit.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: ui * 0.1 }}
              className="rounded-3xl overflow-hidden shadow-md"
            >
              {/* Unit Header */}
              <div className={`${unit.color} px-5 py-4 flex items-center gap-3`}>
                <span className="text-4xl">{unit.icon}</span>
                <div className="flex-1">
                  <h2 className="text-white font-extrabold text-lg leading-tight">{unit.title}</h2>
                  <p className="text-white/70 text-xs">{unit.subtitle}</p>
                </div>
                <div className="bg-white/20 rounded-xl px-3 py-1 text-right">
                  <p className="text-white font-bold text-sm">{prog.completed}/{prog.total}</p>
                  <p className="text-white/70 text-xs">bài học</p>
                </div>
              </div>

              {/* Unit Progress Bar */}
              <div className="bg-gray-100 h-1.5">
                <div
                  className={`h-full ${unit.darkColor} transition-all duration-700`}
                  style={{ width: `${prog.total > 0 ? (prog.completed / prog.total) * 100 : 0}%` }}
                />
              </div>

              {/* Lessons */}
              <div className="bg-gray-50 divide-y divide-gray-100">
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
                        unlocked ? 'active:bg-gray-100' : 'opacity-50 cursor-not-allowed'
                      }`}
                    >
                      {/* Lesson Number / Status */}
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                          done
                            ? `${unit.color} text-white shadow-md`
                            : unlocked
                            ? 'bg-white border-2 border-gray-200 text-gray-500'
                            : 'bg-gray-200 text-gray-400'
                        }`}
                      >
                        {done ? (
                          <CheckCircle size={20} className="text-white" />
                        ) : unlocked ? (
                          li + 1
                        ) : (
                          <Lock size={16} />
                        )}
                      </div>

                      <div className="text-left flex-1">
                        <p className={`font-bold text-sm ${unlocked ? 'text-gray-800' : 'text-gray-400'}`}>
                          {lesson.title}
                        </p>
                        {lesson.subtitle && (
                          <p className="text-gray-400 text-xs mt-0.5">{lesson.subtitle}</p>
                        )}
                      </div>

                      {done && (
                        <div className="flex gap-0.5">
                          {[1, 2, 3].map((s) => (
                            <Star
                              key={s}
                              size={14}
                              className={s <= stars ? 'text-brand-yellow fill-brand-yellow' : 'text-gray-300'}
                            />
                          ))}
                        </div>
                      )}

                      {unlocked && !done && (
                        <span className="text-xs font-bold text-gray-400 bg-gray-200 px-2 py-1 rounded-lg">
                          +{lesson.xpReward} XP
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>

              {unitDone && (
                <div className={`${unit.color} px-5 py-2 text-center`}>
                  <p className="text-white text-xs font-bold">🎉 Hoàn thành đơn vị!</p>
                </div>
              )}
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
