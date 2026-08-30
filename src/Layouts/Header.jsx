import React, { useEffect, useState } from "react";
// import Advanced from "./Advanced";

function Header() {
    const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    document.body.classList.toggle("dark-theme", darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const toggleTheme = () => {
    setDarkMode((prev) => !prev);
  };
    const openAdvanced = () => {
    setIsAdvancedOpen(true);
  };

  const closeAdvanced = () => {
    setIsAdvancedOpen(false);
  };

  return (
    <header className="top-header">
      <div className="header-actions">
        <button className="advanced-btn" onClick={openAdvanced}>
          <span className="advanced-icon">⚡</span>
          Advanced
        </button>

        <button
          className="header-icon-btn theme-toggle"
          onClick={toggleTheme}
          aria-label="Toggle theme"
          title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {darkMode ? "☀️" : "🌙"}
          <span className="tooltip">
            {darkMode ? "Light Mode" : "Dark Mode"}
          </span>
        </button>

        <button className="header-icon-btn notification-btn">
          <span className="notification-icon">🔔</span>
          <span className="notification-count">2</span>
          <span className="tooltip">Notifications</span>
        </button>
      </div>
      {/* <Advanced isOpen={isAdvancedOpen} onClose={closeAdvanced} /> */}
    </header>
  );
}

export default Header;