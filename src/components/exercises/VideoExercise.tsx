import { useState } from 'react'
import { motion } from 'framer-motion'
import { PlayCircle } from 'lucide-react'

interface Props {
  youtubeId: string
  title: string
  level: string
  question: string
  options: Array<{ id: string; text: string }>
  correctId: string
  onAnswer: (correct: boolean) => void
}

export default function VideoExercise({ youtubeId, title, level, question, options, correctId, onAnswer }: Props) {
  const [selected, setSelected] = useState<string | null>(null)
  const [videoLoaded, setVideoLoaded] = useState(false)

  function handleSelect(id: string) {
    if (selected) return
    setSelected(id)
    setTimeout(() => onAnswer(id === correctId), 900)
  }

  return (
    <div className="flex flex-col gap-4 px-5 pt-4">
      {/* Video embed */}
      <div className="rounded-3xl overflow-hidden shadow border border-gray-100 bg-black">
        <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
          {!videoLoaded && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 text-white gap-3">
              <PlayCircle size={48} className="text-white/70" />
              <p className="text-sm font-semibold text-white/80">{title}</p>
              <span className="text-xs px-2 py-1 bg-white/10 rounded-full">{level}</span>
              <button
                onClick={() => setVideoLoaded(true)}
                className="mt-2 px-6 py-2 bg-red-600 rounded-full text-sm font-bold hover:bg-red-500 transition-colors"
              >
                Phát video
              </button>
            </div>
          )}
          {videoLoaded && (
            <iframe
              className="absolute inset-0 w-full h-full"
              src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0`}
              title={title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          )}
        </div>
      </div>

      {/* Question */}
      <div className="bg-white rounded-3xl shadow border border-gray-100 p-5">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Sau khi xem video</p>
        <p className="text-base font-bold text-gray-800">{question}</p>
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
              className={`w-full px-5 py-4 rounded-2xl font-semibold text-left text-sm transition-colors ${style}`}
            >
              {opt.text}
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
