
import React from 'react';
import StatCard from '@/components/Dashboard/StatCard';
import { EstatisticaCartao } from '@/types';
import { Building, Wallet, ShoppingCart, Receipt, LucideIcon } from 'lucide-react';

interface DashboardStatsProps {
  estatisticasCartoes: EstatisticaCartao[];
}

// Map of string icon names to actual Lucide components
const iconMap: Record<string, LucideIcon> = {
  'Building': Building,
  'Wallet': Wallet,
  'ShoppingCart': ShoppingCart,
  'Receipt': Receipt
};

// Function to map string icon names to actual Lucide components
const getLucideIcon = (iconName: string): LucideIcon => {
  return iconMap[iconName] || Building; // Default to Building if icon not found
};

const DashboardStats: React.FC<DashboardStatsProps> = ({ estatisticasCartoes }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {estatisticasCartoes.map((stat, index) => (
        <StatCard
          key={index}
          title={stat.titulo}
          value={stat.valor}
          percentChange={parseFloat(stat.percentualMudanca.toFixed(1))}
          icon={getLucideIcon(stat.icon)}
          colorClass={stat.cor}
        />
      ))}
    </div>
  );
};

export default DashboardStats;
