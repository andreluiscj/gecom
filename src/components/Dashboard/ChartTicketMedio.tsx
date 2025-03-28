
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DadosDashboard } from '@/types';
import { formatCurrency } from '@/utils/formatters';

interface ChartTicketMedioProps {
  dados: DadosDashboard;
}

const ChartTicketMedio: React.FC<ChartTicketMedioProps> = ({ dados }) => {
  const data = [
    { name: 'Saúde', valor: dados.ticketMedioPorSetor['Saúde'], color: '#0ea5e9' },
    { name: 'Educação', valor: dados.ticketMedioPorSetor['Educação'], color: '#22c55e' },
    { name: 'Administrativo', valor: dados.ticketMedioPorSetor['Administrativo'], color: '#8b5cf6' },
    { name: 'Transporte', valor: dados.ticketMedioPorSetor['Transporte'], color: '#f97316' },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background p-3 shadow-lg border rounded-md">
          <p className="font-medium">{label}</p>
          <p className="text-sm">Ticket Médio: {formatCurrency(payload[0].value)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ticket Médio por Setor</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="valor"
                stroke="#0ea5e9"
                strokeWidth={2}
                dot={{ r: 6 }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChartTicketMedio;
