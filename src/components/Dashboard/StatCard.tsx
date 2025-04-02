
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowDown, ArrowUp, Wallet, LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  percentChange?: number;
  icon?: LucideIcon; // Changed from string to LucideIcon type
  colorClass?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  percentChange = 0,
  icon: Icon = Wallet, // Default to Wallet icon
  colorClass = 'bg-blue-500',
}) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center">
          <div
            className={cn(
              'flex h-12 w-12 items-center justify-center rounded-lg',
              colorClass
            )}
          >
            {/* Use the Icon directly as a component */}
            <Icon className="h-6 w-6 text-white" />
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
            {Math.abs(percentChange)}%
          </span>
          <span className="ml-2 text-muted-foreground">do mês passado</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;
