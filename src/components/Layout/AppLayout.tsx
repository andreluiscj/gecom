
import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import NavBar from './NavBar';
import Sidebar from './Sidebar';

const AppLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  // Check for high contrast and dark mode when component mounts
  useEffect(() => {
    const checkHighContrast = () => {
      const highContrastMode = document.documentElement.classList.contains('high-contrast');
      setIsHighContrast(highContrastMode);
    };
    
    const checkDarkMode = () => {
      const darkMode = localStorage.getItem('dark-mode') === 'true';
      setIsDarkMode(darkMode);
    };
    
    checkHighContrast();
    checkDarkMode();
    
    // Set up an observer for class changes on the html element
    const observer = new MutationObserver(() => {
      checkHighContrast();
      checkDarkMode();
    });
    
    observer.observe(document.documentElement, { 
      attributes: true, 
      attributeFilter: ['class'] 
    });
    
    return () => observer.disconnect();
  }, []);

  return (
    <div className={`min-h-screen bg-background ${isHighContrast ? 'high-contrast' : ''} ${isDarkMode ? 'dark-theme' : 'light-theme'}`}>
      <Sidebar isOpen={isSidebarOpen} />
      <div className={`transition-all duration-300 ${isSidebarOpen ? 'pl-64' : 'pl-0'}`}>
        <NavBar toggleSidebar={toggleSidebar} />
        <main className="p-5 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
