import PropTypes from 'prop-types'
import HalalBadge from '../../UI/HalalBadge'
import { cuisineImageMap, getCuisineImage } from '../../../constants/cuisineImages'

function RestaurantDetail({
  restaurant,
  onBack,
  onShowOnMap,
  distance,
  showDistance,
  isFavourite,
  onToggleFavourite,
}) {
  const imageUrl = getCuisineImage(restaurant.cuisine).replace('w=400&h=200', 'w=800&h=400')
  const mapsSearchUrl = `https://www.google.com/maps/search/?api=1&query=${restaurant.latitude},${restaurant.longitude}`

  return (
    <article className="h-full animate-slide-in space-y-4 px-4 py-4">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-2 rounded-full border border-[#d1ddd1] px-3 py-2 text-sm font-semibold text-[#1a2e1a] transition-all duration-300 hover:border-app-highlight dark:border-app-border dark:text-app-text-primary"
      >
        <span aria-hidden="true">←</span>
        Back
      </button>

      <button
        type="button"
        onClick={onShowOnMap}
        className="inline-flex items-center gap-2 rounded-full border border-[#d1ddd1] px-3 py-2 text-sm font-semibold text-[#1a2e1a] transition-all duration-300 hover:border-app-highlight dark:border-app-border dark:text-app-text-primary md:hidden"
      >
        <span aria-hidden="true">📍</span>
        Show on Map
      </button>

      <img
        src={imageUrl}
        alt={restaurant.name}
        className="h-56 w-full rounded-xl object-cover shadow-lg"
        onError={(event) => {
          event.currentTarget.onerror = null
          event.currentTarget.src = cuisineImageMap.default
        }}
      />

      <div className="space-y-3 rounded-xl border border-[#d1ddd1] bg-white p-4 dark:border-app-border dark:bg-app-elevated">
        <HalalBadge status={restaurant.halal_status} />
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-2xl font-bold text-[#1a2e1a] dark:text-app-text-primary">{restaurant.name}</h2>
          <button
            type="button"
            onClick={() => onToggleFavourite(restaurant.name)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#d1ddd1] text-lg dark:border-app-border"
            aria-label="Toggle favourite"
          >
            <span className={isFavourite ? 'text-red-500' : 'text-[#4a6741] dark:text-app-text-secondary'}>
              {isFavourite ? '♥' : '♡'}
            </span>
          </button>
        </div>

        <p className="flex items-center gap-2 text-[#4a6741] dark:text-app-text-secondary">
          <span aria-hidden="true">🍴</span>
          <span>{restaurant.cuisine || 'Cuisine unavailable'}</span>
        </p>

        <p className="flex items-start gap-2 text-[#4a6741] dark:text-app-text-secondary">
          <span aria-hidden="true">📍</span>
          <span>{`${restaurant.address || 'Address unavailable'}, ${restaurant.city || ''}`}</span>
        </p>

        {restaurant.phone && (
          <p className="flex items-center gap-2 text-[#4a6741] dark:text-app-text-secondary">
            <span aria-hidden="true">📞</span>
            <span>{restaurant.phone}</span>
          </p>
        )}

        <p className="flex items-center gap-2 text-[#4a6741] dark:text-app-text-secondary">
          <span aria-hidden="true">🕒</span>
          <span>{restaurant.hours || 'Hours unavailable'}</span>
        </p>

        {showDistance && Number.isFinite(distance) && (
          <p className="text-sm font-semibold text-app-highlight">{`${distance.toFixed(1)} km from your location`}</p>
        )}

        <div className="flex flex-wrap gap-3 pt-2">
          {restaurant.website && (
            <a
              href={restaurant.website}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-[#d1ddd1] px-4 py-2 text-sm font-semibold text-[#1a2e1a] transition-all duration-300 hover:border-app-highlight dark:border-app-border dark:text-app-text-primary"
            >
              Visit Website
            </a>
          )}

          <a
            href={mapsSearchUrl}
            target="_blank"
            rel="noreferrer"
            className="rounded-full bg-app-accent px-4 py-2 text-sm font-semibold text-white transition-all duration-300 hover:bg-app-highlight"
          >
            Get Directions
          </a>
        </div>
      </div>
    </article>
  )
}

RestaurantDetail.propTypes = {
  restaurant: PropTypes.shape({
    name: PropTypes.string.isRequired,
    cuisine: PropTypes.string,
    halal_status: PropTypes.string,
    address: PropTypes.string,
    city: PropTypes.string,
    phone: PropTypes.string,
    website: PropTypes.string,
    hours: PropTypes.string,
    latitude: PropTypes.number.isRequired,
    longitude: PropTypes.number.isRequired,
  }).isRequired,
  onBack: PropTypes.func.isRequired,
  onShowOnMap: PropTypes.func.isRequired,
  distance: PropTypes.number,
  showDistance: PropTypes.bool,
  isFavourite: PropTypes.bool,
  onToggleFavourite: PropTypes.func.isRequired,
}

RestaurantDetail.defaultProps = {
  distance: undefined,
  showDistance: false,
  isFavourite: false,
}

export default RestaurantDetail