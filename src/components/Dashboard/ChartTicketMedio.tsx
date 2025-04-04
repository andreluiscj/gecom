
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '@/utils/formatters';

interface ChartTicketMedioProps {
  dados: {
    ticketMedioPorSetor: Record<string, number>;
  };
}

const ChartTicketMedio: React.FC<ChartTicketMedioProps> = ({ dados }) => {
  const [language, setLanguage] = useState('pt');
  
  useEffect(() => {
    const savedLanguage = localStorage.getItem('app-language');
    if (savedLanguage && (savedLanguage === 'pt' || savedLanguage === 'en')) {
      setLanguage(savedLanguage);
    }
  }, []);

  const chartData = Object.entries(dados.ticketMedioPorSetor).map(([setor, valor]) => ({
    name: setor,
    valor: valor,
  }));

  const cardTitle = language === 'pt' ? 'Ticket Médio por Secretaria' : 'Average Ticket by Department';
  const mediaGeral = chartData.length > 0 
    ? chartData.reduce((sum, item) => sum + item.valor, 0) / chartData.length 
    : 0;

  // Custom colors
  const COLORS = {
    'Saúde': '#ef4444',
    'Educação': '#10b981',
    'Administrativo': '#f59e0b',
    'Transporte': '#f97316'
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border border-border p-3 rounded-md shadow-lg">
          <p className="font-semibold text-base">{payload[0].payload.name}</p>
          <p className="text-sm">
            {language === 'pt' ? 'Valor Médio' : 'Average Value'}: {formatCurrency(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  // Show empty state when there's no data with values
  const hasData = chartData.some(item => item.valor > 0);
  
  if (!hasData) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-md font-semibold">{cardTitle}</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px] flex flex-col items-center justify-center">
          <p className="text-muted-foreground text-center">
            {language === 'pt' ? 'Não há dados disponíveis' : 'No data available'}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-md font-semibold">{cardTitle}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="aspect-[1.5] h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false}
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tickFormatter={(value) => formatCurrency(value)}
                width={80}
                tick={{ fontSize: 12 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                formatter={(value: string) => language === 'pt' ? 'Valor Médio' : 'Average Value'}
              />
              <Bar 
                dataKey="valor" 
                name={language === 'pt' ? 'Valor Médio' : 'Average Value'}
                radius={[4, 4, 0, 0]} // Rounded corners on top
              >
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[entry.name as keyof typeof COLORS]} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-2 text-center">
          <p className="text-sm text-muted-foreground">
            {language === 'pt' ? 'Média Geral' : 'General Average'}: <span className="font-semibold">{formatCurrency(mediaGeral)}</span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChartTicketMedio;
