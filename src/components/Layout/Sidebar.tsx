
import React from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { LayoutDashboard, FileText, Settings, ShoppingBag, Users, Building2, FileCheck } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  const sidebarItems = [
    { name: 'Dashboard', icon: <LayoutDashboard className="h-5 w-5" />, href: '/dashboard' },
    { name: 'Pedidos', icon: <ShoppingBag className="h-5 w-5" />, href: '/pedidos' },
    { name: 'Setores', icon: <Building2 className="h-5 w-5" />, href: '/setores' }
  ];

  if (!isOpen) return null;

  return (
    <aside className="fixed top-16 left-0 bottom-0 w-64 bg-white border-r shadow-sm z-40">
      <div className="p-4">
        <h2 className="text-sm font-semibold text-gray-500 mb-6 px-2">MENU</h2>
        
        <nav className="space-y-1">
          {sidebarItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  "flex items-center space-x-2 px-2 py-2 rounded-md transition-colors",
                  isActive
                    ? "bg-blue-50 text-blue-700 font-medium"
                    : "text-gray-700 hover:bg-gray-100"
                )
              }
            >
              {item.icon}
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
