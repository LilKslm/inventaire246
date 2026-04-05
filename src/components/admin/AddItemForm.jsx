import { useState } from 'react'
import { addInventoryItem } from '../../utils/firebase.js'
import { CATEGORIES } from '../../constants/teams.js'

const ITEM_CATEGORIES = CATEGORIES.filter(c => c !== 'Tout')

const EMPTY = { name: '', category: 'Outils', storageLocation: '', totalQty: 1 }

export default function AddItemForm() {
  const [form, setForm] = useState(EMPTY)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(null)
  const [open, setOpen] = useState(false)

  function update(field, value) {
    setForm(prev => ({ ...prev, [field]: value }))
    setSuccess(false)
    setError(null)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.name.trim()) return
    setLoading(true)
    setError(null)
    try {
      await addInventoryItem({
        name: form.name.trim(),
        category: form.category,
        storageLocation: form.storageLocation.trim(),
        totalQty: Number(form.totalQty) || 1,
        availableQty: Number(form.totalQty) || 1,
      })
      setSuccess(true)
      setForm(EMPTY)
    } catch (err) {
      setError('Échec de l\'ajout. Veuillez réessayer.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-apple overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full px-5 py-4 flex items-center justify-between text-left"
      >
        <div>
          <p className="text-sm font-semibold text-apple-dark">Ajouter un article</p>
          <p className="text-xs text-apple-secondary mt-0.5">Ajouter un article individuellement</p>
        </div>
        <span className="text-apple-tertiary text-lg">{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <form onSubmit={handleSubmit} className="px-5 pb-5 border-t border-apple-gray-2 pt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
            <div>
              <label className="block text-xs font-semibold text-apple-secondary mb-1">Nom de l'article *</label>
              <input
                type="text"
                value={form.name}
                onChange={e => update('name', e.target.value)}
                placeholder="ex. Grande tente 4 places"
                className="w-full bg-apple-gray rounded-xl px-3 py-2 text-sm text-apple-dark placeholder-apple-tertiary focus:outline-none focus:ring-2 focus:ring-apple-blue"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-apple-secondary mb-1">Catégorie</label>
              <select
                value={form.category}
                onChange={e => update('category', e.target.value)}
                className="w-full bg-apple-gray rounded-xl px-3 py-2 text-sm text-apple-dark focus:outline-none focus:ring-2 focus:ring-apple-blue"
              >
                {ITEM_CATEGORIES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-apple-secondary mb-1">Emplacement</label>
              <input
                type="text"
                value={form.storageLocation}
                onChange={e => update('storageLocation', e.target.value)}
                placeholder="ex. Étagère A2"
                className="w-full bg-apple-gray rounded-xl px-3 py-2 text-sm text-apple-dark placeholder-apple-tertiary focus:outline-none focus:ring-2 focus:ring-apple-blue"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-apple-secondary mb-1">Quantité totale</label>
              <input
                type="number"
                min="1"
                value={form.totalQty}
                onChange={e => update('totalQty', e.target.value)}
                className="w-full bg-apple-gray rounded-xl px-3 py-2 text-sm text-apple-dark focus:outline-none focus:ring-2 focus:ring-apple-blue"
              />
            </div>
          </div>

          {error && <p className="text-xs text-apple-red mb-3">{error}</p>}
          {success && <p className="text-xs text-apple-green mb-3">✓ Article ajouté avec succès!</p>}

          <button
            type="submit"
            disabled={!form.name.trim() || loading}
            className="w-full py-2.5 rounded-xl text-sm font-semibold text-white bg-apple-blue hover:bg-apple-blue-dark transition-colors disabled:opacity-40"
          >
            {loading ? 'Ajout…' : 'Ajouter à l\'inventaire'}
          </button>
        </form>
      )}
    </div>
  )
}
