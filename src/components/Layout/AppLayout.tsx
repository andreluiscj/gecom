
import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import NavBar from './NavBar';
import Sidebar from './Sidebar';

const AppLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isHighContrast, setIsHighContrast] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  // Check for high contrast mode when component mounts
  useEffect(() => {
    const checkHighContrast = () => {
      const highContrastMode = document.documentElement.classList.contains('high-contrast');
      setIsHighContrast(highContrastMode);
    };
    
    checkHighContrast();
    
    // Set up an observer for class changes on the html element
    const observer = new MutationObserver(checkHighContrast);
    observer.observe(document.documentElement, { 
      attributes: true, 
      attributeFilter: ['class'] 
    });
    
    return () => observer.disconnect();
  }, []);

  return (
    <div className={`min-h-screen bg-background ${isHighContrast ? 'high-contrast' : ''}`}>
      <Sidebar isOpen={isSidebarOpen} />
      <div className={`transition-all duration-300 ${isSidebarOpen ? 'pl-64' : 'pl-0'}`}>
        <NavBar toggleSidebar={toggleSidebar} />
        <main className="p-6 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
