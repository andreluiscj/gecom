import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  BarChart3,
  FilePlus,
  Folder,
  HeartPulse,
  Home,
  List,
  BookOpen,
  Building2,
  Bus,
  ShoppingCart,
  Check,
  CheckSquare,
  ChevronDown,
  ChevronRight,
  Shield,
  Heart,
  Leaf,
  Coins,
  Briefcase,
  Music,
  Ticket,
  MapPin,
  Globe,
  Radio,
  Award,
  PieChartIcon,
  LogOut,
  Users,
  UserPlus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { 
  canAccessUserManagementSync, 
  canAccessDashboardSync, 
  getUserSetorSync, 
  shouldFilterByUserSetorSync,
  hasSetorAccessSync 
} from '@/utils/auth';

interface SidebarProps {
  isOpen: boolean;
  userRole?: string | null;
  userMunicipality?: string | null;
  userSetor?: string | null;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, userRole, userMunicipality, userSetor }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [secretariasOpen, setSecretariasOpen] = useState(false);
  const showOnlyUserSetor = shouldFilterByUserSetorSync();

  useEffect(() => {
    if (location.pathname.includes('/setores/')) {
      setSecretariasOpen(true);
    }
    
    if (userRole === 'user' && userSetor) {
      setSecretariasOpen(true);
    }
  }, [location.pathname, userRole, userSetor]);

  const toggleSecretarias = () => {
    setSecretariasOpen(!secretariasOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('user-authenticated');
    localStorage.removeItem('user-role');
    localStorage.removeItem('user-municipality');
    localStorage.removeItem('user-name');
    localStorage.removeItem('user-setor');
    localStorage.removeItem('funcionario-id');
    localStorage.removeItem('user-id');
    toast.success('Logout realizado com sucesso!');
    navigate('/login');
  };

  const hasUserManagementAccess = canAccessUserManagementSync();
  const hasDashboardAccess = canAccessDashboardSync();

  const menuItems = [
    {
      title: 'Painel de Gestão',
      path: '/dashboard',
      icon: <Home className="h-5 w-5" />,
      roles: ['admin', 'prefeito', 'manager'],
      visible: hasDashboardAccess
    },
    {
      title: 'Pedidos de Compras',
      path: '/pedidos',
      icon: <List className="h-5 w-5" />,
      roles: ['admin', 'prefeito', 'gerente', 'user', 'manager'],
      visible: true
    },
    {
      title: 'Nova DFD',
      path: '/pedidos/novo',
      icon: <FilePlus className="h-5 w-5" />,
      roles: ['admin', 'prefeito', 'gerente', 'user', 'manager'],
      visible: true
    },
    {
      title: 'Tarefas',
      path: '/tarefas',
      icon: <CheckSquare className="h-5 w-5" />,
      roles: ['admin', 'prefeito', 'gerente', 'user', 'manager'],
      visible: true
    },
    {
      title: 'Administração',
      path: '/admin',
      icon: <Building2 className="h-5 w-5" />,
      roles: ['admin'],
      visible: userRole === 'admin'
    },
    {
      title: 'Cadastro de Gestor',
      path: '/admin/gerentes',
      icon: <UserPlus className="h-5 w-5" />,
      roles: ['admin', 'prefeito'],
      visible: hasUserManagementAccess
    },
    {
      title: 'Gerenciamento de Servidores',
      path: '/gerenciamento/funcionarios',
      icon: <Users className="h-5 w-5" />,
      roles: ['admin', 'prefeito'],
      visible: hasUserManagementAccess
    },
    {
      title: 'Área do Prefeito',
      path: '/prefeito',
      icon: <Building2 />,
      roles: ['admin', 'prefeito'],
      visible: userRole === 'admin' || userRole === 'prefeito'
    }
  ];

  const secretariasItems = [
    {
      title: 'Saúde',
      path: '/setores/saude',
      icon: <HeartPulse className="h-5 w-5" />,
      color: 'text-white',
      id: 'Saúde'
    },
    {
      title: 'Educação',
      path: '/setores/educacao',
      icon: <BookOpen className="h-5 w-5" />,
      color: 'text-white',
      id: 'Educação'
    },
    {
      title: 'Administração',
      path: '/setores/administrativo',
      icon: <Building2 className="h-5 w-5" />,
      color: 'text-white',
      id: 'Administrativo'
    },
    {
      title: 'Transporte',
      path: '/setores/transporte',
      icon: <Bus className="h-5 w-5" />,
      color: 'text-white',
      id: 'Transporte'
    },
    {
      title: 'Obras',
      path: '/setores/obras',
      icon: <Briefcase className="h-5 w-5" />,
      color: 'text-white',
      id: 'Obras'
    },
    {
      title: 'Segurança Pública',
      path: '/setores/seguranca',
      icon: <Shield className="h-5 w-5" />,
      color: 'text-white',
      id: 'Segurança Pública'
    },
    {
      title: 'Assistência Social',
      path: '/setores/social',
      icon: <Heart className="h-5 w-5" />,
      color: 'text-white',
      id: 'Assistência Social'
    },
    {
      title: 'Meio Ambiente',
      path: '/setores/ambiente',
      icon: <Leaf className="h-5 w-5" />,
      color: 'text-white',
      id: 'Meio Ambiente'
    },
    {
      title: 'Fazenda',
      path: '/setores/fazenda',
      icon: <Coins className="h-5 w-5" />,
      color: 'text-white',
      id: 'Fazenda'
    },
    {
      title: 'Turismo',
      path: '/setores/turismo',
      icon: <Globe className="h-5 w-5" />,
      color: 'text-white',
      id: 'Turismo'
    },
    {
      title: 'Cultura',
      path: '/setores/cultura',
      icon: <Music className="h-5 w-5" />,
      color: 'text-white',
      id: 'Cultura'
    },
    {
      title: 'Esportes e Lazer',
      path: '/setores/esportes',
      icon: <Award className="h-5 w-5" />,
      color: 'text-white',
      id: 'Esportes e Lazer'
    },
    {
      title: 'Planejamento',
      path: '/setores/planejamento',
      icon: <PieChartIcon className="h-5 w-5" />,
      color: 'text-white',
      id: 'Planejamento'
    },
    {
      title: 'Comunicação',
      path: '/setores/comunicacao',
      icon: <Radio className="h-5 w-5" />,
      color: 'text-white',
      id: 'Comunicação'
    },
    {
      title: 'Ciência e Tecnologia',
      path: '/setores/ciencia',
      icon: <MapPin className="h-5 w-5" />,
      color: 'text-white',
      id: 'Ciência e Tecnologia'
    },
  ];

  const filteredSecretarias = secretariasItems.filter(item => {
    if (showOnlyUserSetor && userSetor) {
      return hasSetorAccessSync(item.id);
    }
    return true;
  });

  const filteredMenuItems = menuItems.filter(
    (item) => item.visible && ((item.roles && userRole && item.roles.includes(userRole)))
  );

  return (
    <div
      className={cn(
        'border-r border-sidebar-border bg-sidebar fixed inset-y-0 z-30 flex w-64 flex-col transition-all duration-300 ease-in-out shadow-lg',
        isOpen ? 'left-0' : '-left-64'
      )}
    >
      <div className="border-b border-sidebar-border py-5 px-5">
        <div className="flex items-center space-x-2">
          <div className="flex items-center">
            <img 
              src="/lovable-uploads/16b8bdb2-a18d-4ef2-8b14-ce836cb5bef0.png" 
              alt="Logo" 
              className="h-8"
            />
          </div>
        </div>
      </div>
      <div className="flex flex-1 flex-col overflow-auto py-4">
        <nav className="flex-1 px-3 space-y-1">
          {filteredMenuItems.map((item, idx) => (
            <div key={idx} className="mb-1">
              <Link
                to={item.path}
                className={cn(
                  'flex items-center rounded-md px-3 py-2.5 text-sm font-medium transition-all duration-200 text-white',
                  location.pathname === item.path
                    ? 'bg-sidebar-primary shadow-md'
                    : 'hover:bg-sidebar-accent hover:shadow-sm'
                )}
              >
                <span className="mr-3">{item.icon}</span>
                <span>{item.title}</span>
              </Link>
            </div>
          ))}
          
          {filteredSecretarias.length > 0 && (
            <div className="mb-1">
              <button
                onClick={toggleSecretarias}
                className={cn(
                  'flex items-center w-full justify-between rounded-md px-3 py-2.5 text-sm font-medium transition-all duration-200 text-white',
                  secretariasOpen ? 'bg-sidebar-primary shadow-md' : 'hover:bg-sidebar-accent hover:shadow-sm'
                )}
              >
                <div className="flex items-center">
                  <span className="mr-3"><Folder className="h-5 w-5" /></span>
                  <span>Secretarias</span>
                </div>
                {secretariasOpen ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </button>
              
              {secretariasOpen && (
                <div className="mt-1 space-y-1 pl-10 pr-3 max-h-64 overflow-y-auto">
                  {filteredSecretarias.map((subItem, subIdx) => {
                    const isUserSetor = userSetor === subItem.id;
                    
                    return (
                      <Link
                        key={subIdx}
                        to={subItem.path}
                        className={cn(
                          'flex items-center rounded-md px-3 py-2 text-sm font-medium transition-all duration-200 text-white',
                          location.pathname === subItem.path || isUserSetor
                            ? 'bg-sidebar-primary shadow-md'
                            : 'hover:bg-sidebar-accent hover:shadow-sm'
                        )}
                      >
                        <div className="mr-2.5">
                          {subItem.icon}
                        </div>
                        <span>{subItem.title}{isUserSetor ? ' ✓' : ''}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </nav>
      </div>
      <div className="border-t border-sidebar-border p-4">
        <Button 
          variant="outline" 
          className="w-full flex items-center justify-center gap-2"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" /> 
          <span>Sair</span>
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
