import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useUserStore } from '../store/userStore'

const GOALS = [
  { xp: 10, label: 'Nhẹ nhàng', desc: '5 phút/ngày', emoji: '🌱' },
  { xp: 20, label: 'Thông thường', desc: '10 phút/ngày', emoji: '⚡', recommended: true },
  { xp: 50, label: 'Nghiêm túc', desc: '20 phút/ngày', emoji: '🔥' },
]

export default function OnboardingScreen() {
  const completeOnboarding = useUserStore((s) => s.completeOnboarding)
  const [step, setStep] = useState(0)
  const [name, setName] = useState('')
  const [goal, setGoal] = useState(20)

  function finish() {
    if (!name.trim()) return
    completeOnboarding(name.trim(), goal)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-400 to-emerald-600 flex flex-col items-center justify-center p-6 max-w-md mx-auto">
      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div
            key="step0"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            className="text-center"
          >
            <div className="text-8xl mb-6">🇨🇿</div>
            <h1 className="text-3xl font-extrabold text-white mb-3">
              Học Tiếng Séc
            </h1>
            <p className="text-emerald-100 text-lg mb-8">
              Dành cho người Việt Nam 🇻🇳
            </p>
            <button
              onClick={() => setStep(1)}
              className="bg-white text-emerald-600 font-bold px-10 py-4 rounded-2xl text-lg shadow-lg active:scale-95 transition-transform"
            >
              Bắt đầu nào! →
            </button>
          </motion.div>
        )}

        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            className="w-full"
          >
            <h2 className="text-2xl font-extrabold text-white text-center mb-2">
              Bạn tên là gì? 😊
            </h2>
            <p className="text-emerald-100 text-center mb-6">Để chúng tôi gọi bạn</p>
            <input
              autoFocus
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && name.trim() && setStep(2)}
              placeholder="Nhập tên của bạn..."
              className="w-full px-5 py-4 rounded-2xl text-lg font-medium outline-none text-gray-800 mb-4 shadow"
            />
            <button
              disabled={!name.trim()}
              onClick={() => setStep(2)}
              className="w-full bg-white text-emerald-600 font-bold py-4 rounded-2xl text-lg shadow-lg disabled:opacity-50 active:scale-95 transition-transform"
            >
              Tiếp theo →
            </button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            className="w-full"
          >
            <h2 className="text-2xl font-extrabold text-white text-center mb-2">
              Mục tiêu học của bạn?
            </h2>
            <p className="text-emerald-100 text-center mb-6">
              Xin chào, <span className="font-bold">{name}</span>! 👋
            </p>
            <div className="flex flex-col gap-3 mb-6">
              {GOALS.map((g) => (
                <button
                  key={g.xp}
                  onClick={() => setGoal(g.xp)}
                  className={`flex items-center gap-4 px-5 py-4 rounded-2xl border-2 transition-all ${
                    goal === g.xp
                      ? 'bg-white border-white text-gray-800 scale-105'
                      : 'bg-white/20 border-white/40 text-white'
                  }`}
                >
                  <span className="text-3xl">{g.emoji}</span>
                  <div className="text-left flex-1">
                    <div className="font-bold text-base">{g.label}</div>
                    <div className="text-sm opacity-80">{g.desc}</div>
                  </div>
                  {g.recommended && (
                    <span className="bg-brand-yellow text-gray-800 text-xs font-bold px-2 py-0.5 rounded-full">
                      Gợi ý
                    </span>
                  )}
                </button>
              ))}
            </div>
            <button
              onClick={finish}
              className="w-full bg-white text-emerald-600 font-bold py-4 rounded-2xl text-lg shadow-lg active:scale-95 transition-transform"
            >
              Bắt đầu học! 🚀
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
