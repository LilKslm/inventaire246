import { useState } from 'react'
import { getActiveCheckoutsByName } from '../../utils/firebase.js'

export default function PersonLookup({ onFound }) {
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function handleSearch(e) {
    e.preventDefault()
    if (!name.trim()) return
    setLoading(true)
    setError(null)
    try {
      const results = await getActiveCheckoutsByName(name.trim())
      if (results.length === 0) {
        setError(`Aucune réservation active trouvée pour "${name.trim()}"`)
      } else {
        onFound(name.trim(), results)
      }
    } catch (err) {
      setError('Échec de la recherche. Veuillez réessayer.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-enter max-w-lg mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-apple-dark mb-1">Retourner des articles</h1>
      <p className="text-apple-secondary text-sm mb-8">Entrez votre nom pour trouver vos réservations actives.</p>

      <form onSubmit={handleSearch}>
        <label className="block text-sm font-semibold text-apple-dark mb-2">Votre nom</label>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="e.g. Marie Dupont"
          className="w-full bg-white border border-apple-gray-2 rounded-xl px-4 py-3 text-apple-dark placeholder-apple-tertiary focus:outline-none focus:ring-2 focus:ring-apple-blue focus:border-transparent shadow-apple mb-4"
          autoFocus
        />
        {error && (
          <p className="text-sm text-apple-red mb-4">{error}</p>
        )}
        <button
          type="submit"
          disabled={!name.trim() || loading}
          className="w-full py-3 rounded-xl font-semibold text-sm text-white bg-apple-blue hover:bg-apple-blue-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {loading ? 'Recherche…' : 'Trouver mes réservations →'}
        </button>
      </form>
    </div>
  )
}
