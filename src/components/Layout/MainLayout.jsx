import PropTypes from 'prop-types'

function MainLayout({
  sidebar,
  map,
  theme,
  onToggleTheme,
  activeTab,
  onTabChange,
  hasSelectedRestaurant,
  onNearMe,
  mobileView,
  onToggleMobileView,
}) {
  const tabs = [
    { id: 'discover', label: 'Discover' },
    { id: 'favourites', label: 'Favourites' },
    { id: 'recent', label: 'Recent' },
  ]

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-[#f8faf8] text-[#1a2e1a] dark:bg-app-background dark:text-app-text-primary">
      <header className="shrink-0 border-b border-[#d1ddd1] bg-white/95 backdrop-blur-sm dark:border-app-border dark:bg-app-surface/95">
        <div className="mx-auto w-full px-4 py-2 md:flex md:h-[72px] md:items-center md:justify-between md:px-6 md:py-0">
          <div className="flex items-center justify-between md:min-w-[240px]">
            <div className="text-xl font-extrabold tracking-wide text-app-highlight">Verdant Halal</div>

            <div className="flex items-center gap-2 md:hidden">
              <button
                type="button"
                onClick={onToggleTheme}
                className="relative inline-flex h-7 w-14 items-center rounded-full border border-[#d1ddd1] bg-[#f0f4f0] transition-all duration-300 dark:border-app-border dark:bg-app-elevated"
                aria-label="Toggle theme"
              >
                <span className="absolute left-2 text-[11px]">☀️</span>
                <span className="absolute right-2 text-[11px]">🌙</span>
                <span
                  className={`absolute inline-flex h-6 w-6 items-center justify-center rounded-full bg-white shadow-sm transition-all duration-300 dark:bg-[#121923] ${
                    theme === 'dark' ? 'translate-x-7' : 'translate-x-0.5'
                  }`}
                >
                  {theme === 'dark' ? '🌙' : '☀️'}
                </span>
              </button>

              <button
                type="button"
                onClick={onNearMe}
                className="inline-flex items-center gap-2 rounded-full bg-app-accent px-3 py-2 text-xs font-semibold text-white transition-all duration-300 hover:scale-[1.02] hover:bg-app-highlight"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
                  <path fill="currentColor" d="M12 2 3 13h6l-1 9 10-13h-6V2Z" />
                </svg>
                Near Me
              </button>
            </div>
          </div>

          <nav className="no-scrollbar mt-2 flex w-full items-center gap-2 overflow-x-auto md:mt-0 md:max-w-[44%] md:justify-center">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => onTabChange(tab.id)}
                className={`shrink-0 border-b-2 px-3 py-1 text-sm font-medium transition-colors duration-200 ${
                  activeTab === tab.id
                    ? 'border-[#52b788] text-[#52b788]'
                    : 'border-transparent text-[#8b949e] hover:text-[#1a2e1a] dark:hover:text-[#f0f6fc]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          <div className="hidden items-center gap-2 md:flex">
            <button
              type="button"
              onClick={onToggleTheme}
              className="relative inline-flex h-7 w-14 items-center rounded-full border border-[#d1ddd1] bg-[#f0f4f0] transition-all duration-300 dark:border-app-border dark:bg-app-elevated"
              aria-label="Toggle theme"
            >
              <span className="absolute left-2 text-[11px]">☀️</span>
              <span className="absolute right-2 text-[11px]">🌙</span>
              <span
                className={`absolute inline-flex h-6 w-6 items-center justify-center rounded-full bg-white shadow-sm transition-all duration-300 dark:bg-[#121923] ${
                  theme === 'dark' ? 'translate-x-7' : 'translate-x-0.5'
                }`}
              >
                {theme === 'dark' ? '🌙' : '☀️'}
              </span>
            </button>

            <button
              type="button"
              onClick={onNearMe}
              className="inline-flex items-center gap-2 rounded-full bg-app-accent px-4 py-2 text-sm font-semibold text-white transition-all duration-300 hover:scale-[1.02] hover:bg-app-highlight"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
                <path fill="currentColor" d="M12 2 3 13h6l-1 9 10-13h-6V2Z" />
              </svg>
              Near Me
            </button>
          </div>
        </div>
      </header>

      <main className="relative min-h-0 flex-1">
        <div className="hidden h-full md:grid md:grid-cols-[45%_55%]">
          <section className="h-full overflow-hidden border-r border-[#d1ddd1] bg-[#f8faf8] dark:border-app-border dark:bg-app-surface">{sidebar}</section>
          <section className="h-full bg-[#f8faf8] dark:bg-app-background">{map}</section>
        </div>

        <div className="relative h-full pb-20 md:hidden">
          {mobileView === 'map' ? (
            <section className="animate-fade-up h-full w-full bg-[#f8faf8] dark:bg-app-background">{map}</section>
          ) : hasSelectedRestaurant ? (
            <section className="animate-fade-up h-full w-full overflow-hidden bg-[#f8faf8] dark:bg-app-surface">{sidebar}</section>
          ) : (
            <section className="animate-fade-up h-full w-full overflow-hidden bg-[#f8faf8] dark:bg-app-surface">{sidebar}</section>
          )}

          {!hasSelectedRestaurant && (
            <button
              type="button"
              onClick={onToggleMobileView}
              className="fixed bottom-4 left-1/2 z-[1300] -translate-x-1/2 rounded-full border border-white/20 bg-app-primary/95 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-black/20 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:bg-app-accent"
              style={{ bottom: 'max(1rem, env(safe-area-inset-bottom))' }}
            >
              {mobileView === 'list' ? 'Show Map' : 'Show List'}
            </button>
          )}
        </div>
      </main>
    </div>
  )
}

MainLayout.propTypes = {
  sidebar: PropTypes.node.isRequired,
  map: PropTypes.node.isRequired,
  theme: PropTypes.oneOf(['light', 'dark']).isRequired,
  onToggleTheme: PropTypes.func.isRequired,
  activeTab: PropTypes.oneOf(['discover', 'favourites', 'recent']).isRequired,
  onTabChange: PropTypes.func.isRequired,
  hasSelectedRestaurant: PropTypes.bool.isRequired,
  onNearMe: PropTypes.func.isRequired,
  mobileView: PropTypes.oneOf(['list', 'map']).isRequired,
  onToggleMobileView: PropTypes.func.isRequired,
}

export default MainLayout