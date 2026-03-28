import { useEffect, useMemo, useState } from 'react'
import MainLayout from '../components/Layout/MainLayout'
import MapSection from '../components/Map/MapSection'
import Sidebar from '../components/Sidebar/Sidebar'
import useRestaurants from '../hooks/useRestaurants'
import { useFavourites } from '../hooks/useFavourites'
import { useRecent } from '../hooks/useRecent'
import { getCuisineOptions } from '../constants/filters'
import { filterRestaurants } from '../utils/filterRestaurants'
import { getNearestRestaurants } from '../utils/distance'

const normalizeRestaurant = (restaurant, index) => {
  const latitude = Number.parseFloat(String(restaurant.latitude || '').replace(',', '.'))
  const longitude = Number.parseFloat(String(restaurant.longitude || '').replace(',', '.'))

  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    return null
  }

  const name = (restaurant.name || '').trim() || `Restaurant ${index + 1}`
  const city = (restaurant.city || '').trim()
  const address = (restaurant.address || '').trim()
  const cuisine = (restaurant.cuisine || '').trim() || 'Mixed'
  const id = `${name}-${city}-${address}-${index}`.toLowerCase().replace(/\s+/g, '-')

  return {
    ...restaurant,
    id,
    name,
    city,
    address,
    cuisine,
    latitude,
    longitude,
  }
}

function Home() {
  const { restaurants, loading, error, retry } = useRestaurants()
  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') {
      return 'light'
    }

    const savedTheme = window.localStorage.getItem('halal-finder-theme')
    if (savedTheme === 'dark' || savedTheme === 'light') {
      return savedTheme
    }

    return 'light'
  })
  const [query, setQuery] = useState('')
  const [selectedCuisine, setSelectedCuisine] = useState('All Cuisines')
  const [activeTab, setActiveTab] = useState('discover')
  const [selectedRestaurant, setSelectedRestaurant] = useState(null)
  const [userLocation, setUserLocation] = useState(null)
  const [nearestRestaurants, setNearestRestaurants] = useState([])
  const [mobileView, setMobileView] = useState('list')
  const { favourites, toggleFavourite, isFavourite } = useFavourites()
  const { recent, addToRecent } = useRecent()

  useEffect(() => {
    const root = window.document.documentElement
    root.classList.toggle('dark', theme === 'dark')
    window.localStorage.setItem('halal-finder-theme', theme)
  }, [theme])

  const normalizedRestaurants = useMemo(
    () => restaurants.map(normalizeRestaurant).filter(Boolean),
    [restaurants],
  )

  const cuisineOptions = useMemo(
    () => getCuisineOptions(normalizedRestaurants),
    [normalizedRestaurants],
  )

  const filteredRestaurants = useMemo(
    () =>
      filterRestaurants(normalizedRestaurants, {
        query,
        cuisine: selectedCuisine,
      }),
    [normalizedRestaurants, query, selectedCuisine],
  )

  const restaurantsByName = useMemo(
    () =>
      normalizedRestaurants.reduce((accumulator, restaurant) => {
        if (!accumulator.has(restaurant.name)) {
          accumulator.set(restaurant.name, restaurant)
        }
        return accumulator
      }, new Map()),
    [normalizedRestaurants],
  )

  const favouriteRestaurants = useMemo(
    () => normalizedRestaurants.filter((restaurant) => favourites.includes(restaurant.name)),
    [normalizedRestaurants, favourites],
  )

  const recentRestaurants = useMemo(
    () => recent.map((name) => restaurantsByName.get(name)).filter(Boolean),
    [recent, restaurantsByName],
  )

  const tabRestaurants = useMemo(() => {
    if (activeTab === 'favourites') {
      return favouriteRestaurants
    }

    if (activeTab === 'recent') {
      return recentRestaurants
    }

    return filteredRestaurants
  }, [activeTab, favouriteRestaurants, filteredRestaurants, recentRestaurants])

  const distanceMap = useMemo(
    () =>
      nearestRestaurants.reduce((accumulator, restaurant) => {
        accumulator[restaurant.id] = restaurant.distance
        return accumulator
      }, {}),
    [nearestRestaurants],
  )

  const nearestIds = useMemo(() => nearestRestaurants.map((restaurant) => restaurant.id), [nearestRestaurants])

  const onNearMe = () => {
    if (!navigator.geolocation) {
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }

        setUserLocation(location)
        setNearestRestaurants(
          getNearestRestaurants(
            location.latitude,
            location.longitude,
            normalizedRestaurants,
            normalizedRestaurants.length,
          ),
        )
      },
      () => {
        setUserLocation(null)
        setNearestRestaurants([])
      },
      { enableHighAccuracy: true, timeout: 12000 },
    )
  }

  const onSelectRestaurant = (restaurant, source = 'list') => {
    setSelectedRestaurant(restaurant)
    addToRecent(restaurant.name)

    if (window.innerWidth < 768) {
      setMobileView(source === 'map' ? 'map' : 'list')
      return
    }

    setMobileView('list')
  }

  const onBackToList = () => {
    setSelectedRestaurant(null)

    if (window.innerWidth < 768) {
      setMobileView('map')
    }
  }

  const onShowSelectedOnMap = () => {
    if (!selectedRestaurant) {
      return
    }

    setMobileView('map')
  }

  const onClearFilters = () => {
    setQuery('')
    setSelectedCuisine('All Cuisines')
  }

  const sidebarContent = (
    <Sidebar
      restaurants={tabRestaurants}
      activeTab={activeTab}
      selectedRestaurant={selectedRestaurant}
      query={query}
      cuisineOptions={cuisineOptions}
      selectedCuisine={selectedCuisine}
      onSearch={setQuery}
      onCuisineChange={setSelectedCuisine}
      onSelectRestaurant={onSelectRestaurant}
      onBackToList={onBackToList}
      onShowOnMap={onShowSelectedOnMap}
      onClearFilters={onClearFilters}
      onToggleFavourite={toggleFavourite}
      isFavourite={isFavourite}
      loading={loading}
      error={error}
      onRetry={retry}
      nearMeUsed={nearestRestaurants.length > 0}
      distanceMap={distanceMap}
    />
  )

  const mapContent = (
    <MapSection
      theme={theme}
      restaurants={tabRestaurants}
      selectedRestaurant={selectedRestaurant}
      userLocation={userLocation}
      nearestRestaurantIds={nearestIds}
      onSelectRestaurant={(restaurant) => onSelectRestaurant(restaurant, 'map')}
    />
  )

  return (
    <MainLayout
      theme={theme}
      onToggleTheme={() => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))}
      activeTab={activeTab}
      onTabChange={(tab) => {
        setActiveTab(tab)
        setSelectedRestaurant(null)
        setMobileView('list')
      }}
      hasSelectedRestaurant={Boolean(selectedRestaurant)}
      sidebar={sidebarContent}
      map={mapContent}
      onNearMe={onNearMe}
      mobileView={mobileView}
      onToggleMobileView={() => setMobileView((prev) => (prev === 'list' ? 'map' : 'list'))}
    />
  )
}

export default Home