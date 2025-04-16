
import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import NavBar from './NavBar';
import Sidebar from './Sidebar';
import { toast } from 'sonner';
import { getUserRole, getUserSetor, canAccessDashboard } from '@/utils/authHelpers';

const AppLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userMunicipality, setUserMunicipality] = useState<string | null>(null);
  const [userSetor, setUserSetor] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('user-authenticated') === 'true';
    const role = localStorage.getItem('user-role');
    const municipality = localStorage.getItem('user-municipality');
    const setor = localStorage.getItem('user-setor');
    
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    setUserRole(role);
    setUserMunicipality(municipality);
    setUserSetor(setor);

    // Restrict access to administrative area (only admin can access)
    if (role !== 'admin' && location.pathname.includes('/admin') && role !== 'prefeito') {
      toast.error('Você não tem permissão para acessar esta página');
      navigate('/dashboard');
      return;
    }
    
    // Restrict dashboard access for regular users (servidores)
    if (!canAccessDashboard() && location.pathname === '/dashboard') {
      toast.error('Você não tem permissão para acessar o dashboard');
      
      // Redirect to their department page if possible
      if (setor) {
        const setorUrl = convertSetorToUrl(setor);
        navigate(`/setores/${setorUrl}`);
      } else {
        navigate('/pedidos');
      }
      return;
    }

  }, [navigate, location.pathname]);

  // Helper function to convert setor name to URL format
  const convertSetorToUrl = (setor: string | null): string => {
    if (!setor) return '';
    
    const setorMap: {[key: string]: string} = {
      'Saúde': 'saude',
      'Educação': 'educacao',
      'Administrativo': 'administrativo',
      'Transporte': 'transporte',
      'Obras': 'obras',
      'Segurança Pública': 'seguranca',
      'Assistência Social': 'social',
      'Meio Ambiente': 'ambiente',
      'Fazenda': 'fazenda',
      'Turismo': 'turismo',
      'Cultura': 'cultura',
      'Esportes e Lazer': 'esportes',
      'Planejamento': 'planejamento',
      'Comunicação': 'comunicacao',
      'Ciência e Tecnologia': 'ciencia',
    };
    
    return setorMap[setor] || setor.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '-');
  };

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
