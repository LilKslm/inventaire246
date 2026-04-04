import { useState, useEffect } from 'react'

export default function UpdateNotification() {
  const [state, setState] = useState(null) // 'available' | 'ready'
  const [version, setVersion] = useState('')

  useEffect(() => {
    if (typeof window === 'undefined' || !window.electronAPI) return
    window.electronAPI.onUpdateAvailable(info => {
      setVersion(info.version)
      setState('available')
    })
    window.electronAPI.onUpdateDownloaded(() => setState('ready'))
    return () => window.electronAPI.removeUpdateListeners?.()
  }, [])

  if (!state) return null

  return (
    <div className="fixed bottom-20 sm:bottom-4 right-4 z-50 bg-white rounded-2xl shadow-apple-lg p-4 flex items-center gap-3 max-w-xs border border-apple-gray-2">
      <span className="text-2xl">🔄</span>
      <div className="flex-1 min-w-0">
        {state === 'available' ? (
          <p className="text-sm text-apple-dark font-medium">
            Mise à jour {version} en cours…
          </p>
        ) : (
          <>
            <p className="text-sm text-apple-dark font-medium">Mise à jour prête!</p>
            <button
              onClick={() => window.electronAPI.installUpdate()}
              className="mt-1 text-xs text-apple-blue font-semibold"
            >
              Redémarrer pour installer
            </button>
          </>
        )}
      </div>
      <button onClick={() => setState(null)} className="text-apple-tertiary text-lg leading-none">&times;</button>
    </div>
  )
}
