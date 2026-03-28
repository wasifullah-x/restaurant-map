import { useEffect, useState } from 'react'

export function useRecent() {
  const [recent, setRecent] = useState(() => {
    try {
      const stored = window.localStorage.getItem('halal-finder-recent')
      const parsed = stored ? JSON.parse(stored) : []
      return Array.isArray(parsed) ? parsed.filter((value) => typeof value === 'string') : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    window.localStorage.setItem('halal-finder-recent', JSON.stringify(recent))
  }, [recent])

  const addToRecent = (restaurantName) => {
    setRecent((previous) => {
      const safePrevious = Array.isArray(previous) ? previous : []
      const filtered = safePrevious.filter((name) => name !== restaurantName)
      return [restaurantName, ...filtered].slice(0, 10)
    })
  }

  return { recent, addToRecent }
}

export default useRecent
