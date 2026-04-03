export default function ItemRow({ item, cartQty, onAdd, onRemove, teamColor }) {
  const available = item.availableQty
  const inCart = cartQty > 0

  return (
    <div className={`bg-white rounded-xl px-4 py-3 shadow-apple flex items-center gap-3 transition-all ${inCart ? 'ring-2' : ''}`}
      style={inCart ? { '--tw-ring-color': teamColor } : {}}>

      {/* Item info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-apple-dark truncate">{item.name}</p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-xs text-apple-secondary">{item.category}</span>
          {item.storageLocation && (
            <>
              <span className="text-apple-gray-3">·</span>
              <span className="text-xs text-apple-tertiary">{item.storageLocation}</span>
            </>
          )}
        </div>
      </div>

      {/* Availability */}
      <div className="text-right shrink-0">
        <span className={`text-xs font-semibold ${available > 0 ? 'text-apple-green' : 'text-apple-red'}`}>
          {available}/{item.totalQty}
        </span>
        <p className="text-xs text-apple-tertiary">avail.</p>
      </div>

      {/* Stepper */}
      {available > 0 ? (
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={onRemove}
            disabled={cartQty === 0}
            className="w-7 h-7 rounded-full flex items-center justify-center text-lg font-medium transition-colors disabled:opacity-30 bg-apple-gray hover:bg-apple-gray-2 text-apple-dark"
          >
            −
          </button>
          <span className="w-6 text-center text-sm font-semibold text-apple-dark">{cartQty}</span>
          <button
            onClick={onAdd}
            disabled={cartQty >= available}
            className="w-7 h-7 rounded-full flex items-center justify-center text-lg font-medium transition-colors disabled:opacity-30 text-white"
            style={{ backgroundColor: teamColor }}
          >
            +
          </button>
        </div>
      ) : (
        <span className="text-xs text-apple-red font-medium shrink-0">Unavailable</span>
      )}
    </div>
  )
}
