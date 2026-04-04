/**
 * Calculate return date from now given duration hours or custom days string.
 */
export function calcReturnDate(durationHours, customDays) {
  const now = new Date()
  if (customDays && !isNaN(parseInt(customDays, 10))) {
    now.setDate(now.getDate() + parseInt(customDays, 10))
    return now
  }
  if (durationHours) {
    now.setTime(now.getTime() + durationHours * 3600 * 1000)
    return now
  }
  return null
}

/**
 * Returns 'green' | 'yellow' | 'red' | 'returned' based on how close the return date is.
 */
export function urgencyClass(returnDate, status) {
  if (status === 'returned') return 'returned'
  const diff = new Date(returnDate) - new Date()
  const days = diff / (1000 * 60 * 60 * 24)
  if (days < 0)  return 'red'
  if (days <= 2) return 'yellow'
  return 'green'
}

const DATE_FORMAT = new Intl.DateTimeFormat('fr-CA', {
  year: 'numeric', month: 'long', day: 'numeric',
})

const DATE_FORMAT_SHORT = new Intl.DateTimeFormat('fr-CA', {
  month: 'short', day: 'numeric',
})

export function formatDate(date) {
  if (!date) return '—'
  return DATE_FORMAT.format(new Date(date))
}

export function formatDateShort(date) {
  if (!date) return '—'
  return DATE_FORMAT_SHORT.format(new Date(date))
}

export function formatDateTime(date) {
  if (!date) return '—'
  return new Intl.DateTimeFormat('fr-CA', {
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
  }).format(new Date(date))
}
