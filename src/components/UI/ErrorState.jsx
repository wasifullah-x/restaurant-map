import PropTypes from 'prop-types'

function ErrorState({ onRetry }) {
  return (
    <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center dark:border-red-500/30 dark:bg-red-900/20">
      <div className="text-3xl" aria-hidden="true">
        ⚠️
      </div>
      <h3 className="mt-3 text-lg font-bold text-[#1a2e1a] dark:text-app-text-primary">Failed to load restaurants</h3>
      <p className="mt-2 text-sm text-[#4a6741] dark:text-app-text-secondary">Please check your network or sheet access and retry.</p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-4 rounded-full bg-app-accent px-4 py-2 text-sm font-semibold text-white transition-all duration-300 hover:bg-app-highlight"
      >
        Retry
      </button>
    </div>
  )
}

ErrorState.propTypes = {
  onRetry: PropTypes.func.isRequired,
}

export default ErrorState
