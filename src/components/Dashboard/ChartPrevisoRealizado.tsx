
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
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
        <div className="bg-background p-3 shadow-lg border rounded-md">
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Previsto vs Realizado</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="Previsto" fill="#64748b" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Realizado" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChartPrevisoRealizado;
