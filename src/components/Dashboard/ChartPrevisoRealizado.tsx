
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, LabelList } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DadosDashboard } from '@/types';
import { formatCurrency } from '@/utils/formatters';

interface ChartPrevisoRealizadoProps {
  dados: DadosDashboard;
}

const ChartPrevisoRealizado: React.FC<ChartPrevisoRealizadoProps> = ({ dados }) => {
  const data = [
    {
      name: 'Saúde',
      Previsto: dados.orcamentoPrevisto['Saúde'],
      Realizado: dados.gastosPorSetor['Saúde'],
    },
    {
      name: 'Educação',
      Previsto: dados.orcamentoPrevisto['Educação'],
      Realizado: dados.gastosPorSetor['Educação'],
    },
    {
      name: 'Administrativo',
      Previsto: dados.orcamentoPrevisto['Administrativo'],
      Realizado: dados.gastosPorSetor['Administrativo'],
    },
    {
      name: 'Transporte',
      Previsto: dados.orcamentoPrevisto['Transporte'],
      Realizado: dados.gastosPorSetor['Transporte'],
    },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background p-3 shadow-lg border rounded-lg">
          <p className="font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={`tooltip-${index}`} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const formatLabel = (value: number) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(0)}k`;
    }
    return value;
  };

  return (
    <Card className="shadow-card hover:shadow-card-hover transition-shadow duration-300">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold flex items-center">
          Previsto vs Realizado
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              barGap={-30} 
            >
              <XAxis dataKey="name" />
              <YAxis hide />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="Previsto" fill="#e2e8f0" radius={[4, 4, 0, 0]} barSize={55}>
                <LabelList dataKey="Previsto" position="top" formatter={formatLabel} />
              </Bar>
              <Bar dataKey="Realizado" fill="#60a5fa" radius={[4, 4, 0, 0]} barSize={35}>
                <LabelList dataKey="Realizado" position="center" fill="#fff" formatter={formatLabel} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChartPrevisoRealizado;
