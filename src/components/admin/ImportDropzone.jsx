import { useState, useRef } from 'react'
import { parseInventoryFile } from '../../utils/excelImport.js'
import { upsertInventoryItem } from '../../utils/firebase.js'

export default function ImportDropzone() {
  const [dragging, setDragging] = useState(false)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [open, setOpen] = useState(false)
  const inputRef = useRef()

  async function processFile(file) {
    if (!file) return
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const items = await parseInventoryFile(file)
      if (items.length === 0) {
        setError('No valid rows found. Check column names: Name, Category, Storage Location, Total Quantity.')
        return
      }
      for (const item of items) {
        await upsertInventoryItem(item)
      }
      setResult({ count: items.length })
    } catch (err) {
      setError(`Import failed: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  function handleDrop(e) {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) processFile(file)
  }

  function handleFileChange(e) {
    const file = e.target.files[0]
    if (file) processFile(file)
    e.target.value = ''
  }

  return (
    <div className="bg-white rounded-2xl shadow-apple overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full px-5 py-4 flex items-center justify-between text-left"
      >
        <div>
          <p className="text-sm font-semibold text-apple-dark">Import from Excel / CSV</p>
          <p className="text-xs text-apple-secondary mt-0.5">Bulk import inventory items from a spreadsheet</p>
        </div>
        <span className="text-apple-tertiary text-lg">{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div className="px-5 pb-5 border-t border-apple-gray-2 pt-4">
          <p className="text-xs text-apple-secondary mb-3">
            Required columns (case-insensitive): <strong>Name</strong>, <strong>Category</strong>, <strong>Storage Location</strong>, <strong>Total Quantity</strong>
          </p>

          {/* Drop zone */}
          <div
            onDragOver={e => { e.preventDefault(); setDragging(true) }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-colors ${
              dragging
                ? 'border-apple-blue bg-blue-50'
                : 'border-apple-gray-3 hover:border-apple-blue hover:bg-apple-gray'
            }`}
          >
            <input
              ref={inputRef}
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleFileChange}
              className="hidden"
            />
            {loading ? (
              <p className="text-sm text-apple-secondary">Importing…</p>
            ) : (
              <>
                <p className="text-2xl mb-2">📂</p>
                <p className="text-sm font-medium text-apple-dark">Drop file here or click to browse</p>
                <p className="text-xs text-apple-tertiary mt-1">.xlsx, .xls, .csv</p>
              </>
            )}
          </div>

          {error && (
            <p className="text-xs text-apple-red mt-3">{error}</p>
          )}
          {result && (
            <p className="text-xs text-apple-green mt-3">
              ✓ Successfully imported {result.count} item{result.count !== 1 ? 's' : ''}!
            </p>
          )}
        </div>
      )}
    </div>
  )
}
