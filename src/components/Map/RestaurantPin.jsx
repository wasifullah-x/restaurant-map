import PropTypes from 'prop-types'
import { divIcon } from 'leaflet'
import { Marker, Popup } from 'react-leaflet'

const cuisineColorMap = {
  syrian: '#e76f51',
  turkish: '#f4a261',
  arab: '#e9c46a',
  arabic: '#e9c46a',
  pakistani: '#2a9d8f',
  bangladeshi: '#457b9d',
  indian: '#e63946',
  lebanese: '#f77f00',
  persian: '#577590',
  iranian: '#577590',
  mediterranean: '#43aa8b',
  somali: '#6a4c93',
}

const getCuisineColor = (cuisine = '') => {
  const normalized = cuisine.toLowerCase().trim()
  if (normalized && cuisineColorMap[normalized]) {
    return cuisineColorMap[normalized]
  }

  return '#52b788'
}

const getHalalFallbackColor = (status = '') => {
  const normalized = status.toLowerCase()

  if (normalized.includes('fully') || normalized.includes('certified')) {
    return '#238636'
  }

  if (normalized.includes('options') || normalized.includes('friendly')) {
    return '#9e6a03'
  }

  return '#8b949e'
}

const getPinColor = (restaurant) => {
  const cuisine = (restaurant.cuisine || '').toLowerCase().trim()
  if (cuisine) {
    return getCuisineColor(cuisine)
  }

  return getHalalFallbackColor(restaurant.halal_status)
}

const createPinIcon = (color, isSelected, isHighlighted) =>
  divIcon({
    className: '',
    iconSize: [isSelected ? 42 : 34, isSelected ? 42 : 34],
    iconAnchor: [isSelected ? 21 : 17, isSelected ? 21 : 17],
    html: `
      <div class="map-pin-wrapper ${isSelected ? 'active' : ''} ${isHighlighted ? 'nearby' : ''}" style="display:flex;align-items:center;justify-content:center;">
        <svg width="${isSelected ? 34 : 28}" height="${isSelected ? 34 : 28}" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <circle cx="16" cy="16" r="10" fill="${color}" stroke="#ffffff" stroke-width="3.5" />
        </svg>
      </div>
    `,
  })

function RestaurantPin({ restaurant, selected, highlighted, onSelect }) {
  const color = getPinColor(restaurant)
  const handlePinClick = () => {
    const isMobile = window.innerWidth < 768
    if (isMobile) {
      window.setTimeout(() => onSelect(restaurant), 10)
      return
    }

    onSelect(restaurant)
  }

  return (
    <Marker
      position={[restaurant.latitude, restaurant.longitude]}
      icon={createPinIcon(color, selected, highlighted)}
      eventHandlers={{
        click: handlePinClick,
      }}
      zIndexOffset={selected ? 1000 : highlighted ? 500 : 0}
    >
      <Popup>
        <div className="text-sm">
          <p className="font-semibold">{restaurant.name || 'Restaurant'}</p>
          <p className="text-xs text-gray-600">{restaurant.city || 'City unavailable'}</p>
        </div>
      </Popup>
    </Marker>
  )
}

RestaurantPin.propTypes = {
  restaurant: PropTypes.shape({
    name: PropTypes.string,
    city: PropTypes.string,
    latitude: PropTypes.number.isRequired,
    longitude: PropTypes.number.isRequired,
    cuisine: PropTypes.string,
    halal_status: PropTypes.string,
  }).isRequired,
  selected: PropTypes.bool.isRequired,
  highlighted: PropTypes.bool,
  onSelect: PropTypes.func.isRequired,
}

RestaurantPin.defaultProps = {
  highlighted: false,
}

export default RestaurantPin
