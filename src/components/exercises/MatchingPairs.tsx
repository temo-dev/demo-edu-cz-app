import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Pair {
  id: string
  czech: string
  vietnamese: string
}

interface Props {
  pairs: Pair[]
  onComplete: (correct: boolean) => void
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function MatchingPairs({ pairs, onComplete }: Props) {
  const leftItems = useMemo(() => pairs, [])
  const rightItems = useMemo(() => shuffle(pairs), [])

  const [selectedLeft, setSelectedLeft] = useState<string | null>(null)
  const [selectedRight, setSelectedRight] = useState<string | null>(null)
  const [matched, setMatched] = useState<Set<string>>(new Set())
  const [wrongPair, setWrongPair] = useState<[string, string] | null>(null)
  const [errors, setErrors] = useState(0)

  function handleLeft(id: string) {
    if (matched.has(id)) return
    setSelectedLeft(id)
    if (selectedRight) checkMatch(id, selectedRight)
  }

  function handleRight(id: string) {
    if (matched.has(id)) return
    setSelectedRight(id)
    if (selectedLeft) checkMatch(selectedLeft, id)
  }

  function checkMatch(leftId: string, rightId: string) {
    if (leftId === rightId) {
      const newMatched = new Set(matched)
      newMatched.add(leftId)
      setMatched(newMatched)
      setSelectedLeft(null)
      setSelectedRight(null)

      if (newMatched.size === pairs.length) {
        setTimeout(() => onComplete(errors === 0), 400)
      }
    } else {
      setErrors((e) => e + 1)
      setWrongPair([leftId, rightId])
      setTimeout(() => {
        setWrongPair(null)
        setSelectedLeft(null)
        setSelectedRight(null)
      }, 700)
    }
  }

  return (
    <div className="flex flex-col gap-4 px-5 pt-4">
      <p className="text-gray-500 text-sm font-medium text-center">Ghép đôi tiếng Séc với tiếng Việt</p>

      <div className="flex gap-3">
        {/* Left: Czech */}
        <div className="flex-1 flex flex-col gap-2">
          {leftItems.map((p) => {
            const isDone = matched.has(p.id)
            const isSelected = selectedLeft === p.id
            const isWrong = wrongPair?.[0] === p.id

            return (
              <AnimatePresence key={p.id}>
                {!isDone ? (
                  <motion.button
                    layout
                    onClick={() => handleLeft(p.id)}
                    className={`py-3 px-4 rounded-2xl text-sm font-bold border-2 transition-colors text-left ${
                      isWrong
                        ? 'bg-red-100 border-red-400 text-red-700'
                        : isSelected
                        ? 'bg-brand-blue border-brand-blue text-white'
                        : 'bg-white border-gray-200 text-gray-800'
                    }`}
                  >
                    {p.czech}
                  </motion.button>
                ) : (
                  <motion.div
                    initial={{ opacity: 1 }}
                    animate={{ opacity: 0.3 }}
                    className="py-3 px-4 rounded-2xl text-sm font-bold bg-emerald-100 border-2 border-emerald-300 text-emerald-600"
                  >
                    {p.czech}
                  </motion.div>
                )}
              </AnimatePresence>
            )
          })}
        </div>

        {/* Right: Vietnamese */}
        <div className="flex-1 flex flex-col gap-2">
          {rightItems.map((p) => {
            const isDone = matched.has(p.id)
            const isSelected = selectedRight === p.id
            const isWrong = wrongPair?.[1] === p.id

            return (
              <AnimatePresence key={p.id}>
                {!isDone ? (
                  <motion.button
                    layout
                    onClick={() => handleRight(p.id)}
                    className={`py-3 px-4 rounded-2xl text-sm font-bold border-2 transition-colors text-left ${
                      isWrong
                        ? 'bg-red-100 border-red-400 text-red-700'
                        : isSelected
                        ? 'bg-violet-500 border-violet-500 text-white'
                        : 'bg-white border-gray-200 text-gray-800'
                    }`}
                  >
                    {p.vietnamese}
                  </motion.button>
                ) : (
                  <motion.div
                    initial={{ opacity: 1 }}
                    animate={{ opacity: 0.3 }}
                    className="py-3 px-4 rounded-2xl text-sm font-bold bg-emerald-100 border-2 border-emerald-300 text-emerald-600"
                  >
                    {p.vietnamese}
                  </motion.div>
                )}
              </AnimatePresence>
            )
          })}
        </div>
      </div>

      {matched.size > 0 && (
        <p className="text-center text-emerald-600 text-sm font-semibold">
          ✅ {matched.size}/{pairs.length} cặp
        </p>
      )}
    </div>
  )
}
