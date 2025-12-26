import { NavLink } from 'react-router-dom'
import { Wallet, Gift, QrCode, User } from 'lucide-react'

export function BottomNav() {
  const links = [
    { to: '/wallet', icon: Wallet, label: 'Wallet' },
    { to: '/rewards', icon: Gift, label: 'Rewards' },
    { to: '/scan', icon: QrCode, label: 'Scan' },
    { to: '/profile', icon: User, label: 'Profile' },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 safe-area-inset-bottom">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center py-2 px-3 rounded-lg transition ${
                isActive
                  ? 'text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon className={`w-6 h-6 mb-1 ${isActive ? 'fill-current' : ''}`} />
                <span className="text-xs font-medium">{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
