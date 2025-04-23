
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Municipio, DadosDashboard } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { Building, Users, Crown, DollarSign } from 'lucide-react';

interface DashboardSummaryProps {
  dadosDashboard: DadosDashboard;
  municipio: Municipio;
  language: string;
}

const DashboardSummary: React.FC<DashboardSummaryProps> = ({
  dadosDashboard,
  municipio,
  language
}) => {
  // Calcular a porcentagem de despesas homologadas em relação ao orçamento estimado
  const percentualOrcamento = ((dadosDashboard.valor_contratado_total / municipio.orcamento_anual) * 100).toFixed(2);
  
  return (
    <>
      <Card className="border shadow-sm hover:shadow-md transition-all">
        <CardHeader className="border-b pb-3">
          <CardTitle className="text-xl">{language === 'pt' ? 'Resumo Financeiro' : 'Financial Summary'}</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="space-y-6">
            <div className="border rounded-md overflow-hidden shadow-sm">
              <table className="min-w-full divide-y divide-border">
                <thead className="bg-blue-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">
                      {language === 'pt' ? 'Métrica' : 'Metric'}
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-blue-800 uppercase tracking-wider">
                      {language === 'pt' ? 'Valor' : 'Value'}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-background divide-y divide-border">
                  <tr>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium flex items-center">
                      <DollarSign className="h-4 w-4 mr-2 text-green-500" />
                      Estimativa de Despesa
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-right font-medium">
                      {formatCurrency(municipio.orcamento_anual)}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium flex items-center">
                      <DollarSign className="h-4 w-4 mr-2 text-blue-500" />
                      Valor Contratado
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-right font-medium">
                      {formatCurrency(dadosDashboard.valor_contratado_total)}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium flex items-center">
                      <DollarSign className="h-4 w-4 mr-2 text-purple-500" />
                      Diferença
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-right font-medium">
                      {formatCurrency(municipio.orcamento_anual - dadosDashboard.valor_contratado_total)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="border shadow-sm hover:shadow-md transition-all">
        <CardHeader className="border-b pb-3">
          <CardTitle className="text-xl">{language === 'pt' ? 'Informações do Município' : 'Municipality Information'}</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Building className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{language === 'pt' ? 'Nome' : 'Name'}</p>
                <p className="font-medium">{municipio.nome}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <Building className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{language === 'pt' ? 'Estado' : 'State'}</p>
                <p className="font-medium">{municipio.estado}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Users className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{language === 'pt' ? 'População' : 'Population'}</p>
                <p className="font-medium">{municipio.populacao.toLocaleString('pt-BR')} habitantes</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-amber-100 rounded-lg">
                <Crown className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{language === 'pt' ? 'Prefeito' : 'Mayor'}</p>
                <p className="font-medium">{municipio.prefeito}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default DashboardSummary;
