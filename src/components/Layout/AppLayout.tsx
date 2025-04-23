
import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import NavBar from './NavBar';
import Sidebar from './Sidebar';
import { toast } from 'sonner';
import { getUserRole, canAccessDashboard } from '@/utils/auth';

const AppLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userMunicipality, setUserMunicipality] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('user-authenticated') === 'true';
    const role = localStorage.getItem('user-role');
    const municipality = localStorage.getItem('user-municipality');
    
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    setUserRole(role);
    setUserMunicipality(municipality);

    // Restrict access to administrative area (only admin can access)
    if (role !== 'admin' && location.pathname.includes('/admin')) {
      toast.error('Você não tem permissão para acessar esta página');
      navigate('/dashboard');
      return;
    }
    
    // Restrict dashboard access for regular users (servidores)
    if (role === 'user' && location.pathname === '/dashboard') {
      toast.error('Você não tem permissão para acessar o dashboard');
      navigate('/pedidos');
      return;
    }

  }, [navigate, location.pathname]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-background">
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
