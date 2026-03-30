import { useState } from 'react'
import { motion } from 'framer-motion'
import { Trophy, Users, MessageSquare } from 'lucide-react'
import { mockUsers, mockGroupMessages } from '../data/mockSocial'
import { useUserStore } from '../store/userStore'
import type { MockUser } from '../data/mockSocial'
import type { ReactElement } from 'react'

type Tab = 'leaderboard' | 'friends' | 'chat'

const levelColors: Record<string, string> = {
  A1: 'bg-emerald-100 text-emerald-700',
  A2: 'bg-blue-100 text-blue-700',
  B1: 'bg-purple-100 text-purple-700',
}

function LeaderboardTab() {
  const { name, xp, streak } = useUserStore()

  const meUser: MockUser = {
    id: 'me',
    name: name || 'Bạn',
    avatar: '🧑‍💻',
    level: 'A1',
    xp,
    streak,
    country: 'VN',
    bio: '',
  }

  const allUsers = [meUser, ...mockUsers].sort((a, b) => b.xp - a.xp)

  return (
    <div className="flex flex-col gap-3 px-5 pt-4">
      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Bảng Xếp Hạng Tuần</p>
      {allUsers.map((user, i) => (
        <motion.div
          key={user.id}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.05 }}
          className={`flex items-center gap-3 rounded-2xl p-3 ${
            user.id === 'me' ? 'bg-orange-50 border border-babbel-orange' : 'bg-white border border-gray-100'
          }`}
        >
          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-black ${
            i === 0 ? 'bg-yellow-400 text-white' :
            i === 1 ? 'bg-gray-300 text-white' :
            i === 2 ? 'bg-amber-600 text-white' :
            'bg-gray-100 text-gray-500'
          }`}>
            {i + 1}
          </div>
          <div className="text-2xl">{user.avatar}</div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-gray-800 text-sm">
              {user.name}{user.id === 'me' && ' (Bạn)'}
            </p>
            <div className="flex items-center gap-2 mt-0.5">
              <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${levelColors[user.level]}`}>{user.level}</span>
              <span className="text-xs text-gray-400">🔥 {user.streak} ngày</span>
            </div>
          </div>
          <div className="text-right">
            <p className="font-bold text-babbel-orange text-sm">{user.xp.toLocaleString()}</p>
            <p className="text-xs text-gray-400">XP</p>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

function FriendsTab() {
  return (
    <div className="flex flex-col gap-3 px-5 pt-4">
      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Bạn Học</p>
      {mockUsers.map((user, i) => (
        <motion.div
          key={user.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          className="bg-white border border-gray-100 rounded-2xl p-4 flex items-start gap-3"
        >
          <div className="text-3xl">{user.avatar}</div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="font-bold text-gray-800 text-sm">{user.name}</p>
              <span className="text-xs text-gray-400">{user.country === 'VN' ? '🇻🇳' : '🇨🇿'}</span>
            </div>
            <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{user.bio}</p>
            <div className="flex items-center gap-3 mt-1.5">
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${levelColors[user.level]}`}>{user.level}</span>
              <span className="text-xs text-gray-400">⭐ {user.xp.toLocaleString()} XP</span>
              <span className="text-xs text-gray-400">🔥 {user.streak}</span>
            </div>
          </div>
          <button className="flex-shrink-0 text-xs font-semibold text-babbel-orange border border-babbel-orange rounded-xl px-3 py-1.5">
            Theo dõi
          </button>
        </motion.div>
      ))}
    </div>
  )
}

function ChatTab() {
  const userMap = Object.fromEntries(mockUsers.map((u) => [u.id, u]))

  return (
    <div className="flex flex-col px-5 pt-4 pb-4">
      <div className="bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3 mb-4 text-xs text-amber-700 font-semibold">
        💬 Nhóm chat đang chỉ xem — Tính năng nhắn tin sẽ sớm ra mắt!
      </div>
      <div className="flex flex-col gap-3">
        {mockGroupMessages.map((msg, i) => {
          const user = userMap[msg.userId]
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="flex items-start gap-3"
            >
              <div className="text-2xl mt-0.5">{user?.avatar ?? '👤'}</div>
              <div className="flex-1">
                <div className="flex items-baseline gap-2">
                  <p className="text-xs font-bold text-gray-700">{user?.name ?? 'Ẩn danh'}</p>
                  <p className="text-xs text-gray-400">{msg.time}</p>
                </div>
                <p className="text-sm text-gray-700 mt-0.5 leading-relaxed">{msg.text}</p>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

export default function CommunityScreen() {
  const [tab, setTab] = useState<Tab>('leaderboard')

  const tabs: Array<{ key: Tab; label: string; icon: ReactElement }> = [
    { key: 'leaderboard', label: 'Xếp hạng', icon: <Trophy size={16} /> },
    { key: 'friends', label: 'Bạn học', icon: <Users size={16} /> },
    { key: 'chat', label: 'Nhóm chat', icon: <MessageSquare size={16} /> },
  ]

  return (
    <div className="min-h-screen bg-babbel-bg pb-24">
      {/* Header */}
      <div className="bg-white px-5 pt-6 pb-0 sticky top-0 z-10 shadow-sm">
        <h1 className="text-xl font-extrabold text-gray-900 mb-3">Cộng Đồng</h1>
        <div className="flex">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-sm font-semibold border-b-2 transition-colors ${
                tab === t.key
                  ? 'border-babbel-orange text-babbel-orange'
                  : 'border-transparent text-gray-400'
              }`}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>
      </div>

      {tab === 'leaderboard' && <LeaderboardTab />}
      {tab === 'friends' && <FriendsTab />}
      {tab === 'chat' && <ChatTab />}
    </div>
  )
}
