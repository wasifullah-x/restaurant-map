import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'

function SearchBar({ value, onSearch }) {
  const [localValue, setLocalValue] = useState(value)

  useEffect(() => {
    setLocalValue(value)
  }, [value])

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      onSearch(localValue)
    }, 300)

    return () => window.clearTimeout(timeoutId)
  }, [localValue, onSearch])

  return (
    <label className="relative block" htmlFor="restaurant-search">
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#4a6741] dark:text-app-text-secondary">
        <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
          <path
            fill="currentColor"
            d="M10.5 3a7.5 7.5 0 1 1 4.9 13.2l4.2 4.2-1.4 1.4-4.2-4.2A7.5 7.5 0 0 1 10.5 3Zm0 2a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11Z"
          />
        </svg>
      </span>
      <input
        id="restaurant-search"
        type="search"
        value={localValue}
        onChange={(event) => setLocalValue(event.target.value)}
        placeholder="Search by restaurant or city"
        className="h-11 w-full rounded-full border border-[#d1ddd1] bg-white pl-9 pr-9 text-sm text-[#1a2e1a] placeholder:text-[#4a6741] focus:border-app-highlight focus:outline-none dark:border-app-border dark:bg-app-elevated dark:text-app-text-primary dark:placeholder:text-app-text-secondary"
      />

      {localValue && (
        <button
          type="button"
          onClick={() => {
            setLocalValue('')
            onSearch('')
          }}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4a6741] transition hover:text-[#1a2e1a] dark:text-app-text-secondary dark:hover:text-app-text-primary"
          aria-label="Clear search"
        >
          ×
        </button>
      )}
    </label>
  )
}

SearchBar.propTypes = {
  value: PropTypes.string.isRequired,
  onSearch: PropTypes.func.isRequired,
}

export default SearchBar
