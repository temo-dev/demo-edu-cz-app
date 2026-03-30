import { BookOpen, Map, Play, Users, User } from 'lucide-react'
import { useNav, type Screen } from '../../App'
import { useReviewStore } from '../../store/reviewStore'

const tabs: {
  id: Screen
  label: string
  Icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>
}[] = [
  { id: 'home',      label: 'Học',       Icon: BookOpen },
  { id: 'course',    label: 'Bài học',   Icon: Map      },
  { id: 'media',     label: 'Nội dung',  Icon: Play     },
  { id: 'community', label: 'Cộng đồng', Icon: Users    },
  { id: 'profile',   label: 'Hồ sơ',    Icon: User     },
]

export default function AppShell() {
  const { screen, navigate } = useNav()
  const dueCount = useReviewStore((s) => s.getDueCount())

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t border-babbel-border flex z-50">
      {tabs.map(({ id, label, Icon }) => {
        const active = screen === id
        const hasDot = id === 'course' && dueCount > 0

        return (
          <button
            key={id}
            onClick={() => navigate(id)}
            className="flex-1 flex flex-col items-center pt-3 pb-4 gap-1 relative transition-colors"
          >
            <div className="relative">
              <Icon
                size={22}
                strokeWidth={active ? 2.5 : 1.8}
                className={active ? 'text-babbel-orange' : 'text-gray-400'}
              />
              {hasDot && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-babbel-orange border-2 border-white" />
              )}
            </div>
            <span
              className={`text-[10px] leading-tight ${
                active ? 'font-bold text-babbel-orange' : 'font-medium text-gray-400'
              }`}
            >
              {label}
            </span>
          </button>
        )
      })}
    </nav>
  )
}
