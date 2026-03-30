import { useState } from 'react'
import { motion } from 'framer-motion'
import { Bookmark, BookmarkCheck, PlayCircle, Headphones, Music, ExternalLink } from 'lucide-react'
import { mediaItems } from '../data/mediaContent'
import type { MediaItem } from '../data/mediaContent'
import { useUserStore } from '../store/userStore'
import type { ReactElement } from 'react'

type FilterType = 'all' | 'video' | 'podcast' | 'music'

const typeLabels: Record<FilterType, string> = {
  all: 'Tất cả',
  video: 'Video',
  podcast: 'Podcast',
  music: 'Nhạc',
}

const typeIcons: Record<string, ReactElement> = {
  video: <PlayCircle size={16} />,
  podcast: <Headphones size={16} />,
  music: <Music size={16} />,
}

const levelColors: Record<string, string> = {
  A1: 'bg-emerald-100 text-emerald-700',
  A2: 'bg-blue-100 text-blue-700',
  B1: 'bg-purple-100 text-purple-700',
}

function MediaCard({ item }: { item: MediaItem }) {
  const { bookmarkedMediaIds, toggleBookmark } = useUserStore()
  const [videoOpen, setVideoOpen] = useState(false)
  const bookmarked = bookmarkedMediaIds.includes(item.id)

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden"
    >
      {/* Video thumbnail / embed */}
      {item.type === 'video' && item.youtubeId && (
        <div className="relative w-full bg-gray-900" style={{ paddingBottom: '56.25%' }}>
          {!videoOpen ? (
            <button
              onClick={() => setVideoOpen(true)}
              className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-gray-800 to-gray-900"
            >
              <PlayCircle size={52} className="text-white/80" />
              <span className="text-white/70 text-sm font-semibold px-4 text-center">{item.title}</span>
            </button>
          ) : (
            <iframe
              className="absolute inset-0 w-full h-full"
              src={`https://www.youtube.com/embed/${item.youtubeId}?autoplay=1&rel=0`}
              title={item.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          )}
        </div>
      )}

      {/* Non-video card header */}
      {item.type !== 'video' && (
        <div className={`px-5 pt-4 pb-2 flex items-center gap-3 ${item.type === 'podcast' ? 'bg-indigo-50' : 'bg-pink-50'}`}>
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl ${item.type === 'podcast' ? 'bg-indigo-100' : 'bg-pink-100'}`}>
            {item.type === 'podcast' ? '🎙️' : '🎵'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-gray-800 text-sm leading-tight">{item.title}</p>
            <p className="text-xs text-gray-400 mt-0.5">{item.durationMin} phút</p>
          </div>
        </div>
      )}

      {/* Info */}
      <div className="px-5 py-3">
        {item.type === 'video' && (
          <p className="font-bold text-gray-800 text-sm mb-1">{item.title}</p>
        )}
        <p className="text-gray-500 text-xs leading-relaxed">{item.description}</p>

        <div className="flex items-center gap-2 mt-2 flex-wrap">
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${levelColors[item.level]}`}>{item.level}</span>
          <div className="flex items-center gap-1 text-xs text-gray-400">
            {typeIcons[item.type]}
            <span>{item.durationMin} phút</span>
          </div>
          {item.channel && <span className="text-xs text-gray-400">· {item.channel}</span>}
        </div>
      </div>

      {/* Actions */}
      <div className="px-5 pb-4 flex items-center justify-between">
        <button
          onClick={() => toggleBookmark(item.id)}
          className={`flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-xl transition-colors ${
            bookmarked ? 'bg-amber-50 text-amber-600' : 'bg-gray-50 text-gray-500'
          }`}
        >
          {bookmarked ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
          {bookmarked ? 'Đã lưu' : 'Lưu lại'}
        </button>

        {item.externalUrl && (
          <a
            href={item.externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs text-babbel-orange font-semibold"
          >
            Mở <ExternalLink size={12} />
          </a>
        )}
      </div>
    </motion.div>
  )
}

export default function MediaFeedScreen() {
  const [filter, setFilter] = useState<FilterType>('all')

  const filtered = filter === 'all' ? mediaItems : mediaItems.filter((m) => m.type === filter)

  return (
    <div className="min-h-screen bg-babbel-bg pb-24">
      {/* Header */}
      <div className="bg-white px-5 pt-6 pb-4 sticky top-0 z-10 shadow-sm">
        <h1 className="text-xl font-extrabold text-gray-900 mb-3">Nội Dung Học</h1>

        {/* Filter tabs */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {(['all', 'video', 'podcast', 'music'] as FilterType[]).map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                filter === t
                  ? 'bg-babbel-orange text-white'
                  : 'bg-gray-100 text-gray-500'
              }`}
            >
              {typeLabels[t]}
            </button>
          ))}
        </div>
      </div>

      {/* Feed */}
      <div className="px-5 pt-4 flex flex-col gap-4">
        {filtered.map((item) => (
          <MediaCard key={item.id} item={item} />
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <p className="text-4xl mb-3">📭</p>
            <p className="text-sm">Không có nội dung cho bộ lọc này.</p>
          </div>
        )}
      </div>
    </div>
  )
}
