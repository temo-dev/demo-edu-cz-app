import { useState } from 'react'
import { motion } from 'framer-motion'

interface Props {
  sentenceVi: string
  answer: string
  wordBank: string[]
  onAnswer: (correct: boolean) => void
}

export default function FillInTheBlank({ sentenceVi, answer, wordBank, onAnswer }: Props) {
  const [selected, setSelected] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)

  function handleSelect(word: string) {
    if (submitted) return
    setSelected(word)
  }

  function handleSubmit() {
    if (!selected || submitted) return
    setSubmitted(true)
    const correct = selected.toLowerCase().trim() === answer.toLowerCase().trim()
    setTimeout(() => onAnswer(correct), 800)
  }

  return (
    <div className="flex flex-col gap-5 px-5 pt-4">
      {/* Sentence */}
      <div className="bg-white rounded-3xl shadow border border-gray-100 p-6">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 text-center">
          Điền vào chỗ trống
        </p>
        <p className="text-base text-gray-600 text-center mb-4">{sentenceVi}</p>

        {/* Answer slot */}
        <div
          className={`mx-auto w-48 h-14 border-b-4 flex items-center justify-center rounded-xl text-xl font-extrabold transition-colors ${
            !selected
              ? 'border-gray-300 text-gray-300'
              : submitted
              ? selected === answer
                ? 'border-brand-green text-brand-green bg-green-50'
                : 'border-red-500 text-red-500 bg-red-50'
              : 'border-brand-blue text-brand-blue bg-blue-50'
          }`}
        >
          {selected ?? '___'}
        </div>
      </div>

      {/* Word Bank */}
      <div className="flex flex-wrap gap-2 justify-center">
        {wordBank.map((word) => {
          const isSelected = selected === word
          const isCorrect = submitted && word === answer
          const isWrong = submitted && isSelected && word !== answer

          return (
            <motion.button
              key={word}
              whileTap={!submitted ? { scale: 0.93 } : {}}
              onClick={() => handleSelect(word)}
              className={`px-5 py-3 rounded-2xl text-base font-bold border-2 transition-colors ${
                isCorrect
                  ? 'bg-brand-green border-brand-green text-white'
                  : isWrong
                  ? 'bg-red-100 border-red-400 text-red-700'
                  : isSelected
                  ? 'bg-brand-blue border-brand-blue text-white'
                  : 'bg-white border-gray-200 text-gray-800'
              }`}
            >
              {word}
            </motion.button>
          )
        })}
      </div>

      {/* Submit */}
      <button
        disabled={!selected || submitted}
        onClick={handleSubmit}
        className="w-full bg-brand-green text-white font-bold py-4 rounded-2xl text-lg shadow-lg shadow-green-200 disabled:opacity-40 active:scale-95 transition-transform"
      >
        Kiểm tra
      </button>
    </div>
  )
}
