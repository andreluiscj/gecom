
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
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
  ChevronLeft,
  ChevronUp,
  PieChart
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  const location = useLocation();
  const [secretariasOpen, setSecretariasOpen] = useState(false);

  const toggleSecretarias = () => {
    setSecretariasOpen(!secretariasOpen);
  };

  const menuItems = [
    {
      title: 'Dashboard',
      path: '/dashboard',
      icon: <Home className="h-5 w-5" />,
    },
    {
      title: 'Pedidos',
      path: '/pedidos',
      icon: <List className="h-5 w-5" />,
    },
    {
      title: 'Novo Pedido',
      path: '/pedidos/novo',
      icon: <FilePlus className="h-5 w-5" />,
    },
    {
      title: 'Relatórios',
      path: '/relatorios',
      icon: <BarChart3 className="h-5 w-5" />,
    },
    {
      title: 'Tarefas',
      path: '/tarefas',
      icon: <CheckSquare className="h-5 w-5" />,
    }
  ];

  const secretariasItems = [
    {
      title: 'Saúde',
      path: '/setores/saude',
      icon: <HeartPulse className="h-5 w-5" />,
      color: 'bg-saude-DEFAULT text-white',
    },
    {
      title: 'Educação',
      path: '/setores/educacao',
      icon: <BookOpen className="h-5 w-5" />,
      color: 'bg-educacao-DEFAULT text-white',
    },
    {
      title: 'Administrativo',
      path: '/setores/administrativo',
      icon: <Building2 className="h-5 w-5" />,
      color: 'bg-administrativo-DEFAULT text-white',
    },
    {
      title: 'Transporte',
      path: '/setores/transporte',
      icon: <Bus className="h-5 w-5" />,
      color: 'bg-transporte-DEFAULT text-white',
    },
  ];

  return (
    <div
      className={cn(
        'border-r border-sidebar-border bg-sidebar fixed inset-y-0 z-30 flex w-64 flex-col transition-all duration-300 ease-in-out shadow-lg',
        isOpen ? 'left-0' : '-left-64'
      )}
    >
      <div className="border-b border-sidebar-border py-5 px-5">
        <div className="flex items-center space-x-2">
          <div className="flex text-white bg-sidebar-primary p-1.5 rounded-md">
            <ShoppingCart className="h-5 w-5" />
            <Check className="h-5 w-5 -ml-3 -mt-1" />
          </div>
          <h2 className="font-heading font-bold text-xl text-white">GECOM</h2>
        </div>
      </div>
      <div className="flex flex-1 flex-col overflow-auto py-4">
        <nav className="flex-1 px-3 space-y-1">
          {menuItems.map((item, idx) => (
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
          
          {/* Secretárias Dropdown */}
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
                <span>Secretárias</span>
              </div>
              {secretariasOpen ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </button>
            
            {secretariasOpen && (
              <div className="mt-1 space-y-1 pl-10 pr-3">
                {secretariasItems.map((subItem, subIdx) => (
                  <Link
                    key={subIdx}
                    to={subItem.path}
                    className={cn(
                      'flex items-center rounded-md px-3 py-2 text-sm font-medium transition-all duration-200 text-white',
                      location.pathname === subItem.path
                        ? 'bg-sidebar-primary shadow-md'
                        : 'hover:bg-sidebar-accent hover:shadow-sm'
                    )}
                  >
                    <div className={`${subItem.color} p-1 rounded-md mr-2.5`}>
                      {subItem.icon}
                    </div>
                    <span>{subItem.title}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </nav>
      </div>
      <div className="border-t border-sidebar-border p-4">
        <div className="flex items-center justify-center">
          <p className="text-xs text-sidebar-foreground/70">
            © 2023 GECOM • Sistema de Gestão de Compras
          </p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
