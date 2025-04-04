
import React, { useState, useEffect } from "react";
import "./ThemeToggle.css";

function ThemeToggle() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark-theme");
      document.documentElement.classList.remove("light-theme");
    } else {
      document.documentElement.classList.add("light-theme");
      document.documentElement.classList.remove("dark-theme");
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className="theme-toggle-container">
      <button 
        className="theme-toggle-button" 
        onClick={toggleTheme}
        aria-label="Toggle dark mode"
      >
        {isDarkMode ? (
          <span className="theme-icon">🌙</span>
        ) : (
          <span className="theme-icon">☀️</span>
        )}
      </button>
    </div>
  );
}

export default ThemeToggle;
