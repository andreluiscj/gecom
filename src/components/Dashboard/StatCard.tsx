
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowDown, ArrowUp, Wallet, Building, ShoppingCart, Receipt, LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatPercentage } from '@/utils/formatters';

interface StatCardProps {
  title: string;
  value: string | number;
  percentChange?: number;
  icon: string | LucideIcon;
  colorClass?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  percentChange = 0,
  icon,
  colorClass = 'bg-blue-500',
}) => {
  // Function to render the icon based on string or component
  const renderIcon = () => {
    if (typeof icon === 'string') {
      switch (icon) {
        case 'Building':
          return <Building className="h-4 w-4 text-white" />;
        case 'Wallet':
          return <Wallet className="h-4 w-4 text-white" />;
        case 'ShoppingCart':
          return <ShoppingCart className="h-4 w-4 text-white" />;
        case 'Receipt':
          return <Receipt className="h-4 w-4 text-white" />;
        default:
          return <Wallet className="h-4 w-4 text-white" />;
      }
    } else {
      const Icon = icon;
      return <Icon className="h-4 w-4 text-white" />;
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center">
          <div
            className={cn(
              'flex h-7 w-7 items-center justify-center rounded-lg',
              colorClass
            )}
          >
            {renderIcon()}
          </div>
          <div className="ml-4 flex-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <h3 className="mt-1 text-2xl font-semibold">{value}</h3>
          </div>
        </div>
        <div className="mt-4 flex items-center text-sm">
          {percentChange > 0 ? (
            <ArrowUp className="h-4 w-4 text-green-500" />
          ) : (
            <ArrowDown className="h-4 w-4 text-red-500" />
          )}
          <span
            className={cn(
              'ml-1 font-medium',
              percentChange > 0 ? 'text-green-500' : 'text-red-500'
            )}
          >
            {typeof percentChange === 'number' ? Math.abs(parseFloat(percentChange.toFixed(1))) : 0}%
          </span>
          <span className="ml-2 text-muted-foreground">do mês passado</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;
