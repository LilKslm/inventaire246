import { useRegisterSW } from 'virtual:pwa-register/react'

export default function UpdateBanner() {
  const { needRefresh: [needRefresh], updateSW } = useRegisterSW()

  if (!needRefresh) return null

  return (
    <div className="fixed bottom-20 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-apple-dark text-white px-4 py-3 rounded-2xl shadow-apple-lg whitespace-nowrap">
      <span className="text-sm font-medium">Nouvelle version disponible</span>
      <button
        onClick={() => updateSW(true)}
        className="bg-apple-blue text-white text-xs font-semibold px-3 py-1.5 rounded-xl hover:opacity-90 transition-opacity"
      >
        Mettre à jour
      </button>
    </div>
  )
}
