import { useState } from 'react'
import { formatDate, urgencyClass } from '../../utils/dates.js'
import { returnItems } from '../../utils/firebase.js'
import TeamBadge from '../ui/TeamBadge.jsx'
import StatusBadge from '../ui/StatusBadge.jsx'

export default function ReturnConfirm({ personName, checkouts, onDone, onBack }) {
  const [selected, setSelected] = useState(new Set(checkouts.map(c => c.id)))
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  function toggleItem(id) {
    setSelected(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function toggleAll() {
    if (selected.size === checkouts.length) {
      setSelected(new Set())
    } else {
      setSelected(new Set(checkouts.map(c => c.id)))
    }
  }

  async function handleReturn() {
    const toReturn = checkouts.filter(c => selected.has(c.id))
    if (toReturn.length === 0) return
    setLoading(true)
    setError(null)
    try {
      await returnItems(toReturn)
      onDone()
    } catch (err) {
      setError('Échec du retour. Veuillez réessayer.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-enter max-w-lg mx-auto px-4 py-8">
      <button onClick={onBack} className="text-apple-secondary hover:text-apple-dark text-sm mb-6 block transition-colors">
        ← Retour
      </button>

      <h2 className="text-xl font-bold text-apple-dark mb-1">Réservations actives</h2>
      <p className="text-apple-secondary text-sm mb-6">
        Articles pour <strong>{personName}</strong>. Sélectionnez les articles que vous retournez.
      </p>

      {/* Select all */}
      <button
        onClick={toggleAll}
        className="text-sm text-apple-blue font-medium mb-3 block"
      >
        {selected.size === checkouts.length ? 'Tout désélectionner' : 'Tout sélectionner'}
      </button>

      {/* Checkout cards */}
      <div className="space-y-2 mb-6">
        {checkouts.map(co => {
          const returnDate = co.returnDate?.toDate?.() || co.returnDate
          const urgency = urgencyClass(returnDate, co.status)
          const isSelected = selected.has(co.id)

          return (
            <button
              key={co.id}
              onClick={() => toggleItem(co.id)}
              className={`w-full text-left bg-white rounded-2xl px-4 py-3 shadow-apple border-2 transition-all ${
                isSelected ? 'border-apple-blue' : 'border-transparent'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-5 h-5 rounded-full border-2 mt-0.5 flex items-center justify-center shrink-0 transition-all ${
                  isSelected ? 'bg-apple-blue border-apple-blue' : 'border-apple-gray-3'
                }`}>
                  {isSelected && <span className="text-white text-xs">✓</span>}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <p className="text-sm font-semibold text-apple-dark truncate">{co.itemName}</p>
                    <span className="text-sm font-semibold text-apple-dark shrink-0">×{co.quantity}</span>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className="text-xs px-2 py-0.5 rounded-full font-medium"
                      style={{ backgroundColor: co.teamColor, color: '#fff' }}
                    >
                      {co.teamName}
                    </span>
                    <StatusBadge status={urgency} />
                    <span className="text-xs text-apple-tertiary">Dû le {formatDate(returnDate)}</span>
                  </div>
                  {co.storageLocation && (
                    <p className="text-xs text-apple-tertiary mt-0.5">{co.storageLocation}</p>
                  )}
                </div>
              </div>
            </button>
          )
        })}
      </div>

      {error && (
        <p className="text-sm text-apple-red mb-4">{error}</p>
      )}

      <button
        onClick={handleReturn}
        disabled={selected.size === 0 || loading}
        className="w-full py-3.5 rounded-2xl font-semibold text-sm text-white bg-apple-blue hover:bg-apple-blue-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {loading ? 'En cours…' : `Retourner ${selected.size} article${selected.size !== 1 ? 's' : ''}`}
      </button>
    </div>
  )
}
