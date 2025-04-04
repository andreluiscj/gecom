
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { formatCurrency, formatPercentage } from '@/utils/formatters';

interface ReportTablesProps {
  tiposRelatorio: string[];
  dadosDashboard: any;
  translations: Record<string, string>;
}

const ReportTables: React.FC<ReportTablesProps> = ({ tiposRelatorio, dadosDashboard, translations }) => {
  // Calculate total budget safely
  const calculateTotalBudget = (): number => {
    if (!dadosDashboard?.orcamentoPrevisto) return 0;
    return Object.values(dadosDashboard.orcamentoPrevisto).reduce((a: number, b: number) => a + Number(b), 0);
  };

  // Get total budget
  const totalBudget = calculateTotalBudget();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{translations.detailed_report}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {(tiposRelatorio.includes('geral') || tiposRelatorio.includes('gastos') || tiposRelatorio.includes('orcamento')) && (
            <div>
              <h3 className="text-lg font-medium mb-2">{translations.expenses_by_dept}</h3>
              <div className="border rounded-md overflow-hidden">
                <table className="min-w-full divide-y divide-border">
                  <thead className="bg-muted">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        {translations.department}
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        {translations.planned_budget}
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        {translations.actual_expenses}
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        {translations.used_percentage}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-background divide-y divide-border">
                    {Object.entries(dadosDashboard.gastosPorSetor).map(([setor, valor], index) => {
                      const valorNumerico = Number(valor);
                      const orcamento = Number(dadosDashboard.orcamentoPrevisto[setor as keyof typeof dadosDashboard.orcamentoPrevisto] || 0);
                      const percentualUsado = orcamento > 0 ? (valorNumerico / orcamento * 100) : 0;
                      
                      return (
                        <tr key={index}>
                          <td className="px-4 py-2 whitespace-nowrap text-sm font-medium">
                            {setor}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-right">
                            {formatCurrency(orcamento)}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-right">
                            {formatCurrency(valorNumerico)}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-right">
                            {formatPercentage(percentualUsado)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot className="bg-muted">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium">
                        {translations.total}
                      </th>
                      <th className="px-4 py-3 text-right text-sm font-medium">
                        {formatCurrency(totalBudget)}
                      </th>
                      <th className="px-4 py-3 text-right text-sm font-medium">
                        {formatCurrency(Number(dadosDashboard.gastosTotais || 0))}
                      </th>
                      <th className="px-4 py-3 text-right text-sm font-medium">
                        {formatPercentage(totalBudget > 0 ? (Number(dadosDashboard.gastosTotais || 0) / totalBudget * 100) : 0)}
                      </th>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          )}
          
          {(tiposRelatorio.includes('geral') || tiposRelatorio.includes('pedidos')) && (
            <>
              <Separator />
              
              <div>
                <h3 className="text-lg font-medium mb-2">{translations.dfds_by_dept}</h3>
                <div className="border rounded-md overflow-hidden">
                  <table className="min-w-full divide-y divide-border">
                    <thead className="bg-muted">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          {translations.department}
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          {translations.num_dfds}
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          {translations.total_value}
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          {translations.avg_ticket}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-background divide-y divide-border">
                      {Object.entries(dadosDashboard.pedidosPorSetor).map(([setor, quantidade], index) => {
                        const quantidadeNumerica = Number(quantidade);
                        const gastoTotal = Number(dadosDashboard.gastosPorSetor[setor as keyof typeof dadosDashboard.gastosPorSetor] || 0);
                        const ticketMedio = quantidadeNumerica > 0 ? gastoTotal / quantidadeNumerica : 0;
                        
                        return (
                          <tr key={index}>
                            <td className="px-4 py-2 whitespace-nowrap text-sm font-medium">
                              {setor}
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm text-right">
                              {quantidadeNumerica}
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm text-right">
                              {formatCurrency(gastoTotal)}
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm text-right">
                              {formatCurrency(ticketMedio)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ReportTables;
