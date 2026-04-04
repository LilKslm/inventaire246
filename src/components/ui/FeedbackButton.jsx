import { useState } from 'react'
import { createPortal } from 'react-dom'

export default function FeedbackButton() {
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState('')

  function handleSend() {
    if (!message.trim()) return
    const subject = encodeURIComponent('Inventaire246 — Commentaires')
    const body = encodeURIComponent(message.trim())
    window.open(`mailto:khalil@246db.org?subject=${subject}&body=${body}`, '_blank')
    setMessage('')
    setOpen(false)
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-apple-secondary bg-apple-gray hover:bg-apple-gray-2 transition-colors"
      >
        <span>💬</span>
        <span className="hidden sm:inline">Commentaires</span>
      </button>

      {open && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-apple-lg p-6 max-w-sm w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-apple-dark">Envoyer un commentaire</h3>
              <button onClick={() => setOpen(false)} className="text-apple-tertiary hover:text-apple-dark text-xl leading-none">&times;</button>
            </div>
            <p className="text-xs text-apple-secondary mb-3">Vos commentaires sont envoyés directement à l'administrateur.</p>
            <textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Écrivez votre commentaire ou signalez un problème…"
              rows={4}
              className="w-full bg-apple-gray rounded-xl px-3 py-2.5 text-sm text-apple-dark placeholder-apple-tertiary focus:outline-none focus:ring-2 focus:ring-apple-blue resize-none mb-4"
              autoFocus
            />
            <div className="flex gap-3">
              <button
                onClick={() => setOpen(false)}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium text-apple-secondary bg-apple-gray hover:bg-apple-gray-2 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleSend}
                disabled={!message.trim()}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white bg-apple-blue hover:bg-apple-blue-dark transition-colors disabled:opacity-40"
              >
                Envoyer →
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  )
}
