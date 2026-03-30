import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useUserStore } from '../store/userStore'
import type { CEFRLevel } from '../types/content'

interface PlacementQuestion {
  id: string
  level: CEFRLevel
  question: string
  options: Array<{ id: string; text: string }>
  correctId: string
}

const questions: PlacementQuestion[] = [
  // A1 (5 câu)
  { id: 'p1', level: 'A1', question: '"Děkuji" có nghĩa là gì?', options: [{ id: 'a', text: 'Xin chào' }, { id: 'b', text: 'Cảm ơn' }, { id: 'c', text: 'Tạm biệt' }, { id: 'd', text: 'Xin lỗi' }], correctId: 'b' },
  { id: 'p2', level: 'A1', question: 'Số "pět" có nghĩa là bao nhiêu?', options: [{ id: 'a', text: '3' }, { id: 'b', text: '4' }, { id: 'c', text: '5' }, { id: 'd', text: '6' }], correctId: 'c' },
  { id: 'p3', level: 'A1', question: '"Já ___ student." — Điền dạng đúng của "být":', options: [{ id: 'a', text: 'je' }, { id: 'b', text: 'jsem' }, { id: 'c', text: 'jsi' }, { id: 'd', text: 'jsou' }], correctId: 'b' },
  { id: 'p4', level: 'A1', question: '"Modrá" nghĩa là màu gì?', options: [{ id: 'a', text: 'Màu đỏ' }, { id: 'b', text: 'Màu vàng' }, { id: 'c', text: 'Màu xanh dương' }, { id: 'd', text: 'Màu xanh lá' }], correctId: 'c' },
  { id: 'p5', level: 'A1', question: 'Cách phủ định "Mám čas" là?', options: [{ id: 'a', text: 'Ne mám čas.' }, { id: 'b', text: 'Nemám čas.' }, { id: 'c', text: 'Mám ne čas.' }, { id: 'd', text: 'Mít ne čas.' }], correctId: 'b' },
  // A2 (5 câu)
  { id: 'p6', level: 'A2', question: '"Kolik to stojí?" có nghĩa là gì?', options: [{ id: 'a', text: 'Bạn muốn gì?' }, { id: 'b', text: 'Cái này ở đâu?' }, { id: 'c', text: 'Giá bao nhiêu?' }, { id: 'd', text: 'Bạn có không?' }], correctId: 'c' },
  { id: 'p7', level: 'A2', question: '"Včera jsem ___ vlak." — Điền dạng quá khứ (nam):', options: [{ id: 'a', text: 'jela' }, { id: 'b', text: 'jet' }, { id: 'c', text: 'jel' }, { id: 'd', text: 'jedu' }], correctId: 'c' },
  { id: 'p8', level: 'A2', question: '"Nemocnice" nghĩa là gì?', options: [{ id: 'a', text: 'Nhà thuốc' }, { id: 'b', text: 'Bệnh viện' }, { id: 'c', text: 'Phòng khám' }, { id: 'd', text: 'Bác sĩ' }], correctId: 'b' },
  { id: 'p9', level: 'A2', question: 'Dạng Accusative của "žena" là?', options: [{ id: 'a', text: 'žena' }, { id: 'b', text: 'ženy' }, { id: 'c', text: 'ženu' }, { id: 'd', text: 'ženě' }], correctId: 'c' },
  { id: 'p10', level: 'A2', question: '"Jízdenka" nghĩa là gì?', options: [{ id: 'a', text: 'Bến xe' }, { id: 'b', text: 'Vé xe' }, { id: 'c', text: 'Lái xe' }, { id: 'd', text: 'Đường phố' }], correctId: 'b' },
  // B1 (5 câu)
  { id: 'p11', level: 'B1', question: '"Jdu bez práce" có nghĩa là?', options: [{ id: 'a', text: 'Tôi đi làm' }, { id: 'b', text: 'Tôi đi mà không có việc làm' }, { id: 'c', text: 'Tôi không thích làm việc' }, { id: 'd', text: 'Tôi đến công ty' }], correctId: 'b' },
  { id: 'p12', level: 'B1', question: '"Životopis" nghĩa là gì?', options: [{ id: 'a', text: 'Hợp đồng lao động' }, { id: 'b', text: 'CV / Lý lịch' }, { id: 'c', text: 'Bảng lương' }, { id: 'd', text: 'Thư mời phỏng vấn' }], correctId: 'b' },
  { id: 'p13', level: 'B1', question: 'Séc gia nhập EU năm nào?', options: [{ id: 'a', text: '1999' }, { id: 'b', text: '2002' }, { id: 'c', text: '2004' }, { id: 'd', text: '2009' }], correctId: 'c' },
  { id: 'p14', level: 'B1', question: '"Rezervace" nghĩa là gì?', options: [{ id: 'a', text: 'Bản đồ' }, { id: 'b', text: 'Hộ chiếu' }, { id: 'c', text: 'Đặt phòng / đặt chỗ' }, { id: 'd', text: 'Hướng dẫn viên' }], correctId: 'c' },
  { id: 'p15', level: 'B1', question: '"Jdu do práce" — "práce" ở cách (pád) nào?', options: [{ id: 'a', text: 'Nominative' }, { id: 'b', text: 'Genitive' }, { id: 'c', text: 'Accusative' }, { id: 'd', text: 'Locative' }], correctId: 'b' },
]

function calcLevel(scores: { A1: number; A2: number; B1: number }): CEFRLevel {
  if (scores.B1 >= 3) return 'B1'
  if (scores.A2 >= 3) return 'A2'
  return 'A1'
}

interface Props {
  onDone: () => void
}

export default function PlacementTestScreen({ onDone }: Props) {
  const { completePlacement, skipPlacement } = useUserStore()
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [scores, setScores] = useState({ A1: 0, A2: 0, B1: 0 })
  const [phase, setPhase] = useState<'intro' | 'test' | 'result'>('intro')
  const [resultLevel, setResultLevel] = useState<CEFRLevel>('A1')

  const q = questions[current]
  const progress = (current / questions.length) * 100

  function handleSelect(id: string) {
    if (selected) return
    setSelected(id)
    const correct = id === q.correctId
    if (correct) {
      setScores((s) => ({ ...s, [q.level]: s[q.level] + 1 }))
    }
    setTimeout(() => {
      if (current + 1 >= questions.length) {
        const newScores = { ...scores }
        if (correct) newScores[q.level] += 1
        const level = calcLevel(newScores)
        setResultLevel(level)
        setPhase('result')
      } else {
        setCurrent((c) => c + 1)
        setSelected(null)
      }
    }, 700)
  }

  function handleConfirm() {
    completePlacement(resultLevel)
    onDone()
  }

  function handleSkip() {
    skipPlacement()
    onDone()
  }

  const levelLabels: Record<CEFRLevel, string> = {
    A1: 'Người mới bắt đầu',
    A2: 'Sơ cấp',
    B1: 'Trung cấp',
  }

  const levelColors: Record<CEFRLevel, string> = {
    A1: 'text-emerald-600',
    A2: 'text-blue-600',
    B1: 'text-purple-600',
  }

  const levelBg: Record<CEFRLevel, string> = {
    A1: 'bg-emerald-50 border-emerald-200',
    A2: 'bg-blue-50 border-blue-200',
    B1: 'bg-purple-50 border-purple-200',
  }

  if (phase === 'intro') {
    return (
      <div className="min-h-screen bg-babbel-bg flex flex-col items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm text-center"
        >
          <div className="text-6xl mb-4">🎯</div>
          <h1 className="text-2xl font-extrabold text-gray-900 mb-3">Kiểm Tra Đầu Vào</h1>
          <p className="text-gray-500 text-sm mb-6 leading-relaxed">
            15 câu hỏi ngắn để xác định trình độ của bạn. Không phạt nếu sai — hãy trả lời theo hiểu biết thực tế!
          </p>
          <div className="bg-white rounded-2xl border border-gray-100 shadow p-4 mb-6 text-left space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span className="text-lg">⏱️</span> 15 câu hỏi, khoảng 5 phút
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span className="text-lg">📊</span> Phân loại A1 / A2 / B1
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span className="text-lg">💚</span> Không trừ tim, không áp lực
            </div>
          </div>
          <button
            onClick={() => setPhase('test')}
            className="w-full py-4 bg-babbel-orange text-white font-bold rounded-2xl text-base mb-3"
          >
            Bắt đầu kiểm tra
          </button>
          <button onClick={handleSkip} className="text-gray-400 text-sm underline">
            Bỏ qua, học từ A1
          </button>
        </motion.div>
      </div>
    )
  }

  if (phase === 'result') {
    return (
      <div className="min-h-screen bg-babbel-bg flex flex-col items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 300 }}
          className="w-full max-w-sm text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="text-7xl mb-4"
          >
            🏆
          </motion.div>
          <h1 className="text-2xl font-extrabold text-gray-900 mb-2">Kết Quả</h1>
          <p className="text-gray-500 text-sm mb-5">Dựa trên các câu trả lời, trình độ của bạn là:</p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className={`rounded-3xl border p-6 mb-6 ${levelBg[resultLevel]}`}
          >
            <p className={`text-5xl font-black mb-1 ${levelColors[resultLevel]}`}>{resultLevel}</p>
            <p className={`text-base font-semibold ${levelColors[resultLevel]}`}>{levelLabels[resultLevel]}</p>
            <p className="text-gray-500 text-xs mt-2">
              A1: {scores.A1}/5 đúng · A2: {scores.A2}/5 đúng · B1: {scores.B1}/5 đúng
            </p>
          </motion.div>

          <button
            onClick={handleConfirm}
            className="w-full py-4 bg-babbel-orange text-white font-bold rounded-2xl text-base mb-3"
          >
            Bắt đầu học từ {resultLevel}
          </button>
          <button onClick={handleSkip} className="text-gray-400 text-sm underline">
            Bắt đầu từ A1 thay vì
          </button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="px-5 pt-5 pb-3">
        <div className="flex items-center justify-between mb-3">
          <button onClick={handleSkip} className="text-gray-400 text-sm">Bỏ qua</button>
          <span className="text-xs font-bold text-gray-400">{current + 1} / {questions.length}</span>
          <span className={`text-xs font-bold px-2 py-1 rounded-full ${
            q.level === 'A1' ? 'bg-emerald-100 text-emerald-600' :
            q.level === 'A2' ? 'bg-blue-100 text-blue-600' :
            'bg-purple-100 text-purple-600'
          }`}>{q.level}</span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-babbel-orange rounded-full"
            initial={false}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="flex-1 px-5 pt-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={q.id}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col gap-4"
          >
            <div className="bg-gray-50 rounded-3xl p-5">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Câu hỏi</p>
              <p className="text-lg font-bold text-gray-800">{q.question}</p>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {q.options.map((opt) => {
                let style = 'bg-white border-2 border-gray-200 text-gray-800'
                if (selected) {
                  if (opt.id === q.correctId) style = 'bg-green-500 border-2 border-green-500 text-white'
                  else if (opt.id === selected) style = 'bg-red-400 border-2 border-red-400 text-white'
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
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
