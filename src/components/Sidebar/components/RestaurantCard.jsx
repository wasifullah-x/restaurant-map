import PropTypes from 'prop-types'
import HalalBadge from '../../UI/HalalBadge'
import { cuisineImageMap, getCuisineImage } from '../../../constants/cuisineImages'

const getRatingFromName = (name) => {
  let hash = 0
  for (let index = 0; index < name.length; index += 1) {
    hash = (hash << 5) - hash + name.charCodeAt(index)
    hash |= 0
  }
  const score = 4 + (Math.abs(hash) % 10) / 10
  return score.toFixed(1)
}

const getCuisineTags = (cuisine) =>
  cuisine
    .split(/[,&/]/)
    .map((tag) => tag.trim())
    .filter(Boolean)

function RestaurantCard({
  restaurant,
  onClick,
  distance,
  showDistance,
  isFavourite,
  onToggleFavourite,
}) {
  const imageUrl = getCuisineImage(restaurant.cuisine)
  const rating = getRatingFromName(restaurant.name)
  const tags = getCuisineTags(restaurant.cuisine)

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          onClick()
        }
      }}
      className="cursor-pointer overflow-hidden rounded-xl border border-[#d1ddd1] bg-white shadow-lg transition-all duration-200 hover:scale-[1.02] hover:border-app-highlight dark:border-app-border dark:bg-app-elevated"
    >
      <div className="relative">
        <img
          src={imageUrl}
          alt={restaurant.name}
          className="h-40 w-full object-cover"
          loading="lazy"
          onError={(event) => {
            event.currentTarget.onerror = null
            event.currentTarget.src = cuisineImageMap.default
          }}
        />
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation()
            onToggleFavourite(restaurant.name)
          }}
          className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-black/45 text-lg backdrop-blur-sm"
          aria-label="Toggle favourite"
        >
          <span className={isFavourite ? 'text-red-500' : 'text-white'}>{isFavourite ? '♥' : '♡'}</span>
        </button>
      </div>

      <div className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-[#1a2e1a] dark:text-app-text-primary">{restaurant.name}</h3>
            <p className="text-sm text-[#4a6741] dark:text-app-text-secondary">{`${restaurant.city} • ${restaurant.cuisine}`}</p>
          </div>
          <HalalBadge status={restaurant.halal_status} />
        </div>

        <div className="flex items-center gap-1 text-sm font-semibold text-app-highlight">
          <span aria-hidden="true">★</span>
          <span>{rating}</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={`${restaurant.id}-${tag}`}
              className="rounded-full border border-[#d1ddd1] bg-[#e8f5e9] px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-[#1a472a] dark:border-app-border dark:bg-transparent dark:text-app-text-secondary"
            >
              {tag}
            </span>
          ))}
        </div>

        {showDistance && Number.isFinite(distance) && (
          <div className="text-sm font-semibold text-app-highlight">{`${distance.toFixed(1)} km away`}</div>
        )}
      </div>
    </article>
  )
}

RestaurantCard.propTypes = {
  restaurant: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    city: PropTypes.string,
    cuisine: PropTypes.string,
    halal_status: PropTypes.string,
  }).isRequired,
  onClick: PropTypes.func.isRequired,
  distance: PropTypes.number,
  showDistance: PropTypes.bool,
  isFavourite: PropTypes.bool,
  onToggleFavourite: PropTypes.func.isRequired,
}

RestaurantCard.defaultProps = {
  distance: undefined,
  showDistance: false,
  isFavourite: false,
}

export default RestaurantCard