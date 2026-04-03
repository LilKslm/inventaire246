import { useState } from 'react'
import { CATEGORIES } from '../../constants/teams.js'
import { useInventory } from '../../hooks/useInventory.js'
import ItemRow from './ItemRow.jsx'
import EmptyState from '../ui/EmptyState.jsx'

export default function InventoryBrowser({ cart, onAddToCart, onRemoveFromCart, teamColor }) {
  const { items, loading } = useInventory()
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')

  const filtered = items.filter(item => {
    const matchCat = category === 'All' || item.category === category
    const matchSearch = !search || item.name.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  function getCartQty(itemId) {
    return cart.find(c => c.item.id === itemId)?.quantity || 0
  }

  function handleAdd(item) {
    const current = getCartQty(item.id)
    if (current < item.availableQty) {
      onAddToCart(item, current + 1)
    }
  }

  function handleRemove(item) {
    const current = getCartQty(item.id)
    if (current > 0) {
      onAddToCart(item, current - 1)
    }
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center py-16">
        <div className="text-apple-tertiary text-sm">Loading inventory…</div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Search */}
      <div className="px-4 mb-3">
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-apple-tertiary text-sm">🔍</span>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search items…"
            className="w-full bg-white border border-apple-gray-2 rounded-xl pl-9 pr-4 py-2.5 text-sm text-apple-dark placeholder-apple-tertiary focus:outline-none focus:ring-2 shadow-apple"
            style={{ '--tw-ring-color': teamColor }}
          />
        </div>
      </div>

      {/* Category pills */}
      <div className="px-4 mb-3 flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`shrink-0 px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              category === cat
                ? 'text-white'
                : 'bg-white text-apple-secondary border border-apple-gray-2'
            }`}
            style={category === cat ? { backgroundColor: teamColor, color: '#fff' } : {}}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Items list */}
      <div className="flex-1 overflow-y-auto px-4 space-y-2 pb-4">
        {filtered.length === 0 ? (
          <EmptyState icon="📦" title="No items found" subtitle="Try adjusting your search or filter" />
        ) : (
          filtered.map(item => (
            <ItemRow
              key={item.id}
              item={item}
              cartQty={getCartQty(item.id)}
              onAdd={() => handleAdd(item)}
              onRemove={() => handleRemove(item)}
              teamColor={teamColor}
            />
          ))
        )}
      </div>
    </div>
  )
}
