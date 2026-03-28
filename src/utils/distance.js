const toRadians = (degrees) => (degrees * Math.PI) / 180

/**
 * Haversine distance in kilometers.
 * @param {number} lat1
 * @param {number} lon1
 * @param {number} lat2
 * @param {number} lon2
 * @returns {number}
 */
export const haversineDistance = (lat1, lon1, lat2, lon2) => {
  const earthRadiusKm = 6371
  const deltaLat = toRadians(lat2 - lat1)
  const deltaLon = toRadians(lon2 - lon1)
  const radLat1 = toRadians(lat1)
  const radLat2 = toRadians(lat2)

  const a =
    Math.sin(deltaLat / 2) ** 2 +
    Math.cos(radLat1) * Math.cos(radLat2) * Math.sin(deltaLon / 2) ** 2

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return earthRadiusKm * c
}

export const getNearestRestaurants = (userLat, userLon, restaurants, limit = 5) =>
  restaurants
    .map((restaurant) => ({
      ...restaurant,
      distance: haversineDistance(
        userLat,
        userLon,
        Number.parseFloat(restaurant.latitude),
        Number.parseFloat(restaurant.longitude),
      ),
    }))
    .filter((restaurant) => Number.isFinite(restaurant.distance))
    .sort((a, b) => a.distance - b.distance)
    .slice(0, limit)
