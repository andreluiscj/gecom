
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  Settings,
  Building,
  BarChart
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
}

interface SidebarItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ to, icon, label }) => {
  const location = useLocation();
  const isActive = location.pathname === to || location.pathname.startsWith(`${to}/`);

  return (
    <NavLink
      to={to}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
        isActive 
          ? "bg-blue-50 text-blue-700 font-medium" 
          : "text-gray-600 hover:bg-blue-50 hover:text-blue-700"
      )}
    >
      <span className="flex-shrink-0">{icon}</span>
      <span className="truncate">{label}</span>
    </NavLink>
  );
};

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  return (
    <aside className={cn(
      "fixed left-0 top-0 z-20 flex h-full w-64 flex-col bg-white shadow-lg pt-16 transition-transform duration-300",
      isOpen ? "translate-x-0" : "-translate-x-full"
    )}>
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-2">
        <SidebarItem 
          to="/dashboard" 
          icon={<LayoutDashboard className="h-4 w-4" />} 
          label="Dashboard" 
        />
        <SidebarItem 
          to="/pedidos" 
          icon={<FileText className="h-4 w-4" />} 
          label="Pedidos de Compra" 
        />
        <SidebarItem 
          to="/funcionarios" 
          icon={<Users className="h-4 w-4" />} 
          label="Funcionários" 
        />
        <SidebarItem 
          to="/setores" 
          icon={<Building className="h-4 w-4" />} 
          label="Setores" 
        />
        <SidebarItem 
          to="/relatorios" 
          icon={<BarChart className="h-4 w-4" />} 
          label="Relatórios" 
        />
        <SidebarItem 
          to="/configuracoes" 
          icon={<Settings className="h-4 w-4" />} 
          label="Configurações" 
        />
      </div>
    </aside>
  );
};

export default Sidebar;
