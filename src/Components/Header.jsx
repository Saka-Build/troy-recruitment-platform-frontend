function Header() {
  return (
    <header className="top-header">

      {/* Search */}
      <div className="search-wrapper">

        <span className="search-icon">
          ⌕
        </span>

        <input
          type="text"
          placeholder="Search candidates, jobs, clients..."
          className="search-input"
        />

      </div>

      {/* Header Actions */}
      <div className="header-actions">

        <button className="advanced-btn">
          ⌕ Advanced
        </button>

        <button className="header-icon-btn">
          🌙
        </button>

        <button className="header-icon-btn notification-btn">
          🔔
          <span className="notification-count">
            2
          </span>
        </button>

      </div>

    </header>
  );
}

export default Header;