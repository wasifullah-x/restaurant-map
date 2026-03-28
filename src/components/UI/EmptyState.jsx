import PropTypes from 'prop-types'

function EmptyState({ title, subtitle, actionLabel, onAction }) {
  return (
    <div className="flex min-h-[280px] flex-col items-center justify-center rounded-xl border border-dashed border-[#d1ddd1] bg-white p-6 text-center dark:border-app-border dark:bg-app-elevated">
      <div className="text-5xl" aria-hidden="true">
        🍽️
      </div>
      <h3 className="mt-4 text-xl font-bold text-[#1a2e1a] dark:text-app-text-primary">{title}</h3>
      <p className="mt-2 text-sm text-[#4a6741] dark:text-app-text-secondary">{subtitle}</p>
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="mt-5 rounded-full bg-app-accent px-5 py-2 text-sm font-semibold text-white transition-all duration-300 hover:bg-app-highlight"
        >
          {actionLabel}
        </button>
      )}
    </div>
  )
}

EmptyState.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  actionLabel: PropTypes.string,
  onAction: PropTypes.func,
}

EmptyState.defaultProps = {
  title: 'No restaurants found',
  subtitle: 'Try adjusting your search or filters',
  actionLabel: 'Clear all filters',
  onAction: undefined,
}

export default EmptyState
