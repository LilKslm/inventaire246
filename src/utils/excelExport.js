/**
 * Export current inventory items to an Excel file with French headers.
 */
export async function exportInventoryToExcel(items) {
  const XLSX = await import('xlsx')

  const rows = items.map(item => ({
    'Nom':             item.name,
    'Catégorie':       item.category,
    'Emplacement':     item.storageLocation || '',
    'Quantité Totale': item.totalQty,
    'Disponible':      item.availableQty,
  }))

  const ws = XLSX.utils.json_to_sheet(rows)

  // Auto-size columns
  ws['!cols'] = [
    { wch: 30 }, // Nom
    { wch: 16 }, // Catégorie
    { wch: 20 }, // Emplacement
    { wch: 16 }, // Quantité Totale
    { wch: 12 }, // Disponible
  ]

  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Inventaire')
  XLSX.writeFile(wb, `Inventaire246_${new Date().toISOString().slice(0, 10)}.xlsx`)
}
