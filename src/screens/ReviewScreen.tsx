import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Volume2, X } from 'lucide-react'
import { useReviewStore } from '../store/reviewStore'
import { useUserStore } from '../store/userStore'
import { vocabMap } from '../data/vocabulary'
import { useAudio } from '../hooks/useAudio'
import { useNav } from '../App'

export default function ReviewScreen() {
  const dueItems = useReviewStore((s) => s.getDueItems())
  const updateRecord = useReviewStore((s) => s.updateRecord)
  const addXP = useUserStore((s) => s.addXP)
  const { navigate } = useNav()
  const { speak } = useAudio()

  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [done, setDone] = useState(false)
  const [reviewed, setReviewed] = useState(0)

  if (dueItems.length === 0 || done) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-brand-blue to-blue-600 flex flex-col items-center justify-center px-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-8xl mb-6"
        >
          {dueItems.length === 0 ? '😴' : '🎉'}
        </motion.div>
        <h1 className="text-2xl font-extrabold text-white text-center mb-3">
          {dueItems.length === 0 ? 'Không có gì để ôn!' : `Ôn tập xong! +${reviewed * 2} XP`}
        </h1>
        <p className="text-blue-200 text-center mb-8">
          {dueItems.length === 0
            ? 'Hãy học thêm bài mới nhé 📚'
            : `Đã ôn ${reviewed} từ vựng`}
        </p>
        <button
          onClick={() => navigate('home')}
          className="bg-white text-brand-blue font-extrabold py-4 px-10 rounded-2xl text-lg shadow-xl"
        >
          Về trang chủ
        </button>
      </div>
    )
  }

  const current = dueItems[index]
  const item = vocabMap[current.vocabId]

  function rate(quality: number) {
    updateRecord(current.vocabId, quality)
    addXP(2)
    setReviewed((r) => r + 1)
    setFlipped(false)

    if (index + 1 >= dueItems.length) {
      setDone(true)
    } else {
      setIndex((i) => i + 1)
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Header */}
      <div className="bg-brand-blue px-5 pt-12 pb-4 flex items-center gap-3">
        <button onClick={() => navigate('home')} className="text-white">
          <X size={24} />
        </button>
        <div className="flex-1">
          <p className="text-white font-extrabold">Ôn tập</p>
          <p className="text-blue-200 text-xs">{index + 1} / {dueItems.length}</p>
        </div>
        <div className="h-2 bg-white/30 rounded-full flex-1 overflow-hidden">
          <div
            className="h-full bg-white rounded-full transition-all"
            style={{ width: `${((index) / dueItems.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-5 gap-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.vocabId}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            className="w-full"
          >
            {/* Card */}
            <div
              className="bg-white rounded-3xl shadow-xl p-8 text-center cursor-pointer mb-4"
              onClick={() => setFlipped((f) => !f)}
            >
              {!flipped ? (
                <>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Tiếng Séc</p>
                  <p className="text-4xl font-extrabold text-gray-800 mb-4">{item?.czech}</p>
                  <button
                    onClick={(e) => { e.stopPropagation(); if (item) speak(item.czech) }}
                    className="flex items-center gap-2 text-brand-blue bg-blue-50 px-4 py-2 rounded-xl text-sm font-semibold mx-auto"
                  >
                    <Volume2 size={16} /> Nghe
                  </button>
                  <p className="text-gray-400 text-xs mt-4">Nhấn để xem nghĩa</p>
                </>
              ) : (
                <>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Tiếng Việt</p>
                  <p className="text-3xl font-extrabold text-gray-800 mb-2">{item?.vietnamese}</p>
                  <p className="text-gray-500 text-base">[{item?.pronunciation}]</p>
                  {item?.example && (
                    <div className="bg-gray-50 rounded-2xl p-3 mt-4 text-left">
                      <p className="text-gray-700 text-sm font-semibold">{item.example.czech}</p>
                      <p className="text-gray-500 text-xs">{item.example.vietnamese}</p>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Rating Buttons */}
            {flipped && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-3 gap-3"
              >
                <button
                  onClick={() => rate(1)}
                  className="bg-red-100 border-2 border-red-300 text-red-600 font-bold py-4 rounded-2xl text-sm"
                >
                  😕 Khó
                </button>
                <button
                  onClick={() => rate(3)}
                  className="bg-yellow-100 border-2 border-yellow-300 text-yellow-700 font-bold py-4 rounded-2xl text-sm"
                >
                  🙂 Ổn
                </button>
                <button
                  onClick={() => rate(5)}
                  className="bg-emerald-100 border-2 border-emerald-300 text-emerald-700 font-bold py-4 rounded-2xl text-sm"
                >
                  😊 Dễ
                </button>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
