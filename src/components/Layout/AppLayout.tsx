
import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import NavBar from './NavBar';
import Sidebar from './Sidebar';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userMunicipality, setUserMunicipality] = useState<string | null>(null);
  const [userSetor, setUserSetor] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setLoading(true);
        
        // Check current session from Supabase
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          // If no Supabase session, redirect to login
          navigate('/login');
          return;
        }
        
        // Get user data
        const { data: userData, error: userError } = await supabase
          .from('usuarios')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        if (userError || !userData) {
          console.error('Error fetching user data:', userError);
          navigate('/login');
          return;
        }
        
        setUserRole(userData.role);
        setUserMunicipality(userData.municipio_id);
        
        // Get user secretarias
        const { data: userSecretarias, error: secretariasError } = await supabase
          .from('usuario_secretarias')
          .select('secretaria_id')
          .eq('usuario_id', session.user.id)
          .limit(1);
          
        if (userSecretarias && userSecretarias.length > 0) {
          setUserSetor(userSecretarias[0].secretaria_id);
        }

        // Restrict access to administrative area (only admin can access)
        if (userData.role !== 'admin' && location.pathname.includes('/admin')) {
          toast.error('Você não tem permissão para acessar esta página');
          navigate('/dashboard');
          return;
        }
        
        // Restrict dashboard access for regular users (servidores)
        if (userData.role === 'servidor' && location.pathname === '/dashboard') {
          toast.error('Você não tem permissão para acessar o dashboard');
          
          // Redirect to their department page if possible
          if (userSecretarias && userSecretarias.length > 0) {
            navigate(`/setores/${userSecretarias[0].secretaria_id}`);
          } else {
            navigate('/pedidos');
          }
          return;
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [navigate, location.pathname]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

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
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
