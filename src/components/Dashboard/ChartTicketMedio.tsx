
import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
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
    { name: 'Administrativo', valor: dados.ticketMedioPorSetor['Administrativo'], color: '#f87171' },
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

  const renderCustomizedLabel = (props: any) => {
    const { x, y, value } = props;
    return (
      <text 
        x={x} 
        y={y - 10} 
        fill="#666" 
        textAnchor="middle" 
        dominantBaseline="middle"
        fontSize="12"
      >
        {formatCurrency(value)}
      </text>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ticket Médio por Secretária</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 30, right: 30, left: 20, bottom: 5 }}>
              <XAxis dataKey="name" />
              <YAxis hide />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="valor"
                stroke="#0ea5e9"
                strokeWidth={2}
                dot={{ r: 6 }}
                activeDot={{ r: 8 }}
                label={renderCustomizedLabel}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChartTicketMedio;
