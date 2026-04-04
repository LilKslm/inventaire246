import { useState } from 'react'
import { urgencyClass, formatDate, formatDateShort } from '../../utils/dates.js'
import { returnItems } from '../../utils/firebase.js'
import StatusBadge from '../ui/StatusBadge.jsx'

const ROW_STYLES = {
  green:    'bg-green-50  border-l-4 border-green-400',
  yellow:   'bg-yellow-50 border-l-4 border-yellow-400',
  red:      'bg-red-50    border-l-4 border-red-500',
  returned: 'bg-gray-50   border-l-4 border-gray-200',
}

export default function CheckoutRow({ checkout }) {
  const [loading, setLoading] = useState(false)
  const returnDate = checkout.returnDate?.toDate?.() || checkout.returnDate
  const checkoutDate = checkout.checkoutDate?.toDate?.() || checkout.checkoutDate
  const actualReturnDate = checkout.actualReturnDate?.toDate?.() || checkout.actualReturnDate

  const urgency = urgencyClass(returnDate, checkout.status)
  const rowClass = ROW_STYLES[urgency] || ROW_STYLES.green

  async function handleMarkReturned() {
    setLoading(true)
    try {
      await returnItems([checkout])
    } catch (err) {
      console.error('Failed to mark as returned:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <tr className={`${rowClass} border-b border-white transition-colors`}>
      <td className="px-4 py-3">
        <p className="text-sm font-semibold text-apple-dark">{checkout.itemName}</p>
        {checkout.storageLocation && (
          <p className="text-xs text-apple-tertiary">{checkout.storageLocation}</p>
        )}
      </td>
      <td className="px-4 py-3 text-sm text-apple-dark font-medium text-center">{checkout.quantity}</td>
      <td className="px-4 py-3">
        <p className="text-sm text-apple-dark">{checkout.personName}</p>
        <span
          className="inline-block text-xs px-2 py-0.5 rounded-full font-medium mt-0.5"
          style={{ backgroundColor: checkout.teamColor, color: checkout.teamTextColor || '#fff' }}
        >
          {checkout.teamName}
        </span>
      </td>
      <td className="px-4 py-3 text-sm text-apple-secondary hidden sm:table-cell">
        {formatDateShort(checkoutDate)}
      </td>
      <td className="px-4 py-3 text-sm text-apple-secondary">
        {checkout.status === 'returned' && actualReturnDate
          ? formatDateShort(actualReturnDate)
          : formatDateShort(returnDate)
        }
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <StatusBadge status={checkout.status === 'returned' ? 'returned' : urgency} />
          {checkout.status === 'active' && (
            <button
              onClick={handleMarkReturned}
              disabled={loading}
              className="text-xs px-2 py-1 rounded-lg font-medium text-apple-blue bg-blue-50 hover:bg-blue-100 transition-colors disabled:opacity-40"
            >
              {loading ? '…' : '↩ Retourner'}
            </button>
          )}
        </div>
      </td>
    </tr>
  )
}
