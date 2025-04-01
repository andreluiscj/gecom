
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DadosDashboard } from '@/types';

interface ChartPedidosPorSetorProps {
  dados: DadosDashboard;
}

const ChartPedidosPorSetor: React.FC<ChartPedidosPorSetorProps> = ({ dados }) => {
  const COLORS = ['#0ea5e9', '#22c55e', '#f87171', '#f97316'];
  
  const data = [
    { name: 'Saúde', pedidos: dados.pedidosPorSetor['Saúde'], fill: COLORS[0] },
    { name: 'Educação', pedidos: dados.pedidosPorSetor['Educação'], fill: COLORS[1] },
    { name: 'Administrativo', pedidos: dados.pedidosPorSetor['Administrativo'], fill: COLORS[2] },
    { name: 'Transporte', pedidos: dados.pedidosPorSetor['Transporte'], fill: COLORS[3] },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background p-3 shadow-lg border rounded-md">
          <p className="font-medium">{label}</p>
          <p className="text-sm">Pedidos: {payload[0].value}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pedidos por Secretária</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <XAxis dataKey="name" />
              <YAxis hide />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="pedidos" radius={[4, 4, 0, 0]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill || COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChartPedidosPorSetor;
