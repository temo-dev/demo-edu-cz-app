import { BookOpen, Map, User } from 'lucide-react'
import { useNav, type Screen } from '../../App'

const tabs: { id: Screen; label: string; Icon: React.ComponentType<{ size?: number; className?: string }> }[] = [
  { id: 'home', label: 'Học', Icon: BookOpen },
  { id: 'course', label: 'Khóa học', Icon: Map },
  { id: 'profile', label: 'Hồ sơ', Icon: User },
]

export default function AppShell() {
  const { screen, navigate } = useNav()

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t border-gray-200 flex safe-area-bottom z-50">
      {tabs.map(({ id, label, Icon }) => {
        const active = screen === id
        return (
          <button
            key={id}
            onClick={() => navigate(id)}
            className={`flex-1 flex flex-col items-center py-2 gap-0.5 transition-colors ${
              active ? 'text-brand-green' : 'text-gray-400'
            }`}
          >
            <Icon size={24} className={active ? 'text-brand-green' : 'text-gray-400'} />
            <span className={`text-[11px] font-semibold ${active ? 'text-brand-green' : 'text-gray-400'}`}>
              {label}
            </span>
            {active && <span className="w-1 h-1 rounded-full bg-brand-green mt-0.5" />}
          </button>
        )
      })}
    </nav>
  )
}
