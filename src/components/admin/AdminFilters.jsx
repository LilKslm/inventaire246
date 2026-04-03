import { TEAMS } from '../../constants/teams.js'

export default function AdminFilters({ teamFilter, setTeamFilter, statusFilter, setStatusFilter }) {
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {/* Team filter */}
      <div className="flex items-center gap-1 flex-wrap">
        <button
          onClick={() => setTeamFilter('all')}
          className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
            teamFilter === 'all'
              ? 'bg-apple-dark text-white'
              : 'bg-white text-apple-secondary border border-apple-gray-2'
          }`}
        >
          All Teams
        </button>
        {TEAMS.map(team => (
          <button
            key={team.id}
            onClick={() => setTeamFilter(team.id)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors border ${
              teamFilter === team.id ? 'text-white border-transparent' : 'bg-white border-apple-gray-2'
            }`}
            style={
              teamFilter === team.id
                ? { backgroundColor: team.color, color: team.textColor }
                : { color: '#636366' }
            }
          >
            {team.label}
          </button>
        ))}
      </div>

      {/* Status filter */}
      <div className="flex items-center gap-1 ml-auto">
        {['all', 'active', 'returned'].map(s => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              statusFilter === s
                ? 'bg-apple-blue text-white'
                : 'bg-white text-apple-secondary border border-apple-gray-2'
            }`}
          >
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>
    </div>
  )
}
