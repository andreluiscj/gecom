
import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import NavBar from './NavBar';
import Sidebar from './Sidebar';
import { toast } from 'sonner';

const AppLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userMunicipality, setUserMunicipality] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check authentication when component mounts
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('user-authenticated') === 'true';
    const role = localStorage.getItem('user-role');
    const municipality = localStorage.getItem('user-municipality');
    
    if (!isAuthenticated) {
      // If not authenticated, redirect to login
      navigate('/login');
      return;
    }
    
    setUserRole(role);
    setUserMunicipality(municipality);

    // Role-based route restrictions
    if (role === 'gerente' || role === 'funcionario') {
      // If trying to access admin page, redirect to dashboard
      if (location.pathname === '/admin') {
        toast.error('Você não tem permissão para acessar esta página');
        navigate('/dashboard');
      }
    }
  }, [navigate, location.pathname]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  // Check for dark mode when component mounts
  useEffect(() => {
    const checkDarkMode = () => {
      const darkMode = localStorage.getItem('dark-mode') === 'true';
      setIsDarkMode(darkMode);
    };
    
    checkDarkMode();
    
    // Set up an observer for class changes on the html element
    const observer = new MutationObserver(() => {
      checkDarkMode();
    });
    
    observer.observe(document.documentElement, { 
      attributes: true, 
      attributeFilter: ['class'] 
    });
    
    return () => observer.disconnect();
  }, []);

  return (
    <div className={`min-h-screen bg-background ${isDarkMode ? 'dark-theme' : 'light-theme'}`}>
      <Sidebar 
        isOpen={isSidebarOpen} 
        userRole={userRole} 
        userMunicipality={userMunicipality} 
      />
      <div className={`transition-all duration-300 ${isSidebarOpen ? 'pl-64' : 'pl-0'}`}>
        <NavBar 
          toggleSidebar={toggleSidebar} 
          userRole={userRole} 
          userMunicipality={userMunicipality} 
        />
        <main className="p-5 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
