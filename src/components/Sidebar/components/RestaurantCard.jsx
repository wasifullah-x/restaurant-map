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
      className="group cursor-pointer overflow-hidden rounded-xl border border-[#d1ddd1] bg-white shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:border-app-highlight hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-highlight focus-visible:ring-offset-2 focus-visible:ring-offset-[#f8faf8] dark:border-app-border dark:bg-app-elevated dark:focus-visible:ring-offset-app-surface"
    >
      <div className="relative">
        <img
          src={imageUrl}
          alt={restaurant.name}
          className="h-40 w-full object-cover transition-transform duration-300 group-hover:scale-[1.015]"
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
          className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/25 bg-black/45 text-lg backdrop-blur-sm transition-transform duration-200 hover:scale-110"
          aria-label="Toggle favourite"
        >
          <span className={isFavourite ? 'text-red-500' : 'text-white'}>{isFavourite ? '♥' : '♡'}</span>
        </button>
      </div>

      <div className="space-y-3.5 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate text-[1.05rem] font-extrabold leading-6 tracking-tight text-[#1a2e1a] dark:text-app-text-primary">
              {restaurant.name}
            </h3>
            <p className="mt-0.5 truncate text-[13px] font-medium leading-5 text-[#4a6741] dark:text-app-text-secondary">
              {`${restaurant.city} • ${restaurant.cuisine}`}
            </p>
          </div>
          <HalalBadge status={restaurant.halal_status} />
        </div>

        <div className="flex items-center gap-1.5 text-sm font-semibold text-app-highlight">
          <span aria-hidden="true">★</span>
          <span>{rating}</span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <span
              key={`${restaurant.id}-${tag}`}
              className="rounded-full border border-[#d1ddd1] bg-[#e8f5e9] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-[#1a472a] dark:border-app-border dark:bg-transparent dark:text-app-text-secondary"
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