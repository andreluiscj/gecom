
import React from 'react';
import ChartGastosPorSetor from '@/components/Dashboard/ChartGastosPorSetor';
import ChartPedidosPorSetor from '@/components/Dashboard/ChartPedidosPorSetor';
import ChartPrevisoRealizado from '@/components/Dashboard/ChartPrevisoRealizado';
import ChartTicketMedio from '@/components/Dashboard/ChartTicketMedio';

interface ReportChartsProps {
  tiposRelatorio: string[];
  dadosDashboard: any;
}

const ReportCharts: React.FC<ReportChartsProps> = ({ tiposRelatorio, dadosDashboard }) => {
  return (
    <div className="space-y-6">
      {(tiposRelatorio.includes('geral') || tiposRelatorio.includes('orcamento')) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartPrevisoRealizado dados={dadosDashboard} />
          <ChartGastosPorSetor dados={dadosDashboard} />
        </div>
      )}
      
      {(tiposRelatorio.includes('geral') || tiposRelatorio.includes('pedidos')) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartPedidosPorSetor dados={dadosDashboard} />
          <ChartTicketMedio dados={dadosDashboard} />
        </div>
      )}
    </div>
  );
};

export default ReportCharts;
