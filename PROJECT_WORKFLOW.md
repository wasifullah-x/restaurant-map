# Halal Restaurant Finder Finland - Project Workflow (A to Z)

This document explains the full architecture and workflow of the project from app startup to rendering UI, map interaction, filtering, favourites/recent, and responsive behavior.

## 1) Project Goal

Build a frontend-only React + Vite application that:

- Fetches restaurant data from a public Google Sheet CSV
- Parses CSV into normalized JavaScript restaurant objects
- Displays restaurants on a Leaflet map and in a sidebar/list-detail UI
- Supports search + cuisine filtering
- Supports Near Me geolocation and nearest highlighting
- Supports favourites and recent history with local storage
- Works in light and dark mode and on mobile/desktop

## 2) Tech Stack

- React + Vite
- React Leaflet + Leaflet
- Tailwind CSS
- Browser Fetch API
- Browser Geolocation API
- Browser Local Storage

## 3) High-Level File Layout

- src/App.jsx
- src/main.jsx
- src/pages/Home.jsx
- src/components/Layout/MainLayout.jsx
- src/components/Map/MapSection.jsx
- src/components/Map/RestaurantPin.jsx
- src/components/Sidebar/Sidebar.jsx
- src/components/Sidebar/components/RestaurantCard.jsx
- src/components/Sidebar/components/RestaurantDetail.jsx
- src/components/Sidebar/components/SkeletonCard.jsx
- src/components/Search/SearchBar.jsx
- src/components/Search/CuisineFilter.jsx
- src/components/UI/HalalBadge.jsx
- src/components/UI/EmptyState.jsx
- src/components/UI/ErrorState.jsx
- src/hooks/useRestaurants.js
- src/hooks/useFavourites.js
- src/hooks/useRecent.js
- src/utils/sheetParser.js
- src/utils/filterRestaurants.js
- src/utils/distance.js
- src/constants/filters.js
- src/constants/cuisineImages.js
- src/index.css
- tailwind.config.js

## 4) App Boot Process

### 4.1 Entry Point

`src/main.jsx` loads Leaflet CSS, global app CSS, and renders App:

```jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "leaflet/dist/leaflet.css";
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
```

### 4.2 App Shell

`src/App.jsx` simply renders `Home`:

```jsx
import Home from "./pages/Home";

function App() {
  return <Home />;
}
```

## 5) Data Fetching and Parsing

### 5.1 Fetch Hook: useRestaurants

`src/hooks/useRestaurants.js` fetches the public CSV URL directly using Fetch API and exposes:

- `restaurants`
- `loading`
- `error`
- `retry`

Core logic:

```jsx
const response = await fetch(GOOGLE_SHEET_CSV_URL, {
  method: "GET",
  signal: controller.signal,
  cache: "no-store",
});

if (!response.ok) {
  throw new Error(`Request failed with ${response.status}`);
}

const csvText = await response.text();
const parsedRows = sheetParser(csvText);
setRestaurants(parsedRows);
```

### 5.2 CSV Parser: sheetParser

`src/utils/sheetParser.js`:

- Splits lines
- Parses CSV safely including quotes
- Uses header aliases to map flexible column names
- Returns canonical keys:
  - `name, address, city, latitude, longitude, cuisine, halal_status, phone, website, hours`
- Removes empty rows

Example output row shape:

```js
{
  name: 'Qazan Restaurant',
  address: 'Itakatu 1-7, 00930 Helsinki',
  city: 'Helsinki',
  latitude: '60.21',
  longitude: '25.08',
  cuisine: 'Syrian',
  halal_status: 'Halal Certified',
  phone: '468897305',
  website: 'https://example.com',
  hours: '10:30 am - 5:00 pm'
}
```

## 6) Core Page State and Orchestration

`src/pages/Home.jsx` is the central state orchestrator.

### 6.1 Important state

- `theme`: `light | dark`
- `query`
- `selectedCuisine`
- `activeTab`: `discover | favourites | recent`
- `selectedRestaurant`
- `userLocation`
- `nearestRestaurants`
- `mobileView`: `list | map`

### 6.2 Theme persistence

```jsx
const savedTheme = window.localStorage.getItem("halal-finder-theme");
root.classList.toggle("dark", theme === "dark");
window.localStorage.setItem("halal-finder-theme", theme);
```

### 6.3 Restaurant normalization

Incoming CSV strings are normalized to usable map/list records:

```jsx
const latitude = Number.parseFloat(
  String(restaurant.latitude || "").replace(",", "."),
);
const longitude = Number.parseFloat(
  String(restaurant.longitude || "").replace(",", "."),
);
```

### 6.4 Derived data

- `cuisineOptions` from dynamic runtime data
- `filteredRestaurants` from query + cuisine
- `favouriteRestaurants` from local storage names
- `recentRestaurants` in recent order
- `tabRestaurants` depending on active tab
- `distanceMap` for quick distance rendering
- `nearestIds` for pin glow highlighting

## 7) Search and Filter Pipeline

### 7.1 SearchBar with debounce

`src/components/Search/SearchBar.jsx` has 300ms debounce:

```jsx
useEffect(() => {
  const timeoutId = window.setTimeout(() => {
    onSearch(localValue);
  }, 300);
  return () => window.clearTimeout(timeoutId);
}, [localValue, onSearch]);
```

### 7.2 Filter utility

`src/utils/filterRestaurants.js` normalizes text and applies both filters together:

```js
const matchesQuery =
  !normalizedQuery ||
  name.includes(normalizedQuery) ||
  city.includes(normalizedQuery);
const matchesCuisine =
  !shouldFilterCuisine || restaurantCuisine === normalizedCuisine;
return matchesQuery && matchesCuisine;
```

### 7.3 Cuisine options utility

`src/constants/filters.js` builds cuisine options dynamically from data:

```js
return [
  "All Cuisines",
  ...Array.from(cuisineSet).sort((a, b) => a.localeCompare(b)),
];
```

## 8) Map Workflow

### 8.1 Map section

`src/components/Map/MapSection.jsx`:

- Center: Finland `[64.9631, 25.7482]`
- Zoom default: `6`
- Dark mode tiles: CartoDB dark
- Light mode tiles: CartoDB light
- Renders markers for each restaurant
- Renders user location marker when available

### 8.2 Pin rendering

`src/components/Map/RestaurantPin.jsx`:

- Custom SVG marker with selected/highlighted styles
- Pin color by cuisine map, halal fallback when cuisine missing
- Popup shows name + city
- Mobile click uses short timeout to avoid Leaflet touch race

Example click handler:

```jsx
const handlePinClick = () => {
  const isMobile = window.innerWidth < 768;
  if (isMobile) {
    window.setTimeout(() => onSelect(restaurant), 10);
    return;
  }
  onSelect(restaurant);
};
```

### 8.3 Near Me flow

In `Home.jsx`:

```jsx
navigator.geolocation.getCurrentPosition((position) => {
  const location = {
    latitude: position.coords.latitude,
    longitude: position.coords.longitude,
  };
  setUserLocation(location);
  setNearestRestaurants(
    getNearestRestaurants(
      location.latitude,
      location.longitude,
      normalizedRestaurants,
      normalizedRestaurants.length,
    ),
  );
});
```

Distance logic in `src/utils/distance.js` uses Haversine formula and sorting.

## 9) Sidebar Workflow

`src/components/Sidebar/Sidebar.jsx` handles two UI states:

1. List mode (no selected restaurant)
2. Detail mode (selected restaurant)

### 9.1 List mode

- Discover tab: Search + cuisine filter + list
- Favourites tab: favourites list only
- Recent tab: recent list only
- Loading: skeleton cards
- Error: retry block
- Empty: context-specific empty state

### 9.2 Detail mode

Shows `RestaurantDetail` with:

- Back button
- Show on Map (mobile)
- image
- halal badge
- name, cuisine, address, city, phone, hours
- website and directions actions
- favourite toggle

## 10) Card and Detail Components

### 10.1 RestaurantCard

`src/components/Sidebar/components/RestaurantCard.jsx` includes:

- cuisine image with onError fallback
- halal badge
- city + cuisine subtitle
- seeded rating from restaurant name hash
- cuisine tags
- optional distance
- heart favourite button with `stopPropagation`

### 10.2 RestaurantDetail

`src/components/Sidebar/components/RestaurantDetail.jsx` includes:

- back + show on map action
- image with fallback
- full metadata display
- favourite toggle
- website + Google Maps direction links

## 11) Favourites and Recent History

### 11.1 Favourites hook

`src/hooks/useFavourites.js`:

- local storage key: `halal-finder-favourites`
- safely parses stored value
- `toggleFavourite(name)`
- `isFavourite(name)`

### 11.2 Recent hook

`src/hooks/useRecent.js`:

- local storage key: `halal-finder-recent`
- safely parses stored value
- `addToRecent(name)` keeps max 10 and de-duplicates

Example:

```jsx
const filtered = safePrevious.filter((name) => name !== restaurantName);
return [restaurantName, ...filtered].slice(0, 10);
```

## 12) UI Utility Components

- `HalalBadge`: maps status text to Verified / Options / Neutral labels and colors
- `EmptyState`: configurable title/subtitle/action
- `ErrorState`: retry action
- `SkeletonCard`: loading placeholders

## 13) Theme System

### 13.1 Tailwind dark mode strategy

`tailwind.config.js`:

```js
darkMode: "class";
```

### 13.2 Runtime switching

- `Home.jsx` toggles `html.dark`
- `MainLayout` toggle button switches light/dark
- All major surfaces use light + dark class variants

## 14) Responsive Behavior

### 14.1 Desktop

- 45% sidebar, 55% map split

### 14.2 Mobile

- list/map switch with bottom toggle button
- selection opens detail full-screen in sidebar context
- show-on-map action switches to map view on mobile

## 15) Global Styling and Leaflet Safeguards

`src/index.css` includes:

- theme backgrounds
- marker animation styles
- slim custom scrollbars
- Leaflet mobile touch + z-index safeguards:

```css
.leaflet-container {
  -webkit-tap-highlight-color: transparent;
  touch-action: pan-x pan-y;
}

.leaflet-pane,
.leaflet-map-pane {
  z-index: 1 !important;
}
```

## 16) End-to-End Data Journey

1. App boots (`main.jsx` -> `App.jsx` -> `Home.jsx`)
2. `useRestaurants` fetches Google Sheet CSV
3. `sheetParser` parses rows to canonical objects
4. `Home` normalizes coordinates and IDs
5. filters and tab logic produce `tabRestaurants`
6. sidebar renders list/detail from `tabRestaurants`
7. map renders pins from `tabRestaurants`
8. selecting pin/card updates `selectedRestaurant`
9. detail view renders full info
10. favourites/recent persist in local storage

## 17) Example Interaction Traces

### A) Discover search by city

- User types in SearchBar
- Debounced `onSearch` updates `query`
- `filterRestaurants` matches by `name OR city`
- sidebar list and map pins update

### B) Near Me

- User clicks Near Me
- geolocation returns user coords
- nearest distances computed and sorted
- pins matching nearest IDs get glow ring
- cards show distance text

### C) Favourites

- User taps heart on a card
- name added to local storage favourites
- switch to Favourites tab -> list shows only favourited names

### D) Recent

- User opens a restaurant
- name added to recent list in local storage
- switch to Recent tab -> latest first, max 10

## 18) Operational Notes

- Data source is dynamic: adding a new row in Google Sheet appears after refetch/reload.
- Cuisine filter options are generated from live data at runtime.
- Project is frontend-only and deployment-safe on static hosting (given public CSV access).

## 19) Suggested Maintenance Practices

- Keep sheet column names consistent with current aliases.
- If new cuisine labels are introduced often, optionally expand `cuisineImageMap` for better image matching.
- Keep local storage keys stable to avoid data migration issues.

---

If you update architecture later, update this document in the same commit so code and docs always stay in sync.
