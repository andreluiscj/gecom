
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DadosDashboard } from '@/types';
import { formatCurrency } from '@/utils/formatters';

interface ChartGastosPorSetorProps {
  dados: DadosDashboard;
}

const ChartGastosPorSetor: React.FC<ChartGastosPorSetorProps> = ({ dados }) => {
  const COLORS = ['#0ea5e9', '#22c55e', '#f87171', '#f97316'];

  const data = [
    { name: 'Saúde', value: dados.gastosPorSetor['Saúde'] },
    { name: 'Educação', value: dados.gastosPorSetor['Educação'] },
    { name: 'Administrativo', value: dados.gastosPorSetor['Administrativo'] },
    { name: 'Transporte', value: dados.gastosPorSetor['Transporte'] },
  ];

  const renderCustomizedLabel = ({ name, value, percent }: any) => {
    return `${name}: ${(percent * 100).toFixed(1)}%`;
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background p-3 shadow-lg border rounded-md">
          <p className="font-medium">{payload[0].name}</p>
          <p className="text-sm">{formatCurrency(payload[0].value)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gastos por Secretária</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChartGastosPorSetor;
