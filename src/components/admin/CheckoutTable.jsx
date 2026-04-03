import CheckoutRow from './CheckoutRow.jsx'
import EmptyState from '../ui/EmptyState.jsx'

export default function CheckoutTable({ checkouts }) {
  if (checkouts.length === 0) {
    return <EmptyState icon="📋" title="No checkouts found" subtitle="Matching checkouts will appear here" />
  }

  return (
    <div className="overflow-x-auto rounded-2xl shadow-apple">
      <table className="w-full text-left border-separate border-spacing-0">
        <thead>
          <tr className="bg-apple-gray">
            <th className="px-4 py-2.5 text-xs font-semibold text-apple-secondary rounded-tl-2xl">Item</th>
            <th className="px-4 py-2.5 text-xs font-semibold text-apple-secondary text-center">Qty</th>
            <th className="px-4 py-2.5 text-xs font-semibold text-apple-secondary">Person / Team</th>
            <th className="px-4 py-2.5 text-xs font-semibold text-apple-secondary hidden sm:table-cell">Checked out</th>
            <th className="px-4 py-2.5 text-xs font-semibold text-apple-secondary">Due / Returned</th>
            <th className="px-4 py-2.5 text-xs font-semibold text-apple-secondary rounded-tr-2xl">Status</th>
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
