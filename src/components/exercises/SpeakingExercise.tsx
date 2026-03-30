import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mic, MicOff, Volume2, Turtle, RotateCcw, ArrowRight } from 'lucide-react'
import { useAudio } from '../../hooks/useAudio'

interface Props {
  vocabId: string
  prompt: string
  answer: string
  pronunciation: string
  onAnswer: (correct: boolean) => void
}

type Status = 'idle' | 'listening' | 'processing' | 'correct' | 'wrong' | 'unsupported'

// ─── Matching logic ───────────────────────────────────────────────────────────

function normalize(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, '')
}

function levenshtein(a: string, b: string): number {
  const m = a.length, n = b.length
  const dp: number[][] = Array.from({ length: m + 1 }, (_, i) =>
    Array.from({ length: n + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
  )
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      dp[i][j] =
        a[i - 1] === b[j - 1]
          ? dp[i - 1][j - 1]
          : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1])
  return dp[m][n]
}

function isMatch(heard: string, expected: string): boolean {
  const h = normalize(heard)
  const e = normalize(expected)
  if (!h || h.length < 1) return false
  if (h === e) return true
  // Chỉ cho phép heard chứa expected (người dùng nói thêm từ thừa),
  // expected phải đủ dài (≥3) để tránh false positive với âm ngắn
  if (h.includes(e) && e.length >= 3) return true
  // Levenshtein chặt: từ ≤4 ký tự → max 1 lỗi; từ dài hơn → max 20%
  const maxDist = e.length <= 4 ? 1 : Math.floor(e.length * 0.2)
  return levenshtein(h, e) <= maxDist
}

// ─── Char-level diff for highlighting ────────────────────────────────────────

function diffChars(heard: string, answer: string): Array<{ char: string; ok: boolean }> {
  const h = heard.toLowerCase()
  const a = answer.toLowerCase()
  return a.split('').map((char, i) => ({
    char,
    ok: h[i] === char,
  }))
}

// ─── Czech phoneme tips ───────────────────────────────────────────────────────

const PHONEME_TIPS: Array<{ chars: string[]; tip: string }> = [
  { chars: ['ř'], tip: '«ř» — âm r rung kèm z, khó nhất trong tiếng Séc' },
  { chars: ['č'], tip: '«č» — đọc như «ch» trong "chair" (tiếng Anh)' },
  { chars: ['š'], tip: '«š» — đọc như «sh» trong "shoe"' },
  { chars: ['ž'], tip: '«ž» — đọc như «zh/j» trong tiếng Pháp' },
  { chars: ['ě'], tip: '«ě» — đọc như «ye»' },
  { chars: ['á', 'é', 'í', 'ó', 'ú', 'ý', 'ů'], tip: 'Chữ có dấu = nguyên âm dài, kéo dài gấp đôi' },
  { chars: ['dž'], tip: '«dž» — đọc như «j» trong "jump"' },
]

function getPhonemeTips(word: string): string[] {
  const lower = word.toLowerCase()
  const tips: string[] = []
  for (const { chars, tip } of PHONEME_TIPS) {
    if (chars.some((c) => lower.includes(c))) tips.push(tip)
  }
  return tips
}

// ─── SpeechRecognition types ──────────────────────────────────────────────────

interface ISpeechRecognitionResult { transcript: string }
interface ISpeechRecognitionResultList extends Iterable<ISpeechRecognitionResult> {
  [index: number]: ISpeechRecognitionResult; length: number
}
interface ISpeechRecognitionEvent {
  results: { [index: number]: ISpeechRecognitionResultList; length: number }
}
interface ISpeechRecognition {
  lang: string; interimResults: boolean; maxAlternatives: number
  onresult: ((e: ISpeechRecognitionEvent) => void) | null
  onerror: (() => void) | null
  onend: (() => void) | null
  start(): void; stop(): void
}
type SpeechRecognitionCtor = new () => ISpeechRecognition

const SpeechRecognitionAPI: SpeechRecognitionCtor | undefined =
  typeof window !== 'undefined'
    ? (window as unknown as { SpeechRecognition?: SpeechRecognitionCtor; webkitSpeechRecognition?: SpeechRecognitionCtor }).SpeechRecognition ||
      (window as unknown as { webkitSpeechRecognition?: SpeechRecognitionCtor }).webkitSpeechRecognition
    : undefined

// ─── Component ────────────────────────────────────────────────────────────────

export default function SpeakingExercise({ prompt, answer, pronunciation, onAnswer }: Props) {
  const [status, setStatus] = useState<Status>(SpeechRecognitionAPI ? 'idle' : 'unsupported')
  const [heard, setHeard] = useState('')
  const [attempts, setAttempts] = useState(0)
  const recognitionRef = useRef<ISpeechRecognition | null>(null)
  const { speak, speakSlow } = useAudio()

  const tips = getPhonemeTips(answer)
  const charDiff = status === 'wrong' ? diffChars(heard, answer) : []

  function startListening() {
    if (!SpeechRecognitionAPI) return
    const rec = new SpeechRecognitionAPI()
    rec.lang = 'cs-CZ'
    rec.interimResults = false
    rec.maxAlternatives = 5
    recognitionRef.current = rec

    setStatus('listening')
    setHeard('')

    let resultFired = false

    rec.onresult = (e) => {
      resultFired = true
      setStatus('processing')
      const results = Array.from(e.results[0]).map((r) => r.transcript)
      const matched = results.find((r) => isMatch(r, answer))
      const best = matched ?? results[0] ?? ''
      setHeard(best)
      const correct = isMatch(best, answer)
      setStatus(correct ? 'correct' : 'wrong')
      setAttempts((a) => a + 1)
      // auto-advance only on correct
      if (correct) setTimeout(() => onAnswer(true), 1200)
      else speak(answer) // play correct answer on wrong
    }

    rec.onerror = () => { resultFired = true; setStatus('idle') }
    rec.onend = () => { if (!resultFired) setStatus('idle') }
    rec.start()
  }

  function stopListening() {
    recognitionRef.current?.stop()
    setStatus('idle')
  }

  return (
    <div className="flex flex-col gap-5 px-5 pt-4">

      {/* Prompt */}
      <div className="bg-white rounded-3xl shadow border border-gray-100 p-6 text-center">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
          Nói câu này bằng tiếng Séc
        </p>
        <p className="text-2xl font-extrabold text-gray-800 mb-3">{prompt}</p>
        <div className="flex gap-2 justify-center">
          <button
            onClick={() => speak(answer)}
            className="flex items-center gap-1.5 text-brand-blue bg-blue-50 px-4 py-2 rounded-xl text-sm font-semibold"
          >
            <Volume2 size={15} /> Nghe mẫu
          </button>
          <button
            onClick={() => speakSlow(answer)}
            className="flex items-center gap-1.5 text-violet-600 bg-violet-50 px-4 py-2 rounded-xl text-sm font-semibold"
          >
            <Turtle size={15} /> Nghe chậm
          </button>
        </div>
      </div>

      {/* Mic area */}
      {status !== 'unsupported' && (
        <div className="flex flex-col items-center gap-4">
          <AnimatePresence mode="wait">
            {/* idle */}
            {(status === 'idle') && (
              <motion.button
                key="idle"
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                whileTap={{ scale: 0.9 }}
                onClick={startListening}
                className="w-24 h-24 rounded-full bg-brand-blue shadow-xl shadow-blue-200 flex items-center justify-center"
              >
                <Mic size={40} className="text-white" />
              </motion.button>
            )}

            {/* listening */}
            {status === 'listening' && (
              <motion.button
                key="listening"
                initial={{ scale: 0.85 }}
                animate={{ scale: 1 }}
                onClick={stopListening}
                className="relative w-24 h-24 rounded-full bg-red-500 shadow-xl shadow-red-200 flex items-center justify-center"
              >
                <motion.span
                  className="absolute inset-0 rounded-full bg-red-400 opacity-60"
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                />
                <MicOff size={40} className="text-white relative z-10" />
              </motion.button>
            )}

            {/* processing */}
            {status === 'processing' && (
              <motion.div
                key="processing"
                className="w-24 h-24 rounded-full bg-brand-yellow shadow-xl flex items-center justify-center"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                  className="w-8 h-8 border-4 border-white border-t-transparent rounded-full"
                />
              </motion.div>
            )}

            {/* correct */}
            {status === 'correct' && (
              <motion.div
                key="correct"
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', damping: 10 }}
                className="w-24 h-24 rounded-full bg-brand-green shadow-xl shadow-green-200 flex items-center justify-center"
              >
                <span className="text-4xl">✅</span>
              </motion.div>
            )}
          </AnimatePresence>

          <p className={`text-sm font-semibold text-center ${
            status === 'correct' ? 'text-brand-green' :
            status === 'wrong' ? 'text-red-500' : 'text-gray-500'
          }`}>
            {status === 'idle' && (attempts > 0 ? '🔄 Thử lại' : '🎙️ Nhấn mic để nói')}
            {status === 'listening' && 'Đang nghe... nhấn để dừng'}
            {status === 'processing' && 'Đang phân tích...'}
            {status === 'correct' && '✨ Xuất sắc! Phát âm chuẩn!'}
            {status === 'wrong' && 'Chưa đúng, xem gợi ý bên dưới 👇'}
          </p>
        </div>
      )}

      {/* ── Correction Panel (only when wrong) ─────────────────────────── */}
      <AnimatePresence>
        {status === 'wrong' && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            className="flex flex-col gap-4"
          >
            {/* Comparison */}
            <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-4">
              <p className="text-xs font-bold text-red-400 uppercase tracking-wider mb-1">Bạn nói</p>
              <p className="text-lg font-bold text-red-600">"{heard || '(không nghe được)'}"</p>
            </div>

            <div className="bg-green-50 border-2 border-green-300 rounded-2xl p-4">
              <p className="text-xs font-bold text-green-600 uppercase tracking-wider mb-2">Đáp án đúng</p>
              {/* Character-level diff */}
              <p className="text-2xl font-extrabold mb-1 tracking-wide leading-tight">
                {charDiff.map((d, i) => (
                  <span key={i} className={d.ok ? 'text-green-700' : 'text-red-500 underline decoration-wavy decoration-red-400'}>
                    {d.char}
                  </span>
                ))}
              </p>
              <p className="text-green-600 text-sm font-medium">[{pronunciation}]</p>

              {/* Slow + normal TTS */}
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => speak(answer)}
                  className="flex items-center gap-1.5 bg-white border border-green-300 text-green-700 px-3 py-2 rounded-xl text-xs font-bold"
                >
                  <Volume2 size={14} /> Nghe lại
                </button>
                <button
                  onClick={() => speakSlow(answer)}
                  className="flex items-center gap-1.5 bg-white border border-violet-300 text-violet-700 px-3 py-2 rounded-xl text-xs font-bold"
                >
                  <Turtle size={14} /> Nghe chậm
                </button>
              </div>
            </div>

            {/* Phoneme tips */}
            {tips.length > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
                <p className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-2">💡 Mẹo phát âm</p>
                <ul className="flex flex-col gap-1.5">
                  {tips.map((tip, i) => (
                    <li key={i} className="text-amber-800 text-sm">{tip}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Syllable breakdown for multi-word */}
            {answer.includes(' ') && (
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
                <p className="text-xs font-bold text-blue-500 uppercase tracking-wider mb-2">📖 Từng từ</p>
                <div className="flex flex-wrap gap-2">
                  {answer.split(' ').map((word, i) => (
                    <div key={i} className="bg-white rounded-xl px-3 py-2 border border-blue-200 text-center">
                      <p className="text-blue-800 font-bold text-sm">{word}</p>
                      <button
                        onClick={() => speak(word)}
                        className="text-blue-400 text-xs mt-0.5 flex items-center gap-1 mx-auto"
                      >
                        <Volume2 size={10} /> nghe
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => { setStatus('idle'); setHeard('') }}
                className="flex-1 flex items-center justify-center gap-2 bg-brand-green text-white font-bold py-4 rounded-2xl text-base shadow-lg shadow-green-200"
              >
                <RotateCcw size={18} /> Thử lại
              </button>
              <button
                onClick={() => onAnswer(false)}
                className="flex items-center justify-center gap-1 bg-gray-100 text-gray-500 font-semibold py-4 px-5 rounded-2xl text-sm"
              >
                Bỏ qua <ArrowRight size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Idle hint ───────────────────────────────────────────────────── */}
      {status === 'idle' && attempts === 0 && (
        <div className="bg-gray-50 rounded-2xl p-4 text-center">
          <p className="text-gray-700 font-bold text-lg">{answer}</p>
          <p className="text-gray-500 text-sm mt-0.5">[{pronunciation}]</p>
          {tips.length > 0 && (
            <p className="text-amber-600 text-xs mt-2">💡 {tips[0]}</p>
          )}
        </div>
      )}

      {/* ── Unsupported fallback ─────────────────────────────────────────── */}
      {status === 'unsupported' && (
        <div className="flex flex-col gap-4">
          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-5 text-center">
            <p className="text-yellow-700 font-bold mb-1">⚠️ Cần Chrome hoặc Edge</p>
            <p className="text-yellow-600 text-sm">Trình duyệt này chưa hỗ trợ nhận dạng giọng nói.</p>
          </div>
          <div className="bg-gray-50 rounded-2xl p-5 text-center">
            <p className="text-gray-500 text-sm mb-2">Đáp án đúng:</p>
            <p className="text-gray-800 font-extrabold text-2xl">{answer}</p>
            <p className="text-gray-500 text-sm mb-3">[{pronunciation}]</p>
            <div className="flex gap-2 justify-center">
              <button onClick={() => speak(answer)} className="flex items-center gap-1.5 text-brand-blue bg-blue-50 px-4 py-2 rounded-xl text-sm font-semibold">
                <Volume2 size={15} /> Nghe
              </button>
              <button onClick={() => speakSlow(answer)} className="flex items-center gap-1.5 text-violet-600 bg-violet-50 px-4 py-2 rounded-xl text-sm font-semibold">
                <Turtle size={15} /> Chậm
              </button>
            </div>
          </div>
          {tips.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
              <p className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-2">💡 Mẹo phát âm</p>
              <ul className="flex flex-col gap-1.5">
                {tips.map((tip, i) => <li key={i} className="text-amber-800 text-sm">{tip}</li>)}
              </ul>
            </div>
          )}
          <button onClick={() => onAnswer(true)} className="w-full bg-gray-200 text-gray-700 font-bold py-4 rounded-2xl text-lg">
            Bỏ qua →
          </button>
        </div>
      )}
    </div>
  )
}
