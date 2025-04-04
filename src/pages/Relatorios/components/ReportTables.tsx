
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface ReportTablesProps {
  tiposRelatorio: string[];
  dadosDashboard: any;
  translations: Record<string, string>;
}

const ReportTables: React.FC<ReportTablesProps> = ({ tiposRelatorio, dadosDashboard, translations }) => {
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
                    {Object.entries(dadosDashboard.gastosPorSetor).map(([setor, valor], index) => (
                      <tr key={index}>
                        <td className="px-4 py-2 whitespace-nowrap text-sm font-medium">
                          {setor}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-right">
                          R$ {dadosDashboard.orcamentoPrevisto[setor as keyof typeof dadosDashboard.orcamentoPrevisto].toLocaleString('pt-BR')}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-right">
                          R$ {(valor as number).toLocaleString('pt-BR')}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-right">
                          {(((valor as number) / dadosDashboard.orcamentoPrevisto[setor as keyof typeof dadosDashboard.orcamentoPrevisto]) * 100).toFixed(2)}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-muted">
                    <tr>
                      <th className="px-4 py-2 text-left text-sm font-medium">
                        {translations.total}
                      </th>
                      <th className="px-4 py-2 text-right text-sm font-medium">
                        R$ {Object.values(dadosDashboard.orcamentoPrevisto).reduce((a: number, b: number) => a + b, 0).toLocaleString('pt-BR')}
                      </th>
                      <th className="px-4 py-2 text-right text-sm font-medium">
                        R$ {dadosDashboard.gastosTotais.toLocaleString('pt-BR')}
                      </th>
                      <th className="px-4 py-2 text-right text-sm font-medium">
                        {((dadosDashboard.gastosTotais / (Object.values(dadosDashboard.orcamentoPrevisto).reduce((a: number, b: number) => a + b, 0) as number)) * 100).toFixed(2)}%
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
                      {Object.entries(dadosDashboard.pedidosPorSetor).map(([setor, quantidade], index) => (
                        <tr key={index}>
                          <td className="px-4 py-2 whitespace-nowrap text-sm font-medium">
                            {setor}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-right">
                            {quantidade as number}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-right">
                            R$ {dadosDashboard.gastosPorSetor[setor as keyof typeof dadosDashboard.gastosPorSetor].toLocaleString('pt-BR')}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-right">
                            R$ {dadosDashboard.ticketMedioPorSetor[setor as keyof typeof dadosDashboard.ticketMedioPorSetor].toLocaleString('pt-BR')}
                          </td>
                        </tr>
                      ))}
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
