import { useState } from 'react'
import { motion } from 'framer-motion'
import { Eye, EyeOff } from 'lucide-react'

interface Question {
  id: string
  question: string
  options: Array<{ id: string; text: string }>
  correctId: string
}

interface Props {
  passageCs: string
  passageVi: string
  questions: Question[]
  onAnswer: (correct: boolean) => void
}

export default function ReadingExercise({ passageCs, passageVi, questions, onAnswer }: Props) {
  const [showTranslation, setShowTranslation] = useState(false)
  const [currentQ, setCurrentQ] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [score, setScore] = useState(0)

  const q = questions[currentQ]
  const done = currentQ >= questions.length

  function handleSelect(id: string) {
    if (selected) return
    setSelected(id)
    const correct = id === q.correctId
    if (correct) setScore((s) => s + 1)
    setTimeout(() => {
      if (currentQ + 1 >= questions.length) {
        onAnswer((score + (correct ? 1 : 0)) / questions.length >= 0.5)
      } else {
        setCurrentQ((c) => c + 1)
        setSelected(null)
      }
    }, 900)
  }

  return (
    <div className="flex flex-col gap-4 px-5 pt-4">
      {/* Passage */}
      <div className="bg-white rounded-3xl shadow border border-gray-100 p-5">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Đọc hiểu</p>
          <button
            onClick={() => setShowTranslation((v) => !v)}
            className="flex items-center gap-1 text-xs text-blue-500 font-semibold"
          >
            {showTranslation ? <EyeOff size={14} /> : <Eye size={14} />}
            {showTranslation ? 'Ẩn dịch' : 'Xem dịch'}
          </button>
        </div>
        <p className="text-gray-800 leading-relaxed text-sm font-medium">{passageCs}</p>
        {showTranslation && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-3 text-gray-500 text-xs leading-relaxed border-t border-gray-100 pt-3"
          >
            {passageVi}
          </motion.p>
        )}
      </div>

      {/* Question */}
      {!done && (
        <>
          <div className="bg-blue-50 rounded-2xl p-4">
            <p className="text-xs font-bold text-blue-500 mb-1">
              Câu {currentQ + 1}/{questions.length}
            </p>
            <p className="text-gray-800 font-semibold text-sm">{q.question}</p>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {q.options.map((opt) => {
              let style = 'bg-white border-2 border-gray-200 text-gray-800'
              if (selected) {
                if (opt.id === q.correctId) style = 'bg-green-500 border-2 border-green-500 text-white'
                else if (opt.id === selected) style = 'bg-red-500 border-2 border-red-500 text-white'
                else style = 'bg-gray-50 border-2 border-gray-100 text-gray-400'
              }
              return (
                <motion.button
                  key={opt.id}
                  whileTap={!selected ? { scale: 0.97 } : {}}
                  onClick={() => handleSelect(opt.id)}
                  className={`w-full px-5 py-4 rounded-2xl font-semibold text-left text-sm transition-colors ${style}`}
                >
                  {opt.text}
                </motion.button>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
