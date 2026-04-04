import { DURATION_OPTIONS } from '../../constants/teams.js'
import { calcReturnDate, formatDate } from '../../utils/dates.js'
import TeamBadge from '../ui/TeamBadge.jsx'

export default function PersonForm({ team, draft, onChange, onNext, onBack }) {
  const { personName, selectedDuration, customDays } = draft

  const returnDate = selectedDuration
    ? calcReturnDate(selectedDuration.hours, null)
    : customDays
    ? calcReturnDate(null, customDays)
    : null

  const canProceed = personName.trim().length >= 2 && returnDate

  function handleDurationSelect(dur) {
    onChange({ selectedDuration: dur, customDays: '' })
  }

  function handleCustomDays(e) {
    onChange({ selectedDuration: null, customDays: e.target.value })
  }

  return (
    <div className="page-enter max-w-lg mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={onBack} className="text-apple-secondary hover:text-apple-dark transition-colors">
          ← Retour
        </button>
        <TeamBadge team={team} size="lg" />
      </div>

      <h2 className="text-xl font-bold text-apple-dark mb-6">Vos informations</h2>

      {/* Name */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-apple-dark mb-2">Votre nom</label>
        <input
          type="text"
          value={personName}
          onChange={e => onChange({ personName: e.target.value })}
          placeholder="e.g. Marie Dupont"
          className="w-full bg-white border border-apple-gray-2 rounded-xl px-4 py-3 text-apple-dark placeholder-apple-tertiary focus:outline-none focus:ring-2 focus:border-transparent shadow-apple transition-all"
          style={{ '--tw-ring-color': team.color }}
          autoFocus
        />
      </div>

      {/* Duration */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-apple-dark mb-2">Pour combien de temps?</label>
        <div className="grid grid-cols-3 gap-2 mb-3">
          {DURATION_OPTIONS.map(dur => (
            <button
              key={dur.label}
              onClick={() => handleDurationSelect(dur)}
              className={`rounded-xl px-3 py-2.5 text-sm font-medium border transition-all ${
                selectedDuration?.label === dur.label
                  ? 'text-white border-transparent shadow-apple'
                  : 'bg-white border-apple-gray-2 text-apple-secondary hover:border-gray-300'
              }`}
              style={selectedDuration?.label === dur.label ? { backgroundColor: team.color, color: team.textColor } : {}}
            >
              {dur.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <div className="flex-1 h-px bg-apple-gray-2" />
          <span className="text-xs text-apple-tertiary">ou personnalisé</span>
          <div className="flex-1 h-px bg-apple-gray-2" />
        </div>

        <div className="flex items-center gap-2 mt-3">
          <input
            type="number"
            min="1"
            max="365"
            value={customDays}
            onChange={handleCustomDays}
            placeholder="0"
            className="w-20 text-center bg-white border border-apple-gray-2 rounded-xl px-3 py-2.5 text-apple-dark placeholder-apple-tertiary focus:outline-none focus:ring-2 focus:border-transparent shadow-apple"
            style={{ '--tw-ring-color': team.color }}
          />
          <span className="text-sm text-apple-secondary">jours</span>
        </div>
      </div>

      {/* Return date preview */}
      {returnDate && (
        <div className="rounded-xl bg-white border border-apple-gray-2 px-4 py-3 mb-6 shadow-apple">
          <p className="text-xs text-apple-tertiary mb-0.5">Retour prévu</p>
          <p className="text-sm font-semibold text-apple-dark">{formatDate(returnDate)}</p>
        </div>
      )}

      <button
        onClick={onNext}
        disabled={!canProceed}
        className="w-full py-3 rounded-xl font-semibold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        style={{ backgroundColor: canProceed ? team.color : '#C7C7CC', color: canProceed ? team.textColor : '#fff' }}
      >
        Parcourir l'équipement →
      </button>
    </div>
  )
}
