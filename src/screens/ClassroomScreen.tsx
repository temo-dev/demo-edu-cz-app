import { useState } from 'react'
import { motion } from 'framer-motion'
import { Users, Clock, ExternalLink } from 'lucide-react'
import { mockClasses } from '../data/mockSocial'
import type { CEFRLevel } from '../types/content'

type LevelFilter = 'all' | CEFRLevel

const levelColors: Record<string, string> = {
  A1: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  A2: 'bg-blue-100 text-blue-700 border-blue-200',
  B1: 'bg-purple-100 text-purple-700 border-purple-200',
}

const tagColors: string[] = ['bg-gray-100 text-gray-600', 'bg-amber-50 text-amber-600', 'bg-blue-50 text-blue-600']

export default function ClassroomScreen() {
  const [filter, setFilter] = useState<LevelFilter>('all')

  const filtered = filter === 'all' ? mockClasses : mockClasses.filter((c) => c.level === filter)

  return (
    <div className="min-h-screen bg-babbel-bg pb-24">
      {/* Header */}
      <div className="bg-white px-5 pt-6 pb-4 sticky top-0 z-10 shadow-sm">
        <h1 className="text-xl font-extrabold text-gray-900 mb-1">Lớp Học Nhỏ</h1>
        <p className="text-xs text-gray-400 mb-3">Học trực tuyến với giáo viên người Séc</p>

        {/* Level filter */}
        <div className="flex gap-2">
          {(['all', 'A1', 'A2', 'B1'] as LevelFilter[]).map((l) => (
            <button
              key={l}
              onClick={() => setFilter(l)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                filter === l
                  ? 'bg-babbel-orange text-white'
                  : 'bg-gray-100 text-gray-500'
              }`}
            >
              {l === 'all' ? 'Tất cả' : l}
            </button>
          ))}
        </div>
      </div>

      {/* Classes list */}
      <div className="px-5 pt-4 flex flex-col gap-4">
        {filtered.map((cls, i) => {
          const spotsLeft = cls.maxStudents - cls.students
          return (
            <motion.div
              key={cls.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden"
            >
              {/* Top bar */}
              <div className={`px-5 py-3 flex items-center justify-between border-b ${levelColors[cls.level].split(' ').pop()}`}>
                <div className="flex items-center gap-2">
                  <span className="text-xl">{cls.teacherAvatar}</span>
                  <div>
                    <p className="text-xs font-bold text-gray-700">{cls.teacher}</p>
                    <p className="text-xs text-gray-400">{cls.schedule}</p>
                  </div>
                </div>
                <span className={`text-xs font-bold px-2 py-1 rounded-full border ${levelColors[cls.level]}`}>{cls.level}</span>
              </div>

              {/* Body */}
              <div className="px-5 py-4">
                <h3 className="font-bold text-gray-800 text-sm mb-1">{cls.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed mb-3">{cls.description}</p>

                <div className="flex items-center gap-4 mb-3">
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <Clock size={12} />
                    <span>{cls.duration} phút</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <Users size={12} />
                    <span>{cls.students}/{cls.maxStudents} học viên</span>
                  </div>
                  <span className={`text-xs font-semibold ${spotsLeft <= 1 ? 'text-red-500' : 'text-emerald-600'}`}>
                    {spotsLeft > 0 ? `Còn ${spotsLeft} chỗ` : 'Hết chỗ'}
                  </span>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {cls.tags.map((tag, j) => (
                    <span key={tag} className={`text-xs px-2 py-0.5 rounded-full ${tagColors[j % tagColors.length]}`}>
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Slots bar */}
                <div className="h-1.5 bg-gray-100 rounded-full mb-4">
                  <div
                    className="h-full bg-babbel-orange rounded-full"
                    style={{ width: `${(cls.students / cls.maxStudents) * 100}%` }}
                  />
                </div>

                {/* Next session + Join */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-400">Buổi tiếp theo</p>
                    <p className="text-xs font-bold text-gray-700">{cls.nextSession}</p>
                  </div>
                  <a
                    href={cls.meetLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-bold transition-colors ${
                      spotsLeft > 0
                        ? 'bg-babbel-orange text-white'
                        : 'bg-gray-100 text-gray-400 pointer-events-none'
                    }`}
                  >
                    Tham gia <ExternalLink size={12} />
                  </a>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
