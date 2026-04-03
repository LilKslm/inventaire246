import TeamBadge from '../ui/TeamBadge.jsx'

export default function CartPanel({ team, cart, onReview, onRemove }) {
  const totalItems = cart.reduce((sum, c) => sum + c.quantity, 0)

  return (
    <div className="bg-white border-l border-apple-gray-2 flex flex-col h-full">
      {/* Header */}
      <div className="px-4 py-3 border-b border-apple-gray-2">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-apple-dark">Cart</h3>
          <span className="text-xs text-apple-secondary">{totalItems} item{totalItems !== 1 ? 's' : ''}</span>
        </div>
      </div>

      {/* Items */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {cart.length === 0 ? (
          <p className="text-xs text-apple-tertiary text-center py-8">
            Add items from the list
          </p>
        ) : (
          cart.map(({ item, quantity }) => (
            <div key={item.id} className="flex items-center gap-2 bg-apple-gray rounded-xl px-3 py-2">
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-apple-dark truncate">{item.name}</p>
                <p className="text-xs text-apple-secondary">×{quantity}</p>
              </div>
              <button
                onClick={() => onRemove(item.id)}
                className="text-apple-tertiary hover:text-apple-red text-sm transition-colors"
              >
                ✕
              </button>
            </div>
          ))
        )}
      </div>

      {/* CTA */}
      <div className="p-3 border-t border-apple-gray-2">
        <button
          onClick={onReview}
          disabled={cart.length === 0}
          className="w-full py-3 rounded-xl font-semibold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ backgroundColor: team.color, color: team.textColor }}
        >
          Review Checkout →
        </button>
      </div>
    </div>
  )
}
