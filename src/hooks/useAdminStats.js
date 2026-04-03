import { useMemo } from 'react'
import { urgencyClass } from '../utils/dates.js'

export function useAdminStats(checkouts) {
  return useMemo(() => {
    const active = checkouts.filter(c => c.status === 'active')

    let overdueCount  = 0
    let dueSoonCount  = 0
    let onTimeCount   = 0

    for (const c of active) {
      const u = urgencyClass(c.returnDate?.toDate?.() || c.returnDate, c.status)
      if (u === 'red')    overdueCount++
      else if (u === 'yellow') dueSoonCount++
      else                onTimeCount++
    }

    return {
      activeCount:  active.length,
      overdueCount,
      dueSoonCount,
      onTimeCount,
    }
  }, [checkouts])
}
