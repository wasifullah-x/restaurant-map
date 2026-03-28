import { useEffect, useState } from 'react'

export function useFavourites() {
  const [favourites, setFavourites] = useState(() => {
    try {
      const stored = window.localStorage.getItem('halal-finder-favourites')
      const parsed = stored ? JSON.parse(stored) : []
      return Array.isArray(parsed) ? parsed.filter((value) => typeof value === 'string') : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    window.localStorage.setItem('halal-finder-favourites', JSON.stringify(favourites))
  }, [favourites])

  const toggleFavourite = (restaurantName) => {
    setFavourites((previous) =>
      (Array.isArray(previous) ? previous : []).includes(restaurantName)
        ? (Array.isArray(previous) ? previous : []).filter((name) => name !== restaurantName)
        : [...(Array.isArray(previous) ? previous : []), restaurantName],
    )
  }

  const isFavourite = (restaurantName) => (Array.isArray(favourites) ? favourites : []).includes(restaurantName)

  return { favourites, toggleFavourite, isFavourite }
}

export default useFavourites
