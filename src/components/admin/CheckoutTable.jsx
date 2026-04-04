import CheckoutRow from './CheckoutRow.jsx'
import EmptyState from '../ui/EmptyState.jsx'

export default function CheckoutTable({ checkouts }) {
  if (checkouts.length === 0) {
    return <EmptyState icon="📋" title="Aucune réservation trouvée" subtitle="Les réservations correspondantes apparaîtront ici" />
  }

  return (
    <div className="overflow-x-auto rounded-2xl shadow-apple">
      <table className="w-full text-left border-separate border-spacing-0">
        <thead>
          <tr className="bg-apple-gray">
            <th className="px-4 py-2.5 text-xs font-semibold text-apple-secondary rounded-tl-2xl">Article</th>
            <th className="px-4 py-2.5 text-xs font-semibold text-apple-secondary text-center">Qté</th>
            <th className="px-4 py-2.5 text-xs font-semibold text-apple-secondary">Personne / Unité</th>
            <th className="px-4 py-2.5 text-xs font-semibold text-apple-secondary hidden sm:table-cell">Réservé le</th>
            <th className="px-4 py-2.5 text-xs font-semibold text-apple-secondary">Dû / Retourné</th>
            <th className="px-4 py-2.5 text-xs font-semibold text-apple-secondary rounded-tr-2xl">Statut</th>
          </tr>
        </thead>
        <tbody>
          {checkouts.map(co => (
            <CheckoutRow key={co.id} checkout={co} />
          ))}
        </tbody>
      </table>
    </div>
  )
}
