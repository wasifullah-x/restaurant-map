export const ALL_CUISINES_OPTION = 'All Cuisines'

export const getCuisineOptions = (restaurants = []) => {
  const cuisineSet = new Set()

  restaurants.forEach((restaurant) => {
    const cuisine = (restaurant.cuisine || '').trim()
    if (cuisine) {
      cuisineSet.add(cuisine)
    }
  })

  return [ALL_CUISINES_OPTION, ...Array.from(cuisineSet).sort((a, b) => a.localeCompare(b))]
}

export default getCuisineOptions