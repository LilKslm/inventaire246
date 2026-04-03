import { TEAMS } from '../../constants/teams.js'

export default function TeamSelector({ onSelect }) {
  return (
    <div className="page-enter max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-apple-dark mb-1">Welcome</h1>
      <p className="text-apple-secondary mb-8">Select your scout team to get started.</p>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {TEAMS.map(team => (
          <button
            key={team.id}
            onClick={() => onSelect(team)}
            className="group relative rounded-2xl p-5 text-left transition-all duration-150 hover:scale-105 active:scale-95 shadow-apple hover:shadow-apple-md"
            style={{ backgroundColor: team.color }}
          >
            <span
              className="block text-lg font-bold"
              style={{ color: team.textColor }}
            >
              {team.label}
            </span>
            <span
              className="block text-xs mt-1 opacity-70"
              style={{ color: team.textColor }}
            >
              Tap to select
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
