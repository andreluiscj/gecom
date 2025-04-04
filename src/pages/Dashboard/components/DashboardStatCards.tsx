
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowDown, ArrowUp, ShoppingCart, Wallet, Receipt, Building, CheckCircle, TrendingUp, LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CardData {
  titulo: string;
  valor: string | number;
  percentualMudanca: number;
  icon: string;
  classeCor: string;
}

interface DashboardStatCardsProps {
  cartoes: CardData[];
}

const DashboardStatCards: React.FC<DashboardStatCardsProps> = ({ cartoes }) => {
  // Função para renderizar o ícone baseado no nome
  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'ShoppingCart':
        return <ShoppingCart className="h-5 w-5 text-white" />;
      case 'Wallet':
        return <Wallet className="h-5 w-5 text-white" />;
      case 'Receipt':
        return <Receipt className="h-5 w-5 text-white" />;
      case 'Building':
        return <Building className="h-5 w-5 text-white" />;
      case 'CheckCircle':
        return <CheckCircle className="h-5 w-5 text-white" />;
      case 'TrendingUp':
        return <TrendingUp className="h-5 w-5 text-white" />;
      default:
        return <ShoppingCart className="h-5 w-5 text-white" />;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cartoes.map((card, index) => (
        <Card key={index} className="border shadow-sm hover:shadow-md transition-shadow duration-300">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div
                className={cn(
                  'flex h-10 w-10 items-center justify-center rounded-lg shadow-sm',
                  card.classeCor
                )}
              >
                {renderIcon(card.icon)}
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-muted-foreground">{card.titulo}</p>
                <h3 className="mt-1 text-2xl font-semibold">{card.valor}</h3>
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              {card.percentualMudanca > 0 ? (
                <ArrowUp className="h-4 w-4 text-green-500" />
              ) : (
                <ArrowDown className="h-4 w-4 text-red-500" />
              )}
              <span
                className={cn(
                  'ml-1 font-medium',
                  card.percentualMudanca > 0 ? 'text-green-500' : 'text-red-500'
                )}
              >
                {Math.abs(card.percentualMudanca)}%
              </span>
              <span className="ml-2 text-muted-foreground">do mês passado</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DashboardStatCards;
