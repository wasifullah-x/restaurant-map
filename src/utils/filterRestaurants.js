const normalizeText = (value) =>
  (value || '')
    .toString()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase()

export const filterRestaurants = (restaurants, { query, cuisine }) => {
  const normalizedQuery = normalizeText(query)
  const normalizedCuisine = normalizeText(cuisine)
  const shouldFilterCuisine = normalizedCuisine.length > 0 && normalizedCuisine !== 'all cuisines'

  if (!normalizedQuery && !shouldFilterCuisine) {
    return restaurants
  }

  return restaurants.filter((restaurant) => {
    const name = normalizeText(restaurant.name)
    const city = normalizeText(restaurant.city)
    const restaurantCuisine = normalizeText(restaurant.cuisine)

    const matchesQuery = !normalizedQuery || name.includes(normalizedQuery) || city.includes(normalizedQuery)
    const matchesCuisine = !shouldFilterCuisine || restaurantCuisine === normalizedCuisine

    return matchesQuery && matchesCuisine
  })
}

export default filterRestaurants