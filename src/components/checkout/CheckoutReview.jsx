import TeamBadge from '../ui/TeamBadge.jsx'
import { formatDate } from '../../utils/dates.js'

export default function CheckoutReview({ team, personName, returnDate, cart, onConfirm, onBack, loading }) {
  return (
    <div className="page-enter max-w-lg mx-auto px-4 py-8">
      <button onClick={onBack} className="text-apple-secondary hover:text-apple-dark transition-colors text-sm mb-6 block">
        ← Modifier la sélection
      </button>

      {/* Header card */}
      <div className="rounded-2xl overflow-hidden shadow-apple-md mb-6">
        <div className="px-5 py-4" style={{ backgroundColor: team.color }}>
          <h2 className="text-lg font-bold" style={{ color: team.textColor }}>Résumé de la réservation</h2>
          <p className="text-sm opacity-80 mt-0.5" style={{ color: team.textColor }}>Vérifiez avant de confirmer</p>
        </div>
        <div className="bg-white px-5 py-4 grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-apple-tertiary mb-0.5">Personne</p>
            <p className="text-sm font-semibold text-apple-dark">{personName}</p>
          </div>
          <div>
            <p className="text-xs text-apple-tertiary mb-0.5">Unité</p>
            <TeamBadge team={team} />
          </div>
          <div>
            <p className="text-xs text-apple-tertiary mb-0.5">Aujourd'hui</p>
            <p className="text-sm font-semibold text-apple-dark">{formatDate(new Date())}</p>
          </div>
          <div>
            <p className="text-xs text-apple-tertiary mb-0.5">Retour avant le</p>
            <p className="text-sm font-semibold text-apple-dark">{formatDate(returnDate)}</p>
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="bg-white rounded-2xl shadow-apple overflow-hidden mb-6">
        <div className="px-4 py-3 border-b border-apple-gray-2">
          <p className="text-sm font-semibold text-apple-dark">
            Articles ({cart.reduce((s, c) => s + c.quantity, 0)})
          </p>
        </div>
        {cart.map(({ item, quantity }) => (
          <div key={item.id} className="px-4 py-3 flex items-center border-b border-apple-gray last:border-0">
            <div className="flex-1 min-w-0">
              <p className="text-sm text-apple-dark font-medium truncate">{item.name}</p>
              <p className="text-xs text-apple-tertiary mt-0.5">{item.storageLocation || 'Aucun emplacement'}</p>
            </div>
            <span className="text-sm font-semibold text-apple-dark ml-2">×{quantity}</span>
          </div>
        ))}
      </div>

      <button
        onClick={onConfirm}
        disabled={loading}
        className="w-full py-3.5 rounded-2xl font-semibold text-sm transition-all disabled:opacity-60"
        style={{ backgroundColor: team.color, color: team.textColor }}
      >
        {loading ? 'En cours…' : 'Confirmer et télécharger le reçu'}
      </button>
    </div>
  )
}
