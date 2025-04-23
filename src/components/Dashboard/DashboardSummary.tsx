
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DadosDashboard, Municipio } from '@/types';
import { formatCurrency } from '@/utils/formatters';
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
  const totalDFDs = Object.values(dadosDashboard.pedidosPorSetor || {}).reduce((sum, count) => sum + (count || 0), 0);
  const percentualOrcamento = ((dadosDashboard.gastosTotais / municipio.orcamentoAnual) * 100).toFixed(2);
  
  return (
    <>
      <Card className="border shadow-sm">
        <CardHeader className="border-b pb-3">
          <CardTitle className="text-xl">{language === 'pt' ? 'Resumo Financeiro' : 'Financial Summary'}</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="space-y-6">
            <div className="border rounded-md overflow-hidden shadow-sm">
              <table className="min-w-full divide-y divide-border">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      {language === 'pt' ? 'Métrica' : 'Metric'}
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      {language === 'pt' ? 'Valor' : 'Value'}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-background divide-y divide-border">
                  <tr>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium flex items-center">
                      <DollarSign className="h-4 w-4 mr-2 text-green-500" />
                      {language === 'pt' ? 'Orçamento Anual' : 'Annual Budget'}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-right font-medium">
                      {formatCurrency(municipio.orcamentoAnual)}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium flex items-center">
                      <DollarSign className="h-4 w-4 mr-2 text-blue-500" />
                      {language === 'pt' ? 'Gastos Totais' : 'Total Expenses'}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-right font-medium">
                      {formatCurrency(dadosDashboard.gastosTotais)}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium flex items-center">
                      <DollarSign className="h-4 w-4 mr-2 text-purple-500" />
                      {language === 'pt' ? 'Percentual do Orçamento Utilizado' : 'Budget Usage Percentage'}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-right font-medium">
                      {percentualOrcamento}%
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium flex items-center">
                      <DollarSign className="h-4 w-4 mr-2 text-yellow-500" />
                      {language === 'pt' ? 'Total de DFDs' : 'Total Purchase Orders'}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-right font-medium">
                      {totalDFDs}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="border shadow-sm">
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
