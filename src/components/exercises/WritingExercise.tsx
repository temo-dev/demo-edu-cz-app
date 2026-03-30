import { useState } from 'react'
import { motion } from 'framer-motion'
import { Lightbulb, CheckCircle, XCircle } from 'lucide-react'

interface Props {
  promptVi: string
  answer: string
  hint?: string
  onAnswer: (correct: boolean) => void
}

function levenshtein(a: string, b: string): number {
  const dp: number[][] = Array.from({ length: a.length + 1 }, (_, i) =>
    Array.from({ length: b.length + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
  )
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++)
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1]
        : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1])
  return dp[a.length][b.length]
}

function normalize(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[čc]/g, 'c').replace(/[šs]/g, 's').replace(/[žz]/g, 'z')
    .replace(/[ěe]/g, 'e').replace(/[áa]/g, 'a').replace(/[íi]/g, 'i')
    .replace(/[óo]/g, 'o').replace(/[úůu]/g, 'u').replace(/[ýy]/g, 'y')
    .replace(/[řr]/g, 'r').replace(/[ňn]/g, 'n').replace(/[ďd]/g, 'd').replace(/[ťt]/g, 't')
}

function checkAnswer(input: string, answer: string): boolean {
  const a = input.trim().toLowerCase()
  const b = answer.trim().toLowerCase()
  if (a === b) return true
  if (normalize(a) === normalize(b)) return true
  if (levenshtein(a, b) <= 2) return true
  return false
}

// Char-level diff
function diffChars(input: string, answer: string): Array<{ ch: string; ok: boolean }> {
  return input.split('').map((ch, i) => ({
    ch,
    ok: i < answer.length && ch.toLowerCase() === answer[i].toLowerCase(),
  }))
}

export default function WritingExercise({ promptVi, answer, hint, onAnswer }: Props) {
  const [input, setInput] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [correct, setCorrect] = useState(false)

  function handleSubmit() {
    if (!input.trim()) return
    const ok = checkAnswer(input, answer)
    setCorrect(ok)
    setSubmitted(true)
    setTimeout(() => onAnswer(ok), 1400)
  }

  const diff = submitted ? diffChars(input, answer) : []

  return (
    <div className="flex flex-col gap-4 px-5 pt-4">
      {/* Prompt */}
      <div className="bg-white rounded-3xl shadow border border-gray-100 p-5">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Viết bằng tiếng Séc</p>
        <p className="text-xl font-bold text-gray-800">{promptVi}</p>
        {hint && (
          <div className="mt-3">
            {!showHint ? (
              <button
                onClick={() => setShowHint(true)}
                className="flex items-center gap-1 text-xs text-amber-500 font-semibold"
              >
                <Lightbulb size={14} /> Xem gợi ý
              </button>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-start gap-2 bg-amber-50 rounded-xl p-3"
              >
                <Lightbulb size={14} className="text-amber-500 mt-0.5" />
                <p className="text-xs text-amber-700">{hint}</p>
              </motion.div>
            )}
          </div>
        )}
      </div>

      {/* Input */}
      <div className="relative">
        <input
          type="text"
          value={input}
          onChange={(e) => !submitted && setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !submitted && handleSubmit()}
          placeholder="Gõ câu trả lời tiếng Séc..."
          disabled={submitted}
          className="w-full border-2 border-gray-200 rounded-2xl px-5 py-4 text-base font-medium focus:outline-none focus:border-babbel-orange disabled:bg-gray-50"
          autoComplete="off"
          autoCapitalize="off"
        />
      </div>

      {/* Diff result */}
      {submitted && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-2xl p-4 ${correct ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}
        >
          <div className="flex items-center gap-2 mb-2">
            {correct
              ? <CheckCircle size={18} className="text-green-600" />
              : <XCircle size={18} className="text-red-600" />
            }
            <span className="font-bold text-sm text-gray-800">
              {correct ? 'Chính xác!' : 'Chưa đúng'}
            </span>
          </div>
          {!correct && (
            <>
              <div className="text-sm mb-1">
                <span className="text-gray-500 text-xs">Bạn viết: </span>
                <span className="font-mono font-semibold">
                  {diff.map((d, i) => (
                    <span key={i} className={d.ok ? 'text-green-600' : 'text-red-500 underline decoration-wavy'}>
                      {d.ch}
                    </span>
                  ))}
                </span>
              </div>
              <div className="text-sm">
                <span className="text-gray-500 text-xs">Đáp án đúng: </span>
                <span className="font-mono font-bold text-gray-800">{answer}</span>
              </div>
            </>
          )}
        </motion.div>
      )}

      {/* Submit button */}
      {!submitted && (
        <button
          onClick={handleSubmit}
          disabled={!input.trim()}
          className="w-full py-4 bg-babbel-orange text-white font-bold rounded-2xl disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Kiểm tra
        </button>
      )}
    </div>
  )
}
