
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DadosDashboard } from '@/types';

interface ChartPedidosPorSetorProps {
  dados: DadosDashboard;
}

const ChartPedidosPorSetor: React.FC<ChartPedidosPorSetorProps> = ({ dados }) => {
  const data = [
    { name: 'Saúde', pedidos: dados.pedidosPorSetor['Saúde'], fill: '#ffffff' },
    { name: 'Educação', pedidos: dados.pedidosPorSetor['Educação'], fill: '#ffffff' },
    { name: 'Administrativo', pedidos: dados.pedidosPorSetor['Administrativo'], fill: '#ffffff' },
    { name: 'Transporte', pedidos: dados.pedidosPorSetor['Transporte'], fill: '#ffffff' },
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
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="pedidos" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChartPedidosPorSetor;
