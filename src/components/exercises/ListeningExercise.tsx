import { useState } from 'react'
import { motion } from 'framer-motion'
import { Volume2 } from 'lucide-react'
import { vocabMap } from '../../data/vocabulary'
import { useAudio } from '../../hooks/useAudio'

interface Props {
  vocabId: string
  options: Array<{ id: string; text: string }>
  correctId: string
  onAnswer: (correct: boolean) => void
}

export default function ListeningExercise({ vocabId, options, correctId, onAnswer }: Props) {
  const item = vocabMap[vocabId]
  const { speak } = useAudio()
  const [selected, setSelected] = useState<string | null>(null)
  const [played, setPlayed] = useState(false)

  function playAudio() {
    if (item) speak(item.czech)
    setPlayed(true)
  }

  function handleSelect(id: string) {
    if (selected) return
    setSelected(id)
    const correct = id === correctId
    if (item) speak(item.czech)
    setTimeout(() => onAnswer(correct), 800)
  }

  return (
    <div className="flex flex-col gap-6 px-5 pt-4">
      {/* Play Button */}
      <div className="flex flex-col items-center gap-3">
        <p className="text-gray-500 text-sm font-medium">Nghe và chọn nghĩa đúng</p>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={playAudio}
          className="w-24 h-24 rounded-full bg-brand-blue shadow-xl shadow-blue-200 flex items-center justify-center"
        >
          <Volume2 size={40} className="text-white" />
        </motion.button>
        {!played && (
          <p className="text-xs text-gray-400">Nhấn để nghe</p>
        )}
        {selected && item && (
          <div className="bg-gray-100 rounded-2xl px-5 py-3 text-center">
            <p className="text-gray-800 font-bold text-lg">{item.czech}</p>
            <p className="text-gray-500 text-sm">[{item.pronunciation}]</p>
          </div>
        )}
      </div>

      {/* Options */}
      <div className="grid grid-cols-1 gap-3">
        {options.map((opt) => {
          let style = 'bg-white border-2 border-gray-200 text-gray-800'
          if (selected) {
            if (opt.id === correctId) style = 'bg-brand-green border-2 border-brand-green text-white'
            else if (opt.id === selected) style = 'bg-red-500 border-2 border-red-500 text-white'
            else style = 'bg-gray-50 border-2 border-gray-100 text-gray-400'
          }

          return (
            <motion.button
              key={opt.id}
              whileTap={!selected ? { scale: 0.97 } : {}}
              onClick={() => handleSelect(opt.id)}
              className={`w-full px-5 py-4 rounded-2xl font-semibold text-base text-left transition-colors ${style}`}
            >
              {opt.text}
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
