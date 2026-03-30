import { motion } from 'framer-motion'
import { Star } from 'lucide-react'

interface Props {
  lessonTitle: string
  xpEarned: number
  correct: number
  total: number
  stars: 1 | 2 | 3
  onContinue: () => void
}

export default function LessonComplete({ lessonTitle, xpEarned, correct, total, stars, onContinue }: Props) {
  const accuracy = total > 0 ? Math.round((correct / total) * 100) : 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-400 to-emerald-600 flex flex-col items-center justify-center px-6">
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', damping: 12, stiffness: 200 }}
        className="text-8xl mb-4"
      >
        🏆
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-3xl font-extrabold text-white text-center mb-2"
      >
        Hoàn thành!
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-emerald-100 text-center mb-8"
      >
        {lessonTitle}
      </motion.p>

      {/* Stars */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4 }}
        className="flex gap-2 mb-8"
      >
        {[1, 2, 3].map((s) => (
          <motion.div
            key={s}
            initial={{ scale: 0, rotate: -30 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.5 + s * 0.1, type: 'spring' }}
          >
            <Star
              size={48}
              className={s <= stars ? 'text-brand-yellow fill-brand-yellow drop-shadow-lg' : 'text-white/30'}
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white/20 rounded-3xl p-5 w-full mb-8 grid grid-cols-2 gap-4"
      >
        <div className="text-center">
          <p className="text-3xl font-extrabold text-white">+{xpEarned}</p>
          <p className="text-emerald-200 text-sm font-medium">XP kiếm được</p>
        </div>
        <div className="text-center">
          <p className="text-3xl font-extrabold text-white">{accuracy}%</p>
          <p className="text-emerald-200 text-sm font-medium">Độ chính xác</p>
        </div>
      </motion.div>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        onClick={onContinue}
        className="w-full bg-white text-emerald-600 font-extrabold py-5 rounded-3xl text-xl shadow-2xl active:scale-95 transition-transform"
      >
        Tiếp tục 🚀
      </motion.button>
    </div>
  )
}
