
import React from 'react';
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
  CheckSquare
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  const location = useLocation();

  const menuItems = [
    {
      title: 'Dashboard',
      path: '/',
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
    },
    {
      title: 'Secretárias',
      icon: <Folder className="h-5 w-5" />,
      submenu: [
        {
          title: 'Saúde',
          path: '/setores/saude',
          icon: <HeartPulse className="h-5 w-5 text-white" />,
        },
        {
          title: 'Educação',
          path: '/setores/educacao',
          icon: <BookOpen className="h-5 w-5 text-white" />,
        },
        {
          title: 'Administrativo',
          path: '/setores/administrativo',
          icon: <Building2 className="h-5 w-5 text-white" />,
        },
        {
          title: 'Transporte',
          path: '/setores/transporte',
          icon: <Bus className="h-5 w-5 text-white" />,
        },
      ],
    },
  ];

  return (
    <div
      className={cn(
        'border-r bg-indigo-900 fixed inset-y-0 z-30 flex w-64 flex-col transition-all duration-300 ease-in-out',
        isOpen ? 'left-0' : '-left-64'
      )}
    >
      <div className="border-b border-indigo-800 py-4 px-5">
        <div className="flex items-center">
          <div className="flex text-white mr-2">
            <ShoppingCart className="h-6 w-6" />
            <Check className="h-6 w-6 -ml-3 -mt-1" />
          </div>
          <h2 className="font-bold text-xl text-white">GECOM</h2>
        </div>
      </div>
      <div className="flex flex-1 flex-col overflow-auto py-2">
        <nav className="flex-1 px-2">
          {menuItems.map((item, idx) => (
            <div key={idx} className="mb-2">
              {item.path ? (
                <Link
                  to={item.path}
                  className={cn(
                    'flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors text-white',
                    location.pathname === item.path
                      ? 'bg-indigo-700'
                      : 'hover:bg-indigo-800'
                  )}
                >
                  {item.icon}
                  <span className="ml-3">{item.title}</span>
                </Link>
              ) : (
                <div className="space-y-1">
                  <div className="flex items-center rounded-md px-3 py-2 text-sm font-medium text-white">
                    {item.icon}
                    <span className="ml-3">{item.title}</span>
                  </div>
                  <div className="ml-4 space-y-1 group-data-[collapsible=icon]:hidden">
                    {item.submenu?.map((subItem, subIdx) => (
                      <Link
                        key={subIdx}
                        to={subItem.path}
                        className={cn(
                          'flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors text-white',
                          location.pathname === subItem.path
                            ? 'bg-indigo-700'
                            : 'hover:bg-indigo-800'
                        )}
                      >
                        {subItem.icon}
                        <span className="ml-3">{subItem.title}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>
      <div className="border-t border-indigo-800 p-4">
        <div className="flex items-center">
          <div className="ml-2">
            <p className="text-xs text-indigo-300">
              © 2023 GECOM
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
