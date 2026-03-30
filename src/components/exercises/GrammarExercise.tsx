import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BookOpen, CheckCircle, XCircle } from 'lucide-react'

interface Props {
  ruleTitle: string
  ruleVi: string
  example: { cs: string; vi: string }
  question: string
  options: Array<{ id: string; text: string }>
  correctId: string
  explanation: string
  onAnswer: (correct: boolean) => void
}

export default function GrammarExercise({
  ruleTitle,
  ruleVi,
  example,
  question,
  options,
  correctId,
  explanation,
  onAnswer,
}: Props) {
  const [selected, setSelected] = useState<string | null>(null)
  const [showRule, setShowRule] = useState(true)
  const correct = selected === correctId

  function handleSelect(id: string) {
    if (selected) return
    setSelected(id)
    setTimeout(() => onAnswer(id === correctId), 1200)
  }

  return (
    <div className="flex flex-col gap-4 px-5 pt-4">
      {/* Rule Card */}
      <AnimatePresence>
        {showRule && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-amber-50 border border-amber-200 rounded-2xl p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <BookOpen size={16} className="text-amber-600" />
                <span className="text-xs font-bold text-amber-700 uppercase tracking-wide">Ngữ pháp</span>
              </div>
              <button
                onClick={() => setShowRule(false)}
                className="text-xs text-amber-500 underline"
              >
                Ẩn
              </button>
            </div>
            <p className="font-bold text-gray-800 text-sm mb-1">{ruleTitle}</p>
            <p className="text-gray-600 text-xs leading-relaxed whitespace-pre-line">{ruleVi}</p>
            <div className="mt-3 bg-white rounded-xl p-3 border border-amber-100">
              <p className="text-xs text-amber-600 font-semibold mb-1">Ví dụ:</p>
              <p className="font-bold text-gray-800 text-sm">{example.cs}</p>
              <p className="text-gray-500 text-xs mt-1">{example.vi}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!showRule && (
        <button
          onClick={() => setShowRule(true)}
          className="flex items-center gap-2 text-amber-600 text-sm font-semibold"
        >
          <BookOpen size={14} /> Xem lại quy tắc
        </button>
      )}

      {/* Question */}
      <div className="bg-white rounded-3xl shadow border border-gray-100 p-5">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Câu hỏi</p>
        <p className="text-xl font-bold text-gray-800">{question}</p>
      </div>

      {/* Options */}
      <div className="grid grid-cols-1 gap-3">
        {options.map((opt) => {
          let style = 'bg-white border-2 border-gray-200 text-gray-800'
          if (selected) {
            if (opt.id === correctId) style = 'bg-green-500 border-2 border-green-500 text-white'
            else if (opt.id === selected) style = 'bg-red-500 border-2 border-red-500 text-white'
            else style = 'bg-gray-50 border-2 border-gray-100 text-gray-400'
          }
          return (
            <motion.button
              key={opt.id}
              whileTap={!selected ? { scale: 0.97 } : {}}
              onClick={() => handleSelect(opt.id)}
              className={`w-full px-5 py-4 rounded-2xl font-semibold text-left text-base transition-colors ${style}`}
            >
              {opt.text}
            </motion.button>
          )
        })}
      </div>

      {/* Explanation after answer */}
      {selected && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-2xl p-4 flex gap-3 ${correct ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}
        >
          {correct
            ? <CheckCircle size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
            : <XCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
          }
          <p className="text-sm text-gray-700">{explanation}</p>
        </motion.div>
      )}
    </div>
  )
}
