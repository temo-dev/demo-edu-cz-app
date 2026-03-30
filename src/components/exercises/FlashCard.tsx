import { useState } from 'react'
import { motion } from 'framer-motion'
import { Volume2, RotateCcw } from 'lucide-react'
import { vocabMap } from '../../data/vocabulary'
import { useAudio } from '../../hooks/useAudio'

interface Props {
  vocabId: string
  onContinue: (correct: boolean) => void
}

export default function FlashCard({ vocabId, onContinue }: Props) {
  const item = vocabMap[vocabId]
  const [flipped, setFlipped] = useState(false)
  const { speak } = useAudio()

  if (!item) return null

  return (
    <div className="flex flex-col items-center gap-6 px-5 pt-4">
      <p className="text-gray-500 text-sm font-medium">Nhấn vào thẻ để xem nghĩa</p>

      {/* Card */}
      <div
        className="perspective-1000 w-full cursor-pointer"
        onClick={() => setFlipped((f) => !f)}
        style={{ height: 220 }}
      >
        <motion.div
          className="transform-style-3d relative w-full h-full"
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
        >
          {/* Front */}
          <div className="backface-hidden absolute inset-0 bg-white rounded-3xl shadow-xl border border-gray-100 flex flex-col items-center justify-center gap-3 p-6">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Tiếng Séc</span>
            <p className="text-4xl font-extrabold text-gray-800 text-center">{item.czech}</p>
            <button
              onClick={(e) => {
                e.stopPropagation()
                speak(item.czech)
              }}
              className="flex items-center gap-2 text-brand-blue bg-blue-50 px-4 py-2 rounded-xl text-sm font-semibold"
            >
              <Volume2 size={16} />
              Nghe phát âm
            </button>
          </div>

          {/* Back */}
          <div className="backface-hidden rotate-y-180 absolute inset-0 bg-brand-green rounded-3xl shadow-xl flex flex-col items-center justify-center gap-2 p-6">
            <span className="text-xs font-bold text-white/60 uppercase tracking-widest">Tiếng Việt</span>
            <p className="text-3xl font-extrabold text-white text-center">{item.vietnamese}</p>
            <p className="text-white/70 text-base font-medium">[{item.pronunciation}]</p>
            {item.example && (
              <div className="bg-brand-green-dark rounded-2xl px-4 py-2 mt-2 text-center">
                <p className="text-white text-sm font-semibold">{item.example.czech}</p>
                <p className="text-white/70 text-xs">{item.example.vietnamese}</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      <p className="text-gray-400 text-xs flex items-center gap-1">
        <RotateCcw size={12} /> Nhấn thẻ để lật
      </p>

      {/* Buttons */}
      <div className="w-full flex flex-col gap-3">
        <button
          onClick={() => onContinue(true)}
          className="w-full bg-brand-green text-white font-bold py-4 rounded-2xl text-lg shadow-lg shadow-green-200 active:scale-95 transition-transform"
        >
          Tôi đã biết ✓
        </button>
        <button
          onClick={() => {
            speak(item.czech)
            onContinue(false)
          }}
          className="w-full bg-gray-100 text-gray-600 font-bold py-4 rounded-2xl text-base active:scale-95 transition-transform"
        >
          Nghe lại & tiếp tục
        </button>
      </div>
    </div>
  )
}
