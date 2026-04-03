export default function ConfirmModal({ title, message, confirmLabel = 'Confirm', onConfirm, onCancel, danger = false }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-apple-lg p-6 max-w-sm w-full">
        <h3 className="text-base font-semibold text-apple-dark mb-2">{title}</h3>
        <p className="text-sm text-apple-secondary mb-6">{message}</p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-xl text-sm font-medium text-apple-secondary bg-apple-gray hover:bg-apple-gray-2 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 rounded-xl text-sm font-semibold text-white transition-colors ${
              danger
                ? 'bg-apple-red hover:bg-red-600'
                : 'bg-apple-blue hover:bg-apple-blue-dark'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
