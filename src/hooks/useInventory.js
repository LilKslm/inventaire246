import { useState, useEffect } from 'react'
import { subscribeToInventory } from '../utils/firebase.js'

export function useInventory() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = subscribeToInventory(data => {
      setItems(data)
      setLoading(false)
    })
    return unsub
  }, [])

  return { items, loading }
}
