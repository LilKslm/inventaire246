let _XLSX = null
async function getXLSX() {
  if (!_XLSX) _XLSX = await import('xlsx')
  return _XLSX
}

/**
 * Parse an inventory XLSX/CSV file.
 * Accepts columns in English OR French (case-insensitive):
 *   Name / Nom
 *   Category / Catégorie
 *   Storage Location / Emplacement
 *   Total Quantity / Quantité Totale
 * Returns array of inventory item objects ready for Firestore upsert.
 */
export async function parseInventoryFile(file) {
  const XLSX = await getXLSX()
  const buf = await file.arrayBuffer()
  const wb = XLSX.read(buf, { type: 'array' })
  const sheet = wb.Sheets[wb.SheetNames[0]]
  const rows = XLSX.utils.sheet_to_json(sheet, { defval: '' })

  // Normalize column headers to lowercase for flexible matching
  const normalized = rows.map(row => {
    const n = {}
    for (const [k, v] of Object.entries(row)) {
      n[k.trim().toLowerCase()] = v
    }
    return n
  })

  // Helper: pick the first truthy value from a list of possible column names
  const pick = (r, ...keys) => {
    for (const k of keys) {
      if (r[k] !== undefined && r[k] !== '') return r[k]
    }
    return ''
  }

  return normalized
    .filter(r =>
      pick(r, 'name', 'nom') &&
      pick(r, 'total quantity', 'totalqty', 'qty', 'quantité totale', 'quantite totale')
    )
    .map(r => {
      const totalQty = Number(pick(r, 'total quantity', 'totalqty', 'qty', 'quantité totale', 'quantite totale')) || 0
      return {
        name:            String(pick(r, 'name', 'nom')).trim(),
        category:        String(pick(r, 'category', 'catégorie', 'categorie') || 'Outils').trim(),
        storageLocation: String(pick(r, 'storage location', 'location', 'emplacement') || '').trim(),
        totalQty,
        availableQty:    totalQty,
      }
    })
}
