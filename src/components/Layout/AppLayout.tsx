
import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import NavBar from './NavBar';
import Sidebar from './Sidebar';
import { toast } from 'sonner';
import { isAuthenticated, getUserRole, getUserSecretarias } from '@/utils/auth';
import { supabase } from '@/integrations/supabase/client';

const AppLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userMunicipality, setUserMunicipality] = useState<string | null>(null);
  const [userSetor, setUserSetor] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    const checkAuth = async () => {
      // Check current session from Supabase
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        // If no Supabase session, redirect to login
        localStorage.removeItem('user-authenticated');
        navigate('/login');
        return;
      }
      
      const authenticated = isAuthenticated();
      
      if (!authenticated) {
        navigate('/login');
        return;
      }
      
      const role = getUserRole();
      const municipality = localStorage.getItem('user-municipality');
      const secretarias = getUserSecretarias();
      const setor = localStorage.getItem('user-setor');
      
      setUserRole(role);
      setUserMunicipality(municipality);
      setUserSetor(setor);

      // Restrict access to administrative area (only admin can access)
      if (role !== 'admin' && location.pathname.includes('/admin')) {
        toast.error('Você não tem permissão para acessar esta página');
        navigate('/dashboard');
        return;
      }
      
      // Restrict dashboard access for regular users (servidores)
      if (role === 'servidor' && location.pathname === '/dashboard') {
        toast.error('Você não tem permissão para acessar o dashboard');
        
        // Redirect to their department page if possible
        if (secretarias.length > 0) {
          navigate(`/setores/${secretarias[0]}`);
        } else {
          navigate('/pedidos');
        }
        return;
      }
    };

    checkAuth();
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
        userSetor={userSetor}
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
