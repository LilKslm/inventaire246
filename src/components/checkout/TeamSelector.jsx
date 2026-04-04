import { TEAMS } from '../../constants/teams.js'

export default function TeamSelector({ onSelect }) {
  return (
    <div className="page-enter max-w-2xl mx-auto px-4 py-8">
      <div className="flex flex-col items-center mb-10">
        <button
          onClick={async () => {
            if ('serviceWorker' in navigator) {
              const regs = await navigator.serviceWorker.getRegistrations()
              for (const r of regs) await r.unregister()
              const keys = await caches.keys()
              for (const k of keys) await caches.delete(k)
            }
            window.location.reload(true)
          }}
        >
          <img
            src="./applogo.jpg"
            alt="Inventaire246"
            className="w-20 h-20 rounded-3xl object-cover shadow-apple-md mb-5 active:scale-95 transition-transform"
          />
        </button>
        <h1 className="text-xl font-bold text-apple-dark text-center">
          Sélectionnez votre unité scoute
        </h1>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {TEAMS.map(team => (
          <button
            key={team.id}
            onClick={() => onSelect(team)}
            className="group rounded-2xl p-5 flex flex-col items-center text-center transition-all duration-150 hover:scale-105 active:scale-95 shadow-apple hover:shadow-apple-md"
            style={{ backgroundColor: team.color }}
          >
            <span className="text-3xl mb-2">{team.emoji}</span>
            <span
              className="block text-base font-bold"
              style={{ color: team.textColor }}
            >
              {team.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
