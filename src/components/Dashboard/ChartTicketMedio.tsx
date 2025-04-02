
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
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

  const cardTitle = language === 'pt' ? 'Ticket Médio por Secretária' : 'Average Ticket by Department';
  const mediaGeral = chartData.reduce((sum, item) => sum + item.valor, 0) / chartData.length;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-md font-semibold">{cardTitle}</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={{}} className="aspect-[1.5] h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorTicket" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="rgba(var(--chart-color-success), 0.8)" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="rgba(var(--chart-color-success), 0.2)" stopOpacity={0} />
                </linearGradient>
              </defs>
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
              <ChartTooltip 
                content={
                  <ChartTooltipContent 
                    formatter={(value: any) => formatCurrency(value)}
                  />
                }
              />
              <Legend 
                formatter={(value: string) => language === 'pt' ? 'Valor Médio' : 'Average Value'}
              />
              <Area 
                type="monotone" 
                dataKey="valor" 
                name={language === 'pt' ? 'Valor Médio' : 'Average Value'} 
                stroke="rgba(var(--chart-color-success), 1)" 
                fillOpacity={1} 
                fill="url(#colorTicket)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
        
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
