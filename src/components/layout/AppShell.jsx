const PAGES = { CHECKOUT: 'checkout', RETURN: 'return', ADMIN: 'admin' }

const tabs = [
  { id: PAGES.CHECKOUT, label: 'Checkout', icon: '📦' },
  { id: PAGES.RETURN,   label: 'Returns',  icon: '↩️'  },
  { id: PAGES.ADMIN,    label: 'Admin',    icon: '⚙️'  },
]

export default function AppShell({ activePage, onNavigate }) {
  return (
    <>
      {/* Desktop top header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-apple-gray-2 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🎒</span>
            <span className="font-semibold text-apple-dark text-sm tracking-tight">
              Scout Inventory
            </span>
          </div>

          {/* Desktop nav */}
          <nav className="hidden sm:flex items-center gap-1 bg-apple-gray rounded-xl p-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => onNavigate(tab.id)}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                  activePage === tab.id
                    ? 'bg-white text-apple-dark shadow-apple'
                    : 'text-apple-secondary hover:text-apple-dark'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Mobile bottom nav */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-t border-apple-gray-2 flex">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => onNavigate(tab.id)}
            className={`flex-1 flex flex-col items-center justify-center py-2 gap-0.5 text-xs transition-colors ${
              activePage === tab.id
                ? 'text-apple-blue font-semibold'
                : 'text-apple-tertiary'
            }`}
          >
            <span className="text-lg leading-none">{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </nav>
    </>
  )
}
