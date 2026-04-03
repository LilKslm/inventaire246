import { useState, useEffect } from 'react'
import { subscribeToCheckouts } from '../utils/firebase.js'

export function useCheckouts() {
  const [checkouts, setCheckouts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = subscribeToCheckouts(data => {
      setCheckouts(data)
      setLoading(false)
    })
    return unsub
  }, [])

  return { checkouts, loading }
}
