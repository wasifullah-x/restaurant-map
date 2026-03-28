import { useEffect } from 'react'
import PropTypes from 'prop-types'
import { divIcon } from 'leaflet'
import { MapContainer, Marker, TileLayer, useMap } from 'react-leaflet'
import RestaurantPin from './RestaurantPin'

const finlandCenter = [64.9631, 25.7482]

const userIcon = divIcon({
  className: '',
  iconSize: [18, 18],
  iconAnchor: [9, 9],
  html: '<div class="user-location-dot"></div>',
})

function MapNavigator({ selectedRestaurant, userLocation }) {
  const map = useMap()

  useEffect(() => {
    if (selectedRestaurant) {
      if (window.innerWidth < 768) {
        return
      }

      map.flyTo([selectedRestaurant.latitude, selectedRestaurant.longitude], 12, {
        duration: 1,
      })
    }
  }, [map, selectedRestaurant])

  useEffect(() => {
    if (userLocation) {
      map.flyTo([userLocation.latitude, userLocation.longitude], 10, {
        duration: 1,
      })
    }
  }, [map, userLocation])

  return null
}

MapNavigator.propTypes = {
  selectedRestaurant: PropTypes.shape({
    latitude: PropTypes.number,
    longitude: PropTypes.number,
  }),
  userLocation: PropTypes.shape({
    latitude: PropTypes.number,
    longitude: PropTypes.number,
  }),
}

MapNavigator.defaultProps = {
  selectedRestaurant: null,
  userLocation: null,
}

function MapSection({
  theme,
  restaurants,
  selectedRestaurant,
  userLocation,
  nearestRestaurantIds,
  onSelectRestaurant,
}) {
  const isMobileViewport = typeof window !== 'undefined' && window.innerWidth < 768
  const mapCenter =
    isMobileViewport && selectedRestaurant
      ? [selectedRestaurant.latitude, selectedRestaurant.longitude]
      : finlandCenter
  const mapZoom = isMobileViewport && selectedRestaurant ? 12 : 6

  const tileUrl =
    theme === 'dark'
      ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
      : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'

  return (
    <div className="h-full w-full border-l border-[#d1ddd1] dark:border-app-border">
      <MapContainer center={mapCenter} zoom={mapZoom} className="h-full w-full" zoomControl>
        <TileLayer
          attribution='&copy; OpenStreetMap contributors &copy; CARTO'
          url={tileUrl}
        />

        <MapNavigator selectedRestaurant={selectedRestaurant} userLocation={userLocation} />

        {restaurants.map((restaurant) => (
          <RestaurantPin
            key={restaurant.id}
            restaurant={restaurant}
            selected={selectedRestaurant?.id === restaurant.id}
            highlighted={nearestRestaurantIds.includes(restaurant.id)}
            onSelect={onSelectRestaurant}
          />
        ))}

        {userLocation && <Marker position={[userLocation.latitude, userLocation.longitude]} icon={userIcon} />}
      </MapContainer>
    </div>
  )
}

MapSection.propTypes = {
  theme: PropTypes.oneOf(['light', 'dark']).isRequired,
  restaurants: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      latitude: PropTypes.number.isRequired,
      longitude: PropTypes.number.isRequired,
    }),
  ).isRequired,
  selectedRestaurant: PropTypes.shape({
    id: PropTypes.string,
    latitude: PropTypes.number,
    longitude: PropTypes.number,
  }),
  userLocation: PropTypes.shape({
    latitude: PropTypes.number,
    longitude: PropTypes.number,
  }),
  nearestRestaurantIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  onSelectRestaurant: PropTypes.func.isRequired,
}

MapSection.defaultProps = {
  selectedRestaurant: null,
  userLocation: null,
}

export default MapSection