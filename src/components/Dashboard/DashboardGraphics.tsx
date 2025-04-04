
import React from 'react';
import ChartPrevisoRealizado from '@/components/Dashboard/ChartPrevisoRealizado';
import ChartGastosPorSetor from '@/components/Dashboard/ChartGastosPorSetor';
import ChartPedidosPorSetor from '@/components/Dashboard/ChartPedidosPorSetor';
import ChartTicketMedio from '@/components/Dashboard/ChartTicketMedio';
import { DadosDashboard } from '@/types';

interface DashboardGraphicsProps {
  dados: DadosDashboard;
}

const DashboardGraphics: React.FC<DashboardGraphicsProps> = ({ dados }) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartPrevisoRealizado dados={dados} />
        <ChartGastosPorSetor dados={dados} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartPedidosPorSetor dados={dados} />
        <ChartTicketMedio dados={dados} />
      </div>
    </div>
  );
};

export default DashboardGraphics;
