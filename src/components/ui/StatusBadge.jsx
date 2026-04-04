const STYLES = {
  active:   'bg-blue-100 text-blue-700',
  returned: 'bg-gray-100 text-gray-600',
  green:    'bg-green-100 text-green-700',
  yellow:   'bg-yellow-100 text-yellow-700',
  red:      'bg-red-100 text-red-700',
}

const LABELS = {
  active:   'Actif',
  returned: 'Retourné',
  green:    'À temps',
  yellow:   'Bientôt dû',
  red:      'En retard',
}

export default function StatusBadge({ status }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${STYLES[status] || STYLES.active}`}>
      {LABELS[status] || status}
    </span>
  )
}
