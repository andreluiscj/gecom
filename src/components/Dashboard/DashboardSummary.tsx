
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DadosDashboard } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { BarChart, Building2, Users, Wallet, TrendingUp, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';

interface DashboardSummaryProps {
  data: DadosDashboard;
}

const DashboardSummary: React.FC<DashboardSummaryProps> = ({ data }) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {data.cartoes.map((cartao, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              {cartao.titulo}
            </CardTitle>
            {getIcon(cartao.icon)}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {typeof cartao.valor === 'number' 
                ? formatCurrency(cartao.valor) 
                : cartao.valor}
            </div>
            <p className="flex items-center text-xs text-muted-foreground mt-1">
              {cartao.percentual_mudanca > 0 ? (
                <>
                  <ArrowUpCircle className="mr-1 h-3 w-3 text-green-500" />
                  <span className="text-green-500">{cartao.percentual_mudanca}% de aumento</span>
                </>
              ) : cartao.percentual_mudanca < 0 ? (
                <>
                  <ArrowDownCircle className="mr-1 h-3 w-3 text-red-500" />
                  <span className="text-red-500">{Math.abs(cartao.percentual_mudanca)}% de redução</span>
                </>
              ) : (
                <span>Sem alteração</span>
              )}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

function getIcon(iconName: string) {
  switch (iconName) {
    case 'bar-chart':
      return <BarChart className="h-4 w-4 text-blue-600" />;
    case 'building':
      return <Building2 className="h-4 w-4 text-blue-600" />;
    case 'users':
      return <Users className="h-4 w-4 text-blue-600" />;
    case 'wallet':
      return <Wallet className="h-4 w-4 text-blue-600" />;
    case 'trending-up':
      return <TrendingUp className="h-4 w-4 text-blue-600" />;
    default:
      return <BarChart className="h-4 w-4 text-blue-600" />;
  }
}

export default DashboardSummary;
