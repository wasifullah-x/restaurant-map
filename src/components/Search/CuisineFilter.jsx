import PropTypes from 'prop-types'

function CuisineFilter({ options, activeCuisine, onCuisineChange }) {
  return (
    <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
      {options.map((cuisine) => {
        const isActive = activeCuisine === cuisine
        return (
          <button
            key={cuisine}
            type="button"
            onClick={() => onCuisineChange(cuisine)}
            className={`whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-wide transition-all duration-300 ${
              isActive
                ? 'border-app-highlight bg-app-accent text-white dark:border-app-highlight dark:bg-app-accent'
                : 'border-[#d1ddd1] bg-white text-[#4a6741] hover:border-app-highlight hover:text-[#1a2e1a] dark:border-app-border dark:bg-transparent dark:text-app-text-secondary dark:hover:text-app-text-primary'
            }`}
          >
            {cuisine}
          </button>
        )
      })}
    </div>
  )
}

CuisineFilter.propTypes = {
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
  activeCuisine: PropTypes.string.isRequired,
  onCuisineChange: PropTypes.func.isRequired,
}

export default CuisineFilter
