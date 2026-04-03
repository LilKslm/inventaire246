let _XLSX = null
async function getXLSX() {
  if (!_XLSX) _XLSX = await import('xlsx')
  return _XLSX
}

/**
 * Parse an inventory XLSX/CSV file.
 * Expected columns (case-insensitive): Name, Category, Storage Location, Total Quantity
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

  return normalized
    .filter(r => r['name'] && (r['total quantity'] || r['totalqty'] || r['qty']))
    .map(r => {
      const totalQty = Number(r['total quantity'] || r['totalqty'] || r['qty']) || 0
      return {
        name:            String(r['name']).trim(),
        category:        String(r['category'] || 'Misc').trim(),
        storageLocation: String(r['storage location'] || r['location'] || '').trim(),
        totalQty,
        availableQty:    totalQty,
      }
    })
}
