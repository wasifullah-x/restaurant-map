import PropTypes from 'prop-types'
import SearchBar from '../Search/SearchBar'
import CuisineFilter from '../Search/CuisineFilter'
import EmptyState from '../UI/EmptyState'
import ErrorState from '../UI/ErrorState'
import RestaurantCard from './components/RestaurantCard'
import RestaurantDetail from './components/RestaurantDetail'
import SkeletonCard from './components/SkeletonCard'

function Sidebar({
  restaurants,
  activeTab,
  selectedRestaurant,
  query,
  cuisineOptions,
  selectedCuisine,
  onSearch,
  onCuisineChange,
  onSelectRestaurant,
  onBackToList,
  onShowOnMap,
  onClearFilters,
  loading,
  error,
  onRetry,
  onToggleFavourite,
  isFavourite,
  nearMeUsed,
  distanceMap,
}) {
  const isDetailView = Boolean(selectedRestaurant)
  const isDiscoverTab = activeTab === 'discover'

  const emptyStateProps = {
    discover: {
      title: 'No restaurants found',
      subtitle: 'Try adjusting your search or filters',
      actionLabel: 'Clear all filters',
      onAction: onClearFilters,
    },
    favourites: {
      title: 'No favourites yet',
      subtitle: 'Tap the ♥ on any restaurant to save it here',
      actionLabel: '',
      onAction: undefined,
    },
    recent: {
      title: 'Nothing viewed yet',
      subtitle: 'Restaurants you view will appear here',
      actionLabel: '',
      onAction: undefined,
    },
  }

  const renderHeader = () => (
    <div className="border-b border-[#d1ddd1] bg-white/70 px-4 py-4 backdrop-blur-sm dark:border-app-border dark:bg-black/40">
      {isDiscoverTab ? (
        <>
          <SearchBar value={query} onSearch={onSearch} />
          <div className="mt-4">
            <CuisineFilter
              options={cuisineOptions}
              activeCuisine={selectedCuisine}
              onCuisineChange={onCuisineChange}
            />
          </div>
        </>
      ) : (
        <h2 className="text-lg font-semibold text-[#1a2e1a] dark:text-app-text-primary">
          {activeTab === 'favourites' ? 'Favourite Restaurants' : 'Recently Viewed'}
        </h2>
      )}
    </div>
  )

  const renderList = () => (
    <div className="flex-1 overflow-y-auto scrollbar-thin px-4 py-4">
      {loading && isDiscoverTab && (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, index) => (
            <SkeletonCard key={`skeleton-${index + 1}`} />
          ))}
        </div>
      )}

      {!loading && error && isDiscoverTab && <ErrorState onRetry={onRetry} />}

      {!loading && !error && restaurants.length === 0 && (
        <EmptyState
          title={emptyStateProps[activeTab].title}
          subtitle={emptyStateProps[activeTab].subtitle}
          actionLabel={emptyStateProps[activeTab].actionLabel}
          onAction={emptyStateProps[activeTab].onAction}
        />
      )}

      {!loading && !error && restaurants.length > 0 && (
        <div className="space-y-3">
          {restaurants.map((restaurant) => (
            <RestaurantCard
              key={restaurant.id}
              restaurant={restaurant}
              onClick={() => onSelectRestaurant(restaurant, 'list')}
              distance={distanceMap[restaurant.id]}
              showDistance={nearMeUsed}
              isFavourite={isFavourite(restaurant.name)}
              onToggleFavourite={onToggleFavourite}
            />
          ))}
        </div>
      )}
    </div>
  )

  return (
    <aside className="relative h-full overflow-hidden bg-[#f8faf8] dark:bg-app-surface">
      <div className={`h-full flex-col md:hidden ${isDetailView ? 'hidden' : 'flex'}`}>
        {renderHeader()}
        {renderList()}
      </div>

      <div className={`h-full overflow-y-auto scrollbar-thin md:hidden ${isDetailView ? 'block' : 'hidden'}`}>
        {selectedRestaurant && (
          <RestaurantDetail
            restaurant={selectedRestaurant}
            onBack={onBackToList}
            onShowOnMap={onShowOnMap}
            distance={distanceMap[selectedRestaurant.id]}
            showDistance={nearMeUsed}
            isFavourite={isFavourite(selectedRestaurant.name)}
            onToggleFavourite={onToggleFavourite}
          />
        )}
      </div>

      <div className="relative hidden h-full md:block">
        <div
          className={`absolute inset-0 flex h-full flex-col transition-all duration-300 ease-in-out ${
            isDetailView ? '-translate-x-full opacity-0' : 'translate-x-0 opacity-100'
          }`}
        >
          {renderHeader()}
          {renderList()}
        </div>

        <div
          className={`absolute inset-0 h-full overflow-y-auto scrollbar-thin bg-[#f8faf8] transition-all duration-300 ease-in-out dark:bg-app-surface ${
            isDetailView ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
          }`}
        >
          {selectedRestaurant && (
            <RestaurantDetail
              restaurant={selectedRestaurant}
              onBack={onBackToList}
              onShowOnMap={onShowOnMap}
              distance={distanceMap[selectedRestaurant.id]}
              showDistance={nearMeUsed}
              isFavourite={isFavourite(selectedRestaurant.name)}
              onToggleFavourite={onToggleFavourite}
            />
          )}
        </div>
      </div>
    </aside>
  )
}

Sidebar.propTypes = {
  restaurants: PropTypes.arrayOf(PropTypes.object).isRequired,
  activeTab: PropTypes.oneOf(['discover', 'favourites', 'recent']).isRequired,
  selectedRestaurant: PropTypes.object,
  query: PropTypes.string.isRequired,
  cuisineOptions: PropTypes.arrayOf(PropTypes.string).isRequired,
  selectedCuisine: PropTypes.string.isRequired,
  onSearch: PropTypes.func.isRequired,
  onCuisineChange: PropTypes.func.isRequired,
  onSelectRestaurant: PropTypes.func.isRequired,
  onBackToList: PropTypes.func.isRequired,
  onShowOnMap: PropTypes.func.isRequired,
  onClearFilters: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.string,
  onRetry: PropTypes.func.isRequired,
  onToggleFavourite: PropTypes.func.isRequired,
  isFavourite: PropTypes.func.isRequired,
  nearMeUsed: PropTypes.bool.isRequired,
  distanceMap: PropTypes.objectOf(PropTypes.number).isRequired,
}

Sidebar.defaultProps = {
  selectedRestaurant: null,
  error: '',
}

export default Sidebar
