import { useState, useMemo } from 'react'
import { useCheckouts } from '../hooks/useCheckouts.js'
import { useInventory } from '../hooks/useInventory.js'
import { useAdminStats } from '../hooks/useAdminStats.js'
import { urgencyClass } from '../utils/dates.js'
import AdminFilters from '../components/admin/AdminFilters.jsx'
import CheckoutTable from '../components/admin/CheckoutTable.jsx'
import AddItemForm from '../components/admin/AddItemForm.jsx'
import ImportDropzone from '../components/admin/ImportDropzone.jsx'
import { exportInventoryToExcel } from '../utils/excelExport.js'
import { deleteAllInventoryItems } from '../utils/firebase.js'

export default function AdminPage() {
  const { checkouts, loading: checkoutsLoading } = useCheckouts()
  const { items, loading: inventoryLoading } = useInventory()
  const stats = useAdminStats(checkouts)

  const [teamFilter, setTeamFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('active')
  const [tab, setTab] = useState('checkouts') // 'checkouts' | 'inventory' | 'import'

  // Filter checkouts
  const filtered = useMemo(() => {
    return checkouts.filter(co => {
      const matchTeam = teamFilter === 'all' || co.teamName?.toLowerCase().replace(/\s/g, '') === teamFilter
      const matchStatus = statusFilter === 'all' || co.status === statusFilter
      return matchTeam && matchStatus
    })
  }, [checkouts, teamFilter, statusFilter])

  return (
    <div className="page-enter max-w-5xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-apple-dark mb-1">Tableau de bord</h1>
      <p className="text-apple-secondary text-sm mb-6">Aperçu en temps réel de l'inventaire et des réservations.</p>

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <StatCard label="Actif" value={stats.activeCount} color="text-apple-blue" />
        <StatCard label="Bientôt dû" value={stats.dueSoonCount} color="text-yellow-600" />
        <StatCard label="En retard" value={stats.overdueCount} color="text-apple-red" />
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 bg-apple-gray rounded-xl p-1 mb-4 w-fit">
        {[
          { id: 'checkouts', label: 'Réservations' },
          { id: 'inventory', label: 'Inventaire' },
          { id: 'import',    label: 'Ajouter / Importer' },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
              tab === t.id
                ? 'bg-white text-apple-dark shadow-apple'
                : 'text-apple-secondary hover:text-apple-dark'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Checkouts tab */}
      {tab === 'checkouts' && (
        <>
          <AdminFilters
            teamFilter={teamFilter} setTeamFilter={setTeamFilter}
            statusFilter={statusFilter} setStatusFilter={setStatusFilter}
          />
          {checkoutsLoading ? (
            <p className="text-sm text-apple-tertiary text-center py-8">Loading…</p>
          ) : (
            <CheckoutTable checkouts={filtered} />
          )}
        </>
      )}

      {/* Inventory tab */}
      {tab === 'inventory' && (
        <div className="bg-white rounded-2xl shadow-apple overflow-hidden">
          {items.length > 0 && (
            <div className="px-4 pt-4 flex justify-end">
              <button
                onClick={() => exportInventoryToExcel(items)}
                className="px-4 py-2 rounded-xl text-sm font-semibold text-apple-blue bg-apple-gray hover:bg-apple-gray-2 transition-colors"
              >
                Exporter Excel
              </button>
            </div>
          )}
          {inventoryLoading ? (
            <p className="text-sm text-apple-tertiary text-center py-8">Loading…</p>
          ) : items.length === 0 ? (
            <p className="text-sm text-apple-tertiary text-center py-8">Aucun article. Importez ou ajoutez des articles.</p>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-apple-gray">
                  <th className="px-4 py-2.5 text-xs font-semibold text-apple-secondary">Article</th>
                  <th className="px-4 py-2.5 text-xs font-semibold text-apple-secondary">Catégorie</th>
                  <th className="px-4 py-2.5 text-xs font-semibold text-apple-secondary hidden sm:table-cell">Emplacement</th>
                  <th className="px-4 py-2.5 text-xs font-semibold text-apple-secondary text-center">Disponible</th>
                  <th className="px-4 py-2.5 text-xs font-semibold text-apple-secondary text-center">Total</th>
                </tr>
              </thead>
              <tbody>
                {items.map(item => (
                  <tr key={item.id} className="border-t border-apple-gray">
                    <td className="px-4 py-2.5 text-sm text-apple-dark font-medium">{item.name}</td>
                    <td className="px-4 py-2.5 text-sm text-apple-secondary">{item.category}</td>
                    <td className="px-4 py-2.5 text-sm text-apple-tertiary hidden sm:table-cell">{item.storageLocation || '—'}</td>
                    <td className="px-4 py-2.5 text-center">
                      <span className={`text-sm font-semibold ${item.availableQty > 0 ? 'text-apple-green' : 'text-apple-red'}`}>
                        {item.availableQty}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-sm text-apple-secondary text-center">{item.totalQty}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Add / Import tab */}
      {tab === 'import' && (
        <div className="space-y-4">
          <AddItemForm />
          <ImportDropzone />

          {/* Export & Clear actions */}
          <div className="flex gap-3">
            {items.length > 0 && (
              <button
                onClick={() => exportInventoryToExcel(items)}
                className="flex-1 py-3 rounded-2xl text-sm font-semibold text-apple-blue bg-white shadow-apple hover:bg-apple-gray transition-colors"
              >
                Exporter l'inventaire (Excel)
              </button>
            )}
            {items.length > 0 && (
              <button
                onClick={async () => {
                  if (!window.confirm(`Supprimer les ${items.length} articles de l'inventaire? Cette action est irréversible.`)) return
                  await deleteAllInventoryItems()
                }}
                className="flex-1 py-3 rounded-2xl text-sm font-semibold text-apple-red bg-white shadow-apple hover:bg-red-50 transition-colors"
              >
                Vider l'inventaire
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function StatCard({ label, value, color }) {
  return (
    <div className="bg-white rounded-2xl shadow-apple px-4 py-4 text-center">
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
      <p className="text-xs text-apple-secondary mt-0.5">{label}</p>
    </div>
  )
}
