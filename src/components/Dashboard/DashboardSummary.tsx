
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DadosDashboard, Municipio } from '@/types';

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
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{language === 'pt' ? 'Resumo Financeiro' : 'Financial Summary'}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border rounded-md overflow-hidden">
              <table className="min-w-full divide-y divide-border">
                <thead className="bg-muted">
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
                    <td className="px-4 py-2 whitespace-nowrap text-sm font-medium">
                      {language === 'pt' ? 'Orçamento Anual' : 'Annual Budget'}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-right">
                      R$ {municipio.orcamentoAnual.toLocaleString('pt-BR')}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 whitespace-nowrap text-sm font-medium">
                      {language === 'pt' ? 'Gastos Totais' : 'Total Expenses'}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-right">
                      R$ {dadosDashboard.gastosTotais.toLocaleString('pt-BR')}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 whitespace-nowrap text-sm font-medium">
                      {language === 'pt' ? 'Percentual do Orçamento Utilizado' : 'Budget Usage Percentage'}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-right">
                      {((dadosDashboard.gastosTotais / municipio.orcamentoAnual) * 100).toFixed(2)}%
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 whitespace-nowrap text-sm font-medium">
                      {language === 'pt' ? 'Total de DFDs' : 'Total Purchase Orders'}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-right">
                      {Object.values(dadosDashboard.pedidosPorSetor).reduce((sum, count) => sum + count, 0)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{language === 'pt' ? 'Informações do Município' : 'Municipality Information'}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">{language === 'pt' ? 'Nome' : 'Name'}</p>
              <p className="font-medium">{municipio.nome}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">{language === 'pt' ? 'Estado' : 'State'}</p>
              <p className="font-medium">{municipio.estado}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">{language === 'pt' ? 'População' : 'Population'}</p>
              <p className="font-medium">{municipio.populacao.toLocaleString('pt-BR')}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">{language === 'pt' ? 'Prefeito' : 'Mayor'}</p>
              <p className="font-medium">{municipio.prefeito}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default DashboardSummary;
