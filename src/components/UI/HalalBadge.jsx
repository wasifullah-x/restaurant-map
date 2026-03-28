import PropTypes from 'prop-types'

function HalalBadge({ status }) {
  const normalized = (status || '').toLowerCase()

  const isVerified = normalized.includes('fully') || normalized.includes('certified')
  const hasOptions = normalized.includes('options')

  const badgeClasses = isVerified
    ? 'bg-[#e8f5e9] text-[#1a472a] dark:bg-app-halal-green/25 dark:text-app-halal-green'
    : hasOptions
      ? 'bg-[#fff4cf] text-[#8b6400] dark:bg-app-halal-amber/25 dark:text-app-halal-amber'
      : 'bg-[#e8f5e9] text-[#1a472a] dark:bg-gray-600/35 dark:text-gray-200'

  const label = isVerified ? '✓ Verified Halal' : hasOptions ? 'Halal Options' : 'Halal'

  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${badgeClasses}`}>
      <span>{label}</span>
    </span>
  )
}

HalalBadge.propTypes = {
  status: PropTypes.string,
}

HalalBadge.defaultProps = {
  status: '',
}

export default HalalBadge
